//import * as firebase from "firebase/app";
//import "firebase/firestore";
//import "firebase/auth";
//import config from "./firebase-config";
import debug from "debug";
import omitBy from "lodash.omitby";
import isNil from "lodash.isnil";
//import { Ingredient } from "./RecipeList";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
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
/* useMutation 第二参数列表
  update?: MutationUpdaterFn<TData>;     报错的不一定执行这。 mutationResult.data和data实际都是一样，就是触发回调的多个定制机会。
  onCompleted?: (data: TData) => void;　　最终确认成功应答的回调，它比update的运行时机更滞后onCompleted比update慢的多。
  optimisticResponse?: TData | ((vars: TVariables) => TData);   立刻返回数据
  refetchQueries?: Array<string | PureQueryOptions> | RefetchQueriesFunction;   附带的同步关联刷新；
  onError: ()=>{};  配置onError后， 外部函数就无法catch()到了;
*/

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
  ingredients: any[];
}
/*
const updateEntry001 = (id: string, options: RecipeUpdateOptions) => {
  return db
    .collection("recipes")
    .doc(id)
    .update(omitBy(options, isNil));
};
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

// const [submitfunc, {error, data, loading, called}] = useMutation(UPDATE_DEVICE_MUTATION, {
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

export const updateEntry0002 = (id: string, options: RecipeUpdateOptions) => {
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

const GET_BOUND_DEVICES = gql`
  query findAllTaskFilter($where: WhereTree,$offset:Int!,$first:Int,$orderBy:String,$asc:Boolean) {
    list:findAllTaskFilter(where: $where,offset:$offset,first:$first,orderBy:$orderBy,asc:$asc) {
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
  const { loading,  data, } = useQuery(GET_FOLLOWS, {
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
  const { loading, error, data, } = useQuery(DEVICE_BY_ID, {
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


/*
//从后端服务器获取任务列表。
const GET_TASKS_002 = gql`
  query findAllISPfilter($where: WhereTree,$offset:Int!,$first:Int=10,$orderBy:String,$asc:Boolean=true) {
    isp:findAllISPfilter(where: $where,offset:$offset,first:$first,orderBy:$orderBy,asc:$asc) {
        id,conclusion,nextIspDate,checkMen{id},
        dev{id,cod,oid},ispMen{id,username},reps{
        id,no,path}
     }
  }
`;
*/
const GET_TASKS = gql`
  query findAllUserFilter($where: WhereTree,$offset:Int!,$first:Int=10,$orderBy:String,$asc:Boolean=true) {
    user:findAllUserFilter(where: $where,offset:$offset,first:$first,orderBy:$orderBy,asc:$asc) {
      id,isp{
          id,conclusion,nextIspDate,checkMen{id},
          dev{id,cod,oid},ispMen{id,username},reps{id,no,path}
           } 
    }
  }
`;
const GET_CHECK_TASKS = gql`
  query findAllUserFilter($where: WhereTree,$offset:Int!,$first:Int=10,$orderBy:String,$asc:Boolean=true) {
    user:findAllUserFilter(where: $where,offset:$offset,first:$first,orderBy:$orderBy,asc:$asc) {
      id,checks{
          id,conclusion,nextIspDate,checkMen{id},
          dev{id,cod,oid},ispMen{id,username},reps{id,no,path}
           } 
    }
  }
`;
//底下refetch可用于紧急手动刷新＝刷新URL一样的， 底层缓存机制与自动更新界面很慢。
export function usePaginateQueryTask(filter:any, check:boolean) {
  const { loading, error, data, fetchMore, refetch} = useQuery(check? GET_CHECK_TASKS:GET_TASKS, {
    variables: { ...filter },
    notifyOnNetworkStatusChange: true
  });
  return {items:　data　&&　data.user && data.user[0] && (check? data.user[0].checks : data.user[0].isp),
      　error, loadMore:fetchMore, loading, refetch};
}

const GET_ISP_DETAIL = gql`
  query getISP($id: ID!) {
    isp:getISP(id: $id) {
       id,conclusion,nextIspDate,checkMen{id,username},
       dev{id,cod,oid},ispMen{id,username},reps{id,no,path}
    }
  }
`;
//底下refetch可用于紧急手动刷新＝刷新URL一样的， 底层缓存机制与自动更新界面很慢。
export function useIspDetail(filter:any) {
  const { loading, error, data,  refetch} = useQuery(GET_ISP_DETAIL, {
    variables: { ...filter },
    notifyOnNetworkStatusChange: true
  });
  return {items:　data　&&　data.isp,
    error, loading, refetch};
}

const GET_REPORT = gql`
  query getReport($id: ID!) {
    rep:getReport(id: $id) {
       id,type,no,upLoadDate,path,detail,isp{
        id,nextIspDate,conclusion,dev{
          id,cod,oid,type,factoryNo,pos{id,address}, ownerUnt{
            id,name,linkMen} 
        } 
      },
    }
  }
`;
// const { loading, error, data, fetchMore, refetch} = useQuery(GET_REPORT, {
//底下refetch可用于紧急手动刷新＝刷新URL一样的， 底层缓存机制与自动更新界面很慢。
export function useReport(filter:any) {
  const { loading, error, data,  refetch} = useQuery(GET_REPORT, {
    variables: { ...filter },
    notifyOnNetworkStatusChange: true
  });
  return {items:　data　&&　data.rep,
    error, loading, refetch};
}
/*
const DISPATCH_ISP_MEN2 = gql`
    mutation modifyOriginalRecordFiles(
        $id: ID!
        $fileIDs: [ID]!
    ) {
    modifyOriginalRecordFiles(id: $id, fileIDs: $fileIDs) {
        id
        data
        files{id url}
        modeltype
        isp{id}
    }
    }
`;
*/
const DISPATCH_ISP_MEN = gql`
    mutation modifyOriginalRecordData(
        $id: ID! 
        $operationType:Int!
        $data: String
        $deduction: String
    ) {
    res: modifyOriginalRecordData(id: $id, operationType: $operationType, data: $data, deduction: $deduction) {
        id
        data
        files{id url}
        modeltype
        isp{id}
    }
    }
`;
/*
const DISPATCH_ISP_MEN3 = gql`
    mutation newOriginalRecord(
        $modeltype: String!
        $modelversion: String!
        $isp: ID!
        $data: String
    ) {
    newOriginalRecord(modeltype: $modeltype, modelversion: $modelversion, isp: $isp, data: $data) {
        id
        data
        files{id url}
        modeltype
        isp{id}
    }
    }
`;
*/
//适配封装层：针对不同类型接口(REST,graphql,等?)，都对外统一处理。
//事务更新处理类型：
export const useCommitOriginalData = (options) => {
  //console.log("保 useCommitOriginalData @@ options=", options);
  const [submit, {error, data, loading, called}] = useMutation( DISPATCH_ISP_MEN, {
    variables: {...options},
  })
  const { res : result} = data||{};
  return { result ,submit, error, loading, called };
};


const GET_ORGINAL_RECORD = gql`
  query getOriginalRecord($id: ID! ) {
    all:getOriginalRecord(id: $id) {
        id
        data
        files{id url}
        modeltype
        isp{id}
    }
  }
`;
export function useQueryOriginalRecord(filter:any) {
  const { loading, error, data, fetchMore, refetch} = useQuery(GET_ORGINAL_RECORD, {
    variables: { ...filter },
    notifyOnNetworkStatusChange: true
  });
  return {items:　data && data.all ,
    error, loadMore:fetchMore, loading, refetch};
}

