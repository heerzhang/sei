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

import {Helmet} from "react-helmet";
import { Link as RouterLink, Link, Route, Switch } from "wouter";
import { ContainLine, TransparentInput } from "../comp/base";
import { useDeviceDetail } from "./db";


interface DetailedGuideProps {
  params?:any;  　//来自上级<Route path={} />路由器给的:id。
}
//右半边页面
export const DetailedGuide: React.FunctionComponent<DetailedGuideProps> = ({
    params: { id, },
}) => {
  const theme = useTheme();
  let filtercomp={
    id: id,
  };
  const { loading ,data: dtvalue, error } = useDeviceDetail(id);

  return (
    <div
      css={{
        [theme.mediaQueries.md]: {
          height: "auto",
          display: "block",
        }
      }}
    >
      <Helmet title={id ? '有结果了' : "新增任务"} />
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
            to="/device"
            label="后退"
            replace
            variant="ghost"
            css={{
              marginRight: theme.spaces.sm,
              [theme.mediaQueries.md]: {
                display: "none"
              }
            }}
          />
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
              报告ID号：{id}, 检验号{id}
           </Text>
          <div
            css={{
            display: 'inline-flex',
          }}
          >
            <ResponsivePopover
              content={
                <MenuList>
                  <MenuItem onPress={() => null }>删除</MenuItem>
                </MenuList>
              }
            >
              <IconButton
                css={{ marginLeft: theme.spaces.sm}}
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
          [theme.mediaQueries.md]: {
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
                <div
                  css={{
                  width:'100%',
                }}
                >
                  {/*三级路由了： 嵌套再嵌套了一层 布局级别的组件*/}
                  <ThirdRouterContent id={id} device={dtvalue}/>

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
            </div>
          </Container>
        </div>
      </div>
      <LayerLoading loading={loading} />
    </div>
  );
};


interface ThirdRouterProps {
  id?: string;
  device: any;
}
//为了能立刻刷新操作反馈页面，引入三级路由，把数据获取放在了公共上级组件去，某页面操作的同时能更新查询另外页面显示立即反馈到。
function ThirdRouterContent({id, device}: ThirdRouterProps) {
  return (
   <React.Fragment>
    <Switch>
      <Route path="/inspect/:id/addReport/choose">
          <FirstPage id={id} rep={device}/>
      </Route>

      <Route path="/inspect/:id/addReport/:repId/result">
          <CopyRecord id={id} rep={device}/>
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
        <Select inputSize="md" css={{minWidth:'210px',fontSize:'1.2rem',padding:'0 0.5rem'}} divStyle={css`max-width:390px;`}
                value={ingredients.modeltype||''}  onChange={e => setIngredients({...ingredients, modeltype:e.currentTarget.value}) }
        >
          <option value={'EL-DJ'}>有机房曳引驱动电梯定期检验</option>
          <option value={'EL-JJ'}>EL-JJ</option>
        </Select>
      </ContainLine>
      <ContainLine display={'模板对应版本号'}>
        <Select inputSize="md" css={{minWidth:'190px',fontSize:'1.2rem',padding:'0 0.5rem'}} divStyle={css`max-width:340px;`}
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
      <Text variant="h5">生成返回结果：报告ID {result.id}; 报告编号 {result.no}; 日期：{result.upLoadDate}</Text>
      }
    </div>
    <Text>这里生成返回报告编号还无法和旧平台对接，待完善；报告编号给对外对接识别用的，内部使用报告ID</Text><br/>
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


