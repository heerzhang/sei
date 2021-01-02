//import * as firebase from "firebase/app";
//import "firebase/firestore";
//import "firebase/auth";
//import config from "./firebase-config";
import debug from "debug";
//import omitBy from "lodash.omitby";
//import isNil from "lodash.isnil";
//import { Ingredient } from "./RecipeList";

import {gql, useMutation, useQuery } from "@apollo/client";
//import { StackItem } from "react-gesture-stack";
//import * as React from "react";
//import * as React from "react";

//import { client } from "./graphql/setup";

const log = debug("app:db");
log.log = console.log.bind(console);


const DEVICE_BY_ID = gql`
  query DEVICE_EQPCOD_QUERY($id: ID!) {
    getDeviceSelf(id: $id) {
      id oid cod isps {
        id
      } pos {
        id address
      } ownerUnt {
        id name
      }
    } 
  }
`;

export function useDeviceDetail( id ) {
  var value = null;
  console.log("Recipe页面id=" + JSON.stringify(id));
  const { loading, error, data,  } = useQuery(DEVICE_BY_ID, {
    variables: { id },
    notifyOnNetworkStatusChange: true
  });
//第一个render这里loading=true，要到第二次再执行到了这里才会有data数据!
  console.log("刚Recipe经过" + JSON.stringify(data) + "进行中" + JSON.stringify(loading));

  if (!loading) {
    if (data) {
      const { getDeviceSelf: recipe } = data;
      if (recipe) {
        value = recipe;
        //  authjs = JSON.parse(user);
        //setAuthj(authjs); 报错！//React limits the number of renders to prevent an infinite loop.
        console.log("以Recipe从后端获得=" + JSON.stringify(value),"函数：",'useDeviceDetail');
        return { loading,error, data:recipe };
      }
    }
  }
  //可能有数据data但是同时errors[]存在的情况。
  return { loading,error, data:null };
}




//从后端服务器获取该ISP的所有子报告列表。
const GET_ISP＿REPORTS = gql`
  query getReportOfISP($id: ID!) {
    reps:getReportOfISP(id: $id) {
        id,type,no,upLoadDate,path
     }
  }
`;
//底下refetch可用于紧急手动刷新＝刷新URL一样的， 底层缓存机制与自动更新界面很慢。
export function useLookReports(filter:any) {
  const { loading, error, data, fetchMore, refetch} = useQuery(GET_ISP＿REPORTS, {
    variables: { ...filter },
    notifyOnNetworkStatusChange: true
  });
  return {items:　data　&&　data.reps,　error, loadMore:fetchMore, loading, refetch};
}

//useQuery输出包含：'startPolling' 'subscribeToMore' | 'refetch' | 'variables'> +fetchMore；　输入第二参数：onCompleted?:　onError?: ；
//类似fetchMore，原型定义 refetch(variables) 立刻刷新；startPolling(pollInterval)；subscribeToMore(options{variables，updateQuery()})；　

const DELETE_REPORT = gql`
    mutation deleteReport(
        $repId: ID! 
        $reason: String
    ) {
    res: deleteReport(repId: $repId,  reason: $reason) 
    }
`;
//删除一份报告
//这里用refetchQueries:  ['findAllUserFilter']不好使的，无法让上一级列表即刻刷新。因为该<StackItem>组件内容不是由它查来的。
export const useDeleteReport  = (options) => {
  const [submit, {error, data, loading, called}] = useMutation( DELETE_REPORT, {
    variables: {...options},
    refetchQueries:  ['getReportOfISP']
  })
  const { res : result} = data||{};
  return { result ,submit, error, loading, called };
};

const NEW_REPORT = gql`
    mutation newReport(
        $isp: ID! 
        $type: String!
        $version: String
    ) {
    res: newReport(isp: $isp, modeltype: $type, modelversion: $version) {
      id, no  upLoadDate
    }
    }
`;
//增加新的报告
export const useNewReport  = (options) => {
  const [submit, {error, data, loading, called}] = useMutation( NEW_REPORT, {
    variables: {...options},
    refetchQueries:  ['getReportOfISP']
  });
  const { res : result} = data||{};
  return { result ,submit, error, loading, called };
};

//点击触发更新：同一个文件内gql` query getReportOfISP；同时当前路由页面内挂载着的；并非直接上级组件内的query能立刻更新，而两个组件实际毫无嵌套关系的。

