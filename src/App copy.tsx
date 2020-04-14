import React, { useState, useEffect, Suspense, } from 'react';
import { Layout, Menu,  } from 'antd';
import './App.scss';

import { menus, MenuHasPage, MenuObj } from './router';

import {
  Switch,
  Route,
  useHistory,
  Redirect
} from "react-router-dom";
import { eq } from './utils/mix';

const { Header, Content, Sider } = Layout;

const pages: MenuHasPage[] = [];
const getPages = (menus: MenuObj, pages: MenuHasPage[]) => {
  Object.keys(menus).forEach(key => {
    const menu = menus[key]
    const { label, children = {}, page, redirect } = menu;
    if (page || redirect) {
      pages.push({
        key,
        label,
        page,
        redirect
      })
    }
    getPages(children, pages);
  });
}
getPages(menus, pages);
console.log('pages', pages);

const routers = pages.map(p => {
  const { key, label, redirect, page } = p;
  return redirect
    ? <Redirect from={key} push exact to={redirect} key={key} />
    : <Route
      key={key}
      path={key}
      exact={true}
      children={page}
    />
});
console.log('routers', routers);

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
};

const App = () => {
  const defaultKey = '/preview';
  const [key, setKey] = useState(defaultKey);
  const [subKey, setSubKey] = useState(menus[defaultKey].redirect || '');
  const history = useHistory();
  const pathname = history.location.pathname;

  useEffect(() => {
    if (!eq(pathname, '/')) {
      setKey('/' + pathname.split('/')[1])
      setSubKey(pathname);
    }
    console.log(1111111111111111)
  }, [pathname]);
  
  
  const clickTopMenu = (key: string) => {
    setKey(key);
    setSubKey(pathname);
    history.push(key);
  }

  const clickleftMenu = (key: string) => {
    setSubKey(key);
    history.push(key);
  }

  let subMenus: MenuObj = menus[key].children || {};

  return <Layout className="appLayout">
    <Header className="header">
      <div className="appLogo" />
      <Menu theme="dark" mode="horizontal"
        selectedKeys={[key]}
      >
        {Object.keys(menus).map(key => {
          const label = menus[key].label;
          return <Menu.Item key={key} onClick={() => clickTopMenu(key)}>{label}</Menu.Item>
        })}
      </Menu>
    </Header>

    <Layout>
      {eq(pathname, '/preview')
        ? null
        : <Sider width={200} className="leftSider">
          <Menu
            mode="inline"
            defaultSelectedKeys={[subKey]}
            defaultOpenKeys={[subKey]}
            style={{ height: '100%', borderRight: 0 }}
            selectedKeys={[subKey]}
            onClick={({ key, keyPath }) => clickleftMenu(key)}
          >
            {renderSubMenus(subMenus)}
          </Menu>
        </Sider>
      }

      <Layout style={{ padding: '0 24px 24px' }}>
        <Content>
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Redirect from="/" exact to={defaultKey} />
              {routers}
            </Switch>
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  </Layout>
};

export default App;
