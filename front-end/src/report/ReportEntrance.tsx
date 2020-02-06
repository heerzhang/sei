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
  //const printSizeW = useMedia('print');  这个printSizeW在打印场景时会摇摆，先是true然后变成=>false了。

  return (
    <React.Fragment>
      <div css={{
         "@media print": {
          display: "none"
        }
         }}
      >
        <PrintReport  />
      </div>
      <div css={{
        "@media screen": {
          display: "none"
        }
         }}
      >
        <PrintReport printing />
      </div>
    </React.Fragment>
  );
}



/*
制作模板尺寸格式 <Table fixed={isPrint? ["150px", "300px", "15%", "15%", "50px"] : undefined}>
   实际表格尺寸会被调整；其中x%部分会优先分配的，150px实际也会被调小调大，不限定的"%"的{可变动很大！,最多用在某个列}。
   固定数100px会导致适应不同纸张和缩放比例后打印表格的各列尺寸变化较大！最好统一用％的相对尺寸设置。
*/
