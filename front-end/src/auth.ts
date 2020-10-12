//import * as firebase from "firebase/app";
//import "firebase/auth";
import { useContext, useState } from "react";
import { userContext } from "./user-context";
//import { useMutation, useQuery } from "@apollo/client";
import {gql, useMutation,  } from "@apollo/client";


//密码hash 防止在服务后台泄密
var sha256 = require('hash.js/lib/hash/sha/256');

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

//登录：后端最大只能支持72个字符密码长度！ sha256= 加密后的字节为: 32个,再转化十六进制HEX输出为:64个；SHA-256比MD5和SHA-1更安全。
export const useLoginToServer  = (options) => {
  let encodePass=sha256().update(options.password).digest('hex');
  const [submit, {error, data, loading, called}] = useMutation( LOGIN_TO_SERVER, {
    variables: {...options, password:encodePass}
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
//账户申请：　encodePass前端hash防止后端恶意获取明文的口令，保护用户秘密。
export const useRegisterToServer  = (options) => {
  let encodePass=sha256().update(options.password).digest('hex');
  const [submit, {error, data, loading, called}] = useMutation( REGISTER_TO_SERVER, {
    variables: {...options, password:encodePass}
  })
  const { res : result} = data||{};
  return { result ,submit, error, loading, called };
};

