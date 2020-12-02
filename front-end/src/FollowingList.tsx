/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import { useFollowerIngs } from "./hooks/useHelpers";
import {
  List,
  ListItem,
  Avatar,
  IconButton,
  Button,
  Popover,
  MenuList,
  Stack,
  MenuItem,
  Text,
  useTheme,
  useToast,
  IconPlus,
  IconChevronRight,
  IconMoreVertical,
  StackTitle,
  Skeleton
} from "customize-easy-ui-component";
import { SearchBox } from "./SearchBox";
import debug from "debug";
//import algoliasearch from "algoliasearch";
import { useSession } from "./auth";
import find from "lodash.find";
import { useDeleteRequestFollow, usePaginateQueryUser, useRequestFollow } from "./db";
//import GestureView from "react-gesture-view";
import { FollowingRecipes } from "./FollowingRecipes";
//import { User } from "firebase";
import { StackItem, StackContext } from "react-gesture-stack";
import { animated } from "react-spring";
import {SearchTitle} from "./comp/base"

/*const client = algoliasearch(
  config.ALGOLIA_APP_ID,
  config.ALGOLIA_USER_SEARCH_KEY
);
//这里两个地方algoliasearch完全独立　initIndex名称不同的。
//这个users必须在https://www.algolia.com/apps/24MA89MM0B/explorer/browse/users网站创立。
//const index = client.initIndex("users");

function searchAlgoliaForUsers(query: string) {
  return index.search({ query });
}*/

const log = debug("app:FollowingList");

//接口参数类型
interface ResponseLikeAlgoliasearch<T=any> {
  hits: T[];
  //processingTimeMS: number;
}

export interface FollowingListProps {}

export const FollowingList: React.FunctionComponent<
  FollowingListProps
> = props => {
  const theme = useTheme();
  const toast = useToast();
  const {user,} = useSession();
  //graphQl的查询usexxx钩子函数，无法主动从后端读取最新数据。
  const { loading, userList:followings } = useFollowerIngs(false);
  //搜索user的输入:
  const [query, setQuery] = React.useState("");
  const [
    queryResults,
    setQueryResults
  ] = React.useState<ResponseLikeAlgoliasearch | null>(null);

  //状态管理　relation＝当前显示的或者按钮点击事件产生,关注的user是谁。
  const [relation, setRelation] = React.useState(null);
  //console.log("来看当前的relation=",relation );
  const { submitfunc:requestFollow } = useRequestFollow(user, relation||{});
  //钩子函数必须放在组件代码顶部，不能放置在逻辑条件分子语句内部，要确保都能调用到钩子函数。
  const {submitfunc:deleteRequestFollow } = useDeleteRequestFollow(relation && relation.id);

  const [filter, setFilter] = React.useState({where:
        {a: {s:'username',o:'LK',sv:query },   },
     });

  const {
    items: usersFind,
  } =usePaginateQueryUser(filter);


  async function inviteUser(otherUser: any) {
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
  }

  async function deleteRequest(id: string) {
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
  }

  const noUsers = !query && (!followings || (followings && followings.length === 0));
  //界面轮播 setIndex切换显示界面；   //index不是组件外部那一个同名index；
  const [index, setIndex] = React.useState(0);


  function unfollow(id: string) {
    deleteRequest(id);
    setRelation(null);
    setIndex(0);
  }

  function showRelation(user: any) {
    console.log("点击showRelation？=", user);
    setRelation(user);
    setIndex(1);
  }

  React.useEffect(() => {
    //console.log("伪善setQueryResul02=" ,query,usersFind);
    let filtercomp={where:
        {a:
          {s:'username',o:'LK',sv:query },
        },
      offset:0,
      first:5,
      orderBy: "lastPasswordResetDate",
      asc: false
    };
    setFilter(filtercomp);
  }, [query]);
  //这两个useEffect的前后顺序不能颠倒，顺序非常重要，后面的依赖于前面的useEffect更新结果。
  //操作UI副作用；要进一步做修正性处理。
  React.useEffect(() => {
    //console.log("伪善setQueryResul00=" ,query,usersFind);
    async function fetchUsers() {
      if (!query) {
        return;
      }
      //云搜索的results；　搜索目标＝索引区域是users的缓存。
      //const results =usersFind;     results =await searchAlgoliaForUsers(query);
      log("search results: %o", usersFind);
      //扣除已经关注的，从搜索结果剔除。
      const hits = usersFind
        .filter(hit => {
          if (hit.id === user.uid) {
            return false;    // 我自己的user.uid ，剔除！
          }
          //扣除已经关注followings=的用户，
          return !find(followings, { toUser:{id: hit.id} });
        });
      /*   .map(hit => {
          const relationU = find(followings, { toUser:{id: hit.objectID} });    //能找已经关注的
          　　//这requested没用到？
            //实际上面filter过滤之后，执行到这里relationU必定是null的;　　新增加字段requested, 深度拷贝hit;
          return {
            ...hit,
            requested: relationU ? relationU.toUser.id : null
          };
        });*/

      console.log("伪善setQueryResults=" ,hits,usersFind);
      //其实只有hits有用处的；
      setQueryResults({
        hits
      });
    }
    //因为其它操作副作用的，导致需要进一步更新要求：
    fetchUsers();
  }, [query, followings, usersFind, user.uid]);
  //上面这个副作用必须 加usersFind，否则无法继续处理后端数据带来的必要的UI反馈变化。
  //控件<Stack 是堆叠式的，像导航条；适用同一个模板显示只需上级给下级参数调整的场景。根据上一叠页面选择触发状态relation给下一叠参数来控制下一级显示；更多嵌套很困难。
  return (
    <Stack
      css={{
        height: "100%",
        [theme.mediaQueries.md]: {
          minHeight: `calc(100vh - 164px)`,  //上级窗口还没限制高度
        },
      }}
      index={index}
      navHeight={60}
      onIndexChange={i => setIndex(i)}
      items={[
        {
          title: (
            <SearchTitle>
              <SearchBox
                css={{ borderBottom: "none" }}
                label="Search 从algoliasearch云 来搜寻某个用户 to follow"
                query={query}
                setQuery={setQuery}
              />
            </SearchTitle>
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
                    您还没有following anyone. Start following
                    someone by searching for their email in the box above.
                  </Text>
                )}

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

                  {query &&
                   queryResults &&
                   queryResults.hits.map(hit => (
                    <ListItem
                      key={hit.id}
                      onPress={() => inviteUser(hit)}
                      contentBefore={
                        <Avatar
                          size="sm"
                          src={hit.photoURL}
                          name={hit.username || hit.mobile}
                        />
                      }
                      primary={hit.id || hit.mobile }
                      contentAfter={
                        <IconPlus
                          color={theme.colors.text.muted}
                          aria-hidden
                          size="lg"
                        />
                      }
                    />
                  ))}

                  {followings　&&　followings.map(userB => {
                    return (
                      <ListItem
                        key={userB.toUser.id}
                        interactive={userB.confirmed ? true : false}
                        onPress={() =>
                          showRelation({ ...userB.toUser  } )
                        }
                        contentBefore={
                          <Avatar
                            size="sm"
                            src={userB.toUser.photoURL}
                            name={
                              userB.toUser.username || userB.toUser.email || ('图片' || userB.toUser.id)
                            }
                          />
                        }
                        primary={userB.toUser.username || userB.toUser.email || userB.toUser.id}
                        contentAfter={
                          userB.confirmed ? (
                            <IconChevronRight
                              color={theme.colors.text.muted}
                              aria-hidden
                            />
                          ) : (
                            <Button
                              onPress={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setRelation(userB.toUser);
                                deleteRequest(userB.toUser.id);
                              }}
                              size="sm"
                            >
                              我要取消这条关注{userB.toUser.id}的请求
                            </Button>
                          )
                        }
                      />
                    );
                  })}
                </List>

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
                          Unfollow　不想关注他了={relation.id || '空的？'} user
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
              title={relation ? relation.username || relation.mobile : ""}
            />
          ),
          content: (
            <StackItem>
              {relation && (
                <FollowingRecipes key={relation.id} id={relation.id} />
              )}
            </StackItem>
          )
        }
      ]}
    />
  );

};



//别人封装好的组件也可定制和替换：SearchTitle用于代替基本构件库react-gesture-stack的已有标准样式StackTitle部分，相当于定制修改原生就有的组件。
function SearchTitle_删除({ children }) {
  const {
    active,
    opacity,
    transform
  } = React.useContext(StackContext);

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
          opacity,          //版本不支持，！暂时改
       //   transform: transform.to(x => `translateX(${x * 0.85}%)`)
       //   opacity:  '$(opacity.animation.to)',
          transform: `translateX(${transform.to(x => `translateX(${x * 0.85}%)` )})`
        } as any }
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

