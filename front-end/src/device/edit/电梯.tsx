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
  ComboBoxInput, ComboBoxList, ComboBoxOption, IconButton, IconLayers, IconX
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

export const 电梯: React.FunctionComponent<电梯props> = ({
  readOnly,
  id,
  editable,
  defaultCredit = "",
  defaultDescription,
  defaultImage,
  defaultIngredients,
  defaultTitle = "",
  eqp=null,
                                                       setPam,
}) => {
  const qs= queryString.parse(window.location.search);
  const dialog =qs && !!qs.dialog;
  console.log("参数电梯路由&print qs printing=",dialog, qs);

  const theme = useTheme();

  const eqpId=id;
  const {ndt, setNdt} =React.useContext(DialogEnterReturn);
  const [open, setOpen] = React.useState(false);

  const [edt, setEdt] =React.useState(ndt&&qs?.emodel==='电梯'? ndt:eqp);
  //const [editing, setEditing] = React.useState(!readOnly);
  //const [image, ] = React.useState(defaultImage);
  //const [title, setTitle] = React.useState(defaultTitle);

  const [spec, setSpec] = React.useState(eqp.spec);
  const [vl, setVl] = React.useState(eqp.vl);
  const [flo, setFlo] = React.useState(eqp.flo);
  const [nnor, setNnor] = React.useState(eqp.nnor);
  const [cpm, setCpm] = React.useState(eqp.cpm);
  const [hlf, setHlf] = React.useState(eqp.hlf);
  const [oldb, setOldb] = React.useState(eqp.oldb);
  const [lesc, setLesc] = React.useState(eqp.lesc);
  const [wesc, setWesc] = React.useState(eqp.wesc);
  const [tm, setTm] = React.useState(eqp.tm);
  const [mtm, setMtm] = React.useState(eqp.mtm);
  const [buff, setBuff] = React.useState(eqp.buff);
  const [rtl, setRtl] = React.useState(eqp.rtl);
  const [aap, setAap] = React.useState(eqp.aap);
  const [prot, setProt] = React.useState(eqp.prot);
  const [doop, setDoop] = React.useState(eqp.doop);
  const [limm, setLimm] = React.useState(eqp.limm);
  const [opm, setOpm] = React.useState(edt.opm);
  const [lbkd, setLbkd] = React.useState(eqp.lbkd);
  const [nbkd, setNbkd] = React.useState(eqp.nbkd);
  //监察参数 : 不用JSON.parse无法取出,保存对象直接发给后端数据库,存储String格式不一样;
  const  svp =JSON.parse( eqp?.svp!);
  const [制造国, set制造国] = React.useState(svp?.制造国);
  const [设计使用年限, set设计使用年限] = React.useState(svp?.设计使用年限);
  const [motorCod, setMotorCod] = React.useState(svp?.motorCod);
  const [设计日期, set设计日期] = React.useState(svp?.设计日期);
  const [重点监控, set重点监控] = React.useState(svp?.重点监控);
  const [makeIspunitId, setMakeIspunitId] = React.useState(qs?.makeIspunitId || svp?.makeIspunitId);


  //直接取得EQP关联的task字段的对象。
  const {task} =eqp;
 // const [ingredients, setIngredients] = React.useState<any>( dt||{} );
  const [, setLocation] = useLocation();

  console.log("页面刷新钩子AttachedTask svp ndt=",　eqp?.svp, ";制造国=",svp?.制造国, ";ndt=",ndt);

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
                  <ComboBox  autocomplete
                             query={aap || ''}
                             onQueryChange={v => setAap(v) }
                             onSelect={v => setAap(v) }
                  >
                    <ComboBoxInput aria-label=""/>
                    {aap && (
                      <ComboBoxList >
                        { 加装附加装置.map((one,i) => {
                          return <ComboBoxOption key={i} value={one} />;
                        }) }
                      </ComboBoxList>
                    )}
                  </ComboBox>
                </InputGroupLine>

                <InputGroupLine label={`轿厢意外移动保护装置型号:`}>
                  <Input
                    value={ prot || ''}
                    onChange={e => setProt( e.currentTarget.value||undefined ) }
                  >
                  </Input>
                </InputGroupLine>

                <InputGroupLine label={`开门方式:`}>
                  <ComboBox  autocomplete
                             query={doop || ''}
                             onQueryChange={v => setDoop(v) }
                             onSelect={v => setDoop(v) }
                  >
                    <ComboBoxInput aria-label=""/>
                    { (
                      <ComboBoxList >
                        { 开门方式.map((one,i) => {
                          return <ComboBoxOption key={i} value={one} />;
                        }) }
                      </ComboBoxList>
                    )}
                  </ComboBox>
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
                <Text variant="h5">监察参数</Text>
                <InputGroupLine label={`制造国:`}>
                  <Input
                    value={ 制造国 || ''}
                    onChange={e => set制造国( e.currentTarget.value||undefined ) }
                  >
                  </Input>
                </InputGroupLine>
                <InputGroupLine label={`设计使用年限:`}>
                  <Input
                    value={ 设计使用年限 || ''}
                    onChange={e => set设计使用年限( e.currentTarget.value||undefined ) }
                  >
                  </Input>
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
                <InputGroupLine label={`是否重点监控:`}>
                  <Check label={'是的'}
                         checked= {重点监控 || false}
                         onChange={e => set重点监控(重点监控? undefined:true) }
                  />
                </InputGroupLine>
                <ContainLine display={'设备使用单位ID'}>
                  <UnitOrChoose id={makeIspunitId  || ''}
                                onCancel={(e) => {
                                  setMakeIspunitId( e.currentTarget.value||undefined )
                                }}
                                onDialog={async (e) => {
                                  await setPam({ ...eqp, flo,spec,vl,nnor,cpm,hlf,oldb,lesc,wesc,tm,mtm,buff,rtl,
                                    aap,prot,doop,limm,opm,lbkd,nbkd,
                                    svp: JSON.stringify({制造国,设计使用年限,motorCod,设计日期,重点监控,
                                      makeIspunitId}
                                    )

                                  }  );
                                  await setNdt( eqp );
                                  }
                                }
                  />
                </ContainLine>


                <Button
                  size="lg"
                  intent="primary"
                  iconAfter={<IconArrowRight />}
                  onPress={ async () => {
                    //不用JSON.stringify保存到数据库格式不一样，对象直接转String，前端无法取出。必须用json格式{"制造国":"地","设计使用年限":"12"}
                    await setPam({ ...eqp, flo,spec,vl,nnor,cpm,hlf,oldb,lesc,wesc,tm,mtm,buff,rtl,
                      aap,prot,doop,limm,opm,lbkd,nbkd,
                      svp: JSON.stringify({制造国,设计使用年限,motorCod,设计日期,重点监控,
                        makeIspunitId}
                      )

                    }  );
                  } }
                >
                  确认修改
                </Button>
              </div>
            </Container>
          </div>
        </div>

      </div>
  );
};

