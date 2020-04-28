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
 TestRenderLoad,
} from "customize-easy-ui-component";
import {Table, TableBody,  TableRow, Cell, CCell} from "../src/comp/TableExt";

import {
  AntCheck,
  IndentationLayText,
  InspectRecordHeadColumn,
  InspectRecordTitle,
  SelectHookfork, TemplateViewProps,
  useItemControlAs, useProjectListAs
} from "../src/original/comp/base";
import {  InternalItemHandResult, InternalItemProps } from "../src/original/comp/base";
import { mergeSubitemRefs } from "../src/utils/tools";
import orderBy from "lodash.orderby";


let   id = 0;
const genId = () => ++id;
function createItem( order:  number, content: React.ReactNode) {
      return {id:genId(), order, content};
}

const TemplateView: React.RefForwardingComponent<InternalItemHandResult,TemplateViewProps>=
  React.forwardRef((
    { inp,   showAll = false  },  ref
  ) => {
  const itBinds=useProjectListAs({count: projectList.length});
  const outCome=mergeSubitemRefs( ...itBinds.map(a=>a.ref) );
   React.useImperativeHandle( ref,() => ({ inp: outCome }), [outCome] );
  return (
    <React.Fragment>
      {
          (showAll ? projectList : orderBy(projectList,['order'],['asc']) )
                      .map((each, i) => {
                        return  React.cloneElement(each.content as React.ReactElement<any>, {
                                          ref: itBinds[i].ref,
                                          key: each.order,
                                          par: inp,
                                          show: showAll
                                        });
                               })
      }
    </React.Fragment>
    );
  } );

export  const  myTemplate= <TemplateView/>;


const InternalItem1=
  React.forwardRef((
    { par,   show = false  },  ref
  ) => {
    const {registration,safetyFiles,ruleRegulation,contractSigned,operatorCertificate} =par||{};
    const itemVal={registration,safetyFiles,ruleRegulation,contractSigned,operatorCertificate};
    const {eos, setInp, inp} =useItemControlAs({ref,show,par,itemVal});

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
          <SelectHookfork value={ inp&&inp.registration }
                          onChange={e => setInp({ ...inp, registration: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='(2)安全技术档案应保存完好，至少包括： '>
          <SelectHookfork value={ inp&&inp.safetyFiles }
                          onChange={e => setInp({ ...inp, safetyFiles: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='(3)以岗位责任制为核心的电梯运行管理规章制度，包括： '>
          <SelectHookfork value={ inp&&inp.ruleRegulation }
                          onChange={e => setInp({ ...inp, ruleRegulation: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='(4)与取得相应资格单位签订的日常维护保养合同； '>
          <SelectHookfork value={ inp&&inp.contractSigned }
                          onChange={e => setInp({ ...inp, contractSigned: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='(5)按照规定配备的电梯安全管理和作业人员的特种设备作业人员证。 '>
          <SelectHookfork value={ inp&&inp.operatorCertificate }
                          onChange={e => setInp({ ...inp, operatorCertificate: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
      </InspectRecordTitle>
    );
  } );


const InternalItem50=
  React.forwardRef((
    { par,   show = false  },  ref
  ) => {
    const {tool,toolBox,measurementCycle,goodFunction,meetRequirement,cantUsedReason} =par||{};
    const itemVal={tool,toolBox,measurementCycle,goodFunction,meetRequirement,cantUsedReason};
    const {eos, setInp, inp} =useItemControlAs({ref,show,par,itemVal});

    return (
      <InspectRecordTitle  control={eos}   label={'检验主要仪器设备'}>
        <InputGroupLine  label='本次检验使用的工具箱为' >
          <SuffixInput
            value={inp&&inp.toolBox  }
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
          <SelectHookfork value={ inp&&inp.measurementCycle  }
                          onChange={e => setInp({ ...inp, measurementCycle: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='功能良好'>
          <SelectHookfork value={ inp&&inp.goodFunction  }
                          onChange={e => setInp({ ...inp, goodFunction: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='满足检验要求'  >
          <SelectHookfork value={ inp&&inp.meetRequirement }
                          onChange={e => setInp({ ...inp, meetRequirement: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='因为' >
          <SuffixInput
            value={inp&&inp.cantUsedReason  }
            onChange={e => setInp({ ...inp, cantUsedReason: e.currentTarget.value? e.currentTarget.value : undefined}) }
            inputSize="md"
            type="text"
          >的原因不能用
          </SuffixInput>
        </InputGroupLine>
      </InspectRecordTitle>
    );
  } );


const InternalItem37=
  React.forwardRef((
    { par,   show = false  },  ref
  ) => {
    const {dr,dn1,dn2} =par||{};
    const itemVal={dr,dn1,dn2};
    //依赖[itemVal]每一次都会变，就算收起来render也会变的。  useItemControlAs()也是每次都执行的！。
    const {eos, setInp, inp} =useItemControlAs({ref,show,par,itemVal});
    const theme = useTheme();
    const [floor, setFloor] = React.useState(null);
    //测试的；高耗能子组件的优化例子  [依赖项]
    const testRenderLoad= React.useMemo(() =><TestRenderLoad/>,[ ] );

    React.useEffect(() => {
      console.log("InternalItem37 竟然变动！！ TestRenderLoad", testRenderLoad);
    }, [testRenderLoad] );

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
          {inp&&inp.dr&&inp.dr.map(a=>{
            return ` [ ${a} ]层: ${inp.dn1[a]||''} , ${inp.dn2[a]||''};`
          }) }
        </div>
        新增检查=>
        <InputGroupLine  label='首先设置当前层站号'>
          <SuffixInput
            autoFocus={true}
            value={floor||''}
            onChange={e => {setFloor( e.currentTarget.value) }}
          >
            <Button onPress={() =>floor&&(inp&&inp.dr&&inp.dr.includes(floor)? null:
                setInp( (inp&&inp.dr&&{...inp,dr:[...inp&&inp.dr,floor],dn1:{...inp&&inp.dn1,[floor]:undefined},dn2:{...inp&&inp.dn2,[floor]:undefined} } )
                  || {...inp,dr:[floor],dn1:{...inp&&inp.dn1,[floor]:undefined},dn2:{...inp&&inp.dn2,[floor]:undefined} } )
            )}
            >设定</Button>
          </SuffixInput>
        </InputGroupLine>
        <div css={{ textAlign: 'center' }}>
          <Button css={{ marginTop: theme.spaces.sm }} size="sm"
                  onPress={() => floor&&inp&&inp.dr&&inp.dr.includes(floor) &&(
                    setInp({...inp,dr:[...inp.dr.filter(a => a!==floor )],
                      dn1:{...inp&&inp.dn1,[floor]:undefined}, dn2:{...inp&&inp.dn2,[floor]:undefined}
                    })
                  )}
          >刪除该层站</Button>
        </div>
        <InputGroupLine label={`(1)层门门锁(层站号 ${floor}):`}>
          <SelectHookfork value={ (inp&&inp.dn1&&inp.dn1[floor] ) || ''}
                          onChange={e => floor&&setInp({ ...inp, dn1:{...inp&&inp.dn1,[floor]:e.currentTarget.value? e.currentTarget.value:undefined} }) }
          />
        </InputGroupLine>
        <InputGroupLine label={`(2)轿门装置(层站号 ${floor}):`}>
          <SelectHookfork value={ (inp&&inp.dn2&&inp.dn2[floor] ) || ''}
                          onChange={e => floor&&setInp({ ...inp, dn2:{...inp&&inp.dn2,[floor]:e.currentTarget.value? e.currentTarget.value:undefined} }) }
          />
        </InputGroupLine>
          {testRenderLoad}
      </InspectRecordTitle>
      </React.Fragment>
    );
  } );

const InternalItem31=
  React.forwardRef((
    { par,   show = false  },  ref
  ) => {
    const {passengerMax,cargoMax,unqualifiedLayer1,middleDoorMax,sideDoorMax,unqualifiedLayer2} =par||{};
    const itemVal={passengerMax,cargoMax,unqualifiedLayer1,middleDoorMax,sideDoorMax,unqualifiedLayer2};
    const {eos, setInp, inp} =useItemControlAs({ref,show,par,itemVal});

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
            value={inp&&inp.passengerMax }
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
            value={inp&&inp.cargoMax }
            onChange={e => {setInp({ ...inp, cargoMax: e.currentTarget.value? e.currentTarget.value : undefined});  }}
          >mm</SuffixInput>
        </InputGroupLine>
        <InputGroupLine label={'不合格层号'}>
          <Input
            autoFocus={true}
            placeholder="请以,号分割层号"
            value={inp&&inp.unqualifiedLayer1  }
            onChange={e => setInp({ ...inp, unqualifiedLayer1: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine label={'中分门间隙(最大值)'}>
          <SuffixInput
            autoFocus={true}
            placeholder="请输入测量数"
            value={inp&&inp.middleDoorMax  }
            onChange={e => setInp({ ...inp, middleDoorMax: e.currentTarget.value? e.currentTarget.value : undefined}) }
          >mm</SuffixInput>
        </InputGroupLine>
        <InputGroupLine label={'旁开门间隙(最大值)'}>
          <SuffixInput
            autoFocus={true}
            placeholder="请输入测量数"
            value={inp&&inp.sideDoorMax  }
            onChange={e => setInp({ ...inp, sideDoorMax: e.currentTarget.value? e.currentTarget.value : undefined}) }
          >mm</SuffixInput>
        </InputGroupLine>
        <InputGroupLine label={'不合格层号'}>
          <Input
            autoFocus={true}
            placeholder="请以,号分割层号"
            value={inp&&inp.unqualifiedLayer2  }
            onChange={e => setInp({ ...inp, unqualifiedLayer2: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
      </InspectRecordTitle>
    );
  } );


const InternalItem12=
  React.forwardRef((
    { par,   show = false  },  ref
  ) => {
    const {witnessConfirm,NominalVoltage,insulResistance} =par||{};
    const itemVal={witnessConfirm,NominalVoltage,insulResistance};
    const {eos, setInp, inp} =useItemControlAs({ref,show,par,itemVal});

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
                  value={ inp&&inp.witnessConfirm  }
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
                  value={inp&&inp.NominalVoltage }
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
            value={inp&&inp.insulResistance  }
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


const InternalItem27=
  React.forwardRef((
    { par,   show = false  },  ref
  ) => {
    const {cageDistortion,brokenWires,diameterSteelWire,seriouslyRusted,otherSuspension} =par||{};
    const itemVal={cageDistortion,brokenWires,diameterSteelWire,seriouslyRusted,otherSuspension};
    const {eos, setInp, inp} =useItemControlAs({ref,show,par,itemVal});

    return (
      <InspectRecordTitle  control={eos}   label={'检验项目 27'}>
        <InspectRecordHeadColumn  level={'C'}  bigLabel={'5 悬挂装置 、 补偿装置及旋转部件防护'}  label={'5.1 悬挂装置、补偿装置的磨损、断丝、变形等情况'}>
          出现下列情况之一时，悬挂钢丝绳和补偿钢丝绳应当报废:
        </InspectRecordHeadColumn>
        <InputGroupLine  label='①出现笼状畸变、绳股挤出、扭结、部分压扁、弯折'>
          <SelectHookfork value={ inp&&inp.cageDistortion  }
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
          <SelectHookfork value={ inp&&inp.brokenWires }
                          onChange={e => setInp({ ...inp, brokenWires: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='③钢丝绳直径小于其公称直径的90%'>
          <SelectHookfork value={ inp&&inp.diameterSteelWire  }
                          onChange={e => setInp({ ...inp, diameterSteelWire: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='④钢丝绳严重锈蚀，铁锈填满绳股间隙'>
          <SelectHookfork value={ inp&&inp.seriouslyRusted  }
                          onChange={e => setInp({ ...inp, seriouslyRusted: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='⑤采用其他类型悬挂装置的，悬挂装置的磨损、变形等不得超过制造单位设定的报废指标'>
          <SelectHookfork value={ inp&&inp.otherSuspension }
                          onChange={e => setInp({ ...inp, otherSuspension: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
      </InspectRecordTitle>
    );
  } );


const InternalItem8=
  React.forwardRef((
    { par,   show = false  },  ref
  ) => {
    const {emergencyElectric} =par||{};
    const itemVal={emergencyElectric};
    const {eos, setInp, inp} =useItemControlAs({ref,show,par,itemVal});

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
                  value={ inp&&inp.emergencyElectric  }
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


const InternalItem7=
  React.forwardRef((
    { par,   show = false  },  ref
  ) => {
    const {phaseFailure,emergencyEOperation,convenientAccess,directlyObserve,permanentLighting,stopSwitch,bypassDoor,loopDetection,brakeFailure,rescueDevice} =par||{};
    const itemVal={phaseFailure,emergencyEOperation,convenientAccess,directlyObserve,permanentLighting,stopSwitch,bypassDoor,loopDetection,brakeFailure,rescueDevice};
    const {eos, setInp, inp} =useItemControlAs({ref,show,par,itemVal});

    return (
      <InspectRecordTitle  control={eos}   label={'检验项目 2.8'}>
        <InspectRecordHeadColumn  level={'B'}  bigLabel={'2 机器设备间及相关设备'}  label={'2.8 控制柜、 紧急操作和动态测试装置'}>
        </InspectRecordHeadColumn>
        <InputGroupLine  label='(2)断相、错相保护功能有效；电梯运行与相序无关时，可以不设错相保护。'>
          <SelectHookfork value={ inp&&inp.phaseFailure }
                          onChange={e => setInp({ ...inp, phaseFailure: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        <IndentationLayText title={'(4)紧急电动运行装置应当符合以下要求：'}>
          ①依靠持续揿压按钮来控制轿厢运行，此按钮有防止误操作的保护，按钮上或其近旁标出 相应的运行方向<br/>
          ②一旦进入检修运行，紧急电动运行装置控制轿厢运行的功能由检修控制装置所取代；<br/>
          ③进行紧急电动运行操作时，易于观察到轿厢是否在开锁区。
        </IndentationLayText>
        <InputGroupLine  label='(4)紧急电动运行装置查验结果'>
          <SelectHookfork value={ inp&&inp.emergencyEOperation }
                          onChange={e => setInp({ ...inp, emergencyEOperation: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        <IndentationLayText title={'(5)无机房电梯的紧急操作和动态测试装置应当符合以下要求：'}>
          <InputGroupLine  label='①在任何情况下均能够安全方便地从井道外接近和操作该装置；'>
            <SelectHookfork value={ inp&&inp.convenientAccess  }
                            onChange={e => setInp({ ...inp, convenientAccess: e.currentTarget.value? e.currentTarget.value : undefined}) }
            />
          </InputGroupLine>
          <InputGroupLine  label='②能够直接或者通过显示装置观察到轿厢的运行方向、速度以及是否位于开锁区；'>
            <SelectHookfork value={ inp&&inp.directlyObserve  }
                            onChange={e => setInp({ ...inp, directlyObserve: e.currentTarget.value? e.currentTarget.value : undefined}) }
            />
          </InputGroupLine>
          <InputGroupLine  label='③装置上设有永久性照明和照明开关；'>
            <SelectHookfork value={ inp&&inp.permanentLighting  }
                            onChange={e => setInp({ ...inp, permanentLighting: e.currentTarget.value? e.currentTarget.value : undefined}) }
            />
          </InputGroupLine>
          <InputGroupLine  label='④装置上设有停止装置或者主开关。'>
            <SelectHookfork value={ inp&&inp.stopSwitch  }
                            onChange={e => setInp({ ...inp, stopSwitch: e.currentTarget.value? e.currentTarget.value : undefined}) }
            />
          </InputGroupLine>
        </IndentationLayText>
        <IndentationLayText title={'☆(6)层门和轿门旁路装置应当符合以下要求：'}>
          ①在层门和轿门旁路装置上或者其附近标明“旁路”字样,并且标明旁路装置的“旁路”状态或者“关”状态;<br/>
          ②旁路时取消正常运行(包括动力操作的自动门的任何运行);只有在检修运行或者紧急电动运行状态下,轿厢才能够运行;运行期间,轿厢上的听觉信号和轿底的闪烁灯起作用;<br/>
          ③能够旁路层门关闭触点、层门门锁触点、轿门关闭触点、轿门门锁触点;不能同时旁路层门和轿门的触点;对于手动层门,不能同时旁路层门关闭触点和层门门锁触点;<br/>
          ④提供独立的监控信号证实轿门处于关闭位置。
        </IndentationLayText>
        <InputGroupLine  label='☆(6)层门和轿门旁路装置查验结果'>
          <SelectHookfork value={ inp&&inp.bypassDoor }
                          onChange={e => setInp({ ...inp, bypassDoor: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        ☆(7)应当具有门回路检测功能,当轿厢在开锁区域内、轿门开启并且层门门锁释放时,监测检查
        轿门关闭位置的电气安全装置、检查层门门锁锁紧位置的电气安全装置和轿门监控信号的正确动
        作;如果监测到上述装置的故障,能够防止电梯的正常运行。
        <InputGroupLine  label='☆(7)应当具有门回路检测功能'>
          <SelectHookfork value={ inp&&inp.loopDetection  }
                          onChange={e => setInp({ ...inp, loopDetection: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        ☆(8)应当具有制动器故障保护功能,当监测到制动器的提起(或者释放)失效时,能够防止电梯的正常启动。
        <InputGroupLine  label='☆(8)应当具有制动器故障保护'>
          <SelectHookfork value={ inp&&inp.brakeFailure }
                          onChange={e => setInp({ ...inp, brakeFailure: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        <IndentationLayText title={'☆(9)自动救援操作装置(如果有)应该符合以下要求:'}>
          ①设有铭牌,标明制造单位名称、产品型号、产品编号、主要技术参数,加装的自动救援操作装置的铭牌和该装置的产品质量证明文件相符;<br/>
          ②在外电网断电至少等待3s后自动投入救援运行,电梯自动平层并且开门;<br/>
          ③当电梯处于检修运行、紧急电动运行、电气安全装置动作或者主开关断开时,不得投入救援运行;<br/>
          ④设有一个非自动复位的开关,当该开关处于关闭状态时,该装置不能启动救援运行。
        </IndentationLayText>
        <InputGroupLine  label='☆(9)自动救援操作装置(如果有)'>
          <SelectHookfork value={ inp&&inp.rescueDevice  }
                          onChange={e => setInp({ ...inp, rescueDevice: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
      </InspectRecordTitle>
    );
  } );


const projectList = [
  createItem(8, <InternalItem1/>),
  createItem(6, <InternalItem7/>),
  createItem(5, <InternalItem8/>),
  createItem(2, <InternalItem12/>),
  createItem(7, <InternalItem27/>),
  createItem(4, <InternalItem31/>),
  createItem(3, <InternalItem37/>),
  createItem(1, <InternalItem50/>),
];
