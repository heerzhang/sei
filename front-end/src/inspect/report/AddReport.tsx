/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import * as React from "react";
import {
  Navbar,
  Toolbar,
  Text,
  Button,
  IconButton,
  MenuList,
  MenuItem,
  useTheme,
  useToast,
  LayerLoading,
  Container,
  ResponsivePopover,
  IconMoreVertical,
  IconArrowLeft, IconArrowRight, Select
} from "customize-easy-ui-component";
import {  useDispatchIspMen,  useReport } from "../db";
import {Helmet} from "react-helmet";
import { Link as RouterLink, Link, Route, Switch } from "wouter";
import { ContainLine, TransparentInput } from "../../comp/base";
import { useCommitOriginalData, useQueryOriginalRecord } from "../../report/db";
import { useNewReport } from "./db";

export interface ComposeProps {
  //id?: string;
  defaultTitle?: string;
  defaultImage?: string;
  defaultDescription?: string;
  defaultIngredients?: any[];
  readOnly?: boolean;
  editable?: boolean;
  defaultCredit?: string;
  dt?:any;
  params?:any;   //上级路由器传入的参数。
}

export const AddReport: React.FunctionComponent<ComposeProps> = ({
  readOnly,
  editable,
  defaultCredit = "",
  defaultDescription,
  defaultImage,
  defaultIngredients,
  defaultTitle = "",
  dt=null,
  params: { id, repId},      //来自上级<Route path={"/device/:id/addTask"} />路由器给的:id。
}) => {
  const theme = useTheme();
  const toast = useToast();
  const ispId =id;
  //const ref = React.useRef(null);
  //const {user,} = useSession();
  //const [loading, setLoading] = React.useState(false);
  const [editing, setEditing] = React.useState(!readOnly);
  const [content, ] = React.useState(() => {
    return defaultDescription
      ? ''
      : null;
  });
  const [image, ] = React.useState(defaultImage);
  const [title, setTitle] = React.useState(defaultTitle);
  //弹框钩子 toast({  }) 必须放在组件顶层，不能放在一般函数(异步/回调/触发函数)里面？。
  //没办法，必须要添加setMessage配合toast({ });可以多次setMessage()=异步地。
  //const [message, setMessage] = React.useState(null);
  //特别注意！！
  //父辈们的组件id!缺少key导致：遇到小屏幕轮转显示正常，大屏整个显示模式却必须手动刷新才能切换内容。
  //父组件缺key引起异常：这个组件不会重新render的，defaultTitle变更了，但是title却是没有跟随变化，没有更新本组件？。
  //console.log("来React.useState="+ JSON.stringify(title) +",id="+id+";title="+title+";defaultTitle="+JSON.stringify(defaultTitle));
  const [credit, ] = React.useState(defaultCredit);

  let filtercomp={
    id: 2,
  };
  const {error, loading, items:rep , } = useReport(filtercomp);

  //ingredients 原来是[]数组，改成对象。ingredients.length无定义了。
  const [ingredients, setIngredients] = React.useState<any>( rep||{} );
 // const [, setLocation] = useLocation();
  //这里hoverIngredient是当前高亮选择的某个食材;
//  const [hoverIngredient, setHoverIngredient] = React.useState(null);
//  const hoverIngredientRef = React.useRef(hoverIngredient);
 // const [Options, setOptions] = React.useState({});
 // const {userList:entry, submitfunc, } = useCreateDevice(Options);

  const {result, submit:updateFunc, } = useDispatchIspMen({
    task: repId,
    dev: id, username:ingredients && ingredients.ispMen,
    });
  //const {buildTask:returnD} =data||{};
  //useUpdateEntry({ id: ingredients && ingredients.id, info: {...ingredients, id: undefined,address: "大厦" }, });
  //const { params: { id: idww } } = {...props.params};
  console.log("AddReport来呢", id,",repId=",repId,";ingredients=", ingredients);


  //不能在这点击触发函数内部执行HOOKs!! 必须上移动外移到 界面组件的头部初始化hooks，随后点击触发调用hook钩子函数。
  async function updateRecipe(id: string)
  {
    try {
      await updateFunc();
    } catch (err) {
      toast({
        title: "后端请求错",
        subtitle: err.message,
        intent: "danger"
      });
    }
    toast({
      title: "任务派工返回了",
      subtitle: '加入，ISP ID＝'+id,
      intent: "info"
    });
  }


  React.useEffect(() => {
    setIngredients( rep||{} );
  }, [rep]);

  //if(error) return  <h1>没有该容？</h1>

  return (
    <div
      css={{
        [theme.mediaQueries.md]: {
          height: "auto",
          display: "block",
        }
      }}
    >
      <Helmet title={result ? '有结果了' : "新增任务"} />
      <Navbar
        css={{
          zIndex: theme.zIndices.sticky,
          backgroundColor: "white",
          boxShadow: theme.shadows.sm,
          position: "sticky",
          top: 0,
          [theme.mediaQueries.md]: {
            position: "static"
          }
        }}
      >
        <Toolbar
          css={{
            alignItems: "center",
            display: "flex"
          }}
        >
          <IconButton
            icon={<IconArrowLeft />}
            component={Link}
            to="/inspect"
            label="后退"
            replace
            variant="ghost"
            css={{
              marginRight: theme.spaces.sm,
              [theme.mediaQueries.md]: {
                display: "none"     //大屏不需要
              }
            }}
          />
          {!editing ? (
            <div css={{ marginLeft: "-0.75rem", flex: 1 }}>
              <TransparentInput
                autoComplete="off"
                autoFocus
                inputSize="lg"
                value={title}
                placeholder="报告的详细可打印信息"
                aria-label="Recipe title"
                onChange={e => {
                  setTitle(e.target.value);
                }}
              />
            </div>
          ) : (
            <Text
              css={{
                flex: 1,
                textAlign: "center",
                [theme.mediaQueries.md]: {
                  textAlign: "left"
                }
              }}
              wrap={false}
              variant="h5"
              gutter={false}
            >
              报告编号：{repId}, 检验号{id}
            </Text>
          )}
          <div
            css={{
            display: 'inline-flex',
          }}
          >
            <ResponsivePopover
              content={
                <MenuList>
                  <MenuItem
                    onPress={() => {
                      setEditing(true);
                    }}
                  >
                    编辑
                  </MenuItem>
                  <MenuItem onPress={() => null }>删除</MenuItem>
                </MenuList>
              }
            >
              <IconButton
                css={{
                  display: !editing && editable ? undefined : "none",
                  marginLeft: theme.spaces.sm
                }}
                variant="ghost"
                icon={<IconMoreVertical />}
                label="显示菜单"
              />
            </ResponsivePopover>

            {editing && id && (
              <Button
                variant="ghost"
                css={{  //小屏这个按钮没有存在价值，顶条左角的后退就可以。
                  //display: "none",
                  [theme.mediaQueries.md]: {
                    display: "inline-flex"
                  },
                  marginLeft: theme.spaces.sm
                }}
                onPress={() => setEditing(false)}
              >
                取消
              </Button>
            )}
          </div>
        </Toolbar>
      </Navbar>

      <div
        css={{  //控制小屏时的导航条底下的整个页面滚动。
          flex: 1,
          //minHeight: '100vh',
          [theme.mediaQueries.md]: {
            //flex: "none",
            //minHeight: "unset",
           // minHeight:'unset',
            height: "auto",
            display: "block",
          }
        }}
      >
        <div>

          <Container>
            <div
              css={{
                display: 'flex',
                alignItems:'center',
                justifyContent:'center',
                minHeight: '85vh',
                [theme.mediaQueries.md]: {
                  paddingTop: theme.spaces.lg,
                  paddingBottom: theme.spaces.lg,
                  minHeight:'unset',
                }
              }}
            >
              {ingredients && (
                <div
                  css={{
                  width:'100%',
                }}
                >
                  {/*三级路由了： 嵌套再嵌套了一层 布局级别的组件*/}
                  <div key={1}>
                    <MainContent id={id} rep={rep}/>
                  </div>

                  <RouterLink to={`/inspect/${id}`}>
                    <Button
                      size="lg" noBind
                      intent="primary"
                      iconAfter={<IconArrowRight />}
                    >
                      其他功能
                    </Button>
                  </RouterLink>
                </div>
              )}


            </div>
          </Container>
        </div>
      </div>
      <LayerLoading loading={loading} />
    </div>
  );
};


interface MainContentProps {
  id?: string;
  rep: any;
}

function MainContent({ id, rep}: MainContentProps) {
  if (!id) {
    return null;
  }
  return <ThirdRoterContent id={id} rep={rep}/>;
}


interface ThirdRoterProps {
  id?: string;
  dt?: any;
  rep: any;
}
function ThirdRoterContent({id, dt, rep}: ThirdRoterProps) {
  return (
   <React.Fragment>
    <Switch>
      <Route path="/inspect/:id/addReport/choose">
          <FirstPage id={id} rep={rep}/>
      </Route>

      {/*实际没用*/}
      <Route path="/inspect/:id/addReport/:repId/result">
          <CopyRecord id={id} rep={rep}/>
      </Route>
    </Switch>
  </React.Fragment>
  );
}

const FirstPage= ( {id ,rep}
) => {
  const theme = useTheme();
  const toast = useToast();
  //模板的类型标识;
  //Todo: 获取后端的列表？ 或者，前后端同步数据维护。
  const [tplType, setTplType] = React.useState('EL-DJ');
  const [ingredients, setIngredients] = React.useState<any>( {modeltype:'EL-DJ', modelversion:'1'} );
  const {result, submit:updateFunc, loading} = useNewReport({
    isp: id, type:ingredients.modeltype , version:ingredients.modelversion
  });
  async function updateRecipe(id: string) {
    try {
      console.log("页面handleDelete Id="+id);
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
  //  setLocation("/device/"+eqpId,  true );
  }
  return <React.Fragment>
    <div>
      <Text variant="h5">为该份报告做选择</Text>
      <ContainLine display={'模板对应报告类型'}>
        <Select inputSize="md" css={{minWidth:'190px',fontSize:'1.4rem',padding:'0 0.5rem'}} divStyle={css`max-width:340px;`}
                value={ingredients.modeltype||''}  onChange={e => setIngredients({...ingredients, modeltype:e.currentTarget.value}) }
        >
          <option value={'EL-DJ'}>有机房曳引驱动电梯定期检验</option>
          <option value={'EL-JJ'}>EL-JJ</option>
        </Select>
      </ContainLine>
      <ContainLine display={'模板对应版本号'}>
        <Select inputSize="md" css={{minWidth:'190px',fontSize:'1.4rem',padding:'0 0.5rem'}} divStyle={css`max-width:340px;`}
                value={ingredients.modelversion||''}  onChange={e => setIngredients({...ingredients, modelversion:e.currentTarget.value}) }
        >
          <option value={'1'}>1版</option>
          <option value={'2'}>2版</option>
        </Select>
      </ContainLine>
      <Button
        css={{ marginTop: theme.spaces.md }}
        size="lg"  intent={'warning'}
        disabled ={loading}
        loading ={loading}
        onPress={ ()=>updateRecipe('1') }
      >发给后端服务器生成新报告
      </Button>
      { result &&
      <Text variant="h5">生成返回结果：报告ID {result.id}; 报告编号 {result.no} 日期 {result.upLoadDate}</Text>
      }
    </div>
      <RouterLink to={`/report/EL-DJ/ver/1/preview/${result?.id}`}>
        <Button
          size="lg" noBind
          intent="primary"
          iconAfter={<IconArrowRight />}
        >
         进入报告编制
        </Button>
      </RouterLink>
  </React.Fragment>;
};

//作废了
const CopyRecord= ( { id ,rep}
) => {
  const theme = useTheme();
  const [copyID, setCopyID] = React.useState( '' );
  const [orc, setOrc] = React.useState( null );
  const toast = useToast();
  let filtercomp={ id: copyID };
  const {items, } =useQueryOriginalRecord(filtercomp);
  React.useEffect(() => {
    const  dat =items&&items.data&&JSON.parse(items.data);
    dat && setOrc(dat);
  }, [items, setOrc]);
  //拷贝
  const {result, submit:updateFunc,loading } = useCommitOriginalData({
    id:rep?.id,  operationType:1,
    data:  JSON.stringify(orc) ,
    deduction:{emergencyElectric:'45,423'}
  });
  async function updateRecipe(
    id: string ) {
    //let yes= result && result.id;
    try {
      await updateFunc();
    } catch (err) {
      toast({
        title: "后端请求错",
        subtitle: err.message,
        intent: "danger"
      });
      console.log("updateRecipe返回了,捕获err", err);
      return;
    }
    toast({
      title: "任务派工返回了",
      subtitle: '加入，ISP ID＝'+id,
      intent: "info"
    });
  }
  return <React.Fragment>
    <div>
      <Text variant="h5">想从那一份报告去拷贝原始记录？</Text>
      <ContainLine display={'请输入对方的报告ID'}>
        <TransparentInput
          autoFocus={true}
          placeholder="报告ID"
          value={ copyID }
          onChange={e => setCopyID( e.currentTarget.value) }
        />
      </ContainLine>
      <Text variant="h5">该份报告简要：{orc?.检验结论}</Text>
      <Button
        css={{ marginTop: theme.spaces.md }}
        size="lg"  intent={'warning'}
        disabled ={loading}
        loading ={loading}
        onPress={ ()=>updateRecipe('1') }
      >拷贝并保存</Button>
      { result &&
        <Text variant="h5">拷贝结果：报告ID {result.id}; 模板类型 {result.modeltype}</Text>
      }
    </div>
  </React.Fragment>;
};


