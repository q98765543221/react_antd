import './index.scss';
import React, { useState, useEffect, } from 'react';
import leftImg from '../../assets/images/login1.png';
import logoIMg from '../../assets/images/logo.png';
import { Form, Input, Button, message, } from 'antd';
import { http, mySessionStorage, eq, setUuid } from '../../utils';
import { CommonHooks } from '../../hooks';
import { useHistory } from 'react-router-dom';
import consts from '../../consts';


const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const Login = () => {
  const [form] = Form.useForm();
  const { setUserInfo } = CommonHooks.useContainer();
  const [initState, setInitState] = useState<Online>(-1);   // -1 未初始化 0 已初始化 1登录


  const history = useHistory();
  useEffect(() => {
    http.post('', {
      action: 'QueryDeviceInitState',
    }).then(res => {
      const state = res.data.initState || 0;
      setInitState(state);
    })
  }, []);

  const onFinish = values => {
    console.log('Success:', values);
    const { userName, pwd } = values;
    const action = eq(initState, 1)
      ? 'LoginIn'
      : 'InitAdmin';

    http.post('', {
      action,
      data: {
        userName,
        pwd
      }
    }).then(res => {
      if (eq(initState, 1)) {
        const { roleType, uuid } = res.data;
        const userInfo: UserInfo = {
          isLogin: true,
          userName: values.userName,
          pwd: values.pwd,
        }
        setUserInfo(userInfo);
        setUuid(uuid);
        mySessionStorage.setItem(consts.session_key.userInfo, userInfo, 'obj');
        history.push('/protected/preview');
      } else if (eq(initState, 0)) {
        setInitState(1);
        message.success('创建账户成功，请登录！');
        form.resetFields();
      }
    }, err => {
      if (eq(initState, 0)) {
        message.error('创建失败！');
      } else if (eq(initState, 1)) {
        form.setFields([
          {
            name: 'userName',
            value: userName,
            errors: ['用户名或密码错误！'],

          }
        ])
      }
    })

  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  console.log('app render', `initState ${initState}`)
  return <div className="loginPage">
    <div className="logo">
      <img src={logoIMg} />
    </div>
    <div className="content">
      <div className="left">
        <img src={leftImg} />
      </div>
      <div className="right">
        {!eq(initState, -1) ? (
          <Form
            {...layout}
            form={form}
            className="loginForm"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <div className="title">
              H5设备管理
          </div>
            <Form.Item
              label="用户名"
              name="userName"
              rules={[{ required: true, message: '请输入用户名!' }]}
            >
              <Input autoComplete="off" />
            </Form.Item>

            <Form.Item
              label="密码"
              name="pwd"
              rules={[{ required: true, message: '请输入密码!' }]}
            >
              <Input.Password visibilityToggle={false} />
            </Form.Item>

            {eq(initState, 0) ? (
              <Form.Item
                label="确认密码"
                name="pwd2"
                dependencies={['pwd']}
                rules={[{ required: true, message: '请输入密码!' },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('pwd') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('密码不一致！');
                  }
                })
                ]}
              >
                <Input.Password visibilityToggle={false} />
              </Form.Item>
            ) : null}

            <Button type="primary" className="loginBtn"
              htmlType="submit"
            >
              {eq(initState, 1) ? '登录' : '创建账户'}
            </Button>
          </Form>
        ) : null}

      </div>
    </div>
  </div>
}

export default Login;