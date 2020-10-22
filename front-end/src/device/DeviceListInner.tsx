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

import {  usePaginateQueryDevice,  } from "./db";
import {  useLocation } from "wouter";
import { useEffect } from "react";
import { useInView } from 'react-intersection-observer'
//import { PullToRefresh,PullDownContent,RefreshContent,ReleaseContent } from "react-js-pull-to-refresh";
//import { usePrevious } from "customize-easy-ui-component/esm/Hooks/previous";

interface DeviceListInner {
  filter: any   //用props参数看看
}
export const DeviceListInner: React.FunctionComponent<
  DeviceListInner
> = ({ filter }) => {
  const theme = useTheme();
  const [, setLocation] = useLocation();
  const {
    loading,
    items: devicesFind,
    fetchMore: loadMore　,refetch, updateQuery
  } =usePaginateQueryDevice(filter);

  //上面这个副作用必须 加usersFind，否则无法继续处理后端数据带来的必要的UI反馈变化。
  const refLsize = React.useRef(null);
  //const prvListLength=usePrevious(devicesFind?.length);
  //const [hasMore, setHasMore] = React.useState(true);
  //console.log("霉3变hasMore=",hasMore, "prvListLength?=", prvListLength!==devicesFind?.length );

  const [refMore, acrossMore] = useInView({threshold: 0});
  //后端返回了loading变动=会更新整个DeviceList组件，同时也执行updateQuery: ()=>{}回调更新数据。
  const toLoadMore = React.useCallback(
    async () => {
      refLsize.current=devicesFind?.length;    //看看有没有新增加项目
      devicesFind && loadMore({
        variables: {
          offset: devicesFind.length,
        },
        /*底下res|dev:实际是useQuery返回data变量的.res; 也就是prev|fetchMoreResult等价useQuery返回data变量;
        updateQuery: (prev, { fetchMoreResult }) => {
          console.log("fetch来useInfiniteScroll看="+ JSON.stringify(fetchMoreResult)+",devicesFind.length=",devicesFind.length);
          if (!fetchMoreResult)   return prev;
          if (!fetchMoreResult.res)   return prev;
          if(fetchMoreResult.res.length===0)
            setHasMore(false);
          if(prev.res.length + fetchMoreResult.res.length > 2000 )
            setHasMore(false);
          //console.log("跑到了updateQuery-- hasMore=", hasMore );
          return Object.assign({}, prev, {
            res: [...prev.res, ...fetchMoreResult.res],
          });
        },*/
      });
    },
    [loadMore ,devicesFind]
  );

  useEffect( () => { acrossMore && (refLsize.current!==devicesFind?.length) && toLoadMore() },
        [acrossMore,devicesFind,toLoadMore ]);
  /*
  useEffect( () => {
    if(hasMore &&  refLsize.current===devicesFind?.length)  setHasMore(false);
    },
    [hasMore,devicesFind]);
  */
  console.log("霉$R1变 refLsize=",refLsize.current,"devicesFind=",devicesFind?.length);

  const callRefetch = React.useCallback(() => {
    //setHasMore(true);
    refetch( filter );
  }, [refetch, filter]);

  /*  async function toRefresh() {
    //setHasMore(true);
    //TODO： 先清空旧的cache??  还是干脆取消该功能，代替为页面强制刷新
    refetch( filter );
  }
  */

  //有些场合不需要做refetch就能触发，可能被appollo自动优化。变化驱动链条query＝>filter
  //有问题：refetch这个时间的入口参数filter还是捕获的旧的，须延迟一个render()后再去做。
  React.useEffect(() => {
    //console.log("callRefetch重做归零filter=",filter,"devicesFind=",devicesFind);
    callRefetch();
  }, [filter,callRefetch]);

  //控件<Stack 是堆叠式的，像导航条；适用同一个模板显示只需上级给下级参数调整的场景。根据上一叠页面选择触发状态relation给下一叠参数来控制下一级显示；更多嵌套很困难。
  return (
    <React.Fragment>
            <List>
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

              {
                devicesFind?.map((hit,i) => (
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
                { (refLsize.current!==devicesFind?.length)  &&  (
                  <div>
                    <Button disabled={loading} onPress={ () =>{
                      toLoadMore();     //虽然引用表现是异步的，但还是需要某些步骤需要同步执行的，只能说是其内部深度嵌套了个Promise()。
                      //console.log(`按拉扯获取took ${duration}ms`);　//异步处理了，这里实际耗时也不短暂122ms; 可能因为loading要同步首先设置的。
                    } }>
                      按，拉扯获取更多......
                    </Button>
                  </div>
                )}
                {(refLsize.current===devicesFind?.length)  &&　<React.Fragment>
                      <span>嘿，没有更多了</span>
                  </React.Fragment>
                }
              </div>
              <div  ref={refMore}  css={{height: "1px"}}> </div>
    </React.Fragment>
  );
};
