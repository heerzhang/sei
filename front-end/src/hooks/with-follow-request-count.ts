//import * as React from "react";
//import { useSession } from "../auth";
//import { useCollection } from "react-firebase-hooks/firestore";
//import * as firebase from "firebase/app";
import {  useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
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
