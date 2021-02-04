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
  ComboBoxInput, ComboBoxList, ComboBoxOption
} from "customize-easy-ui-component";

//import { useSession } from "../auth";
//import {Helmet} from "react-helmet";
import { Link as RouterLink,  useLocation } from "wouter";
import { ContainLine, TransparentInput } from "../../comp/base";
import { css } from "@emotion/react";
import { 设备品种 } from "../../dict/eqpComm";

export const 缓冲器形式=["液压","聚氨酯","弹簧","蓄能型","耗能型","聚胺脂","弹簧 液压","聚氨酯 液压"];
export const 加装附加装置=["IC卡", "自动平层装置","IC卡和自动平层装置","能量反馈装置","自动平层和能量反馈装置","IC卡和能量反馈装置"]


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
  const theme = useTheme();

  const eqpId=id;

  //const [editing, setEditing] = React.useState(!readOnly);
  //const [image, ] = React.useState(defaultImage);
  //const [title, setTitle] = React.useState(defaultTitle);

  const [flo, setFlo] = React.useState(eqp.flo);
  const [spec, setSpec] = React.useState(eqp.spec);
  const [vl, setVl] = React.useState(eqp.vl);
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

  //直接取得EQP关联的task字段的对象。
  const {task} =eqp;
 // const [ingredients, setIngredients] = React.useState<any>( dt||{} );
  const [, setLocation] = useLocation();

  //console.log("页面刷新钩子AttachedTask entry=",　",设备id="+id+";task=",task,";eqp=",eqp);



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
                  placeholder="层数"
                  value={ flo || ''}
                  onChange={e => setFlo( e.currentTarget.value||undefined ) }
                >层</SuffixInput>
              </InputGroupLine>
              <ContainLine display={'是否特种电梯？'}>
                <Check label={'是的'}
                       checked= {spec || false}
                       onChange={e => setSpec(!spec) }
                />
              </ContainLine>
              <ContainLine display={ '运行速度'}>
                <TransparentInput
                  autoFocus={true}
                  placeholder="m/s"
                  type="number"
                  value={vl || ''}
                  onChange={ e => { setVl( e.currentTarget.value||undefined )
                  }}
                />
              </ContainLine>
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
                  {
                    缓冲器形式.map((one,i) => (
                      <option key={i}>{one}</option>
                    ))
                  }
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
                  {aap && ( <ComboBoxList aria-label="Query users">
                      {
                        加装附加装置.map((entry,i) => {
                          return <ComboBoxOption key={entry} value={entry} />;
                        })
                      }
                    </ComboBoxList>
                  )}
                </ComboBox>
              </InputGroupLine>


              <Button
                size="lg"
                intent="primary"
                iconAfter={<IconArrowRight />}
                onPress={ async () => {
                  await setPam({ ...eqp, flo,spec,vl,nnor,cpm,hlf,oldb,lesc,wesc,tm,mtm,buff,rtl
                    ,aap
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

