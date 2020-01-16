/** @jsx jsx */
import { jsx,  } from "@emotion/core";
//最早js的，改成tsx;
//import React, { useReducer,useEffect } from 'react';

//import ShopContext from './Shop-context';
//import { shopReducer, ADD_PRODUCT, REMOVE_PRODUCT } from './Reducers';
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { userContext } from "../user-context";

//这个模式无法实现预期 context。
//要超越该限制，就该要引入存储机制了：cookie /local storage /graphql缓存 /直接后端服务器读取。
//只能是本身页面之内的跳转，若是直接从浏览器那个地址栏输入切换URL的就会无法保留之前的状态数据＝被清空。
const GET_POSTS = gql`
  query AUTH {
    auth 
  }
`;

const GlobalState = props => {
  let user=null;
  //const [authj, setAuthj] = React.useState(null);
    //真正的清空，初始化！

  //利用Reducer做派遣动作的钩子
/*  const [cartState, dispatch] = useReducer(shopReducer, { cart: [] });

  const addProductToCart = product => {
    setTimeout(() => {
      dispatch({ type: ADD_PRODUCT, product: product });
    }, 200);
  };

  const removeProductFromCart = productId => {
    setTimeout(() => {
      dispatch({ type: REMOVE_PRODUCT, productId: productId });
    }, 200);
  };
*/


  //设置'cache-first'后，若是从浏览器地址栏直接刷新进入，还是会去后端服务器取最新数据的。
  const { loading, error, data } = useQuery(GET_POSTS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy:  'cache-first'
  });
      //第一个render这里loading=true，要到第二次再执行到了这里才会有data数据!
  console.log("刚GlobalStateQuery经过"+ JSON.stringify(data) +"进行中"+ JSON.stringify(loading));
  if(error)   throw new Error(`用户验证${error}`);
  if(!loading){
    if(data){
      const { auth: userJsonText }: { auth: string } = data;
      if(userJsonText){
        var   authjs=null;
        authjs = JSON.parse(userJsonText);
        if(authjs && authjs.id)    user=authjs;
        //setAuthj(authjs); 报错！//React limits the number of renders to prevent an infinite loop.
        console.log("以GlobalState1从后端获得=" + JSON.stringify(authjs),"user=",user);
      }
    }
  }
  //var authj=null;
      //若是把authj放在useEffect里面，就无法给Context.Provider初始化value/user了？
  /*
  useEffect(() => {
    if(data){
      const { auth:user }: { auth: any } = data;
      if(user){
        var  authjs = JSON.parse(user);
        setAuthj(authjs);
        console.log("以GlobalState2从后端获得=" + JSON.stringify(authjs));
      }
    }
  }, [loading, error]);
  */

  //初始化Provider,　钩子；
  //每一次的ｒｅｎｄｅｒ，这里都会变动value;
  //真正的清空，初始化！
  return (
    <userContext.Provider
      value={{
        user,
        loading
      }}
    >
      {props.children}
    </userContext.Provider>
  );
};


//<Router>套在<GlobalState>底下，所以鼠标点击在网页内切换页面不会再次运行GlobalState，除非是浏览器地址栏录入和手动刷新才会重新获取后端授权信息。

export default GlobalState;
