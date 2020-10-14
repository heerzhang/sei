/** @jsx jsx */
import { jsx,  } from "@emotion/core";
import * as React from "react";
import {
  useTheme,  Button,
  InputGroupLine, Input,  TextArea, SuffixInput
} from "customize-easy-ui-component";
//import { Link as RouterLink } from "wouter";
import {
  InspectRecordLayout,
  InternalItemHandResult,
  InternalItemProps,
  useItemInputControl
} from "../comp/base";

//公共的复用性好的组件；编辑、原始记录，在多数模板能通用的。不通用的要安排放在更加具体贴近的目录文件内。
//方便不同模板和不同版本的可重复引用。文件目录管理，组件按照抽象性程度和参数配置的关联度，分级分层次，标识容易区分开。

export const ItemRemarks=
  React.forwardRef((
    { children, show ,alone=true}:InternalItemProps,  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {自检材料,校验材料,整改材料,资料及编号,memo} =par||{};
      return {自检材料,校验材料,整改材料,资料及编号,memo};
    }, []);
    const {inp, setInp} = useItemInputControl({ ref });
    return (
      <InspectRecordLayout inp={inp} setInp={setInp}  getInpFilter={getInpFilter} show={show}
                           alone={alone}  label={'见证材料或问题备注'}>
        六、见证材料{`{将来可能只需输入编号链接即可}`}
        <InputGroupLine  label='1、维保自检材料' >
          <Input  value={inp?.自检材料 ||''}  placeholder="使用默认规则，缺省编号情况的可不填"
                  onChange={e => setInp({ ...inp, 自检材料: e.currentTarget.value||undefined}) } />
        </InputGroupLine>
        <InputGroupLine  label='2、限速器动作速度校验材料' >
          <Input  value={inp?.校验材料 ||''}
                  onChange={e => setInp({ ...inp, 校验材料: e.currentTarget.value||undefined}) } />
        </InputGroupLine>
        <InputGroupLine  label='3、使用单位整改反馈材料' >
          <Input  value={inp?.整改材料 ||''}
                  onChange={e => setInp({ ...inp, 整改材料: e.currentTarget.value||undefined}) } />
        </InputGroupLine>
        <InputGroupLine  label='4、其他资料及编号' >
          <Input  value={inp?.资料及编号 ||''}
                  onChange={e => setInp({ ...inp, 资料及编号: e.currentTarget.value||undefined}) } />
        </InputGroupLine>
        七、备注<br/><br/>
        纸质正式报告备注可能只取前几行
        <TextArea  value={inp?.memo ||''} rows={10} placeholder="网页版本正式报告备注可随意多写"
                   onChange={e => setInp({ ...inp, memo: e.currentTarget.value||undefined}) } />
      </InspectRecordLayout>
    );
  } );


export const ItemAppendixB=
  React.forwardRef((
    { children, show ,alone=true}:InternalItemProps,  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {检验条件,温度,电压值} =par||{};
      return {检验条件,温度,电压值};
    }, []);
    const {inp, setInp} = useItemInputControl({ ref });
    const theme = useTheme();
    const [floor, setFloor] = React.useState(null);
    return (
      <InspectRecordLayout inp={inp} setInp={setInp}  getInpFilter={getInpFilter} show={show}
                           alone={alone}  label={'附录B：现场检验条件'}>
        1、机房或者机器设备间的空气温度保持在5℃～40℃之间；<br/>
        2、电源输入电压波动在额定电压值±7％的范围内；<br/>
        3、环境空气中没有腐蚀性和易燃性气体及导电尘埃； <br/>
        4、检验现场（主要指机房或者机器设备间、井道、轿顶、底坑）清洁，没有与电梯工作无关的物品和设备，基站、相关层站等检验现场放置表明正在进行检验的警示牌；<br/>
        5、对井道进行了必要的封闭。 <br/>
        特殊情况下，电梯设计文件对温度、湿度、电压、环境空气条件等进行了专门规定的，检验现场的温度、湿度、电压、环境空气条件等应当符合电梯设计文件的规定。
        <hr/>
        <div>
          确认过的记录:
          {inp?.检验条件?.map((a,i)=>{
            return <React.Fragment key={i}>
              <br/>{
              `[${a}]日: ${inp?.温度?.[a]||''} ℃, ${inp?.电压值?.[a]||''} V;`
            }
            </React.Fragment>;
          }) }
        </div>
        新增检查=＞
        <InputGroupLine  label='首先设置当前检验日期'>
          <SuffixInput
            type='date'
            value={floor||''}
            onChange={e => {setFloor( e.currentTarget.value) }}
          >
            <Button onPress={() =>floor&&(inp?.检验条件?.includes(floor)? null:
                setInp( (inp?.检验条件&&{...inp,检验条件:[...inp?.检验条件,floor] } )
                  || {...inp,检验条件:[floor] } )
            )}
            >新增</Button>
          </SuffixInput>
        </InputGroupLine>
        <div css={{ textAlign: 'center' }}>
          <Button css={{ marginTop: theme.spaces.sm }} size="sm"
                  onPress={() => floor&&inp?.检验条件?.includes(floor) &&(
                    setInp({...inp,检验条件:[...inp.检验条件.filter(a => a!==floor )],
                      温度:{...inp?.温度,[floor]:undefined}, 电压值:{...inp?.电压值,[floor]:undefined}
                    })
                  )}
          >刪除</Button>
        </div>
        <InputGroupLine label={`机房空气温度(${floor}):`}>
          <SuffixInput
            placeholder="请输入测量数"
            value={ (inp?.温度?.[floor] ) || ''}
            onChange={e => floor&&setInp({ ...inp, 温度:{...inp?.温度,[floor]:e.currentTarget.value||undefined} }) }
          >℃</SuffixInput>
        </InputGroupLine>
        <InputGroupLine label={`电源输入电压(${floor}):`}>
          <SuffixInput
            placeholder="请输入测量数"
            value={ (inp?.电压值?.[floor] ) || ''}
            onChange={e => floor&&setInp({ ...inp, 电压值:{...inp?.电压值,[floor]:e.currentTarget.value||undefined} }) }
          >V</SuffixInput>
        </InputGroupLine>
      </InspectRecordLayout>
    );
  } );


