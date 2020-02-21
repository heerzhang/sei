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
  Pager, IconArchive, ScrollView,
} from "customize-easy-ui-component";

import { useSession,  useSignOut } from "../auth";
import { Link, useLocation, Switch, Route } from "wouter";
import { useMedia } from "use-media";
import { Layout } from "./Layout";
import { RelationList } from "../inspect/RelationList";
import typeAsRoute from "../typeAsRoute.json";
import { RecordStarter, ReportStarter } from "./TemplateLoader";
import { InternalItemHandResult, ReportViewProps } from "./comp/base";

//模板的版本号和相应代码维护管理是个问题；不是下载离线的，而是时刻web在线的文档格式；配套数据库数据加上配套模板才能拼凑出正式文档。要保留维护几年？有人还在用旧的。
//模板类型：支持主报告类型1个+分报告类型多个的情况，报告展示入口管理。模板版本号由后端管理。

interface TemplateMainProps {
  template: string;
  verId: string;
  action: string;
  id?: string;
  source?: any;
}
//首次render时刻template应该还没有获取到的，需要第二次render才能获得到template。
function TemplateMain( {
                         template: templateID,
                         verId, action, id,
                         source
         }:  TemplateMainProps
) {
  const [template, setTemplate] = React.useState(null as any);
  const path =typeAsRoute[templateID] +".E";
  //import参数变量，会被替换为【.*】；  不可这么写 import(path) 这是无效的。
  //useLayoutEffect
  React.useEffect(() => {
    //console.log("不会重复执行到这里的！ template=", "path=", path);
    import(`${path}`).then(module => {
      if(module.originalTemplate===undefined)
        throw new Error(`没找到模板入口O组件${path}`);
      if(module.reportTemplate===undefined)
        throw new Error(`没找到模板入口R组件${path}`);

      setTemplate({original: module.originalTemplate[verId], report: module.reportTemplate[verId]});
    })
      .catch(error => {
        throw new Error(`错误导致后续操作模板查找失败${error}`);
      });

  }, [path, verId]);

  return (
    <React.Fragment>
      { template &&
        <Switch>
          <Route path="/report/:template/ver/:verId/preview/:repId">
           { source &&
               <ReportStarter id={id} source={source} template={template.report}/>
           }
          </Route>
          <Route path="/report/:rest*">
           { source &&
               <RecordEditorOrPrint id={id} source={source} action={action} templateSet={template}
                                    templateID={templateID} verId={verId} />
           }
          </Route>
        </Switch>
      }
    </React.Fragment>
  );
}


export interface RecordEditorOrPrintProps {
  id: string;
  source: any;  //原始记录的json数据 + 。
  templateSet: any;
  templateID: string;
  verId: string;
  action: string;
}
//带原始记录的场景。
export const RecordEditorOrPrint: React.FunctionComponent<RecordEditorOrPrintProps> = (
  {source,templateSet, action, id, templateID, verId}
  ) => {
  const theme = useTheme();
  const {user} = useSession();
  let showingRecipe = (action!=='none');
  const [activeTab, setActiveTab] = React.useState(0);
  const [, setLocation] = useLocation();
  //isLarge在A4竖打印是false;
  const isLarge = useMedia({ minWidth: "800px" });
  //大屏或者小屏但是没有显示具体明细页的场合。
  let renderList =isLarge || action==='none';
  if(!isLarge && action!=='none')   renderList=false;
  function onLogoutDo() {
    setLocation("/login",  false );
  }
  const { submitfunc:signOut,  } = useSignOut(onLogoutDo);

  if(!templateSet)   throw new Error(`没模板哦`);
  //console.log("来TemplateMain当前的params action=",action ,"showingRecipe=",showingRecipe);

  return (
    <Layout>
      <div
        css={css`
          display: flex;
          box-sizing: border-box;
        `}
      >
        {/*左半部分,包括菜单+列表*/}
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
            "@media (min-width:800px)": {
              position: "fixed",    //"absolute"会跟随右边滚动
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
            },
            "@media print": {
              display: "none"
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
                  <Tab id="original">原始记录录入</Tab>
                  <Tab id="list">我参与的检验</Tab>
                  <Tab id="check">待我审核的检验</Tab>
                  <Tab id="report">检验报告</Tab>
                </Tabs>
              </DarkMode>
            </div>
          </div>
          {/*这才是小窗口的主体，独立的可滚动部分*/}
          <Pager
            enableScrollLock
            value={activeTab}
            onRequestChange={i => setActiveTab(i)}
            lazyLoad
          >
            <TabPanel id="original"  css={{
                    height: '100%'
              }}>
              {templateSet?.report &&
                 <EmbeddedReport id={id}  source={source} template={templateSet.report}/>
              }
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
        {showingRecipe && (
          <div
            css={{
              display: "block",
              position: "relative",
              flex: 1,      　//对布局影响最大
              "@media (min-width:800px)": {
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
                "@media (min-width:800px)": {
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
                key={action}
                css={{
                  borderRadius: 0,
                  position: "relative",
                  boxShadow: "none",
                  width: "100%",
                  "@media (min-width:800px)": {
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
                {templateSet?.original && action!=='none'
                 && <RecordStarter id={id} action={action}  source={source} template={templateSet.original}
                                   templateID={templateID} verId={verId}/>
                }
                {renderList && '有左边输出'}
              </Layer>
            </div>

          </div>
        )}

      </div>
    </Layout>
  );
};


interface EmbeddedReportProps {
  id: string;
  source: any;
  template: React.ReactElement<React.RefForwardingComponent<InternalItemHandResult,ReportViewProps>>;
}
const EmbeddedReport: React.FunctionComponent<EmbeddedReportProps> = ({ id, source, template}
) => {
  const theme = useTheme();
  //const ref = React.useRef();
  return (
    <ScrollView　overflowY
                css={{
                  flex: 1,
                  height: "100%",
                }}
                innerRef={null}>
      <div
        css={{   //特意把父div滚动条启动开。`calc(100vh - ${ileapHeight}px)`,   '750px',  注意串里的空格必须要有！
          //关键是靠内容持续增长列表的紧上一级DIV来控制，把这一个div高度撑开，迫使最近的窗口所附属的滚动条启动。
          minHeight: `calc(100vh - 164px)`,
          [theme.mediaQueries.md]: {
            minHeight: `calc(100vh - 164px - ${theme.spaces.lg} - ${theme.spaces.lg})`
          },
          [theme.mediaQueries.xl]: {
            minHeight: `calc(100vh - 164px - ${theme.spaces.xl} - ${theme.spaces.xl})`
          },
        }}
      >
        <ReportStarter id={id}  source={source} template={template}/>
      </div>
    </ScrollView>
  );
};



export default TemplateMain;
