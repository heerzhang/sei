/** @jsx jsx */
import { jsx, Global } from "@emotion/core";
import * as React from "react";
//import Editor, { tryValue } from "./Editor";
//import { ImageUpload } from "./ImageUpload";
//import { Image } from "./Image";
//import debug from "debug";
//import initialValue from "./value.json";
//import { Ingredient } from "./RecipeList";
import {
  Navbar,
  Toolbar,
  Input,
  Text,
  IconButton,
  MenuList,
  MenuItem,
  useTheme,
  InputBaseProps,
  useToast,
  LayerLoading,
  Container,
  ResponsivePopover,
  IconMoreVertical,
  MenuDivider, IconPackage, Button, IconChevronDown
} from "customize-easy-ui-component";

//import { useSession } from "../auth";
import {Helmet} from "react-helmet";
import { Link,  useLocation } from "wouter";
import { Link as RouterLink } from "wouter";
import { useCancellationTask } from "./task/db";
//[HOOK限制]按钮点击函数内部直接上toast()或toaster.notify()很可能无法正常显示。而放在函数组件顶层render代码前却能正常。
//import toaster from "toasted-notes";

//这是给高亮注释的id/key的，DOM显示需要唯一标识符。
/*let n = 0;
function getHighlightKey() {
  return `highlight_${n++}`;
}
*/
//const log = debug("app:Compose");

export interface ComposeProps {
  id?: string;
  defaultTitle?: string;
  defaultImage?: string;
  defaultDescription?: string;
  defaultIngredients?: any[];
  readOnly?: boolean;
  editable?: boolean;
  defaultCredit?: string;
  dt?:any;
}

/**
 * THIS IS A DISASTER. HAHAHhahha.. ugh. Rewrite when i'm not lazy
 * @param param0
 */

export const AttachedTask: React.FunctionComponent<ComposeProps> = ({
  readOnly,
  id,
  editable,
  defaultCredit = "",
  defaultDescription,
  defaultImage,
  defaultIngredients,
  defaultTitle = "",
  dt=null,
}) => {
  const theme = useTheme();
  const toast = useToast();
  const eqpId=id;
  //const ref = React.useRef(null);
  //const {user,} = useSession();
  const [loading, setLoading] = React.useState(false);
  const [editing, setEditing] = React.useState(!readOnly);
 /* const [content, setContent] = React.useState(() => {
    return defaultDescription
      ? ''
      : null;
  });*/
  const [image, ] = React.useState(defaultImage);
  const [title, setTitle] = React.useState(defaultTitle);
 // const [message, setMessage] = React.useState(null);
  const [taskId, setTaskId] = React.useState(null);
  const {task} =dt;
 // const [ingredients, setIngredients] = React.useState<any>( dt||{} );
  const [, setLocation] = useLocation();
  const {result, submit:updateFunc, } = useCancellationTask({
    taskid: taskId, reason:'测试期直接删'
  });
  console.log("页面刷新钩子AttachedTask entry=",　",id="+id+";task=",task,";dt=",dt);

  async function handleDelete(id: string) {
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
    setLocation("/device/"+eqpId,  true );
  }

  return (
    <div
      css={{
        [theme.mediaQueries.md]: {
          height: "auto",
          display: "block"
        }
      }}
    >
      <Helmet title={title ? title : "设备数据维护"} />
      <Global
        styles={{
          ".filepond--wrapper": {
            padding: theme.spaces.lg,
            paddingBottom: 0
          },
          ".filepond--root": {
            marginBottom: 0
          },
          ".filepond--label-action": {
            display: "flex",
            alignItems: "center",
            textDecoration: "none"
          },
          ".filepond--label-action > svg": {
            width: "40px",
            height: "40px",
            fill: theme.colors.text.default
          },
          ".filepond--label-action > span": {
            border: 0,
            clip: "rect(0 0 0 0)",
            height: "1px",
            width: "1px",
            margin: "-1px",
            padding: 0,
            overflow: "hidden",
            position: "absolute"
          },
          ".filepond--panel-root": {
            backgroundColor: theme.colors.background.tint1
          },
        }}
      />
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

          {editing ? (
            <div css={{ marginLeft: "-0.75rem", flex: 1 }}>
              <TransparentInput
                autoComplete="off"
                autoFocus
                inputSize="lg"
                value={title}
                placeholder="增加新的检验设备"
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
              该设备{dt.cod}关联的近期活动任务
            </Text>
          )}
          <div>
            <ResponsivePopover
              content={
                <MenuList>
                    <MenuItem contentBefore={<IconPackage />}  onPress={() => {
                      setLocation("/device/"+id+"/addTask", true );
                    } }>
                      生成任务1
                    </MenuItem>
                  <MenuDivider />
                     <MenuItem contentBefore={<IconPackage />}  onPress={() => {
                       setLocation("/device/"+id+"/task/", true );
                     } }>
                      准备派工给检验员2
                    </MenuItem>
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

          </div>
        </Toolbar>
      </Navbar>

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
              {task && task.map(each => (
                <div>
                      <div key={each.id}>
                        {  (
                          <div
                            css={{
                              backgroundColor: false
                                ? theme.colors.palette.blue.lightest
                                : "transparent",
                              display: "flex",
                           //  marginLeft: "-0.25rem",
                            //  paddingLeft: "0.25rem",
                           //   marginRight: "-0.25rem",
                          //    paddingRight: "0.25rem",
                              // borderRadius: "0.25rem",
                              marginBottom: theme.spaces.xs,
                              justifyContent: "space-between",
                              [theme.mediaQueries.md]: {
                                width: "300px"
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
                              任务号{each.id}
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
                              状态：{each.status}
                            </Text>
                            <Link  to={"/device/"+dt.id+"/task/"+each.id}>
                              检验ISP详情
                            </Link>
                            <ResponsivePopover
                              content={
                                <MenuList>
                                  <MenuItem onPress={ async () => {
                                      await setTaskId(each.id);
                                      handleDelete(each.id)
                                    }
                                  }>注销任务
                                  </MenuItem>
                                </MenuList>
                              }
                            >
                              <Button  size="md" iconAfter={<IconChevronDown />} variant="ghost" css={{whiteSpace:'unset'}}>
                                {`${each.date||''}`}
                              </Button>
                            </ResponsivePopover>
                          </div>
                        )}
                      </div>


                </div>
              ))}


            </div>
          </Container>
        </div>
      </div>
      <LayerLoading loading={loading} />
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

