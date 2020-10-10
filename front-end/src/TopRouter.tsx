/** @jsx jsx */
import { jsx,  Global } from "@emotion/core";
import { Suspense, lazy,  } from "react";
import * as React from "react";
//import * as firebase from "firebase/app";
import { Route, Redirect, useRoute, Switch } from "wouter";

import { Login } from "./LoginPane";
import { Branding } from "./Branding";
import { Spinner,  } from "customize-easy-ui-component";
//import { useAuthState } from "react-firebase-hooks/auth";
//import { userContext } from "./user-context";
import {Helmet} from "react-helmet";
import { useSession } from "./auth";
//import { TestRoot } from "./TestRoot.tsx--";
import { Example as Test } from "./comp/test02";
import  Example  from "./comp/test01";
//import MainReport from "./report/ReportEntrance";
import { EditStorageContext } from "./report/StorageContext";
import {Guide as ReportGuide} from "./report/Guide";


//网站的顶级路由器；　这里可以添加或分解子网站，分批开发，分开管理属于同一个域名底下的多个内容网站。
//根据类似的文件目录树结构来分解多个内容网站的路由，规划和编码URL。
//四段法URL解析：　#之后的给location.hash,　?后的参数给location.search,　而?号之前的{且https://localhost:3765后面的}都算<Route>管的那=useLocation()返回值。
//分层次做路由，例如path="/bsxt/fjsei/:rest*" 这里*表示后面子路由的解析都划归这个组件了；需要嵌套细化解析子路径的话，就应在目标组件内部再细化和做二层次<Route>。

//使用规则！:输入的path　直接透传给<component>。
interface PrivateRouteProps {
  component: any;
  path?: string;
}

//说明　...other这里　other表示剩下的参数[] ，占位表示形式。
//必须授权才可以进入的页面：
const PrivateRoute = ({
                        component: Component,
                        path,
                        ...other
                      }: PrivateRouteProps) => {

  const [match, params] = useRoute(path);
  //基于底层连接cookie-token,来获取当前用户
  const { user,loading } = useSession();
  if(!match)  return null;

  //const user = firebase.auth().currentUser;

  console.log("PrivateRoute进入useSession=",user,";loading="+loading, match);
  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "3rem",
          justifyContent: "center",
          display: "flex"
        }}
      >
        <Spinner />
      </div>
    );
  }
  //刷新页面第一次ｎｕｌｌ，第二次获得user;
  if (!user && params.rest) {
    console.log("PrivateRoute进入params=",params);
    return <Redirect to="/login" />;
  }
  //console.log("PrivateRoute进params=",params);
  if (!user) {
    return <Redirect to="/login" />;
    //return null;
  }

  return <Component path={path} />;
};

//给第二层次的路由器做分解用。
//使用规则！:输入的path 必须是/:rest*结尾的。 专门用于嵌套路由的；path截取基本路径给<component>。
interface NestingtRouteProps {
  component: any;
  path?: string;
}
//Todo: 问题，NestingtRoute， 导致Link 后缀重复添加。
//嵌套路由必须在上层路由通过path/:rest*向下一级路由去传递相对的目录路径，下级路由无需预设基础路径/通过path参数设置。
const NestingtRoute_old = ({
                         component: Component,
                        path,
                        ...other
                      }: NestingtRouteProps) => {
  console.log("NestingtRouteProps来了 , match=",path);
  const [match, params] = useRoute(path);
  // path="/testroot/:rest*" >
  //基于底层连接cookie-token,来获取当前用户  useRoute(`${path}:recipe*`);
  const { user,loading } = useSession();
  if(!match)  return null;

  //const user = firebase.auth().currentUser;
  let urlhead=path.lastIndexOf("/:rest*")
  if(urlhead<0)
    return null;
  let basePath= urlhead>0? path.substring(0,urlhead) : "/";

  console.log("NestingtRoute进入useSession2=",user,";basePath=",params, basePath);
  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "3rem",
          justifyContent: "center",
          display: "flex"
        }}
      >
        <Spinner />
      </div>
    );
  }
  //刷新页面第一次ｎｕｌｌ，第二次获得user;
  if (!user && params.rest) {
    console.log("PrivateRoute进入params=",params);
    return <Redirect to="/login" />;
  }
  //console.log("PrivateRoute进params=",params);
  if (!user) {
    return <Redirect to="/login" />;
    //return null;
  }

  return <Component path={basePath} />;
};

const NestingtRoute = ({
                         component: Component,
                         path,
                         ...other
                       }: NestingtRouteProps) => {
  console.log("NestingtRouteProps来了 , path=",path);
  //基于底层连接cookie-token,来获取当前用户  useRoute(`${path}:recipe*`);
  const { user,loading } = useSession();
  const [match, params] = useRoute(path);
  if(!match)  return null;
  let urlhead=path.lastIndexOf("/:rest*")
  if(urlhead<0)   return null;

  console.log("NestingtRoute进入useSession2=",user,";params=",params);
  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "3rem",
          justifyContent: "center",
          display: "flex"
        }}
      >
        <Spinner />
      </div>
    );
  }
  //刷新页面第一次ｎｕｌｌ，第二次获得user;
  if (!user && params.rest) {
    console.log("PrivateRoute进入params=",params);
    return <Redirect to="/login" />;
  }
  //console.log("PrivateRoute进params=",params);
  if (!user) {
    return <Redirect to="/login" />;
    //return null;
  }
  //采用基准相对路径模式<Component path={basePath} />的也不好管理。
  return <Component />;
};

//延迟加载（在组件渲染的时候，再去加载该组件）：延迟加载组件，需要个渲染加载过程,用旋转圆圈提示用户，加载进行时。
//js打包的，延迟加载。
// Function that wraps the component in a React Suspense component. Provides a fallback Loading screen
export const WaitingComponent = (Component: any) => {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  return (props: any) => (
    <Suspense
      //Fallback UI fallback＝用旋转圆圈提示用户　displays a loading spinner while rendering
      fallback={
        <div
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "3rem",
            justifyContent: "center",
            display: "flex"
          }}
        >
          <Spinner />
        </div>
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

//路由的主页面：React.lazy()用于延迟加载组件。加载的模式　；　而require 是运行时加载的；
//const ExampleRouteK3Tag = WaitingComponent(lazy(() => import("./Branding")));
const Main = WaitingComponent(lazy(() => import("./Main")));
const DeviceMain = WaitingComponent(lazy(() => import("./device/DeviceMain")));
const UnitMain = WaitingComponent(lazy(() => import("./unit/DeviceMain")));
const InspectMain = WaitingComponent(lazy(() => import("./inspect/InspectMain")));
const ReportEntrance = WaitingComponent(lazy(() => import("./report/ReportEntrance")));
const Maintenance = WaitingComponent(lazy(() => import("./maintenance/MaintenanceMain")));
const About = WaitingComponent(lazy(() => import("./About")));

function TopRouter() {
  //const { initialising, } = useAuthState(firebase.auth());
  const {user,loading} = useSession();  //App初始期间，无法获取到GlobalState组件后才生成的context信息。
  //报告和原始记录用的临时内存存储！，避免太多次数保存发送给后端服务器。
  const [storage, setStorage] = React.useState(null);
    //强制URL输入框去刷新才执行的；若是浏览器后退前进的不会执行到这，该场景直接执行NestingtRoute代码。
  console.log("PageRouters入=",user,"loading=",loading );
  //<Router>套在<GlobalState>底下，所以鼠标点击在网页内切换页面不会再次运行GlobalState，除非是浏览器地址栏录入和手动刷新才会重新获取后端授权信息。
  //这下面第一个<div>不能改成<>报错。
  return (
    <div>
        <Global
          styles={{
            body: {
              margin: 0,
              padding: 0
            },
            html: {
       //       width: "190mm",
            }
          }}
        /*  css={ [ { padding: "0px" } ,
            css`@page {
              size: A4;
            }`,
          ] } */
        />
        <div className="App">
          <Helmet titleTemplate="%s | 特检院" defaultTitle="特检院业务平台" />
          { /*
　   注意底下<Switch>下面<Route path:是内定的，不管PrivateRoute还是其他，必有path,上层路由分解必须在这层进行，不能放在PrivateRoute内部。
          */ }

          <EditStorageContext.Provider
                    value={{ storage, setStorage }}
          >

          <Switch>
            {!user &&  <Route path="/">   <Branding />    </Route> }

            <Route path="/login">   <Login />    </Route>
            <PrivateRoute path="/about" component={About} />
            <PrivateRoute path="/device/likeit" component={Branding} />
            <PrivateRoute path="/device/company" component={Login} />

            {/* <!-- NestingtRoute path="/seeok/fjsei/:rest*" component={TestRoot}/!-->  */}

            <PrivateRoute path="/chaipu/:rest*" component={Main} />
            <Route path="/">   <Branding />   </Route>

            <Route path="/test/test2"  component={Test}/>
            { /*
　           从设备的视角来导航进入。
            */ }
            <NestingtRoute path="/device/:rest*" component={DeviceMain}/>
            <NestingtRoute path="/unit/:rest*" component={UnitMain}/>
            <NestingtRoute path="/inspect/:rest*" component={InspectMain}/>
            <Route path="/report/guide">   <ReportGuide />    </Route>
            <NestingtRoute path="/report/:rest*" component={ReportEntrance}/>
            <NestingtRoute path="/maintenance/:rest*" component={Maintenance}/>

            <Route path="/test/test1">   <Example  />    </Route>
            <Route path="/:rest*"><h1>没有该URL匹配的Top视图内容</h1></Route>
          </Switch>

          </EditStorageContext.Provider>
        </div>
    </div>
  );
}



export default TopRouter;

//原则上：ＵＲＬ？之前路径分解用于组件层次逻辑路由用途，？之后的参数用于应用层面参数化和定制化；路由用于大层次的组织/封装性好，参数用于局部琐碎的变动/灵活性好。
//注意Route，PrivateRoute，若是匹配多个路由的，界面上将会出现多个主页面的输出，那就是有问题了：上面一个页面，后面跟着其它的页面。
//上面的<PrivateRoute path="*" component={Main} 当中*代表任意字符串；　<PrivateRoute path="/he"精确路由
//同样component={Main}，一个页面组件可以匹配到多个路由，若path相互包含的，以命中范围更小那一个的路由　优先的。
//优化首屏加载速度: React.lazy来进行组件的动态导入，可以很好的拆分代码build\static\js\2.00384fc9.chunk.js等多个文件。
//build生产系统：.map文件的作用：项目打包后，代码都是经过压缩加密的，如果运行时报错，输出的错误信息无法准确得知是哪里的代码报错。有了map就可以像未加密的代码一样，准确的输出是哪一行哪一列有错。
//<PrivateRoute path="/he"等同于path="/he/"　路由<PrivateRoute path="*" 进入页面后props["*"]实际代表URL问号?之前的扣除path*前的，但是path="/he"进入的props["*"]为未定义。
//组件内部嵌套子路由Route， 就像一般逻辑组件内嵌模式。 例子   https://blog.csdn.net/weixin_30652879/article/details/95477606
//保证路由唯一性<Switch> only renders the first matching route.支持  https://www.npmjs.com/package/wouter
//注意底下<Switch>下面<Route path:是内定的，不管PrivateRoute还是其他，必有path,上层路由分解必须在这层进行，不能放在PrivateRoute内部。
//路径的敲定不可避免<NestingtRoute path=；组件跳转其它多个页面，还有其他页面需要跳转本组件，这些都需要事先预知绝对路径名，无法隔离路径的插入。
//像这样的https://localhost:3765//device/likeit 将不会得到任何匹配<Switch> <Route 显示是空白的！； 正规则表达？。
//路由path配置， 必须/号开始的 最后面/号不需要。


//        <Route path="/report/:rest*">   <MainReport name={'sds'} />    </Route>
