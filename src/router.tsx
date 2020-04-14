import React, { lazy} from 'react';
import {ProfileOutlined, GlobalOutlined, PlaySquareOutlined, CarOutlined, AlertOutlined} from '@ant-design/icons';

const  ConfigLocal = lazy(() => import('./pages/config/local'));
const ConfigSystemSetting = lazy(() => import('./pages/config/system/setting'));
const ConfigSystemMaintain = lazy(() => import('./pages/config/system/maintain'));
const Login = lazy(() => import ('./pages/login'));

export interface MenuIem {
  label: string,
  children?: MenuObj;
  page?: React.ReactNode,
  redirect?: string,
  key?: string,
  pKey?: string,
  icon?: React.ReactNode,
}
export type MenuHasPage = MenuIem & {
  key: string,
  page: React.ReactNode,
};

export interface MenuObj {
  [key: string]: MenuIem
}

const menus: MenuObj = {
  '/preview': {
    label: '预览',
    page: () => '预览'
  },
  '/config': {
    label: '配置',
    redirect: '/config/system/setting',
    children: {
      // '/config/local': {
      //   label: '本地',
      //   page: () => <ConfigLocal />
      // },
      '/config/system': {
        label: '系统配置',
        icon: <ProfileOutlined />,
        children: {
          '/config/system/setting': {
            label: '系统设置',
            page: () => <ConfigSystemSetting />
          },
          '/config/system/maintain': {
            label: '系统维护',
            page: () => <ConfigSystemMaintain />
          },
        }
      },
      '/config/network': {
        label: '网络',
        icon: <GlobalOutlined />,
      },
      '/config/video': {
        label: '视频',
        icon: <PlaySquareOutlined />,
      },
      '/config/param': {
        label: '车辆设置',
        icon: <CarOutlined />,
      },
      '/config/alarm': {
        label: '报警设置',
        icon: <AlertOutlined />
      }
    }
  }
};

const routerPreFix = '/protected';
const menuFlatObj: MenuObj = {};
const addRouterPreFix = (menus: MenuObj, pKey: string) => {
  Object.keys(menus).forEach(key => {
    const menu = menus[key]
    const {  children = {}, redirect } = menu;
    menu.redirect = redirect ? (routerPreFix + redirect) : redirect;
    const newKey = routerPreFix + key;
    menu.key = newKey;
    menu.pKey = pKey;
    menus[newKey] = menu;
    menuFlatObj[newKey] = menu;
    delete menus[key];
    addRouterPreFix(children, newKey);
  });
}
addRouterPreFix(menus, '');

const getParentByKey = (key: string) => {
  const menu =  menuFlatObj[key];
  console.log('getParentByKey', key, menu);
  const {pKey} = menu;
  let result: MenuIem |undefined = undefined;
  if(pKey){
    result = menuFlatObj[pKey]
  }
  return result;
}

const getTopKey = (key: string) => {
  let topKey = key;
  let parent = getParentByKey(key);
  while(parent){
    topKey = parent.key!;
    parent = getParentByKey(topKey);
  }
  return topKey;
}

export {routerPreFix, menus, Login, getTopKey};


