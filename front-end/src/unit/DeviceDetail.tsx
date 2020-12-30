/** @jsxImportSource @emotion/react */
//import { jsx } from "@emotion/react";
import * as React from "react";
//import firebase from "firebase/app";
import { ComposeDevice } from "./ComposeDevice";
import { useSession } from "../auth";
//import { useDocument } from "react-firebase-hooks/firestore";
import {  Text } from "customize-easy-ui-component";
import {  useRoute } from "wouter";
import { AttachedTask } from "./AttachedTask";


interface DeviceDetailProps {
  id: string;
  eqp: any;
}
export const DeviceDetail: React.FunctionComponent<DeviceDetailProps> = ({ id, eqp }) => {
  //const theme = useTheme();
  const {user,} = useSession();
  //设备 外部关联的 任务。
  const [matched, params] = useRoute("/unit/:id/task/:taskId*");
  //const showingRecipe = matched && params.taskId;
  //var   value=null;
  //不要改组件的props带来的变量。
  //第一个render这里loading=true，要到第二次再执行到了这里才会有data数据!
  console.log("进入某单位=",eqp,"进行中id=",id,"showingRecipe=",matched,params);

  if(eqp) {
    return (
      <div>
        <ComposeDevice
          readOnly={true}
          id={id}
          //editable={true || eqp.createdBy.id === user.uid}
          //defaultIngredients={ JSON.parse( value.ingredients ) }
          dt={eqp}
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

  return <Text variant="h5">暂时查不到该设备</Text>;
};



