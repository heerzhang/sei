/** @jsxImportSource @emotion/react */
//import { jsx, Global } from "@emotion/react";
import * as React from "react";

import {
  Text,
  MenuList,
  MenuItem,
  useTheme,
  useToast,
  LayerLoading,
  Container,
  ResponsivePopover,
  IconPackage,
  Button,
  IconChevronDown,
  InputGroupLine,
  SuffixInput,
  IconArrowRight,
  Check,
  Input,
  Select,
  ComboBox,
  ComboBoxInput, ComboBoxList, ComboBoxOption, IconButton, IconLayers, IconX, InputDatalist, ComboBoxDatalist
} from "customize-easy-ui-component";

//import { useSession } from "../auth";
//import {Helmet} from "react-helmet";
import { Link as RouterLink,  useLocation } from "wouter";
import { ContainLine, TransparentInput } from "../../comp/base";
import { css } from "@emotion/react";
import { 设备品种 } from "../../dict/eqpComm";
import { InspectRecordLayout } from "../../report/comp/base";
import { gql, NetworkStatus, useQuery } from "@apollo/client";
import { UnitOrChoose } from "../../unit/UnitOrChoose";
import { DialogEnterReturn } from "../../context/DialogEnterReturn";
import queryString from "querystring";

export const 缓冲器形式=["液压","聚氨酯","弹簧","蓄能型","耗能型","聚胺脂","弹簧 液压","聚氨酯 液压"];
export const 加装附加装置=["IC卡", "自动平层装置","IC卡和自动平层装置","能量反馈装置","自动平层和能量反馈装置","IC卡和能量反馈装置"];
export const 开门方式=["中分门","旁开门","中分双折","旁开双折","中分","旁开","侧开","自动", "中开","手动门","水平中分滑动门（二扇）", "左折", "左开","右折","旁开三折"];
export const 控制方式=["集选","并联","群控","按钮","信号","按钮控制","微机控制","PLC","微机","微电脑","按扭","信号控制","交流变频"]
export const 事故隐患类别=['一般','严重','重大','特大','特别重大'];
export const 施工类别s=["安装","新装", "锅炉安装","新炉安装", "移装","改造", "旧炉移装", "新装验收","新安装","锅炉改造"]
export const 补偿方式s=['补偿链','补偿绳','补偿缆'];


interface 电梯props {
  id?: string;
  defaultTitle?: string;
  defaultImage?: string;
  defaultDescription?: string;
  defaultIngredients?: any[];
  readOnly?: boolean;
  editable?: boolean;
  defaultCredit?: string;
  eqp?:any;
  setPam:  React.Dispatch<React.SetStateAction<any>>;
}
//可嵌套的编辑器；传递保存变动数据。
export const 电梯: React.FunctionComponent<电梯props> = ({
  readOnly,
  id,
  editable,
  defaultCredit = "",
  defaultDescription,
  defaultImage,
  defaultIngredients,
  defaultTitle = "",
  eqp=null,    //从好几代祖先前的DetailedGuide在graphQL获得后端服务器数据层层传递下来的。
                                                       setPam,   //传递编辑保存回调用
}) => {
  const qs= queryString.parse(window.location.search);
  const dialog =qs && !!qs.dialog;
  //?&土建施工单位=190 底层URL 问号?后面那个&是必需的分割符号，两符号都不能省略。
  //console.log("参数电梯路由&print qs printing=",dialog, qs);

  const theme = useTheme();

  const eqpId=id;
  const {ndt, setNdt} =React.useContext(DialogEnterReturn);
  const [open, setOpen] = React.useState(false);
  //合并伪对话框暂存的内容，路由切换后，ndt内容还会遗留着。确定是我这个编辑器的，模型emodel&相等ID关键字的？合理的吗
  //edt是代表当前编辑的， ndt是跨越组件伪对话框共享临时存储的， eqp是后端服务器给的。
  const [edt, setEdt] =React.useState(ndt&&qs?.emodel==='电梯'&&ndt.id===id? ndt:eqp);
  //const [editing, setEditing] = React.useState(!readOnly);
  //const [image, ] = React.useState(defaultImage);
  //const [title, setTitle] = React.useState(defaultTitle);

  const [spec, setSpec] = React.useState(edt.spec);
  const [vl, setVl] = React.useState(edt.vl);
  const [flo, setFlo] = React.useState(edt.flo);
  const [nnor, setNnor] = React.useState(edt.nnor);
  const [cpm, setCpm] = React.useState(edt.cpm);
  const [hlf, setHlf] = React.useState(edt.hlf);
  const [oldb, setOldb] = React.useState(edt.oldb);
  const [lesc, setLesc] = React.useState(edt.lesc);
  const [wesc, setWesc] = React.useState(edt.wesc);
  const [tm, setTm] = React.useState(edt.tm);
  const [mtm, setMtm] = React.useState(edt.mtm);
  const [buff, setBuff] = React.useState(edt.buff);
  const [rtl, setRtl] = React.useState(edt.rtl);
  const [aap, setAap] = React.useState(edt.aap);
  const [prot, setProt] = React.useState(edt.prot);
  const [doop, setDoop] = React.useState(edt.doop);
  const [limm, setLimm] = React.useState(edt.limm);
  const [opm, setOpm] = React.useState(edt.opm);
  const [lbkd, setLbkd] = React.useState(edt.lbkd);
  const [nbkd, setNbkd] = React.useState(edt.nbkd);
  const [cpa, setCpa] = React.useState(edt.cpa);
  const [vital, setVital] = React.useState(edt.vital);

  //监察参数 : 不用JSON.parse无法取出,保存对象直接发给后端数据库,存储String格式不一样;
  //console.log("参数parse JSON 前面edt=",edt);
  const  svp =JSON.parse( edt?.svp!);
  const [制造国, set制造国] = React.useState(svp?.制造国);
  const [设计使用年限, set设计使用年限] = React.useState(svp?.设计使用年限);
  const [motorCod, setMotorCod] = React.useState(svp?.motorCod);
  const [设计日期, set设计日期] = React.useState(svp?.设计日期);
  const [土建验收单位, set土建验收单位] = React.useState(qs?.土建验收单位 || svp?.土建验收单位);
  const [makeIspunitId, setMakeIspunitId] = React.useState(qs?.makeIspunitId || svp?.makeIspunitId);
  const [土建施工单位, set土建施工单位] = React.useState(qs?.土建施工单位 || svp?.土建施工单位);
  const [施工类别, set施工类别] = React.useState(svp?.施工类别);
  const [施工日期, set施工日期] = React.useState(svp?.施工日期);
  const [竣工验收日期, set竣工验收日期] = React.useState(svp?.竣工验收日期);
  const [施工许可证编号, set施工许可证编号] = React.useState(svp?.施工许可证编号);
  const [设计单位, set设计单位] = React.useState(qs?.设计单位 || svp?.设计单位);
  const [设计许可证编号, set设计许可证编号] = React.useState(svp?.设计许可证编号);
  const [产品标准, set产品标准] = React.useState(svp?.产品标准);
  const [设计图号, set设计图号] = React.useState(svp?.设计图号);
  const [质量合格证编号, set质量合格证编号] = React.useState(svp?.质量合格证编号);
  const [安装竣工日期, set安装竣工日期] = React.useState(svp?.安装竣工日期);
  const [固定资产值, set固定资产值] = React.useState(svp?.固定资产值);
  const [设备总重量, set设备总重量] = React.useState(svp?.设备总重量);
  const [大修周期, set大修周期] = React.useState(svp?.大修周期);
  const [控制屏编号, set控制屏编号] = React.useState(svp?.控制屏编号);
  const [曳引机编号, set曳引机编号] = React.useState(svp?.曳引机编号);
  const [电动机编号, set电动机编号] = React.useState(svp?.电动机编号);
  const  pa =JSON.parse( edt?.pa!);
  const [倾斜角度, set倾斜角度] = React.useState(pa?.倾斜角度);
  const [安全钳型号, set安全钳型号] = React.useState(pa?.安全钳型号);
  const [安全钳编号, set安全钳编号] = React.useState(pa?.安全钳编号);
  const [爆炸物质, set爆炸物质] = React.useState(pa?.爆炸物质);
  const [补偿方式, set补偿方式] = React.useState(pa?.补偿方式);
  const [层门型号, set层门型号] = React.useState(pa?.层门型号);
  const [底坑深度, set底坑深度] = React.useState(pa?.底坑深度);
  const [电动机功率, set电动机功率] = React.useState(pa?.电动机功率);

  //直接取得EQP关联的task字段的对象。
  const {task} =eqp;
 // const [ingredients, setIngredients] = React.useState<any>( dt||{} );
  const [, setLocation] = useLocation();

  //console.log("电梯进入 eqp=",　eqp, "; ndt=",ndt);
  //不用JSON.stringify保存到数据库格式不一样，对象直接转String，前端无法取出。必须用json格式{"制造国":"地","设计使用年限":"12"}
  async function confirmation() {
    const newdat={ ...eqp, flo,spec,vl,nnor,cpm,hlf,oldb,lesc,wesc,tm,mtm,buff,rtl,
      aap,prot,doop,limm,opm,lbkd,nbkd,cpa,vital,
      svp: JSON.stringify({制造国,设计使用年限,motorCod,设计日期,土建验收单位,
        makeIspunitId, 土建施工单位,施工类别,施工日期,竣工验收日期,施工许可证编号,设计单位,
        设计许可证编号,产品标准,设计图号,质量合格证编号,安装竣工日期,固定资产值,设备总重量,
        大修周期,控制屏编号,曳引机编号,电动机编号,
       }
      ),
      pa: JSON.stringify({倾斜角度,安全钳型号,安全钳编号,爆炸物质,补偿方式,层门型号,底坑深度,电动机功率,
        }
      )

    };
    await setPam( newdat );
    return newdat;
  }


  return (
      <div
        css={{
          [theme.mediaQueries.md]: {
            height: "auto",
            display: "block"
          }
        }}
      >
        <hr/>
        <Text
          css={{
            flex: 1,
            textAlign: "center",
            [theme.mediaQueries.md]: {
              textAlign: "left"
            }
          }}
          wrap={false}
          variant="h5"
          gutter={false}
        >
          {eqp.cod}电梯技术参数
        </Text>

        <div
          css={{
            flex: 1,
            [theme.mediaQueries.md]: {
              flex: "none"
            }
          }}
        >
          <div>
            <Container>
              <div
                css={{
                  paddingTop: theme.spaces.lg,
                  paddingBottom: theme.spaces.lg
                }}
              >
                <InputGroupLine label={`电梯层数:`}>
                  <SuffixInput
                    type="number"  min={1} max={999}
                    value={ flo || '' }
                    onChange={e => setFlo( e.currentTarget.value||undefined ) }
                  >层</SuffixInput>
                </InputGroupLine>
                <InputGroupLine label={'是否特种电梯？'}>
                  <Check label={'是的'}
                         checked= {spec || false}
                         onChange={e => setSpec(!spec) }
                  />
                </InputGroupLine>
                <InputGroupLine label={ '运行速度'}>
                  <SuffixInput
                    type="number"  min={0} max={300}
                    value={vl || ''}
                    onChange={e => setVl( e.currentTarget.value||undefined ) }
                  >m/s</SuffixInput>
                </InputGroupLine>
                <InputGroupLine label={`是否非标电梯:`}>
                  <Check label={'是的'}
                         checked= {nnor || false}
                         onChange={e => setNnor(!nnor) }
                  />
                </InputGroupLine>
                <InputGroupLine label={`是否属于旧楼加装电梯:`}>
                  <Check label={'是的'}
                         checked= {oldb || false}
                         onChange={e => setOldb(!oldb) }
                  />
                </InputGroupLine>
                <InputGroupLine label={`控制屏型号:`}>
                  <SuffixInput
                    placeholder="层数"
                    value={ cpm || ''}
                    onChange={e => setCpm( e.currentTarget.value||undefined ) }
                  >
                  </SuffixInput>
                </InputGroupLine>
                <InputGroupLine label={`提升高度:`}>
                  <SuffixInput
                    type="number"
                    value={ hlf || ''}
                    onChange={e => setHlf( e.currentTarget.value||undefined ) }
                  >米
                  </SuffixInput>
                </InputGroupLine>
                <InputGroupLine label={`人行道使用区段长度:`}>
                  <SuffixInput
                    type="number"
                    value={ lesc || ''}
                    onChange={e => setLesc( e.currentTarget.value||undefined ) }
                  >米
                  </SuffixInput>
                </InputGroupLine>
                <InputGroupLine label={`名义宽度(自动扶梯/自动人行道):`}>
                  <SuffixInput
                    type="number"
                    value={ wesc || ''}
                    onChange={e => setWesc( e.currentTarget.value||undefined ) }
                  >mm
                  </SuffixInput>
                </InputGroupLine>
                <InputGroupLine label={`曳引机型号:`}>
                  <Input
                    value={ tm || ''}
                    onChange={e => setTm( e.currentTarget.value||undefined ) }
                  >
                  </Input>
                </InputGroupLine>
                <InputGroupLine label={`电动机(驱动主机)型号:`}>
                  <Input
                    value={ mtm || ''}
                    onChange={e => setMtm( e.currentTarget.value||undefined ) }
                  >
                  </Input>
                </InputGroupLine>
                <InputGroupLine label={`缓冲器形式:`}>
                  <Select inputSize="md" css={{minWidth:'140px',fontSize:'1.5rem',padding:'0 1rem'}} divStyle={css`max-width:240px;`}
                          value={ buff || ''}
                          onChange={e => setBuff( e.currentTarget.value||undefined ) }
                  >
                    <option></option>
                    { 缓冲器形式.map((one,i) => (
                      <option key={i}>{one}</option>
                    )) }
                  </Select>
                </InputGroupLine>
                <InputGroupLine label={`额定载荷:`}>
                  <SuffixInput
                    type="number"
                    value={ rtl || ''}
                    onChange={e => setRtl( e.currentTarget.value||undefined ) }
                  >kg
                  </SuffixInput>
                </InputGroupLine>
                 <InputGroupLine label={`加装的附加装置:`}>
                  <ComboBoxDatalist
                    value={ aap || ''}
                    onListChange={v => setAap( v||undefined ) }
                    datalist={加装附加装置}
                  />
                </InputGroupLine>
                <InputGroupLine label={`轿厢意外移动保护装置型号:`}>
                  <Input
                    value={ prot || ''}
                    onChange={e => setProt( e.currentTarget.value||undefined ) }
                  >
                  </Input>
                </InputGroupLine>
                <InputGroupLine label={`开门方式:`}>
                  <InputDatalist
                    value={ doop || ''}
                    onListChange={v => setDoop(v ||undefined)}
                    datalist={开门方式}
                  />
                </InputGroupLine>
                <InputGroupLine label={`限速器型号:`}>
                  <Input
                    value={ limm || ''}
                    onChange={e => setLimm( e.currentTarget.value||undefined ) }
                  />
                </InputGroupLine>
                <InputGroupLine label={`控制方式:`}>
                  <Select inputSize="md" css={{minWidth:'140px',fontSize:'1.5rem',padding:'0 1rem'}} divStyle={css`max-width:240px;`}
                          value={ opm || ''}
                          onChange={e => setOpm( e.currentTarget.value||undefined ) }
                  >
                    <option> </option>
                    { 控制方式.map((one,i) => (
                      <option key={i}>{one}</option>
                    )) }
                  </Select>
                </InputGroupLine>
                <InputGroupLine  label='最后一次制动实验时间:' >
                  <Input type='date'  value={lbkd ||''}
                         onChange={e => setLbkd( e.currentTarget.value||undefined ) } />
                </InputGroupLine>
                <InputGroupLine  label='下次制动实验时间:' >
                  <Input type='date'  value={nbkd ||''}
                         onChange={e => setNbkd( e.currentTarget.value||undefined ) } />
                </InputGroupLine>
                <InputGroupLine label={`控制屏出厂编号:`}>
                  <Input
                    value={ 控制屏编号 || ''}
                    onChange={e => set控制屏编号( e.currentTarget.value||undefined ) }
                  />
                </InputGroupLine>
                <InputGroupLine label={`曳引机出厂编号:`}>
                  <Input
                    value={ 曳引机编号 || ''}
                    onChange={e => set曳引机编号( e.currentTarget.value||undefined ) }
                  />
                </InputGroupLine>
                <InputGroupLine label={`电动机(驱动主机)编号:`}>
                  <Input
                    value={ 电动机编号 || ''}
                    onChange={e => set电动机编号( e.currentTarget.value||undefined ) }
                  />
                </InputGroupLine>

                <Text variant="h5">监察参数</Text>
                <InputGroupLine label={`制造国:`}>
                  <InputDatalist
                    value={ 制造国 || ''}
                    onListChange={v => set制造国(v ||undefined)}
                    datalist={["中国","美国","欧盟"]}
                  />
                </InputGroupLine>
                <InputGroupLine label={`是否重要特种设备:`}>
                  <Check label={'是的'}
                         checked= {vital || false}
                         onChange={e => setVital(vital? undefined:true) }
                  />
                </InputGroupLine>
                <InputGroupLine label={`设计使用年限:`}>
                  <SuffixInput
                    type="number"
                    value={ 设计使用年限 || ''}
                    onChange={e => set设计使用年限( e.currentTarget.value||undefined ) }
                  >年
                  </SuffixInput>
                </InputGroupLine>
                <InputGroupLine label={`事故隐患类别:`}>
                  <Select
                          value={ cpa || ''}
                          onChange={e => setCpa( e.currentTarget.value||undefined ) }
                  >
                    <option> </option>
                    { 事故隐患类别.map((one,i) => (
                      <option key={i} value={i+1}>{one}</option>
                    )) }
                  </Select>
                </InputGroupLine>
                <InputGroupLine label={`固定资产值:`}>
                  <SuffixInput
                    type="number"
                    value={ 固定资产值 || ''}
                    onChange={e => set固定资产值( e.currentTarget.value||undefined ) }
                  >万元
                  </SuffixInput>
                </InputGroupLine>
                <InputGroupLine label={`大修周期:`}>
                  <SuffixInput
                    type="number"
                    value={ 大修周期 || ''}
                    onChange={e => set大修周期( e.currentTarget.value||undefined ) }
                  >月
                  </SuffixInput>
                </InputGroupLine>

                <Text variant="h5">许可用的参数</Text>
                <InputGroupLine label={`电动机(驱动主机)编号:`}>
                  <Input value={ motorCod  || ''}
                         onChange={e => setMotorCod( e.currentTarget.value||undefined ) }
                  />
                </InputGroupLine>
                <InputGroupLine label={`设计日期:`}>
                  <Input type='date'  value={ 设计日期  || ''}
                         onChange={e => set设计日期( e.currentTarget.value||undefined ) } />
                </InputGroupLine>
                <InputGroupLine label={'制造监检机构'}>
                  <UnitOrChoose id={makeIspunitId  || ''} emodel={'电梯'} emid={id} field={'makeIspunitId'}
                                onCancel={() => {
                                  setMakeIspunitId( undefined )
                                }}
                                onDialog={async () => { await setNdt(await confirmation()); } }
                  />
                </InputGroupLine>
                <InputGroupLine label={`土建施工单位:`}>
                  <UnitOrChoose id={土建施工单位  || ''} emodel={'电梯'} emid={id} field={'土建施工单位'}
                                onCancel={() => {
                                  set土建施工单位( undefined )
                                }}
                                onDialog={async () => { await setNdt(await confirmation()); } }
                  />
                </InputGroupLine>
                <InputGroupLine label={`土建验收单位:`}>
                  <UnitOrChoose id={土建验收单位  || ''} emodel={'电梯'} emid={id} field={'土建验收单位'}
                                onCancel={() => {
                                  set土建验收单位( undefined )
                                }}
                                onDialog={async () => { await setNdt(await confirmation()); } }
                  />
                </InputGroupLine>
                <Text variant="h5">监检准入参数</Text>
                <InputGroupLine label={`施工类别:`}>
                  <ComboBoxDatalist
                    value={ 施工类别 || ''}
                    onListChange={v => set施工类别( v||undefined ) }
                    datalist={施工类别s}
                  />
                </InputGroupLine>
                <InputGroupLine label={`施工日期:`}>
                  <Input type='date'  value={ 施工日期  || ''}
                         onChange={e => set施工日期( e.currentTarget.value||undefined ) } />
                </InputGroupLine>
                <InputGroupLine label={`竣工验收日期:`}>
                  <Input type='date'  value={ 竣工验收日期  || ''}
                         onChange={e => set竣工验收日期( e.currentTarget.value||undefined ) } />
                </InputGroupLine>
                <InputGroupLine label={`施工许可证编号:`}>
                  <Input
                    value={ 施工许可证编号 || ''}
                    onChange={e => set施工许可证编号( e.currentTarget.value||undefined ) }
                  >
                  </Input>
                </InputGroupLine>
                <InputGroupLine label={`设计单位:`}>
                  <UnitOrChoose id={设计单位  || ''} emodel={'电梯'} emid={id} field={'设计单位'}
                                onCancel={() => {
                                  set设计单位( undefined )
                                }}
                                onDialog={async () => { await setNdt(await confirmation()); } }
                  />
                </InputGroupLine>
                <InputGroupLine label={`设计许可证编号:`}>
                  <Input
                    value={ 设计许可证编号 || ''}
                    onChange={e => set设计许可证编号( e.currentTarget.value||undefined ) }
                  >
                  </Input>
                </InputGroupLine>
                <InputGroupLine label={`产品标准:`}>
                  <Input
                    value={ 产品标准 || ''}
                    onChange={e => set产品标准( e.currentTarget.value||undefined ) }
                  >
                  </Input>
                </InputGroupLine>
                <InputGroupLine label={`设计图号:`}>
                  <Input
                    value={ 设计图号 || ''}
                    onChange={e => set设计图号( e.currentTarget.value||undefined ) }
                  >
                  </Input>
                </InputGroupLine>
                <InputGroupLine label={`质量证明书、产品合格证编号:`}>
                  <Input
                    value={ 质量合格证编号 || ''}
                    onChange={e => set质量合格证编号( e.currentTarget.value||undefined ) }
                  >
                  </Input>
                </InputGroupLine>
                <InputGroupLine label={`安装竣工日期:`}>
                  <Input type='date'  value={ 安装竣工日期  || ''}
                         onChange={e => set安装竣工日期( e.currentTarget.value||undefined ) } />
                </InputGroupLine>
                <InputGroupLine label={`设备总重量:`}>
                  <SuffixInput
                    type="number"
                    value={ 设备总重量 || ''}
                    onChange={e => set设备总重量( e.currentTarget.value||undefined ) }
                  >kg
                  </SuffixInput>
                </InputGroupLine>

                <Text variant="h5">常用参数</Text>
                <InputGroupLine label={`倾斜角度(自动扶梯/自动人行道)：`}>
                  <SuffixInput
                    type="number"
                    value={ 倾斜角度 || ''}
                    onChange={e => set倾斜角度( e.currentTarget.value||undefined ) }
                  >度
                  </SuffixInput>
                </InputGroupLine>
                <InputGroupLine label={`安全钳型号:`}>
                  <Input  value={ 安全钳型号 || ''}
                    onChange={e => set安全钳型号( e.currentTarget.value||undefined ) }
                  />
                </InputGroupLine>
                <InputGroupLine label={`安全钳编号:`}>
                  <Input  value={ 安全钳编号 || ''}
                          onChange={e => set安全钳编号( e.currentTarget.value||undefined ) }
                  />
                </InputGroupLine>
                <InputGroupLine label={`层门型号:`}>
                  <Input  value={ 层门型号 || ''}
                       onChange={e => set层门型号( e.currentTarget.value||undefined ) } />
                </InputGroupLine>
                <InputGroupLine label={`底坑深度:`}>
                  <SuffixInput type="number" value={ 底坑深度 || ''}
                      onChange={e => set底坑深度( e.currentTarget.value||undefined ) }
                  >m</SuffixInput>
                </InputGroupLine>
                <InputGroupLine label={`电动机功率:`}>
                  <SuffixInput type="number" value={ 电动机功率 || ''}
                               onChange={e => set电动机功率( e.currentTarget.value||undefined ) }
                  >kw</SuffixInput>
                </InputGroupLine>

                <Text variant="h5">其它参数</Text>
                <InputGroupLine label={`爆炸物质(防爆电梯):`}>
                  <Input  value={ 爆炸物质 || ''}
                      onChange={e => set爆炸物质( e.currentTarget.value||undefined ) } />
                </InputGroupLine>
                <InputGroupLine label={`补偿方式:`}>
                  <Select  value={ 补偿方式 || ''}
                          onChange={e => set补偿方式( e.currentTarget.value||undefined ) } >
                    <option></option>
                    { 补偿方式s.map((one,i) => <option key={i} >{one}</option> ) }
                  </Select>
                </InputGroupLine>

                <Button
                  size="lg"
                  intent="primary"
                  iconAfter={<IconArrowRight />}
                  onPress={ async () => {
                    //不用JSON.stringify保存到数据库格式不一样，对象直接转String，前端无法取出。必须用json格式{"制造国":"地","设计使用年限":"12"}
                    await confirmation();
                  } }
                >
                  确认修改检查
                </Button>
              </div>
            </Container>
          </div>
        </div>

      </div>
  );
};

