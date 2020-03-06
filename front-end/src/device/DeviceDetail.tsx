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



export interface DeviceDetailProps {
  id: string;
  eqp: any;
}
export const DeviceDetail: React.FunctionComponent<DeviceDetailProps> = ({ id, eqp }) => {
  const theme = useTheme();
  const {user,} = useSession();
  //设备 外部关联的 任务。
  const [matched, params] = useRoute("/device/:id/task/:taskId*");
  //const showingRecipe = matched && params.taskId;
  //var   value=null;
  //不要改组件的props带来的变量。
  //第一个render这里loading=true，要到第二次再执行到了这里才会有data数据!
  console.log("刚DeviceDetail经过taskId=",eqp,"进行中id=",id,"showingRecipe=",matched,params);

  //菜谱内容: 富文本编辑器内容defaultDescription={x.description}
  if (eqp) {
    return (
      <div>
        <ComposeDevice
          readOnly={true}
          id={id}
          editable={true || eqp.createdBy.id === user.uid}
          //defaultCredit={value.author}
          //defaultDescription={value.description}
          defaultTitle={eqp.title}
          //defaultIngredients={ JSON.parse( value.ingredients ) }
          //defaultImage={value.image}
          dt={eqp}
          task={params && params.id}
        />

        <AttachedTask
          readOnly={true}
          id={id}
          editable={true || eqp.createdBy.id === user.uid}
          defaultTitle={eqp.title}
          eqp={eqp}
        />
      </div>
    );
  }

  return null;
};



