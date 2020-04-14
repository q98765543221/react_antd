


### 登录代码流程
```mermaid
graph TB
a(页面初始化)-->b(进入路由)
  subgraph  
    b-->b0(默认页面)
    b-->b1(登录页面)
    b-->b2(公开页面)
    b-->b3(权限路由)-->c{是否登录}
    b-->b4(404页面)
    b0-->b1
  end

c--是-->d(权限页面)
c--否-->b1

  subgraph  
    d-->d1(设置菜单高亮)-->d2(监听点击菜单事件)-->d1

    end

```



### 登录业务流程
```flow
st=>start: 页面初始化
getUserInfo=>operation: 获取用户信息
isLogin=>condition: 是否登陆?
showPage=>end: 显示页面
goLogin=>end: 跳转到登陆页面


st->getUserInfo->isLogin
isLogin(yes)->showPage
isLogin(no)->goLogin

```