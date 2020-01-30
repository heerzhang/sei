/** @jsx jsx */
import { jsx,  } from "@emotion/core";
import * as React from "react";
import {
  Text,
  useTheme,
  Button,
  InputGroupLine,
  SuffixInput,   useCollapse
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
      <InspectRecordTitle  control={eos}   label={'主要检验仪器设备'}>
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
      const {dr,leaf,frame,sill,gap,tooth,knife,roller,doorClearance,manPowerGap,doorLock,cabinLock,lengthDoorLock,clearanceKnife} =par||{};
      return {dr,leaf,frame,sill,gap,tooth,knife,roller,doorClearance,manPowerGap,doorLock,cabinLock,lengthDoorLock,clearanceKnife};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter});
    const theme = useTheme();
    const [floor, setFloor] = React.useState(null);
    const cAppendix =useCollapse(false,true);
    let  toothUnquf=inp?.dr?.find((f,i)=>{
      return parseFloat(inp?.tooth?.[f])<7;
    });
    let  knifeUnquf=inp?.dr?.find((f,i)=>{
      return parseFloat(inp?.knife?.[f])<5;
    });
    let  rollerUnquf=inp?.dr?.find((f,i)=>{
      return parseFloat(inp?.roller?.[f])<5;
    });

    return (
      <React.Fragment>
        <InspectRecordTitle  control={eos}   label={'层门间隙门锁'}>
          <InspectZoneHeadColumn label={'6 轿门与层门'} projects={['6.3','6.9','6.12']} />
          <InspectRecordTitle  control={cAppendix} label={'附录A 层门间隙、啮合长度'}>
            <div>
              已检查记录:
              {inp?.dr?.map((a,i)=>{
                return <React.Fragment key={i}>
                      <br/>{
                  `[${a}]层: ${inp?.leaf?.[a]||''} , ${inp?.frame?.[a]||''} , ${inp?.sill?.[a]||''} , ${inp?.gap?.[a]||''} , ${inp?.tooth?.[a]||''} , ${inp?.knife?.[a]||''} , ${inp?.roller?.[a]||''};`
                      }
                    </React.Fragment>;
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
                  {inp?.dr?.map((a,i)=>{
                    return <TableRow key={i}>
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

          <InspectItemHeadColumn  level={'C'} label={'6.12 门刀、门锁滚轮与地坎间隙'}>
            1）轿门门刀与层门地坎，层门锁滚轮与轿厢地坎的间隙应当不小于5mm；电梯运行时不得互相碰擦
          </InspectItemHeadColumn>
          <div>
            轿门门刀与层门地坎间距:
            {inp?.dr?.map(a=>{
              return ` ${a}层:${inp?.knife?.[a]||''};`
            }) }
          </div>
          <div>
            门锁滚轮与轿门地坎间距:
            {inp?.dr?.map(a=>{
              return ` ${a}层:${inp?.roller?.[a]||''};`
            }) }
          </div>
          <InputGroupLine  label='间隙应当不小于5mm'>
            <SelectHookfork value={knifeUnquf||rollerUnquf? '×': inp?.dr?.length>=1? '√':''} disabled/>
          </InputGroupLine>
          <InputGroupLine  label='(1)门刀、门锁滚轮与地坎间隙'>
            <SelectHookfork value={ inp?.clearanceKnife ||''}
                            onChange={e => setInp({ ...inp, clearanceKnife: e.currentTarget.value||undefined}) }
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
      <InspectRecordTitle  control={eos}   label={'项目6.4-7'}>
        <InspectZoneHeadColumn label={'6 轿门与层门'} projects={['6.4','6.5','6.6','6.7']} />
        <InspectItemHeadColumn  level={'C'} label={'6.4 玻璃门防拖曳措施'}>
        （1）层门和轿门采用玻璃门时，应当有防止儿童的手被拖曳的措施
        </InspectItemHeadColumn>
        <InputGroupLine  label='玻璃门防拖曳措施'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InspectItemHeadColumn  level={'B'} label={'6.5 防止门夹人的保护装置'}>
        （1）动力驱动的自动水平滑动门应当设置防止门夹人的保护装置，当人员通过层门入口被正在关闭的门扇撞击或者将被撞击时，该装置应当自动使门重新开启
        </InspectItemHeadColumn>
        <InputGroupLine  label='防止门夹人的保护装置'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InspectItemHeadColumn  level={'B'} label={'6.6 门的运行与导向'}>
        （1）层门和轿门正常运行时不得出现脱轨、机械卡阻或者在行程终端时错位；由于磨损、锈蚀或者火灾可能造成层门导向装置失效时，应当设置应急导向装置，使层门保持在原有位置
        </InspectItemHeadColumn>
        <InputGroupLine  label='门的运行与导向'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InspectItemHeadColumn  level={'B'} label={'6.7 自动关闭层门装置'}>
        （1）在轿门驱动层门的情况下，当轿厢在开锁区域之外时，如果层门开启（无论何种原因），应当有一种装置能够确保该层门自动关闭。自动关闭装置采用重块时，应当有防止重块坠落的措施
        </InspectItemHeadColumn>
        <InputGroupLine  label='自动关闭层门装置'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
      </InspectRecordTitle>
    );
  } );

const InternalItem25: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    props:{ children },  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {cageDistortion,brokenWires,diameterSteelWire,seriouslyRusted,otherSuspension} =par||{};
      return {cageDistortion,brokenWires,diameterSteelWire,seriouslyRusted,otherSuspension};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter});

    return (
      <InspectRecordTitle  control={eos}   label={'检验项目 5.1-2'}>
        <InspectZoneHeadColumn label={'5 悬挂装置、补偿装置及旋转部件防护'} projects={['5.1','5.2']} />
        <InspectItemHeadColumn  level={'C'} label={'5.1 悬挂装置、补偿装置的磨损、断丝、变形'}>
          出现下列情况之一时，悬挂钢丝绳和补偿钢丝绳应当报废：<br/>
          ①出现笼状畸变、绳股挤出、扭结、部分压扁、弯折；<br/>
          ②一个捻距内出现的断丝数大于下表列出的数值时：
          <Table minWidth={'140px'} css={{borderCollapse:'collapse'}}>
            <TableBody>
              <TableRow>
                <CCell rowSpan={2}>断丝的形式</CCell>
                <CCell colSpan={3}>钢丝绳的类型</CCell>
              </TableRow>
              <TableRow>
                <CCell>6×19</CCell><CCell>8×9</CCell><CCell>9×19</CCell>
              </TableRow>
              <TableRow>
                <CCell>均布在外层绳股上</CCell>
                <CCell>24</CCell><CCell>30</CCell><CCell>34</CCell>
              </TableRow>
              <TableRow>
                <CCell>集中在一或者两根外层绳股上</CCell>
                <CCell>8</CCell><CCell>10</CCell><CCell>11</CCell>
              </TableRow>
              <TableRow>
                <CCell>一根外绳股上相邻的断丝</CCell>
                <CCell>4</CCell><CCell>4</CCell><CCell>4</CCell>
              </TableRow>
              <TableRow>
                <CCell>股谷（缝）断丝 </CCell>
                <CCell>1</CCell><CCell>1</CCell><CCell>1</CCell>
              </TableRow>
              <TableRow>
                <Cell colSpan={4}>注：上述断丝数参考长度为一个捻距，约为6d(d表示钢丝绳的公称直径，mm）</Cell>
              </TableRow>
            </TableBody>
          </Table>
          ③钢丝绳直径小于其公称直径的90%；<br/>
          ④钢丝绳严重锈蚀，铁锈填满绳股间隙。<br/>
          采用其他类型悬挂装置的，悬挂装置的磨损、变形等不得超过制造单位设定的报废指标
        </InspectItemHeadColumn>
        数据及测量
        <InputGroupLine label={`②断丝数`}>
          <SuffixInput
            autoFocus={true}
            placeholder="请输入测量数"
            value={ inp?.brokenWires ||''}
            onChange={e => setInp({ ...inp, brokenWires: e.currentTarget.value||undefined}) }
          >根</SuffixInput>
        </InputGroupLine>
        <InputGroupLine  label='②一个捻距断丝数,结果判定'>
          <SelectHookfork value={ inp?.seriouslyRusted  ||''}
                          onChange={e => setInp({ ...inp, seriouslyRusted: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine label={`③钢丝绳直径`}>
          <SuffixInput
            autoFocus={true}
            placeholder="请输入测量数"
            value={ inp?.brokenWires ||''}
            onChange={e => setInp({ ...inp, brokenWires: e.currentTarget.value||undefined}) }
          >mm</SuffixInput>
        </InputGroupLine>
        <InputGroupLine label={`③公称直径`}>
          <SuffixInput
            autoFocus={true}
            placeholder="请输入测量数"
            value={ inp?.brokenWires ||''}
            onChange={e => setInp({ ...inp, brokenWires: e.currentTarget.value||undefined}) }
          >mm</SuffixInput>
        </InputGroupLine>
        <InputGroupLine  label='③钢丝绳直径小于公称90%,结果判定'>
          <SelectHookfork value={ inp?.diameterSteelWire ||''}
                          onChange={e => setInp({ ...inp, diameterSteelWire: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='悬挂装置、补偿装置的磨损、断丝、变形等情况'>
          <SelectHookfork value={ inp?.otherSuspension ||''}
                          onChange={e => setInp({ ...inp, otherSuspension: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
        </InputGroupLine>
        <InspectItemHeadColumn  level={'C'} label={'5.2 绳端固定'}>
        （1）悬挂钢丝绳绳端固定应当可靠，弹簧、螺母、开口销等连接部件无缺损。<br/>
         采用其他类型悬挂装置的，其端部固定应当符合制造单位的规定。
        </InspectItemHeadColumn>
        <InputGroupLine  label='绳端固定'>
          <SelectHookfork value={ inp?.diameterSteelWire ||''}
                          onChange={e => setInp({ ...inp, diameterSteelWire: e.currentTarget.value? e.currentTarget.value : undefined}) }
          />
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
      const {aboveGround,horiztAngle,ladderAccess,channelSet,channelLight,accessWidth,accessHeight,roomAccess,accessDoor,lightingSwitch,mainSwitch} =par||{};
      return {aboveGround,horiztAngle,ladderAccess,channelSet,channelLight,accessWidth,accessHeight,roomAccess,accessDoor,lightingSwitch,mainSwitch};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter});

    return (
      <InspectRecordTitle  control={eos}   label={'检验项目 2.1-5-6'}>
        <InspectZoneHeadColumn label={'2 机房(机器设备间)及相关设备'} projects={['2.1','2.5','2.6']} />
        <InspectItemHeadColumn  level={'C'} label={'2.1 通道与通道门'}>
         （1）应当在任何情况下均能够安全方便地使用通道。采用梯子作为通道时，必须符合以下条件：
          <IndentationLayText >
          ①通往机房(机器设备间)的通道不应当高出楼梯所到平面4m；<br/>
          ②梯子必须固定在通道上而不能被移动；<br/>
          ③梯子高度超过1.50m时，其与水平方向的夹角应当在65°～75°之间，并不易滑动或者翻转；<br/>
          ④靠近梯子顶端应当设置容易握到的把手。
          </IndentationLayText>
         （2）通道应当设置永久性电气照明；<br/>
         （3）机房通道门的宽度应当不小于0.60m，高度应当不小于1.80m，并且门不得向机房内开启。门应当装有带钥匙的锁，并且可以从机房内不用钥匙打开。门外侧有下述或者类似的警示标志：“电梯机器——危险 未经允许禁止入内”
        </InspectItemHeadColumn>
        采用梯子作为通道时
        <InputGroupLine label={`机房高出平面`}>
          <SuffixInput
            autoFocus={true}
            placeholder="请输入测量数"
            value={ inp?.aboveGround ||''}
            onChange={e => setInp({ ...inp, aboveGround: e.currentTarget.value||undefined}) }
          >m</SuffixInput>
        </InputGroupLine>
        <InputGroupLine label={`水平方向夹角`}>
          <SuffixInput
            autoFocus={true}
            placeholder="请输入测量数"
            value={ inp?.horiztAngle ||''}
            onChange={e => setInp({ ...inp, horiztAngle: e.currentTarget.value||undefined}) }
          >(°)</SuffixInput>
        </InputGroupLine>
        <InputGroupLine  label='用梯子作为通道时，测量结果判定'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='(1)通道设置'>
          <SelectHookfork value={ inp?.channelSet ||''}
                          onChange={e => setInp({ ...inp, channelSet: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='(2)通道照明'>
          <SelectHookfork value={ inp?.channelLight ||''}
                          onChange={e => setInp({ ...inp, channelLight: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        机房通道门
        <InputGroupLine label={`宽度`}>
          <SuffixInput
            autoFocus={true}
            placeholder="请输入测量数"
            value={ inp?.accessWidth ||''}
            onChange={e => setInp({ ...inp, accessWidth: e.currentTarget.value||undefined}) }
          >m</SuffixInput>
        </InputGroupLine>
        <InputGroupLine label={`高度`}>
          <SuffixInput
            autoFocus={true}
            placeholder="请输入测量数"
            value={ inp?.accessHeight ||''}
            onChange={e => setInp({ ...inp, accessHeight: e.currentTarget.value||undefined}) }
          >m</SuffixInput>
        </InputGroupLine>
        <InputGroupLine  label='机房通道门的测量结果判定'>
          <SelectHookfork value={ inp?.roomAccess ||''}
                          onChange={e => setInp({ ...inp, roomAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='(3)通道门'>
          <SelectHookfork value={ inp?.accessDoor ||''}
                          onChange={e => setInp({ ...inp, accessDoor: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InspectItemHeadColumn  level={'C'} label={'2.5 照明开关'}>
         （1）机房(机器设备间)设有永久性电气照明；在靠近入口(或多个入口)处的适当高度设置一个开关，控制机房(机器设备间)照明
        </InspectItemHeadColumn>
        <InputGroupLine  label='(1)照明、照明开关'>
          <SelectHookfork value={ inp?.lightingSwitch ||''}
                          onChange={e => setInp({ ...inp, lightingSwitch: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InspectItemHeadColumn  level={'B'} label={'2.6 主开关与电路关系'}>
         （2）主开关不得切断轿厢照明和通风、机房（机器设备间）照明和电源插座、轿顶与底坑的电源插座、电梯井道照明、报警装置的供电电路
        </InspectItemHeadColumn>
        <InputGroupLine  label='(2)主开关与照明等电路的控制关系'>
          <SelectHookfork value={ inp?.mainSwitch ||''}
                          onChange={e => setInp({ ...inp, mainSwitch: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
      </InspectRecordTitle>
    );
  } );

const InternalItem16: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    props:{ children },  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {aboveGround,horiztAngle,ladderAccess,channelSet,channelLight,accessWidth,accessHeight,roomAccess,accessDoor,lightingSwitch,mainSwitch} =par||{};
      return {aboveGround,horiztAngle,ladderAccess,channelSet,channelLight,accessWidth,accessHeight,roomAccess,accessDoor,lightingSwitch,mainSwitch};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter});

    return (
      <InspectRecordTitle  control={eos}   label={'检验项目 3.14-15'}>
        <InspectZoneHeadColumn label={'3 井道及相关设备'} projects={['3.14','3.15']} />
        <InspectItemHeadColumn  level={'B'} label={'3.14  (2)限速绳张紧装置的电气安全装置'}>
        （2）当限速器绳断裂或者过分伸长时，应当通过一个电气安全装置的作用，使电梯停止运转
        </InspectItemHeadColumn>
        <InputGroupLine  label='(2)限速绳张紧装置的电气安全装置'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
         <InspectItemHeadColumn  level={'B'} label={'3.15 缓冲器'}>
         （3）缓冲器应当固定可靠、无明显倾斜，并且无断裂、塑性变形、剥落、破损等现象；<br/>
         （4）耗能型缓冲器液位应当正确，有验证柱塞复位的电气安全装置。<br/>
         （5）对重缓冲器附近应当设置永久性的明显标识，标明当轿厢位于顶层端站平层位置时，对重装置撞板与其缓冲器顶面间的最大允许垂直距离；并且该垂直距离不超过最大允许值
        </InspectItemHeadColumn>
        <InputGroupLine  label='(3)固定和完好情况'>
          <SelectHookfork value={ inp?.lightingSwitch ||''}
                          onChange={e => setInp({ ...inp, lightingSwitch: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='(4)液位和电气安全装置'>
          <SelectHookfork value={ inp?.lightingSwitch ||''}
                          onChange={e => setInp({ ...inp, lightingSwitch: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        (5)对重越程距离
        <InputGroupLine label={`最大允许值`}>
          <SuffixInput
            autoFocus={true}
            placeholder="请输入测量数"
            value={ inp?.accessWidth ||''}
            onChange={e => setInp({ ...inp, accessWidth: e.currentTarget.value||undefined}) }
          >mm</SuffixInput>
        </InputGroupLine>
        <InputGroupLine label={`测量值`}>
          <SuffixInput
            autoFocus={true}
            placeholder="请输入测量数"
            value={ inp?.accessHeight ||''}
            onChange={e => setInp({ ...inp, accessHeight: e.currentTarget.value||undefined}) }
          >mm</SuffixInput>
        </InputGroupLine>
        <InputGroupLine  label='(5)对重越程距离,结果判定'>
          <SelectHookfork value={ inp?.lightingSwitch ||''}
                          onChange={e => setInp({ ...inp, lightingSwitch: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
      </InspectRecordTitle>
    );
  } );

const InternalItem5: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    props:{ children },  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {aboveGround,horiztAngle,ladderAccess,channelSet,channelLight,accessWidth,accessHeight,roomAccess,accessDoor,lightingSwitch,mainSwitch} =par||{};
      return {aboveGround,horiztAngle,ladderAccess,channelSet,channelLight,accessWidth,accessHeight,roomAccess,accessDoor,lightingSwitch,mainSwitch};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter});

    return (
      <InspectRecordTitle  control={eos}   label={'2.7驱动主机'}>
        <InspectZoneHeadColumn label={'2 机房(机器设备间)及相关设备'} projects={['2.7']} />
        <InspectItemHeadColumn  level={'B'} label={'2.7 驱动主机'}>
        （2）驱动主机工作时无异常噪声和振动；<br/>
        （3）曳引轮轮槽不得有缺损或者不正常磨损；如果轮槽的磨损可能影响曳引能力时，进行曳引能力验证试验；<br/>
        （4）制动器动作灵活，制动时制动闸瓦(制动钳)紧密、均匀地贴合在制动轮(制动盘)上，电梯运行时制动闸瓦(制动钳)与制动轮(制动盘)不发生摩擦，制动闸瓦(制动钳)以及制动轮(制动盘)工作面上没有油污；<br/>
        （5）手动紧急操作装置符合以下要求：<br/>
          ①对于可拆卸盘车手轮，设有一个电气安全装置，最迟在盘车手轮装上电梯驱动主机时动作；<br/>
          ②松闸扳手涂成红色，盘车手轮是无辐条的并且涂成黄色，可拆卸盘车手轮放置在机房内容易接近的明显部位；<br/>
          ③在电梯驱动主机上接近盘车手轮处，明显标出轿厢运行方向，如果手轮是不可拆卸的，可以在手轮上标出；<br/>
          ④能够通过操纵手动松闸装置松开制动器，并且需要以一个持续力保持其松开状态；<br/>
          ⑤进行手动紧急操作时，易于观察到轿厢是否在开锁区
        </InspectItemHeadColumn>
        <InputGroupLine  label='(2)工作状况'>
          <SelectHookfork value={ inp?.lightingSwitch ||''}
                          onChange={e => setInp({ ...inp, lightingSwitch: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='(3)轮槽磨损'>
          <SelectHookfork value={ inp?.lightingSwitch ||''}
                          onChange={e => setInp({ ...inp, lightingSwitch: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='(4)制动器动作情况'>
          <SelectHookfork value={ inp?.lightingSwitch ||''}
                          onChange={e => setInp({ ...inp, lightingSwitch: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='★(5)手动紧急操作装置'>
          <SelectHookfork value={ inp?.lightingSwitch ||''}
                          onChange={e => setInp({ ...inp, lightingSwitch: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
      </InspectRecordTitle>
    );
  } );

const InternalItem7: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    props:{ children },  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {aboveGround,horiztAngle,ladderAccess,channelSet,channelLight,accessWidth,accessHeight,roomAccess,accessDoor,lightingSwitch,mainSwitch} =par||{};
      return {aboveGround,horiztAngle,ladderAccess,channelSet,channelLight,accessWidth,accessHeight,roomAccess,accessDoor,lightingSwitch,mainSwitch};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter});

    return (
      <InspectRecordTitle  control={eos}   label={'2.9限速器'}>
        <InspectZoneHeadColumn label={'2 机房(机器设备间)及相关设备'} projects={['2.9','2.10','2.11']} />
        <InspectItemHeadColumn  level={'B'} label={'2.9 限速器'}>
          （2）限速器或者其他装置上设有在轿厢上行或者下行速度达到限速器动作速度之前动作的电气安全装置，以及验证限速器复位状态的电气安全装置<br/>
          （3）限速器各调节部位封记完好，运转时不得出现碰擦、卡阻、转动不灵活等现象，动作正常<br/>
          （4）受检电梯的维护保养单位应当每2年(对于使用年限不超过15年的限速器)或者每年(对于使用年限超过15年的限速器)进行一次限速器动作速度校验，校验结果应当符合要求
        </InspectItemHeadColumn>
        <InputGroupLine  label='(2)电气安全装置'>
          <SelectHookfork value={ inp?.lightingSwitch ||''}
                          onChange={e => setInp({ ...inp, lightingSwitch: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='(3)封记及运转情况'>
          <SelectHookfork value={ inp?.lightingSwitch ||''}
                          onChange={e => setInp({ ...inp, lightingSwitch: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='(4)动作速度校验'>
          <SelectHookfork value={ inp?.lightingSwitch ||''}
                          onChange={e => setInp({ ...inp, lightingSwitch: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InspectItemHeadColumn  level={'C'} label={'2.10 接地连接'}>
        （2）所有电气设备及线管、线槽的外露可以导电部分应当与保护导体（PE，地线）可靠连接
        </InspectItemHeadColumn>
        <InputGroupLine  label='(2)接地连接'>
          <SelectHookfork value={ inp?.lightingSwitch ||''}
                          onChange={e => setInp({ ...inp, lightingSwitch: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InspectItemHeadColumn  level={'C'} label={'2.11 电气绝缘'}>
         （1）动力电路、照明电路和电气安全装置电路的绝缘电阻应当符合下述要求：
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
        </InspectItemHeadColumn>
        数据测量
        <InputGroupLine  label='动力电路' >
          <SuffixInput
            value={inp?.insulResistance ||''}
            onChange={e => setInp({ ...inp, insulResistance: e.currentTarget.value? e.currentTarget.value : undefined}) }
            inputSize="md"
            type="text"
            placeholder="请输入测量数"
          >MΩ
          </SuffixInput>
        </InputGroupLine>
        <InputGroupLine  label='照明电路' >
          <SuffixInput
            value={inp?.insulResistance ||''}
            onChange={e => setInp({ ...inp, insulResistance: e.currentTarget.value? e.currentTarget.value : undefined}) }
            inputSize="md"
            type="text"
            placeholder="请输入测量数"
          >MΩ
          </SuffixInput>
        </InputGroupLine>
        <InputGroupLine  label='安全装置电路' >
          <SuffixInput
            value={inp?.insulResistance ||''}
            onChange={e => setInp({ ...inp, insulResistance: e.currentTarget.value? e.currentTarget.value : undefined}) }
            inputSize="md"
            type="text"
            placeholder="请输入测量数"
          >MΩ
          </SuffixInput>
        </InputGroupLine>
        <InputGroupLine  label='电气绝缘,结果判定'>
          <SelectHookfork value={ inp?.lightingSwitch ||''}
                          onChange={e => setInp({ ...inp, lightingSwitch: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
      </InspectRecordTitle>
    );
  } );

const InternalItem10: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    props:{ children },  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {aboveGround,horiztAngle,ladderAccess,channelSet,channelLight,accessWidth,accessHeight,roomAccess,accessDoor,lightingSwitch,mainSwitch} =par||{};
      return {aboveGround,horiztAngle,ladderAccess,channelSet,channelLight,accessWidth,accessHeight,roomAccess,accessDoor,lightingSwitch,mainSwitch};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter});

    return (
      <InspectRecordTitle  control={eos}   label={'检验项目 3.4-5-7'}>
        <InspectZoneHeadColumn label={'3 井道及相关设备'} projects={['3.4','3.5','3.7']} />
        <InspectItemHeadColumn  level={'C'} label={'3.4 井道安全门'}>
        （3）门上应当装设用钥匙开启的锁，当门开启后不用钥匙能够将其关闭和锁住，在门锁住后，不用钥匙能够从井道内将门打开；
        （4）应当设置电气安全装置以验证门的关闭状态。
        </InspectItemHeadColumn>
        <InputGroupLine  label='(3)门锁'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='(4)电气安全装置'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InspectItemHeadColumn  level={'C'} label={'3.5 井道检修门'}>
          （3）门上应当装设用钥匙开启的锁，当门开启后不用钥匙能够将其关闭和锁住，在门锁住后，不用钥匙能够从井道内将门打开；
          （4）应当设置电气安全装置以验证门的关闭状态。
        </InspectItemHeadColumn>
        <InputGroupLine  label='(3)门锁'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='(4)电气安全装置'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InspectItemHeadColumn  level={'B'} label={'3.7 轿厢与井道壁距离'}>
        （1）轿厢与面对轿厢入口的井道壁的间距不大于0.15m，对于局部高度不大于0.50m或者采用垂直滑动门的载货电梯，该间距可以增加到0.20m。如果轿厢装有机械锁紧的门并且门只能在开锁区内打开时，则上述间距不受限制。
        </InspectItemHeadColumn>
        数据及测量
        <InputGroupLine label={`间距`}>
          <SuffixInput
            autoFocus={true}
            placeholder="请输入测量数"
            value={ inp?.accessHeight ||''}
            onChange={e => setInp({ ...inp, accessHeight: e.currentTarget.value||undefined}) }
          >m</SuffixInput>
        </InputGroupLine>
        <InputGroupLine  label='轿厢与井道壁距离,(1)结果判定'>
          <SelectHookfork value={ inp?.lightingSwitch ||''}
                          onChange={e => setInp({ ...inp, lightingSwitch: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
      </InspectRecordTitle>
    );
  } );

const InternalItem13: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    props:{ children },  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {aboveGround,horiztAngle,ladderAccess,channelSet,channelLight,accessWidth,accessHeight,roomAccess,accessDoor,lightingSwitch,mainSwitch} =par||{};
      return {aboveGround,horiztAngle,ladderAccess,channelSet,channelLight,accessWidth,accessHeight,roomAccess,accessDoor,lightingSwitch,mainSwitch};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter});

    return (
      <InspectRecordTitle  control={eos}   label={'检验项目 3.10--12'}>
        <InspectZoneHeadColumn label={'3 井道及相关设备'} projects={['3.10','3.11','3.12']} />
        <InspectItemHeadColumn  level={'B'} label={'3.10 极限开关'}>
         （1）井道上下两端应当装设极限开关，该开关在轿厢或者对重接触缓冲器前起作用，并且在缓冲器被压缩期间保持其动作状态。
        </InspectItemHeadColumn>
        <InputGroupLine  label='极限开关'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InspectItemHeadColumn  level={'C'} label={'3.11 井道照明'}>
         （1）井道应当装设永久性电气照明。对于部分封闭井道，如果井道附近有足够的电气照明，井道内可以不设照明
        </InspectItemHeadColumn>
        <InputGroupLine  label='井道照明'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InspectItemHeadColumn  level={'C'} label={'3.12 底坑设施与装置'}>
         （1）底坑底部应当光滑平整，不得渗水、漏水；<br/>
         （3）底坑内应当设置在进入底坑时和底坑地面上均能方便操作的停止装置，停止装置的操作装置为双稳态、红色、标以“停止”字样，并且有防止误操作的保护
        </InspectItemHeadColumn>
        <InputGroupLine  label='(1)底坑底部'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='(3)停止装置'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
      </InspectRecordTitle>
    );
  } );

const InternalItem18: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    props:{ children },  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {aboveGround,horiztAngle,ladderAccess,channelSet,channelLight,accessWidth,accessHeight,roomAccess,accessDoor,lightingSwitch,mainSwitch} =par||{};
      return {aboveGround,horiztAngle,ladderAccess,channelSet,channelLight,accessWidth,accessHeight,roomAccess,accessDoor,lightingSwitch,mainSwitch};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter});

    return (
      <InspectRecordTitle  control={eos}   label={'检验项目 4.1-6'}>
        <InspectZoneHeadColumn label={'4 轿厢与对重'} projects={['4.1','4.3','4.5','4.6']} />
        <InspectItemHeadColumn  level={'C'} label={'4.1 轿顶电气装置'}>
        （1）轿顶应当装设一个易于接近的检修运行控制装置，并且符合以下要求：<br/>
          ①由一个符合电气安全装置要求，能够防止误操作的双稳态开关（检修开关）进行操作；<br/>
          ②一经进入检修运行时，即取消正常运行（包括任何自动门操作）、紧急电动运行、对接操作运行，只有再一次操作检修开关，才能使电梯恢复正常工作；<br/>
          ③依靠持续揿压按钮来控制轿厢运行，此按钮有防止误操作的保护，按钮上或其近旁标出相应的运行方向；<br/>
          ④该装置上设有一个停止装置，停止装置的操作装置为双稳态、红色、并标以“停止”字样，并且有防止误操作的保护；<br/>
          ⑤检修运行时，安全装置仍然起作用。<br/>
       （2）轿顶应当装设一个从入口处易于接近的停止装置，停止装置的操作装置为双稳态、红色、并标以“停止”字样，并且有防止误操作的保护。如果检修运行控制装置设在从入口处易于接近的位置，该停止装置也可以设在检修运行控制装置上
        </InspectItemHeadColumn>
        <InputGroupLine  label='(1)检修装置'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='(2)停止装置'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InspectItemHeadColumn  level={'C'} label={'4.3 安全门(窗)电气安全装置'}>
          如果轿厢设有安全窗（门），应当符合以下要求：<br/>
         （3）其锁紧由电气安全装置予以验证。
        </InspectItemHeadColumn>
        <InputGroupLine  label='(3)安全门(窗)电气安全装置'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InspectItemHeadColumn  level={'B'} label={'4.5 对重(平衡重)块'}>
        （1）对重(平衡重)块可靠固定；<br/>
        （2）具有能够快速识别对重(平衡重)块数量的措施(例如标明对重块的数量或者总高度)
        </InspectItemHeadColumn>
        <InputGroupLine  label='(1)固定'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='(2)识别数量的措施'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InspectItemHeadColumn  level={'C'} label={'4.6 轿厢面积'}>
        （2）对于为了满足使用要求而轿厢面积超出上述规定的载货电梯，必须满足以下条件：<br/>
        ①在从层站装卸区域总可看见的位置上设置标志，表明该载货电梯的额定载重量；<br/>
        ②该电梯专用于运送特定轻质货物，其体积可保证在装满轿厢情况下，该货物的总质量不会超过额定载重量；<br/>
        ③该电梯由专职司机操作，并严格限制人员进入。
        </InspectItemHeadColumn>
        <InputGroupLine  label='(2)轿厢超面积载货电梯的控制条件'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
      </InspectRecordTitle>
    );
  } );

const InternalItem22: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    props:{ children },  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {aboveGround,horiztAngle,ladderAccess,channelSet,channelLight,accessWidth,accessHeight,roomAccess,accessDoor,lightingSwitch,mainSwitch} =par||{};
      return {aboveGround,horiztAngle,ladderAccess,channelSet,channelLight,accessWidth,accessHeight,roomAccess,accessDoor,lightingSwitch,mainSwitch};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter});

    return (
      <InspectRecordTitle  control={eos}   label={'检验项目 4.8-10'}>
        <InspectZoneHeadColumn label={'4 轿厢与对重'} projects={['4.8','4.9','4.10']} />
        <InspectItemHeadColumn  level={'B'} label={'4.8 紧急照明和报警装置'}>
        轿厢内应当装设符合下述要求的紧急报警装置和紧急照：<br/>
        （1）正常照明电源中断时，能够自动接通紧急照明电源；<br/>
        （2）紧急报警装置采用对讲系统以便与救援服务持续联系，当电梯行程大于30m时，在轿厢和机房（或者紧急操作地点）之间也设置对讲系统，紧急报警装置的供电来自本条（1）所述的紧急照明电源或者等效电源；在启动对讲系统后，被困乘客不必再做其他操作
        </InspectItemHeadColumn>
        <InputGroupLine  label='(1)紧急照明'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='(2)紧急报警装置'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InspectItemHeadColumn  level={'C'} label={'4.9 地坎护脚板'}>
        （1）轿厢地坎下应当装设护脚板，其垂直部分的高度不小于0.75m，宽度不小于层站入口宽度
        </InspectItemHeadColumn>
        数据及测量
        <InputGroupLine label={`护脚板高度`}>
          <SuffixInput
            autoFocus={true}
            placeholder="请输入测量数"
            value={ inp?.accessHeight ||''}
            onChange={e => setInp({ ...inp, accessHeight: e.currentTarget.value||undefined}) }
          >m</SuffixInput>
        </InputGroupLine>
        <InputGroupLine  label='测量结果判定'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='地坎护脚板'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InspectItemHeadColumn  level={'C'} label={'4.10 超载保护装置'}>
        （1）设置当轿厢内的载荷超过额定载重量时，能够发出警示信号，并且使轿厢不能运行的超载保护装置。该装置最迟在轿厢内的载荷达到110％额定载重量(对于额定载重量小于750kg的电梯，最迟在超载量达到75kg)时动作，防止电梯正常启动及再平层，并且轿内有音响或者发光信号提示，动力驱动的自动门完全打开，手动门保持在未锁状态
        </InspectItemHeadColumn>
        <InputGroupLine  label='超载保护装置'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
      </InspectRecordTitle>
    );
  } );

const InternalItem27: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    props:{ children },  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {aboveGround,horiztAngle,ladderAccess,channelSet,channelLight,accessWidth,accessHeight,roomAccess,accessDoor,lightingSwitch,mainSwitch} =par||{};
      return {aboveGround,horiztAngle,ladderAccess,channelSet,channelLight,accessWidth,accessHeight,roomAccess,accessDoor,lightingSwitch,mainSwitch};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter});

    return (
      <InspectRecordTitle  control={eos}   label={'检验项目 5.3-6'}>
        <InspectZoneHeadColumn label={'5 悬挂装置、补偿装置及旋转部件防护'} projects={['5.3','5.5','5.6']} />
        <InspectItemHeadColumn  level={'C'} label={'5.3 补偿装置'}>
        （1）补偿绳（链）端固定应当可靠；<br/>
        （2）应当使用电气安全装置来检查补偿绳的最小张紧位置；<br/>
        （3）当电梯的额定速度大于3.5m/s时，还应当设置补偿绳防跳装置，该装置动作时应当有一个电气安全装置使电梯驱动主机停止运转。
        </InspectItemHeadColumn>
        <InputGroupLine  label='(1)绳(链)端固定'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='(2)电气安全装置'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='(3)补偿绳防跳装置'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InspectItemHeadColumn  level={'B'} label={'5.5 松绳(链)保护'}>
        （1）如果轿厢悬挂在两根钢丝绳或者链条上，则应当设置检查绳(链)松弛的电气安全装置，当其中一根钢丝绳(链条)发生异常相对伸长时，电梯应当停止运行
        </InspectItemHeadColumn>
        <InputGroupLine  label='松绳(链)保护'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InspectItemHeadColumn  level={'C'} label={'5.6 旋转部件的防护'}>
        （1）在机房（机器设备间）内的曳引轮、滑轮、链轮、限速器，在井道内的曳引轮、滑轮、链轮、限速器及张紧轮、补偿绳张紧轮，在轿厢上的滑轮、链轮等与钢丝绳、链条形成传动的旋转部件，均应当设置防护装置，以避免人身伤害、钢丝绳或链条因松弛而脱离绳槽或链轮、异物进入绳与绳槽或链与链轮之间；<br/>
        对于允许按照GB 7588—1995及更早期标准生产的电梯，可以按照以下要求检验：<br/>
        ①采用悬臂式曳引轮或者链轮时，有防止钢丝绳脱离绳槽或者链条脱离链轮的装置，并且当驱动主机不装设在井道上部时，有防止异物进入绳与绳槽之间或者链条与链轮之间的装置；<br/>
        ②井道内的导向滑轮、曳引轮、轿架上固定的反绳轮和补偿绳张紧轮，有防止钢丝绳脱离绳槽和进入异物的防护装置
        </InspectItemHeadColumn>
        <InputGroupLine  label='旋转部件的防护'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
      </InspectRecordTitle>
    );
  } );

const InternalItem35: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    props:{ children },  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {passengerMax,cargoMax,unqualifiedLayer1,middleDoorMax,sideDoorMax,unqualifiedLayer2} =par||{};
      return {passengerMax,cargoMax,unqualifiedLayer1,middleDoorMax,sideDoorMax,unqualifiedLayer2};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter});

    return (
      <InspectRecordTitle  control={eos}   label={'项目6.8,6.10-11'}>
        <InspectZoneHeadColumn label={'6 轿门与层门'} projects={['6.8','6.10','6.11']} />
        <InspectItemHeadColumn  level={'B'} label={'6.8 紧急开锁装置'}>
        （1）每个层门均应当能够被一把符合要求的钥匙从外面开启；紧急开锁后，在层门闭合时门锁装置不应当保持开锁位置
        </InspectItemHeadColumn>
        <InputGroupLine  label='紧急开锁装置'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InspectItemHeadColumn  level={'B'} label={'6.10 门的闭合'}>
        （1）正常运行时应当不能打开层门，除非轿厢在该层门的开锁区域内停止或停站；如果一个层门或者轿门（或者多扇门中的任何一扇门）开着，在正常操作情况下，应当不能启动电梯或者不能保持继续运行；<br/>
        （2）每个层门和轿门的闭合都应当由电气安全装置来验证，如果滑动门是由数个间接机械连接的门扇组成，则未被锁住的门扇上也应当设置电气安全装置以验证其闭合状态
        </InspectItemHeadColumn>
        <InputGroupLine  label='(1)机电联锁'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='(2)电气安全装置'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InspectItemHeadColumn  level={'B'} label={'6.11 轿门开门限制装置及轿门的开启'}>
        （1）应当设置轿门开门限制装置，当轿厢停在开锁区域外时，能够防止轿厢内的人员打开轿门离开轿厢；<br/>
        （2）在轿厢意外移动保护装置允许的最大制停距离范围内，打开对应的层门后，能够不用工具(三角钥匙或者永久性设置在现场的工具除外)从层站处打开轿门
        </InspectItemHeadColumn>
        <InputGroupLine  label='(1)轿门开门限制装置'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='(2)轿门的开启'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
      </InspectRecordTitle>
    );
  } );

const InternalItem8d1: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    props:{ children },  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {aboveGround,horiztAngle,ladderAccess,channelSet,channelLight,accessWidth,accessHeight,roomAccess,accessDoor,lightingSwitch,mainSwitch} =par||{};
      return {aboveGround,horiztAngle,ladderAccess,channelSet,channelLight,accessWidth,accessHeight,roomAccess,accessDoor,lightingSwitch,mainSwitch};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter});

    return (
      <InspectRecordTitle  control={eos}   label={'试验 8.1-4'}>
        <InspectZoneHeadColumn label={'8 试验'} projects={['8.1','8.2','8.3','8.4']} />
        <InspectItemHeadColumn  level={'C'} label={'8.1 平衡系数试验'}>
        （1）曳引电梯的平衡系数应当在0.40～0.50之间，或者符合制造（改造）单位的设计值
        </InspectItemHeadColumn>
        <InputGroupLine  label='平衡系数试验'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InspectItemHeadColumn  level={'C'} label={'8.2 ★轿厢上行超速保护装置试验'}>
        （1）当轿厢上行速度失控时，轿厢上行超速保护装置应当动作，使轿厢制停或者至少使其速度降低至对重缓冲器的设计范围；该装置动作时，应当使一个电气安全装置动作
        </InspectItemHeadColumn>
        <InputGroupLine  label='轿厢上行超速保护装置试验'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InspectItemHeadColumn  level={'B'} label={'8.3 ☆轿厢意外移动保护装置试验'}>
        （1）轿厢在井道上部空载，以型式试验证书所给出的试验速度上行并触发制停部件，仅使用制停部件能够使电梯停止，轿厢的移动距离在型式试验证书给出的范围内；
        （2）如果电梯采用存在内部冗余的制动器作为制停部件，则当制动器提起(或者释放)失效，或者制动力不足时，应当关闭轿门和层门，并且防止电梯的正常启动
        </InspectItemHeadColumn>
        <InputGroupLine  label='(1)制停情况'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='(2)自监测功能'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InspectItemHeadColumn  level={'B'} label={'8.4 轿厢限速器－安全钳试验'}>
        （2）定期检验：轿厢空载，以检修速度下行，进行限速器-安全钳联动试验，限速器－安全钳动作应当可靠
        </InspectItemHeadColumn>
        <InputGroupLine  label='轿厢限速器－安全钳试验'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
      </InspectRecordTitle>
    );
  } );

const InternalItem8d5: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    props:{ children },  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {aboveGround,horiztAngle,ladderAccess,channelSet,channelLight,accessWidth,accessHeight,roomAccess,accessDoor,lightingSwitch,mainSwitch} =par||{};
      return {aboveGround,horiztAngle,ladderAccess,channelSet,channelLight,accessWidth,accessHeight,roomAccess,accessDoor,lightingSwitch,mainSwitch};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter});

    return (
      <InspectRecordTitle  control={eos}   label={'试验 8.5-9'}>
        <InspectZoneHeadColumn label={'8 试验'} projects={['8.5','8.6','8.7','8.9']} />
        <InspectItemHeadColumn  level={'B'} label={'8.5 对重(平衡重)限速器—安全钳'}>
        （1）轿厢空载，以检修速度上行，进行限速器-安全钳联动试验，限速器－安全钳动作应当可靠
        </InspectItemHeadColumn>
        <InputGroupLine  label='对重(平衡重)限速器—安全钳试验'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InspectItemHeadColumn  level={'C'} label={'8.6 运行试验'}>
        （1）轿厢空载，以正常运行速度上、下运行，呼梯、楼层显示等信号系统功能有效、指示正确、动作无误，轿厢平层良好，无异常现象发生；对于设有IC卡系统的电梯，轿厢内的人员无需通过IC卡系统即可到达建筑物的出口层，并且在电梯退出正常服务时，自动退出IC卡功能
        </InspectItemHeadColumn>
        <InputGroupLine  label='运行试验'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InspectItemHeadColumn  level={'B'} label={'8.7 应急救援试验'}>
        （1）在机房内或者紧急操作和动态测试装置上设有明晰的应急救援程序；<br/>
        （2）建筑物内的救援通道保持通畅，以便相关人员无阻碍地抵达实施紧急操作的位置和层站等处；<br/>
        （3）在各种载荷工况下，按照本条(1)所述的应急救援程序实施操作，能够安全、及时地解救被困人员
        </InspectItemHeadColumn>
        <InputGroupLine  label='(1)救援程序'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='(2)救援通道'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InputGroupLine  label='(3)救援操作'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InspectItemHeadColumn  level={'B'} label={'8.9 空载曳引检查'}>
        （1）当对重压在缓冲器上而曳引机按电梯上行方向旋转时，应当不能提升空载轿厢
        </InspectItemHeadColumn>
        <InputGroupLine  label='空载曳引检查'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
      </InspectRecordTitle>
    );
  } );

const InternalItem8d10: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    props:{ children },  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {aboveGround,horiztAngle,ladderAccess,channelSet,channelLight,accessWidth,accessHeight,roomAccess,accessDoor,lightingSwitch,mainSwitch} =par||{};
      return {aboveGround,horiztAngle,ladderAccess,channelSet,channelLight,accessWidth,accessHeight,roomAccess,accessDoor,lightingSwitch,mainSwitch};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter});

    return (
      <InspectRecordTitle  control={eos}   label={'试验 8.10-13'}>
        <InspectZoneHeadColumn label={'8 试验'} projects={['8.10','8.11','8.12','8.13']} />
        <InspectItemHeadColumn  level={'B'} label={'8.10 上行制动工况曳引检查'}>
        （1）轿厢空载以正常运行速度上行至行程上部，切断电动机与制动器供电，轿厢应当完全停止
        </InspectItemHeadColumn>
        <InputGroupLine  label='上行制动工况曳引检查'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InspectItemHeadColumn  level={'B'} label={'8.11 ▲下行制动工况曳引检查'}>
        （1）轿厢装载125%额定载重量，以正常运行速度下行至行程下部，切断电动机与制动器供电，轿厢应当完全停止
        </InspectItemHeadColumn>
        <InputGroupLine  label='▲下行制动工况曳引检查'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InspectItemHeadColumn  level={'B'} label={'8.12 ▲静态曳引试验'}>
        （1）对于轿厢面积超过规定的载货电梯，以轿厢实际面积所对应的125%额定载重量进行静态曳引试验；对于额定载重量按照单位轿厢有效面积不小于200kg/m2计算的汽车电梯，以150%额定载重量做静态曳引试验；历时10min，曳引绳应当没有打滑现象
        </InspectItemHeadColumn>
        <InputGroupLine  label='▲静态曳引试验'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
        <InspectItemHeadColumn  level={'B'} label={'8.13 制动试验'}>
        （1）轿厢装载125%额定载重量，以正常运行速度下行时，切断电动机和制动器供电，制动器应当能够使驱动主机停止运转，试验后轿厢应无明显变形和损坏
        </InspectItemHeadColumn>
        <InputGroupLine  label='制动试验'>
          <SelectHookfork value={ inp?.ladderAccess ||''}
                          onChange={e => setInp({ ...inp, ladderAccess: e.currentTarget.value||undefined}) }
          />
        </InputGroupLine>
      </InspectRecordTitle>
    );
  } );

const projectList = [
  createItem(1, <InternalItem1/>),
  createItem(2, <InternalItem2t4/>),
  createItem(5, <InternalItem5/>),
  createItem(6, <InternalItem6/>),
  createItem(7, <InternalItem7/>),
  createItem(10, <InternalItem10/>),
  createItem(13, <InternalItem13/>),
  createItem(16, <InternalItem16/>),
  createItem(18, <InternalItem18/>),
  createItem(22, <InternalItem22/>),
  createItem(25, <InternalItem25/>),
  createItem(27, <InternalItem27/>),
  createItem(30, <InternalItem30/>),
  createItem(31, <InternalItem31/>),
  createItem(35, <InternalItem35/>),
  createItem(40, <InternalItem8d1/>),
  createItem(44, <InternalItem8d5/>),
  createItem(48, <InternalItem8d10/>),
  createItem(50, <InternalItem50/>),
];
