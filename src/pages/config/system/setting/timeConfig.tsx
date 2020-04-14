import React, { useState, } from 'react';
import { Form, Row, Col, Select, Radio, Input, Checkbox, Button } from 'antd';
import { eq, formatTime } from '../../../../utils/mix';
import timeZone from '../../../../assets/json/timeZone.json';

const { Option } = Select;
const timeZoneOption = Object.keys(timeZone).map((k, i) => {
  const name: string = timeZone[k];
  // const reg = /(-\d+)/;
  // const mathResult = name.match(reg);
  // const value =mathResult ? Number(mathResult![1]) : 0;
  return <Option key={name} value={name} >{name}</Option>
})

const TimeConfig = ({ }) => {
  const [timeType, setTimeType] = useState('gps');
  const labelSpan = 3;
  const inputSpan = 5;
  const gutter = 10;

  const clickRadio = (timeType: string) => {
    setTimeType(timeType);
  }

  return <div className="timeConfig">
    <Form >
      <Row gutter={gutter}>
        <Col span={labelSpan}>时区设置</Col>
        <Col >
          <Form.Item name="time" rules={[{ required: true }]}>
            <Select style={{ width: 400, marginLeft: 24 }}>
              {timeZoneOption}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <div className="gps">
        <Radio checked={eq(timeType, 'gps')} onClick={() => clickRadio('gps')}>GPS校时</Radio>
        <Row gutter={gutter}>
          <Col span={labelSpan} >校时时间间隔</Col>
          <Col>
            <Form.Item name="note" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col>分钟</Col>
        </Row>
      </div>

      <div className="ntp">
        <Radio checked={eq(timeType, 'ntp')} onClick={() => clickRadio('ntp')}>NTP校时</Radio>
        <Row gutter={gutter}>
          <Col span={labelSpan} >服务器地址</Col>
          <Col>
            <Form.Item name="note" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col></Col>
        </Row>
        <Row gutter={gutter}>
          <Col span={labelSpan} >NTP端口</Col>
          <Col>
            <Form.Item name="note" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col></Col>
        </Row>
        <Row gutter={gutter}>
          <Col span={labelSpan} >校时时间间隔</Col>
          <Col>
            <Form.Item name="note" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col>分钟</Col>
        </Row>
      </div>

      <div className="hand">
        <Radio name="hand" checked={eq(timeType, 'hand')} onClick={() => clickRadio('hand')}>手动校时</Radio>
        <Row gutter={gutter}>
          <Col span={labelSpan} >设备时间</Col>
          <Col style={{ marginLeft: 24, }}>
            {formatTime(Date.now(), 1)}
          </Col>
          <Col></Col>
        </Row>
        <Row gutter={gutter}>
          <Col span={labelSpan} >设置时间</Col>
          <Col>
            <Form.Item name="note" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item rules={[{ required: true }]}>
              <Checkbox />
            </Form.Item>
          </Col>
          <Col>
            和计算机同步
        </Col>
        </Row>
      </div>
      <Button type="primary">保存</Button>
    </Form>
  </div>
}

export default TimeConfig;
