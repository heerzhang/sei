import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
//import { ApolloLink, from, split, concat } from 'apollo-link';
import { ApolloLink,  split, concat ,empty } from 'apollo-link';
import { onError } from 'apollo-link-error';
//import { getOperationAST,OperationDefinitionNode } from 'graphql';
import { OperationDefinitionNode } from 'graphql';
//import { WebSocketLink } from 'apollo-link-ws';
//import { SubscriptionClient } from 'subscriptions-transport-ws';
import { getMainDefinition } from 'apollo-utilities';

//import session from '../utils/session';
import helpers from '../utils/helpers';
import { WebSocketLink } from 'apollo-link-ws';

//最后端服务器 不支持前端浏览器js去直接读取cookie；否则无法执行下去`Bearer ${session.get()}` 。

const authMiddleware = new ApolloLink((operation: any, forward: any) => {
  operation.setContext({
    headers: {
      //authorization: `Bearer heh23432432432bb`
    }
  });

  return forward && forward(operation);
});

//去掉了authorization: `Bearer heh23432432432bb` 直接通过cookie的名字token的键值对送给服务器。虽然后端也支持前一种模式。
//authorization: `Bearer ${session.get()}` || null

//ApolloClient连接的ws://  wss://， 后端graphQL服务还没有支持它：订阅功能;，先关掉。
//const wsClient = new SubscriptionClient(`${process.env.WS_URL}/graphql`, {
/*
const wsClient = new SubscriptionClient(`ws://localhost:3000/graphql`, {
  connectionParams: {
    authorization: `Bearer ${session.get()}` || null
  },
  //reconnect: true   不支持ws
  reconnect: false
});
*/

function ackCallBack(error, result){
  console.log("来ackCallBack error="+ JSON.stringify(error) +";result="+JSON.stringify(result));
}
//WebSocket认证特别，让Http认证过后，格外申请个一次性token并且特别用途目的coockieToken,让JS可以读取。

console.log("启动时已经有cookie=",document.cookie);
//对前端所有网页都能带上cookie, 跨域ws:/还能传递过去啊。  全局性质都会有增加cookie。
//这个是我直接写入cookie,并不是服务端给我的。
//这个仅仅对ws:/ WebSocketLink请求才有用的，正常graphql http:/ 请求实际不受这个影响的。
//document.cookie = 'token=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJoZXJ6aGFuZyIsImV4cCI6MTU4NjEyNjc1MywiaWF0IjoxNTg2MTIxMzUzfQ.ceX6DXgJEAoWK6qfajXWh6Nsf8vbB4Qa8gm9Dp0dkMp3NR5mxtN5gVC6LUQsYGXayyjifOuumc_GN9BwDGFAOg';

const wsLink = new WebSocketLink({
  uri: `ws://localhost:8673/subscriptions`,
  //credentials: 'include',  //不起作用！
  options: {
    reconnect: true,
    ///timeout: 30, 不可以加？，这样子，导致循环失败无休止。
    reconnectionAttempts: 5,
    connectionCallback: ackCallBack,
    lazy: false,
    inactivityTimeout: 90,
    //这里的token实际上针对ws协议自己的，它发生作用时间点是http握手Upgrade以后的事情。
    connectionParams: {
      //这里添加参数都是ws的数据包，对http包却是没任何用处。
      authToken: helpers.getToken(),
    }
  }
});

//const wsLink = new WebSocketLink(wsClient);       后端还不支持
//const wsLink = empty();         //空的链接。

const logoutLink = onError((e: any) => {
    const { networkError, graphQLErrors } = e;
    if (   (networkError && networkError.statusCode === 401)  ||
             (graphQLErrors && graphQLErrors.some((el: any) => el.message.statusCode === 401) )
      ) {
               helpers.logOut();
       }
});


const mainLink = logoutLink.concat(
  concat(authMiddleware, new HttpLink({ uri: `${process.env.REACT_APP_BACK_END}/graphql`,
      credentials: 'include'
      }
    )
  )
  //concat(authMiddleware, new HttpLink({ uri: `${process.env.API_URL}/graphql` }))
);


/* 不一样的包 import { HttpLink } from "apollo-boost";
new HttpLink({
  uri: "http://localhost:8083/graphql", // Server URL (must be absolute)
  opts: {
    credentials: "same-origin" // Additional fetch() options like `credentials` or `headers`
  }
})

const httpLink = new HttpLink({
    uri: __DEV__ ? devEndpoint : prodEndpoint,
    credentials: 'include',
  });
*/


const terminatingLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(
      query
    ) as OperationDefinitionNode;
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  mainLink
);

const link = ApolloLink.from([terminatingLink]);
//缓存似乎无时间限制；只要有一个Query页面能触发强制刷新：比如浏览器URL重置，全部的查询也都会得到更新，网页SPA性质。
export const  client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});


/* 旧版的；
export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: split(
    (operation: any) => {
      const operationAST = getOperationAST(operation.query, operation.operationName);
      return !!operationAST && operationAST.operation === 'subscription';
    },
    wsLink,
    mainLink
  )
});

同源策略：防止CORS攻击
Access to fetch at 'http://localhost:8083/graphql' from origin 'http://localhost:7789' has been blocked by CORS policy: Response to
preflight request doesn't pass access control check: The 'Access-Control-Allow-Origin' header has a value 'http://localhost:3000'
*/

