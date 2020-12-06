
import { jsx,  } from "@emotion/react";
//import * as firebase from "firebase/app";

//import { Spinner } from "customize-easy-ui-component";
//import { useAuthState } from "react-firebase-hooks/auth";
//import { userContext } from "./user-context";
//import {Helmet} from "react-helmet";
import { ApolloProvider } from '@apollo/client';
import { client } from './graphql/setup';
import GlobalState from "./context/GlobalState";
//import { useSession } from "./auth";
import TopRouter from "./TopRouter";

//关键的context　部分的，在顶部就要注入。

function App() {
  //const { initialising, } = useAuthState(firebase.auth());
  //const {user,loading} = useSession();   App初始期间，无法获取到GlobalState组件后才生成的context信息。
  console.log("宇宙奇点App入=",process,client );
  //<Router>套在<GlobalState>底下，所以鼠标点击在网页内切换页面不会再次运行GlobalState，除非是浏览器地址栏录入和手动刷新才会重新获取后端授权信息。
  //页面刷新情况，才会回这里运行；SPA模式。

  return (
    <ApolloProvider client={client}>
      <GlobalState>
        <TopRouter/>
      </GlobalState>
    </ApolloProvider>
  );
}


export default App;


//上面的<PrivateRoute path="*" component={Main} 当中*代表任意字符串；　<PrivateRoute path="/he"精确路由
//同样component={Main}，一个页面组件可以匹配到多个路由，若path相互包含的，以命中范围更小那一个的路由　优先的。
//优化首屏加载速度: React.lazy来进行组件的动态导入，可以很好的拆分代码build\static\js\2.00384fc9.chunk.js等多个文件。
//build生产系统：.map文件的作用：项目打包后，代码都是经过压缩加密的，如果运行时报错，输出的错误信息无法准确得知是哪里的代码报错。有了map就可以像未加密的代码一样，准确的输出是哪一行哪一列有错。
//<PrivateRoute path="/he"等同于path="/he/"　路由<PrivateRoute path="*" 进入页面后props["*"]实际代表URL问号?之前的扣除path*前的，但是path="/he"进入的props["*"]为未定义。
//浏览器一直请求http://localhost:3000/sockjs-node/598/zmptdxge/xhr_streaming是DEV开发模式的，热加载作用！，要和node服务器交互。
//弹性响应式布局，小屏幕要使用display:none隐藏非主要部分，突出关键部分，配合URL参数作逻辑区分。
//像组件嵌套一样，路由Route是可内嵌的，URL必须包括首先有父组件路由的根目录部分。其实路由Route和一般逻辑&&(?:)屏蔽一样。
//Route嵌套，首先父辈组件必须首先满足路由URL的正常可显示要求，会显示公共的部分界面，然后才是嵌套的子路由的专属部分的界面区域。
//组件的隐藏，组件的逻辑嵌入{　&& (　)}，很像路由；动态生成DOM的html代码送到浏览器，最后客户看到不同的界面部分可显示部分消失掉。
//钩子函数usexxx须放在组件代码顶部，不能放在逻辑分支语句底下，以确保组件范围都能执行钩子；但是组件的引用出处可放在逻辑分支条件内。
//单页面应用SPA，只在路由引用到了该组件，或者是Tab页只有在用户点击了之后，这时刻才真正执行代码和服务请求，客户端看见html/CSS代码是动态变化的。

