/** @jsxImportSource @emotion/react */
//import { jsx } from "@emotion/react";
import * as React from "react";
import {
  Text,
  Spinner,
  useTheme,
  List,
  Button,
  ListItem,
  Skeleton, ScrollView, useInfiniteScroll, Embed, Avatar
} from "customize-easy-ui-component";

import {  useQueryBoundDevices } from "./db";
import { useFirebaseImage } from "../../Image";
import { useLocation, useRoute } from "wouter";
import { FadeImage } from "../../FadeImage";



interface BoundDevicesProps {
  id: string;   //任务ID
}
//显示某一个关注对象用户菜谱列表
//有1个地方会引用到的。
export const BoundDevices: React.FunctionComponent<
  BoundDevicesProps
> = ({ id }) => {
  const theme = useTheme();
  //console.log("看FollowingRecipes filter =id=", id );
  let wheres={　id  };

  const [filter, setFilter] = React.useState({filter:wheres,
    offset:0,
    limit:5,
    orderBy: "date",
    asc: true
  });
  //根据任务ｉｄ找设备，返回items＝下挂设备列表
  const {
    loading,
    error,
    items,
    loadMore
  } =useQueryBoundDevices(filter);

  //console.log("看FollowingRecipes filter=", filter );
  //就算id切换了，本组件的数据还是会被appollo自动缓存的，id变化不会一定导致重新查询后端数据库的，看着像页面显示的缓存。
  //根据id和界面操作后的参数，来要修正graphQL的Query()的参数 = 要做重新查询。
  React.useEffect(() => {
    let wheres={　id  };
    setFilter({filter:wheres,
      offset:0,
      limit:5,
      orderBy: "date",
      asc: true
    });
  }, [id]);
  //滚动条触发的更多查询。初始查询的记录满员必须大于让滚动条开启{满屏了}的数量，否则无法触发后续更多查询。
  const ref = React.useRef();
  const [hasMore, setHasMore] = React.useState(true);

  const [fetching] = useInfiniteScroll({
    container: ref,
    hasMore: hasMore,
    onFetch: () => toLoadMore()
   });

  async function toLoadMore() {
    loadMore({
      variables: {
        offset: items.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        console.log("fetchMoreResult来看="+ JSON.stringify(fetchMoreResult)+",原来="+ JSON.stringify(prev) );
        if (!fetchMoreResult)   return prev;
        if (!fetchMoreResult.recipe)   return prev;
        if(fetchMoreResult.recipe.length===0)
          setHasMore(false);
        if(prev.recipe.length + fetchMoreResult.recipe.length > 2000 )
          setHasMore(false);
        return Object.assign({}, prev, {
          recipe: [...prev.recipe, ...fetchMoreResult.recipe],
        });
      },
    })
  }


  return (
    <ScrollView　overflowY
                   css={{
                     flex: 1,
                     height: "100%",
                    //WebkitOverflowScrolling: "touch"
                   }}
                  innerRef={ref}>
        <div
          css={{   //特意把父div滚动条启动开。`calc(100vh - ${ileapHeight}px)`,   '750px',  注意串里的空格必须要有！
            //关键是靠内容持续增长列表的紧上一级DIV来控制，把这一个div高度撑开，迫使最近的窗口所附属的滚动条启动。
            minHeight: `calc(100vh - 164px)`,
            [theme.mediaQueries.md]: {
              minHeight: `calc(100vh - 164px - ${theme.spaces.lg} - ${theme.spaces.lg})`
            },
            [theme.mediaQueries.xl]: {
              minHeight: `calc(100vh - 164px - ${theme.spaces.xl} - ${theme.spaces.xl})`
            },
          }}
        >
          {/*loading && <Spinner center />*/}
          {!loading && !items && (
            <Text
              muted
              css={{
                display: "block",
                fontSize: theme.fontSizes[0],
                margin: theme.spaces.lg
              }}
            >
              This user currently 没有东西.
            </Text>
          )}

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

            {items && items.map(recipe => (
              <DeviceListItem
                id={recipe.id}
                key={recipe.id}
                editable
                recipe={recipe as any}
                task={id}
              />
            ))}

            {fetching && (
              <ListItem
                interactive={false}
                aria-live="polite"
                aria-busy="true"
                primary={<Skeleton animated css={{ width: "150px" }} />}
              />
            )}
          </List>

          {loading && <Spinner />}
          {/*loadingError || (loadingMoreError && <div>Loading error...</div>)*/}
          {error  && <div>Loading error...</div> }
          {(!items || items.length===0) && (
            <div css={{ textAlign: "center" }}>
              <Button  onPress={ () => toLoadMore() } >
                哎呀还没有已经关联设备可看
              </Button>
            </div>
          )}
       </div>
    </ScrollView>
  );
};

//某个任务　下挂　单个设备的　recipe＝device{}
function DeviceListItem({ recipe, id, highlight ,task }: any) {
  const theme = useTheme();
  //缩略图thumb-sm@和完整图片thumb@的url不一样的；后端支持缩略？　没必要做；
  const { src, error } = useFirebaseImage("thumb-sm@", recipe.image);

  const href = `/device/${id}/task/${task}`;
  //被点击中匹配href，成功=true=isActive[? ,..];　表示正好跟界面显示同样的一个路由。
  const [isActive,] = useRoute(href);
  const [, setLocation] = useLocation();
//
  //   href={`/device/${id}`}
  //        //navigate(href , { replace: true });

  return (
    <ListItem
      wrap={false}
      onPress={e => {
        //e.preventDefault();
        setLocation(href, { replace: false });
      }}
      aria-current={isActive}
      css={{
        paddingTop: 0,
        paddingBottom: 0,
        height: "56px",
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        "& em": {
          fontStyle: "normal",
          color: theme.colors.text.selected
        },
        backgroundColor: isActive ? theme.colors.background.tint1 : null,
        "& > *": {
          flex: 1,
          overflow: "hidden"
        }
      }}
      contentBefore={
        <React.Fragment>
          <Avatar size="xs" name={'曳'}/>
          <Avatar size="xs" name={'有'}/>
        </React.Fragment>
      }
      contentAfter={
        recipe.image && !error ? (
          <Embed css={{ width: "60px" }} width={75} height={50}>
            <FadeImage src={src} hidden />
          </Embed>
        ) : (
          recipe.oid
        )
      }
      primary={
        highlight ? (
          <span dangerouslySetInnerHTML={{ __html: highlight.title.value }} />
        ) : (
          recipe.cod
        )
      }
    />
  );
}



/**上面的loadMore的updateQuery的函数原型定义这样的：...node_modules/apollo-client/core/ObservableQuery.d.ts:25；
 * =更新整个Query查询结果。
  export interface FetchMoreOptions<TData = any, TVariables = OperationVariables> {
    updateQuery: (previousQueryResult: TData, options: {
        fetchMoreResult?: TData;    //这个是=后端服务器新增加数据。
        variables?: TVariables;
    }) => TData;
}
 **/


//引入useInfiniteScroll使用的四个要素：有滚动条的组件innerRef，hasMore，onFetch()，fetching；
//<ScrollView >要么height:"100%"要么删除height参数让内容去撑开，不能使用height:"70%"之类的数，内部2次DIV嵌套,导致0.7*0.7=实际上内部高度。
//较上层DIV若是style={{ height: "xxx%" }}，注意若父辈元素都没限定最小的高度，那么就会导致由底下的内容撑开了，这等价于没height参数=实际无效！；"100%"若父辈有px数就听父辈的。

