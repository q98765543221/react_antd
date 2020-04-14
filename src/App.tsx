import React, { useState, useEffect, Suspense, } from 'react';
import { Layout, Menu, Button, Popconfirm, } from 'antd';
import './App.scss';
import logoPng from './assets/images/logo2.png';
import { Login, menus, MenuHasPage, MenuObj, routerPreFix, getTopKey } from './router';

import {
  Switch,
  Route,
  useHistory,
  Redirect
} from "react-router-dom";
import { eq, mySessionStorage } from './utils/mix';
import { CommonHooks } from './hooks';
import consts from './consts';
import { http } from './utils';

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
    const { label, children = {}, icon = null } = menus[key];
    const hasSubMenu = Object.keys(children).length;
    return hasSubMenu
      ? <Menu.SubMenu key={key} title={<span>
        {icon}
        <span className="menuTitle">{label}</span>
      </span>} >
        {renderSubMenus(children)}
      </Menu.SubMenu>
      : <Menu.Item key={key}>
        <span>
          {icon}
          <span className="menuTitle">{label}</span>
        </span>
      </Menu.Item >
  })
};

const App = () => {
  const history = useHistory();

  useEffect(() => {
    const unregisterCallback = history.listen((location) => {
      console.log('history change', location);
    });
    return unregisterCallback;
  }, []);

  return <Switch>
    <Route exact path="/">
      <Redirect to="/login" />
    </Route>
    <Route path="/public">
      public
    </Route>
    <Route path="/login">
      <Suspense fallback={<div>Loading...</div>}>
        <Login />
      </Suspense>
    </Route>
    <PrivateRoute path={routerPreFix}>
      <ProtectedPage />
    </PrivateRoute>

    <Route path="/404">
      <NoMatch />
    </Route>

    <Route path="*">
      <Redirect to="/404" />
    </Route>
  </Switch>
};

export default App;

const NoMatch = () => {
  return <h3>404</h3>;
}

const PrivateRoute = ({ children, ...rest }) => {
  const { userInfo } = CommonHooks.useContainer();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        userInfo.isLogin
          ? children
          : <Redirect to={{ pathname: "/login", state: { from: location } }} />
      }
    />
  )
}

const ProtectedPage = () => {
  const defaultKey = '/protected/preview';
  const { userInfo, setUserInfo } = CommonHooks.useContainer();
  const [topKey, setTopKey] = useState(defaultKey);
  const [subKey, setSubKey] = useState(menus[defaultKey].redirect || '');
  const history = useHistory();
  const pathname = history.location.pathname;

  useEffect(() => {
    const topKey = getTopKey(pathname);
    setTopKey(topKey)
    setSubKey(pathname);
  }, [pathname]);


  const clickTopMenu = (key: string) => {
    setTopKey(key);
    setSubKey(pathname);
    history.push(key);
  }

  const clickleftMenu = (key: string) => {
    setSubKey(key);
    history.push(key);
  }

  const logout = () => {
    http.post('', {
      action: 'LoginOut',
      data: {
        userName: userInfo.userName,
      }
    }).then(res => {
      setUserInfo({
        isLogin: false,
        userName: '',
        pwd: '',
      });
      history.push('/login')
    })
  }
  // console.log('key ->>', menus, topKey);
  let subMenus: MenuObj = menus[topKey].children || {};

  return <Layout className="appLayout">
    <Header className="header">
      <div className="appLogo" >
        <img src={logoPng} />
      </div>
      <Menu theme="dark" mode="horizontal"
        selectedKeys={[topKey]}
      >
        {Object.keys(menus).map(key => {
          const label = menus[key].label;
          return <Menu.Item key={key} onClick={() => clickTopMenu(key)}>{label}</Menu.Item>
        })}
      </Menu>

      <div className="userInfo">
        <span>{userInfo.userName}</span>
        <Popconfirm
          title="确定要注销账户吗?"
          onConfirm={logout}
          placement="bottomRight"
          okText="是"
          cancelText="否"
        >
          <Button ghost size="small">注销账户</Button>
        </Popconfirm>
      </div>
    </Header>

    <Layout>
      {eq(pathname, '/protected/preview')
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

      <Layout style={{ background: 'white' }}>
        <Content>
          <Suspense fallback={<div></div>}>
            <Switch>
              <Redirect from="/" exact to={defaultKey} />
              {routers}
            </Switch>
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  </Layout>
}