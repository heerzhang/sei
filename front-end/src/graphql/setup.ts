import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
//import { ApolloLink, from, split, concat } from 'apollo-link';
import { ApolloLink,  split, concat } from 'apollo-link';
import { onError } from 'apollo-link-error';
//import { getOperationAST,OperationDefinitionNode } from 'graphql';
import { OperationDefinitionNode } from 'graphql';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { getMainDefinition } from 'apollo-utilities';

import session from '../utils/session';
import helpers from '../utils/helpers';


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


//const wsClient = new SubscriptionClient(`${process.env.WS_URL}/graphql`, {
const wsClient = new SubscriptionClient(`ws://localhost:3000/graphql`, {
  connectionParams: {
    authorization: `Bearer ${session.get()}` || null
  },
  //reconnect: true   不支持ws
  reconnect: false
});

const wsLink = new WebSocketLink(wsClient);

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

