/** @jsx jsx */
import { jsx,  } from "@emotion/core";
import * as React from "react";
import {
  Text,  Button,  IconChevronDown,
  Select, Layer,  InputGroupLine, Input, ResponsivePopover, MenuList, MenuItem
} from "customize-easy-ui-component";
//import { Link as RouterLink } from "wouter";
import {
  InspectRecordLayout,
  InternalItemHandResult,
  InternalItemProps,
  SelectHookfork,
  useItemInputControl
} from "../comp/base";


//公共的复用性好的组件；编辑、原始记录，在多数模板能通用的。不通用的要安排放在更加具体贴近的目录文件内。
//方便不同模板和不同版本的可重复引用。文件目录管理，组件按照抽象性程度和参数配置的关联度，分级分层次，标识容易区分开。

export const ItemConclusion: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    { children, show ,alone=true},  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      //检验人IDs编制日期编制人结论：这些字段要提升到关系数据库表中，而不是json字段里面。只能保留上级语义更强的，json半结构化数据的就不做保留。
      const {检验结论,编制日期,编制人,检验人IDs} =par||{};
      return {检验结论,编制日期,编制人,检验人IDs};
    }, []);
    const {inp, setInp} = useItemInputControl({ ref });
    return (
      <InspectRecordLayout inp={inp} setInp={setInp}  getInpFilter={getInpFilter} show={show}
                           alone={alone}  label={'下结论!'}>
        五、现场检验意见
        <InputGroupLine  label='检验结论{签名后结论不能再改}' >
          <Select inputSize="md" css={{minWidth:'140px',fontSize:'1.3rem',padding:'0 1rem'}}
                  value={ inp?.检验结论  ||''}
                  onChange={e => setInp({ ...inp, 检验结论: e.currentTarget.value||undefined}) }
          >
            <option></option>
            <option>合格</option>
            <option>不合格</option>
            <option>复检合格</option>
            <option>复检不合格</option>
          </Select>
        </InputGroupLine>
        <InputGroupLine  label='检验人员{用户ID列表,将来签名，登录来签注}' >
          <Input  value={inp?.检验人IDs ||''} placeholder="输入本系统用户ID，将来签名后结论不能再改，多人签名：以 分割"
                  onChange={e => setInp({ ...inp, 检验人IDs: e.currentTarget.value||undefined}) } />
        </InputGroupLine>
        <InputGroupLine  label='编制人员{将来是提交人员，自动的}' >
          <Input  value={inp?.编制人 ||''} placeholder="目前直接输入名字，一个人"
                  onChange={e => setInp({ ...inp, 编制人: e.currentTarget.value||undefined}) } />
        </InputGroupLine>
        <InputGroupLine  label='编制日期{将来等于提交日，自动的}' >
          <Input  value={inp?.编制日期 ||''}  type='date'
                  onChange={e => setInp({ ...inp, 编制日期: e.currentTarget.value}) } />
        </InputGroupLine>
      </InspectRecordLayout>
    );
  } );

//不合格表unq数据生成时机：复检编制开始时初始化来的。在初检场景看到是动态校验目的前端显示表还未存储到后端数据库。
export const ItemRecheckResult: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    { children, show ,alone=true},  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {unq} =par||{};
      return {unq};
    }, []);
    const {inp, setInp} = useItemInputControl({ ref });
    const [seq, setSeq] = React.useState(null);   //表對象的當前一條。
    const [obj, setObj] = React.useState({no:'',desc:'',rres:'',rdate:''});
    React.useEffect(() => {
      let size =inp?.unq?.length;
      setSeq(size>0?  size-1:null);
    }, [inp]);
    function onModifySeq(idx,it){
      setObj(it);
      setSeq(idx);
    };
    function onDeleteSeq(idx,it){
      inp?.unq?.splice(idx,1);
      setInp({...inp,unq: [...inp?.unq] });
      setSeq(null);
    };
    function onInsertSeq(idx,it){
      inp?.unq?.splice(idx,0, obj);
      setInp({...inp,unq:[...inp?.unq] });
      setSeq(idx);
    };
    function onAddSeq(idx){
      let size =inp?.unq?.push(obj);
      setInp( (inp?.unq&&{...inp,unq:[...inp?.unq] } )  || {...inp,unq:[obj] } );
      setSeq((inp?.unq&&(size-1))  || 0 );
    };

    const editor=<Layer elevation={"sm"} css={{ padding: '0.25rem' }}>
      <div>
        <InputGroupLine label={`类别/编号{将来自动的不能改}`}>
          <Input   value={obj.no ||''} placeholder="目前是人工输入，类比B/4.8这样的"
                   onChange={e =>setObj({...obj, no: e.currentTarget.value} ) } />
        </InputGroupLine>
        <InputGroupLine label={`不合格内容描述{将来自动的}`}>
          <Input   value={obj.desc ||''}  placeholder="目前是人工输入，正式报告要呈现不合格说明"
                   onChange={e =>setObj({...obj, desc: e.currentTarget.value} ) } />
        </InputGroupLine>
        <InputGroupLine label={`复检结果`}>
          <SelectHookfork value={obj.rres ||''}
                          onChange={e =>setObj({...obj, rres: e.currentTarget.value} ) }
          />
        </InputGroupLine>
        <InputGroupLine  label='复检日期' >
          <Input  value={obj.rdate ||''}  type='date'
                  onChange={e =>setObj({...obj, rdate: e.currentTarget.value} ) } />
        </InputGroupLine>
        <Button onPress={() => {
          if(seq !== null) {
            inp?.unq?.splice(seq, 1, obj);
            setInp({ ...inp, unq: [...inp?.unq] });
          }
          else setInp({ ...inp, unq: [obj] });
        } }
        >{inp?.unq?.length>0? `改一条就确认`: `新增一条`}</Button>
      </div>
    </Layer>;

    const myTable=<div>
      {inp?.unq?.map((a,i)=>{
        return <React.Fragment  key={i}>
          <div>{`${i+1}`}
            <ResponsivePopover
              content={
                <MenuList>
                  <MenuItem onPress={()=>onModifySeq(i,a)}>修改</MenuItem>
                  <MenuItem onPress={()=>onDeleteSeq(i,a)}>刪除这条</MenuItem>
                  <MenuItem onPress={()=>onInsertSeq(i,a)}>插入一条</MenuItem>
                  <MenuItem onPress={()=>onAddSeq(i)}>末尾新增一条</MenuItem>
                </MenuList>
              }
            >
              <Button  size="md" iconAfter={<IconChevronDown />} variant="ghost" css={{whiteSpace:'unset'}}>
                {`[${a.rdate}] 项目${a.no||''}： ${a.desc||''}。 复检结果${a.rres||''}`}
              </Button>
            </ResponsivePopover>
          </div>
          {i===seq && editor}
        </React.Fragment>;
      }) }
    </div>;
    //不合格unq表数据生成时机：复检编制开始时初始化来的。在初检场景看到是动态校验目的前端显示表还未存储到后端数据库。
    return (
      <InspectRecordLayout inp={inp} setInp={setInp}  getInpFilter={getInpFilter} show={show}
                           alone={alone}  label={'不合格复检结果记录'}>
        <Text  variant="h5">
          四、检验不合格记录及复检结果
        </Text>
        明细表: 初检报告后才显示,复检时修改但是不能删除;
        <hr/>
        {myTable}
        {seq===null && editor}
      </InspectRecordLayout>
    );
  } );


//检验项目的标准化展示组件
export interface ItemUniversalProps  extends React.HTMLAttributes<HTMLDivElement>{
  show?: boolean;
  alone?: boolean;
  //检验项目配置对象标准的索引.[x].[y] ； 这里x是大项目；y是检验项目{还可拆分成几个更小项目的}。比如对应action="2.1"就是x=1,y=0的配置。
  x: number;
  y: number;
  inspectionContent: any[];
  ref?: any;
  procedure?: any;     //传递一个检验项目开头流程性内容，显示的格式等。
  details?: any[];     //传递各个子项目(若没有子项目的，就算项目本身[0])的定制，测量数据细节内容。
}
//引进Render Props模式提高复用能力 { details[0](inp,setInp)  }；就可以配置成通用的组件。
export const ItemUniversal: React.RefForwardingComponent<InternalItemHandResult,ItemUniversalProps>=
  React.forwardRef((
    { children, show=true, procedure, details, x, y ,alone=true,inspectionContent},  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      let fields={};
      //配置动态命名的字段获取旧的值，还想保存修改数据，还要界面同步显示变化数值的场景，就按这里做法。
      inspectionContent[x].items[y].names?.map((aName,i)=> {
        const namexD = `${aName}_D`;
        fields[aName] =par[aName];
        fields[namexD] =par[namexD];
      });
      inspectionContent[x].items[y].addNames.forEach(name=>
        fields[name] =par[name]
      );
      return fields;
    }, [x,y,inspectionContent]);
    const {inp, setInp} = useItemInputControl({ ref });
    //因为Hook不能用逻辑条件，只能上组件分解了，按条件分解两个组件。
    //下拉列表标题=检验类别+项目内容；
    //逻辑组件内部的钩子Hook有差异需求。分解成两个组件逻辑合并后，性能是有提升。
    return (
      <InspectRecordLayout inp={inp} setInp={setInp}  getInpFilter={getInpFilter} show={show}
                           alone={alone} label={`${inspectionContent[x].items[y].iClass}${inspectionContent[x].items[y].label}`}>
        <div css={{ display: 'flex', justifyContent: 'space-around' }}>
          <Text variant="h6">检验项目: {`${x + 1}.${y + 1}`}</Text>
          <Text variant="h6">{`${x + 1} ${inspectionContent[x].bigLabel}`}</Text>
        </div>
        <div css={{ display: 'flex', justifyContent: 'space-around' }}>
          <Text variant="h6">{`${x + 1}.${y + 1} ${inspectionContent[x].items[y].label}`}</Text>
          <Text variant="h6">检验类别 {`${inspectionContent[x].items[y].iClass}`}  </Text>
        </div>
        <hr/>
        {procedure}
        <Text variant="h5">
          查验结果
        </Text>
        {inspectionContent[x].items[y].subItems ? (inspectionContent[x].items[y].subItems?.map((a, i) => {
            const namex = `${inspectionContent[x].items[y].names[i]}`;
            const namexD = `${inspectionContent[x].items[y].names[i]}_D`;
            return <React.Fragment key={i}>
              {details[i] && details[i](inp, setInp)}
              <InputGroupLine label={inspectionContent[x].items[y].subItems[i]}>
                <SelectHookfork value={(inp?.[namex]) || ''} onChange={e => {
                  inp[namex] = e.currentTarget.value || undefined;
                  setInp({ ...inp });
                }}
                />
              </InputGroupLine>
              <InputGroupLine label='描述或问题'>
                <Input value={(inp?.[namexD]) || ''} onChange={e => {
                  inp[namexD] = e.currentTarget.value || undefined;
                  setInp({ ...inp });
                }}
                />
              </InputGroupLine>
            </React.Fragment>;
          }))
          :
          (inspectionContent[x].items[y].names?.map((a, i) => {
            const namex = `${inspectionContent[x].items[y].names[i]}`;
            const namexD = `${inspectionContent[x].items[y].names[i]}_D`;
            return <React.Fragment key={i}>
              {details[i] && details[i](inp, setInp)}
              <InputGroupLine label={inspectionContent[x].items[y].label}>
                <SelectHookfork value={(inp?.[namex]) || ''} onChange={e => {
                  inp[namex] = e.currentTarget.value || undefined;
                  setInp({ ...inp });
                }}
                />
              </InputGroupLine>
              <InputGroupLine label='描述或问题'>
                <Input value={(inp?.[namexD]) || ''} onChange={e => {
                  inp[namexD] = e.currentTarget.value || undefined;
                  setInp({ ...inp });
                }}
                />
              </InputGroupLine>
            </React.Fragment>;
          }))
        }
      </InspectRecordLayout>
    );
  } );





