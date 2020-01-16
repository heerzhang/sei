/** @jsx jsx */
import { jsx, css, Global } from "@emotion/core";
import * as React from "react";
import {
  Button,
  DarkMode, IconButton, IconChevronDown, IconPlus,
  Layer,
  LightMode,
  MenuItem,
  MenuList,
  Navbar,
  ResponsivePopover, Tab, TabPanel, Tabs,
  Toolbar, Tooltip,
  Pager, useTheme
} from "customize-easy-ui-component";
import { Link, useRoute } from "wouter";
import { SearchBox } from "./SearchBox";
import { RecipeList } from "./RecipeList";
import { FollowingList } from "./FollowingList";
import { FollowersList } from "./FollowersList";
import { useSession, useSignOut } from "./auth";
import useLocation from "wouter/use-location";

import { useMedia } from "use-media";

//骨架-背景

export interface LayoutProps {
  children: React.ReactNode;
  path?: string;
}
//公用部分的组件可以直接引入；
export const Layout: React.FunctionComponent<LayoutProps> = ({ children, path }) => {
  const theme = useTheme();
  const {user,} = useSession();
  const [query, setQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState(0);
  const { value: followRequests } ={value: null};  　// useFollowRequests();
  //这里isLarge所代表的屏幕尺寸必须和底下的更多元素的[theme.mediaQueries.]控制保持一致性，否则页面会重叠。　md: >="768px"
  //isLarge在屏幕大小动态调整时，将会重新render整个页面。
  const isLarge = useMedia({ minWidth: "768px" });

  const [nowPath, setLocation] = useLocation(); 　//取得路由钩子, nowPath是整个url。

  const [, params] = useRoute(`${path}/:recipe*`);
  const showingRecipe = params.recipe;
  //控制界面的关键！：  showingRecipe=显示具体单项的菜谱的ID或者'new'; ==控制右部分界面显示。
  //注意小屏场合：ＵＲＬ的参数recipe*，带上ID就说明，迫使renderList=false必须　隐藏掉；　否则界面会重叠。
  const renderList = isLarge || !showingRecipe;  　//大屏或者小屏但是没有显示具体单项的菜谱的场合。

  function onLogoutDo() {
    setLocation("/login",  false );
    //navigate("/login" , { replace: true });
  }
  const { userList, submitfunc:signOut, error:errLogin, logging,setLogging } = useSignOut(onLogoutDo);
  console.log("Layout路由2z=",location.search,";showingRecipe=",showingRecipe);

  return (
    <React.Fragment>
      <Global
        styles={{
          html: {
            [theme.mediaQueries.md]: {
              backgroundAttachment: "fixed",
              backgroundSize: "cover",
              backgroundImage: `url(${require("./images/cutting-board-knife.jpg")})`
            }
          }
        }}
      />
        {children}
    </React.Fragment>
  );
};


//React {children}详解    https://www.cnblogs.com/chen-cong/p/10371329.html

