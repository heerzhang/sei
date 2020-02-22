/** @jsx jsx */
import { jsx,  } from "@emotion/core";
import * as React from "react";
import {
  Text,
  Layer,
  InputGroupLine,
  Input,
  Button,
  ResponsivePopover,
  MenuList,
  MenuItem,
  IconChevronDown
} from "customize-easy-ui-component";

import {
  InspectRecordLayout,
  InternalItemHandResult,
  InternalItemProps,
  SelectHookfork,
  useItemInputControl
} from "../comp/base";

//很多内容相对重复，这里是报告较高层范围复用的组件；专门报告类型的可以安排在下一层次分开目录去做。


export const ItemInstrumentTable: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    { children, show ,alone=true},  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {仪器表} =par||{};
      return {仪器表};
    }, []);
    const {inp, setInp} = useItemInputControl({ ref });
    const [seq, setSeq] = React.useState(null);   //表對象的當前一條。
    const [obj, setObj] = React.useState({no:'',name:'',type:'',powerOn:'',shutDown:''});
    React.useEffect(() => {
      let size =inp?.仪器表?.length;
      setSeq(size>0?  size-1:null);
    }, [inp]);
    function onModifySeq(idx,it){
      setObj(it);
      setSeq(idx);
    };
    function onDeleteSeq(idx,it){
      inp?.仪器表?.splice(idx,1);
      setInp({...inp,仪器表: [...inp?.仪器表] });
      setSeq(null);
    };
    function onInsertSeq(idx,it){
      inp?.仪器表?.splice(idx,0, obj);
      setInp({...inp,仪器表:[...inp?.仪器表] });
      setSeq(idx);
    };
    function onAddSeq(idx){
      let size =inp?.仪器表?.push(obj);
      setInp( (inp?.仪器表&&{...inp,仪器表:[...inp?.仪器表] } )  || {...inp,仪器表:[obj] } );
      setSeq((inp?.仪器表&&(size-1))  || 0 );
    };

    const editor=<Layer elevation={"sm"} css={{ padding: '0.25rem' }}>
      <div>
        <InputGroupLine label={`测量设备名称`}>
          <Input   value={obj.name ||''}   onChange={e =>setObj({...obj, name: e.currentTarget.value} ) } />
        </InputGroupLine>
        <InputGroupLine label={`规格型号`}>
          <Input   value={obj.type ||''}   onChange={e =>setObj({...obj, type: e.currentTarget.value} ) } />
        </InputGroupLine>
        <InputGroupLine label={`测量设备编号`}>
          <Input   value={obj.no ||''}   onChange={e =>setObj({...obj, no: e.currentTarget.value} ) } />
        </InputGroupLine>
        <InputGroupLine  label='性能状态-开机后'>
          <SelectHookfork value={obj.powerOn ||''}  onChange={e =>setObj({...obj, powerOn: e.currentTarget.value} ) } />
        </InputGroupLine>
        <InputGroupLine  label='性能状态-关机前'>
          <SelectHookfork value={obj.shutDown ||''}  onChange={e =>setObj({...obj, shutDown: e.currentTarget.value} ) } />
        </InputGroupLine>
        <Button onPress={() => {
          if(seq !== null) {
            inp?.仪器表?.splice(seq, 1, obj);
            setInp({ ...inp, 仪器表: [...inp?.仪器表] });
          }
          else setInp({ ...inp, 仪器表: [obj] });
        } }
        >{inp?.仪器表?.length>0? `改一条就确认`: `新增一条`}</Button>
      </div>
    </Layer>;

    const instrumentTable=<div>
      {inp?.仪器表?.map((a,i)=>{
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
                {`[${a.no}] ${a.name||''} 型号${a.type||''} 开机${a.powerOn||''} 关机${a.shutDown||''}`}
              </Button>
            </ResponsivePopover>
          </div>
          {i===seq && editor}
        </React.Fragment>;
      }) }
    </div>;

    return (
      <InspectRecordLayout inp={inp} setInp={setInp}  getInpFilter={getInpFilter} show={show}
                           alone={alone}  label={'主要检验仪器设备'}>
        <Text  variant="h5">
          二、主要测量设备性能检查
        </Text>
        使用的仪器设备表:
        <hr/>
        {instrumentTable}
        {seq===null && editor}
      </InspectRecordLayout>
    );
  } );


