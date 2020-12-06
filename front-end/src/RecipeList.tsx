
import { jsx } from "@emotion/react";
import * as React from "react";
//import algoliasearch from "algoliasearch";
//import algolia from "./Search";

//import { Link } from "@reach/router";
import { useRoute, useLocation } from "wouter";
import { useSession } from "./auth";
//import * as firebase from "firebase/app";
import orderBy from "lodash.orderby";
import {
  Text,
  List,
  ListItem,
  Spinner,
  Button,
  useTheme,
  Embed,
  Skeleton,
} from "customize-easy-ui-component";
import { useFirebaseImage } from "./Image";
import { FadeImage } from "./FadeImage";
import { usePaginateQueryRecipe } from "./db";
import { SearchBox } from "./SearchBox";
import { useInView } from 'react-intersection-observer'
import { PullToRefresh,PullDownContent,RefreshContent,ReleaseContent } from "react-js-pull-to-refresh";
import { useEffect } from "react";

//import usePaginateQuery from "firestore-pagination-hook";
//const log = debug("app:RecipeList");

export interface Ingredient {
  name: string;
  amount: string;
}

type Action<K, V = void> = V extends void ? { type: K } : { type: K } & V;

export interface Recipe {
  id: string;
  title: string;
  plain: string;
  updatedAt: any;
  userId: string;
  image?: string;
  createdBy?: {
    email: string;
    photoURL: string;
  };
  author: string;
  description: string;
  ingredients: Ingredient[];
}

// ts 的强类型，预编译。
interface ResponseLikeAlgoliasearch<T=any> {
  hits: T[];     //范型　T，缺省的＝ any[];
  page: number;
  facets?: {
    [facetName: string]: { [facetValue: string]: number };
  };
  //key-value的范式；实现 {"key"　:　{"value" } }
  facets_stats?: {
    [facetName: string]: {
      max: number,
      min: number,
    };
  };
  id: string;
  title: string;
  plain: string;
  updatedAt: any;
  userId: string;
  image?: string;
  createdBy?: {
    email: string;
    photoURL: string;
  };
}

export type ActionType =
  | Action<"QUERY", { value: string }>
  | Action<"UNDO", { value: string }>
  | Action<"REDO", { value: string }>
  | Action<"SEARCH", { value: ResponseLikeAlgoliasearch[] }>;

//每个通信方法，都需要设定状态的存储变量/依据数据类型分开的。
interface StateType {
  searchResponse: ResponseLikeAlgoliasearch[] | null;
  query: string;
  past: string[];      //状态转移机，测试
  present: string;    //initialState,
  future: string[];
}

//旧版本的开发的使用模式；"SEARCH"用于搜索菜谱应答信息，  "QUERY"没用处的。
function reducer(state: StateType, action: ActionType) {
  const { past, future, present } = state;
  switch (action.type) {
    case "QUERY":
      return {
        ...state,
        query: action.value
      };    //返回action执行之后的应该给出的新状态。

    case "SEARCH":
      let hihi={
        ...state,
        searchResponse: action.value
      };
      console.log("准示state.searchResponse hihi=",hihi);
      return {
        ...state,
        searchResponse: action.value
      };
    case 'UNDO':        //状态转移机，测试;
      const previous = past[past.length - 1]
      const newPast = past.slice(0, past.length - 1)
      return {
        ...state,              //这个是必须的，不能省略。
        past: newPast,
        present: previous,
        future: [present, ...future],
      }
    case 'REDO':
      const next = future[0]
      const newFuture = future.slice(1)
      return {
        ...state,
        past: [...past, present],  　   //数组解构＋合成；
        present: next,
        future: newFuture,
      }
    default:
      return state
  }
}


export interface RecipeListProps {
  //query?: string;
  //refPanel?: React.RefObject<any>;
  userid?: string;
}

const initialState = {
  searchResponse: null,
  query: "",
  past: ["",],      //状态转移机，测试
  present: "",
  future: ["",],
};

//如果做了云搜索searchResponse就显示云搜索结果菜谱列表，否则就该显示当前用户的菜谱列表。
//搜索全局含其他人的搜到的菜谱，不一定能看，必须关注该用户，经过批准才能看。
export const RecipeList: React.FunctionComponent<RecipeListProps> = ({
      userid
}) => {
  const theme = useTheme();
 // const refPanel = React.useRef();
  const [query, setQuery] = React.useState("");
  //react上一个版本的做法遗留。　这里dispatch和一般地useState钩子setxxx的使用差不多。
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const {user,} = useSession();

  const [hasMore, setHasMore] = React.useState(true);
  //分页，　从数据库读取的部分　当前用户的　菜单列表　，按时间排序。
  const {
    loadingMore,
    loadingMoreError,
  } ={ loadingMoreError:false, loadingMore:false, };


  const condition = React.useMemo( () =>{
    let wheres={a: {s:'createdBy.id',o:'EQ',lv:user.id } , };
    ///Like相似'自带通配符'  单个字符 _ 任意个字符 %
    let wheresQ={a: {s:'title',o:'LK',sv:query } ,
    };
    return query? wheresQ:wheres;
  }, [user.id, query]);

  const [filter, setFilter] = React.useState({where: condition,
    offset:0,
    first:5,
    orderBy: "updatedAt",
    asc: true
  } as any);

  const {
    loading,
    loadingError,
    items,
    loadMore, refetch
  } =usePaginateQueryRecipe(filter);

  //根据id和界面操作后的参数，来要修正graphQL的Query()的参数 = 要做重新查询。
  React.useEffect(() => {
    setFilter({where: condition,
      offset:0,
      first:5,
      orderBy: "updatedAt",
      asc: true
    } as any);
    setHasMore(true);
  }, [query,condition]);
  //云搜索的菜谱显示， perform an algolia query when query changes 看query去不停地搜索
  React.useEffect(() => {
    if (query) {
      //云搜索 搜索区编码＝posts;  //this.client!.initIndex("posts");
     //   algolia.search(query).then(results => {
     //     log("results: %o", results);
        console.log("准备要dispatch答　results="+ JSON.stringify(items) );
        dispatch({
          type: "SEARCH",
          value: items
        });
     //    });
    }
  }, [query, items]);
  //这上面的 deps[，] 必须有items； 才能保证查询useReducer方式目标返回state.searchResponse结果 能够反馈给UI界面层次。
  //实际上，两个操作模式下都走读items给UI显示的话，就没必要麻烦dispatch　再去绕一圈了。
  //console.log("准示state.searchResponse="+ JSON.stringify(query) + JSON.stringify(state.searchResponse));

  async function toRefresh() {
    setHasMore(true);
    refetch( {} );
  }

  const toLoadMore = React.useCallback(
    async () => {
      items && loadMore({
        variables: {
          offset: items.length,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          console.log("fetch来useInfiniteScroll看="+ JSON.stringify(fetchMoreResult)+",itemslength=",items.length);
          if (!fetchMoreResult)   return prev;
          if (!fetchMoreResult.recipe)   return prev;
          if(fetchMoreResult.recipe.length===0)
            setHasMore(false);
          if(prev.recipe.length + fetchMoreResult.recipe.length > 2000 )
            setHasMore(false);
          //console.log("跑到了updateQuery-- hasMore=", hasMore );
          return Object.assign({}, prev, {
            recipe: [...prev.recipe, ...fetchMoreResult.recipe],
          });
        },
      })
    },
    [loadMore ,items]
  );
  /*
  async function toLoadMore() {

  }*/

   //直接用{　callback:  some => toLoadMore(),　} 无法更新items&& items.length，都是初始的。
    const [refMore, acrossMore] = useInView({threshold: 0});

    useEffect( () =>   {
            acrossMore && hasMore && toLoadMore()
            }, [acrossMore,hasMore,    toLoadMore]   );

  //底下style={{  height: `100vh` }} 用于触发滚动条强制开启。 : height: calc(100vh - 164px);
  return (
    <div       css={{
      overflowY: "scroll",
      //height: `calc(100vh - 2 * ${theme.spaces.xs} - 0.875rem - 2 * 10px - 63px)`,     //上一级已经设置高度了。
      [theme.mediaQueries.md]: {
        height: `calc(100vh - 2 * ${theme.spaces.lg} - 0.875rem - 2 * 10px - 71px)`
      },
      [theme.mediaQueries.xl]: {
        height: `calc(100vh - 2 * ${theme.spaces.xl} - 0.875rem - 2 * 10px - 71px)`
      }
    }}>

      <div  css={{  flex: "0 0 auto"  }}  >
        <SearchBox query={query} setQuery={setQuery} />
      </div>

      <PullToRefresh
        pullDownContent={<PullDownContent/>}
        releaseContent={<ReleaseContent label={'立刻刷新内容'}/>}
        refreshContent={<RefreshContent />}
        onRefresh={() => toRefresh() }
        pullDownThreshold={40}
        backgroundColor="white"
        triggerHeight="auto"
      >


      <div
        css={{   /*特意把父div滚动条启动开。`calc(100vh - ${ileapHeight}px)`,   '750px',  注意串里的空格必须要有！
          //关键是靠内容持续增长列表的紧上一级DIV来控制，把这一个div高度撑开，迫使最近的窗口所附属的滚动条启动。
          minHeight: `calc(100vh - 164px)`,
          [theme.mediaQueries.md]: {
            minHeight: `calc(100vh - 164px - ${theme.spaces.lg} - ${theme.spaces.lg})`
          },
          [theme.mediaQueries.xl]: {
            minHeight: `calc(100vh - 164px - ${theme.spaces.xl} - ${theme.spaces.xl})`
          }, */
        }}
    >
      {query && state.searchResponse ? (
        <div>
          <List>
            {state.searchResponse &&
              state.searchResponse.map(hit => (
              <RecipeListItem
                key={hit.id}
                editable={hit.userId === user!.uid}
                recipe={hit as any}
                id={hit.id}
                highlight={null}
              />
            ))}

            {loading && (
              <ListItem
                interactive={false}
                aria-live="polite"
                aria-busy="true"
                primary={<Skeleton animated css={{ width: "150px" }} />}
              />
            )}
          </List>
        </div>
      ) : (
        <div>
          {/*loading && <Spinner css={{ marginTop: theme.spaces.md }} center /> */}
          {!loading && items.length === 0 && (
            <Text
              muted
              css={{
                display: "block",
                fontSize: theme.fontSizes[0],
                margin: theme.spaces.lg
              }}
            >
              自己还没有做菜谱哦. Create your first by clicking the plus
              arrow above.
            </Text>
          )}

          <List>
            {
              //这函数是firebase.firestore才有的？ item.get("updatedAt").toMillis(),　is not a function！
              console.log("准备要orderBy hasMore=", hasMore )
            }
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

            {orderBy(
              items,
              item => item.updatedAt,
              "desc"
            ).map(recipe => (
              <RecipeListItem
                id={recipe.id}
                key={recipe.id}
                editable
                recipe={recipe as Recipe}
              />
            ))}

            {loading && (
              <ListItem
                interactive={false}
                aria-live="polite"
                aria-busy="true"
                primary={<Skeleton animated css={{ width: "150px" }} />}
              />
            )}
          </List>
          {/*分两种情况：１是搜索到的（通过dispatch=.useReducer的模式做），２是个人的＋排序*/}
        </div>
      )}

      {loadingMore && <Spinner />}
      {loadingError || (loadingMoreError && <div>Loading error...</div>)}

        <div
          css={{
            textAlign: "center",
            marginBottom: theme.spaces.md,
            marginTop: theme.spaces.md
          }}
        >
          { hasMore && !loadingMore && (
            <div>
              <Button onPress={ () => toLoadMore() }>
                按，拉扯获取更多......
              </Button>
            </div>
          )}
          {!hasMore && <span>嘿，没有更多了</span> }
        </div>
        <div  ref={refMore}> </div>
     </div>

      </PullToRefresh>

    </div>
  );
};

interface RecipeListItemProps {
  editable?: boolean;
  recipe: Recipe;
  id: string;
  highlight?: any;
}

//缩略图和完整图都是同一个图片的数据内容，　不做差异化处理！
export function RecipeListItem({ recipe, id, highlight }: RecipeListItemProps) {
  const theme = useTheme();
  //缩略图thumb-sm@和完整图片thumb@的url不一样的；后端支持缩略？　没必要做；
  const { src, error } = useFirebaseImage("thumb-sm@", recipe.image);

  const href = `/chaipu/${id}`;
  //被点击中匹配href，成功=true=isActive[? ,..];　表示正好跟界面显示同样的一个路由。
  const [isActive,] = useRoute(href);
  const [, setLocation] = useLocation();
  //下面highlight. 是algoliasearch.Response返回的，必须有预先定义。
  //console.log("进RecipeListItem；href=",href);

  return (
    <ListItem
      wrap={false}
      onClick={e => {
        e.preventDefault();
        setLocation(href);
        //navigate(href , { replace: true });
      }}
      aria-current={isActive}
      href={`/chaipu/${id}`}
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
      contentAfter={
        recipe.image && !error ? (
          <Embed css={{ width: "60px" }} width={75} height={50}>
            <FadeImage src={src} hidden />
          </Embed>
        ) : null
      }
      // secondary={
      //   highlight ? (
      //     <span dangerouslySetInnerHTML={{ __html: highlight.author.value }} />
      //   ) : (
      //     recipe.author
      //   )
      // }
      primary={
        highlight ? (
          <span dangerouslySetInnerHTML={{ __html: highlight.title.value }} />
        ) : (
          recipe.title
        )
      }
    />
  );
}


//外部不安全的数据：<span dangerouslySetInnerHTML={{ __html: highlight.title.value }} />
//页面在console输出报警key/id冲突，可能导致显示异常，重复内容的显示。
//useReducer在复杂的状态管理场景下比useState更好。diapatch 一个action，使用reducer来更新state; https://juejin.im/post/5cbe8423f265da036706a9dd
//使用React Hooks新特性useReducer、useContext替代传统Redux高阶组件;　useReducer接受可选的第三个参数initialAction。　https://www.jianshu.com/p/6c43b440dab8#usecallback
//React: 传统思维下的　let　var　变量，对付状态更新转换的需求，是不可以再使用了。
