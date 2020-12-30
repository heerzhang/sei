/** @jsxImportSource @emotion/react */
import {  css } from "@emotion/react";
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
  Pager, IconArchive
} from "customize-easy-ui-component";

import { useSession,  useSignOut } from "../auth";
import { Link as RouterLink, useRoute, useLocation, Switch, Route } from "wouter";
import { useMedia } from "use-media";
import { Layout } from "./Layout";
import { TaskList } from "./task/TaskList";
import { DispatchIspMen } from "./task/DispatchIspMen";
import { UnitList } from "./UnitList";
import { IspEntrance } from "./task/IspEntrance";
//import { useCountOfTask } from "./db";
import { DetailedGuide } from "./DetailedGuide";

interface DeviceMainProps {
  id?: string;
}

export const DeviceMain: React.FunctionComponent<DeviceMainProps> = props => {
  const theme = useTheme();
  const {user} = useSession();
  const isLarge = useMedia({ minWidth: "768px" });

  const [, params] = useRoute("/unit/:recipe*");
  let showingRecipe = params.recipe;
  let initTab=0;

  const [activeTab, setActiveTab] = React.useState(initTab);
  const [, setLocation] = useLocation();
  const renderList = isLarge || !showingRecipe;  　//大屏或者小屏但是没有显示具体明细页的场合。

  function onLogoutDo() {
    setLocation("/login",  { replace: false } );
  }
  const { submitfunc:signOut,  } = useSignOut(onLogoutDo);
  //const { item:sumofTask,  } = useCountOfTask({dep:"", status:""} );

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
                <Tooltip content="单位新增">
                  <div>
                    <DarkMode>
                      <RouterLink to="/unit/new">
                      <IconButton  noBind
                        variant="ghost"
                        label="加设备"
                        size="md"
                        icon={<IconPlus />}
                      />
                      </RouterLink>
                    </DarkMode>
                  </div>
                </Tooltip>
                <Tooltip content="返回首页">
                  <div>
                    <DarkMode>
                      <RouterLink to="/">
                        <IconButton noBind
                          variant="ghost"
                          label="首页"
                          size="md"
                          icon={<IconArchive />}
                        />
                      </RouterLink>
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
                  <Tab id="company">
                    找企业
                  </Tab>
                  <Tab id="person">
                    找个人
                  </Tab>
                  <Tab id="owns">名下设备</Tab>
                  <Tab id="maintain">其他功能</Tab>
                </Tabs>
              </DarkMode>
            </div>
          </div>

          <Pager
            enableScrollLock={false}
            value={activeTab}
            onRequestChange={i => setActiveTab(i)}
            lazyLoad
          >
            <TabPanel id="company">
              <UnitList company />
            </TabPanel>
            <TabPanel id="person">
              <UnitList  />
            </TabPanel>
            <TabPanel  id="owns">
              <TaskList />
            </TabPanel>
            <TabPanel id="maintain">
              未开启，建设中。。。
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
                <SecondRouterContent />
              </Layer>
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
};


//路由和刷新？Mutation数据更新 refetchQueries:[''] 对应查询函数必须是挂载的组件内才能重做查询，路由导致分岔屏蔽掉。
function SecondRouterContent({...props}) {
  return (
    <Switch>
      <Route path={"/unit/new"}>
        <DetailedGuide />
      </Route>
      <Route path={"/unit/:id/company"}>
        <DetailedGuide company/>
      </Route>
      <Route path={"/unit/:id/person"}>
        <DetailedGuide company={false}/>
      </Route>
      <Route path={"/unit/:id/task/:taskId/dispatch"} component={DispatchIspMen} />
      <Route path={"/unit/:id/task/:taskId"} component={IspEntrance} />
      <Route path={"/unit/:id/:rest*"}>
        <DetailedGuide />
      </Route>

      <Route path="/:rest*">
        <h1>没有该URL匹配的second视图内容</h1>
      </Route>
    </Switch>
  );
}


export default DeviceMain;

