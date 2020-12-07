/** @jsxImportSource @emotion/react */
import { jsx,  } from "@emotion/react";
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
  IconArrowLeft, IconArrowRight,
} from "customize-easy-ui-component";
import {  useDispatchIspMen,  useReport } from "./db";
//import { useSession } from "../auth";
import {Helmet} from "react-helmet";
import { Link as RouterLink, Link, Route, Switch } from "wouter";
import { ContainLine, TransparentInput } from "../comp/base";
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
  const [editing, setEditing] = React.useState(!readOnly);
  const [content, ] = React.useState(() => {
    return defaultDescription
      ? ''
      : null;
  });
  const [image, ] = React.useState(defaultImage);
  const [title, setTitle] = React.useState(defaultTitle);
  const [credit, ] = React.useState(defaultCredit);

  let filtercomp={
    id: repId,
  };
  const {error, loading, items:rep, } = useReport(filtercomp);
  const [ingredients, setIngredients] = React.useState<any>( rep||{} );

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
      <Helmet title={ "新增报告"} />
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
              报告ID号：{repId}
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
                   功能待续
                  </MenuItem>
                </MenuList>
              }
            >
              <IconButton
                css={{
                  marginLeft: theme.spaces.sm
                }}
                variant="ghost"
                icon={<IconMoreVertical />}
                label="菜单"
              />
            </ResponsivePopover>
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
                  <ThirdRouterContent id={id} rep={rep}/>

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

interface ThirdRouterProps {
  id: string;
  rep: any;
}
function ThirdRouterContent({id, rep}: ThirdRouterProps) {
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
      <Text variant="h5">该份报告的概要信息</Text>
      <ContainLine display={'报告号{对外的}'}>
        <TransparentInput  readOnly value={rep?.no}/>
      </ContainLine>
      <ContainLine display={'设备号'}>
        <TransparentInput readOnly value={rep?.isp.dev.cod}/>
      </ContainLine>
      <ContainLine display={'检验号'}>
        <TransparentInput
          readOnly
          value={rep?.isp?.id}
        />
      </ContainLine>
      <ContainLine display={'任务号'}>
        <TransparentInput
          readOnly
          value={rep?.isp?.task?.id}
        />
      </ContainLine>
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
      <ContainLine display={'检验结论'}>
        <TransparentInput
          autoFocus={true}
          readOnly
          value={rep && rep.isp.conclusion}
          onChange={e => {
            setIngredients( {
              ...ingredients,
              ispMen: e.target.value
            });
          }}
        />
      </ContainLine>
      <ContainLine display={'设备监察识别码'}>
        <Text css={{
                 display: 'block',
                 width: '100%',
               }}
        >
         {rep?.isp.dev.oid}
        </Text>
      </ContainLine>
      <ContainLine display={'报告上传日期'}>
        <TransparentInput
          autoFocus={true}
          readOnly
          placeholder="输入日期格式2019-08-03"
          value={rep?.upLoadDate || ''}
        />
      </ContainLine>
      <ContainLine display={'设备安装地址'}>
        <TransparentInput
          readOnly
          value={rep && rep.isp.dev.pos && rep.isp.dev.pos.address}
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
      title: "任务返回了",
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


