import React, { useEffect } from 'react';
import { Row, Col, Radio, Input, Button } from 'antd';
import { Form } from 'antd';
import './index.scss';
import {http} from '../../../utils';

const Local = ({ }) => {
  const [form] = Form.useForm();
  const onFinish = values => {
    console.log('Success:', values);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };
 
  useEffect(() => {
    const a = http.post
    // http.post('', {
    //   userName: 'lijuncheng',
    //   pwd: 123456
    // })
  }, []);

  const labelSpan = 3;
  const inputSpan = 5;
  const gutter = 10;
  return <div className="localPage">
    <Form
      onFinish={onFinish}
    >
      <div className="playParams">
        <div className="title">
          播放参数
        </div>
        <Row>
          <Col span={labelSpan}>协议类型</Col>
          <Col ></Col>
        </Row>
        <Row  >
          <Col span={labelSpan}>播放性能</Col>
          <Col >
            <Form.Item name="note" rules={[{ required: true }]} noStyle>
              <Radio.Group >
                <Radio value={1}>最短延时</Radio>
                <Radio value={2}>均衡</Radio>
                <Radio value={3}>流畅性好</Radio>
                <Radio value={4}>自定义</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={labelSpan}>抓图文件格式</Col>
          <Col >
            <Form.Item name="note" rules={[{ required: true }]} noStyle>
              <Radio.Group >
                <Radio value={1}>JPEG</Radio>
                <Radio value={2}>BMP</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </div>

      <div className="recordFile">
        <div className="title">
          录像文件
        </div>
        <Row>
          <Col span={labelSpan}>录像文件打包大小</Col>
          <Col >
            <Form.Item name="note" rules={[{ required: true }]} noStyle>
              <Radio.Group >
                <Radio value={1}>256M</Radio>
                <Radio value={2}>512M</Radio>
                <Radio value={3}>1G</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={gutter}>
          <Col span={labelSpan}>录像文件保存路径</Col>
          <Col span={inputSpan}>
            <Form.Item name="note" rules={[{ required: true }]} noStyle>
              <Input />
            </Form.Item>
          </Col>
          <Col>
            <Button type="primary" ghost>浏览</Button>
          </Col>
          <Col>
            <Button type="primary" ghost>打开文件夹</Button>
          </Col>
        </Row>
        <Row gutter={gutter}>
          <Col span={labelSpan}>回放下载保存路径</Col>
          <Col span={inputSpan}>
            <Form.Item name="note" rules={[{ required: true }]} noStyle>
              <Input />
            </Form.Item>
          </Col>
          <Col>
            <Button type="primary" ghost>浏览</Button>
          </Col>
          <Col>
            <Button type="primary" ghost>打开文件夹</Button>
          </Col>
        </Row>
      </div>

      <div className="snap">
        <div className="title">
          抓图和剪辑
        </div>

        <Row gutter={gutter}>
          <Col span={labelSpan}>预览抓图保存路径</Col>
          <Col span={inputSpan}>
            <Form.Item name="note" rules={[{ required: true }]} noStyle >
              <Input />
            </Form.Item>
          </Col>
          <Col>
            <Button type="primary" ghost>浏览</Button>
          </Col>
          <Col>
            <Button type="primary" ghost>打开文件夹</Button>
          </Col>
        </Row>
        <Row gutter={gutter}>
          <Col span={labelSpan}>回放抓图保存路径</Col>
          <Col span={inputSpan}>
            <Form.Item name="note" rules={[{ required: true }]} noStyle>
              <Input />
            </Form.Item>
          </Col>
          <Col>
            <Button type="primary" ghost>浏览</Button>
          </Col>
          <Col>
            <Button type="primary" ghost>打开文件夹</Button>
          </Col>
        </Row>
        <Button type="primary">保存</Button>
      </div>
    </Form>
  </div>
}

export default Local;
