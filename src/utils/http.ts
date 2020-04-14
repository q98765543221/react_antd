import http from 'axios';
import consts from '../consts';
import { eq } from './mix';
import { apiPrefix } from '../config';

const instance = http.create();
const location = window['location'];

let uuid = '';

const setUuid = (id: string) => {
  uuid = id;
}

instance.interceptors.request.use(
  config => {
    config.url = apiPrefix + config.url;
    config.headers.uuid = uuid;
    return config;
  },
  err => {

  }
);

instance.interceptors.response.use(
  (res) => {
    const { data, config } = res;
    const { result } = data;
    const { responseType } = config;
    if (eq(res.status, 200)) {
      if (eq(responseType, 'blob')) {
        return res;
      } else if (eq(result, 0)) {
        return data;
      }
    }

    console.error('request fail', res);
    if (result  < 0 ) {
      const url = location.href;
      if (!url.includes('/login')) {
        location.href = '/login';
      }
    }
    return Promise.reject(res);

  },
  (err) => {
    return Promise.reject(err);
  }
);


const upload = http.create({});

upload.interceptors.request.use(
  config => {
    config.url = apiPrefix + config.url;
    config.headers = {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    }
    return config;
  },
  err => {

  }
);

upload.interceptors.response.use(
  (res) => {
    const { data } = res;
    const { code } = data;
    if (eq(code, consts.http_code.success) && eq(res.status, 200)) {
      return data;
    } else {
      console.error('request fail', res);
      if (eq(code, consts.http_code.unanthent)) {
        const url = location.href;
        if (!url.includes('/login')) {
          location.href = '/login';
        }
      }
      return Promise.reject(res);
    }
  },
  (err) => {
    return Promise.reject(err);
  }
);

const formatDataHeader = {
  'Content-Type': 'multipart/form-data;charset=UTF-8'
};

/**
 * @desc 采用formData形式进行表单提交
 * @param url 
 * @param data 数据json格式
 * @param arrayField // 文件列表的字段
 */
const formHttp = (url: string, data: Object = {}) => {
  const formData = new FormData();
  Object.keys(data).map(x => {
    if (data.hasOwnProperty(x)) {
      const value = data[x];
      if (Array.isArray(value)) {
        value.map(v => {
          formData.append(x, v);
        });
      } else {
        formData.append(x, value);
      }
    }
  })
  return instance.post(url, formData, { headers: formatDataHeader });
}

export { instance as http, setUuid, upload, formHttp, formatDataHeader };


