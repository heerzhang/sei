/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import * as React from "react";
import {
  Text,
  useTheme,
  Button,
  InputGroupLine,
  SuffixInput,
  Input,
  Select, useCollapse
} from "customize-easy-ui-component";
import {Table, TableBody,  TableRow, Cell, CCell} from "../../comp/TableExt";
import {
  AntCheck,
  IndentationLayText, InspectItemHeadColumn,
  InspectRecordHeadColumn,
  InspectRecordTitle, InspectZoneHeadColumn,
  SelectHookfork, TemplateViewProps,
  useItemControlAs, useProjectListAs
} from "../comp/base";
import {  InternalItemHandResult, InternalItemProps } from "../comp/base";
import { callSubitemChangePar, callSubitemShow, mergeSubitemRefs } from "../../utils/tools";
import orderBy from "lodash.orderby";

let   id = 0;
const genId = () => ++id;
function createItem( order:  number, content: React.ReactNode) {
  return {id:genId(), order, content};
}

const TemplateView: React.RefForwardingComponent<InternalItemHandResult,TemplateViewProps>=
  React.forwardRef((
     {inp, showAll=false, children},   ref
  ) => {
    const clRefs =useProjectListAs({count: projectList.length});
    const outCome=mergeSubitemRefs( ...clRefs.current! );
    React.useImperativeHandle( ref,() => ({ inp: outCome }), [outCome] );
    React.useEffect(() => {
     callSubitemShow(showAll,  ...clRefs.current! );
    }, [showAll, clRefs] );
    React.useEffect(() => {
      callSubitemChangePar(inp,  ...clRefs.current! );
    }, [inp, clRefs] );
    const recordList= React.useMemo(() =>
            <React.Fragment>
              {
                (showAll ? projectList : orderBy(projectList,['order'],['asc']) )
                  .map((each, i) => {
                    return  React.cloneElement(each.content as React.ReactElement<any>, {
                      ref: clRefs.current![i],
                      key: each.order
                    });
                  })
              }
            </React.Fragment>
                  ,[showAll, clRefs]);
    return  recordList;
  } );

export  const  myTemplate= <TemplateView/>;


const InternalItem1: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    props:{ children },  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {registration,safetyFiles,ruleRegulation,contractSigned,operatorCertificate} =par||{};
      return {registration,safetyFiles,ruleRegulation,contractSigned,operatorCertificate};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter});

    return (
      <InspectRecordTitle  control={eos}   label={'检验项目 1.4'}>
        <InspectRecordHeadColumn  level={'B'}  bigLabel={'1 技术资料'}  label={'1.4 使用资料'} tinyLabel={' 使用单位提供了以下资料：'} >
          <div css={{ textAlign: 'center' }}>
            其中详细条款有
          </div>
          <IndentationLayText title={'(2)安全技术档案应保存完好，至少包括：'}>
            ①1.1、1.2、1.3所述文件资料[1.2的(3)项和1.3的(5)项除外];<br/>
            ②监督检验报告;<br/>
            ③定期检验报告;<br/>
            ④日常检查与使用状况记录;<br/>
            ⑤日常维护保养记录;<br/>
            ⑥年度自行检查记录或者报告;<br/>
            ⑦应急救援演习记录;<br/>
            ⑧运行故障和事故记录等;
          </IndentationLayText>
          <IndentationLayText title={'(3)以岗位责任制为核心的电梯运行管理规章制度，包括：'}>
            ①事故与故障的应急措施和救援预案；<br/>
            ②电梯钥匙使用管理制度；<br/>
            ③其它档案和制度;
          </IndentationLayText>
        </InspectRecordHeadColumn>
        <InputGroupLine  label='(1)使用登记资料，内容与实物相符； '>
          <SelectHookfork value={ (inp?.registration) ||''}
                          onChange={e => setInp({ ...inp, registration: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='(2)安全技术档案应保存完好，至少包括： '>
          <SelectHookfork value={ (inp?.safetyFiles) ||''}
                          onChange={e => setInp({ ...inp, safetyFiles: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='(3)以岗位责任制为核心的电梯运行管理规章制度，包括： '>
          <SelectHookfork value={ (inp?.ruleRegulation) ||''}
                          onChange={e => setInp({ ...inp, ruleRegulation: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='(4)与取得相应资格单位签订的日常维护保养合同； '>
          <SelectHookfork value={ (inp?.contractSigned) ||''}
                          onChange={e => setInp({ ...inp, contractSigned: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='(5)按照规定配备的电梯安全管理和作业人员的特种设备作业人员证。 '>
          <SelectHookfork value={ (inp?.operatorCertificate) ||''}
                          onChange={e => setInp({ ...inp, operatorCertificate: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
      </InspectRecordTitle>
    );
  } );

const InternalItem50: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    props:{ children },  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {tool,toolBox,measurementCycle,goodFunction,meetRequirement,cantUsedReason} =par||{};
      return {tool,toolBox,measurementCycle,goodFunction,meetRequirement,cantUsedReason};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter});

    return (
      <InspectRecordTitle  control={eos}   label={'检验主要仪器设备'}>
        <InputGroupLine  label='本次检验使用的工具箱为' >
          <SuffixInput
            value={(inp?.toolBox) ||'' }
            onChange={e => setInp({ ...inp, toolBox: e.currentTarget.value? e.currentTarget.value : undefined}) }
            inputSize="md"
            type="text"
            placeholder="请输入箱号"
          >号
          </SuffixInput>
        </InputGroupLine>
        <div css={{ display: 'flex', justifyContent: 'space-between',flexWrap: 'wrap'}}>
          <AntCheck label='万用表' inp={inp} setInp={setInp} sup={'tool'} item={'multimeter'}/>
          <AntCheck label='钳形电流表' inp={inp} setInp={setInp} sup={'tool'} item={'clampAmmeter'}/>
          <AntCheck label='绝缘电阻测量仪' inp={inp} setInp={setInp} sup={'tool'} item={'resistanceMeter'}/>
          <AntCheck label='转速表' inp={inp} setInp={setInp} sup={'tool'} item={'tachometer'}/>
          <AntCheck label='游标卡尺' inp={inp} setInp={setInp} sup={'tool'} item={'vernierCaliper'}/>
          <AntCheck label='钢直尺' inp={inp} setInp={setInp} sup={'tool'} item={'steelRuler'}/>
          <AntCheck label='卷尺' inp={inp} setInp={setInp} sup={'tool'} item={'tapeMeasure'}/>
          <AntCheck label='塞尺' inp={inp} setInp={setInp} sup={'tool'} item={'feelerGauge'}/>
          <AntCheck label='温湿度计' inp={inp} setInp={setInp} sup={'tool'} item={'temperatureMeter'}/>
          <AntCheck label='测力计' inp={inp} setInp={setInp} sup={'tool'} item={'dynamometer'}/>
          <AntCheck label='放大镜(20倍)' inp={inp} setInp={setInp} sup={'tool'} item={'magnifier'}/>
          <AntCheck label='线锤' inp={inp} setInp={setInp} sup={'tool'} item={'plumbBob'}/>
          <AntCheck label='验电器及常用电工工具' inp={inp} setInp={setInp} sup={'tool'} item={'electroscope'}/>
          <AntCheck label='便携式检验灯' inp={inp} setInp={setInp} sup={'tool'} item={'inspLamp'}/>
          <AntCheck label='限速器测试设备' inp={inp} setInp={setInp} sup={'tool'} item={'speedGovernorTest'}/>
          <AntCheck label='其它' inp={inp} setInp={setInp} sup={'tool'} item={'other'}/>
        </div>
        <hr/>
        <Text  variant="h4"　>
          仪器设备状态确认
        </Text>
        <InputGroupLine  label='在计量周期内'  >
          <SelectHookfork value={ (inp?.measurementCycle) ||''}
                          onChange={e => setInp({ ...inp, measurementCycle: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='功能良好'>
          <SelectHookfork value={ (inp?.goodFunction)  ||''}
                          onChange={e => setInp({ ...inp, goodFunction: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='满足检验要求'  >
          <SelectHookfork value={ (inp?.meetRequirement) ||''}
                          onChange={e => setInp({ ...inp, meetRequirement: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='因为' >
          <SuffixInput
            value={(inp?.cantUsedReason) ||'' }
            onChange={e => setInp({ ...inp, cantUsedReason: e.currentTarget.value? e.currentTarget.value : undefined}) }
            inputSize="md"
            type="text"
          >的原因不能用
          </SuffixInput>
        </InputGroupLine>
      </InspectRecordTitle>
    );
  } );

const InternalItem30: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    props:{ children },  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {dr,leaf,frame,sill,gap,tooth,knife,roller,doorClearance,manPowerGap,doorLock,cabinLock,lengthDoorLock} =par||{};
      return {dr,leaf,frame,sill,gap,tooth,knife,roller,doorClearance,manPowerGap,doorLock,cabinLock,lengthDoorLock};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter});
    const theme = useTheme();
    const [floor, setFloor] = React.useState(null);
    const cAppendix =useCollapse(false,true);
    let  toothUnquf=inp?.dr?.find((f,i)=>{
      return parseFloat(inp?.tooth?.[f])<7;
    });
    console.log("InternalItem30这里,捕获isToothOK=", toothUnquf);

    return (
      <React.Fragment>
        <InspectRecordTitle  control={eos}   label={'层门间隙门锁'}>
          <InspectZoneHeadColumn label={'6 轿门与层门'} projects={['6.3','6.9','6.12']} />
          <InspectRecordTitle  control={cAppendix} label={'附录A 层门间隙、啮合长度'}>
            <div>
              已检查记录:
              {inp?.dr?.map(a=>{
                return ` [ ${a} ]层: ${inp?.leaf?.[a]||''} , ${inp?.frame?.[a]||''} , ${inp?.sill?.[a]||''} , ${inp?.gap?.[a]||''} , ${inp?.tooth?.[a]||''} , ${inp?.knife?.[a]||''} , ${inp?.roller?.[a]||''};`
              }) }
            </div>
            新增检查=>
            <InputGroupLine  label='首先设置当前层站号'>
              <SuffixInput
                autoFocus={true}
                value={floor||''}
                onChange={e => {setFloor( e.currentTarget.value) }}
              >
                <Button onPress={() =>floor&&(inp?.dr?.includes(floor)? null:
                    setInp( (inp?.dr&&{...inp,dr:[...inp?.dr,floor] } )
                      || {...inp,dr:[floor] } )
                )}
                >新增</Button>
              </SuffixInput>
            </InputGroupLine>
            <div css={{ textAlign: 'center' }}>
              <Button css={{ marginTop: theme.spaces.sm }} size="sm"
                      onPress={() => floor&&inp?.dr?.includes(floor) &&(
                        setInp({...inp,dr:[...inp.dr.filter(a => a!==floor )],
                          leaf:{...inp?.leaf,[floor]:undefined}, frame:{...inp?.frame,[floor]:undefined}, sill:{...inp?.sill,[floor]:undefined}
                          , gap:{...inp?.gap,[floor]:undefined}, tooth:{...inp?.tooth,[floor]:undefined}, knife:{...inp?.knife,[floor]:undefined}
                          , roller:{...inp?.roller,[floor]:undefined}
                        })
                      )}
              >刪除该层</Button>
            </div>
            <InputGroupLine label={`层门门扇间间隙(层号 ${floor}):`}>
              <SuffixInput
                autoFocus={true}
                placeholder="请输入测量数"
                value={ (inp?.leaf?.[floor] ) || ''}
                onChange={e => floor&&setInp({ ...inp, leaf:{...inp?.leaf,[floor]:e.currentTarget.value? e.currentTarget.value:undefined} }) }
              >mm</SuffixInput>
            </InputGroupLine>
            <InputGroupLine label={`层门门扇与门套间隙(层号 ${floor}):`}>
              <SuffixInput
                autoFocus={true}
                placeholder="请输入测量数"
                value={ (inp?.frame?.[floor] ) || ''}
                onChange={e => floor&&setInp({ ...inp, frame:{...inp?.frame,[floor]:e.currentTarget.value? e.currentTarget.value:undefined} }) }
              >mm</SuffixInput>
            </InputGroupLine>
            <InputGroupLine label={`层门扇与地坎间隙(层号 ${floor}):`}>
              <SuffixInput
                autoFocus={true}
                placeholder="请输入测量数"
                value={ (inp?.sill?.[floor] ) || ''}
                onChange={e => floor&&setInp({ ...inp, sill:{...inp?.sill,[floor]:e.currentTarget.value? e.currentTarget.value:undefined} }) }
              >mm</SuffixInput>
            </InputGroupLine>
            <InputGroupLine label={`层门扇间施力间隙(层号 ${floor}):`}>
              <SuffixInput
                autoFocus={true}
                placeholder="请输入测量数"
                value={ (inp?.gap?.[floor] ) || ''}
                onChange={e => floor&&setInp({ ...inp, gap:{...inp?.gap,[floor]:e.currentTarget.value? e.currentTarget.value:undefined} }) }
              >mm</SuffixInput>
            </InputGroupLine>
            <InputGroupLine label={`门锁啮合长度(层号 ${floor}):`}>
              <SuffixInput
                autoFocus={true}
                placeholder="请输入测量数"
                value={ (inp?.tooth?.[floor] ) || ''}
                onChange={e => floor&&setInp({ ...inp, tooth:{...inp?.tooth,[floor]:e.currentTarget.value? e.currentTarget.value:undefined} }) }
              >mm</SuffixInput>
            </InputGroupLine>
            <InputGroupLine label={`轿门门刀与层门地坎间距(层号 ${floor}):`}>
              <SuffixInput
                autoFocus={true}
                placeholder="请输入测量数"
                value={ (inp?.knife?.[floor] ) || ''}
                onChange={e => floor&&setInp({ ...inp, knife:{...inp?.knife,[floor]:e.currentTarget.value? e.currentTarget.value:undefined} }) }
              >mm</SuffixInput>
            </InputGroupLine>
            <InputGroupLine label={`门锁滚轮与轿门地坎间距(层号 ${floor}):`}>
              <SuffixInput
                autoFocus={true}
                placeholder="请输入测量数"
                value={ (inp?.roller?.[floor] ) || ''}
                onChange={e => floor&&setInp({ ...inp, roller:{...inp?.roller,[floor]:e.currentTarget.value? e.currentTarget.value:undefined} }) }
              >mm</SuffixInput>
            </InputGroupLine>
          </InspectRecordTitle>

            <InspectItemHeadColumn  level={'C'} label={'6.3 门间隙'}  >
              <IndentationLayText title={'门关闭后,应当符合以下要求:'}>
                (1) 门扇之间及门扇与立柱、门楣和地坎之间的间的间隙,对于乘客电梯不大于6mm;对于载货电梯不大于8mm,使用过程中由于磨损,允许达10mm;<br />
                (2) 在水平移动门和折叠门主动门扇的开启方向,以150N的人力施加在一个最不利的点，前条所述的间
                隙允许增大，但对于旁开门不大于30mm，对于中分门其总和不大于45mm
              </IndentationLayText>
              <Table css={{borderCollapse:'collapse'}}>
                <TableBody>
                  <TableRow >
                    <CCell>层</CCell>
                    <CCell>门扇隙</CCell>
                    <CCell>门套隙</CCell>
                    <CCell>地坎隙</CCell>
                    <CCell>施力隙</CCell>
                  </TableRow>
                  {inp?.dr?.map(a=>{
                    return <TableRow>
                      <CCell>{a}</CCell>
                      <CCell>{inp?.leaf?.[a]||''}</CCell>
                      <CCell>{inp?.frame?.[a]||''}</CCell>
                      <CCell>{inp?.sill?.[a]||''}</CCell>
                      <CCell>{inp?.gap?.[a]||''}</CCell>
                    </TableRow>
                  }) }
                </TableBody>
              </Table>
            </InspectItemHeadColumn>
            <InputGroupLine  label='(1)门扇间隙'>
              <SelectHookfork value={ inp?.doorClearance ||''}
                              onChange={e => setInp({ ...inp, doorClearance: e.currentTarget.value||undefined}) }
              />
            </InputGroupLine>
            <InputGroupLine  label='(2)人力施加在最不利点时间隙'>
              <SelectHookfork value={ inp?.manPowerGap ||''}
                              onChange={e => setInp({ ...inp, manPowerGap: e.currentTarget.value||undefined}) }
              />
            </InputGroupLine>

            <InspectItemHeadColumn  level={'B'} label={'6.9 门的锁紧'}  >
              <IndentationLayText title={'(1)每个层门都应当设有符合下述要求的门锁装置:'}>
                ②锁紧动作由重力、永久磁铁或者弹簧来产生和保持，即使永久磁铁或者弹簧失效，重力亦不能导致开锁；<br/>
                ③轿厢在锁紧元件啮合不小于7mm时才能启动；<br/>
                ④门的锁紧由一个电气安全装置来验证，该装置由锁紧元件强制操作而没有任何中间机构，并且能够防止误动作；
              </IndentationLayText>
              (2)如果轿门采用了门锁装置,该装置也应当符合本条(1)的要求。
            </InspectItemHeadColumn>
          <div>
            已检门锁啮合长度:
            {inp?.dr?.map(a=>{
              return ` ${a}层:${inp?.tooth?.[a]||''};`
             }) }
          </div>
          <InputGroupLine  label='(1)③门锁啮合长度'>
            <SelectHookfork value={toothUnquf? '×': inp?.dr?.length>=1? '√':''} disabled/>
          </InputGroupLine>
            <InputGroupLine  label='(1)层门门锁装置'>
              <SelectHookfork value={ inp?.doorLock ||''}
                              onChange={e => setInp({ ...inp, doorLock: e.currentTarget.value||undefined}) }
              />
            </InputGroupLine>
            <InputGroupLine  label='(2)轿门门锁装置'>
              <SelectHookfork value={ inp?.cabinLock ||''}
                              onChange={e => setInp({ ...inp, cabinLock: e.currentTarget.value||undefined}) }
              />
            </InputGroupLine>

          <InspectItemHeadColumn  level={'C'} label={'6.12 门的锁紧'}  >
            <IndentationLayText title={'(1)每个层门都应当设有符合下述要求的门锁装置:'}>
              ②锁紧动作由重力、永久磁铁或者弹簧来产生和保持，即使永久磁铁或者弹簧失效，重力亦不能导致开锁；<br/>
              ③轿厢在锁紧元件啮合不小于7mm时才能启动；<br/>
              ④门的锁紧由一个电气安全装置来验证，该装置由锁紧元件强制操作而没有任何中间机构，并且能够防止误动作；
            </IndentationLayText>
            (2)如果轿门采用了门锁装置,该装置也应当符合本条(1)的要求。
          </InspectItemHeadColumn>
          <div>
            已检门锁啮合长度:
            {inp?.dr?.map(a=>{
              return ` ${a}层:${inp?.tooth?.[a]||''};`
            }) }
          </div>
          <InputGroupLine  label='(1)③门锁啮合长度'>
            <SelectHookfork value={toothUnquf? '×': inp?.dr?.length>=1? '√':''} disabled/>
          </InputGroupLine>
          <InputGroupLine  label='(1)层门门锁装置'>
            <SelectHookfork value={ inp?.doorLock ||''}
                            onChange={e => setInp({ ...inp, doorLock: e.currentTarget.value||undefined}) }
            />
          </InputGroupLine>
          <InputGroupLine  label='(2)轿门门锁装置'>
            <SelectHookfork value={ inp?.cabinLock ||''}
                            onChange={e => setInp({ ...inp, cabinLock: e.currentTarget.value||undefined}) }
            />
          </InputGroupLine>
        </InspectRecordTitle>
      </React.Fragment>
    );
  } );

const InternalItem31: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    props:{ children },  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {passengerMax,cargoMax,unqualifiedLayer1,middleDoorMax,sideDoorMax,unqualifiedLayer2} =par||{};
      return {passengerMax,cargoMax,unqualifiedLayer1,middleDoorMax,sideDoorMax,unqualifiedLayer2};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter});

    return (
      <InspectRecordTitle  control={eos}   label={'6.456/78/1011'}>
        <InspectRecordHeadColumn  level={'C'}  bigLabel={'6 轿门与层门'}  label={'6.3 门间隙'}  >
          <IndentationLayText title={'门关闭后,应当符合以下要求:'}>
            (1) 门扇之间及门扇与立柱、门楣和地坎之间的间的间隙,对于乘客电梯不大于6mm;对于载货电梯不大于8mm,使用过程中由于磨损,允许达10mm;<br />
            (2) 在水平移动门和折叠门主动门扇的开启方向,以150N的人力施加在一个最不利的点，前条所述的间
            隙允许增大，但对于旁开门不大于30mm，对于中分门其总和不大于45mm
          </IndentationLayText>
        </InspectRecordHeadColumn>
        <InputGroupLine  label='客梯(最大值)' >
          <SuffixInput
            value={(inp?.passengerMax) ||''}
            onChange={e => {setInp({ ...inp, passengerMax: e.currentTarget.value? e.currentTarget.value : undefined});  }}
            inputSize="md"
            type="text"
            placeholder="请输入测量数"
          >mm</SuffixInput>
        </InputGroupLine>
        <InputGroupLine label={'货梯(最大值)'}>
          <SuffixInput
            autoFocus={true}
            placeholder="请输入测量数"
            value={(inp?.cargoMax) ||''}
            onChange={e => {setInp({ ...inp, cargoMax: e.currentTarget.value? e.currentTarget.value : undefined});  }}
          >mm</SuffixInput>
        </InputGroupLine>
        <InputGroupLine label={'不合格层号'}>
          <Input
            autoFocus={true}
            placeholder="请以,号分割层号"
            value={(inp?.unqualifiedLayer1)  ||''}
            onChange={e => setInp({ ...inp, unqualifiedLayer1: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine label={'中分门间隙(最大值)'}>
          <SuffixInput
            autoFocus={true}
            placeholder="请输入测量数"
            value={(inp?.middleDoorMax) ||'' }
            onChange={e => setInp({ ...inp, middleDoorMax: e.currentTarget.value? e.currentTarget.value : undefined}) }
          >mm</SuffixInput>
        </InputGroupLine>
        <InputGroupLine label={'旁开门间隙(最大值)'}>
          <SuffixInput
            autoFocus={true}
            placeholder="请输入测量数"
            value={(inp?.sideDoorMax) ||'' }
            onChange={e => setInp({ ...inp, sideDoorMax: e.currentTarget.value? e.currentTarget.value : undefined}) }
          >mm</SuffixInput>
        </InputGroupLine>
        <InputGroupLine label={'不合格层号'}>
          <Input
            autoFocus={true}
            placeholder="请以,号分割层号"
            value={(inp?.unqualifiedLayer2) ||''}
            onChange={e => setInp({ ...inp, unqualifiedLayer2: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
      </InspectRecordTitle>
    );
  } );

const InternalItem12: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    props:{ children },  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {witnessConfirm,NominalVoltage,insulResistance} =par||{};
      return {witnessConfirm,NominalVoltage,insulResistance};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter});

    return (
      <InspectRecordTitle  control={eos}   label={'检验项目 12'}>
        <InspectRecordHeadColumn  level={'C'}  bigLabel={'2 机房(机器设备间)及相关设备'}  label={'2.13 动力电路'}  >
          动力电路、照明电路和电气安全装置电路的绝缘电阻应当符合下述要求:<br />
          <Table css={{borderCollapse:'collapse'}}>
            <TableBody>
              <TableRow >
                <CCell >标称电压/V</CCell>
                <CCell >测试电压 (直流)/V  </CCell>
                <CCell>绝缘电阻/MΩ</CCell>
              </TableRow>
              <TableRow >
                <CCell>安全电压</CCell>
                <CCell>250</CCell>
                <CCell>≥0.25</CCell>
              </TableRow>
              <TableRow>
                <CCell>≤500</CCell>
                <CCell>500</CCell><CCell>≥0.50</CCell>
              </TableRow>
              <TableRow>
                <CCell>＞500</CCell>
                <CCell>1000</CCell><CCell>≥1.00</CCell>
              </TableRow>
            </TableBody>
          </Table>
        </InspectRecordHeadColumn>
        <InputGroupLine  label='二选一，1:　见证确认'  >
          <Select inputSize="md" css={{minWidth:'140px',fontSize:'2rem',padding:'0 1rem'}} divStyle={css`max-width:240px;`}
                  value={ inp?.witnessConfirm ||''}
                  onChange={e => setInp({ ...inp, witnessConfirm: e.currentTarget.value? e.currentTarget.value : undefined}) }
          >
            <option></option>
            <option>／</option>
            <option>√</option>
            <option>×</option>
          </Select>
        </InputGroupLine>
        <InputGroupLine  label='２： 实测：标称电压/V'   labelTextStyle={css`font-size:1.1rem`} >
          <Select inputSize="md" css={{minWidth:'140px',fontSize:'1.3rem',padding:'0 0.5rem'}} divStyle={css`max-width:240px;`}
                  value={ inp?.NominalVoltage ||''}
                  onChange={e => setInp({ ...inp, NominalVoltage: e.currentTarget.value? e.currentTarget.value : undefined}) }
          >
            <option></option>
            <option>安全电压</option>
            <option>≤500</option>
            <option>＞500</option>
          </Select>
        </InputGroupLine>
        <InputGroupLine  label='绝缘电阻' >
          <SuffixInput
            value={inp?.insulResistance ||''}
            onChange={e => setInp({ ...inp, insulResistance: e.currentTarget.value? e.currentTarget.value : undefined}) }
            inputSize="md"
            type="text"
            placeholder="请输入测量数"
          >MΩ
          </SuffixInput>
        </InputGroupLine>
      </InspectRecordTitle>
    );
  } );

const InternalItem27: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    props:{ children },  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {cageDistortion,brokenWires,diameterSteelWire,seriouslyRusted,otherSuspension} =par||{};
      return {cageDistortion,brokenWires,diameterSteelWire,seriouslyRusted,otherSuspension};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter});

    return (
      <InspectRecordTitle  control={eos}   label={'检验项目 27'}>
        <InspectRecordHeadColumn  level={'C'}  bigLabel={'5 悬挂装置 、 补偿装置及旋转部件防护'}  label={'5.1 悬挂装置、补偿装置的磨损、断丝、变形等情况'}>
          出现下列情况之一时，悬挂钢丝绳和补偿钢丝绳应当报废:
        </InspectRecordHeadColumn>
        <InputGroupLine  label='①出现笼状畸变、绳股挤出、扭结、部分压扁、弯折'>
          <SelectHookfork value={ inp?.cageDistortion  ||''}
                          onChange={e => setInp({ ...inp, cageDistortion: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        ②一个捻距内出现的断丝数大于下表列出的数值时：
        <Table minWidth={'140px'} css={{borderCollapse:'collapse'}}>
          <TableBody>
            <TableRow>
              <CCell rowSpan={2}>断丝的形式</CCell>
              <CCell colSpan={3}>钢丝绳的类型</CCell>
            </TableRow>
            <TableRow>
              <CCell>6×19</CCell>
              <CCell>8×9</CCell>
              <CCell>9×19</CCell>
            </TableRow>
            <TableRow>
              <CCell>均布在外层绳股上</CCell>
              <CCell>24</CCell><CCell>30</CCell><CCell>34</CCell>
            </TableRow>
            <TableRow>
              <CCell>集中在一或者两根外层绳股上</CCell>
              <CCell>24</CCell><CCell>30</CCell><CCell>34</CCell>
            </TableRow>
            <TableRow>
              <CCell>一根外绳股上相邻的断丝</CCell>
              <CCell>4</CCell><CCell>4</CCell><CCell>4</CCell>
            </TableRow>
            <TableRow>
              <CCell>股谷（缝）断丝 </CCell>
              <CCell>2</CCell><CCell>3</CCell><CCell>6</CCell>
            </TableRow>
            <TableRow>
              <Cell colSpan={4}>注：上述断丝数参考长度为一个捻距，约为6d(d表示钢丝绳的公称直径，mm）</Cell>
            </TableRow>
          </TableBody>
        </Table>
        <InputGroupLine  label='②断丝查验结果'>
          <SelectHookfork value={ inp?.brokenWires ||''}
                          onChange={e => setInp({ ...inp, brokenWires: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='③钢丝绳直径小于其公称直径的90%'>
          <SelectHookfork value={ inp?.diameterSteelWire ||''}
                          onChange={e => setInp({ ...inp, diameterSteelWire: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='④钢丝绳严重锈蚀，铁锈填满绳股间隙'>
          <SelectHookfork value={ inp?.seriouslyRusted  ||''}
                          onChange={e => setInp({ ...inp, seriouslyRusted: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='⑤采用其他类型悬挂装置的，悬挂装置的磨损、变形等不得超过制造单位设定的报废指标'>
          <SelectHookfork value={ inp?.otherSuspension ||''}
                          onChange={e => setInp({ ...inp, otherSuspension: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
      </InspectRecordTitle>
    );
  } );

const InternalItem8: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    props:{ children },  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {emergencyElectric} =par||{};
      return {emergencyElectric};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter});

    return (
      <InspectRecordTitle  control={eos}   label={'检验项目 2.10'}>
        <InspectRecordHeadColumn  level={'B'}  bigLabel={'2 机房(机器设备间)及相关设备'}
                                  label={'2.10 控制柜、紧急操作和动态测试装置'}   tinyLabel={'(4) 紧急电动运行装置'} >
          <IndentationLayText >
            ① 依靠持续揿压按钮来控制轿厢运行，此按钮有防止误操作的保护，按钮上或其近旁标出相应的运行方向；<br/>
            ② 一旦进入检修运行，紧急电动运行装置控制轿厢运行的功能由检修控制装置所取代； <br/>
            ③ 进行紧急电动运行操作时，易于观察到轿厢是否在开锁区。
          </IndentationLayText>
        </InspectRecordHeadColumn>
        <InputGroupLine  label='符合与否'   labelTextStyle={css`font-size:1.5rem`} >
          <Select inputSize="md" css={{minWidth:'140px',fontSize:'2rem',padding:'0 1rem'}} divStyle={css`max-width:240px;`}
                  value={ inp?.emergencyElectric  ||''}
                  onChange={e => setInp({ ...inp, emergencyElectric: e.currentTarget.value? e.currentTarget.value : undefined}) }
          >
            <option></option>
            <option>／</option>
            <option>√</option>
            <option>×</option>
            <option>▽</option>
          </Select>
        </InputGroupLine>
      </InspectRecordTitle>
    );
  } );

const InternalItem6: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    props:{ children },  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {phaseFailure,emergencyEOperation,convenientAccess,directlyObserve,permanentLighting,stopSwitch,bypassDoor,loopDetection,brakeFailure,rescueDevice} =par||{};
      return {phaseFailure,emergencyEOperation,convenientAccess,directlyObserve,permanentLighting,stopSwitch,bypassDoor,loopDetection,brakeFailure,rescueDevice};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter});

    return (
      <InspectRecordTitle  control={eos}   label={'控制柜2.8'}>
        <InspectRecordHeadColumn  level={'B'}  bigLabel={'2 机器设备间及相关设备'}  label={'2.8 控制柜、 紧急操作和动态测试装置'}>
        </InspectRecordHeadColumn>
        <InputGroupLine  label='(2)断相、错相保护功能有效；电梯运行与相序无关时，可以不设错相保护。'>
          <SelectHookfork value={ inp?.phaseFailure ||''}
                          onChange={e => setInp({ ...inp, phaseFailure: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        <IndentationLayText title={'(4)紧急电动运行装置应当符合以下要求：'}>
          ①依靠持续揿压按钮来控制轿厢运行，此按钮有防止误操作的保护，按钮上或其近旁标出 相应的运行方向<br/>
          ②一旦进入检修运行，紧急电动运行装置控制轿厢运行的功能由检修控制装置所取代；<br/>
          ③进行紧急电动运行操作时，易于观察到轿厢是否在开锁区。
        </IndentationLayText>
        <InputGroupLine  label='(4)紧急电动运行装置查验结果'>
          <SelectHookfork value={ inp?.emergencyEOperation ||''}
                          onChange={e => setInp({ ...inp, emergencyEOperation: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        <IndentationLayText title={'(6)层门和轿门旁路装置应当符合以下要求：'}>
          ①在层门和轿门旁路装置上或者其附近标明“旁路”字样,并且标明旁路装置的“旁路”状态或者“关”状态;<br/>
          ②旁路时取消正常运行(包括动力操作的自动门的任何运行);只有在检修运行或者紧急电动运行状态下,轿厢才能够运行;运行期间,轿厢上的听觉信号和轿底的闪烁灯起作用;<br/>
          ③能够旁路层门关闭触点、层门门锁触点、轿门关闭触点、轿门门锁触点;不能同时旁路层门和轿门的触点;对于手动层门,不能同时旁路层门关闭触点和层门门锁触点;<br/>
          ④提供独立的监控信号证实轿门处于关闭位置。
        </IndentationLayText>
        <InputGroupLine  label='(6)层门和轿门旁路装置查验结果'>
          <SelectHookfork value={ inp?.bypassDoor ||''}
                          onChange={e => setInp({ ...inp, bypassDoor: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        (7)应当具有门回路检测功能,当轿厢在开锁区域内、轿门开启并且层门门锁释放时,监测检查
        轿门关闭位置的电气安全装置、检查层门门锁锁紧位置的电气安全装置和轿门监控信号的正确动
        作;如果监测到上述装置的故障,能够防止电梯的正常运行。
        <InputGroupLine  label='(7)应当具有门回路检测功能'>
          <SelectHookfork value={ inp?.loopDetection  ||''}
                          onChange={e => setInp({ ...inp, loopDetection: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        (8)应当具有制动器故障保护功能,当监测到制动器的提起(或者释放)失效时,能够防止电梯的正常启动。
        <InputGroupLine  label='(8)应当具有制动器故障保护'>
          <SelectHookfork value={ inp?.brakeFailure ||''}
                          onChange={e => setInp({ ...inp, brakeFailure: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        <IndentationLayText title={'(9)自动救援操作装置(如果有)应该符合以下要求:'}>
          ①设有铭牌,标明制造单位名称、产品型号、产品编号、主要技术参数,加装的自动救援操作装置的铭牌和该装置的产品质量证明文件相符;<br/>
          ②在外电网断电至少等待3s后自动投入救援运行,电梯自动平层并且开门;<br/>
          ③当电梯处于检修运行、紧急电动运行、电气安全装置动作或者主开关断开时,不得投入救援运行;<br/>
          ④设有一个非自动复位的开关,当该开关处于关闭状态时,该装置不能启动救援运行。
        </IndentationLayText>
        <InputGroupLine  label='(9)自动救援操作装置(如果有)'>
          <SelectHookfork value={ inp?.rescueDevice  ||''}
                          onChange={e => setInp({ ...inp, rescueDevice: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
      </InspectRecordTitle>
    );
  } );

const InternalItem2t4: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    props:{ children },  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {emergencyElectric} =par||{};
      return {emergencyElectric};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter});

    return (
      <InspectRecordTitle  control={eos}   label={'检验项目 2.1,5,6'}>
        <InspectRecordHeadColumn  level={'C'}  bigLabel={'2 机房(机器设备间)及相关设备'}
                                  label={'2.1 通道与通道门'}   tinyLabel={'2.1'} >
          <IndentationLayText >
            ① 依靠持续揿压按钮来控制轿厢运行，此按钮有防止误操作的保护，按钮上或其近旁标出相应的运行方向；<br/>
            ② 一旦进入检修运行，紧急电动运行装置控制轿厢运行的功能由检修控制装置所取代； <br/>
            ③ 进行紧急电动运行操作时，易于观察到轿厢是否在开锁区。
          </IndentationLayText>
        </InspectRecordHeadColumn>
        <InputGroupLine  label='符合与否'   labelTextStyle={css`font-size:1.5rem`} >
          <Select inputSize="md" css={{minWidth:'140px',fontSize:'2rem',padding:'0 1rem'}} divStyle={css`max-width:240px;`}
                  value={ inp?.emergencyElectric  ||''}
                  onChange={e => setInp({ ...inp, emergencyElectric: e.currentTarget.value? e.currentTarget.value : undefined}) }
          >
            <option></option>
            <option>／</option>
            <option>√</option>
            <option>×</option>
            <option>▽</option>
          </Select>
        </InputGroupLine>
      </InspectRecordTitle>
    );
  } );



const projectList = [
  createItem(1, <InternalItem1/>),
  createItem(2, <InternalItem2t4/>),
  createItem(6, <InternalItem6/>),
  createItem(8, <InternalItem8/>),
  createItem(12, <InternalItem12/>),
  createItem(27, <InternalItem27/>),
  createItem(30, <InternalItem30/>),
  createItem(31, <InternalItem31/>),
  createItem(50, <InternalItem50/>),
];
