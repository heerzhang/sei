/** @jsx jsx */
import { jsx,  } from "@emotion/core";
import * as React from "react";
//import debug from "debug";
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
  IconArrowLeft,
  IconArrowRight, IconPackage
} from "customize-easy-ui-component";
import { useAbandonISP, useDispatchIspMen, useIspDetail } from "./db";
//import { useSession } from "../auth";
import {Helmet} from "react-helmet";
import { Link as RouterLink, useLocation } from "wouter";
import { ContainLine, TransparentInput } from "../comp/base";

//[HOOK限制]按钮点击函数内部直接上toast()或toaster.notify()很可能无法正常显示。而放在函数组件顶层render代码前却能正常。
interface IspDetailProps {
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

export const IspDetail: React.FunctionComponent<IspDetailProps> = ({
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
  const toast = useToast();
  const [, setLocation] = useLocation();
  const [editing, setEditing] = React.useState(!readOnly);
  const [content, ] = React.useState(() => {
    return defaultDescription
      ? ''
      : null;
  });
  const [image, ] = React.useState(defaultImage);
  const [title, setTitle] = React.useState(defaultTitle);

  const [credit, ] = React.useState(defaultCredit);

  let filtercomp={
    id: id,
  };
  const { loading, items:isp , } = useIspDetail(filtercomp);
  const [ingredients, setIngredients] = React.useState<any>( isp||{} );

  const {result, submit:updateFunc, } = useAbandonISP({
    ispId: id, reason:'测试期直接删'
  });

  console.log("IspDetail页面刷新 router-IDispId:", id,",taskId=,",taskId,";ingredients=", ingredients);

  async function handleDelete(id: string) {
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
    //直接跳轉導致 更新丟失？任務頁面無法知曉 已經查詢的query getISP($id: ID!)應答。
    //setLocation("/inspect/", true);
  }

  React.useEffect(() => {
    setIngredients( isp||{} );
  }, [isp]);

  return (
    <div
      css={{
        [theme.mediaQueries.md]: {
          height: "auto",
          display: "block",
        }
      }}
    >
      <Helmet title={result ? '有结果了' : "新增任务"} />
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
          <RouterLink   to="/inspect/">
            <IconButton
              icon={<IconArrowLeft />}
              label="后退"
              variant="ghost"
              css={{
                marginRight: theme.spaces.sm,
                [theme.mediaQueries.md]: {
                  display: "none"     //大屏不需要
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
             检验号{id}详情向导
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
                      setLocation(`/inspect/${id}/addReport/choose`,  true );
                      } }>
                    增加个检验报告
                  </MenuItem>
                  <MenuItem onPress={() => {
                     handleDelete(id)
                  }
                  }>放弃这次ISP检验号
                  </MenuItem>
                  <MenuItem onPress={() => null }>检验终结流程</MenuItem>
                </MenuList>
              }
            >
              <IconButton
                css={{
                  //display: !editing && editable ? undefined : "none",
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

      <div
        css={{  //控制小屏时的导航条底下的整个页面滚动。
          flex: 1,
          //minHeight: '100vh',
          [theme.mediaQueries.md]: {
            //flex: "none",
            //minHeight: "unset",
           // minHeight:'unset',
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
              {ingredients && (
                <div
                  css={{
                  width:'100%',
                }}
                >
                  <Text variant="h5">该次检验的基本概况</Text>
                      <div key={1}>
                        <ContainLine display={'设备号'}>
                          <TransparentInput  readOnly
                            value={ (ingredients.dev||{}).cod ||'' }
                          />
                        </ContainLine>
                        <ContainLine display={'任务号'}>
                          <TransparentInput readOnly value={ ingredients?.task?.id ||'' }/>
                        </ContainLine>
                        <ContainLine display={'任务日期'}>
                          <TransparentInput readOnly value={ ingredients?.task?.date ||'' }/>
                        </ContainLine>
                        <ContainLine display={'任务状态'}>
                          <TransparentInput readOnly value={ ingredients?.task?.status ||'' }/>
                        </ContainLine>
                        <div>
                         <ContainLine display={'审核人'}>
                            <TransparentInput
                              autoFocus={true}
                              readOnly
                              placeholder="审核人"
                              value={ingredients.checkMen?.username||''}
                              onChange={e => {
                                setIngredients( {
                                  ...ingredients,
                                  ispMen: e.target.value
                                });
                              }}
                            />
                          </ContainLine>
                          <ContainLine display={'检验人名单'}>
                            <Text  placeholder="所有参与检验人"
                                   css={{
                                     display: 'block',
                                     width: '100%',
                                   }}
                            >
                             {ingredients.ispMen && ingredients.ispMen.map((one,i) => {
                               return (
                                 <RouterLink key={i}  to="/inspect/">
                                   <Button
                                     size="md"
                                     variant="ghost"
                                     intent="none"
                                     iconAfter={<IconArrowRight />}
                                   >{one.username}
                                   </Button>
                                 </RouterLink>
                               )
                              } )}
                            </Text>
                          </ContainLine>
                          <ContainLine display={'下检日期'}>
                            <TransparentInput
                              autoFocus={true}
                              readOnly
                              placeholder="输入日期格式2019-08-03"
                              value={ingredients.nextIspDate||''}
                              onChange={e => {
                                setIngredients( {
                                  ...ingredients,
                                  date: e.target.value
                                });
                              }}
                            />
                          </ContainLine>
                        </div>

                      </div>


                </div>
              )}


            </div>
          </Container>
        </div>
      </div>
      <LayerLoading loading={loading} />
    </div>
  );
};

