//import * as firebase from "firebase/app";
//import "firebase/auth";
import { useContext, useState } from "react";
import { userContext } from "./user-context";
//import { useMutation, useQuery } from "@apollo/react-hooks";
import { useMutation,  } from "@apollo/react-hooks";
import gql from "graphql-tag";

//const provider = new firebase.auth.GoogleAuthProvider();

export const useSession = () => {
  const { user, loading } = useContext(userContext);
  return  { user, loading };
};
/*
export const loginWithGoogle = async () => {
  try {
    const result = await firebase.auth().signInWithPopup(provider);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const github = new firebase.auth.GithubAuthProvider();

export const loginWithGithub = async () => {
  try {
    const result = await firebase.auth().signInWithPopup(github);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const results = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const createUserWithEmail = async (email: string, password: string) => {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
*/

//export const signOut = () => firebase.auth().signOut();

//注销
const CREATE_SIGNOUT = gql`
  mutation logout {
    logout
  }
`;

export function useSignOut(funcCall) {
  const [logging, setLogging] = useState(true);
  const [userList, setUserList] = useState([]);
  const [createPost, {error, }] = useMutation(CREATE_SIGNOUT, {
    update: (proxy, mutationResult) => {
      const newPost = mutationResult.data.logout;
      console.log("useSignOut返回=" + JSON.stringify(mutationResult.data) + newPost);
      setUserList( [JSON.stringify(mutationResult.data)] );
      setLogging(false);
      funcCall();
    }
  })
  return { logging,setLogging, userList ,submitfunc:createPost,error　};
}

//登录
const CREATE_POST = gql`
  mutation createPost($name: String!, $password: String!) {
    authenticate(username: $name, password: $password) 
  }
`;

//react钩子的使用方法规定，用法严格规定，只能在FC函数组件的开头时用的。
export function useLoginToServer(form:any) {
  //const user = useSession();

  const [logging, setLogging] = useState(true);
  const [userList, setUserList] = useState([]);
  const name =form.email;
  const password =form.password;

  const [createPost, {error, }] = useMutation(CREATE_POST, {
    variables: {name, password},
    update: (proxy, mutationResult) => {
      //const newPost = mutationResult.data.createPost;     //新的一条,登录ok；　　.data.createPost;
      console.log("loginWithEmDGD update返回Q=" ,mutationResult.data );
      setUserList( [JSON.stringify(mutationResult.data)] );
      setLogging(false);
    }
  })

  //const client = useApolloClient();
  // console.log('AC instance stored in the Context', client);
  /*   没有必要这个的！：
  React.useEffect(() => {
    setLoading(true);

  }, [createPost]);
  */

  return { logging,setLogging, userList ,submitfunc:createPost,error　};
}

