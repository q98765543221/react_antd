import React, {  } from 'react';
import { Tabs } from 'antd';
import TimeConfig from './timeConfig';
import './index.scss';


const { TabPane } = Tabs;

const Local = ({ }) => {

  function callback(key) {
    console.log(key);
  }

  return <div className="systemSettingPage">
    <Tabs onChange={callback} type="card" defaultActiveKey="2">
      <TabPane tab="基本信息" key="1">
        Content of Tab Pane 1
    </TabPane>
      <TabPane tab="时间配置" key="2">
        <TimeConfig />
      </TabPane>
      <TabPane tab="RS-232" key="3">
        Content of Tab Pane 3
    </TabPane>
    </Tabs>,
  </div>
}

export default Local;