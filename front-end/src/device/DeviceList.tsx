/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import {
  List,
  ListItem,
  Avatar,
  IconButton,
  Button,
  Popover,
  MenuList,
  Stack,
  useTheme,
  IconPlus,
  IconMoreVertical,
  StackTitle,
  Skeleton, MenuItem, MenuDivider, IconPackage, ResponsivePopover
} from "customize-easy-ui-component";
import { SearchDeviceBox } from "./SearchDeviceBox";

//import algoliasearch from "algoliasearch";
//import config from "./firebase-config";

import {  usePaginateQueryDevice,  } from "./db";

//import { FollowingRecipes } from "./FollowingRecipes";

import { StackItem, StackContext } from "react-gesture-stack";
import { animated } from "react-spring";
import { Link as RouterLink, useLocation } from "wouter";
//import { useHistory } from "react-router-dom";
//@reach 的 Link 可以附带state ；
//import { Link, navigate, globalHistory } from "@reach/router";

//import useHistoryState from "use-history-state";
import { useEffect } from "react";
import { useInView } from 'react-intersection-observer'
import { PullToRefresh,PullDownContent,RefreshContent,ReleaseContent } from "react-js-pull-to-refresh";
import { DevfilterContext } from "../context/DevfilterContext";



//接口参数类型
interface ResponseLikeAlgoliasearch<T=any> {
  hits: T[];
  //processingTimeMS: number;
}

interface DeviceListProps {}

export const DeviceList: React.FunctionComponent<
  DeviceListProps
> = props => {
  const theme = useTheme();
  const [, setLocation] = useLocation();
  //搜索user的输入:
  const [query, setQuery] = React.useState("" as any);
  const [
    queryResults,
    setQueryResults
  ] = React.useState<ResponseLikeAlgoliasearch | null>(null);

  //状态管理　relation＝当前显示的或者按钮点击事件产生,关注的user是谁。
  const [relation, ] = React.useState(null);

  console.log("DeviceList当前的查询 queryResults.hits=", queryResults && queryResults.hits);
  //根据options选择结果，来组织后端的查询参数。
   const [filter, setFilter] = React.useState({where: {cod: '%'},
    offset:0, first:1,
  } as any);

  const {
    loading,
    items: devicesFind,
    fetchMore: loadMore　,refetch
  } =usePaginateQueryDevice(filter);

  //界面轮播 setIndex切换显示界面；   //index不是组件外部那一个同名index；
  const [index, setIndex] = React.useState(0);

  //let big="先有派出TASK，后来才会生成ISP\n" ;
 // const [option, setOption] = useHistoryState("", "option");
  //let history = useHistory();
  //navigate(state:{ })传递方式，数据可以很大，就是参数不会显示在URL当中会引起歧义。bug：可能需要刷新才正常。
  const {filter:devfl, } =React.useContext(DevfilterContext);
  //根据query的改变来重新查询哪。
  React.useEffect(() => {
    let filtercomp={where: {cod: query, ...devfl},
      offset:0,
      first:2,
      orderBy: "instDate",
      asc: false
    };
    console.log("伪set Filter 回调=filtercomp=",filtercomp);
    setFilter(filtercomp);
    //有些场合不需要做refetch就能触发，分页过滤，可能被appollo自动优化:没发起请求：它以为参数修改不影响显示。
    //还有问题：这个时间filter还是捕获的旧的，还必须延迟执行。
  }, [query]);
  React.useEffect(() => {
    //还有问题：这个时间filter还是捕获的旧的，还必须延迟执行。
    toRefresh();
  }, [filter]);
  //这两个useEffect的前后顺序不能颠倒，顺序非常重要，后面的依赖于前面的useEffect更新结果。
  //操作UI副作用；要进一步做修正性处理。
  React.useEffect(() => {
    async function fetchUsers() {
      console.log("伪set QueryRe 关键的=",query,"devicesFind=",devicesFind);
      const hits = devicesFind;
      setQueryResults({
        hits
      });
    }
    fetchUsers();
  }, [query, devicesFind]);
  //上面这个副作用必须 加usersFind，否则无法继续处理后端数据带来的必要的UI反馈变化。

  const [hasMore, setHasMore] = React.useState(true);
  const [refMore, acrossMore] = useInView({threshold: 0});
  //后端返回了loading变动=会更新整个DeviceList组件，同时也执行updateQuery: ()=>{}回调更新数据。
  const toLoadMore = React.useCallback(
    async () => {
      devicesFind && loadMore({
        variables: {
          offset: devicesFind.length,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          console.log("fetch来useInfiniteScroll看="+ JSON.stringify(fetchMoreResult)+",devicesFind.length=",devicesFind.length);
          if (!fetchMoreResult)   return prev;
          if (!fetchMoreResult.dev)   return prev;
          if(fetchMoreResult.dev.length===0)
            setHasMore(false);
          if(prev.dev.length + fetchMoreResult.dev.length > 2000 )
            setHasMore(false);
          //console.log("跑到了updateQuery-- hasMore=", hasMore );
          return Object.assign({}, prev, {
            dev: [...prev.dev, ...fetchMoreResult.dev],
          });
        },
      });
    },
    [loadMore ,devicesFind]
  );

    //.then(result => {    if(result.data.findAllEQPsFilter2.length<=0)   setHasMore(false);  })

  /*
  useEffect( () => { acrossMore && hasMore && toLoadMore() },
        [acrossMore,hasMore,  toLoadMore ]);
*/

  useEffect( () => {
    if(hasMore && devicesFind?.length>=15)  setHasMore(false);
    },
    [devicesFind]);

  async function toRefresh() {
    setHasMore(true);
    //TODO： 先清空旧的cache??  还是干脆取消该功能，代替为页面强制刷新
    refetch( {} );
  }

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

                  <List>
                    {/*新搜索到的用户，扣除已经关注的，单独排列在 上部分;  没有分页加载更多的user*/}
                    {loading && (
                      <React.Fragment>
                        <ListItem
                          interactive={false}
                          contentBefore={
                            <Skeleton
                              css={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%"
                              }}
                            />
                          }
                          primary={<Skeleton css={{ maxWidth: "160px" }} />}
                        />
                        <ListItem
                          interactive={false}
                          contentBefore={
                            <Skeleton
                              css={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%"
                              }}
                            />
                          }
                          primary={<Skeleton css={{ maxWidth: "200px" }} />}
                        />
                      </React.Fragment>
                    )}

                    {   queryResults && queryResults.hits &&
                     queryResults.hits.map((hit,i) => (
                        <ListItem key={hit.id}
                            onPress={e => {
                              setLocation(`/device/${hit.id}`);
                            }}
                          contentBefore={
                            <React.Fragment>
                              <Avatar size="xs" name={'曳'}/>
                              <Avatar size="xs" name={'有'}/>
                            </React.Fragment>
                          }
                          primary={`${hit.cod}`}
                          contentAfter={
                            <ResponsivePopover
                              content={
                                <MenuList>
                                  <MenuItem onPress={ async () => {
                                    //await setRepId(recipe.id);    handleDelete(recipe.id)
                                  }
                                  }>功能待续
                                  </MenuItem>
                                  <MenuItem contentBefore={<IconPackage />}  onPress={() => {
                                    setLocation("/device/new", { replace: false })
                                  } }>
                                   加个设备
                                  </MenuItem>
                                </MenuList>
                              }
                            >
                              <IconButton variant="ghost" icon={<IconMoreVertical/>} label="菜单"/>
                            </ResponsivePopover>
                          }
                        />
                    ))}

                  </List>

                    <div
                      css={{
                        textAlign: "center",
                        marginBottom: theme.spaces.md,
                        marginTop: theme.spaces.md
                      }}
                    >
                      { hasMore &&  (
                        <div>
                          <Button disabled={loading} onPress={ () =>{
                            toLoadMore();     //虽然引用表现是异步的，但还是需要某些步骤需要同步执行的，只能说是其内部深度嵌套了个Promise()。
                            //console.log(`按拉扯获取took ${duration}ms`);　//异步处理了，这里实际耗时也不短暂122ms; 可能因为loading要同步首先设置的。
                          } }>
                            按，拉扯获取更多......
                          </Button>
                        </div>
                      )}
                      {!hasMore &&　<React.Fragment>
                            <span>嘿，没有更多了</span>
                        </React.Fragment>
                      }
                    </div>
                    <div  ref={refMore}  css={{height: "1px"}}> </div>

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

