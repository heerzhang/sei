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
  Pager, IconArchive, ScrollView, Stack
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


export interface MainProps {
  path?: string;
  id?: string;
  source: any;  //原始记录的json数据 + 。
}

export const TemplateMain: React.FunctionComponent<MainProps> = ({source}) => {
  const theme = useTheme();
  const {user} = useSession();
  //可提前从URL筛选出参数来的。report/143243
  const [match, params] = useRoute("/report/:template/ver/:verId/:repId/item/:action*");
  let showingRecipe = params && params.repId   &&  params.action;
  const [activeTab, setActiveTab] = React.useState(0);
  const [, setLocation] = useLocation();
  const isLarge = useMedia({ minWidth: "800px" });
  const renderList =match||     isLarge || !showingRecipe;  　//大屏或者小屏但是没有显示具体明细页的场合。


  console.log("来TemplateMain当前的params match=",match ,"showingRecipe=",params, showingRecipe);

  function onLogoutDo() {
    setLocation("/login",  false );
  }
  const { submitfunc:signOut,  } = useSignOut(onLogoutDo);

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
                <MainContent id={'227'} source={source}/>
              </Layer>
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
};

interface MainContentProps {
  id?: string;
  source: any;
}

function MainContent({ id, source }: MainContentProps) {
  if (!id) {
    return null;
  }
  return <SecondRoterContent id={id} source={source}/>;
}


interface SecondRoterProps {
  id?: string;
  source?: any;
}
//上级是path="/report/:rest*"的。在底下扩充目录。
function SecondRoterContent({id, source}: SecondRoterProps) {
  return (
    <React.Fragment>
    开头部分
      <Route path={"/report/EL-DJ/ver/1/:repId/item/1.4"} component={ReportSample} />
      <Route path="/report/EL-DJ/ver/1/:repId/item/ALL">  <PrintReport source={source}/> </Route>
      <Route path="/report/EL-DJ/ver/1/:repId/item">  </Route>

      <Route path={"/report/EL-DJ/ver/1/:repId/item/5.1"} component={ReportSample} />

      <Route path="/:rest*"> <h1>没有该URL匹配的视图内容</h1> </Route>

    末尾工具条
    </React.Fragment>
  );
}


export default TemplateMain;

