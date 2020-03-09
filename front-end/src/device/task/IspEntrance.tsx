/** @jsx jsx */
import { jsx,  } from "@emotion/core";
import * as React from "react";
import {
  useTheme,
  LayerLoading, Text, Button, IconTruck, IconArrowRight
} from "customize-easy-ui-component";
import {  useLookIspOfDevTask } from "./db";
import {Helmet} from "react-helmet";
import { Link as RouterLink, useLocation } from "wouter";

//[HOOK限制]按钮点击函数内部直接上toast()或toaster.notify()很可能无法正常显示。而放在函数组件顶层render代码前却能正常。

interface IspEntranceProps {
  params?:any;   //上级路由器传入的参数。
}
//任务下挂列表的某设备去点击后首先到这："/device/:id/task/:taskId"路由来的；　
export const IspEntrance: React.FunctionComponent<IspEntranceProps> = ({
  params: { id, taskId},      //来自上级<Route path={"/device/:id/addTask"} />路由器给的:id。
}) => {
  const theme = useTheme();
  const [, setLocation] = useLocation();

  let filtercomp={ dev:id ,task:taskId};
  const {loading, error, item } =useLookIspOfDevTask(filtercomp);
  console.log("IspEntrance页面刷新devId:", id,";task=", taskId, "ISP=",item,"loading=",loading,"error=",error);

  //加载数据后立刻跳转，重定向操作。 要么直接去ISP页面；  要么先去派工吧。
  //用useEffect跳转setLocation，操之过急！，useLookIspOfDevTask后面数据还会更新的，可是这里却早早就跳转页面了，所以逻辑错误！
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
        {!item && <React.Fragment>
          <Text  variant="h4"　css={{ textAlign: 'center' }}>
            没找到该ISP,请刷
          </Text><br/>
          <RouterLink to="/inspect/">
            <Button
              size="lg" noBind
              intent="primary"
              iconBefore={<IconTruck />}
              iconAfter={<IconArrowRight />}
            >
              后退刷新
            </Button>
          </RouterLink>
        </React.Fragment>
        }
        {item && <React.Fragment>
        <Text  variant="h4"　css={{ textAlign: 'center' }}>
          找到该ISP,请
        </Text><br/>
        <RouterLink to="/inspect/">
          <Button
            size="lg" noBind
            intent="primary"
            iconBefore={<IconTruck />}
            iconAfter={<IconArrowRight />}
          >
            后退刷新
          </Button>
        </RouterLink>
      </React.Fragment>
      }
      <LayerLoading loading={loading} />
    </div>
  );
};

