/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import * as React from "react";
import {
  Toolbar,
  Navbar,
  useTheme,
  IconButton,
  Button,
  Tabs,
  Tab,
  Layer,
  TabPanel,
  MenuList,
  MenuItem,
  Tooltip,
  ResponsivePopover,
  IconChevronDown,
  IconPlus,
  DarkMode,
  LightMode,
  Pager, IconArchive, ScrollView, Stack, useToast, LayerLoading, Text
} from "customize-easy-ui-component";

import { useSession,  useSignOut } from "../auth";
import { Link, useRoute, useLocation, Switch, Route } from "wouter";
import { useMedia } from "use-media";
import { Layout } from "./Layout";
import { RelationList } from "../inspect/RelationList";
import { IspDetail } from "../inspect/IspDetail";
import { ReportSample } from "../inspect/ReportSample";
import { BoundReports } from "../inspect/report/BoundReports";
import { PrintReport } from "./PrintReport";
import { Branding } from "../Branding";
import { InternalItemHandResult, TemplateViewProps } from "./comp/base";
import { useCommitOriginalData } from "./db";
import throttle from 'throttle-asynchronous'
import { loadTemplate } from "./template";
import typeAsRoute from "../typeAsRoute.json";

export interface MainProps {
  path?: string;
  id?: string;
  source: any;  //原始记录的json数据 + 。
}

export const TemplateMain: React.FunctionComponent<MainProps> = ({source}) => {
  const theme = useTheme();
  const {user} = useSession();
  //可提前从URL筛选出参数来的。 "/report/item/1.4/:repId/EL-DJ/ver/1"
  const [match, params] = useRoute("/report/item/:action/:repId/:template/ver/:verId");
  let showingRecipe = params && params.repId   &&  params.action;
  let action = params &&  params.action;
  const [activeTab, setActiveTab] = React.useState(0);
  const [, setLocation] = useLocation();
  const isLarge = useMedia({ minWidth: "800px" });
  const renderList =match||     isLarge || !showingRecipe;  　//大屏或者小屏但是没有显示具体明细页的场合。
  const [template, setTemplate] = React.useState(null   as any);

  console.log("来TemplateMain当前的params match=",match ,"showingRecipe=",params, showingRecipe);
  function onLogoutDo() {
    setLocation("/login",  false );
  }
  const { submitfunc:signOut,  } = useSignOut(onLogoutDo);

  if(!params || !(params.template))   return null;
  loadTemplate(typeAsRoute[params &&params.template], setTemplate);

  return (
    <Layout>
      <div
        css={css`
          display: flex;
          box-sizing: border-box;
        `}
      >
        {/*左半部分,小的列表*/}
        <Layer
          aria-hidden={!renderList}
          css={{
            display: renderList ? "flex" : "none",   //最关键！
            boxSizing: "border-box",
            flexDirection: "column",
            flex: "1",
            boxShadow: "none",
            background: "white",
            position: "absolute",
            width: "100%",
            borderRadius: 0,
            margin: 0,
            height: `calc(100vh)`,
            [theme.mediaQueries.md]: {
              display: "flex",
              position: "absolute",
              zIndex: theme.zIndices.fixed,
              top: 0,
              boxShadow: theme.shadows.xl,
              overflow: "hidden",
              width: "100%",
              maxWidth: "46vw",
              borderRadius: theme.radii.lg,
              margin: theme.spaces.lg,
              height: `calc(100vh - ${theme.spaces.lg} - ${theme.spaces.lg})`
            },
            [theme.mediaQueries.xl]: {
              margin: theme.spaces.xl,
              maxWidth: "40vw",
              height: `calc(100vh - ${theme.spaces.xl} - ${theme.spaces.xl})`
            }
          }}
        >
          {/*　顶部黑色工具条2行，sticky模式，这黑色标题区导致很多烦恼！高度被不规律占用; 两行合计105px=
            64px =是Toolbar引起的；
                minHeight: MOBILE_HEIGHT,  MOBILE_HEIGHT = "56px";   来源于UI基础<Toolbar部件的（要看参数compressed和屏幕）,
                },  _b[theme.mediaQueries.md] = {
                  minHeight: DESKTOP_HEIGHT, DESKTOP_HEIGHT = "64px";
            41px =是字0.875rem + 2 * 10px；　   来源于<Tab 组件的 按钮+文本。
            实际上<TabPanel组件和Tabs按钮的白色脖子样边条还要算入7px的;
          */}
          <div
            css={[
              {
                width: "100%",
                top: 0,
                background: theme.colors.palette.gray.base,
                zIndex: theme.zIndices.sticky,
                position: "sticky",
              }
            ]}
          >
            <Navbar
              position="static"
              css={{
                flex: "0 0 auto",
                background: theme.colors.palette.gray.base,
                color: "white"
              }}
            >
              <Toolbar
                css={{
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <div css={{ width: "42px" }} />
                <LightMode>
                  <ResponsivePopover
                    content={
                      <MenuList>
                        <MenuItem onPress={()=>signOut()}>退出登录帐户</MenuItem>
                      </MenuList>
                    }
                  >
                    <DarkMode>
                      <Button
                        size="md"
                        iconAfter={<IconChevronDown />}
                        variant="ghost"
                      >
                        {user.username || user.mobile}
                      </Button>
                    </DarkMode>
                  </ResponsivePopover>
                </LightMode>
                <Tooltip content="增加个检验报告">
                  <div>
                    <DarkMode>
                      <Link to="/chaipu/new">
                        <IconButton
                          variant="ghost"
                          label="加菜谱"
                          size="md"
                          icon={<IconPlus />}
                        />
                      </Link>
                    </DarkMode>
                  </div>
                </Tooltip>
                <Tooltip content="其他的命令">
                  <div>
                    <DarkMode>
                      <Link to="/chaipu/new">
                        <IconButton
                          variant="ghost"
                          label="加菜谱"
                          size="md"
                          icon={<IconArchive />}
                        />
                      </Link>
                    </DarkMode>
                  </div>
                </Tooltip>
              </Toolbar>
            </Navbar>
            <div css={{ flex: "0 0 auto", zIndex: 2 }}>
              <DarkMode>
                <Tabs
                  css={{
                    position: "sticky",
                    top: 0,
                    background: theme.colors.palette.gray.base
                  }}
                  onChange={i => setActiveTab(i)}
                  value={activeTab}
                  variant="evenly-spaced"
                >
                  <Tab
                    badge={ //揭示数目
                      !false
                        ? 13
                        : null
                    }
                    id="followers"
                  >
                    原始记录录入
                  </Tab>
                  <Tab id="list">我参与的检验</Tab>
                  <Tab id="check">待我审核的检验</Tab>
                  <Tab id="report">检验报告</Tab>
                </Tabs>
              </DarkMode>
            </div>
          </div>

          <Pager
            enableScrollLock
            value={activeTab}
            onRequestChange={i => setActiveTab(i)}
            lazyLoad
          >
            <TabPanel id="schedule">
              <ScrollView　overflowY
                          css={{
                            flex: 1,
                            height: `calc(100vh - 0.875rem - 2 * 10px - 63px)`,
                            [theme.mediaQueries.md]: {
                              height: `calc(100vh - 2 * ${theme.spaces.lg} - 0.875rem - 2 * 10px - 71px)`
                            },
                            [theme.mediaQueries.xl]: {
                              height: `calc(100vh - 2 * ${theme.spaces.xl} - 0.875rem - 2 * 10px - 71px)`
                            }
                          }}
              >
                <PrintReport source={source}/>
              </ScrollView>
            </TabPanel>
            <TabPanel  id="ISPlist">
              <RelationList />
            </TabPanel>
            <TabPanel id="myCheck">
              <RelationList check/>
            </TabPanel>
            <TabPanel id="report">
            </TabPanel>
          </Pager>
        </Layer>
        {
          //实际情况：在小屏场合，左半边内容被后面的右中文档流后面的界面部分给屏蔽遮盖掉了。
        }
        {match &&showingRecipe && (
          <div
            css={{
              display: "block",
              position: "relative",
              flex: 1,      　//对布局影响最大
              [theme.mediaQueries.md]: {
                display: "flex",    　
                justifyContent: "center"
              }
            }}
          >

            <div
              css={{
                display: "block",
                position: "absolute",
                width: "100%",
                boxSizing: "border-box",
                [theme.mediaQueries.md]: {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: theme.spaces.lg,
                  minHeight: "100vh",
                  paddingLeft: "calc(46vw + 3rem)"
                },
                [theme.mediaQueries.xl]: {
                  paddingRight: theme.spaces.xl,
                  paddingLeft: "calc(40vw + 6rem)"
                }
              }}
            >
              <Layer
                elevation="xl"
            //组件id! 缺少key导致：遇到小屏幕轮转显示正常，大屏整个显示模式却必须手动刷新才能切换内容。
                key={showingRecipe}
                css={{
                  borderRadius: 0,
                  position: "relative",
                  boxShadow: "none",
                  width: "100%",
                  [theme.mediaQueries.md]: {
                    marginTop: "auto",
                    height: "auto",
                    overflow: "hidden",
                    boxSizing: "border-box",
                    marginBottom: "auto",
                    width: "100%",
                    borderRadius: theme.radii.lg,
                    boxShadow: theme.shadows.xl
                  }
                }}
              >
                {template && action!=='none'
                   && <RecordView id={'227'} source={source} action={action} template={template}/>
                }
              </Layer>
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
};

interface RecordViewProps {
  id: string;
  action: string;
  source: any;
  template: React.ReactElement<React.RefForwardingComponent<InternalItemHandResult,TemplateViewProps>>;
}
export const RecordView: React.FunctionComponent<RecordViewProps> = ({
                                                                       id,
                                                                       action,
                                                                       source,
                                                                       template,
                                                                       ...other
                                                                     }) => {
  const theme = useTheme();
  const toast = useToast();
  const [enable, setEnable] = React.useState(true);
  //useState(默认值) ； 后面参数值仅仅在组件的装载时期有起作用，若再次路由RouterLink进入的，它不会依照该新默认值去修改show。useRef跳出Cpature Value带来的限制
  const ref =React.useRef<InternalItemHandResult>(null);


  //ref可以共用current指向最新输入过的子组件；但父组件对.current的最新变化无法实时感知，只能被动刷新获知current变动。
  //子组件利用useImperativeHandle机制把数据回传给父组件，配套地父辈用ref来定位子组件。
  //保存按钮点击后必须首先触发template动态加载的子组件即TemplateView的做1次render()后，ref.current.inp才能收到儿孙组件的最新数据。
  const newOut={ ...(ref.current&&ref.current.inp) };

  //审核保存?对应数据deduction结论栏目＋审核手动修改；适用于出具正式报告，正式报告只读取deduction部分。依据审核保存>随后才是原始记录复检>初检data。
  //若复检保存 ，复检rexm，正检data。
  const {result, submit:updateFunc,loading } = useCommitOriginalData({
    id:227,  operationType:1,
    data:  JSON.stringify(newOut) ,
    deduction:{emergencyElectric:'45,423'}
  });

  console.log("RecordView捕获 ｀｀｀ source=", source);

  async function updateRecipe(
    id: string ) {
    let yes= result && result.id;
    try {
      //提交给后端， 这里将会引起底层变动，导致本组件即将要render3次。有更新的4次。更新比读取多了1次render。
      await updateFunc();
    } catch (err) {
      toast({
        title: "后端请求错",
        subtitle: err.message,
        intent: "danger"
      });
      //很多错误是在这里捕获的。
      console.log("updateRecipe返回了,捕获err", err);
      return;
    }
    //这里无法获得result值，就算所在组件顶层已经获得result值，这里可能还是await () 前那样null;
    console.log("生成任务返回了＝", result,"yes=", yes);
    toast({
      title: "任务派工返回了",
      subtitle: '加入，ISP ID＝'+id,
      intent: "info"
    });
    //除非用const {data: { buildTask: some }} = await updateFunc()捕捉当前操作结果; 否则这时这地方只能用旧的result,点击函数里获取不到最新结果。
    //须用其它机制，切换界面setXXX(标记),result？():();设置新的URL转场页面, 结果要在点击函数外面/组件顶层获得；组件根据操作结果切换页面/链接。
  }

  const throttledUpdateBackend = throttle(updateRecipe,0);
  //延迟30秒才执行的; 可限制频繁操作，若很多下点击的30秒后触发2-3次。
  const throttledUpdateEnable = throttle(setEnable,30000);
  //可是这里return ；将会导致子孙组件都会umount!! 等于重新加载==路由模式刷新一样； 得权衡利弊。
  // if(updating)  return <LayerLoading loading={updating} label={'正在获取后端应答，加载中请稍后'}/>;
  //管道单线图，数量大，图像文件。可仅选定URL，预览图像。但是不全部显示出来，微缩摘要图模式，点击了才你能显示大的原图。

  if (!id) {
    return null;
  }
  return (
    <React.Fragment>
      开头部分条
      {
        //useMemo使用后：各分区项目子组件inp各自独立的，分区项目子组件内若使用setInp(null) 清空重置后，无法靠重新拉取后端数据来保证恢复显示。
        //项目子组件使用setInp(null) 重置后，若上级组件重新取后端数据没变化的，也必须再次路由后再进入才可以让各分区项目子组件render恢复显示数据。
        React.cloneElement(template as React.ReactElement<any>, {
          ref: ref,
          inp: source,
          action
        })
      }
      <Button
        css={{ marginTop: theme.spaces.md }}
        size="lg"  intent={'warning'}
        disabled ={!enable}
        loading ={loading}
        onPress={ async () => {
          //手机上更新模板TemplateView子组件重做render触发失效。只好采用延迟策略，每个分区项目的保存处理前准备，作一次render完了，才能发送数据给后端。
          setEnable(false);
          const {hasResolved,} =await throttledUpdateBackend('1');
          hasResolved&&throttledUpdateEnable(true);
        }}
      >保存到服务器</Button>
      <LayerLoading loading={loading} />
      <Text  css={{wordWrap: 'break-word'}}>{false && `当前(${JSON.stringify(newOut)})`}</Text>
    </React.Fragment>
  );
}


interface SecondRoterProps {
  id?: string;
  source?: any;
}
//作廢！！
function SecondRoterContent({id, source}: SecondRoterProps) {
  return (
    <React.Fragment>

      <Route path={"/report/item/1.4/:repId/EL-DJ/ver/1"} component={ReportSample} />
      <Route path="/report/item/ALL/:repId/EL-DJ/ver/1">  <PrintReport source={source}/> </Route>
      <Route path="/report/item/None/:repId/EL-DJ/ver/1">  </Route>

      <Route path={"/report/item/5.1/:repId/EL-DJ/ver/1"} component={ReportSample} />

      <Route path="/:rest*"> <h1>没有该URL匹配的视图内容</h1> </Route>

    </React.Fragment>
  );
}


export default TemplateMain;

