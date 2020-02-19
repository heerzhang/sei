import * as React from "react";
import { Dispatch,  SetStateAction } from "react";


export function loadTemplate(path:  string, setTemplate: Dispatch<SetStateAction<any>>) {
  //import参数变量，会被替换为【.*】；  不可这么写 import(path) 这是无效的。
  //特别注意!! 这里path不是调用本函数的那个文件路径；根据本函数代码所在的文件路径来查找的相对路径,。
  import(`${path}.O-1`).then(module => {
    if(module.myTemplate===undefined)
      throw new Error(`没找到模板入口组件${path}`);
    setTemplate(module.myTemplate);
  })
    .catch(error => {
      throw new Error(`动态查找模板路由失败${error}`);
    });
}


