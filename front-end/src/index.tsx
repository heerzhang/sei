import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
//import "./db";
import "focus-visible";


//整个网站工程main() 主入口： SPA 单页面;
//网页没有手动刷新的话，都是在同一个ＡＰＰ里面跳转,context就会一直保持着。



ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();




//关于creat-react-app中的环境变量  https://blog.csdn.net/weixin_38267121/article/details/80333642
//在<App />组件里面　去实现网站的分站点，分枝虚拟网站，通过路由逻辑实现内容分家。
