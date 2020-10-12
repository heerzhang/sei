//import * as firebase from "firebase/app";
//import "firebase/firestore";
//import "firebase/auth";
//import config from "./firebase-config";
import debug from "debug";
import omitBy from "lodash.omitby";
import isNil from "lodash.isnil";
import { Ingredient } from "./RecipeList";

import {gql, useMutation, useQuery } from "@apollo/client";
import * as React from "react";
//import { client } from "./graphql/setup";

const log = debug("app:db");
log.log = console.log.bind(console);
//debug.log = console.info.bind(console);  //输出到

/*谷歌云 删除,
firebase.initializeApp(config);
*/
//谷歌的firebase云数据库/云文件存储。

export const db =null;
/*谷歌云 删除, 否则 一堆的拒绝连接等
export const db = firebase.firestore();
*/
type UserType = {
  uid: string;
  id: string;   　　//后端的
  email?: string;
  displayName?: string;
  photoURL: string;
};
/*谷歌云 删除
db.enablePersistence().catch(function(err) {
  console.error(err);
});
*/

export function getUserFields(user: UserType) {
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL
  };
}
const CREATE_FOLLOW = gql`
  mutation requestFollow($fromUser: ID!, $toUser: ID!) {
    requestFollow(fromUser: $fromUser,toUser: $toUser)
  }
`;
//fromUser发起关注toUser
//export const requestFollow = (fromUser: UserType, toUser: UserType) => {
export const useRequestFollow = (fromUser: UserType, toUser: UserType) => {
  /*return db.collection("relations").add({
    fromUserId: fromUser.uid,
    toUserId: toUser.uid,
    fromUser: getUserFields(fromUser),
    toUser: getUserFields(toUser),
    confirmed: false
  }); */
  //const [options, setOptions] = React.useState(null);
  const [userList, setUserList] = React.useState(null);
  //console.log("进useRequestFollow User="+ JSON.stringify(fromUser) );
  const [createPost, {error, }] = useMutation(CREATE_FOLLOW, {
    variables: {fromUser: fromUser.id, toUser:toUser.id},
    update: (proxy, mutationResult) => {
      const newPost = mutationResult.data.requestFollow;     //新的一条,登录ok；　　.data.createPost;
      console.log("createEntry返回Q=" + JSON.stringify(mutationResult.data) + newPost);
      //setUserList( [JSON.stringify(mutationResult.data)] );
      setUserList( newPost );
    },
    //将会受此操作到影响的那些Query的也要同时刷新哦。
    refetchQueries:  ['useFollowing']
  })
  return { userList ,submitfunc:createPost,error　};
};

//export const deleteRequestFollow = (id: string) => {}
const KICKOUT_FOLLOW = gql`
  mutation dismissFollowOf($fromUser: ID!) {
    dismissFollowOf(fromUser: $fromUser)
  }
`;
export const useKickoutFollower = (id: string) => {
  log("delete relation: %s", id);
  console.log("useKickoutFollower　id是=",id );
  const [options, setOptions] = React.useState(null);
  let result=null;
  const [, setUserList] = React.useState(null);
  console.log("以useKickoutFollower options=" + JSON.stringify(options));
  const [createPost, {error, }] = useMutation(KICKOUT_FOLLOW, {
    variables: {fromUser:id},
    update: (proxy, mutationResult) => {
      const newPost = mutationResult.data.confirmFollow;
      console.log("useKickoutFollower返update=" ,mutationResult);
      setUserList( newPost );
      result=newPost;
    },
    refetchQueries:  ['useFollowing']
  })
  return {setOptions, result ,submitfunc:createPost, error　};
};

const DELETE_FOLLOW = gql`
  mutation delRequestFollow($toUser: ID!) {
    delRequestFollow(toUser: $toUser)
  }
`;
export const useDeleteRequestFollow = (id: string) => {
  log("delete relation: %s", id);
  console.log("deleteRequestFollow　id是=",id );
 /* return db
    .collection("relations")
    .doc(id)
    .delete()
    .then(() => {
      log("deleted: %s", id);
    })
    .catch(err => {
      log("failed to delete: %s", err);
      throw err;
    }); */
  const [options, setOptions] = React.useState(null);
  let result=null;
  const [, setUserList] = React.useState(null);
  console.log("以confirmFollow options=" + JSON.stringify(options));
  const [createPost, {error, }] = useMutation(DELETE_FOLLOW, {
    variables: {toUser:id},
    onCompleted: (data) => {
      //接口　onCompleted:　比update:　的运行时机更加滞后。update反而能早点获取应答；
      console.log("deleteRequestFollow返Completed=" ,data );
    },
    update: (proxy, mutationResult) => {
      const newPost = mutationResult.data.confirmFollow;
      console.log("deleteRequestFollow返update=" ,mutationResult);
      //setUserList( [JSON.stringify(mutationResult.data)] );
      setUserList( newPost );
      result=newPost;
    },
     //不更新refetchQueries的话，若用户不手动刷新就无法显示最新数据。
    refetchQueries:  ['useFollowing']
  })
  return {setOptions, result ,submitfunc:createPost, error　};
};

const CONFIRM_FOLLOW = gql`
  mutation confirmFollow($userId: ID!) {
    confirmFollow(userId: $userId)
  }
`;
//这id是用户id;
export const useConfirmFollow = () => {
  /*return db
    .collection("relations")
    .doc(id)
    .update({ confirmed: true });*/
  const [options, setOptions] = React.useState(null);
  const [userList, setUserList] = React.useState(null);
  console.log("以confirmFollow options=" + JSON.stringify(options));
  const [createPost, {error, }] = useMutation(CONFIRM_FOLLOW, {
    variables: {...options},
    onCompleted: (data) => {
      　　//接口　onCompleted:　比update:　的运行时机更加滞后。update反而能早点获取应答；
      console.log("观察useMutation返Completed=" + JSON.stringify(data) );
    },
    update: (proxy, mutationResult) => {
      const newPost = mutationResult.data.confirmFollow;
      console.log("观察useMutation返update=" + JSON.stringify(mutationResult.data) + newPost);
      //setUserList( [JSON.stringify(mutationResult.data)] );
      setUserList( newPost );
    },
    refetchQueries:  ['useFollowing']
  })
  return {setOptions, userList ,submitfunc:createPost,error　};
};

export interface RecipeOptions {
  title: string;
  plain: string;
  userId: string;
  description: string;
  image?: string;
  createdBy?: {
    email: string;
    photoURL: string;
  };
  author: string;
  ingredients: Ingredient[];
}

const CREATE_POST = gql`
  mutation newRecipe($title: String!, $author: String,$plain: String,$image: String,$ingredients: String,$description: String) {
    newRecipe(title: $title,author: $author,plain: $plain,image: $image,ingredients: $ingredients,description: $description){
    id
    } 
  }
`;

//创立菜谱
export const useCreateEntry = () => {
  /*var somex={
    ...omitBy(options, isNil),
    updatedAt: new Date()
  };
  log("save recipe: %o", options);
  console.log("进入somex="+ JSON.stringify(somex) );
  */
  const [options, setOptions] = React.useState(null);
  const [userList, setUserList] = React.useState(null);
  console.log("进入useCreateEntry="+ JSON.stringify(options) );
  const [createPost, {error, }] = useMutation(CREATE_POST, {
    variables: {...options},
    update: (proxy, mutationResult) => {
      const newPost = mutationResult.data.newRecipe;     //新的一条,登录ok；　　.data.createPost;
      console.log("createEntry返回Q=" + JSON.stringify(mutationResult.data) + newPost);
      //setUserList( [JSON.stringify(mutationResult.data)] );
      setUserList( newPost );
    }
  })
  return {setOptions, userList ,submitfunc:createPost,error　};
  /*return createPost;
  return db.collection("recipes").add({
    ...omitBy(options, isNil),
    updatedAt: new Date()
  });  */
};


interface RecipeUpdateOptions {
  title: string;
  author: string;
  description: string;
  image?: string;
  createdBy?: {
    email: string;
    photoURL: string;
  };
  plain: string;
  ingredients: Ingredient[];
}
/*
const updateEntry001 = (id: string, options: RecipeUpdateOptions) => {
  return db
    .collection("recipes")
    .doc(id)
    .update(omitBy(options, isNil));
};*/
export const updateEntry = (id: string, options: RecipeUpdateOptions) => {
  return db
    .collection("recipes")
    .doc(id)
    .update({
      ...omitBy(options, isNil),
      image: options.image
    });
};

export const deleteEntry = (id: string) => {
  log("delete: %s", id);
  return db
    .collection("recipes")
    .doc(id)
    .delete();
};

const GET_RECIPES = gql`
  query findAllRecipeFilter($where: WhereTree,$offset:Int!,$first:Int,$orderBy:String,$asc:Boolean) {
    recipe:findAllRecipeFilter(where: $where,offset:$offset,first:$first,orderBy:$orderBy,asc:$asc) {
      id,title,plain,author,image,ingredients,description,updatedAt,createdBy{
        id,username,photoURL
      }
     }
  }
`;

//菜谱列表。
export function usePaginateQueryRecipe(filter:any) {
  //var   value=null;
  console.log("usePaginateQueryRecipe进filter="+ JSON.stringify(filter) );
  const { loading, error, data, fetchMore, refetch } = useQuery(GET_RECIPES, {
    variables: { ...filter },
    notifyOnNetworkStatusChange: true
  });

  if(!loading){
    if(data){
      const { recipe } = data;
      if(recipe){
      //  value = recipe;
        //这里data.recipe所代表的数据，实际包含fetchMore分页查询每次新增加的数据数组，所有分页合并的数据。
        //console.log("usePaginateQueryRecipe从后端获得=" + JSON.stringify(value));
      }
    }
  }
  return { loading, items:data&&data.recipe, loadingError:error, loadMore:fetchMore ,refetch};
}

//从graphQL的后端 模型数据库服务器 取模型数据。
const GET_AUTHORS = gql`
  query findAllUserFilter($where: WhereTree,$offset:Int,$first:Int=10,$orderBy:String,$asc:Boolean=true) {
    author:findAllUserFilter(where: $where,offset:$offset,first:$first,orderBy:$orderBy,asc:$asc) {
      id,username,dep,mobile,enabled,photoURL
     }
  }
`;
//著者-用户列表。
export function usePaginateQueryUser(filter:any) {
  console.log("usePaginateQueryUser进filter="+ JSON.stringify(filter) );
  const { loading, error, data, fetchMore } = useQuery(GET_AUTHORS, {
    variables: { ...filter },
    notifyOnNetworkStatusChange: true
  });
  return { loading, loadingError:error,
      items: data && data.author,
     loadMore:fetchMore
  };
}

//作废！
const GET_FILEURL = gql`
  query getFileUrl($id: ID) {
    url:getFileUrl(id: $id) 
  }
`;
//作废！//以文件ID查询URL，+权限控制。
export function useQueryFileUrl(filter:any) {
  console.log("useQueryFileUrl进filter="+ JSON.stringify(filter) );
  const { loading, error, data, fetchMore } = useQuery(GET_FILEURL, {
    variables: { ...filter },
    notifyOnNetworkStatusChange: true
  });
  return { items: data && data.url, loadMore:fetchMore, loading, loadingError:error };
}


