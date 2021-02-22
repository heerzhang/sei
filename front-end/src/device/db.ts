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
  mutation CREATE_DEVICE($type: String!,$in: DeviceCommonInput!) {
    res: newEQP(type:$type,in: $in) {
      id cod oid type sort vart
        ... on Elevator {
            flo
        }
    }
  }
`;

//创立或导入设备　
export const useCreateDevice = (type, info) => {
  //console.log("创立导入设备CreateDevice @@ info=", in);
  const [submit, {error, data, loading, called}] = useMutation(CREATE_DEVICE, {
    variables: {type, in: info},
  })
  const { res : result} = data||{};
  return { result ,submit, error, loading, called };
};


const UPDATE_DEVICE_MUTATION = gql`
    mutation UPDATE_DEVICE_MUTATION($id: ID!,$unt: ID!,$in: DeviceCommonInput) {
    buildEQP(id: $id, owner: $unt, in: $in) {
      id cod oid type sort vart 
        ... on Elevator {
            flo,lesc
        }
    }
    }
`;

export const useUpdateDevice = (options) => {
  const [submit, {error, data, loading, called}] = useMutation( UPDATE_DEVICE_MUTATION, {
    variables: {...options},
    refetchQueries:  ['DEVICE_BY_ID']
  })
  const { buildEQP : result} = data||{};
  return { result ,submit, error, loading, called };
};



//从graphQL的后端 模型数据库服务器 取模型数据。
//3.2版本findAllEQPsFilter2不能再用dev:findAllEQPsFilter2这样子做别名了,cache typePolicies不支持。

/*const GET_DEVICES = gql`
  query findAllEQPsFilter($where: DeviceCommonInput,$offset:Int!,$limit:Int=10,$orderBy:String,$asc:Boolean=true) {
    findAllEQPsFilter(where: $where,offset:$offset,limit:$limit,orderBy:$orderBy,asc:$asc) {
      id cod oid type sort vart
     }
  }
`;
*/
const GET_DEVICES_ES = gql`
  query findAllEQPsFilter($where: DeviceCommonInput,$offset:Int!,$limit:Int=10,$orderBy:String,$asc:Boolean=true) {
    eqps:getAllEqpEsFilter(where: $where,offset:$offset,limit:$limit,orderBy:$orderBy,asc:$asc) {
      id cod oid type sort vart ust reg
     }
  }
`;

/*
       ... on IfElevator {
          liftHeight
        }
       ... on Eqp{
         factoryNo
       }
*/
//底下usePaginateQueryDevice有可能不会实际执行的，还参考接口参数变量的变化。
export function usePaginateQueryDevice(filter:any) {
  const { loading, error, data, updateQuery,
       fetchMore, refetch} = useQuery(GET_DEVICES_ES, {
    variables: { ...filter },
    notifyOnNetworkStatusChange: true,
    partialRefetch: true,    //没效果
    //returnPartialData: false 没效果
  });
  return {items:　data　&&　data.eqps,
    error, loading, refetch, fetchMore, updateQuery};
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

/*
    all:getDeviceSelf(id: $id) {
			id,oid,cod,isps{
				id
			},pos{
				id,name
			},useu{
				id,name
			},task{
				id,date,dep,status,isps{ id,dev{id} }
			}
		}
*/
//這若id='new'的照样能发送给后端的底层去处理的。 id=null undefined就不发送。
const DEVICE_BY_ID = gql`
  query DEVICE_BY_ID($id: ID! ) {
    all:getDeviceSelf(id: $id) {
			id,oid,cod,type,sort,vart,  
      ... on Elevator {  svp,pa,
          flo,spec,nnor,oldb,vl,hlf,lesc,wesc,cpm,tm,mtm,buff,rtl,aap,prot,
          doop,limm,opm,lbkd,nbkd,cpa,vital
      }
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

