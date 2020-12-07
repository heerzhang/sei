/** @jsxImportSource @emotion/react */
import { jsx } from "@emotion/react";
import * as React from "react";
import {
  InputGroup,
  Input,
  useTheme,
  VisuallyHidden,
  Button,
  useResponsiveContainerPadding,
  IconSearch, IconLayers, IconButton, Dialog, Text, IconMoreVertical, ResponsivePopover, IconX
} from "customize-easy-ui-component";

import { ContainLine, TransparentInput } from "../comp/base";
import { DevfilterContext } from "../context/DevfilterContext";
import { useApolloClient, gql, useQuery, NetworkStatus } from "@apollo/client";
import { Link as RouterLink } from "wouter";

//根据unitID查具体
const GET_UNIT_DETAIL = gql`
  query Unit($id: ID) {
    unit(id: $id) {
      id name company{id name no} person{id name no}
    }
  }
`;
//非高层次通用的组件。语义整合：　数据获取和规格化显示部分组合在一个文件内。
const UnitDetail= ( { id, onCancel }
) => {
  const theme = useTheme();
  //const [getUnit, { loading, data }] = useLazyQuery(GET_UNIT_DETAIL);  https://www.apollographql.com/docs/react/data/queries/
  const { loading, error, data, refetch,networkStatus } = useQuery(GET_UNIT_DETAIL, {
    variables: { id },
    notifyOnNetworkStatusChange: true
  });
  //Hooks必须放在条件分支if 前面，确保每一次render时刻hook执行顺序一致。
  if (networkStatus === NetworkStatus.refetch) return <React.Fragment>Refetching!</React.Fragment>;
  if (loading)   return null;
  if (error) return <React.Fragment>Error! ${error}</React.Fragment>;
    //<button onClick={() => refetch()}>Refetch!</button>
  return (
    <React.Fragment>
      <RouterLink to={`/unit/${id? id:''}`}>
        <TransparentInput
        readOnly
        value={data.unit?.company?.name||data.unit?.person.name||''}
        />
      </RouterLink>
      { data.unit && <IconButton
          css={{ marginLeft: theme.spaces.sm}}
          variant="ghost"
          icon={<IconX />}
          label="删除"
          onPress={onCancel}
          />
      }
    </React.Fragment>
  );
/*   <TransparentInput
            autoFocus={true}
            value={editor?.ownerId||''}
            onChange={e => {
              setEditor( {  ...editor, ownerId: e.currentTarget.value||undefined } );
            }}
          />
  */
}


export interface SearchBoxProps {
  setQuery: React.Dispatch<React.SetStateAction<any>>;
  query: any;
  label?: string;
  updateQuery?: any;   //立刻更新列表
}
//query,setQuery是搜索输入框的；不是弹出参数对话框；
export const SearchDeviceBox: React.FunctionComponent<SearchBoxProps> = ({
  query,
  label = "搜索吧 all recipes",
   setQuery,
  updateQuery,
   ...other
}) => {
  const theme = useTheme();
  const responsiveContainerPadding = useResponsiveContainerPadding();
  //设备选择的范围缩小功能
  const [open, setOpen] = React.useState(false);
  const [ingredients, setIngredients] = React.useState<any>( {} );
  const {filter, setFilter} =React.useContext(DevfilterContext);
  //修改中间状态;     //Todo:ingredients合并
  const [editor, setEditor] = React.useState<any>(filter);
  console.log("来看SearchDeviceBox当前的 ingredients=",ingredients,"filter=",filter,"query=",query);
  //const client = useApolloClient();

  return (
    <React.Fragment>
    <form
      css={{
        margin: 0,
        position: "relative"
      }}
      onSubmit={e => e.preventDefault()}
    >
      <InputGroup
        css={{ margin: 0, position: "relative" }}
        hideLabel
        label={label}
      >
        <Input
          type="search"
          inputSize="md"
          autoComplete="off"
          css={[
            {
              height: "60px",
              textAlign: "left",
              border: "none",
              borderBottom: "1px solid",
              borderColor: theme.colors.border.default,
              borderRadius: 0,
              WebkitAppearance: "none",
              // background: "transparent",
              boxShadow: "none",
              ":focus": {
                boxShadow: "none",
                backgroundColor: theme.colors.background.tint1
              }
            },
            responsiveContainerPadding
          ]}
          {...other}
          value={ query }
          onChange={e => setQuery(e.target.value)}
          placeholder={label}
        />
      </InputGroup>
      <VisuallyHidden>
        <Button type="submit">搜索</Button>
      </VisuallyHidden>
      <IconSearch
        aria-hidden
        color={theme.colors.scales.gray[6]}
        css={{
          display: query ? "none" : "block",
          position: "absolute",
          right: `calc(2 * ${theme.spaces.lg})`,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10
        }}
      />

      <IconButton
        onPress={() => setOpen(true)}
        variant="ghost"
        label="定制可选参数"
        size="md"
        icon={<IconLayers />}
        css={{
          display: query ? "none" : "block",
          position: "absolute",
          right: theme.spaces.sm,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          height: 'unset',
          width: 'unset'
        }}
      />

    </form>

      <Dialog
        mobileFullscreen
        isOpen={open}
        onRequestClose={() => setOpen(false)}
        title="选择参数缩小查询的范围"
      >
        <div css={{ padding: theme.spaces.lg }}>
          <Text>为了减少查询结果集的数量</Text>
          <div>
            <ContainLine display={'出厂编号'}>
              <TransparentInput
                autoFocus={true}
                placeholder="名字"
                value={editor?.fno||''}
                onChange={e => {
                  setEditor( {  ...editor, fno: e.currentTarget.value||undefined } );
                }}
              />
            </ContainLine>
            <ContainLine display={'任务---部门'}>
              <TransparentInput
                autoFocus={true}
                placeholder="名字"
                value={ingredients.task && ingredients.task.dep}
                onChange={e => {
                  setIngredients( {
                    ...ingredients,
                    task: {dep: e.target.value}
                  });
                }}
              />
            </ContainLine>
            <ContainLine display={'检验---检验人员包含'}>
              <TransparentInput
                autoFocus={true}
                value={((ingredients.isps||{}).ispMen||{}).username}
                onChange={e => {
                  setIngredients( {
                    ...ingredients,
                    isps:{ispMen:{username: e.target.value}}
                  });
                }}
              />
            </ContainLine>
            <ContainLine display={'设备产权人的单位ID'}>
                <UnitDetail id={editor?.ownerId}
                            onCancel={() => {
                              //取消这一个Id
                              setEditor( {  ...editor, ownerId:undefined })
                            } }
                />
            </ContainLine>
            <ContainLine display={'设备使用单位ID'}>
              <UnitDetail id={editor?.useUid}
                          onCancel={() => {
                            //取消这一个Id
                            setEditor( {  ...editor, useUid:undefined })
                          } }
              />
            </ContainLine>
          </div>

          <div
            css={{
              display: "flex",
              marginTop: theme.spaces.lg,
              justifyContent: "flex-end"
            }}
          >
            <Button intent="primary"
                    onPress={e => {
                      setOpen(false);
                      //用client.clearStore();导致devicesFind= undefined
                      //client.resetStore(); 可以啊。
                      //setQuery({ ...ingredients})
                     /* updateQuery( (previousQueryResult, options ) => {
                          console.log("取更２新options=",options,"previousQueryResult=",previousQueryResult);
                          return null;
                          }
                        );
                      */
                      setFilter( {  ...filter, ...editor } );
                      //console.log(`参数设置好了 took ${duration}ms`);   //执行时间长度102ms　setXXX同步执行
                    } }
            >
              参数设置好了
            </Button>
          </div>
          <Text>搜索框输入可用后端识别转义符号  % 任意的几个字符  _ 某个字符</Text>
          <br/>
          <Button intent="primary"
                  onPress={e => setFilter(null) }
          >清空过滤器设置
          </Button>
        </div>

      </Dialog>
    </React.Fragment>
  );
};


/*图标触发：
<IconButton
  component={Link}
  to="/device/option"
<Dialog 中等大屏幕时刻触发不了。
*/

