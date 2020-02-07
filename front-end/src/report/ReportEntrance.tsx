/** @jsx jsx */
import { jsx} from "@emotion/core";
import * as React from "react";
//import {  useTheme } from "customize-easy-ui-component";

//import { globalHistory  } from "@reach/router";
//import omit from "lodash.omit";
import PrintReport from "./PrintReport";
import { useMedia } from "use-media";


export default function ReportEntrance({name},props) {

  //没办法：无法使用hook来打印，只好放在外部包裹一层了；<PrintReport/>状态需要稳定输出，否则需要处理打印摇摆的异常。
  //const printSizeW = useMedia('print');  这个printSizeW在打印场景时会摇摆，先是true然后变false。打印预览useMedia最终看到false。

  //可打印预览时刻：这下面两个互怼的<PrintReport 两个组件实际都会同时挂载，都运行甚至运行log时间是交错的；打印预览不仅打印，还同时会更新网页。
  //打印预览实际是根据当前页面最新状态去打印的。【特别注意】包括动态特征的显示！点击也算；打印实际不是从刷新页面后才去照搬的。
  return (
    <React.Fragment>

        <PrintReport />

    </React.Fragment>
  );
}



/*
制作模板尺寸格式 <Table fixed={isPrint? ["150px", "300px", "15%", "15%", "50px"] : undefined}>
   实际表格尺寸会被调整；其中x%部分会优先分配的，150px实际也会被调小调大，不限定的"%"的{可变动很大！,最多用在某个列}。
   固定数100px会导致适应不同纸张和缩放比例后打印表格的各列尺寸变化较大！最好统一用％的相对尺寸设置。
*/
