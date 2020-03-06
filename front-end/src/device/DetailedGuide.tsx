/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import * as React from "react";
import {
  Navbar,
  Toolbar,
  Text,
  Button,
  IconButton,
  MenuList,
  MenuItem,
  useTheme,
  useToast,
  LayerLoading,
  Container,
  ResponsivePopover,
  IconMoreVertical,
  IconArrowLeft, IconArrowRight, Select, IconPackage
} from "customize-easy-ui-component";

import {Helmet} from "react-helmet";
import { Link as RouterLink, Link, Route, Switch, useLocation, useRoute } from "wouter";
import { ContainLine, TransparentInput } from "../comp/base";
import { useDeviceDetail } from "./db";
import { AddToTask } from "./task/AddToTask";
import { DeviceDetail } from "./DeviceDetail";
import { ComposeDevice } from "./ComposeDevice";


interface DetailedGuideProps {
  id?: string;   　//来自上级<Route path={"/device/:id/"} component={} />给的:id。
}
//右半边页面
export const DetailedGuide: React.FunctionComponent<DetailedGuideProps> = ({
   id: pid,
}) => {
  const theme = useTheme();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/device/:id/:rest*");
  let id =(match && params.id);

  let filtercomp={
    id: id,
  };
  const { loading ,items: dtvalue, error } = useDeviceDetail( { id } );

  return (
    <div
      css={{
        [theme.mediaQueries.md]: {
          height: "auto",
          display: "block",
        }
      }}
    >
      <Helmet title={id ? '有结果了' : "新增任务"} />
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
            component={Link}
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
              设备ID号：{id}
           </Text>
          <div
            css={{
            display: 'inline-flex',
          }}
          >
            <ResponsivePopover
              content={
                <MenuList>
                  <MenuItem contentBefore={<IconPackage />}  onPress={() => {
                      setLocation("/device/"+id+"/addTask", false);
                   } }>
                    生成新任务
                  </MenuItem>
                  <MenuItem onPress={ async () => {
                       }
                    }>其他功能
                  </MenuItem>
                  <MenuItem onPress={() => null }>设备停用</MenuItem>
                </MenuList>
              }
            >
              <IconButton
                css={{ marginLeft: theme.spaces.sm}}
                variant="ghost"
                icon={<IconMoreVertical />}
                label="菜单"
              />
            </ResponsivePopover>
          </div>
        </Toolbar>
      </Navbar>

      <div
        css={{  //控制小屏时的导航条底下的整个页面滚动。
          flex: 1,
          [theme.mediaQueries.md]: {
            height: "auto",
            display: "block",
          }
        }}
      >
        <div>

          <Container>
            <div
              css={{
                display: 'flex',
                alignItems:'center',
                justifyContent:'center',
                minHeight: '85vh',
                [theme.mediaQueries.md]: {
                  paddingTop: theme.spaces.lg,
                  paddingBottom: theme.spaces.lg,
                  minHeight:'unset',
                }
              }}
            >
                <div
                  css={{
                  width:'100%',
                }}
                >
                  {/*三级路由了： 嵌套再嵌套了一层 布局级别的组件*/}
                  <ThirdRouterContent id={id} device={dtvalue}/>

                  <div css={{ marginTop: theme.spaces.sm }}>
                    <RouterLink to={`/inspect/${id}`}>
                      <Button
                        size="lg" noBind
                        intent="primary"
                        iconAfter={<IconArrowRight />}
                      >
                        其他功能
                      </Button>
                    </RouterLink>
                  </div>
                </div>
            </div>
          </Container>
        </div>
      </div>
      <LayerLoading loading={loading} />
    </div>
  );
};


interface ThirdRouterProps {
  id?: string;
  device: any;
}
//为了能立刻刷新操作反馈页面，引入三级路由，把数据获取放在了公共上级组件去，某页面操作的同时能更新查询另外页面显示立即反馈到。
function ThirdRouterContent({id, device}: ThirdRouterProps) {
  return (
   <React.Fragment>
    <Switch>
      <Route path={"/device/new"}>
          <ComposeDevice
            readOnly={false}
            editable={true}
          />
      </Route>
      <Route path={"/device/:id/addTask"}>
        <AddToTask id={id} dt={device}/>
      </Route>
      <Route path={`/device/:id`}>
          <DeviceDetail id={id} eqp={device}/>
      </Route>
      <Route path="/:rest*">没该URL内容</Route>
    </Switch>
  </React.Fragment>
  );
}
