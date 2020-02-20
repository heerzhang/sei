/** @jsx jsx */
import { jsx,  } from "@emotion/core";
import * as React from "react";
import { ReportView } from "./PeriodicalInspection.R-1";
import { OriginalView } from "./PeriodicalInspection.O-1";

//模板的动态加载入口文件。
//模板定义实例；这2个输出名字不能改。
export  const  originalTemplate= <OriginalView inp={null} action='none'/>;
export  const  reportTemplate= <ReportView source={null} />;

