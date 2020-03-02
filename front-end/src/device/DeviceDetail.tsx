/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
//import firebase from "firebase/app";
import { ComposeDevice } from "./ComposeDevice";
import { useSession } from "../auth";
//import { useDocument } from "react-firebase-hooks/firestore";
import { useTheme, Text } from "customize-easy-ui-component";


import { useDeviceDetail,  } from "./db";
import {  useRoute } from "wouter";

import { AttachedTask } from "./AttachedTask";



export interface RecipeProps {
  id: string;
  taskId?: string;    //通过组件参数传递的
}

//id 184213562 ;这个id是　云搜索algoliasearch内部生成的objectID:　竟然这样? http://localhost:3000/184213562 ？
export const DeviceDetail: React.FunctionComponent<RecipeProps> = ({ id, taskId }) => {
  const theme = useTheme();
  const {user,} = useSession();
  //设备 外部关联的 任务。
  const [matched, params] = useRoute("/device/:id/task/:taskId*");
  //const showingRecipe = matched && params.taskId;
  //var   value=null;
  const { loading ,data:value, error } = useDeviceDetail(id);
  id= params && params.id;
  //第一个render这里loading=true，要到第二次再执行到了这里才会有data数据!
  console.log("刚DeviceDetail经过taskId=",taskId,"进行中id=",id,"showingRecipe=",matched,params);

  if (loading) {
    return null;
  }


  if (error) {
    return (
      <Text
        muted
        css={{
          display: "block",
          padding: theme.spaces.lg,
          textAlign: "center"
        }}
      >
        Oh bummer! 查询设备详细， 报错.
      </Text>
    );
  }

  if (!loading && !value) {
    return null;
  }
  //菜谱内容: 富文本编辑器内容defaultDescription={x.description}
  if (value) {
    return (
      <div>
        <ComposeDevice
          readOnly={true}
          id={id}
          editable={true || value.createdBy.id === user.uid}
          //defaultCredit={value.author}
          //defaultDescription={value.description}
          defaultTitle={value.title}
          //defaultIngredients={ JSON.parse( value.ingredients ) }
          //defaultImage={value.image}
          dt={value}
          task={params && params.id}
        />

        <AttachedTask
          readOnly={true}
          id={id}
          editable={true || value.createdBy.id === user.uid}
          defaultTitle={value.title}
          dt={value}
        />
      </div>
    );
  }

  return null;
};



