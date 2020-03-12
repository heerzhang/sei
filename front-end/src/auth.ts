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

const LOGIN_TO_SERVER = gql`
  mutation createPost($username: String!, $password: String!) {
   res: authenticate(username: $username, password: $password) 
  }
`;
//登录
export const useLoginToServer  = (options) => {
  const [submit, {error, data, loading, called}] = useMutation( LOGIN_TO_SERVER, {
    variables: {...options}
  })
  const { res : result} = data||{};
  return { result ,submit, error, loading, called };
};

const REGISTER_TO_SERVER = gql`
  mutation newUser($username: String!, $password: String!, $mobile: String!, $external: String
         , $eName: String, $ePassword: String) 
  {
   res: newUser(username: $username, password: $password, mobile: $mobile, external: $external
         , eName: $eName, ePassword: $ePassword) 
  }
`;
//账户申请
export const useRegisterToServer  = (options) => {
  const [submit, {error, data, loading, called}] = useMutation( REGISTER_TO_SERVER, {
    variables: {...options}
  })
  const { res : result} = data||{};
  return { result ,submit, error, loading, called };
};

