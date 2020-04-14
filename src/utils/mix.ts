import { toJS } from 'mobx';
import moment, { Moment, DurationInputArg2 } from 'moment';
import consts from "../consts";
import { http } from ".";

export const addSpaces = (strArr: (string | number)[]) => {
  return strArr.join(' ');
}

type ItemType = 'str' | 'bool' | 'obj';
type storageValue = { [key: string]: any } | string | boolean;

// export const Proxy = ProxyPolyfillFun();

class MyStorage {
  constructor(storage: Storage) {
    this.storage = storage;
  }
  storage: Storage;

  setItem(key: string, value: storageValue, type: ItemType = 'str') {
    let transformValue: any;
    if (type === 'str') {
      transformValue = value;
    } else if (type === 'bool') {
      transformValue = value.toString();
    } else if (type === 'obj') {
      transformValue = JSON.stringify(value);
    }
    this.storage.setItem(key, transformValue);
  }

  getItem<T>(key: string, type: ItemType = 'str') {
    const value = this.storage.getItem(key);
    let result: storageValue = '';
    if (value) {
      // return type === 'str' ? value : JSON.parse(value);
      if (type === 'str') {
        result = value;
      } else if (type === 'bool') {
        result = eq(value, 'true') ? true : false;
      } else if (type === 'obj') {
        result = JSON.parse(value);
      }
    }
    return result as T;
  }

  removeItem(key: string) {
    this.storage.removeItem(key);
  }

  clear() {
    this.storage.clear();
  }
}
export const mySessionStorage = new MyStorage(sessionStorage);
export const myLocalStorage = new MyStorage(localStorage);


export const eq = <T>(a: T, b: T): boolean => {
  return a === b;
}
export const eqByToJS: <T>(a: T, b: T) => boolean = (a, b) => {
  return toJS(a) === b;
}

export const isUndefinded = (value: any) => {
  return typeof value === 'undefined';
}
export const emptyFunc = () => { };
export const emptyEventFunc = () => { };

export const getDefault: <T>(value: T, defaultValue: T) => T = (value, defaultValue) => {
  return (value === undefined || value === null) ? defaultValue : value;
}


export const isDefaultEmptyStr = (str: any) => {
  return eq(str, consts.defaultEmptyStr);
}

export function captureVideoFrame(video, format) {
  if (typeof video === 'string') {
    video = document.getElementById(video);
  }

  format = format || 'jpeg';

  if (!video || (format !== 'png' && format !== 'jpeg')) {
    return false;
  }

  var canvas = document.createElement("CANVAS") as HTMLCanvasElement;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  canvas.getContext('2d')!.drawImage(video, 0, 0);

  var dataUri = canvas.toDataURL('image/' + format);
  var data = dataUri.split(',')[1];
  var mimeType = dataUri.split(';')[0].slice(5)

  var bytes = window.atob(data);
  var buf = new ArrayBuffer(bytes.length);
  var arr = new Uint8Array(buf);

  for (var i = 0; i < bytes.length; i++) {
    arr[i] = bytes.charCodeAt(i);
  }

  var blob = new Blob([arr], { type: mimeType });
  return { blob: blob, dataUri: dataUri, format: format };
};

export function captureVideoFrame2(video: HTMLVideoElement) {
  const canvas = document.createElement("CANVAS") as HTMLCanvasElement;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  canvas.getContext('2d')!.drawImage(video, 0, 0);
  const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
  return image;
};


export const timeFormatStrs = {
  1: 'YYYY-MM-DD HH:mm:ss',
  2: 'YYYY-MM-DD',
  3: 'HH:mm:ss',
  4: 'MM-DD',
  5: 'YYYY-MM',
}
export const timeFormatDefaultStr = timeFormatStrs[1];
export const formatTime = (time: number | Moment, type: number) => {
  let newTime: Moment;
  if (typeof time === 'number') {
    newTime = moment(time);
  } else {
    newTime = time;
  }
  return newTime.format(timeFormatStrs[type]);
}

export const operateTime = (time: number | string | Moment, operate: 'add' | 'subtract',
  amount: number, unit: DurationInputArg2, format = 1) => {
  if (!time) { return '' }
  let momentTime: Moment;
  if (typeof time === 'object') {
    momentTime = time;
  } else {
    momentTime = moment(time);
  }
  const newTime = momentTime[operate](amount, unit);
  return newTime.format(timeFormatStrs[format]);
}

export const isStrEmpty = (str: string) => {
  return !str.trim().length;
}

export const showLonLat = (lon: number, lat: number) => {
  let str = '';
  if (lon && lat) {
    str = lon.toFixed(6) + ', ' + lat.toFixed(6);
  }
  return str;
}


/**
 * 判断元素是否可见
 * @param {Object} elm
 */
export const checkVisible = elem => !!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);

/**
 * @desc 比较两个数组，返回新增与删除的数据
 * @param oldArr 
 * @param newArr 
 * @param key 不传值直接比较两个数组，传值只比较key值
 */
export const compareArr = <T>(oldArr: T[], newArr: T[], key?: string) => {
  let add: T[] = [];
  let del: T[] = [];
  let unchanged: T[] = [];

  if (key) {
    newArr.forEach(n => {
      if (oldArr.some(o => eq(o[key], n[key]))) {
        unchanged.push(n);
      } else {
        add.push(n);
      }
    });
    oldArr.forEach(o => {
      if (newArr.every(n => !eq(o[key], n[key]))) {
        del.push(o);
      }
    });
  } else {
    newArr.forEach(n => {
      if (oldArr.some(o => eq(o, n))) {
        unchanged.push(n);
      } else {
        add.push(n);
      }
    });
    oldArr.forEach(o => {
      if (newArr.every(n => !eq(o, n))) {
        del.push(o);
      }
    })
  }
  return {
    add, del, unchanged
  }
}

/**
 * @desc 驼峰转下划线
 */
export const mountainToLine = (name) => {
  let index = name.lastIndexOf(".");
  let obj = name.substring(index + 1, name.length);
  return obj.replace(/([A-Z])/g, "_$1").toLowerCase();
}

export const copy = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
}

export const isElementHidden = (el: HTMLElement) => {
  return el.offsetWidth >= 0 && el.offsetHeight <= 0;
}

export const checkFlash = () => {
  var hasFlash = 0;　　　　 //是否安装了flash
  var flashVersion = 0;　　 //flash版本

  if (navigator.plugins && navigator.plugins.length > 0) {
    var swf = navigator.plugins["Shockwave Flash"];
    if (swf) {
      hasFlash = 1;
      var words = swf.description.split(" ");
      for (var i = 0; i < words.length; ++i) {
        if (isNaN(parseInt(words[i]))) {
          continue;
        }
        flashVersion = parseInt(words[i]);
      }
    }
  }
  return {
    hasFlash,
    flashVersion
  }
}
export const flash = checkFlash();


export const getBase64 = (file) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

export const requestFullScreen = (element) => {
  // 判断各种浏览器，找到正确的方法
  const requestMethod = element.requestFullScreen || //W3C
    element.webkitRequestFullScreen || //FireFox
    element.mozRequestFullScreen || //Chrome等
    element.msRequestFullScreen; //IE11
  if (requestMethod) {
    requestMethod.call(element);
  } else if (typeof window['ActiveXObject'] !== "undefined") { //for Internet Explorer
    const wscript = new window['ActiveXObject']("WScript.Shell");
    if (wscript !== null) {
      wscript.SendKeys("{F11}");
    }
  }
}

//退出全屏 判断浏览器种类
export const exitFullScreen = () => {
  // 判断各种浏览器，找到正确的方法
  var exitMethod = document.exitFullscreen || //W3C
    document['mozCancelFullScreen'] || //FireFox
    document['webkitExitFullscreen'] || //Chrome等
    document['webkitExitFullscreen']; //IE11
  if (exitMethod) {
    exitMethod.call(document);
  } else if (typeof window['ActiveXObject'] !== "undefined") { //for Internet Explorer
    var wscript = new window['ActiveXObject']("WScript.Shell");
    if (wscript !== null) {
      wscript.SendKeys("{F11}");
    }
  }
}

export const checkFull = () => {
  let isFull = window['fullScreen'] || document['webkitIsFullScreen'] || document['msFullscreenEnabled'];
  if (isFull === undefined) { isFull = false; }
  return !!isFull;
}

/**
 * @desc 数组倒序排序
 */
export const sortBy = (field) => {
  return function (a, b) {
    return b[field] - a[field];
  }
}

/**
 * @desc 秒转换成时分秒
 */
// export const converHMS = (sec: number) => {
//   const second = sec % 60;
//   const hour = Math.floor(sec / 60 / 60);
//   const minute = Math.floor((sec - second - hour * 60 * 60) / 60);

//   if (hour) {
//     return intlGet('time_hms', { h: hour, m: minute, s: second });
//   } else if (minute) {
//     return intlGet('time_ms', { m: minute, s: second });
//   } else {
//     return intlGet('time_s', { s: second });
//   }
// }

export const getSearchParams = () => {
  const search = window.location.search.replace('?', '');
  const paramArr = search.split('&');
  const parsmObj: any = {};
  paramArr.forEach(x => {
    const [key, value] = x.split('=');
    parsmObj[key] = value;
  });
  return parsmObj;
}

export const isNumber = (num: string) => {
  const re = /^[0-9]+\.?[0-9]*$/; //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/ 
  if (re.test(num)) {
    return true;
  } else {
    return false;
  }
}

/**
 * @desc 导出媒体资源
 */
export const exportMedia = (fileName: string = '', url, content) => {
  http.post(url, content, { responseType: 'blob' }).then(res => {
    console.log('res', res);
    const { data, headers } = res;
    let blob = new Blob([data], { type: 'application/zip' });

    if (!fileName) {
      fileName = headers['content-disposition'].split('=')[1];
      fileName = decodeURI(fileName);
    }

    if (window.navigator['msSaveOrOpenBlob']) {
      navigator.msSaveBlob(blob, fileName);
    } else {
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(link.href);
    }

  }, error => {
    console.log('error', error);
  })
}


/**
 * @desc 失败成功颜色 成功true失败false
 */
export const convertFailSColor = (types) => {

  return types ? '#108ee9' : '#f50';
}

/**
 * @desc 根据字符串前缀提取设备类型
 */
export const abstractDeviceType = (str) => {
  let endIndex = str.lastIndexOf(':');
  return str.substr(0, endIndex);
}


// export const showTotal = (total) => {
//   return `${intlGet('in_total')} ${total} ${intlGet('item')}`;
// }

export const InArray = (num: number, arr: [number, number]) => {
  return (num >= arr[0]) && (num <= arr[1]);
}

export const hasErrors = (fieldsError) => {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

/**
 * 
 * @param numArr 10进制数组 [1,2,3]
 * @returns 返回的和为10进制
 */
export const getBinarySum = (numArr: number[]) => {
  let sum = 0;
  numArr.forEach(x => {
    sum += 1 << x;
  });
  return sum;
}

/**
 * 
 * @param num2 二进制
 * @param optionNum 二进制
 * @returns []number 10进制
 */
export const decompositionBinary = (num2: number, optionNum: number) => {
  let result: number[] = []
  for (let i = 0; i < optionNum; i++) {
    if (((num2 >> i) & 0x1) === 1) {
      result.push(i)
    }
  }
  return result;
}
