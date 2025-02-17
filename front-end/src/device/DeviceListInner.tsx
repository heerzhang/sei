/** @jsxImportSource @emotion/react */
//import { jsx } from "@emotion/react";
import * as React from "react";
import {
  List,
  ListItem,
  Avatar,
  IconButton,
  Button,
  MenuList,
  useTheme,
  IconMoreVertical,
  Skeleton, MenuItem, IconPackage, ResponsivePopover, IconRefButton
} from "customize-easy-ui-component";

import {  usePaginateQueryDevice,  } from "./db";
import { Link as RouterLink, useLocation } from "wouter";
import { useEffect } from "react";
import { useInView } from 'react-intersection-observer'
//import { PullToRefresh,PullDownContent,RefreshContent,ReleaseContent } from "react-js-pull-to-refresh";
//import { usePrevious } from "customize-easy-ui-component/esm/Hooks/previous";

interface DeviceListInnerProps {
  filter: any   //用props参数看看
}
export const DeviceListInner: React.FunctionComponent<
  DeviceListInnerProps
> = ({ filter }) => {
  const theme = useTheme();
  const [, setLocation] = useLocation();
  const {
    loading,
    items: devicesFind,
    fetchMore: loadMore　,refetch
  } =usePaginateQueryDevice(filter);

  //上面这个副作用必须 加usersFind，否则无法继续处理后端数据带来的必要的UI反馈变化。
  const refLsize = React.useRef(null);
  const [refMore, acrossMore] = useInView({threshold: 0});
  //后端返回了loading变动=会更新整个DeviceList组件，同时也执行updateQuery: ()=>{}回调更新数据。
  const toLoadMore = React.useCallback(
    async () => {
      refLsize.current=devicesFind?.length;    //看看有没有新增加项目
      devicesFind && loadMore({
        variables: {
          offset: devicesFind.length,
        }
      });
    },
    [loadMore ,devicesFind]
  );

  useEffect( () => { acrossMore && (refLsize.current!==devicesFind?.length) && toLoadMore() },
        [acrossMore,devicesFind,toLoadMore ]);

  //console.log("霉$R1变 refLsize=",refLsize.current,"devicesFind=",devicesFind?.length);

  const callRefetch = React.useCallback(() => {
    //setHasMore(true);
    refetch( filter );
  }, [refetch, filter]);

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
                  <RouterLink to={`/device/${hit.id}`}  key={hit.id}>
                    <ListItem
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
                                  <IconRefButton variant="ghost" icon={<IconMoreVertical/>} label="菜单"/>
                                </ResponsivePopover>
                              }
                    />
                  </RouterLink>
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
