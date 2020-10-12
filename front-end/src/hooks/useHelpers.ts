//import * as React from "react";
//import { useSession } from "../auth";
//import { useCollection } from "react-firebase-hooks/firestore";
//import * as firebase from "firebase/app";
import {gql,  useQuery } from "@apollo/client";

import * as React from "react";
//import debug from "debug";
//const log = debug("app:with-follow-requests");

/**
 * Get a list of unconfirmed follow requests,
 * used to notify a user.
 */
/*
export function useFollowRequests() {
  const {user,} = useSession();
  const { error, loading, value } = useCollection(
    firebase
      .firestore()
      .collection("relations")
      .where("toUserId", "==", user.uid)
      .where("confirmed", "==", false)
      .limit(50)
  );

  return {
    error,
    loading,
    value
  };
} */

const GET_FOLLOWS = gql`
  query useFollowing($toUser: Boolean!) {
    useFollowing(toUser: $toUser) {
      toUser{
        id,username,photoURL
      },fromUser{
        id,username,photoURL
      },confirmed
     }
  }
`;
/**
 * Get a list of followers, or users you
 * are following.
 * @param toUser boolean
 */
//export function useFollowers(toUser = true) {
//关注列表，或者被人关注队列--关系。  toUser=true本身被关注。
export function useFollowerIngs(toUser = true) {
  //const {user,} = useSession();
  var   value=null;
 // const [loading, setLoading] = React.useState(true);

 // const [userList, setUserList] = React.useState([]);

  //const key = toUser ? "toUserId" : "fromUserId";

  console.log("useFollowers无法即可刷新？="+ JSON.stringify(toUser) );
  const { loading, data,  } = useQuery(GET_FOLLOWS, {
    variables: { toUser },
    notifyOnNetworkStatusChange: true,
    //fetchPolicy:  'network-only'
  });

/*
  React.useEffect(() => {
    setLoading(true);

    const unsubcribe = firebase
      .firestore()
      .collection("relations")
      .where(key, "==", user.uid)
      .orderBy("confirmed")
      .limit(100) // todo: support pagination
      .onSnapshot(value => {
        const userList = [];

        value.docs.forEach(doc => {
          const data = doc.data();

          if (!data.fromUser) {
            return;
          }

          userList.push({
            id: doc.id,
            ...data
          });
        });

        log("setting user list: %o", userList);

        setUserList(userList);
        setLoading(false);
      });

    return () => unsubcribe();
  }, []);
*/
  if(!loading){
    if(data){
      const { useFollowing } = data;
      if(useFollowing){
         value = useFollowing;
        //setUserList(useFollowing); //报错React limits the number of renders to prevent an infinite loop.
       // console.log("以useFollowers从后端获得=" + JSON.stringify(useFollowing));
      }
    }
  }
  return { loading, userList:value };
}

//使用，页面切换会定时器执行报错unmount。
export function useThrottle222(fn, delay) {
  let timeoutId;
  const accumulator = [];
  const doFunc =(...args) => new Promise(resolve => {
    clearTimeout(timeoutId)

    accumulator.push(() => resolve({ hasResolved: false }))

    const execute = () => Promise.resolve(fn(...args))
      .then(value => {
        accumulator.pop()
        accumulator.forEach(fn => fn())
        accumulator.length = 0
        resolve({ hasResolved: true, value })
      })

    timeoutId = setTimeout(execute, delay)
  });

  React.useEffect(() => {
    return () => {
      clearTimeout(timeoutId);
    };
  }, [timeoutId]);
  return [doFunc, timeoutId];
}

//export function useThrottle(fn: Function, timeout: number = 1000) {

export function useThrottle333(fn, timeout) {
  const [ready, setReady] = React.useState(true);
  const timerRef = React.useRef(null);
/*
  if (!fn || typeof fn !== "function") {
    throw new Error(
      "As a first argument, you need to pass a function to useThrottle hook."
    );
  }
*/
  const throttledFn = React.useCallback(
    (...args) => {
      if(ready) {
        setReady(false);
        fn(...args);
      }
    },
    [ready, fn]
  );

  React.useEffect(() => {
    if (!ready) {
      timerRef.current = setTimeout(() => {
        setReady(true);
      }, timeout);
      return () => clearTimeout(timerRef.current);
    }
  }, [ready, timeout]);

  return [ready, throttledFn];
}

//"throttle-asynchronous": "^1.1.1",
//看了 "@rooks/use-throttle":"^3.6.0",
//防止频繁 按按钮！3000毫秒。　　fn　参数书写时不要加()的。
export function useThrottle(fn: Function, timeout: number = 3000) {
  //要把按钮使能开关ready一起做上。
  const [ready, setReady] = React.useState(true);
  const timerRef = React.useRef(null);
  const doFunc = React.useCallback(
    (...args) => {
      if(ready) {
        setReady(false);
        fn(...args);
      }
    },
    [ready, fn]
  );

  React.useEffect(() => {
    if (!ready) {
      timerRef.current = setTimeout(() => {
        setReady(true);
      }, timeout);
      //重要的，否则经常报错Can't perform a React state update on an unmounted。卸载了必须清理回调任务。
      return () => clearTimeout(timerRef.current);
    }
  }, [ready, timeout]);
  if (!fn || typeof fn !== "function")
          return {doFunc: void 0, ready};
  ///return [ready, throttledFn]; 数组的版本编译器容易报错！改成返回对象的搞。
  return {doFunc, ready};
}



