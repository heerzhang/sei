/** @jsx jsx */
import { jsx, css,  } from "@emotion/core";
import * as React from "react";
import {
  Text,
  Toolbar,
  useTheme,
  Button,
  IconChevronDown,
  IconChevronUp,
  Select, Container, IconCloud, InputGroupLine, Input, TabPanel, IconArrowRight, Layer
} from "customize-easy-ui-component";
//import useLocation from "wouter/use-location";
import {  useQueryOriginalRecord } from "./db";
//import { useUid } from "customize-easy-ui-component/esm/Hooks/use-uid";
import food from "../images/food.svg";
import { Layout } from "./Layout";

import { Link as RouterLink } from "wouter";


//viewAll是否是整个报表都一起显示。
export  function Guide({printing, }:{printing?:boolean, },props) {
  const theme = useTheme();
  //useState(默认值) ； 后面参数值仅仅在组件的装载时期有起作用，若再次路由RouterLink进入的，它不会依照该新默认值去修改show。useRef跳出Cpature Value带来的限制
  //采用RouterLink页内路由进入useState还保留旧的值，要修改就将会导致render两次；旧的值新的值各一次渲染。若采用URL刷新模式只有一次。
  const [show, setShow] = React.useState(false);
  const [repId, setRepId] = React.useState('');
  let filtercomp={ id:repId };
  //refetch() 引起 loading= True/False变化，从而需要组件范围render重做搞2次。
  //若是浏览器后退前进的场景不会执行useQueryOriginalRecord代码，item已经有数据了，loading不会变化。
  const {loading,items, } =useQueryOriginalRecord(filtercomp);
 // const [template, ] = React.useState(null   as any);
  //模板的类型标识
  const [tplType, setTplType] = React.useState('EL-DJ');

  //复检数据拷贝初检后再度修订的。最初的初检数据原封不动。复检rexm，正检data，结论及审核改定deduction｛也可部分照搬复检rexm正检data或映射转译｝。
  //原始记录录入模式复检正检，［正式报告来源项］只读的预览结论模式{动态生成结论}，(完毕提交)；
  //１原始记录　组件：不可改的不保存的［推断］结论项。　　　内容细化描述；复检正检数据切换的；结论项提示性质；　－－给检验操作人员录入。
  //２审核组件：回退或者往前固化结论项后保存给正式报告页面。　项目文本简化，数据需要保存给后端；－－正式报告手机可预览版，无下拉分区，不能编辑，－－核准管理人员审批。
  //３正式报告那个目录的打印页面。只读的，结论项也是读后端的；正式报告文书版本或可转保存其他如pdf类型文档，无下拉分区，全展示；－－大众用户查看。
  //审核但是不能修改检验数据模式，回退编制复检？或后台修正；校对转正式报告数据倒腾和推断合并结论项目，另外保存成了deduction，对表正式报告，报告排版美化。
  const [inp, setInp] = React.useState(null);


  //外部dat不能加到依赖，变成死循环! const  dat =items&&items.data&&JSON.parse(items.data);  这dat每次render都变了？
  //从后端返回的数据可能items已经被修改了
  React.useEffect(() => {
    const  dat =items&&items.data&&JSON.parse(items.data);
     dat && setInp(dat);
  }, [items]);

  //父辈组件重做render了，不意味着其儿孙组件们也需要重做render。
  //依赖项[inp, show]没变化， useMemo包裹的且已经挂载的组件就不会重新render；降低重复部分的render工作量。
  //？有隐藏错误：projectList长度变化了，导致RecordView内useProjectListAs部的hook调用次数顺序的修改，引起报错！　tplType变化必须刷新？。
  /*
  const projects= React.useMemo(() =>
                  <RecordView inp={inp} showAll={show} projectList={projectList}/>
                          ,[inp, show, tplType, projectList] );
  */

  //假如这里加 if( loading )  return <LayerLoading loading/>; 会导致子组件被unmount，随后需要再一次挂载等于这部分分支的URL刷新一样。
  React.useEffect(() => {
    //  loadTemplate(typeAsRoute[tplType], setTemplate);
      //console.log("loadTemplate动态执行import!  tplType =", tplType);
  }, [tplType]);


  console.log("祖父OriginalRecord辈：捕获 ==inp=[",  inp,  "]items=", items ,"loading=", loading);
  /*这样子的逻辑， 反而导致重度加载， &&逻辑类比 路由模式，可引起该分叉的底下所有子组件重新render等价于局部的URL刷新！得不偿失。
    if(previousPar!==par && !isEqual(inp,itemVal))
        return <LayerLoading loading={true} label={'更新数据，加载中请稍后'}/>;   看不出效果来，会立刻运行下一步的render了。    */

  return (
    <Layout>
      <Container  css={{
        boxSizing: "border-box",
        flexDirection: "column",
        flex: "1",
        boxShadow: "none",
        position: "absolute",
        width: "100%",
        borderRadius: 0,
        height: `calc(100vh)`,
      }}>
      <Toolbar>
        <RouterLink　to="/">
        <Text
          variant="h5"
          css={{
            alignItems: "center",
            display: "flex",
            color: "#43596c"
          }}
          gutter={false}
        >
          <img
            css={{
              marginRight: theme.spaces.sm,
              width: "30px",
              height: "30px"
            }}
            src={food} alt={``}
            aria-hidden
          />
          <span>检验平台</span>
        </Text>
        </RouterLink>
        <div css={{ marginLeft: "auto" }}>
        </div>
      </Toolbar>

        <Container css={{
          display: 'flex',
          alignItems: 'center',
          height: '100%'
        }}>
          <div css={{
              margin: 'auto',
              background: "white"
            }}
          >
            <Text  variant="h5"　css={{ textAlign: 'center' }}>
              <span>目前支持电梯的定期检验</span>
            </Text>
            <InputGroupLine  label='报告ID{将来是从链接地址自动获得}' >
              <Input  value={repId}  placeholder="那一份报告？将来是点击链接自动获得"
                      onChange={e => setRepId(e.currentTarget.value) } />
            </InputGroupLine>
            <InputGroupLine  label='本系统签发token{将来是从链接地址自动获得}' >
              <Input  value={''}  placeholder="三月有效；登录用户无需token"
                      onChange={e => void 0 } />
            </InputGroupLine>
            <RouterLink to={`/report/EL-DJ/ver/1/preview/${repId}`}>
              <Button
                size="lg" noBind
                intent="primary"
                variant="ghost"
                iconAfter={<IconCloud />}
              >
                读取该份报告内容
              </Button>
            </RouterLink>
          </div>
        </Container>

        <hr/>
        <Text variant="h5" css={{ textAlign: 'center' }}>
          业务端客户可以无密码登录进入浏览报告，但是必须提供本系统签发的token来验明真身，token三个月有效期，过期想看报告需申请。
        </Text>
      </Container>
    </Layout>
  );
}

