/** @jsx jsx */
import { jsx} from "@emotion/core";
import * as React from "react";
//import {  useTheme } from "customize-easy-ui-component";

//import { globalHistory  } from "@reach/router";
//import omit from "lodash.omit";
import {PrintReport} from "./PrintReport";
import { useMedia } from "use-media";
import { useQueryOriginalRecord } from "../original/db";


export default function ReportEntrance({name},props) {
  let filtercomp={ id:227 };
  //refetch() 引起 loading= True/False变化，从而需要组件范围render重做搞2次。
  //若是浏览器后退前进的场景不会执行useQueryOriginalRecord代码，item已经有数据了，loading不会变化。
  const {loading,items, refetch } =useQueryOriginalRecord(filtercomp);
  const [inp, setInp] = React.useState(null);


  //外部dat不能加到依赖，变成死循环! const  dat =items&&items.data&&JSON.parse(items.data);  这dat每次render都变了？
  //从后端返回的数据可能items已经被修改了
  React.useEffect(() => {
    const  dat =items&&items.data&&JSON.parse(items.data);
    dat && setInp(dat);
  }, [items]);

  console.log("ReportEntrance：捕获 ==inp=[",  inp,  "]items=", items ,"loading=", loading);

  //const printSizeW = useMedia('print');  这个printSizeW在打印场景时会摇摆，先是true然后变false。打印预览useMedia最终看到false。
  //打印预览不仅打印，还同时会更新网页。打印预览实际是根据当前页面最新状态去打印的。【特别注意】包括动态特征的显示！点击也算；打印实际不是从刷新页面后才去照搬的。
  return (
    <React.Fragment>

        <PrintReport source={inp}/>

    </React.Fragment>
  );
}



/*
制作模板尺寸格式 <Table fixed={isPrint? ["150px", "300px", "15%", "15%", "50px"] : undefined}>
   实际表格尺寸会被调整；其中x%部分会优先分配的，150px实际也会被调小调大，不限定的"%"的{可变动很大！,最多用在某个列}。
   固定数100px会导致适应不同纸张和缩放比例后打印表格的各列尺寸变化较大！最好统一用％的相对尺寸设置。
*/
