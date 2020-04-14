import { useState } from "react";
import { createContainer  } from 'unstated-next';
import { mySessionStorage } from "../utils";
import consts from "../consts";


interface CommonHooksInterface {
  userInfo: UserInfo,
  setUserInfo: (userInfo) => void,
}

const useUserInfo = () => {
  const sessionUserInfo: UserInfo = mySessionStorage.getItem(consts.session_key.userInfo, 'obj');
  const initialUserInfo: UserInfo = sessionUserInfo || {
    isLogin: false,
    userName: '',
    pwd: '',
  }
  let [userInfo, setUserInfo] = useState(initialUserInfo);
  return { userInfo, setUserInfo }
}

const composeHooks = (...hooks) => 
  () => hooks.reduce((acc, hook) => ({...acc, ...hook()}), {});

const CommonHooks = createContainer<CommonHooksInterface>(composeHooks(useUserInfo));

export { CommonHooks }