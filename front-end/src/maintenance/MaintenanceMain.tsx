/** @jsxImportSource @emotion/react */
import {  css,  } from "@emotion/react";
import * as React from "react";
import {
  Text,
  Toolbar,
  useTheme,
  Button,
  IconChevronDown,
  IconChevronUp,
  Select,
  Container,
  IconCloud,
  List,
  ListItem,
  Avatar,IconTruck, IconArrowRight
} from "customize-easy-ui-component";
//import useLocation from "wouter/use-location";
//import {  useQueryOriginalRecord } from "./db";
//import { useUid } from "customize-easy-ui-component/esm/Hooks/use-uid";
import food from "../images/food.svg";
import { Layout } from "./Layout";
//import queryString from "query-string";
//import pick from "lodash.pick";
import {RecordView} from "./RecordView";
  /*类比路由功能的配置表，根据类型来映射组件的文件名*/
import typeAsRoute from "../typeAsRoute.json";
import { loadTemplate } from "./template";
//新版本直接把gql描述放在页面组件中。
import { useQuery,gql,useMutation } from "@apollo/client";
//import { Link as RouterLink } from "wouter";
import { ContainLine, TransparentInput } from "../comp/base";
import { useEffect } from "react";

/* 同步功能的接口可选列表， 底下定义gql`mutation WEI_HU ...`中，可直接替换：
老旧unit同步+ES同步： syncUnitFromOld
老旧EQP同步：syncEqpFromOld
从Eqp腾挪复制到EqpEs索引: syncEqpEsFromEqp

*/

//根据老旧平台unit做同步
const WEI_HU_UNIT = gql`
  mutation WEI_HU($offset: Int!, $limit: Int!) {
    res: syncEqpEsFromEqp(offset: $offset, limit: $limit) 
  }
`;
//可能2个分片一起发起submitfunc请求的；点击停止后，任务实际继续直到已经发起的分片任务返回结果；调整参数使每个分片5-10秒能解决。
const UnitDetail= ( { id, onCancel }
) => {
  //const theme = useTheme();
  const [limit, setLimit] = React.useState(40 );
  const [offset, setOffset] = React.useState(0 );
  const [submitfunc, {error, data, loading, }] = useMutation(WEI_HU_UNIT, {
    variables: {offset, limit }
  });
  const [doing, setDoing] = React.useState(false );

  React.useEffect(() => {
    if(doing && !loading)   submitfunc();
  }, [doing, offset, loading, submitfunc]);
  //let hasEvents=data?.res.filter(a => a !== "成功");
  useEffect( () => {
      if(!doing)  return;　　 //界面data显示比console.log输出还早了;
      if(data?.res.length <= 0)    setDoing(false);
      var someOneis=false;
      data?.res.map((value,key) => {
        if(value !== "成功") {
          //可能重复,多执行了
          console.log("UnitEventskey=", key, value);
          if(!someOneis)  someOneis=true;
        }
        return null;
      });
      if(someOneis)     setDoing(false);
      if(data?.res.length>0)     setOffset(offset + limit);
    },
    [data,loading,doing,offset,limit]);

  if (error) return <React.Fragment>Error! ${error}</React.Fragment>;

  //长期运行：导致，浏览器崩溃,内存溢出了。　
  //console.log("UnitDetail捕offset=", offset);

  /*    setOffset(`${Number(offset) + limit}`);
        setOffset(String(Number(offset) + limit));
        <button onClick={() => refetch()}>Refetch!</button>
  */

  return (
    <React.Fragment>
      <Text  variant="h5"　css={{ textAlign: 'center' }}>
        <span>从老旧平台同步单位数据来</span>
      </Text>
      <ContainLine display={'指定TB_UNT_MGE起点offset'}>
        <TransparentInput
          autoFocus={true}
          placeholder="起点offset记录数" type='number'
          value={offset}
          onChange={e => setOffset( Number(e.currentTarget.value) ) }
        />
     </ContainLine>
      <ContainLine display={'指定一批执行记录数limit'}>
        <TransparentInput
          autoFocus={true}
          placeholder="一批执行记录数" type='number'
          value={limit}
          onChange={e => setLimit( Number(e.currentTarget.value) ) }
        />
      </ContainLine>
      <Text  css={{wordWrap: 'break-word'}}>{`下一步准备抓取的,当前进度offset是=( ${offset} )`}</Text>
      <List>
        {
          data?.res?.map((hit,i) => (
            <ListItem key={i}
                      contentBefore={
                        <React.Fragment>
                          {hit === "成功" ?
                            <Avatar size="sm" name={'OK'}/> :
                            <Avatar size="sm" name={'ERROR!'}/>
                          }
                        </React.Fragment>
                      }
                      primary={`${hit}`}
            />
          ))}

      </List>
      <Button
        size="lg"
        intent="primary"
        iconBefore={<IconTruck />}
        iconAfter={<IconArrowRight />}
        onPress={ async () => {
          setDoing(!doing);
        }}
      >
        {doing? '停止同步吧!' : '继续同步数据去'}
      </Button>
    <br/>
    </React.Fragment>
  );
}


//前端任务，分片分批次，要确保允许短时间内重新执行同一个分片而没有影响。
//viewAll是否是整个报表都一起显示。
export default function MaintenanceMain({printing, }:{printing?:boolean, },props) {
  const theme = useTheme();
  //useState(默认值) ； 后面参数值仅仅在组件的装载时期有起作用，若再次路由RouterLink进入的，它不会依照该新默认值去修改show。useRef跳出Cpature Value带来的限制
  //采用RouterLink页内路由进入useState还保留旧的值，要修改就将会导致render两次；旧的值新的值各一次渲染。若采用URL刷新模式只有一次。
  const [show, setShow] = React.useState(false);

  //let filtercomp={ id:231 };
  //refetch() 引起 loading= True/False变化，从而需要组件范围render重做搞2次。
  //若是浏览器后退前进的场景不会执行useQueryOriginalRecord代码，item已经有数据了，loading不会变化。
  //const {loading,items, refetch } =useQueryOriginalRecord(filtercomp);
  const [template, setTemplate] = React.useState(null   as any);
  //模板的类型标识
  const [tplType, setTplType] = React.useState('EL-DJ');

  //复检数据拷贝初检后再度修订的。最初的初检数据原封不动。复检rexm，正检data，结论及审核改定deduction｛也可部分照搬复检rexm正检data或映射转译｝。
  //原始记录录入模式复检正检，［正式报告来源项］只读的预览结论模式{动态生成结论}，(完毕提交)；
  //１原始记录　组件：不可改的不保存的［推断］结论项。　　　内容细化描述；复检正检数据切换的；结论项提示性质；　－－给检验操作人员录入。
  //２审核组件：回退或者往前固化结论项后保存给正式报告页面。　项目文本简化，数据需要保存给后端；－－正式报告手机可预览版，无下拉分区，不能编辑，－－核准管理人员审批。
  //３正式报告那个目录的打印页面。只读的，结论项也是读后端的；正式报告文书版本或可转保存其他如pdf类型文档，无下拉分区，全展示；－－大众用户查看。
  //审核但是不能修改检验数据模式，回退编制复检？或后台修正；校对转正式报告数据倒腾和推断合并结论项目，另外保存成了deduction，对表正式报告，报告排版美化。
  const [inp, ] = React.useState(null);


  //外部dat不能加到依赖，变成死循环! const  dat =items&&items.data&&JSON.parse(items.data);  这dat每次render都变了？
  //从后端返回的数据可能items已经被修改了


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
      loadTemplate(typeAsRoute[tplType], setTemplate);
      //console.log("loadTemplate动态执行import!  tplType =", tplType);
  }, [tplType]);


  //console.log("祖父OriginalRecord辈：捕获 ==inp=[",  inp,  "]items=", items ,"loading=", loading);

  /*这样子的逻辑， 反而导致重度加载， &&逻辑类比 路由模式，可引起该分叉的底下所有子组件重新render等价于局部的URL刷新！得不偿失。
    if(previousPar!==par && !isEqual(inp,itemVal))
        return <LayerLoading loading={true} label={'更新数据，加载中请稍后'}/>;   看不出效果来，会立刻运行下一步的render了。    */

  return (
    <Layout>
      <Container>
      <Text  variant="h4"　css={{ textAlign: 'center' }}>
        <span>后台和数据同步等任务前端在线运行</span>
      </Text>
      <Toolbar>
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

        <Select inputSize="md" css={{minWidth:'140px',fontSize:'2rem',padding:'0 1rem'}} divStyle={css`max-width:240px;`}
                value={tplType}  onChange={e => setTplType(e.currentTarget.value) }
        >
          <option>EL-DJ</option>
          <option>模板类型编号</option>
          <option>EL-JJ</option>
        </Select>

        <div css={{ marginLeft: "auto" }}>
          <Button
            aria-controls="collapse"
            variant="ghost"
            intent="primary"
            iconAfter={show ? <IconChevronUp /> : <IconChevronDown />}
            onPress={() => {
                //异步的，但是多个setXXX合并执行的,　然后才做render。 而传递到useEffect（,[tplType])需要等到下一次render;
                // !show&&setTplType('EL-JJ');     show&&setTplType('EL-DJ');
               setShow(!show);
              }  }
          >
            {show ? "都收起" : "都显示"}
          </Button>
        </div>
      </Toolbar>
        {
          inp && template &&  <RecordView inp={inp} showAll={show} template={template}/>
        }
        <UnitDetail id={1}
                    onCancel={() => {
                      //取消这
                    } }
        />
        <Button
          aria-controls="collapse"
          variant="ghost"
          intent="primary"
          iconAfter={<IconCloud />}
          onPress={() => {} }
        >拉取后端最新数据
        </Button>
      </Container>
      <Text  variant="h6"　css={{ textAlign: 'center' }}>
        <span>性能波动大，请确保60秒之内完成分片任务，最好控制单步运行5秒就能完成</span>
      </Text>
    </Layout>
  );
}

