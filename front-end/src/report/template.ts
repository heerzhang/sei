import { Dispatch,  SetStateAction } from "react";
import * as React from "react";
import { useCollapse } from "customize-easy-ui-component";
import { ItemControlProps } from "./comp/base";


//模板文件名规则${path}.O-1 原始记录； 审核定稿组件 .A； 正式报告. R；
//动态加载给定类型的模板性质页面。　setProjectList回调。
//function loadTemplate(path:  string, setTemplate: Dispatch<SetStateAction<any>>)
export function loadTemplate(path:  string, verId: string) {
  let template=null;
  //import参数变量，会被替换为【.*】；  不可这么写 import(path) 这是无效的。
  //特别注意!! 这里path不是调用本函数的那个文件路径；根据本函数代码所在的文件路径来查找的相对路径,。
  import(`${path}.O-1`).then(module => {
    if(module.originalTemplate===undefined)
      throw new Error(`没找到O模板入口组件${path}`);
    if(module.reportTemplate===undefined)
      throw new Error(`没找到R模板入口组件${path}`);

     template={original: module.originalTemplate, report: module.reportTemplate};
    })
    .catch(error => {
      throw new Error(`错误导致后续操作模板查找失败${error}`);
    });
  return  template;
}

/*
export　function useLoadTemplate(path:  string, verId: string) {
  const [template, setTemplate] = React.useState(null as any);
  //import参数变量，会被替换为【.*】；  不可这么写 import(path) 这是无效的。
  //特别注意!! 这里path不是调用本函数的那个文件路径；根据本函数代码所在的文件路径来查找的相对路径,。
  import(`${path}.O-${verId}`).then(module => {
    if(module.originalTemplate===undefined)
      throw new Error(`没找到O模板入口组件${path}`);
    if(module.reportTemplate===undefined)
      throw new Error(`没找到R模板入口组件${path}`);
    setTemplate({original: module.originalTemplate, report: module.reportTemplate});
  })
    .catch(error => {
      throw new Error(`错误导致后续操作模板查找失败${error}`);
    });

  return  template;
}
*/
