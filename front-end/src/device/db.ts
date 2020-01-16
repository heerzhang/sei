import * as React from "react";
import debug from "debug";


import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";



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
  mutation CREATE_DEVICE($cod: String!,$oid: String!) {
    newEQP(cod: $cod,type:"电梯4000",oid: $oid) {
      id cod oid
      pos {
       id address
      }
    }
  }
`;

//创立设备　
export const useCreateEntry = (filter) => {
  const [userList, setUserList] = React.useState(null);
  console.log("进入useCreateE-device.filter=",filter );
  const [submitfunc, {error, }] = useMutation(CREATE_DEVICE, {
    variables: {...filter},
    update: (proxy, mutationResult) => {
      const newPost = mutationResult.data.newEQP;     //新的一条,登录ok；　　.data.createPost;
      console.log("createEntry返回Q1=" + JSON.stringify(mutationResult.data) + newPost);
      setUserList( newPost );
    },
    onCompleted: (data) => {
      console.log("createEntry返回Q=Completed=" ,data );
    }
  })
  return { userList ,submitfunc,error　};
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
  console.log("进入useUpdateEntry.filter=",options );
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




//从graphQL的后端 模型数据库服务器 取模型数据。
const GET_DEVICES = gql`
  query findAllEQPsFilter($where: WhereTree,$offset:Int!,$first:Int=10,$orderBy:String,$asc:Boolean=true) {
    dev:findAllEQPsFilter(where: $where,offset:$offset,first:$first,orderBy:$orderBy,asc:$asc) {
      id,cod,oid,type
     }
  }
`;
//著者-用户列表。
export function usePaginateQueryDevice(filter:any) {
  const { loading, error, data, fetchMore, refetch} = useQuery(GET_DEVICES, {
    variables: { ...filter },
    notifyOnNetworkStatusChange: true
  });
  return {items:　data　&&　data.dev,
    error, loading, refetch, fetchMore};
}



const DEVICE_BY_ID = gql`
	query DEVICE_BY_ID($id:ID!){
		getDeviceSelf(id:$id){
			id,oid,cod,isps{
				id
			},pos{
				id,address
			},ownerUnt{
				id,name
			},task{
				id,date,dep,status
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
export const useAddToTask = (options) => {
  const [submit, {error, data, loading, called}] = useMutation( BUILD_TASK, {
    variables: {...options},
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
