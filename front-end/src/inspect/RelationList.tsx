/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import { usePaginateQueryTask } from "./db";
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
  IconChevronRight,
  IconMoreVertical,
  StackTitle,
  Skeleton, IconPackage
} from "customize-easy-ui-component";
import { SearchBox } from "../SearchBox";
import debug from "debug";
//import algoliasearch from "algoliasearch";
//import config from "./firebase-config";
import { useSession } from "../auth";
import find from "lodash.find";
import { useDeleteRequestFollow, usePaginateQueryUser,  } from "./db";
import { StackItem } from "react-gesture-stack";
import { Link as RouterLink, useLocation } from "wouter";
import { BoundReports } from "./report/BoundReports";
import { SearchTitle } from "../comp/base";


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

//接口参数类型 云服务的
interface ResponseLikeAlgoliasearch<T=any> {
  hits: T[];
  //processingTimeMS: number;
}

interface RelationListProps {
  check?: boolean    //我是审核人
}

export const RelationList: React.FunctionComponent<RelationListProps> = ({
      check=false
 }) => {
  const theme = useTheme();
  const toast = useToast();
  const {user,} = useSession();
  const [, setLocation] = useLocation();
  //graphQl的查询usexxx钩子函数，无法主动从后端读取最新数据。
  //const { loading, userList:followings } = useFollowerIngs(false);
  let filtercomp={where:
      {a: {s:'id',o:'EQ',lv:user.id }},
    offset:0,
    first:5,
    orderBy: "id",
    asc: false
  };
  const { loading, items:followings ,} = usePaginateQueryTask(filtercomp,check);
  //搜索user的输入:
  const [query, setQuery] = React.useState("");

  //状态管理　relation＝当前显示的或者按钮点击事件产生,关注的user是谁。
  const [relation, setRelation] = React.useState(null);


  const [filter, setFilter] = React.useState({where:
        {cod:query },
     });

  const noUsers = !query && (!followings || (followings && followings.length === 0));
  //界面轮播 setIndex切换显示界面；   //index不是组件外部那一个同名index；
  const [index, setIndex] = React.useState(0);

  function showRelation(item: any) {
    console.log("点击showRelation？item=", item);
    setRelation(item);
    setIndex(1);
  }

  React.useEffect(() => {
    //console.log("伪善setQueryResul02=" ,query,usersFind);
    let filtercomp={where:
        {cod:query },
      offset:0,
      first:5,
      orderBy: "instDate",
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
      log("search results: %o");
      //扣除已经关注的，从搜索结果剔除。
    }
    //因为其它操作副作用的，导致需要进一步更新要求：
    fetchUsers();
  }, [query, followings, user.uid]);
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
            <SearchTitle>
              <SearchBox
                css={{ borderBottom: "none" }}
                label="Search 从algoliasearch云 来搜寻某个用户"
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
                {!loading && noUsers && (
                  <Text
                    muted
                    css={{
                      fontSize: theme.fontSizes[0],
                      display: "block",
                      margin: theme.spaces.lg
                    }}
                  >
                    队列为空
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

                 {followings　&&　followings.map((item,i) => {
                   return (
                    <RouterLink  key={i}
                         to={`/inspect/${item.id}`} >
                      <ListItem
                        key={item.id}
                        interactive={ true }
                        onPress={() =>
                          showRelation({ ...item  } )
          //这里一次点击两个都触发了：RouterLink + showRelation; 详情页面 +左边框内<Stack 状态切换。首先触发Stack下沉的，然后页内路由，已加载组件状态能保留。
                        }
                        contentBefore={
                          <Avatar
                            size="sm"
                            src={item.photoURL}
                            name={item.id}
                          />
                        }
                        primary={item?.dev?.cod}
                        secondary={ `结论: ${item?.conclusion||''}` }
                        contentAfter={
                            <IconChevronRight
                              color={theme.colors.text.muted}
                              aria-hidden
                            />
                        }
                      >
                        {`检验号 ${item.id} 日期:${item?.task?.date||''}`}
                      </ListItem>
                    </RouterLink>
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
              backTitle={"回退"}
              contentAfter={
                relation && (
                  <Popover
                    content={
                      <MenuList>
                        <MenuItem contentBefore={<IconPackage />}  onPress={() => {
                          setLocation(`/inspect/${relation.id}/addReport/choose`,  { replace: true } );
                        } }>
                          增加个检验报告
                        </MenuItem>
                        <MenuItem onPress={() => void 0 }>
                          检验号{relation.id || ''}其他功能
                        </MenuItem>
                      </MenuList>
                    }
                  >
                    <IconButton
                      onPress={e => e.stopPropagation()}
                      variant="ghost"
                      icon={<IconMoreVertical />}
                      label="菜单"
                    />
                  </Popover>
                )
              }
              title={relation ? `检验号${relation.id}含报告` : ""}
            />
          ),
          content: (
            <StackItem>
               { relation && (
                <BoundReports key={relation.id} id={relation.id} />
                )}　
            </StackItem>
          )
        }
      ]}
    />
  );

};





//报错Cannot read property 'map' of null标记出错代码行，竟可能会差错！实际错误点实在下方，报错指示却在上方的代码行，两处都有.map的代码。
//<Stack 组件，实际上是内部状态控制界面的呈现，实际上DOM数据内容并没有同步地变更，只是页面切换着看；适用数据库组织的；PK的，导航堆叠场景实际是源代码组织的。
//幸运的事！！<StackItem>底下内嵌的组件可以做到每一个都是独立自主的。这里<FollowingRecipes key={}/>对每一个按钮进入和后退的，虽然组件同一个，但内部状态数据可各自独立的。
//overflowY:"scroll"若遇到 css={{height: "100%", 和 minHeight: '300px' 不能同时添加的。overflowY:和"100%"一起使用，且要在内层DIV上用。组件中间层可能屏蔽掉。
//多层DIV的height: "100%", 需要在中间层次添加100%传递父辈限制大小，配合内部层的overflowY: "scroll",才能滚动。
//<Stack多层的下沉层叠＋<ListItem，配合<RouterLink，可以触发点击链接同时还能够下沉页面触发；左右两个页面都能刷新，可是小屏幕只能对照右半部分的核心界面。不触发下沉和要触发条目可同时用。
//点击一次触发多重：<RouterLink to={`/inspect/${item.id}`} >    /  <ListItem  onPress={() =>      /   <Button  onPress={e => { ；；
