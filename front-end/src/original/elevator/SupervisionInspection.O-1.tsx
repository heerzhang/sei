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
  Select,
} from "customize-easy-ui-component";
import {Table, TableBody,  TableRow, CCell} from "../../comp/TableExt";
import {
  AntCheck,
  IndentationLayText,
  InspectRecordHeadColumn,
  InspectRecordTitle,
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

const InternalItem37: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    props:{ children },  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {dr,dn1,dn2} =par||{};
      return {dr,dn1,dn2};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter});
    const theme = useTheme();
    const [floor, setFloor] = React.useState(null);

    return (
      <React.Fragment>
        <InspectRecordTitle  control={eos}   label={'检验项目 6.9'}>
          <InspectRecordHeadColumn  level={'B'}  bigLabel={'6 轿门与层门'}  label={'6.9 门的锁紧'}  >
            <IndentationLayText title={'(1)每个层门都应当设有符合下述要求的门锁装置:'}>
              ①锁紧动作由重力、永久磁铁或者弹簧来产生和保持,即使永久磁铁或者弹簧失效,重力亦不能导致开锁<br/>
              ②轿厢在锁紧元件啮合不小于7mm时才能启动;<br/>
              ③门的锁紧应当由一个电气安全装置来验证,该装置由锁紧元件强制操作而没有任何中间机构,并且能够防止误动作;
            </IndentationLayText>
            (2)如果轿门采用了门锁装置,该装置也应当符合本条(1)的要求。
          </InspectRecordHeadColumn>
          <div>
            已检查记录:
            {inp?.dr?.map(a=>{
              return ` [ ${a} ]层: ${inp?.dn1?.[a]||''} , ${inp?.dn2?.[a]||''};`
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
                  setInp( (inp?.dr&&{...inp,dr:[...inp?.dr,floor],dn1:{...inp?.dn1,[floor]:undefined},dn2:{...inp?.dn2,[floor]:undefined} } )
                    || {...inp,dr:[floor],dn1:{...inp?.dn1,[floor]:undefined},dn2:{...inp?.dn2,[floor]:undefined} } )
              )}
              >设定</Button>
            </SuffixInput>
          </InputGroupLine>
          <div css={{ textAlign: 'center' }}>
            <Button css={{ marginTop: theme.spaces.sm }} size="sm"
                    onPress={() => floor&&inp?.dr?.includes(floor) &&(
                      setInp({...inp,dr:[...inp.dr.filter(a => a!==floor )],
                        dn1:{...inp?.dn1,[floor]:undefined}, dn2:{...inp?.dn2,[floor]:undefined}
                      })
                    )}
            >刪除该层站</Button>
          </div>
          <InputGroupLine label={`(1)层门门锁(层站号 ${floor}):`}>
            <SelectHookfork value={ (inp?.dn1?.[floor] ) || ''}
                            onChange={e => floor&&setInp({ ...inp, dn1:{...inp?.dn1,[floor]:e.currentTarget.value? e.currentTarget.value:undefined} }) }
            />
          </InputGroupLine>
          <InputGroupLine label={`(2)轿门装置(层站号 ${floor}):`}>
            <SelectHookfork value={ (inp?.dn2?.[floor] ) || ''}
                            onChange={e => floor&&setInp({ ...inp, dn2:{...inp?.dn2,[floor]:e.currentTarget.value? e.currentTarget.value:undefined} }) }
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
      <InspectRecordTitle  control={eos}   label={'检验项目 31'}>
        <InspectRecordHeadColumn  level={'C'}  bigLabel={'6 轿门与层门'}  label={'6.2 门间隙'}  >
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



const projectList = [
  createItem(8, <InternalItem1/>),
  createItem(5, <InternalItem8/>),
  createItem(2, <InternalItem12/>),
  createItem(4, <InternalItem31/>),
  createItem(3, <InternalItem37/>),
  createItem(1, <InternalItem50/>),
];
