/** @jsxImportSource @emotion/react */
//import { jsx,  } from "@emotion/react";
//import * as React from "react";
import { ReportView } from "./PeriodicalInspection.R-1";
import { OriginalView } from "./PeriodicalInspection.O-1";
//到这里　才真正接入最终的模板tsx文件。


//模板的动态加载入口文件。
//版本号verId  "1" "2"  再一次做个 订制的路由。
//新版本号启动必要性？ 老版本几年后消亡？为啥新建版本号啊？。 实际可以照verId逻辑区分来做。 也可以选择新定义组件模式， 都能支持。
export  const  reportTemplate={
  "1": <ReportView source={null} verId={'1'}/>,
  "2":  null,
};

//2大类用途的模板定义实例；这2个输出名字不能改。
//这里算模板的关键注入点：<OriginalView 实际相当于DOM实例的。每个报告类型＋版本号,实际引入的组件都不同；
export  const  originalTemplate={
  "1": <OriginalView inp={null} action='none' verId={'1'}/>,
  "2":  null,
};


