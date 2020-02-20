/** @jsx jsx */
import { jsx,  } from "@emotion/core";
import * as React from "react";
import { ReportView } from "./PeriodicalInspection.R-1";
import { OriginalView } from "./PeriodicalInspection.O-1";

//模板的动态加载入口文件。
//版本号verId  "1" "2"  再一次做个 订制的路由。
//新版本号启动必要性？ 老版本几年后消亡？为啥新建版本号啊？。 实际可以照verId逻辑区分来做。 也可以选择新定义组件模式， 都能支持。
export  const  reportTemplate={
  "1": <ReportView source={null} verId={'1'}/>,
  "2":  null,
};

//2大类用途的模板定义实例；这2个输出名字不能改。
export  const  originalTemplate={
  "1": <OriginalView inp={null} action='none' verId={'1'}/>,
  "2":  null,
};


