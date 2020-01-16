/** @jsx jsx */
import { jsx,  } from "@emotion/core";
import * as React from "react";
import {
  useTheme,
  LayerLoading,
} from "customize-easy-ui-component";
import {  useLookIspOfDevTask } from "./db";
import {Helmet} from "react-helmet";
import {  useLocation } from "wouter";

//[HOOK限制]按钮点击函数内部直接上toast()或toaster.notify()很可能无法正常显示。而放在函数组件顶层render代码前却能正常。

//const log = debug("app:Compose");

export interface ComposeProps {
  //id?: string;
  defaultTitle?: string;
  defaultImage?: string;
  defaultDescription?: string;
  defaultIngredients?: any[];
  readOnly?: boolean;
  editable?: boolean;
  defaultCredit?: string;
  dt?:any;
  params?:any;   //上级路由器传入的参数。
}

/**
 * THIS IS A DISASTER. HAHAHhahha.. ugh. Rewrite when i'm not lazy
 * @param param0
 */

export const IspEntrance: React.FunctionComponent<ComposeProps> = ({
  readOnly,
  editable,
  defaultCredit = "",
  defaultDescription,
  defaultImage,
  defaultIngredients,
  defaultTitle = "",
  dt=null,
  params: { id, taskId},      //来自上级<Route path={"/device/:id/addTask"} />路由器给的:id。
}) => {
  const theme = useTheme();
  const [, setLocation] = useLocation();

  let filtercomp={ dev:id ,task:taskId};
  const {loading, error, item } =useLookIspOfDevTask(filtercomp);
  console.log("IspEntrance页面刷新 id:", id,",dt=,",dt,";params=", taskId, item);




  React.useEffect(() => {
    if(!loading && !error){
      if(!item)  setLocation("/device/"+id+"/task/"+taskId+"/dispatch", true);
      else  setLocation("/inspect/" + item.id, true) ;
    }
  }, [item, id, taskId, error ,loading ,setLocation]);

  return (
    <div
      css={{
        [theme.mediaQueries.md]: {
          height: "auto",
          display: "block",
        }
      }}
    >
      <Helmet title={"ISP入口"} />

      <LayerLoading loading={loading} />
    </div>
  );
};

