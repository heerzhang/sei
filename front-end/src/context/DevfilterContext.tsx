/** @jsxImportSource @emotion/react */
//import { jsx, css } from "@emotion/react";
import * as React from "react";
import { Dispatch, SetStateAction } from "react";


//设备列表过滤器设置各个参数或逻辑。
interface EditStorageContextType {
  filter: any,
  setFilter: Dispatch<SetStateAction<any>>
}

//这是实例！   不要重复定义实例，确保访问的是同样一个的东东。
export const DevfilterContext = React.createContext<EditStorageContextType | null>(
  null
);

