import * as React from "react";
import debug from "debug";

import {gql, useMutation, useQuery } from "@apollo/client";



const log = debug("app:db");
log.log = console.log.bind(console);


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
//  ingredients: Ingredient[];
}

const CREATE_DEVICE = gql`
  mutation CREATE_DEVICE($unit: UnitCommonInput!) {
    res: newUnitExternalSource(unit: $unit) {
      id  company{id name}, person {id name}
    }
  }
`;

//创立或导入设备　
export const useCreateDevice = (options) => {
  console.log("保 useCreateDevice @@ options=", options);
  const [submit, {error, data, loading, called}] = useMutation(CREATE_DEVICE, {
    variables: {...options},
  })
  const { res : result} = data||{};
  return { result ,submit, error, loading, called };
};


const UPDATE_DEVICE_MUTATION = gql`
    mutation UPDATE_DEVICE_MUTATION($id: ID!,$unt: ID!,$info: DeviceCommonInput) {
    buildEQP(id: $id, owner: $unt, info: $info) {
      id cod oid
      pos {
       id address
      } ownerUnt{ id name }
    }
    }
`;

export const useUpdateEntry = (options) => {
  const [result, setResult] = React.useState(null);
 // console.log("进入useUpdateEntry.filter=",options );
  const [submitfunc, {error, }] = useMutation(UPDATE_DEVICE_MUTATION, {
    variables: {...options},
    update: (proxy, mutationResult) => {
      const newPost = mutationResult.data.buildEQP;     //新的一条,登录ok；　　.data.createPost;
      console.log("useUpdateEntry返回Q1=" + JSON.stringify(mutationResult.data) + newPost);
      setResult( newPost );
    },
    onCompleted: (data) => {
      console.log("useUpdateEntry返回Q=Completed=" ,data );  //onCompleted比update慢的多。
    }
  })
  return { result ,submitfunc, error};
};



//代替外部或者微服务的，从外部维护为主的大库中找到某个人或企业的ID
//从graphQL的后端 模型数据库服务器 取模型数据。
const GET_DEVICES = gql`
  query findAllEQPsFilter($as: UnitCommonInput,$offset:Int!,$limit:Int=6) {
    res:getUnitEsFilter(as: $as,offset:$offset,limit:$limit) {
      ... on CompanyEs{
       id  name no
       }
      ... on PersonEs{
       id  name no
       }
     }
  }

`;
//著者-用户列表。
export function usePaginateQueryDevice(filter:any) {
  const { loading, error, data, fetchMore, refetch} = useQuery(GET_DEVICES, {
    variables: { ...filter },
    notifyOnNetworkStatusChange: true
  });
  return {items:　data　&&　data.res,
    error, loading, refetch, fetchMore};
}



const BUILD_TASK = gql`
mutation BUILD_TASK($devs: ID!,$dep: String!,$date: String!) {
  buildTask(devs: $devs,dep: $dep,date: $date) {
    id dep date
    devs {
      id
      cod
    }
  }
}
`;

//适配封装层：针对不同类型接口(REST,graphql,等?)，都对外统一处理。
//事务更新处理类型：
//立刻更新受到影响的页面，其数据来自DEVICE_BY_ID这个函数[可能多个，必须针对性的避免扩大化无效查询]。　
//这里refetchQueries:  ['DEVICE_BY_ID']不一定执行的，对应查询Hook与当前页面同时加载的组件场景下才能生效，查询需放在做更新组件的上级去。
export const useAddToTask = (options) => {
  const [submit, {error, data, loading, called}] = useMutation( BUILD_TASK, {
    variables: {...options},
    refetchQueries:  ['DEVICE_BY_ID']
  })
  const { buildTask : result} = data||{};
  return { result ,submit, error, loading, called };
};

const GET＿COUNT_TASK = gql`
  query countTask($dep: String,$status: String) {
    result:countTask(dep: $dep,status: $status) 
  }
`;
export function useCountOfTask(filter:any) {
  const { loading, error, data,  refetch} = useQuery(GET＿COUNT_TASK, {
    variables: { ...filter },
    notifyOnNetworkStatusChange: true
  });
  return {item: data&&data.result, error, loading, refetch};
}

const INVALIDATE_EQP = gql`
    mutation invalidateEQP($whichEqp: ID!, $reason: String!) {
      res: invalidateEQP(whichEqp: $whichEqp, reason: $reason)
    }
`;

export const useInvalidateEQP = (options) => {
  const [submit, {error, data, loading, called}] = useMutation( INVALIDATE_EQP, {
    variables: {...options},
  })
  const { res : result} = data||{};
  return { result ,submit, error, loading, called };
};

//這若id='new'的照样能发送给后端的底层去处理的。 id=null undefined就不发送。
const DEVICE_BY_ID = gql`
  query DEVICE_BY_ID($id: ID!,$company:Boolean) {
    all:getUnit(esid: $id, company:$company) {
			id, company {id,name,no}, person {id,name,no}
		}
	}
`;
///点击设备获取详细；
//cache-and-network参数＝每次点击都发起后端查询请求，但是同时cache也同时可用作替补来显示，断网时照样有数据用。缺省参数cache-first固执优先用cache旧数据。
export function useDeviceDetail(filter:any) {
  const { loading, error, data, fetchMore, refetch} = useQuery(DEVICE_BY_ID, {
    variables: { ...filter },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network'
  });
  return {items:　data && data.all ,
    error, loadMore:fetchMore, loading, refetch};
}

