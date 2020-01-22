/** @jsx jsx */
import { jsx,  } from "@emotion/core";
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
  Pager,
} from "customize-easy-ui-component";
import { RecipeList } from "./RecipeList";

import { FollowersList } from "./FollowersList";
import { FollowingList } from "./FollowingList";
import { useSession,  useSignOut } from "./auth";
import { Link,  useLocation } from "wouter";


//手机上看起来好像许多个页面，实际上要人工根据逻辑去控制页面元素的隐藏与否标记，人工营造多种显示形态！
//主页面框架结构：左半边RecipeList， FollowingList{附带FollowingRecipes}， FollowersList + 右边的 MainContent{ 逻辑判定Compose或Recipe }；

export interface MainLeftPartProps {
  path?: string;
}
// {/*左半部分,小的列表*/}
export const MainLeftPart: React.FunctionComponent<MainLeftPartProps> = ({ path,  }) => {
  const theme = useTheme();
  const {user,} = useSession();

  const [activeTab, setActiveTab] = React.useState(0);

  const { value: followRequests } ={value: null};  　// useFollowRequests();

  const [, setLocation] = useLocation(); 　//取得路由钩子。

  //控制界面的关键！：  showingRecipe=显示具体单项的菜谱的ID或者'new'; ==控制右部分界面显示。
  //注意小屏场合：ＵＲＬ的参数recipe*，带上ID就说明，迫使renderList=false必须　隐藏掉；　否则界面会重叠。
  //const renderList =true;  　//大屏或者小屏但是没有显示具体单项的菜谱的场合。

  function onLogoutDo() {
    setLocation("/login",  false );
    //navigate("/login" , { replace: true });
  }
  const { submitfunc:signOut, error:errLogin, logging,setLogging } = useSignOut(onLogoutDo);

  //console.log("进入MainLeftPart页面 renderList="+renderList);
  return (
        <Layer
          css={{
            display:  "flex",   //最关键！否则导致小屏时左右两个半视图都显示变成了重叠啊。
            boxSizing: "border-box",
            flexDirection: "column",
            flex: "1",
            boxShadow: "none",
            background: "white",
            //position: "absolute", 滚动条位置变化
            position: "fixed",
            width: "100%",
            borderRadius: 0,

            margin: theme.spaces.sm,
            marginRight: 0,
            marginLeft: 0,
            //overflow: "hidden",
            height: `calc(100vh - ${theme.spaces.sm})`,
            [theme.mediaQueries.md]: {
              //display: "flex",       //较大屏幕场景，不管renderList也都要显示了。
              position: "fixed",
              zIndex: theme.zIndices.fixed,
              top: 0,
              boxShadow: theme.shadows.xl,
              overflow: "hidden",
              width: "100%",
              maxWidth: "325px",
              borderRadius: theme.radii.lg,
              margin: theme.spaces.lg,
              height: `calc(100vh - ${theme.spaces.lg} - ${theme.spaces.lg})`
            },
            [theme.mediaQueries.xl]: {
              margin: theme.spaces.xl,
              width: "400px",
              maxWidth: "400px",
              height: `calc(100vh - ${theme.spaces.xl} - ${theme.spaces.xl})`
            }
          }}
        >
          {/*黑色抬头2行*/}
          <div
            css={[
              {
                //position: "fixed",
                width: "100%",
                top: 0,
                //zIndex: theme.zIndices.fixed,
                background: theme.colors.palette.gray.base,
                zIndex: theme.zIndices.sticky,
                position: "sticky",
              }
            ]}
          >
            {/*两个按钮,DarkMode色差突出焦点*/}
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
                <Tooltip content="增加个新菜谱">
                  <div>
                    <DarkMode>
                      <IconButton
                        component={Link}
                        to="/chaipu/new"
                        variant="ghost"
                        label="加菜谱"
                        size="md"
                        icon={<IconPlus />}
                      />
                    </DarkMode>
                  </div>
                </Tooltip>
                <Tooltip content="其他命令">
                  <div>
                    <DarkMode>
                      <IconButton
                        component={Link}
                        to="/chaipu/new"
                        variant="ghost"
                        label="加菜谱"
                        size="md"
                        icon={<IconPlus />}
                      />
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
                  <Tab id="recipes">菜谱表</Tab>
                  <Tab id="following">我关注</Tab>
                  <Tab
                    badge={ //揭示数目
                      !followRequests
                        ? 13
                        : null
                    }
                    id="followers"
                  >
                    关注队伍
                  </Tab>
                  <Tab id="inspect">检验任务</Tab>
                  <Tab id="device">设备检验委托</Tab>
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
            <TabPanel
              css={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                minHeight: 0
              }}
              id="recipes"
            >
              <RecipeList />
            </TabPanel>
            <TabPanel
              css={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
              id="following">
              <FollowingList />
            </TabPanel>
            <TabPanel
              css={{  height: "100%" }}
              id="followers"
            >
              <FollowersList />
            </TabPanel>
            <TabPanel id="city">

            </TabPanel>
            <TabPanel id="inspect">
              <FollowersList />
            </TabPanel>
            <TabPanel id="device">

            </TabPanel>
          </Pager>
        </Layer>
  );
};


export default MainLeftPart;

//原来是<Layer display: renderList ? "flex" : "none", 修改成直接代码逻辑层面控制的隐藏。
//display:none ---不为被隐藏的对象保留其物理空间，即该对象在页面上彻底消失，通俗来说就是看不见也摸不到。
