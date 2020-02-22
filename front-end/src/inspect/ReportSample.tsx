/** @jsx jsx */
import { jsx,  } from "@emotion/core";
import * as React from "react";
//import debug from "debug";
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
  IconArrowLeft, IconArrowRight, Input
} from "customize-easy-ui-component";
import {  useDispatchIspMen,  useReport } from "./db";
//import { useSession } from "../auth";
import {Helmet} from "react-helmet";
import { Link as RouterLink, Link, Route, Switch } from "wouter";
import { ContainLine, TransparentInput } from "../comp/base";
import { IspDetail } from "./IspDetail";
import { CCell, RCell, Table, TableBody, TableRow } from "../comp/TableExt";
import { ReportStarter } from "../report/TemplateLoader";
import { RecordEditorOrPrint } from "../report/TemplateMain";
import { useCommitOriginalData, useQueryOriginalRecord } from "../report/db";

//[HOOK限制]按钮点击函数内部直接上toast()或toaster.notify()很可能无法正常显示。而放在函数组件顶层render代码前却能正常。

//const log = debug("app:Compose");

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

/**
 * THIS IS A DISASTER. HAHAHhahha.. ugh. Rewrite when i'm not lazy
 * @param param0
 */

export const ReportSample: React.FunctionComponent<ComposeProps> = ({
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
    id: repId,
  };
  const {error, loading, items:rep , } = useReport(filtercomp);

  //ingredients 原来是[]数组，改成对象。ingredients.length无定义了。
  const [ingredients, setIngredients] = React.useState<any>( rep||{} );
 // const [, setLocation] = useLocation();
  //这里hoverIngredient是当前高亮选择的某个食材;
//  const [hoverIngredient, setHoverIngredient] = React.useState(null);
//  const hoverIngredientRef = React.useRef(hoverIngredient);
 // const [Options, setOptions] = React.useState({});
 // const {userList:entry, submitfunc, } = useCreateEntry(Options);

  const {result, submit:updateFunc, } = useDispatchIspMen({
    task: repId,
    dev: id, username:ingredients && ingredients.ispMen,
    });
  //const {buildTask:returnD} =data||{};
  //useUpdateEntry({ id: ingredients && ingredients.id, info: {...ingredients, id: undefined,address: "大厦" }, });
  //const { params: { id: idww } } = {...props.params};
  console.log("IspDetail页面刷新 router-ID:", id,",rep=,",rep,";ingredients=", ingredients);


  //不能在这点击触发函数内部执行HOOKs!! 必须上移动外移到 界面组件的头部初始化hooks，随后点击触发调用hook钩子函数。
  async function updateRecipe(
    id: string,
    {
      title,
      plain,
      ingredients,
      description,
      author,
      image
    }: {
      title: string;
      plain: string;
      ingredients: any[];
      description: string;
      author: string;
      image: string;
    }
  ) {
    let yes= result && result.id;
    console.log("生成任务－更新: %s", id, yes);
    //setLoading(true);
    try {
      //这里放HOOK()报错＝Hooks can only be called inside of the body of a function component.
      //考虑封装适配不同类型的接口，不采用这种：
      //const {data: { buildTask: some }} = await updateFunc();
      await updateFunc();
      //等待后端服务器处理完成才能继续运行下面的代码。可长时间等待，挂着页面10分钟都允许。
       setEditing(false);
     // setLoading(false);
    } catch (err) {
      //这里先要setLoading(),还有err.message而非err；否则很可能也能导致？setMessage:toast()显示异常。
     // setLoading(false);
      toast({
        title: "后端请求错",
        subtitle: err.message,
        intent: "danger"
      });
      //很多错误是在这里捕获的。
      console.log("useAddToTask返回 捕获err", err);
    }
    //这里无法获得result值，就算所在组件顶层已经获得result值，这里可能还是await () 前那样null;
     console.log("生成任务返回了＝", result,"yes=", yes);
    toast({
      title: "任务派工返回了",
      subtitle: '加入，ISP ID＝'+id,
      intent: "info"
    });
    //除非用const {data: { buildTask: some }} = await updateFunc()捕捉当前操作结果; 否则这时这地方只能用旧的result,点击函数里获取不到最新结果。
    //须用其它机制，切换界面setXXX(标记),result？():();设置新的URL转场页面, 结果要在点击函数外面/组件顶层获得；组件根据操作结果切换页面/链接。
  }


  React.useEffect(() => {
    setIngredients( rep||{} );
  }, [rep]);

  if(error) return  <h1>没有该报告内容？</h1>

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
            {editing && (
              <Button
                intent="primary"
                disabled={loading}
                css={{ marginLeft: theme.spaces.sm }}
                onPress={() => {
                  //这里serialize是　src/Editor.jsx:120　自定义函数
                  //const { text, content } = current.serialize();
                  const toSave = {
                    title,
                    description: content,
                    plain: '',
                    author: credit,
                    image,
                    ingredients
                  };
                  if(id) updateRecipe(id, toSave);
                }}
               >
                保存编制中的检验报告
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
                      <div key={1}>
                        <MainContent id={id} rep={rep}/>
                      </div>

                  <RouterLink to={`/report/EL-DJ/ver/1/preview/${repId}`}>
                    <Button
                      size="lg" noBind
                      intent="primary"
                      iconAfter={<IconArrowRight />}
                    >
                      查看报告
                    </Button>
                  </RouterLink>
                  {' '}
                  <RouterLink to={`/inspect/${id}/report/${repId}/copy`}>
                    <Button
                      size="lg" noBind
                      intent="primary"
                      iconAfter={<IconArrowRight />}
                    >
                      拷贝原始记录
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
      <Route path="/inspect/:id/report/:repId">
          <FirstPage id={id} rep={rep}/>
      </Route>
      <Route path="/inspect/:id/report/:repId/copy">
          <CopyRecord id={id} rep={rep}/>
      </Route>
    </Switch>
  </React.Fragment>
  );
}

const FirstPage= ( {theme=null, id ,rep}
) => {
  const [ingredients, setIngredients] = React.useState<any>( rep||{} );

  return <React.Fragment>
    <div>
      <Text variant="h5">报告封面首页</Text>
      <ContainLine display={'报告类型'}>
        <TransparentInput
          autoFocus={true}
          readOnly
          placeholder="报告类型"
          value={ rep && rep.type }
          onChange={e => {
            setIngredients( {
              ...ingredients,
            });
          }}
        />
      </ContainLine>
      <ContainLine display={'设备号'}>
        <TransparentInput
          autoFocus={true}
          readOnly
          placeholder="设备号"
          value={ rep && rep.isp.dev.cod }
          onChange={e => {
            setIngredients( {
              ...ingredients,
            });
          }}
        />
      </ContainLine>
      <ContainLine display={'检验结论'}>
        <TransparentInput
          autoFocus={true}
          readOnly
          placeholder="审核人"
          value={rep && rep.isp.conclusion}
          onChange={e => {
            setIngredients( {
              ...ingredients,
              ispMen: e.target.value
            });
          }}
        />
      </ContainLine>
      <ContainLine display={'设备出厂编码'}>
        <Text  placeholder="所有参与检验人"
               css={{
                 display: 'block',
                 width: '100%',
               }}
        >
          {rep && rep.isp.dev.factoryNo}
        </Text>
      </ContainLine>
      <ContainLine display={'报告上传日期'}>
        <TransparentInput
          autoFocus={true}
          readOnly
          placeholder="输入日期格式2019-08-03"
          value={rep && rep.upLoadDate}
        />
      </ContainLine>
      <ContainLine display={'设备安装地址'}>
        <TransparentInput
          readOnly
          value={rep && rep.isp.dev.pos && rep.isp.dev.pos.address}
        />
      </ContainLine>
      <ContainLine display={'设备使用单位'}>
        <TransparentInput
          readOnly
          value={rep &&rep.isp.dev.ownerUnt && rep.isp.dev.ownerUnt.name}
        />
      </ContainLine>
      <ContainLine display={'设备使用单位联系人'}>
        <TransparentInput
          readOnly
          value={rep && rep.isp.dev.ownerUnt && rep.isp.dev.ownerUnt.linkMen}
        />
      </ContainLine>

    </div>
  </React.Fragment>;
};

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
    let yes= result && result.id;
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
      <Text variant="h5">{orc?.检验结论}</Text>
      <Button
        css={{ marginTop: theme.spaces.md }}
        size="lg"  intent={'warning'}
        disabled ={loading}
        loading ={loading}
        onPress={ ()=>updateRecipe('1') }
      >拷贝并保存</Button>
    </div>
  </React.Fragment>;
};


