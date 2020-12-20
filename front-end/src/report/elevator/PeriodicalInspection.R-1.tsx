/** @jsxImportSource @emotion/react */
import { jsx,} from "@emotion/react";
import * as React from "react";
import { Collapse, Text, useTheme } from "customize-easy-ui-component";
import { Table, TableBody, TableHead, TableRow, Cell, CCell } from "../../comp/TableExt";
import { useTouchable, } from "touchable-hook";
import { Helmet } from "react-helmet";
import { useMedia } from "use-media";
import { Link as RouterLink } from "wouter";
import { getInstrument2xColumn, itemResultTransform } from "../comp/helper";
import { ReportViewProps, useIspNormalizeContent } from "../comp/base";
import { reportFirstPageHead, 末尾链接, 注意事项, 落款单位地址, 首页设备概况 } from "../comp/rarelyVary";
import { 检验编制核准, 检验设备情况 } from "./elvRarelyVary";
import { inspectionContent } from "./Periodical/main";
import * as queryString from "querystring";

//正式报告的显示打印。
//不需要每个verId新搞一个文件的，甚至不需要搞新的组件，可以只需内部逻辑处理。

export const ReportView: React.FunctionComponent<ReportViewProps> = ({
    repId,   source: orc,  verId,
}) => {
  const theme = useTheme();
  const notSmallScr = useMedia('(min-width:800px),print');
  const qs= queryString.parse(window.location.search);
  const printing =qs && !!qs.print;
  console.log("参数第三层路由&print qs printing=",printing, qs);
  const [redundance, setRedundance] =React.useState(notSmallScr||printing);
  function onPress(e) {
      setRedundance(!redundance);
      e.preventDefault();
  }
  const {bind:bindRedund ,} =useTouchable({ onPress,  behavior: "button" });
  React.useEffect(() => {
     setRedundance(notSmallScr||printing);
  }, [notSmallScr, printing] );
  const instrumentTable =React.useMemo(() => getInstrument2xColumn(orc.仪器表), [orc.仪器表]);
  const 检验结果替换 =React.useCallback((orc, out) => {
    if(orc['轿井间距'])   out[3.7][0]=`间距${orc['轿井间距']}m`;
    if(orc['对重越程'] && orc['对重越程最大'])   out[3.15][2]=`最大允许值${orc['对重越程最大']}mm;测量值${orc['对重越程']}mm`;
  }, []);
  const itRes =React.useMemo(()=>itemResultTransform(orc,inspectionContent,检验结果替换), [orc,检验结果替换]);
  const {renderIspContent} =useIspNormalizeContent({itRes, inspectionContent, modelPath:'EL-DJ/ver/1', repNo:`${repId}`});

  return (
    <React.Fragment>
      <Helmet title={`JD2020FTC00004`}/>
      <div css={{
            "@media not print": {
              marginTop:'1rem',
              marginBottom: '1rem'
            }
          }}
      >
       <div role="button" tabIndex={0} {...bindRedund}>
          {!(redundance) && <Text variant="h4">
               {`No：JD2020FTC00004 更多...`}
             </Text>
          }
       </div>
        <Collapse id={'1'} show={redundance} noAnimated>
          <div role="button" {...bindRedund}>
            { reportFirstPageHead({theme, No: 'JD2020FTC00004'}) }
            <div css={{
                "@media print": {
                  height:'110px'
                }
            }}>
            </div>
          </div>
        </Collapse>
        <Text variant="h3" css={{
              textAlign:'center',
              "@media (min-width:690px),print and (min-width:538px)": {
                fontSize: theme.fontSizes[6],
              }
            }}>
        有机房曳引驱动电梯定期检验报告
        </Text>
        <div css={{
            "@media print": {
              height:'200px'
            }
          }}>
        </div>
        { 首页设备概况( {theme, orc} ) }
        <div role="button" tabIndex={1} {...bindRedund}>
          {!(redundance) && <Text variant="h4">
                福建省特种设备检验研究院 更多...
              </Text>
          }
        </div>
        <Collapse id={'2'} show={redundance} noAnimated>
            <div css={{
              "@media print": {
                height:'210px'
              }
            }}>
            </div>
            <div  css={{
              textAlign:'center',
              "@media print": {
                pageBreakAfter:'always'
              }
            }}>
              {落款单位地址}
            </div>
          <div role="button" {...bindRedund}>
            <Text variant="h1" css={{textAlign:'center'}}>注意事项</Text>
          </div>
            <Text variant="h4"><br/>
              1. 本报告依据《电梯监督检验和定期检验规则——曳引与强制驱动电梯》（TSG T7001-2009）及1号、2号修改单制定，适用于有机房曳引驱动电梯定期检验。<br/>
              {注意事项}
            </Text>
          <div role="button" {...bindRedund}>
            <Text variant="h2" css={{textAlign:'center'}}>有机房曳引驱动电梯定期检验报告</Text>
          </div>
        </Collapse>
        <RouterLink  to={`/report/EL-DJ/ver/1/Survey/${repId}`}>
         <Table  fixed={ ["15%","34%","16%","%"]  }
                printColWidth={ ["95","210","110","300"] }
                css={ {borderCollapse: 'collapse' } }
           >
         {检验设备情况({orc})}
        </Table>
       </RouterLink>
       <Table  fixed={ ["6%","8%","26%","14%","8%","%","14%"]  }
                printColWidth={ ["46","70","240","160","70","240","160"] }
                css={ {borderCollapse: 'collapse' } }
        >
          <TableBody>
            <TableRow>
              <CCell component="th" scope="row">设备技术参数</CCell>
              <CCell colSpan={6} css={{padding:0}}>
                <Table  fixed={ ["17%","33%","16%","%"]  }
                        printColWidth={ ["95","210","110","300"] }
                        css={ {borderCollapse: 'collapse', height:'fill-available'} }
                  >
                  <TableBody>
                    <TableRow >
                      <CCell>额定载重量</CCell>
                      <CCell>{orc.额定载荷}  kg</CCell>
                      <CCell>额定速度</CCell>
                      <CCell>{orc.运行速度}  m/s</CCell>
                    </TableRow>
                    <TableRow >
                      <CCell>层站数</CCell>
                      <CCell>{orc.电梯层数}  层   {orc.电梯站数}  站  {orc.电梯门数} 门</CCell>
                      <CCell>控制方式</CCell>
                      <CCell>{orc.控制方式}</CCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CCell>
            </TableRow>
            <TableRow>
              <CCell component="th" scope="row">检验依据</CCell>
              <Cell colSpan={6}>《电梯监督检验和定期检验规则——曳引与强制驱动电梯》（TSG T7001-2009）及1号、2号修改单</Cell>
            </TableRow>
            <RouterLink  to={`/report/EL-DJ/ver/1/Instrument/${repId}`}>
              <TableRow >
                <CCell component="th" scope="row" rowSpan={1+instrumentTable.length}>主要检验仪器设备</CCell>
                <CCell>序号</CCell>
                <CCell>仪器名称</CCell>
                <CCell>仪器编号</CCell>
                <CCell>序号</CCell>
                <CCell>仪器名称</CCell>
                <CCell>仪器编号</CCell>
              </TableRow>
            </RouterLink>
            {instrumentTable.map((o,i) => {
                return (
                  <TableRow key={i}>
                    <CCell>{o.s1}</CCell>
                    <CCell>{o.name1}</CCell>
                    <CCell css={{wordBreak: 'break-all'}}>{o.no1}</CCell>
                    <CCell>{o.s2}</CCell>
                    <CCell>{o.name2}</CCell>
                    <CCell css={{wordBreak: 'break-all'}}>{o.no2}</CCell>
                  </TableRow>
                );
              } )
            }
            <RouterLink  to={`/report/EL-DJ/ver/1/Conclusion/${repId}`}>
             <TableRow>
              <CCell component="th" scope="row">检验结论</CCell>
              <CCell colSpan={6}><Text variant="h1" css={{fontSize:'4rem'}}>{orc.检验结论}</Text></CCell>
            </TableRow>
            </RouterLink>
            <RouterLink  to={`/report/EL-DJ/ver/1/Remark/${repId}`}>
            <TableRow>
              <CCell component="th" scope="row">备注</CCell>
              <Cell colSpan={6}>{orc.memo}</Cell>
            </TableRow>
            </RouterLink>
          </TableBody>
        </Table>
        <Table  fixed={ ["11%","23%","6%","12%","%"]  }
                printColWidth={ ["95","210","90","110","300"] }
                css={ {borderCollapse: 'collapse' } }
        >
          <TableBody>
            <RouterLink  to={`/report/EL-DJ/ver/1/Appendix/${repId}`}>
            <TableRow>
              <CCell component="th" scope="row">检验日期</CCell>
              <CCell colSpan={2}>{orc.检验日期}</CCell>
              <CCell>下次检验日期</CCell>
              <CCell>{orc.下检日期 || '／'}</CCell>
            </TableRow>
            </RouterLink>
           {检验编制核准({orc})}
            <TableRow >
              <CCell component="th" scope="row">审核</CCell>
              <CCell></CCell>
              <CCell>日期</CCell>
              <CCell>2020-01-02</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row">批准</CCell>
              <CCell></CCell>
              <CCell>日期</CCell>
              <CCell></CCell>
            </TableRow>
          </TableBody>
        </Table>
       <br/>
        <Table  fixed={ ["6%","7%","7%","9%","10%","%","17%","9%"]  }
                printColWidth={ ["46","46","55","55","130","405","175","120"] }
               css={ {borderCollapse: 'collapse' } }
        >
          <TableHead>
            <RouterLink  to={`/report/EL-DJ/ver/1/ALL/${repId}`}>
              <TableRow>
                <CCell>序号</CCell>
                <CCell>检验类别</CCell>
                <CCell colSpan={4}>检验项目及内容</CCell>
                <CCell>检验结果</CCell>
                <CCell>检验结论</CCell>
              </TableRow>
            </RouterLink>
          </TableHead>
          <TableBody>
            {renderIspContent}
          </TableBody>
        </Table>
        检验不合格项目内容及复检结果
        <Table  fixed={ ["5%","11%","%","14%","14%"]  }
                printColWidth={ ["35","66","700","70","95"] }
                css={ {borderCollapse: 'collapse' } }
        >
          <TableHead>
           <RouterLink  to={`/report/EL-DJ/ver/1/ReCheck/${repId}`}>
            <TableRow>
              <CCell>序号</CCell>
              <CCell>类别/编号</CCell>
              <CCell>检验不合格内容记录</CCell>
              <CCell>复检结果</CCell>
              <CCell>复检日期</CCell>
            </TableRow>
           </RouterLink>
          </TableHead>
          <TableBody>
            {itRes.failure.map((ts, i) => {
              return (
                <RouterLink key={i} to={`/report/EL-DJ/ver/1/${ts}/${repId}`}>
                  <TableRow>
                    <CCell component="th" scope="row">{i+1}</CCell>
                    <CCell>{itRes[ts].iClass}/{ts}</CCell>
                    <CCell>{itRes[ts].fdesc}</CCell>
                    <CCell></CCell>
                    <CCell></CCell>
                  </TableRow>
                </RouterLink>
              );
            })
            }
          </TableBody>
        </Table>
      </div>
      {末尾链接({template:'EL-DJ',verId,repId})}
    </React.Fragment>
  );
}



