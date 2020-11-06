/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import {  usePaginateQueryTask } from "./db";
import {
  List,
  ListItem,
  Avatar,
  IconButton,
  Popover,
  MenuList,
  Stack,
  MenuItem,
  Text,
  useTheme,
  IconChevronRight,
  IconMoreVertical,
  StackTitle,
  Skeleton
} from "customize-easy-ui-component";

//import { useSession } from "../../auth";
//import find from "lodash.find";



import { StackItem,  } from "react-gesture-stack";
//只能在内容的顶部下拉，才能触发的，还是需要快捷的按钮。
import { PullDownContent, PullToRefresh, RefreshContent, ReleaseContent } from "react-js-pull-to-refresh";
import { BoundDevices } from "./BoundDevices";




//接口参数类型
interface ResponseLikeAlgoliasearch<T=any> {
  hits: T[];
  //processingTimeMS: number;
}

export interface FollowingListProps {}
//检验任务列表的主窗口
export const TaskList: React.FunctionComponent<
  FollowingListProps
> = props => {
  const theme = useTheme();
  //const toast = useToast();
  //graphQl的查询usexxx钩子函数，无法主动从后端读取最新数据。

  const { loading, items:tasks , refetch} = usePaginateQueryTask(null);
  //搜索user的输入:
  const [query, ] = React.useState("");
  /*const [
    queryResults,
    setQueryResults
  ] = React.useState<ResponseLikeAlgoliasearch | null>(null);
*/
  //状态管理　relation＝当前显示的或者按钮点击事件产生,关注的user是谁。
  const [relation, setRelation] = React.useState(null);
  //console.log("来看当前的relation=",relation );
//  const { userList:sucessFollow ,submitfunc:requestFollow } = useRequestFollow(user, relation||{});
  //钩子函数必须放在组件代码顶部，不能放置在逻辑条件分子语句内部，要确保都能调用到钩子函数。
//  const { result:sucessDelFollow ,submitfunc:deleteRequestFollow } = useDeleteRequestFollow(relation && relation.id);

  const [, setFilter] = React.useState({where:
        {cod:query },
     });

/*  const {
    loading: loadingUser,
    loadingError,
    items: usersFind,
    loadMore
  } =usePaginateQueryUser(filter);
*/

/*  async function inviteUser(otherUser: any) {
    try {
      setRelation(otherUser);
      log("otherUser: %o", otherUser);
      //await requestFollow(user, otherUser);
      await requestFollow( otherUser);
      toast({
        title: `A request has been sent to ${otherUser.displayName ||
          otherUser.email}`,
        intent: "success"
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "An error occurred while making your request.",
        subtitle: err.message,
        intent: "danger"
      });
    }
  }*/

/*  async function deleteRequest(id: string) {
    try {
      log("delete request: %s", id);
      await deleteRequestFollow();
    } catch (err) {
      console.error(err);
      toast({
        title: "An error occurred while cancelling your request.",
        subtitle: err.message,
        intent: "danger"
      });
    }
  }*/

  const noUsers = !query && (!tasks || (tasks && tasks.length === 0));
  //界面轮播 setIndex切换显示界面；   //index不是组件外部那一个同名index；
  const [index, setIndex] = React.useState(0);


  function unfollow(id: string) {
   // deleteRequest(id);
    console.log("点击派工呢？id=", id);
    setRelation(null);
    setIndex(0);
  }

  function showRelation(id: any) {
    console.log("点击showRelation？id=", id);
    setRelation(id);
    setIndex(1);
  }

  React.useEffect(() => {
    //console.log("伪善setQueryResul02=" ,query,usersFind);
    let filtercomp={where:
        {cod:query },
      offset:0,
      first:5,
      orderBy: "useDt",
      asc: false
    };
    setFilter(filtercomp);
  }, [query]);
  //这两个useEffect的前后顺序不能颠倒，顺序非常重要，后面的依赖于前面的useEffect更新结果。
  //操作UI副作用；要进一步做修正性处理。
  //usersFind=搜索框搜到到的user;


  //上面这个副作用必须 加usersFind，否则无法继续处理后端数据带来的必要的UI反馈变化。
  //控件<Stack 是堆叠式的，像导航条；适用同一个模板显示只需上级给下级参数调整的场景。根据上一叠页面选择触发状态relation给下一叠参数来控制下一级显示；更多嵌套很困难。
  return (
    <Stack
      css={{
        height: `calc(100vh - 0.875rem - 2 * 10px - 63px)`,
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
            <StackTitle
              backTitle={"回退吧"}
              contentAfter={
                (
                  <Popover
                    content={
                      <MenuList>
                        <MenuItem onPress={() => refetch( {} )}>
                          更新任务列表
                        </MenuItem>
                      </MenuList>
                    }
                  >
                    <IconButton
                      onPress={e => e.stopPropagation()}
                      variant="ghost"
                      icon={<IconMoreVertical/>}
                      label="Options菜单"
                    />
                  </Popover>
                )
              }
              title={"当前所有任务单"}
            />
          ),
          content: (
            <StackItem >
              <div
                css={{
                  overflowY: "scroll",
                  height: "100%",
                }}
              >
                {!loading && noUsers && (
                  <Text
                    muted
                    css={{
                      fontSize: theme.fontSizes[0],
                      display: "block",
                      margin: theme.spaces.lg
                    }}
                  >
                    您还没有任务
                  </Text>
                )}

                <PullToRefresh
                  pullDownContent={<PullDownContent label={'下拉可即刻刷新内容'}/>}
                  releaseContent={<ReleaseContent label={'够了，放开就能刷新'}/>}
                  refreshContent={<RefreshContent />}
                  pullDownThreshold={120}
                  onRefresh={() => refetch( {} )}
                  triggerHeight={50}
                  backgroundColor="white"
                >

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

                  {tasks　&&　tasks.map(each => {
                    return (
                      <ListItem
                        key={each.id}
                        interactive={ true}
                        onPress={() =>
                          showRelation( each.id )
                        }
                        contentBefore={
                          <Avatar size="sm"   src={each.status}
                            name={each.id || ('图片' || each.dep)}
                          />
                        }
                        primary={`日期 ${each.date}`}
                        secondary={`状态 ${each.status}` }
                        contentAfter={
                            <IconChevronRight  color={theme.colors.text.muted} aria-hidden/>
                        }
                      >
                        任务号 {each.id}
                      </ListItem>
                    );
                  })}
                </List>

                </PullToRefresh>

              </div>
            </StackItem>
          )
        },
        {
          title: (
            <StackTitle
              backTitle={"回退吧"}
              contentAfter={
                relation && (
                  <Popover
                    content={
                      <MenuList>
                        <MenuItem onPress={() => unfollow(relation.id)}>
                          派工任务{relation || '？'}给检验员
                        </MenuItem>
                      </MenuList>
                    }
                  >
                    <IconButton
                      onPress={e => e.stopPropagation()}
                      variant="ghost"
                      icon={<IconMoreVertical />}
                      label="Options菜单"
                    />
                  </Popover>
                )
              }
              title={ '该任务'+ (relation?.username||'') +'下挂设备' }
            />
          ),
          content: (
            <StackItem>
              {relation && (
                <BoundDevices key={relation} id={relation} />
              )}
            </StackItem>
          )
        }
      ]}
    />
  );

};



