import { Dispatch,  SetStateAction } from "react";


//模板文件名规则${path}.O-1 原始记录； 审核定稿组件 .A； 正式报告. R；
//动态加载给定类型的模板性质页面。　setProjectList回调。
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


