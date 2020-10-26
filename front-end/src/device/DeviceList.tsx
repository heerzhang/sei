/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import {
  List,
  ListItem,
  Avatar,
  IconButton,
  Button,
  MenuList,
  Stack,
  useTheme,
  IconMoreVertical,
  StackTitle,
  Skeleton, MenuItem, IconPackage, ResponsivePopover
} from "customize-easy-ui-component";
import { SearchDeviceBox } from "./SearchDeviceBox";

//import algoliasearch from "algoliasearch";
//import config from "./firebase-config";

import {  usePaginateQueryDevice,  } from "./db";

//import { FollowingRecipes } from "./FollowingRecipes";

import { StackItem, StackContext } from "react-gesture-stack";
import { animated } from "react-spring";
import {  useLocation } from "wouter";
//import { useHistory } from "react-router-dom";
//@reach 的 Link 可以附带state ；
//import { Link, navigate, globalHistory } from "@reach/router";

//import useHistoryState from "use-history-state";
import { useEffect } from "react";
import { useInView } from 'react-intersection-observer'
//import { PullToRefresh,PullDownContent,RefreshContent,ReleaseContent } from "react-js-pull-to-refresh";
import { DevfilterContext } from "../context/DevfilterContext";
import {DeviceListInner} from "./DeviceListInner"


interface DeviceListProps {}
export const DeviceList: React.FunctionComponent<
  DeviceListProps
> = props => {
  const theme = useTheme();
  //搜索编辑框的输入:
  const [query, setQuery] = React.useState("" as any);

 // const [queryResults,setQueryResults] = React.useState<any>( null );

  //状态管理　relation＝当前显示的或者按钮点击事件产生,关注的user是谁。
  const [relation, ] = React.useState(null);
  const {filter:devfl, } =React.useContext(DevfilterContext);
  //console.log("DeviceList当前的查询 queryResults=", queryResults);
  //根据options选择结果，来组织后端的查询参数。
  //经过路由跳转的情况useState会重新初始化mount,还有一种仅仅是界面上同一大组件底下切换显示的不会经过路由，数据列表状态不变也不会触发去后端读取更新。
   const [filter, setFilter] = React.useState({where: { ...devfl },
    offset:0, limit:1,
  } as any);

  //界面轮播 setIndex切换显示界面；   //index不是组件外部那一个同名index；
  const [index, setIndex] = React.useState(0);
  //根据query的改变来重新查询哪。
  React.useEffect(() => {
    let filtercomp={where: {cod: query, ...devfl},
      offset:0,
      limit:2,
      orderBy: "instDate",
      asc: false
    };
    console.log("伪set Filter 回调=filtercomp=",filtercomp);
    setFilter(filtercomp);
  }, [query,devfl]);

  console.log("霉变render query=",query);

  //控件<Stack 是堆叠式的，像导航条；适用同一个模板显示只需上级给下级参数调整的场景。根据上一叠页面选择触发状态relation给下一叠参数来控制下一级显示；更多嵌套很困难。
  return (
    <Stack
      css={{        //上级窗口已经限制高度，要在里面滚动适应。
        //height: "100%",     minHeight改成了height
        height: `calc(100vh - 2 * ${theme.spaces.xs} - 0.875rem - 2 * 10px - 63px)`,
        [theme.mediaQueries.md]: {
          height: `calc(100vh - 2 * ${theme.spaces.lg} - 0.875rem - 2 * 10px - 71px)`
        },
        [theme.mediaQueries.xl]: {
          height: `calc(100vh - 2 * ${theme.spaces.xl} - 0.875rem - 2 * 10px - 71px)`
        }
      }}
      index={index}
      navHeight={60}
      onIndexChange={i => setIndex(i)}
      items={[
        {
          title: (
            <SearchTitle>
              <SearchDeviceBox
                css={{ borderBottom: "none" }}
                label="搜某设备,列表数量限制,用参数缩小范围"
                query={query}
                setQuery={setQuery}
              />
            </SearchTitle>
          ),
          content: (
            <StackItem >
              <div
                css={{
                  overflowY: "auto",
                  //overflowY: "scroll", 滚动触发，小屏幕很明显的条，滚动条会随浏览器屏幕设备模式变化样式。
                  height: "100%",
                }}
              >

                <DeviceListInner filter={filter}/>

                </div>
            </StackItem>
          )
        },
        {
          title: (
            <StackTitle
              backTitle={"作废"}
              contentAfter={
                relation && ( 349 )
              }
              title={relation ? relation.username || relation.mobile : ""}
            />
          ),
          content: (
            <StackItem>
              {relation && ( false
               //作废了，未用  <FollowingRecipes key={relation.id} id={relation.id} />
              )}
            </StackItem>
          )
        }
      ]}
    />
  );

};



//别人封装好的组件也可定制和替换：SearchTitle用于代替基本构件库的已有标准样式StackTitle部分，相当于定制修改原生就有的组件。
function SearchTitle({ children }: { children: React.ReactNode }) {
  const {
    active,
    transform
  } = React.useContext(StackContext);

  //const {calc: { to : opacityTo} } =transform;
 // console.log("Login开始DV SearchTitle transform=",transform, " \n opacityTo=",transform.to(0));

  return (
    <div
      className="StackTitle"
      aria-hidden={!active}
      style={{
        pointerEvents: active ? "auto" : "none",
        zIndex: 10,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0
      }}
    >
      {/*<animated.div 版本不支持暂时改成div*/}
      <animated.div
        className="StackTitle__heading"
        style={{
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
          opacity:  '$(opacity.animation.to)',
          transform: `translateX(${transform.to(x => `translateX(${x * 0.85}%)` )})`
       //   opacity,          //版本不支持，！暂时改
       //   transform: transform.to(x => `translateX(${x * 0.85}%)`)
        }}
      >
        {children}
      </animated.div>
    </div>
  );
}


//报错Cannot read property 'map' of null标记出错代码行，竟可能会差错！实际错误点实在下方，报错指示却在上方的代码行，两处都有.map的代码。
//<Stack 组件，实际上是内部状态控制界面的呈现，实际上DOM数据内容并没有同步地变更，只是页面切换着看；适用数据库组织的；PK的，导航堆叠场景实际是源代码组织的。
//幸运的事！！<StackItem>底下内嵌的组件可以做到每一个都是独立自主的。这里<FollowingRecipes key={}/>对每一个按钮进入和后退的，虽然组件同一个，但内部状态数据可各自独立的。
//overflowY:"scroll"若遇到 css={{height: "100%", 和 minHeight: '300px' 不能同时添加的。overflowY:和"100%"一起使用，且要在内层DIV上用。组件中间层可能屏蔽掉。
//多层DIV的height: "100%", 需要在中间层次添加100%传递父辈限制大小，配合内部层的overflowY: "scroll",才能滚动。
//[query] = React.useState(""); 为何导致 if(!query) 成立， ""即空字符串等于false。

