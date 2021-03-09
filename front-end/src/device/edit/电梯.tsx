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
  SuffixInput,
  IconArrowRight,
  Check,
  Input,
  Select,
  ComboBox,
  ComboBoxInput,
  ComboBoxList,
  ComboBoxOption,
  IconButton,
  IconLayers,
  IconX,
  InputDatalist,
  ComboBoxDatalist,InputLine,LineColumn,
  IconToggleRight, IconToggleLeft, CheckSwitch
} from "customize-easy-ui-component";

import { Link as RouterLink,  useLocation } from "wouter";
import { css } from "@emotion/react";
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
export const 电动机类型s=["交流","YFD160M-6","YFD160L1-6"];
export const 顶升形式s=["间接顶升","非直顶式", "直顶式","侧顶式","曳引式","间接式","侧置式"];
export const 对重导轨型式s=["T型导轨","空心导轨","热轧型钢导轨"];
export const 轿厢装修状态=["无预留装修，轿厢无装修；轿顶未装空调","无预留装修，轿厢已装修；轿顶未装空调","无预留装修，轿厢无装修；轿顶装有空调","无预留装修，轿厢已装修；轿顶装有空调","有预留装修200kg，轿厢未装修；轿顶未装空调"];
export const 区域防爆等级=["2区","ⅡB", "ⅡBT4", "ⅡB级","Ⅱ级","1区"];
export const 驱动方式s=["曳引式","VVVF","曳引驱动","强制式","链条驱动","KDL16","交流"];
export const 上行保护装置形式=["制动器","夹绳器","曳引轮制动器","钢丝绳制动器","双向安全钳","安全钳","轮式附加制动器"];
export const 拖动方式=['交流单速','交流双速','变极调速','交流调压调速','交流变频','直流晶闸管直接','柱塞直顶','柱塞侧置'];
export const 油缸形式s=["浸油式", "非浸油式","油浸式","双节式（侧置）"];



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
  //?&土建施单=190 底层URL 问号?后面那个&是必需的分割符号，两符号都不能省略。
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
  const [年限, set年限] = React.useState(svp?.年限);
  const [设计日期, set设计日期] = React.useState(svp?.设计日期);
  const [土建验单, set土建验单] = React.useState(qs?.土建验单 || svp?.土建验单);
  const [造监检单, set造监检单] = React.useState(qs?.造监检单 || svp?.造监检单);
  const [土建施单, set土建施单] = React.useState(qs?.土建施单 || svp?.土建施单);
  const [施工类别, set施工类别] = React.useState(svp?.施工类别);
  const [施工日期, set施工日期] = React.useState(svp?.施工日期);
  const [竣验日, set竣验日] = React.useState(svp?.竣验日);
  const [施工号, set施工号] = React.useState(svp?.施工号);
  const [设计单位, set设计单位] = React.useState(qs?.设计单位 || svp?.设计单位);
  const [设计许号, set设计许号] = React.useState(svp?.设计许号);
  const [产品标准, set产品标准] = React.useState(svp?.产品标准);
  const [设计图号, set设计图号] = React.useState(svp?.设计图号);
  const [合格证号, set合格证号] = React.useState(svp?.合格证号);
  const [安竣日, set安竣日] = React.useState(svp?.安竣日);
  const [固定资产值, set固定资产值] = React.useState(svp?.固定资产值);
  const [设备总重量, set设备总重量] = React.useState(svp?.设备总重量);
  const [大修周期, set大修周期] = React.useState(svp?.大修周期);
  const [控制屏编号, set控制屏编号] = React.useState(svp?.控制屏编号);
  const [曳引号, set曳引号] = React.useState(svp?.曳引号);
  const [主机号, set主机号] = React.useState(svp?.主机号);
  const  pa =JSON.parse( edt?.pa!);
  const [倾斜角度, set倾斜角度] = React.useState(pa?.倾斜角度);
  const [安全钳型号, set安全钳型号] = React.useState(pa?.安全钳型号);
  const [安全钳编号, set安全钳编号] = React.useState(pa?.安全钳编号);
  const [爆炸物质, set爆炸物质] = React.useState(pa?.爆炸物质);
  const [补偿方式, set补偿方式] = React.useState(pa?.补偿方式);
  const [层门型号, set层门型号] = React.useState(pa?.层门型号);
  const [底坑深度, set底坑深度] = React.useState(pa?.底坑深度);
  const [电动机功率, set电动机功率] = React.useState(pa?.电动机功率);
  const [电动机类型, set电动机类型] = React.useState(pa?.电动机类型);
  const [电动机转速, set电动机转速] = React.useState(pa?.电动机转速);
  const [电梯门数, set电梯门数] = React.useState(pa?.电梯门数);
  const [电梯站数, set电梯站数] = React.useState(pa?.电梯站数);
  const [顶层高度, set顶层高度] = React.useState(pa?.顶层高度);
  const [顶升形式, set顶升形式] = React.useState(pa?.顶升形式);
  const [导轨型式, set导轨型式] = React.useState(pa?.导轨型式);
  const [对重轨距, set对重轨距] = React.useState(pa?.对重轨距);
  const [对重块数, set对重块数] = React.useState(pa?.对重块数);
  const [对重限速号, set对重限速号] = React.useState(pa?.对重限速号);
  const [对重限型号, set对重限型号] = React.useState(pa?.对重限型号);
  const [额定电流, set额定电流] = React.useState(pa?.额定电流);
  const [额定载人, set额定载人] = React.useState(pa?.额定载人);
  const [缓冲器编号, set缓冲器编号] = React.useState(pa?.缓冲器编号);
  const [缓冲器型号, set缓冲器型号] = React.useState(pa?.缓冲器型号);
  const [缓冲器厂家, set缓冲器厂家] = React.useState(pa?.缓冲器厂家);
  const [轿厢高, set轿厢高] = React.useState(pa?.轿厢高);
  const [轿厢宽, set轿厢宽] = React.useState(pa?.轿厢宽);
  const [轿厢深, set轿厢深] = React.useState(pa?.轿厢深);
  const [轿厢轨距, set轿厢轨距] = React.useState(pa?.轿厢轨距);
  const [上行限电速, set上行限电速] = React.useState(pa?.上行限电速);
  const [上行限机速, set上行限机速] = React.useState(pa?.上行限机速);
  const [下行限电速, set下行限电速] = React.useState(pa?.下行限电速);
  const [下行限机速, set下行限机速] = React.useState(pa?.下行限机速);
  const [移动保护号, set移动保护号] = React.useState(pa?.移动保护号);
  const [移动保护型, set移动保护型] = React.useState(pa?.移动保护型);
  const [装修, set装修] = React.useState(pa?.装修);
  const [锁型号, set锁型号] = React.useState(pa?.锁型号);
  const [区域防爆, set区域防爆] = React.useState(pa?.区域防爆);
  const [驱动方式, set驱动方式] = React.useState(pa?.驱动方式);
  const [上护装置, set上护装置] = React.useState(pa?.上护装置);
  const [上护型号, set上护型号] = React.useState(pa?.上护型号);
  const [上护编号, set上护编号] = React.useState(pa?.上护编号);
  const [上行额速, set上行额速] = React.useState(pa?.上行额速);
  const [船梯, set船梯] = React.useState(pa?.船梯);
  const [公共交通, set公共交通] = React.useState(pa?.公共交通);
  const [汽车电梯, set汽车电梯] = React.useState(pa?.汽车电梯);
  const [手机信, set手机信] = React.useState(pa?.手机信);
  const [速比, set速比] = React.useState(pa?.速比);
  const [拖动, set拖动] = React.useState(pa?.拖动);
  const [限速器号, set限速器号] = React.useState(pa?.限速器号);
  const [限绳直径, set限绳直径] = React.useState(pa?.限绳直径);
  const [曳引比, set曳引比] = React.useState(pa?.曳引比);
  const [轮节径, set轮节径] = React.useState(pa?.轮节径);
  const [绳数, set绳数] = React.useState(pa?.绳数);
  const [是钢带, set是钢带] = React.useState(pa?.是钢带);
  const [钢带规格, set钢带规格] = React.useState(pa?.钢带规格);
  const [绳直径, set绳直径] = React.useState(pa?.绳直径);
  const [梯级宽度, set梯级宽度] = React.useState(pa?.梯级宽度);
  const [下额定速, set下额定速] = React.useState(pa?.下额定速);
  const [限机械速, set限机械速] = React.useState(pa?.限机械速);
  const [悬挂绳数, set悬挂绳数] = React.useState(pa?.悬挂绳数);
  const [悬挂绳径, set悬挂绳径] = React.useState(pa?.悬挂绳径);
  const [泵编号, set泵编号] = React.useState(pa?.泵编号);
  const [泵功率, set泵功率] = React.useState(pa?.泵功率);
  const [泵流量, set泵流量] = React.useState(pa?.泵流量);
  const [泵型号, set泵型号] = React.useState(pa?.泵型号);
  const [泵转速, set泵转速] = React.useState(pa?.泵转速);
  const [液油型号, set液油型号] = React.useState(pa?.液油型号);
  const [油缸数, set油缸数] = React.useState(pa?.油缸数);
  const [油缸形式, set油缸形式] = React.useState(pa?.油缸形式);
  const [防爆标志, set防爆标志] = React.useState(pa?.防爆标志);
  const [防爆证号, set防爆证号] = React.useState(pa?.防爆证号);


  //直接取得EQP关联的task字段的对象。
  const {task} =eqp;
  // const [ingredients, setIngredients] = React.useState<any>( dt||{} );
  const [, setLocation] = useLocation();

  //console.log("电梯进入 eqp=",　eqp, "; ndt=",ndt);
  //不用JSON.stringify保存到数据库格式不一样，对象直接转String，前端无法取出。必须用json格式{"制造国":"地","年限":"12"}
  async function confirmation() {
    const newdat={ ...eqp, flo,spec,vl,nnor,cpm,hlf,oldb,lesc,wesc,tm,mtm,buff,rtl,
      aap,prot,doop,limm,opm,lbkd,nbkd,cpa,vital,
      svp: JSON.stringify({主机号,制造国,年限,设计日期,土建验单,
          造监检单, 土建施单,施工类别,施工日期,竣验日,施工号,设计单位,
          设计许号,产品标准,设计图号,合格证号,安竣日,固定资产值,设备总重量,
          大修周期,控制屏编号,曳引号,
        }
      ),
      pa: JSON.stringify({倾斜角度,安全钳型号,安全钳编号,爆炸物质,补偿方式,层门型号,底坑深度,电动机功率,电动机类型,
          电动机转速,电梯门数,电梯站数,顶层高度,顶升形式,导轨型式,对重轨距,对重块数,对重限速号,对重限型号,额定电流,额定载人,
          缓冲器编号,缓冲器型号,缓冲器厂家,轿厢高,轿厢宽,轿厢深,轿厢轨距,上行限电速,上行限机速,下行限电速,下行限机速,移动保护号,
          移动保护型,装修,锁型号,区域防爆,驱动方式,上护装置,上护型号,上护编号,上行额速,船梯,公共交通,汽车电梯,手机信,速比,拖动,
          限速器号,限绳直径,曳引比,轮节径,绳数, 是钢带, 钢带规格:是钢带?钢带规格:undefined,  绳直径:是钢带?undefined:绳直径,
          梯级宽度,下额定速,限机械速,悬挂绳数,悬挂绳径,泵编号,泵功率,
          泵流量,泵型号,泵转速,液油型号,油缸数,油缸形式,防爆标志,防爆证号
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

            <LineColumn >

              <InputLine label={`电梯层数:`}>
                <SuffixInput
                  type="number"  min={1} max={999}
                  value={ flo || '' }
                  onChange={e => setFlo( e.currentTarget.value||undefined ) }
                >层</SuffixInput>
              </InputLine>
              <InputLine label={'是否特种电梯？'}>
                <CheckSwitch
                  checked= {spec || false}
                  onChange={e => setSpec(!spec) }
                />
              </InputLine>
              <InputLine label={ '运行速度'}>
                <SuffixInput
                  type="number"  min={0} max={300}
                  value={vl || ''}
                  onChange={e => setVl( e.currentTarget.value||undefined ) }
                >m/s</SuffixInput>
              </InputLine>
              <InputLine label={`是否非标电梯:`}>
                <CheckSwitch
                  checked= {nnor || false}
                  onChange={e => setNnor(!nnor) }
                />
              </InputLine>
              <InputLine label={`是否属于旧楼加装电梯:`}>
                <CheckSwitch
                  checked= {oldb || false}
                  onChange={e => setOldb(!oldb) }
                />
              </InputLine>
              <InputLine label={`控制屏型号:`}>
                <SuffixInput
                  placeholder="层数"
                  value={ cpm || ''}
                  onChange={e => setCpm( e.currentTarget.value||undefined ) }
                >
                </SuffixInput>
              </InputLine>
              <InputLine label={`提升高度:`}>
                <SuffixInput
                  type="number"
                  value={ hlf || ''}
                  onChange={e => setHlf( e.currentTarget.value||undefined ) }
                >米
                </SuffixInput>
              </InputLine>
              <InputLine label={`人行道使用区段长度:`}>
                <SuffixInput
                  type="number"
                  value={ lesc || ''}
                  onChange={e => setLesc( e.currentTarget.value||undefined ) }
                >米
                </SuffixInput>
              </InputLine>
              <InputLine label={`名义宽度(自动扶梯/自动人行道):`}>
                <SuffixInput
                  type="number"
                  value={ wesc || ''}
                  onChange={e => setWesc( e.currentTarget.value||undefined ) }
                >mm
                </SuffixInput>
              </InputLine>
              <InputLine label={`曳引机型号:`}>
                <Input
                  value={ tm || ''}
                  onChange={e => setTm( e.currentTarget.value||undefined ) }
                >
                </Input>
              </InputLine>
              <InputLine label={`电动机(驱动主机)型号:`}>
                <Input
                  value={ mtm || ''}
                  onChange={e => setMtm( e.currentTarget.value||undefined ) }
                >
                </Input>
              </InputLine>
              <InputLine label={`缓冲器形式:`}>
                <Select inputSize="md"
                        value={ buff || ''}
                        onChange={e => setBuff( e.currentTarget.value||undefined ) }
                >
                  <option></option>
                  { 缓冲器形式.map((one,i) => (
                    <option key={i}>{one}</option>
                  )) }
                </Select>
              </InputLine>
              <InputLine label={`额定载荷:`}>
                <SuffixInput
                  type="number"
                  value={ rtl || ''}
                  onChange={e => setRtl( e.currentTarget.value||undefined ) }
                >kg
                </SuffixInput>
              </InputLine>
              <InputLine label={`加装的附加装置:`}>
                <ComboBoxDatalist
                  value={ aap || ''}
                  onListChange={v => setAap( v||undefined ) }
                  datalist={加装附加装置}
                />
              </InputLine>
              <InputLine label={`轿厢意外移动保护装置型号:`}>
                <Input
                  value={ prot || ''}
                  onChange={e => setProt( e.currentTarget.value||undefined ) }
                >
                </Input>
              </InputLine>
              <InputLine label={`开门方式:`}>
                <InputDatalist
                  value={ doop || ''}
                  onListChange={v => setDoop(v ||undefined)}
                  datalist={开门方式}
                />
              </InputLine>
              <InputLine label={`限速器型号:`}>
                <Input
                  value={ limm || ''}
                  onChange={e => setLimm( e.currentTarget.value||undefined ) }
                />
              </InputLine>
              <InputLine label={`控制方式:`}>
                <Select inputSize="md"
                        value={ opm || ''}
                        onChange={e => setOpm( e.currentTarget.value||undefined ) }
                >
                  <option> </option>
                  { 控制方式.map((one,i) => (
                    <option key={i}>{one}</option>
                  )) }
                </Select>
              </InputLine>
              <InputLine  label='最后一次制动实验时间:' >
                <Input type='date'  value={lbkd ||''}
                       onChange={e => setLbkd( e.currentTarget.value||undefined ) } />
              </InputLine>
              <InputLine  label='下次制动实验时间:' >
                <Input type='date'  value={nbkd ||''}
                       onChange={e => setNbkd( e.currentTarget.value||undefined ) } />
              </InputLine>
              <InputLine label={`控制屏出厂编号:`}>
                <Input
                  value={ 控制屏编号 || ''}
                  onChange={e => set控制屏编号( e.currentTarget.value||undefined ) }
                />
              </InputLine>
              <InputLine label={`曳引机出厂编号:`}>
                <Input
                  value={ 曳引号 || ''}
                  onChange={e => set曳引号( e.currentTarget.value||undefined ) }
                />
              </InputLine>
              <InputLine label={`电动机(驱动主机)编号:`}>
                <Input
                  value={ 主机号 || ''}
                  onChange={e => set主机号( e.currentTarget.value||undefined ) }
                />
              </InputLine>
            </LineColumn>
            <Text variant="h5">监察参数</Text>
            <LineColumn >
              <InputLine label={`制造国:`}>
                <InputDatalist
                  value={ 制造国 || ''}
                  onListChange={v => set制造国(v ||undefined)}
                  datalist={["中国","美国","欧盟"]}
                />
              </InputLine>
              <InputLine label={`是否重要特种设备:`}>
                <CheckSwitch
                  checked= {vital || false}
                  onChange={e => setVital(vital? undefined:true) }
                />
              </InputLine>
              <InputLine label={`设计使用年限:`}>
                <SuffixInput
                  type="number"
                  value={ 年限 || ''}
                  onChange={e => set年限( e.currentTarget.value||undefined ) }
                >年
                </SuffixInput>
              </InputLine>
              <InputLine label={`事故隐患类别:`}>
                <Select
                  value={ cpa || ''}
                  onChange={e => setCpa( e.currentTarget.value||undefined ) }
                >
                  <option> </option>
                  { 事故隐患类别.map((one,i) => (
                    <option key={i} value={i+1}>{one}</option>
                  )) }
                </Select>
              </InputLine>
              <InputLine label={`固定资产值:`}>
                <SuffixInput
                  type="number"
                  value={ 固定资产值 || ''}
                  onChange={e => set固定资产值( e.currentTarget.value||undefined ) }
                >万元
                </SuffixInput>
              </InputLine>
              <InputLine label={`大修周期:`}>
                <SuffixInput
                  type="number"
                  value={ 大修周期 || ''}
                  onChange={e => set大修周期( e.currentTarget.value||undefined ) }
                >月
                </SuffixInput>
              </InputLine>
            </LineColumn>

            <Text variant="h5">许可用的参数</Text>
            <LineColumn >
              <InputLine label={`设计日期:`}>
                <Input type='date'  value={ 设计日期  || ''}
                       onChange={e => set设计日期( e.currentTarget.value||undefined ) } />
              </InputLine>
              <InputLine label={'制造监检机构'}>
                <UnitOrChoose id={造监检单  || ''} emodel={'电梯'} emid={id} field={'造监检单'}
                              onCancel={() => {
                                set造监检单( undefined )
                              }}
                              onDialog={async () => { await setNdt(await confirmation()); } }
                />
              </InputLine>
              <InputLine label={`土建施工单位:`}>
                <UnitOrChoose id={土建施单  || ''} emodel={'电梯'} emid={id} field={'土建施单'}
                              onCancel={() => {
                                set土建施单( undefined )
                              }}
                              onDialog={async () => { await setNdt(await confirmation()); } }
                />
              </InputLine>
              <InputLine label={`土建验收单位:`}>
                <UnitOrChoose id={土建验单  || ''} emodel={'电梯'} emid={id} field={'土建验单'}
                              onCancel={() => {
                                set土建验单( undefined )
                              }}
                              onDialog={async () => { await setNdt(await confirmation()); } }
                />
              </InputLine>
            </LineColumn>
            <Text variant="h5">监检准入参数</Text>
            <LineColumn >
              <InputLine label={`施工类别:`}>
                <ComboBoxDatalist  value={ 施工类别 || ''}
                                   onListChange={v => set施工类别( v||undefined ) }
                                   datalist={施工类别s}  />
              </InputLine>
              <InputLine label={`施工日期:`}>
                <Input type='date'  value={ 施工日期  || ''}
                       onChange={e => set施工日期( e.currentTarget.value||undefined ) } />
              </InputLine>
              <InputLine label={`竣工验收日期:`}>
                <Input type='date'  value={ 竣验日  || ''}
                       onChange={e => set竣验日( e.currentTarget.value||undefined ) } />
              </InputLine>
              <InputLine label={`施工许可证编号:`}>
                <Input
                  value={ 施工号 || ''}
                  onChange={e => set施工号( e.currentTarget.value||undefined ) }
                >
                </Input>
              </InputLine>
              <InputLine label={`设计单位:`}>
                <UnitOrChoose id={设计单位  || ''} emodel={'电梯'} emid={id} field={'设计单位'}
                              onCancel={() => {
                                set设计单位( undefined )
                              }}
                              onDialog={async () => { await setNdt(await confirmation()); } }
                />
              </InputLine>
              <InputLine label={`设计许可证编号:`}>
                <Input
                  value={ 设计许号 || ''}
                  onChange={e => set设计许号( e.currentTarget.value||undefined ) }
                >
                </Input>
              </InputLine>
              <InputLine label={`产品标准:`}>
                <Input
                  value={ 产品标准 || ''}
                  onChange={e => set产品标准( e.currentTarget.value||undefined ) }
                >
                </Input>
              </InputLine>
              <InputLine label={`设计图号:`}>
                <Input
                  value={ 设计图号 || ''}
                  onChange={e => set设计图号( e.currentTarget.value||undefined ) }
                >
                </Input>
              </InputLine>
              <InputLine label={`质量证明书、产品合格证编号:`}>
                <Input
                  value={ 合格证号 || ''}
                  onChange={e => set合格证号( e.currentTarget.value||undefined ) }
                >
                </Input>
              </InputLine>
              <InputLine label={`安装竣工日期:`}>
                <Input type='date'  value={ 安竣日  || ''}
                       onChange={e => set安竣日( e.currentTarget.value||undefined ) } />
              </InputLine>
              <InputLine label={`设备总重量:`}>
                <SuffixInput
                  type="number"
                  value={ 设备总重量 || ''}
                  onChange={e => set设备总重量( e.currentTarget.value||undefined ) }
                >kg
                </SuffixInput>
              </InputLine>
            </LineColumn>
            <Text variant="h5">常用参数</Text>
            <LineColumn >
              <InputLine label={`倾斜角度(自动扶梯/自动人行道)：`}>
                <SuffixInput
                  type="number"
                  value={ 倾斜角度 || ''}
                  onChange={e => set倾斜角度( e.currentTarget.value||undefined ) }
                >度
                </SuffixInput>
              </InputLine>
              <InputLine label={`安全钳型号:`}>
                <Input  value={ 安全钳型号 || ''}
                        onChange={e => set安全钳型号( e.currentTarget.value||undefined ) }
                />
              </InputLine>
              <InputLine label={`安全钳编号:`}>
                <Input  value={ 安全钳编号 || ''}
                        onChange={e => set安全钳编号( e.currentTarget.value||undefined ) }
                />
              </InputLine>
              <InputLine label={`层门型号:`}>
                <Input  value={ 层门型号 || ''}
                        onChange={e => set层门型号( e.currentTarget.value||undefined ) } />
              </InputLine>
              <InputLine label={`底坑深度:`}>
                <SuffixInput type="number" value={ 底坑深度 || ''}
                             onChange={e => set底坑深度( e.currentTarget.value||undefined ) }
                >m</SuffixInput>
              </InputLine>
              <InputLine label={`电动机功率:`}>
                <SuffixInput type="number" value={ 电动机功率 || ''}
                             onChange={e => set电动机功率( e.currentTarget.value||undefined ) }
                >kw</SuffixInput>
              </InputLine>
              <InputLine label={`电动机转速:`}>
                <Input  value={ 电动机转速 || ''}
                        onChange={e => set电动机转速( e.currentTarget.value||undefined ) } />
              </InputLine>
              <InputLine label={`电梯门数:`}>
                <SuffixInput type="number" value={ 电梯门数 || ''}
                             onChange={e => set电梯门数( e.currentTarget.value||undefined ) }
                >个</SuffixInput>
              </InputLine>
              <InputLine label={`电梯站数:`}>
                <SuffixInput type="number" value={ 电梯站数 || ''}
                             onChange={e => set电梯站数( e.currentTarget.value||undefined ) }
                >个</SuffixInput>
              </InputLine>
              <InputLine label={`顶层高度:`}>
                <SuffixInput type="number" value={ 顶层高度 || ''}
                             onChange={e => set顶层高度( e.currentTarget.value||undefined ) }
                >m</SuffixInput>
              </InputLine>
              <InputLine label={`对重轨距:`}>
                <SuffixInput type="number" value={ 对重轨距 || ''}
                             onChange={e => set对重轨距( e.currentTarget.value||undefined ) }
                >mm</SuffixInput>
              </InputLine>
              <InputLine label={`对重块数量:`}>
                <SuffixInput type="number" value={ 对重块数 || ''}
                             onChange={e => set对重块数( e.currentTarget.value||undefined ) }
                >块</SuffixInput>
              </InputLine>
              <InputLine label={`对重限速器编号:`}>
                <Input  value={ 对重限速号 || ''}
                        onChange={e => set对重限速号( e.currentTarget.value||undefined ) } />
              </InputLine>
              <InputLine label={`对重限速器型号:`}>
                <Input  value={ 对重限型号 || ''}
                        onChange={e => set对重限型号( e.currentTarget.value||undefined ) } />
              </InputLine>
              <InputLine label={`额定电流:`}>
                <SuffixInput type="number" value={ 额定电流 || ''}
                             onChange={e => set额定电流( e.currentTarget.value||undefined ) }
                >A</SuffixInput>
              </InputLine>
              <InputLine label={`额定载人数:`}>
                <SuffixInput type="number" value={ 额定载人 || ''}
                             onChange={e => set额定载人( e.currentTarget.value||undefined ) }
                >个人</SuffixInput>
              </InputLine>
              <InputLine label={`缓冲器编号:`}>
                <Input  value={ 缓冲器编号 || ''}
                        onChange={e => set缓冲器编号( e.currentTarget.value||undefined ) } />
              </InputLine>
              <InputLine label={`缓冲器型号:`}>
                <Input  value={ 缓冲器型号 || ''}
                        onChange={e => set缓冲器型号( e.currentTarget.value||undefined ) } />
              </InputLine>
              <InputLine label={`缓冲器制造单位:`}>
                <Input  value={ 缓冲器厂家 || ''}
                        onChange={e => set缓冲器厂家( e.currentTarget.value||undefined ) } />
              </InputLine>
              <InputLine label={`轿厢轨距:`}>
                <SuffixInput type="number" value={ 轿厢轨距 || ''}
                             onChange={e => set轿厢轨距( e.currentTarget.value||undefined ) }
                >mm</SuffixInput>
              </InputLine>
              <InputLine label={`轿厢上行限速器电气动作速度:`}>
                <SuffixInput  value={ 上行限电速 || ''}
                              onChange={e => set上行限电速( e.currentTarget.value||undefined ) }
                >m/s</SuffixInput>
              </InputLine>
              <InputLine label={`轿厢上行限速器机械动作速度:`}>
                <SuffixInput  value={ 上行限机速 || ''}
                              onChange={e => set上行限机速( e.currentTarget.value||undefined ) }
                >m/s</SuffixInput>
              </InputLine>
              <InputLine label={`轿厢下行限速器电气动作速度:`}>
                <SuffixInput  value={ 下行限电速 || ''}
                              onChange={e => set下行限电速( e.currentTarget.value||undefined ) }
                >m/s</SuffixInput>
              </InputLine>
              <InputLine label={`轿厢下行限速器机械动作速度:`}>
                <SuffixInput  value={ 下行限机速 || ''}
                              onChange={e => set下行限机速( e.currentTarget.value||undefined ) }
                >m/s</SuffixInput>
              </InputLine>
              <InputLine label={`轿厢意外移动保护装置编号:`}>
                <Input  value={ 移动保护号 || ''}
                        onChange={e => set移动保护号( e.currentTarget.value||undefined ) } />
              </InputLine>
              <InputLine label={`轿厢意外移动保护装置型号:`}>
                <Input  value={ 移动保护型 || ''}
                        onChange={e => set移动保护型( e.currentTarget.value||undefined ) } />
              </InputLine>
              <InputLine label={`轿厢装修状态:`}>
                <InputDatalist  value={ 装修 || ''}
                                onListChange={v => set装修(v ||undefined)}
                                datalist={轿厢装修状态} />
              </InputLine>
              <InputLine label={`门锁型号(液压电梯):`}>
                <Input  value={ 锁型号 || ''}
                        onChange={e => set锁型号( e.currentTarget.value||undefined ) } />
              </InputLine>
              <InputLine label={`上行保护装置形式:`}>
                <ComboBoxDatalist  value={ 上护装置 || ''}
                                   onListChange={v => set上护装置( v||undefined ) }
                                   datalist={上行保护装置形式}  />
              </InputLine>
              <InputLine label={`上行保护装置型号:`}>
                <Input  value={ 上护型号 || ''}
                        onChange={e => set上护型号( e.currentTarget.value||undefined ) } />
              </InputLine>
              <InputLine label={`上行超速保护装置编号:`}>
                <Input  value={ 上护编号 || ''}
                        onChange={e => set上护编号( e.currentTarget.value||undefined ) } />
              </InputLine>
              <InputLine label={`是否手机信号覆盖:`}>
                <CheckSwitch  checked= {手机信 || false}
                              onChange={e => set手机信(手机信? undefined:true) } />
              </InputLine>
              <InputLine label={`速比:`}>
                <Input  value={ 速比 || ''}
                        onChange={e => set速比( e.currentTarget.value||undefined ) } />
              </InputLine>
              <InputLine label={`拖动方式:`}>
                <Select  value={ 拖动 || ''}
                         onChange={e => set拖动( e.currentTarget.value||undefined ) } >
                  <option></option>
                  { 拖动方式.map((one,i) => <option key={i} >{one}</option> ) }
                </Select>
              </InputLine>
              <InputLine label={`限速器出厂编号:`}>
                <Input  value={ 限速器号 || ''}
                        onChange={e => set限速器号( e.currentTarget.value||undefined ) } />
              </InputLine>
              <InputLine label={`限速器绳直径:`}>
                <SuffixInput type="number" value={ 限绳直径 || ''}
                             onChange={e => set限绳直径( e.currentTarget.value||undefined ) }
                >mm</SuffixInput>
              </InputLine>
              <InputLine label={`曳引比:`}>
                <Input  value={ 曳引比 || ''}
                        onChange={e => set曳引比( e.currentTarget.value||undefined ) } />
              </InputLine>
              <InputLine label={`曳引轮节径:`}>
                <SuffixInput type="number" value={ 轮节径 || ''}
                             onChange={e => set轮节径( e.currentTarget.value||undefined ) }
                >mm</SuffixInput>
              </InputLine>
              <InputLine label={`曳引绳数(钢带条数):`}>
                <SuffixInput type="number" value={ 绳数 || ''}
                             onChange={e => set绳数( e.currentTarget.value||undefined ) }
                >根</SuffixInput>
              </InputLine>
              <InputLine label={`是否曳引绳是钢带:`}>
                <CheckSwitch  checked= {是钢带 || false} disabled={false}
                              onChange={e => set是钢带(是钢带? undefined:true) } />
              </InputLine>
              {是钢带 ? (
                <InputLine label={`曳引钢带的规格:`}>
                  <Input  value={ 钢带规格 || ''} readOnly={false}
                          onChange={e => set钢带规格( e.currentTarget.value||undefined ) } />
                </InputLine>
              ) :(
                <InputLine label={`曳引绳直径:`}>
                  <SuffixInput type="number" value={ 绳直径 || ''} readOnly={false}
                               onChange={e => set绳直径( e.currentTarget.value||undefined ) }
                  >mm</SuffixInput>
                </InputLine>
              ) }
            </LineColumn>
            <Text variant="h5">其它参数</Text>
            <LineColumn >
              <InputLine label={`爆炸物质(防爆电梯):`}>
                <Input  value={ 爆炸物质 || ''}
                        onChange={e => set爆炸物质( e.currentTarget.value||undefined ) } />
              </InputLine>
              <InputLine label={`补偿方式:`}>
                <Select  value={ 补偿方式 || ''}
                         onChange={e => set补偿方式( e.currentTarget.value||undefined ) } >
                  <option></option>
                  { 补偿方式s.map((one,i) => <option key={i} >{one}</option> ) }
                </Select>
              </InputLine>
              <InputLine label={`电动机类型:`}>
                <InputDatalist  value={ 电动机类型 || ''}
                                onListChange={v => set电动机类型(v ||undefined)}
                                datalist={电动机类型s} />
              </InputLine>
              <InputLine label={`顶升形式(液压电梯):`}>
                <Select  value={ 顶升形式 || ''}
                         onChange={e => set顶升形式( e.currentTarget.value||undefined ) } >
                  <option></option>
                  { 顶升形式s.map((one,i) => <option key={i} >{one}</option> ) }
                </Select>
              </InputLine>
              <InputLine label={`对重导轨型式:`}>
                <Select  value={ 导轨型式 || ''}
                         onChange={e => set导轨型式( e.currentTarget.value||undefined ) } >
                  <option></option>
                  { 对重导轨型式s.map((one,i) => <option key={i} >{one}</option> ) }
                </Select>
              </InputLine>
              <InputLine label={`轿厢高(杂物电梯):`}>
                <SuffixInput type="number" value={ 轿厢高 || ''}
                             onChange={e => set轿厢高( e.currentTarget.value||undefined ) }
                >m</SuffixInput>
              </InputLine>
              <InputLine label={`轿厢宽(杂物电梯):`}>
                <SuffixInput type="number" value={ 轿厢宽 || ''}
                             onChange={e => set轿厢宽( e.currentTarget.value||undefined ) }
                >m</SuffixInput>
              </InputLine>
              <InputLine label={`轿厢深(杂物电梯):`}>
                <SuffixInput type="number" value={ 轿厢深 || ''}
                             onChange={e => set轿厢深( e.currentTarget.value||undefined ) }
                >m</SuffixInput>
              </InputLine>
              <InputLine label={`区域防爆等级(防爆电梯):`}>
                <ComboBoxDatalist  value={ 区域防爆 || ''}
                                   onListChange={v => set区域防爆( v||undefined ) }
                                   datalist={区域防爆等级}  />
              </InputLine>
              <InputLine label={`驱动方式(杂物电梯):`}>
                <Select  value={ 驱动方式 || ''}
                         onChange={e => set驱动方式( e.currentTarget.value||undefined ) } >
                  <option></option>
                  { 驱动方式s.map((one,i) => <option key={i} >{one}</option> ) }
                </Select>
              </InputLine>
              <InputLine label={`上行额定速度(液压电梯):`}>
                <SuffixInput type="number" value={ 上行额速 || ''}
                             onChange={e => set上行额速( e.currentTarget.value||undefined ) }
                >m/s</SuffixInput>
              </InputLine>
              <InputLine label={`是否船舶电梯:`}>
                <CheckSwitch  checked= {船梯 || false}
                              onChange={e => set船梯(船梯? undefined:true) } />
              </InputLine>
              <InputLine label={`是否公共交通型:`}>
                <CheckSwitch  checked= {公共交通 || false}
                              onChange={e => set公共交通(公共交通? undefined:true) } />
              </InputLine>
              <InputLine label={`是否汽车电梯:`}>
                <CheckSwitch  checked= {汽车电梯 || false}
                              onChange={e => set汽车电梯(汽车电梯? undefined:true) } />
              </InputLine>
              <InputLine label={`梯级宽度:`}>
                <SuffixInput type="number" value={ 梯级宽度 || ''}
                             onChange={e => set梯级宽度( e.currentTarget.value||undefined ) }
                >m</SuffixInput>
              </InputLine>
              <InputLine label={`下行额定速度(液压电梯):`}>
                <SuffixInput type="number" value={ 下额定速 || ''}
                             onChange={e => set下额定速( e.currentTarget.value||undefined ) }
                >m/s</SuffixInput>
              </InputLine>
              <InputLine label={`限速器机械动作速度(液压/杂物电梯):`}>
                <SuffixInput  value={ 限机械速 || ''}
                              onChange={e => set限机械速( e.currentTarget.value||undefined ) }
                >m/s</SuffixInput>
              </InputLine>
              <InputLine label={`悬挂钢丝绳数(液压电梯):`}>
                <SuffixInput type="number" value={ 悬挂绳数 || ''}
                             onChange={e => set悬挂绳数( e.currentTarget.value||undefined ) }
                >根</SuffixInput>
              </InputLine>
              <InputLine label={`悬挂钢丝绳直径(液压电梯):`}>
                <SuffixInput type="number" value={ 悬挂绳径 || ''}
                             onChange={e => set悬挂绳径( e.currentTarget.value||undefined ) }
                >mm</SuffixInput>
              </InputLine>
              <InputLine label={`液压泵编号(液压电梯):`}>
                <Input  value={ 泵编号 || ''}
                        onChange={e => set泵编号( e.currentTarget.value||undefined ) } />
              </InputLine>
              <InputLine label={`液压泵功率(液压电梯):`}>
                <SuffixInput type="number" value={ 泵功率 || ''}
                             onChange={e => set泵功率( e.currentTarget.value||undefined ) }
                >kw</SuffixInput>
              </InputLine>
              <InputLine label={`液压泵流量(液压电梯):`}>
                <SuffixInput type="number" value={ 泵流量 || ''}
                             onChange={e => set泵流量( e.currentTarget.value||undefined ) }
                >L/M</SuffixInput>
              </InputLine>
              <InputLine label={`液压泵型号(液压电梯):`}>
                <Input  value={ 泵型号 || ''}
                        onChange={e => set泵型号( e.currentTarget.value||undefined ) } />
              </InputLine>
              <InputLine label={`液压泵转速(液压电梯):`}>
                <SuffixInput type="number" value={ 泵转速 || ''}
                             onChange={e => set泵转速( e.currentTarget.value||undefined ) }
                >r/min</SuffixInput>
              </InputLine>
              <InputLine label={`液压油型号(液压电梯):`}>
                <Input  value={ 液油型号 || ''}
                        onChange={e => set液油型号( e.currentTarget.value||undefined ) } />
              </InputLine>
              <InputLine label={`油缸数量(液压电梯):`}>
                <SuffixInput type="number" value={ 油缸数 || ''}
                             onChange={e => set油缸数( e.currentTarget.value||undefined ) }
                >个</SuffixInput>
              </InputLine>
              <InputLine label={`油缸形式(液压电梯):`}>
                <InputDatalist  value={ 油缸形式 || ''}
                                onListChange={v => set油缸形式(v ||undefined)}
                                datalist={油缸形式s} />
              </InputLine>
              <InputLine label={`整机防爆标志(防爆电梯):`}>
                <Input  value={ 防爆标志 || ''}
                        onChange={e => set防爆标志( e.currentTarget.value||undefined ) } />
              </InputLine>

              <InputLine label={`是否汽车电梯:`}>
                <CheckSwitch  disabled={false}  checked= {汽车电梯 || false}
                              onChange={e => set汽车电梯(汽车电梯? undefined:true) } />
              </InputLine>

              <InputLine label={`整机防爆合格证编号(防爆电梯):`}>
                <Input  value={ 防爆证号 || ''}
                        onChange={e => set防爆证号( e.currentTarget.value||undefined ) } />
              </InputLine>

            </LineColumn>

              <Button
                size="lg"
                intent="primary"
                iconAfter={<IconArrowRight />}
                onPress={ async () => {
                  //不用JSON.stringify保存到数据库格式不一样，对象直接转String，前端无法取出。必须用json格式{"制造国":"地","年限":"12"}
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

