/** @jsx jsx */
import { jsx,  } from "@emotion/core";
import * as React from "react";
import {
  useTheme,
  LayerLoading,
  Text,
  Button,
  IconTruck,
  IconArrowRight,
  Navbar,
  Toolbar,
  IconButton,
  IconArrowLeft,
  ResponsivePopover,
  MenuList, MenuItem, IconMoreVertical
} from "customize-easy-ui-component";
import {  useLookIspOfDevTask } from "./db";
import {Helmet} from "react-helmet";
import { Link as RouterLink, useLocation } from "wouter";
import { TransparentInput } from "../../comp/base";

//[HOOK限制]按钮点击函数内部直接上toast()或toaster.notify()很可能无法正常显示。而放在函数组件顶层render代码前却能正常。

interface IspEntranceProps {
  params?:any;   //上级路由器传入的参数。
}
//[我的任务列表]底下某设备去点击，首先要到这："/device/:id/task/:taskId"路由来的；　然後setLocation再次路由。
export const IspEntrance: React.FunctionComponent<IspEntranceProps> = ({
  params: { id:devId, taskId},      //来自上级<Route path={"/device/:id/addTask"} />路由器给的:id。
}) => {
  const theme = useTheme();
  const [, setLocation] = useLocation();

  let filtercomp={ dev:devId ,task:taskId};
  const {loading, error, item } =useLookIspOfDevTask(filtercomp);
  console.log("早就跳转页面逻辑错误 devId:", devId,";task=", taskId, "ISP=",item,"loading=",loading,"error=",error);

  //加载数据后立刻跳转，重定向操作。 要么直接去ISP页面；  要么先去派工吧。
  //用useEffect跳转setLocation，操之过急！，useLookIspOfDevTask后面数据还会更新的，可是这里却早早就跳转页面了，所以逻辑错误！
  //useLookIspOfDevTask实际查询后端比cache慢了1节拍要多一次render，若是cache也算数的立刻setLocation跳转，导致后端查询结果被遗弃，都无法更新cache了。
  React.useEffect(() => {
    if(!loading && !error){
      if(!item){
       //setLocation("/device/"+id+"/task/"+taskId+"/dispatch", true);
       }
      else{
       // setLocation("/inspect/" + item.id, true) ;
      }
    }
  }, [item, devId, taskId, error ,loading ,setLocation]);

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
      <Navbar
        css={{
          zIndex: theme.zIndices.sticky,
          backgroundColor: "white",
          boxShadow: theme.shadows.sm,
          position: "sticky",
          top: 0,
          [theme.mediaQueries.md]: {
            position: "static"
          }
        }}
      >
        <Toolbar
          css={{
            alignItems: "center",
            display: "flex"
          }}
        >
          <IconButton
            icon={<IconArrowLeft />}
            component={RouterLink}
            to="/device"
            label="后退"
            replace
            variant="ghost"
            css={{
              marginRight: theme.spaces.sm,
              [theme.mediaQueries.md]: {
                display: "none"
              }
            }}
          />
            <Text
              css={{
                flex: 1,
                textAlign: "center",
                [theme.mediaQueries.md]: {
                  textAlign: "left"
                }
              }}
              wrap={false}
              variant="h5"
              gutter={false}
            >
            {item? '发现了': '没找到有'}关联的ISP
            </Text>
          <div
            css={{
              display: 'inline-flex',
            }}
          >
            <ResponsivePopover
              content={
                <MenuList>
                  <MenuItem onPress={() =>0 }>其它功能</MenuItem>
                </MenuList>
              }
            >
              <IconButton
                css={{
                  marginLeft: theme.spaces.sm
                }}
                variant="ghost"
                icon={<IconMoreVertical />}
                label="菜单"
              />
            </ResponsivePopover>
          </div>
        </Toolbar>
      </Navbar>
        {!item && <React.Fragment>
          <Text  variant="h4"　css={{ textAlign: 'center' }}>
           设备ID {devId} 任务ID {taskId} 底下还没找到有关联的ISP,请先去派工吧！
          </Text><br/>
          <RouterLink to={"/device/"+devId+"/task/"+taskId+"/dispatch"}>
            <Button
              size="lg" noBind
              intent="primary"
              iconBefore={<IconTruck />}
              iconAfter={<IconArrowRight />}
            >
             得先去派工
            </Button>
          </RouterLink>
        </React.Fragment>
        }
        {item && <React.Fragment>
        <Text  variant="h4"　css={{ textAlign: 'center' }}>
          设备ID {devId} 任务ID {taskId} 底下发现了关联ISP,请看检验详情。
        </Text><br/>
        <RouterLink to={"/inspect/"+item.id}>
          <Button
            size="lg" noBind
            intent="primary"
            iconBefore={<IconTruck />}
            iconAfter={<IconArrowRight />}
          >
          查看ISP详情
          </Button>
        </RouterLink>
      </React.Fragment>
      }
      <LayerLoading loading={loading} />
    </div>
  );
};

