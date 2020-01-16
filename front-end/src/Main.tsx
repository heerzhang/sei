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
  Pager,
} from "customize-easy-ui-component";
import { RecipeList } from "./RecipeList";
//import { useFollowRequests } from "./hooks/with-follow-request-count";
import { FollowersList } from "./FollowersList";
import { FollowingList } from "./FollowingList";
import { useSession,  useSignOut } from "./auth";
import { Compose } from "./Compose";
import { Recipe } from "./Recipe";
//import { useTransition, animated } from "react-spring";

import { Link, useRoute, useLocation } from "wouter";
//import { Link, navigate } from "@reach/router";
import { useMedia } from "use-media";
import { Layout } from "./Layout";

//手机上看起来好像许多个页面，实际上要人工根据逻辑去控制页面元素的隐藏与否标记，人工营造多种显示形态！
//主页面框架结构：左半边RecipeList， FollowingList{附带FollowingRecipes}， FollowersList + 右边的 MainContent{ 逻辑判定Compose或Recipe }；

export interface MainProps {
  path?: string;
  id?: string;
}

export const Main: React.FunctionComponent<MainProps> = props => {
  const theme = useTheme();
  const {user,} = useSession();

  const [activeTab, setActiveTab] = React.useState(0);

  const { value: followRequests } ={value: null};  　// useFollowRequests();
  //这里isLarge所代表的屏幕尺寸必须和底下的更多元素的[theme.mediaQueries.]控制保持一致性，否则页面会重叠。　md: >="768px"
  //isLarge在屏幕大小动态调整时，将会重新render整个页面。
  const isLarge = useMedia({ minWidth: "768px" });

  const [, params] = useRoute("/chaipu/:recipe*");
  const showingRecipe = params.recipe;
  //  const showingRecipe = props["*"];   　　 //"这个是问号前的除已预定义部分的剩余路径lo/gins/ds？

  // i'm disabling this for now, since it was running really poorly. unsure
  // whats up here.

  // const transitions = useTransition(false, recipeId => null, {
  //   from: { opacity: 0, transform: "scale(0.95)" },
  //   enter: { opacity: 1, transform: "scale(1)" },
  //   leave: { opacity: 0, transform: "scale(1.1)" },
  //   immediate: !isLarge
  // });

  const [nowPath, setLocation] = useLocation(); 　//取得路由钩子。
  console.log("进入Main功能页面 params=",params,";showingRecipe="+showingRecipe, nowPath,"isLarge=",isLarge);
  //控制界面的关键！：  showingRecipe=显示具体单项的菜谱的ID或者'new'; ==控制右部分界面显示。
  //注意小屏场合：ＵＲＬ的参数recipe*，带上ID就说明，迫使renderList=false必须　隐藏掉；　否则界面会重叠。
  const renderList = isLarge || !showingRecipe;  　//大屏或者小屏但是没有显示具体单项的菜谱的场合。

  function onLogoutDo() {
    setLocation("/login",  false );
    //navigate("/login" , { replace: true });
  }
  const {  submitfunc:signOut,  } = useSignOut(onLogoutDo);


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
            display: renderList ? "flex" : "none",   //最关键！否则导致小屏时左右两个半视图都显示=重叠啊。
            boxSizing: "border-box",
            flexDirection: "column",
            flex: "1",
            boxShadow: "none",
            background: "white",
            position: "absolute",   //滚动条位置变化
            //position: "fixed",  左半部分规定不移动
            width: "100%",
            borderRadius: 0,

            margin: theme.spaces.sm,
            marginRight: 0,
            marginLeft: 0,
            //overflow: "hidden",
            height: `calc(100vh - ${theme.spaces.sm})`,
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
              height: "unset",   //较大屏左半部分可伸长，上级滚动条起作用
             // height: `calc(100vh - ${theme.spaces.lg} - ${theme.spaces.lg})`
            },
            [theme.mediaQueries.xl]: {
              margin: theme.spaces.xl,
              //width: "400px",
              maxWidth: "40vw",
             //height: `calc(100vh - ${theme.spaces.xl} - ${theme.spaces.xl})`
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
                  <Tab id="city">城市</Tab>
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
        {//右中部内容主体部分，可能在超大屏幕下，感觉这部分视图尺寸也太小了。
          //实际情况：在小屏场合，左半边内容被后面的右中文档流后面的界面部分给屏蔽遮盖掉了。
        }
        {showingRecipe && (
          <div
            css={{  //上层的div控制大的界面布局方向感。
              display: "block",
              position: "relative",
              flex: 1,      　//对布局影响最大的人竟然是它！最最关键的！。
              [theme.mediaQueries.md]: {
                display: "flex",    　//这里的flex没表现出太大影响力度。
                justifyContent: "center"
              }
            }}
          >

            <div
              css={{    //下一层的div在上层div基础上面更进一步调整感觉。
                display: "block",
                position: "absolute",
                width: "100%",        //内容占用宽度
                boxSizing: "border-box",
                [theme.mediaQueries.md]: {
                  display: "flex",
                  justifyContent: "center",     //相对于父辈div继续调整感觉。
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
                    //maxWidth: "700px",
                    borderRadius: theme.radii.lg,
                    boxShadow: theme.shadows.xl
                  }
                }}
              >
                <MainContent id={showingRecipe} />
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
}

function MainContent({ id }: MainContentProps) {
  if (!id) {
    return null;
  }
  if (id === "new") {
    return <Compose />;
  }
  return <Recipe id={id} />;
}


//是在WaitingComponent(lazy(() => import("需要的")));
export default Main;



//弹性布局=Flex布局：语法篇;   http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html?utm_source=tuicool
//主页面的菜谱页面搜索，把输入字符串直接注入到<RecipeList query={query} />
//注意<RecipeList {...refPanel}/> 跟 <RecipeList refPanel={refPanel}/> 并不一样，前者把对象的成员解构，而后者是单个对象。
//<TabPanel 的内容可能会动态加载，动态生成；客户端所看到的：可能并不是一次性都把所有的<TabPanel 的组件全部生成DOM代码的给您的。
//React自主判定更新机制？？<TabPanel底下，若有两个<RecipeList user={}>必须配置不同的user参数；否则很可能导致两个组件内容会联动，一个组件的操作会同步影响到另外一个组件的内容。key还不够。
//关键的：虚拟DOM; React组件性能高效渲染   https://www.jianshu.com/p/100a55978253
//使用display: "none"比起 直接的逻辑隐藏 {flag &&()} 的弱点是不能让非{}逻辑包裹组件优先显示；没被逻辑包裹的组件显示更快更优先处理。
//<ResponsivePopover 大屏是Dialog小屏是Sheet，而且从DOM文件流上看都是独立于<APP/root>节点的；弹出式的是独立打包？。
