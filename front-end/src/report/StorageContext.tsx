
//import { jsx, css } from "@emotion/react";
import * as React from "react";


import { Dispatch, SetStateAction } from "react";


//当作，模板在线文档的编辑数据的，临时存储。 子组件需要监听变化的数据。
interface EditStorageContextType {
  storage: any,
  setStorage: Dispatch<SetStateAction<any>>
}

//这是实例！   不要重复定义实例，确保访问的是同样一个的东东。
export const EditStorageContext = React.createContext<EditStorageContextType | null>(
  null
);



