/** @jsxImportSource @emotion/react */
//import { jsx, Global } from "@emotion/react";
import * as React from "react";
//import Editor, { tryValue } from "./Editor";
//import { ImageUpload } from "./ImageUpload";
//import { Image } from "./Image";
//import { Value } from "slate";
//import debug from "debug";
//import initialValue from "./value.json";
//import { Ingredient } from "./RecipeList";
import {
  Input,
  Text,
  Button,
  useTheme,
  InputBaseProps,
  useToast,
  LayerLoading,
  Container,
  Select,
  ListItem,
  Avatar,
  ResponsivePopover,
  MenuList,
  MenuItem,
  IconPackage,
  IconButton,
  IconMoreVertical,
  List, InputGroupLine, SuffixInput
} from "customize-easy-ui-component";
import { useCreateDevice, useUpdateDevice } from "./db";
import {Helmet} from "react-helmet";
import { Link as RouterLink, useLocation } from "wouter";
import { css } from "@emotion/react";
//import { Link as RouterLink } from "wouter";
import {设备种类,设备类别,设备品种} from "./../dict/eqpComm"
import { InspectRecordLayout, SelectHookfork } from "../report/comp/base";
import { 电梯 } from "./edit/电梯";
import { useThrottle } from "../hooks/useHelpers";

//const log = debug("app:Compose");



interface ComposeDeviceProps {
  id?: string;
  readOnly?: boolean;
  dt?:any;
}

export const ComposeDevice: React.FunctionComponent<ComposeDeviceProps> = ({
  readOnly,
  id,
  dt=null,
}) => {
  const theme = useTheme();
  const toast = useToast();
 // const {user,} = useSession();
  //const [loading, setLoading] = React.useState(false);
  const [editing, ] = React.useState(!readOnly|| true);
  /* const [content, ] = React.useState(() => {
        return defaultDescription
          ? ''
          : null;
      });　 */

  //这里ingredients挂载初始化后只能setIngredients改了，useState()后面参数变动就不再起作用了。
  const [ingredients, setIngredients] = React.useState<any>( dt||{} );

  const [, setLocation] = useLocation();
 // const [eqpType, setEqpType] = React.useState(undefined);
  //可编辑的设备数据表 要创建新设备=null,首先生成ID,随后刷新路由再进来 eqp有基本数据了。
  const [eqp, setEqp] = React.useState(dt);    //为了更改数据用的。


  //const [, setOptions] = React.useState({});
  const {result:entry, submit:submitfunc, error} = useCreateDevice(eqp?.type,{oid:"暂且空着",  ...ingredients, ...eqp});
  /*
  const {result, submitfunc:updateFunc, } = useUpdateEntry({
    id: ingredients && ingredients.id,
    unt: 1,
    info: {...ingredients, id: undefined,isps:undefined,pos:undefined,ownerUnt:undefined,__typename:undefined
          ,address: "贵大厦" },
    });
  */
  const {result:saveres, submit:dosaveEqpfunc, error:saveerr,loading,called} = useUpdateDevice({ id, unt:4644,
    in:{...ingredients, ...eqp, __typename:undefined} });

  const {doFunc:throttledSaveEqp, ready} = useThrottle(dosaveEqpfunc,9000);
  //保存到后端服务器render次数较多的, 参考:\优化.txt
  //console.log("刚ComposeDevice经过EQPis",dt,"进行中id=",id,"eqp=",eqp,"loading",loading,"saveres",saveres,"called",called);
  //不能在这点击触发函数内部执行HOOKs!! 必须上移动外移到 界面组件的头部初始化hooks，随后点击触发调用hook钩子函数。
  async function saveRecipe( a
  ) {
    try {
      //setLoading(true);
      console.log("baochun等待之前１ ingredients=", ingredients );
      //这时才去修改submitfunc参数，已经来不及，setOptions异步执行；submitfunc会看见前面的取值。
      //setOptions({oid:"test暂且空着",  ...ingredients});
      console.log("baochun等待之前２ ingredients=", ingredients );
      await submitfunc();   //要等待正常的结果应答从后端返回。
      //submitfunc(); 立刻执行后面代码，这样不会等待后端应答的。
      /*点击函数发送给后端服务器，即刻返回到这里了await submitfunc();　这个时候entry还不是后端的应答数据，要等到下一次entry被ＨＯＯＫ修正*/
      console.log("等半天createEntry返回error=",error,"结果",entry );

      //加了await 后的　submitfunc();似乎也不能确保entry非空的，必须等待下一次render()。
      entry && setLocation("/device/" + entry.id, { replace: true } );
      //原型是 PushCallback = (to: Path, replace?: boolean) => void;
    } catch (err) {
      //setLoading(false);
      toast({
        title: "捕获errcc错",
        subtitle: err.message,
        intent: "danger"
      });
      console.log("捕获err打了吗", err);
    }
  }

  async function updateDevice( a
  ) {
    try {
      //setLoading(true);
      console.log("baochunupdateDevice 等待之前１ a=", a );
      //这时才去修改submitfunc参数，已经来不及，setOptions异步执行；submitfunc会看见前面的取值。
      //setOptions({oid:"test暂且空着",  ...ingredients});
      console.log("baochun等待之前２ ingredients=", ingredients );
      await throttledSaveEqp();   //要等待正常的结果应答从后端返回。
      //submitfunc(); 立刻执行后面代码，这样不会等待后端应答的。
      /*点击函数发送给后端服务器，即刻返回到这里了await submitfunc();　这个时候entry还不是后端的应答数据，要等到下一次entry被ＨＯＯＫ修正*/
      console.log("等半天createEntry返回error=",error,"结果",saveres );
      //setLoading(false);
      //加了await 后的　submitfunc();似乎也不能确保entry非空的，必须等待下一次render()。
    //  entry && setLocation("/device/" + saveres.id, { replace: true } );
      //原型是 PushCallback = (to: Path, replace?: boolean) => void;
    } catch (err) {
      //setLoading(false);
      toast({
        title: "捕获errcc错",
        subtitle: err.message,
        intent: "danger"
      });
      console.log("捕获err打了吗", err);
    }
  }

  //保存 编辑新的菜谱之后，要修正URL
  React.useEffect(() => {
    entry && ( setLocation("/device/" + entry.id) );
  }, [entry,setLocation]);


  return (
    <div
      css={{
        [theme.mediaQueries.md]: {
          height: "auto",
          display: "block"
        }
      }}
    >
      <Helmet title={"设备数据维护"} />

      <div
        css={{  //控制小屏时的导航条底下的整个页面滚动。
          flex: 1,
          [theme.mediaQueries.md]: {
            flex: "none"
          }
        }}
      >
        <div>
          <Container>
            <div
              css={{
                paddingTop: theme.spaces.lg,
                paddingBottom: theme.spaces.lg
              }}
            >
              {ingredients && (
                <div>
                  <Text variant="h5">设备明细信息</Text>

                      <div key={1}>
                        {editing ? (
                        <div>
                          <ContainLine display={'设备号'}>
                              <TransparentInput
                                autoFocus={true}
                                placeholder="那一台电梯？"
                                value={eqp?.cod || ''}
                                onChange={e => setEqp({...eqp, cod: e.currentTarget.value||undefined}) }
                              />
                          </ContainLine>
                          <ContainLine display={'监察识别码'}>
                            <TransparentInput
                              autoFocus={true}
                              placeholder="导入的情形可以不填写"
                              value={eqp?.oid || ''}
                              onChange={e => setEqp({...eqp, oid: e.currentTarget.value||undefined}) }
                            />
                          </ContainLine>
                        </div>
                        ) : (
                          <div
                            css={{
                              backgroundColor: false
                                ? theme.colors.palette.blue.lightest
                                : "transparent",
                              display: "flex",
                              marginLeft: "-0.25rem",
                              paddingLeft: "0.25rem",
                              marginRight: "-0.25rem",
                              paddingRight: "0.25rem",
                              // borderRadius: "0.25rem",
                              marginBottom: theme.spaces.xs,
                              justifyContent: "space-between",
                              [theme.mediaQueries.md]: {
                                width: "500px"
                              }
                            }}
                          >
                            <Text
                              css={{
                                paddingRight: theme.spaces.xs,
                                backgroundColor: false
                                  ? theme.colors.palette.blue.lightest
                                  : "white"
                              }}
                            >
                              设备号：{dt.cod}
                            </Text>
                            <div
                              css={{
                                flex: 1,
                                borderBottom: `1px dashed ${
                                  theme.colors.border.muted
                                }`,
                                marginBottom: "6px"
                              }}
                            />
                            <Text
                              css={{
                                paddingLeft: theme.spaces.xs,
                                backgroundColor: false
                                  ? theme.colors.palette.blue.lightest
                                  : "white"
                              }}
                            >
                              监察识别码：{dt.oid}
                            </Text>
                          </div>
                        )}
                        <br/>
                        <Text>暂时无独立设备库，目前设备是导入一个就积累一个的设备列表，待完善</Text>
                        <Select inputSize="md" css={{minWidth:'140px',fontSize:'1.3rem',padding:'0 1rem'}} divStyle={css`max-width:240px;`}
                                value={eqp?.type || ''}
                                onChange={e => {
                                  setEqp({...eqp, type: e.currentTarget.value||undefined, sort:undefined, vart:undefined});
                                 }
                                }
                        >
                          {
                            Object.entries(设备种类).map(([key,value],i) => (
                              <option key={i} value={key}>{value}</option>
                            ))
                          }
                          <option value={''}>全部</option>
                        </Select>
                        <Select inputSize="md" css={{minWidth:'140px',fontSize:'1.3rem',padding:'0 1rem'}} divStyle={css`max-width:240px;`}
                                value={eqp?.sort || ''}
                                onChange={e =>{
                                  setEqp({...eqp, sort: e.currentTarget.value||undefined, vart:undefined });
                                } }
                        >
                          {
                            Object.entries(设备类别[eqp?.type]||{}).map(([key,value],i) => (
                                <option key={i} value={key}>{value}</option>
                            ))
                          }
                          <option value={''}>全部</option>
                        </Select>
                        <Select inputSize="md" css={{minWidth:'140px',fontSize:'1.3rem',padding:'0 1rem'}} divStyle={css`max-width:240px;`}
                                value={eqp?.vart || ''}
                                onChange={e => setEqp({...eqp, vart: e.currentTarget.value||undefined}) }
                        >
                          {
                            Object.entries(设备品种[eqp?.sort]||{}).map(([vkey,vvalue],i) => (
                                <option key={i} value={vkey}>{vvalue}</option>
                            ))
                          }
                          <option value={''}>全部</option>
                        </Select>
                        { eqp?.__typename==='Elevator' && (
                          <React.Fragment>
                            <电梯
                              readOnly={true}
                              id={id}
                              editable={true}
                              defaultTitle={eqp.title}
                              eqp={eqp}
                              setPam={setEqp}
                            />
                          </React.Fragment>
                          )
                        }
                      </div>

                </div>
              )}

              <LayerLoading loading={loading} />
              {editing && <Button
                  intent="primary"
                  disabled={false}
                  css={{ marginLeft: theme.spaces.sm }}
                  onPress={() => {  //按钮里面看不到最新的input取值的。
                     saveRecipe(null);
                  }}
                  >
                生成新设备
                </Button>
              }
              {editing && <Button
                intent="primary"
                disabled ={!ready}
                css={{ marginLeft: theme.spaces.sm }}
                onPress={ async () => {
                  await updateDevice({ ...eqp }  );
                } }
              >
                更新设备信息到后端服务器
              </Button>
              }
            </div>
          </Container>
        </div>
      </div>

    </div>
  );
};

interface TransparentInputProps extends InputBaseProps {}

const TransparentInput = (props: TransparentInputProps) => {

  return (
    <Input
      css={{
        background: "none",
        border: "none",
        boxShadow: "none",
        // paddingTop: theme.spaces.xs,
        // paddingBottom: theme.spaces.xs,
        ":focus": {
          outline: "none",
          boxShadow: "none",
          background: "none"
        }
      }}
      {...props}
    />
  );
};


//其余的属性，({ display, children, ...props })  => {
const ContainLine =({ display, children, ...props })  => {
  const theme = useTheme();
  return (
    <div
      css={{
     //   marginTop: "-0.25rem",
     //   marginLeft: "-0.75rem",
     //   marginRight: "-0.75rem"
      }}
      {...props}
    >

      <div
        css={{
          backgroundColor: false
            ? theme.colors.palette.blue.lightest
            : "transparent",
          display: "flex",
          [theme.mediaQueries.md]: {
            maxWidth: "400px"
          }
        }}
      >
        <Text
          css={{
            display: "block",
            width: "100%",
            padding: "0.5rem 0.75rem"   //无法和输入组建的大小联动。
          }}
        >
          {display}
          </Text>

        {children}

      </div>

    </div>
  );
};


//注意：component is changing an uncontrolled input of type undefined to be controlled：使得输入捕获异常．
