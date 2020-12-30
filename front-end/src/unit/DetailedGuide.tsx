/** @jsxImportSource @emotion/react */
//import { jsx, css } from "@emotion/react";
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
  IconArrowLeft, IconArrowRight, IconPackage
} from "customize-easy-ui-component";

//import {Helmet} from "react-helmet";
import { Link as RouterLink, Route, Switch, useLocation, useRoute } from "wouter";
//import { ContainLine, TransparentInput } from "../comp/base";
import { useDeviceDetail } from "./db";
import { AddToTask } from "./task/AddToTask";
import { DeviceDetail } from "./DeviceDetail";
import { ComposeDevice } from "./ComposeDevice";
import { useInvalidateEQP } from "./db";
//import { Path } from "wouter/preact";


interface DetailedGuideProps {
  id?: string;   　//来自上级<Route path={"/device/:id/"} component={} />给的:id。
  company?:boolean;
}
//右半边页面
export const DetailedGuide: React.FunctionComponent<DetailedGuideProps> = ({
   id: parId, company=false
}) => {
  const theme = useTheme();
  const toast = useToast();
  //原型是[Path, (to: Path, options?: { replace?: boolean }) => void]
  const [, setLocation] = useLocation();

  const [match, params] = useRoute("/unit/:id/:rest*");
  let id =(match && params.id);
  console.log("DetailedGuide当前的查询 params=", params);
  if(id==='new')  id=null;

  const { loading ,items: dtvalue, error ,refetch} = useDeviceDetail( { id , company } );
  const { submit:updateFunc, } = useInvalidateEQP({
      whichEqp: id, reason:'测试期',
  });

  async function updateRecipe(id: string) {
    try {
      await updateFunc();
    } catch (err) {
      toast({
        title: "后端报错",
        subtitle: err.message,
        intent: "danger"
      });
      return;
    }
    toast({
      title: "返回了",
      subtitle: '作废 ID＝'+id,
      intent: "info"
    });
  }

  return (
    <div
      css={{
        [theme.mediaQueries.md]: {
          height: "auto",
          display: "block",
        }
      }}
    >
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
          <RouterLink to="/unit/">
            <IconButton  noBind icon={<IconArrowLeft />}
                         variant="ghost"
                         label="后退"
                         size="md"
                         css={{
                           marginRight: theme.spaces.sm,
                           [theme.mediaQueries.md]: {
                             display: "none"
                           }
                         }}
            />
          </RouterLink>
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
             {dtvalue?.id? '单位': company? '企业':'个人'}的ID号：{dtvalue?.id || id }
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
                      setLocation("/unit/"+id+"/addTask", { replace: false });
                   } }>
                    生成新任务
                  </MenuItem>
                  <MenuItem onPress={ async () => {
                       }
                    }>其他功能
                  </MenuItem>
                  <MenuItem onPress={() => updateRecipe(id) }>法定设备导入后的拆除报废</MenuItem>
                  <MenuItem onPress={() => updateRecipe(id) }>委托设备不再维护时删除</MenuItem>
                  <MenuItem onPress={() => refetch( {} )}>刷新获最新数据</MenuItem>
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
                  {id && error && error.message}
                  <ThirdRouterContent id={id} device={dtvalue} />

                  <div css={{ marginTop: theme.spaces.sm }}>
                    <RouterLink to={`/device/`}>
                      <Button
                        size="lg" noBind
                        intent="primary"
                        iconAfter={<IconArrowRight />}
                      >
                        找其名下设备
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
      <Route path={"/unit/new"}>
          <ComposeDevice  readOnly={false}/>
      </Route>
      <Route path={"/unit/:id/addTask"}>
        <AddToTask id={id} dt={device}/>
      </Route>
      <Route path={`/unit/:id`}>
          <DeviceDetail id={id} eqp={device}/>
      </Route>
      <Route path={`/unit/:id/company`}>
        <DeviceDetail id={device?.id} eqp={device}/>
      </Route>
      <Route path={`/unit/:id/person`}>
        <DeviceDetail id={device?.id} eqp={device}/>
      </Route>
      <Route path="/:rest*">没该URL对应third-u内容</Route>
    </Switch>
  </React.Fragment>
  );
}
