/** @jsxImportSource @emotion/react */
import * as React from "react";
import { Dispatch, SetStateAction } from "react";


//类比对话框机制，SPA页面路由切换，如何暂时保存当前编辑器的状态参数最新编辑数值，要确保路由返回各输入框还是用户新编辑的数值。
interface DialogEnterReturnType {
  //需要暂时保存在前端状态机的编辑器参数 json对象；
  ndt: any,
  setNdt: Dispatch<SetStateAction<any>>
}

//这是实例！   不要重复定义实例。
export const DialogEnterReturn = React.createContext<DialogEnterReturnType | null>(
  null
);

