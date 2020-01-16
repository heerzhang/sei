/** @jsx jsx */
import { jsx, css,  } from "@emotion/core";
import * as React from "react";
import {
  useTheme,
  Layer,
} from "customize-easy-ui-component";

import {  useRoute,   Route,  Router, } from "wouter";
import useLocation from "wouter/use-location";
//import { Link, navigate } from "@reach/router";
import { useMedia } from "use-media";
import { Layout } from "./Layout";
import { Branding } from "./Branding";
import { Login, } from "./LoginPane";
//import {Helmet} from "react-helmet";
import queryString from "query-string";
import { MainLeftPart } from "./MainLeftPart";

//手机上看起来好像许多个页面，实际上要人工根据逻辑去控制页面元素的隐藏与否标记，人工营造多种显示形态！
//主页面框架结构：左半边RecipeList， FollowingList{附带FollowingRecipes}， FollowersList + 右边的 MainContent{ 逻辑判定Compose或Recipe }；

export interface MainProps {
  path?: string;
  id?: string;
}
//queryString参数引入，破坏了封装原则，特别注意要讲明白参数用途。
export const ThirdRoot: React.FunctionComponent<MainProps> = ({path}) => {
  const theme = useTheme();
 // const {user,} = useSession();
//  const [query, setQuery] = React.useState("");
 // const [activeTab, setActiveTab] = React.useState(0);

 // const { value: followRequests } ={value: null};  　// useFollowRequests();
  //这里isLarge所代表的屏幕尺寸必须和底下的更多元素的[theme.mediaQueries.]控制保持一致性，否则页面会重叠。　md: >="768px"
  //isLarge在屏幕大小动态调整时，将会重新render整个页面。
  const isLarge = useMedia({ minWidth: "768px" });

  const [mathched, params] = useRoute(`${path}/:recipe*`);
  const showingRecipe =　params && params.recipe;
  //捕获URL?后面的参数方法,公用组件的就可使用参数，后面嵌套路由的各个组件内部也能用它。
  const qs = queryString.parse(window.location.search);
  console.log("参数第三层路由mathched=",mathched, params,";match id=",qs.id);

  const [nowPath, ] = useLocation(); 　//取得路由钩子, nowPath是整个url。
 // const router = useRouter();

  //控制界面的关键！：  showingRecipe=显示具体单项的菜谱的ID或者'new'; ==控制右部分界面显示。
  //注意小屏场合：ＵＲＬ的参数recipe*，带上ID就说明，迫使renderList=false必须　隐藏掉；　否则界面会重叠。
  const renderList = isLarge || !showingRecipe;  　//大屏或者小屏但是没有显示具体单项的菜谱的场合。
  console.log("进入第三层路由renderList=",renderList,";showingRecipe="+showingRecipe, nowPath,"path=",path);
  /*function onLogoutDo() {
    setLocation("/login",  false );
    //navigate("/login" , { replace: true });
  }
  */
 // const { userList, submitfunc:signOut, error:errLogin, logging,setLogging } = useSignOut(onLogoutDo);


  return (
    <Layout>
      <div
        css={css`
          display: flex;
          box-sizing: border-box;
        `}
      >

        { renderList && <MainLeftPart path={path}/>}

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
                paddingLeft: "calc(324px + 3rem)"
              },
              [theme.mediaQueries.xl]: {
                paddingRight: theme.spaces.xl,
                paddingLeft: "calc(373px + 6rem)"
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
                //  overflow: "hidden",
                  boxSizing: "border-box",
                  marginBottom: "auto",
                  width: "100%",
                  maxWidth: "692px",
                  borderRadius: theme.radii.lg,
                  boxShadow: theme.shadows.xl
                }
              }}
            >

              <Router>
                <Route path={`${path}/brand`}>  　 <Branding />　    </Route>
                <Route path={`${path}/denlude`}>    <Login />    </Route>

                <Route path={`${path}/denlude`}>  <p>中间输出的内容</p>   </Route>

                <Route path="/:rest*"><p>没找到合适内容</p></Route>

              </Router>

      </Layer>
      </div>

      </div>
      )}

      </div>
    </Layout>
  );
};





//是在WaitingComponent(lazy(() => import("需要的")));
export default ThirdRoot;



//弹性布局=Flex布局：语法篇;   http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html?utm_source=tuicool
//主页面的菜谱页面搜索，把输入字符串直接注入到<RecipeList query={query} />
//内嵌路由 二层路由,<Route path="/testroot/  后续没有路径参数的,<Switch>之后就是最基础界面了,不会路由到:rest*,也就是预期正常的;
//捕获URL?后面的url传递参数方法,实际和路由没有半点关系，？之前的才算路由功能部分。
//嵌套路由，目的用于组件复用，布局也复用的，公用部分是第一层被路由后的组件，而差异部分对应第二层次的路由目标组件；大路由＋小路由的双层路由器模式。

