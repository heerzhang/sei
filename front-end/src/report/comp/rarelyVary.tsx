/** @jsx jsx */
import { jsx, css, SerializedStyles } from "@emotion/core";
import * as React from "react";
import {
  useTheme,
  Text,
  Button, SelectProps,
  IconChevronUp,
  IconChevronDown, Collapse, useCollapse,
  Select, Layer, Check, Link, Divider, Embed
} from "customize-easy-ui-component";
import PropTypes from "prop-types";
import { Ref } from "react";
import { Link as RouterLink } from "wouter";
import { CCell, Cell, TableRow } from "../../comp/TableExt";
import { FadeImage } from "../../FadeImage";

//很多显示内容相对固定重复，这里提供复用的小组件。

export interface InspectZoneHeadColumnProps {
  label: string;
  projects: string[];
  children?: React.ReactNode;
}
//几个检验项目的聚合模式，1个下拉的分区装入多个项目。
export const InspectZoneHeadColumn22: React.FunctionComponent<InspectZoneHeadColumnProps> = ({
      label,
      projects,
      children,
      ...other
   }) => {

  return (
    <React.Fragment>
      <div css={{ display: 'flex', justifyContent: 'space-around'}}>
        <Text  variant="h6">项目: {projects.join(',')}</Text>
        <Text  variant="h6">{label}</Text>
      </div>
      {children}
    </React.Fragment>
  );
};


export interface InspectItemHeadColumnProps {
  level: string;
  label: string;
  children: React.ReactNode;
}
//下拉的分区装入多个项目, 之后单一个检验项目的开头
export const InspectItemHeadColumn33: React.FunctionComponent<InspectItemHeadColumnProps> = ({
      level,
      label,
      children,
      ...other
      }) => {

  return (
    <React.Fragment>
      <div css={{ display: 'flex',justifyContent: 'space-around',marginTop:'1rem'}}>
        <Text  variant="h6">{label}</Text>
        <Text  variant="h6">检验类别 {level}  </Text>
      </div>
        <hr/>
        {children}
      <Text  variant="h4"　>
        查验结果
      </Text>
    </React.Fragment>
  );
};


export const 注意事项=<React.Fragment>
  <br/>
  2. 本报告应当由计算机打印输出，或者用钢笔、签字笔填写，字迹应当工整，修改无效。<br/>
  <br/>
  3. 本报告无检验、编制、审核、批准人员签字和检验机构的核准证号、检验专用章或者公章无效。<br/>
  <br/>
  4. 本报告一式三份，由检验机构、施工单位和使用单位分别保存。<br/>
  <br/>
  5. 受检单位对本报告结论如有异议，请在收到报告书之日起15日内，向检验机构提出书面意见。<br/>
  <br/>
  6. 根据《中华人民共和国特种设备安全法》，使用单位应于下次检验日期届满前1个月向检验机构提出定期检验申请。<br/>
  <br/>
  7. 有关检测数据未经允许，施工、使用单位不得擅自向社会发布信息。<br/>
  <br/>
  8. 报检电话：968829，网址：<Link href="http://27.151.117.65:9999/sdn" title="报检">http:// 27.151.117.65:9999 /sdn</Link>
  <br/><br/>
</React.Fragment>;

export const 落款单位地址=<React.Fragment>
    <Text variant="h4" css={{textAlign:'center'}}>福建省特种设备检验研究院</Text>
    <Text variant="h6" css={{textAlign:'center'}}>
      FUJIAN SPECIAL EQUIPMENT INSPECTION AND RESEARCH INSTITUTE
    </Text>
    <Divider css={{borderTopColor: 'black'}}/>
    <Text variant="h5" >
      地址（Add.）：福建省福州市仓山区卢滨路370号
    </Text>
    <div css={{display:'flex'}}>
      <span css={{flex:'1'}}>电话（Tel.）：0591-968829</span>
      <span css={{flex:'1'}}>	传真（Fax）：0591-88700509</span>
      <span css={{flex:'1'}}>邮政编码：350008</span>
    </div>
    <div css={{display:'flex'}}>
      <span css={{flex:'1'}}>网址（Website）：www.fjtj.com</span>
      <span css={{flex:'1'}}>	电子邮箱（Email）：fjtj@fjtj.org</span>
    </div>
    <br/>
</React.Fragment>;

export const reportFirstPageHead= ( {theme, repNo }
) => {
  return <React.Fragment>
      <div css={{
        textAlign: "center",
        "& > div": {
          marginLeft: "auto",
          marginRight: "auto"
        },
        "@media (min-width:690px),print and (min-width:538px)": {
          display: "flex",
          justifyContent: "space-between",
          flexWrap: 'wrap',
          "& > div": {
            margin: theme.spaces.sm,
          }
        }
      }}
      >
        <div>
          <Embed css={{width: "190px",margin: "auto"}} width={95} height={45}>
            <FadeImage src={`${require("../../images/MA.png")}`}/>
          </Embed>
          <br/>
          <Text variant="h5">181320110160</Text>
        </div>
        <div>
          <Embed css={{width: "140px",margin: "auto"}} width={10} height={10}>
            <FadeImage src={`${require("../../images/reportNoQR.png")}`}/>
          </Embed>
        </div>
        <div>
          <Text variant="h5">FJB/TC-1001-1-0-2017</Text>
          <br/><br/>
          <Text variant="h5" css={{
            "@media (min-width:690px),print and (min-width:538px)": {
              marginRight: "1rem"
            }
          }}
          >No：JD2020FTC00004
          </Text>
        </div>
      </div>
  </React.Fragment>;
};



