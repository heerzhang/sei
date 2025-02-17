/** @jsxImportSource @emotion/react */
//import { jsx } from "@emotion/react";
import * as React from "react";
//谷歌云服务 import usePaginateQuery from "firestore-pagination-hook";
//import firebase from "firebase/app";
import {
  Text,
  Spinner,
  useTheme,
  List,
  Button,
  ListItem,
  Skeleton,
  ScrollView,
  useInfiniteScroll,
  Embed,
  ResponsivePopover,
  MenuList,
  MenuItem,
  IconPackage,
  MenuDivider,
  IconButton, IconMoreVertical, useToast
} from "customize-easy-ui-component";

import { useDeleteReport, useLookReports } from "./db";
import { useFirebaseImage } from "../../Image";
import { Link as RouterLink,useLocation, useRoute } from "wouter";
import { FadeImage } from "../../FadeImage";



interface BoundReportsProps {
  id: string;
}
//某个检验ISP 底下的报告队列。
export const BoundReports: React.FunctionComponent<
  BoundReportsProps
> = ({ id }) => {
  const theme = useTheme();
  console.log("看BoundReports filter =id=", id );


  const [filter, setFilter] = React.useState({ id:id });
  const {loading, error, items, loadMore } =useLookReports(filter);

  console.log("所有挂接的报告 filter=", filter, items);
  //就算id切换了，本组件的数据还是会被appollo自动缓存的，id变化不会一定导致重新查询后端数据库的，看着像页面显示的缓存。
  //根据id和界面操作后的参数，来要修正graphQL的Query()的参数 = 要做重新查询。
  React.useEffect(() => {
    setFilter({ id:id });
  }, [id,]);
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
          //Todo: 嵌入不是一个地方的，高度不同。
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
            {/*所有挂接的报告*/}
            {items && items.map(recipe => (
              <ReportListItem
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
                检验ID　{id}　底下还没有现成的报告可看
              </Button>
            </div>
          )}
       </div>
    </ScrollView>
  );
};

//缩略图和完整图都是同一个图片的数据内容，　不做差异化处理！
function ReportListItem({ recipe, id, highlight ,task }: any) {
  const theme = useTheme();
  const toast = useToast();
  const ispId =task;
  const {  error } = useFirebaseImage("thumb-sm@", recipe.image);
  //Todo: 根据身份识别场景，　区分按钮点击的url，或是隐藏按钮。
  //报告编制人的报告入口链接
  const href = `/inspect/${task}/report/${id}`;
  //Todo: 类型和版本；　report/EL-DJ/ver/1/preview/

  const [isActive,] = useRoute(href);
  const [, setLocation] = useLocation();
  const [repId, setRepId] = React.useState(null);
  const { submit:updateFunc, } = useDeleteReport({
    repId, reason:'测试期直接删'
  });
  //下面highlight. 是algoliasearch.Response返回的，必须有预先定义。
  async function handleDelete(id: string) {
    try {
      await updateFunc();
    } catch (err) {
      toast({
        title: "后端报错",
        subtitle: err.message,
        intent: "danger"
      });
      console.log("handleDelete返回", err);
      return;
    }
    setLocation("/inspect/"+ispId,  { replace: true } );
  }

  return (
    <RouterLink to={href}>
      <ListItem  interactive={false}
                                  wrap={false}

                                  aria-current={isActive}
      // href={`/device/${id}`}
                                  css={{
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
                                    recipe.sssdf && !error ? (
                                      <Embed css={{ width: "60px" }} width={75} height={50}>
                                        <FadeImage src={recipe.path} hidden />
                                      </Embed>
                                    ) : (
                                      recipe.id
                                    )
                                  }
                                  primary={
                                    highlight ? (
                                      <span dangerouslySetInnerHTML={{ __html: highlight.title.value }} />
                                    ) : (
                                      `报告号 ${recipe.no||''}`
                                    )
                                  }
                                  secondary={recipe.type ||''}
                                  contentAfter={
                                    <ResponsivePopover
                                      content={
                                        <MenuList>
                                          <MenuItem contentBefore={<IconPackage />}
                                              onPress={async () => {
                                                await toast({title: "该功能还未做呢，只能提交审核员一个网页链接看看"});
                                                setLocation(`/`);
                                              } }
                                          >
                                 {/*这里实际手机与电脑表现不同，手机是点透而过头了，RouterLink没被触发，反而当前页面按钮被点触发；
                                  无论怎样<Touchable设置noBind点击就一定能点透了；默认却会报unmount错！
                                  手机菜单<ResponsivePopover<MenuItem若需要toast()组合路由跳转to的，不报错无法避免点透,必须await执行*/}
                                              签名并提交审核
                                          </MenuItem>

                                          <MenuDivider />
                                          <MenuItem onPress={ async () => {
                                            await setRepId(recipe.id);
                                            handleDelete(recipe.id)
                                          }
                                          }>删除该报告
                                          </MenuItem>
                                        </MenuList>
                                      }
                                    >
                             {/*这里实际手机与电脑表现不同，实际有IconButton->onPress()的,加noBind无法触发菜单*/}
                                      <IconButton
                                        css={{
                                          //display: !editing && editable ? undefined : "none",
                                          //marginLeft: theme.spaces.sm
                                        }}
                                        variant="ghost" size={'md'}
                                        icon={<IconMoreVertical />}
                                        label="菜单"
                                      />
                                    </ResponsivePopover>
                                  }
    >
      { `日期 ${recipe.upLoadDate||''}` }
    </ListItem>
    </RouterLink>
  );
}




//引入useInfiniteScroll使用的四个要素：有滚动条的组件innerRef，hasMore，onFetch()，fetching；
//<ScrollView >要么height:"100%"要么删除height参数让内容去撑开，不能使用height:"70%"之类的数，内部2次DIV嵌套,导致0.7*0.7=实际上内部高度。
//较上层DIV若是style={{ height: "xxx%" }}，注意若父辈元素都没限定最小的高度，那么就会导致由底下的内容撑开了，这等价于没height参数=实际无效！；"100%"若父辈有px数就听父辈的。
//<ListItem>组件，其中primary要用在填充较长的内容，contentAfter是相对简短的内容显示，不要颠倒；primary会截短，而contentAfter不会缩短。
