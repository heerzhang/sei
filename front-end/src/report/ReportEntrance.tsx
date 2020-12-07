/** @jsxImportSource @emotion/react */
import { jsx} from "@emotion/react";
import * as React from "react";
//import { globalHistory  } from "@reach/router";
import { useQueryOriginalRecord } from "./db";
import { LayerLoading, Text } from "customize-easy-ui-component";
import { lazy } from "react";
import { WaitingComponent } from "../TopRouter";
import { EditStorageContext } from "./StorageContext";
import { useRoute } from "wouter";


const TemplateMain = WaitingComponent(lazy(() => import("./TemplateMain")));


export default function ReportEntrance({ name },props )
{
  const [match, params] = useRoute("/report/:template/ver/:verId/:action/:repId");
  let action = params &&  params.action;
  let id= params &&  params.repId;
  if(!match || !params || !params.template || !params.verId || !params.action || !id)
    throw new Error(`没路由了`);
  let filtercomp={ id: id };
  //refetch() 引起 loading= True/False变化，从而需要组件范围render重做搞2次。
  //若是浏览器后退前进的场景不会执行useQueryOriginalRecord代码，item已经有数据了，loading不会变化。
  const {loading,items, error} =useQueryOriginalRecord(filtercomp);
  const {storage, setStorage} =React.useContext(EditStorageContext);

  //外部dat不能加到依赖，变成死循环! const  dat =items&&items.data&&JSON.parse(items.data);  这dat每次render都变了？
  //从后端返回的数据可能items已经被修改了
  React.useEffect(() => {
    const  dat =items&&items.data&&JSON.parse(items.data);
    const  snap =items&&items.snapshot&&JSON.parse(items.snapshot);
    if(snap)   dat && setStorage({...dat, ...snap});
    else  dat && setStorage(dat);
  }, [items, setStorage]);

  console.log("ReportEntrance：捕获 ==storage=[",  storage,  "]items=", items ,"snap=", items&&items.snapshot);
  //const printSizeW = useMedia('print');  这个printSizeW在打印场景时会摇摆，先是true然后变false。打印预览useMedia最终看到false。
  //打印预览不仅打印，还同时会更新网页。打印预览实际是根据当前页面最新状态去打印的。【特别注意】包括动态特征的显示！点击也算；打印实际不是从刷新页面后才去照搬的。

  return (
    <React.Fragment>
      <LayerLoading loading={loading} label={'更新数据，加载中请稍后'}/>
       { storage && <TemplateMain  template={params.template} verId={params.verId} action={action}
                                id={id}  source={storage}
                />
       }
      {!loading && items &&!storage &&
        <Text>未初始化原始记录， 报告ID={id} </Text>
      }
      {!loading && !items &&
        <Text>没找到该份报告， 报告ID={id} </Text>
      }
      {error && error.message}
    </React.Fragment>
  );
}



/*
制作模板尺寸格式 <Table fixed={isPrint? ["150px", "300px", "15%", "15%", "50px"] : undefined}>
   实际表格尺寸会被调整；其中x%部分会优先分配的，150px实际也会被调小调大，不限定的"%"的{可变动很大！,最多用在某个列}。
   固定数100px会导致适应不同纸张和缩放比例后打印表格的各列尺寸变化较大！最好统一用％的相对尺寸设置。
*/
