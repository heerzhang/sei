//import * as firebase from "firebase/app";
//import "firebase/firestore";
//import "firebase/auth";
//import config from "./firebase-config";
import debug from "debug";
//import omitBy from "lodash.omitby";
//import isNil from "lodash.isnil";
//import { Ingredient } from "./RecipeList";

import {gql, useMutation, useQuery } from "@apollo/client";
import * as React from "react";
//import { Context, RefetchQueriesFunction } from "@apollo/react-common";
//import { client } from "./graphql/setup";

const log = debug("app:db");
log.log = console.log.bind(console);
//debug.log = console.info.bind(console);  //输出到


type UserType = {
  uid: string;
  id: string;   　　//后端的
  email?: string;
  displayName?: string;
  photoURL: string;
};




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
//  ingredients: Ingredient[];
}

const CREATE_DEVICE = gql`
  mutation CREATE_DEVICE($cod: String!,$oid: String!) {
    newEQP(cod: $cod,type:"3",oid: $oid) {
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
  const [submitfunc, {error,}] = useMutation(CREATE_DEVICE, {
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
/* useMutation 第二参数列表
  update?: MutationUpdaterFn<TData>;     报错的不一定执行这。 mutationResult.data和data实际都是一样，就是触发回调的多个定制机会。
  onCompleted?: (data: TData) => void;　　最终确认成功应答的回调，它比update的运行时机更滞后onCompleted比update慢的多。
  optimisticResponse?: TData | ((vars: TVariables) => TData);   立刻返回数据
  refetchQueries?: Array<string | PureQueryOptions> | RefetchQueriesFunction;   附带的同步关联刷新；
  onError: ()=>{};  配置onError后， 外部函数就无法catch()到了;
*/


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




const GET_BOUND_DEVICES = gql`
  query findAllTaskFilter($filter: DeviceCommonInput,$offset:Int!,$limit:Int,$orderBy:String,$asc:Boolean) {
    list:findAllTaskFilter(filter: $filter,offset:$offset,limit:$limit,orderBy:$orderBy,asc:$asc) {
        id,dep,date,status,devs{
          id,cod,oid}
     }
  }
`;
//任务过滤；
//并针对该任务，查询该任务底下已绑定的设备列表［］。
export function useQueryBoundDevices(filter:any) {
  const { loading, error, data, fetchMore, refetch} = useQuery(GET_BOUND_DEVICES, {
    variables: { ...filter },
    notifyOnNetworkStatusChange: true
  });
  return {items:　data　&&　data.list && data.list[0] && data.list[0].devs,
      　error, loadMore:fetchMore, loading, refetch};
}

//从graphQL的后端 模型数据库服务器 取模型数据。
const GET_AUTHORS = gql`
  query findAllEQPsFilter($where: DeviceCommonInput!,$offset:Int!,$first:Int=10,$orderBy:String,$asc:Boolean=true) {
    author:findAllEQPsFilter(filter: $where,offset:$offset,first:$first,orderBy:$orderBy,asc:$asc) {
      id,cod,oid,type
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

 // const key = toUser ? "toUserId" : "fromUserId";

  console.log("useFollowers无法即可刷新？="+ JSON.stringify(toUser) );
  const { loading,  data,  } = useQuery(GET_FOLLOWS, {
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


const DISPATCH_ISP_MEN = gql`
    mutation DISPATCH_ISP_MEN(
        $dev: ID!
        $task: ID!
        $username: String!
    ) {
    buildISP(dev: $dev, task: $task,username: $username) {
        id
        dev{id cod}
        task{id}
        ispMen{id username}
        conclusion
    }
    }
`;

//适配封装层：针对不同类型接口(REST,graphql,等?)，都对外统一处理。
//事务更新处理类型： 附带更新getISPofDevTask没用，不在挂载状态组件内就不会去查了。
//派工 生成ISP;     检验的列表findAllUserFilter, 不是当前mount组件状态的查询，加了refetchQueries也没用。
export const useDispatchIspMen = (options) => {
  const [submit, {error, data, loading, called}] = useMutation( DISPATCH_ISP_MEN, {
    variables: {...options},
    refetchQueries:  ['getISPofDevTask','findAllUserFilter']
  })
  const { buildISP : result} = data||{};
  return { result ,submit, error, loading, called };
};


//从后端服务器获取任务列表。
const GET_TASKS = gql`
  query findAllTasks {
    task:findAllTasks {
        id,dep,date,status,devs{
          id,cod,oid}
     }
  }
`;
//底下refetch可用于紧急手动刷新＝刷新URL一样的， 底层缓存机制与自动更新界面很慢。
export function usePaginateQueryTask(filter:any) {
  const { loading, error, data, fetchMore, refetch} = useQuery(GET_TASKS, {
    variables: { ...filter },
    notifyOnNetworkStatusChange: true
  });
  return {items:　data　&&　data.task,　error, loadMore:fetchMore, loading, refetch};
}
//useQuery输出包含：'startPolling' 'subscribeToMore' | 'refetch' | 'variables'> +fetchMore；　输入第二参数：onCompleted?:　onError?: ；
//类似fetchMore，原型定义 refetch(variables) 立刻刷新；startPolling(pollInterval)；subscribeToMore(options{variables，updateQuery()})；　

const ISP＿OF_DEV_TASK = gql`
  query getISPofDevTask($dev: ID!,$task: ID!) {
    obj:getISPofDevTask(dev: $dev,task: $task) {
       id,conclusion,nextIspDate,checkMen{id,username},
       dev{id,cod,oid},ispMen{id,username},reps{id,no,path}
     }
  }
`;
//受到appollo缓存影响　　不加cache-and-network就无法刷新。
export function useLookIspOfDevTask(filter:any) {
  const { loading, error, data,  refetch} = useQuery(ISP＿OF_DEV_TASK, {
    variables: { ...filter },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network'
  });
  return {item: data&&data.obj, error, loading, refetch};
}

const CANCELLATION_TASK = gql`
    mutation cancellationTask(
        $taskid: ID! 
        $reason: String
    ) {
    res: cancellationTask(task: $taskid,  reason: $reason) 
    }
`;
//注销任务　
//同步更新任务列表: items靠上一层组件传入的。
export const useCancellationTask  = (options) => {
  const [submit, {error, data, loading, called}] = useMutation( CANCELLATION_TASK, {
    variables: {...options},
    refetchQueries:  ['DEVICE_BY_ID']
  })
  const { res : result} = data||{};
  return { result ,submit, error, loading, called };
};

