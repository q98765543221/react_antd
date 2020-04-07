import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import './App.scss';

import * as MyRoute from './router';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";

const { Header, Content, Sider } = Layout;

interface MenuIem {
  label: string,
  children?: MenuObj;
  page?: React.ReactNode,
}
type MenuHasPage = MenuIem & {
  key: string,
  page: React.ReactNode,
};

interface MenuObj {
  [key: string]: MenuIem
}

const menus: MenuObj = {
  'preview': {
    label: '预览'
  },
  'config': {
    label: '配置',
    children: {
      '/config/local': {
        label: '本地',
        page: () => <MyRoute.ConfigLocal />
      },
      '/config/system': {
        label: '系统',
        children: {
          '/config/system/setting': {
            label: '系统设置',
            page: () => <MyRoute.ConfigSystemSetting />
          },
          '/config/system/maintain': {
            label: '系统维护',
            page: () => <MyRoute.ConfigSystemMaintain />
          },
        }
      },
      '/config/network': {
        label: '网络'
      },
      '/config/video': {
        label: '视频'
      },
      '/config/param': {
        label: '参数'
      },
    }
  }
};

const pages: MenuHasPage[] = [];
const getPages = (menus: MenuObj, pages: MenuHasPage[]) => {
  Object.keys(menus).forEach(key => {
    const menu = menus[key]
    const { label, children = {}, page } = menu;
    if (page) {
      pages.push({
        key,
        label,
        page,
      })
    }
    getPages(children, pages);
  });
}
getPages(menus, pages);

const renderSubMenus = (menus: MenuObj) => {
  return Object.keys(menus).map(key => {
    const { label, children = {} } = menus[key];
    const hasSubMenu = Object.keys(children).length;
    return hasSubMenu
      ? <Menu.SubMenu key={key} title={label} >
        {renderSubMenus(children)}
      </Menu.SubMenu>
      : <Menu.Item key={key}>{label}</Menu.Item>
  })
}


const App = () => {
  const defaultKey = 'config';
  const getDefaultSubKey = () => {
    return menus[defaultKey]
      && menus[defaultKey].children
      && (Object.keys(menus[defaultKey].children!)[0])
      || '';
  }

  const [key, setKey] = useState(defaultKey);
  const [subKey, setSubKey] = useState(getDefaultSubKey());
  const history = useHistory();

  useEffect(() => {
    setSubKey(getDefaultSubKey());
  }, [key]);

  useEffect(() => {
    console.log('useEffect subkey', subKey)
    history.push(subKey);
  }, [subKey]);

  let subMenus: MenuObj = menus[key].children || {};

  const clickSubMenu = (key: string) => {
    console.log('clickSubMenu key', key);
  }
  return <Layout className="appLayout">
    <Header className="header">
      <div className="appLogo" />
      <Menu theme="dark" mode="horizontal"
        selectedKeys={[key]}
      >
        {Object.keys(menus).map(key => {
          const label = menus[key].label;
          return <Menu.Item key={key} onClick={() => setKey(key)}>{label}</Menu.Item>
        })}
      </Menu>
    </Header>

    <Layout>
      <Sider width={200} className="leftSider">
        <Menu
          mode="inline"
          defaultSelectedKeys={[subKey]}
          defaultOpenKeys={[subKey]}
          style={{ height: '100%', borderRight: 0 }}
          selectedKeys={[subKey]}
          onClick={({ key, keyPath }) => { setSubKey(key) }}
        >
          {renderSubMenus(subMenus)}
        </Menu>
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Content>
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              {pages.map(p => {
                const { key, label, page = () => null } = p;
                return <Route
                  key={key}
                  path={key}
                  exact={true}
                  children={page}
                />
              })}
            </Switch>
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  </Layout>
};

export default App;
