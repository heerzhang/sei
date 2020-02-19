/** @jsx jsx */
import { jsx,} from "@emotion/core";
import * as React from "react";
import { Collapse,  Text,  useTheme } from "customize-easy-ui-component";
import { Table, TableBody, TableHead, TableRow, Cell, CCell } from "../../comp/TableExt";
import { useTouchable, } from "touchable-hook";
import { Helmet } from "react-helmet";
import { useMedia } from "use-media";
import { Link as RouterLink } from "wouter";
import { getInstrument2xColumn, itemResultTransform } from "../comp/helper";
import { useIspNormalizeContent } from "../comp/base";
import { reportFirstPageHead, 注意事项, 落款单位地址, 首页设备概况 } from "../comp/rarelyVary";

//模板的配套正式报告的显示打印； 版本号要相同的。
//下一个版本实际可以和这版本共用大部分配置，可直接引入inspectionContent再做动态修改的方案也可考虑，在差别不大的情况？。
export const inspectionContent=[
  {
    //bigNo: 1,
    bigLabel:'技术资料',
    splitLine:{'0': 5},
    items:[
      null,null,null,
      {
        //item:1.4,
        label:'使用资料',
        iClass:'B',
        subItems:['(1)使用登记资料','(2)安全技术档案','(3)管理规章制度','(4)日常维护保养合同','(5)特种设备作业人员证'],
        names:['登记资料','安全档案','管理制度','维保合同','作业人员证'],
        addNames:[]
      }
    ]
  },
  {
    //bigNo: 2,
    bigLabel:'机房(机器设备间)及相关设备',
    splitLine:{'0': 10, '10': 10},
    items:[
      {
        //item:2.1,
        label:'通道与通道门',
        iClass:'C',
        subItems:['(1)通道设置','(2)通道照明','(3)通道门'],
        names:['通道设置','通道照明','通道门'],
        addNames:['机房高出','梯子夹角','梯子判定','通道门宽','通道门高','通道判定']
      },
      null,null,null,
      {
        //item:2.5,
        label:'(1)照明、照明开关',
        iClass:'C',
        names:['机房照明'],
        addNames:[]
      },
      {
        //item:2.6,
        label:'(2)主开关与照明等电路的控制关系',
        iClass:'B',
        names:['开关电路关系'],
        addNames:[]
      },
      {
        //item:2.7,
        label:'驱动主机',
        iClass:'B',
        subItems:['(2)工作状况','(3)轮槽磨损','(4)制动器动作情况','★(5)手动紧急操作装置'],
        names:['主机工况','轮槽磨损','制动器','手动紧急操作'],
        addNames:[]
      },
      {
        //item:2.8,
        label:'控制柜、紧急操作和动态测试装置',
        iClass:'B',
        subItems:['(2)断错相保护','(4)紧急电动运行装置','☆(6)层门和轿门旁路装置','☆(7)门回路检测功能','☆(8)制动器故障保护','☆(9)自动救援操作装置'],
        names:['错相保护','紧急电动','门旁路','门回路','制动故障保护','自动救援'],
        addNames:[]
      },
      {
        //item:2.9,
        label:'限速器',
        iClass:'B',
        subItems:['(2)电气安全装置','(3)封记及运转情况','(4)动作速度校验'],
        names:['限速器电安','封记','速度校验'],
        addNames:[]
      },
      {
        //2.10,
        label:'(2)接地连接',
        iClass:'C',
        names:['接地连接'],
        addNames:[]
      },
      {
        //item:2.11,
        label:'电气绝缘',
        iClass:'C',
        names:['绝缘判定'],
        addNames:['动力电阻','照明电阻','安全装置电阻']
      }
    ]
  },
  {
    //bigNo: 3,
    bigLabel:'井道及相关设备',
    splitLine:{'0': 6, '6': 7},
    items:[
      null,null,null,
      {
        //item:3.4,
        label:'井道安全门',
        iClass:'C',
        subItems:['(3)门锁','(4)电气安全装置'],
        names:['安全门门锁','安全门电安'],
        addNames:[]
      },
      {
        //item:3.5,
        label:'井道检修门',
        iClass:'C',
        subItems:['(3)门锁','(4)电气安全装置'],
        names:['检修门门锁','检修门电安'],
        addNames:[]
      },
      null,
      {
        //item:3.7,
        label:'轿厢与井道壁距离',
        iClass:'B',
        names:['轿井距离判定'],
        addNames:['轿井间距']
      },
      null,null,
      {
        //item:3.10,
        label:'极限开关',
        iClass:'B',
        names:['极限开关'],
        addNames:[]
      },
      {
        //item:3.11,
        label:'井道照明',
        iClass:'C',
        names:['井道照明'],
        addNames:[]
      },
      {
        //item:3.12,
        label:'底坑设施与装置',
        iClass:'C',
        subItems:['(1)底坑底部','(3)停止装置'],
        names:['底坑底部','停止装置'],
        addNames:[]
      },
      null,
      {
        //item:3.14,
        label:'(2)限速绳张紧装置的电气安全装置',
        iClass:'B',
        names:['限速绳电安'],
        addNames:[]
      },
      {
        //item:3.15,
        label:'缓冲器',
        iClass:'B',
        subItems:['(3)固定和完好情况','(4)液位和电气安全装置','(5)对重越程距离'],
        names:['缓冲器固定','液位电安','对重越程判定'],
        addNames:['对重越程最大','对重越程']
      },
    ]
  },
  {
    //bigNo: 4,
    bigLabel:'轿厢与对重',
    splitLine:{'0': 10},
    items:[
      {
        //item:4.1,
        label:'轿顶电气装置',
        iClass:'C',
        subItems:['(1)检修装置','(2)停止装置'],
        names:['检修装置','轿顶停止装置'],
        addNames:[]
      },
      null,
      {
        //item:4.3,
        label:'(3)安全门(窗)电气安全装置',
        iClass:'C',
        names:['安全窗门'],
        addNames:[]
      },
      null,
      {
        //item:4.5,
        label:'对重(平衡重)块',
        iClass:'B',
        subItems:['(1)固定','(2)识别数量的措施'],
        names:['对重固定','识别数量'],
        addNames:[]
      },
      {
        //item:4.6,
        label:'(2)轿厢超面积载货电梯的控制条件',
        iClass:'C',
        names:['超面积载货'],
        addNames:[]
      },
      null,
      {
        //item:4.8,
        label:'紧急照明和报警装置',
        iClass:'B',
        subItems:['(1)紧急照明','(2)紧急报警装置'],
        names:['紧急照明','报警装置'],
        addNames:[]
      },
      {
        //item:4.9,
        label:'地坎护脚板',
        iClass:'C',
        names:['护脚板'],
        addNames:['护脚板高','护脚板高判定']
      },
      {
        //item:4.10,
        label:'超载保护装置',
        iClass:'C',
        names:['超载保护'],
        addNames:[]
      }
    ]
  },
  {
    //bigNo: 5,
    bigLabel:'悬挂装置、补偿装置及旋转部件防护',
    splitLine:{'0': 7},
    items:[
      {
        //item:5.1,
        label:'悬挂装置、补偿装置的磨损、断丝、变形等情况',
        iClass:'C',
        names:['磨损变形'],
        addNames:['断丝数','断丝判定','钢绳直径','钢绳公称','钢绳判定']
      },
      {
        //item:5.2,
        label:'绳端固定',
        iClass:'C',
        names:['绳端固定'],
        addNames:[]
      },
      {
        //item:5.3,
        label:'补偿装置',
        iClass:'C',
        subItems:['(1)绳(链)端固定','(2)电气安全装置','(3)补偿绳防跳装置'],
        names:['补偿绳固定','补偿绳电安','补偿绳防跳'],
        addNames:[]
      },
      null,
      {
        //item:5.5,
        label:'松绳(链)保护',
        iClass:'B',
        names:['松绳保护'],
        addNames:[]
      },
      {
        //item:5.6,
        label:'旋转部件的防护',
        iClass:'C',
        names:['旋转部件'],
        addNames:[]
      },
    ]
  },
  {
    //bigNo: 6,
    bigLabel:'轿门与层门',
    splitLine:{'0': 7, '7': 7},
    items:[
      null,null,
      {
        //item:6.3,
        label:'门间隙',
        iClass:'C',
        subItems:['(1)门扇间隙','(2)人力施加在最不利点时间隙'],
        names:['门扇间隙','最不利隙'],
        addNames:['层站','门扇隙','门套隙','地坎隙','施力隙']
      },
      {
        //item:6.4,
        label:'玻璃门防拖曳措施',
        iClass:'C',
        names:['玻门防拖曳'],
        addNames:[]
      },
      {
        //item:6.5,
        label:'防止门夹人的保护装置',
        iClass:'B',
        names:['门夹人'],
        addNames:[]
      },
      {
        //item:6.6,
        label:'门的运行与导向',
        iClass:'B',
        names:['门运行'],
        addNames:[]
      },
      {
        //item:6.7,
        label:'自动关闭层门装置',
        iClass:'B',
        names:['自动关门'],
        addNames:[]
      },
      {
        //item:6.8,
        label:'紧急开锁装置',
        iClass:'B',
        names:['紧急开锁'],
        addNames:[]
      },
      {
        //item:6.9,
        label:'门的锁紧',
        iClass:'B',
        subItems:['(1)层门门锁装置[不含6.9(1)①]','(2)轿门门锁装置[不含6.9(1)①]'],
        names:['层门锁','轿门锁'],
        addNames:['层站','门锁啮长']
      },
      {
        //item:6.10,
        label:'门的闭合',
        iClass:'B',
        subItems:['(1)机电联锁','(2)电气安全装置'],
        names:['机电联锁','门闭合电安'],
        addNames:[]
      },
      {
        //item:6.11,
        label:'☆轿门开门限制装置及轿门的开启',
        iClass:'B',
        subItems:['(1)轿门开门限制装置','(2)轿门的开启'],
        names:['开门限制','门开启'],
        addNames:[]
      },
      {
        //item:6.12,
        label:'门刀、门锁滚轮与地坎间隙',
        iClass:'C',
        names:['刀轮地隙'],
        addNames:['层站','刀坎距','轮坎距']
      }
    ]
  },
  null,
  {
    //bigNo: 8,
    bigLabel:'试验',
    splitLine:{'0': 7, '7': 8},
    items:[
      {
        //item:8.1,
        label:'平衡系数试验',
        iClass:'C',
        names:['平衡系数'],
        addNames:[]
      },
      {
        //item:8.2,
        label:'★轿厢上行超速保护装置试验',
        iClass:'C',
        names:['超速保护'],
        addNames:[]
      },
      {
        //item:8.3,
        label:'☆轿厢意外移动保护装置试验',
        iClass:'B',
        subItems:['(1)制停情况','(2)自监测功能'],
        names:['制停情况','自监测'],
        addNames:[]
      },
      {
        //item:8.4,
        label:'轿厢限速器－安全钳试验',
        iClass:'B',
        names:['限速安全钳'],
        addNames:[]
      },
      {
        //item:8.5,
        label:'对重(平衡重)限速器—安全钳试验',
        iClass:'B',
        names:['对重限速试验'],
        addNames:[]
      },
      {
        //item:8.6,
        label:'运行试验',
        iClass:'C',
        names:['运行试验'],
        addNames:[]
      },
      {
        //item:8.7,
        label:'应急救援试验',
        iClass:'B',
        subItems:['(1)救援程序','(2)救援通道','(3)救援操作'],
        names:['救援程序','救援通道','救援操作'],
        addNames:[]
      },
      null,
      {
        //item:8.9,
        label:'空载曳引检查',
        iClass:'B',
        names:['空载曳引'],
        addNames:[]
      },
      {
        //item:8.10,
        label:'上行制动工况曳引检查',
        iClass:'B',
        names:['上行制动'],
        addNames:[]
      },
      {
        //item:8.11,
        label:'▲下行制动工况曳引检查',
        iClass:'B',
        names:['下行制动'],
        addNames:[]
      },
      {
        //item:8.12,
        label:'▲静态曳引试验',
        iClass:'B',
        names:['静态曳引'],
        addNames:[]
      },
      {
        //item:8.13,
        label:'制动试验',
        iClass:'B',
        names:['制动试验'],
        addNames:[]
      }
    ]
  }
];

interface ReportViewProps {
  source: any;
  printing?: boolean;
}
export const ReportView: React.FunctionComponent<ReportViewProps> = ({
    printing=false,
    source: orc,
}) => {
  const theme = useTheme();
  const notSmallScr = useMedia('(min-width:800px),print');
  const [redundance, setRedundance] =React.useState(notSmallScr||printing);
  function onPress() {
      setRedundance(!redundance);
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
  const {renderIspContent} =useIspNormalizeContent({itRes, inspectionContent, modelPath:'EL-DJ/ver/1', repNo:'227'});

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
        <Table  fixed={ ["15%","34%","16%","%"]  }
                printColWidth={ ["95","210","110","300"] }
                css={ {borderCollapse: 'collapse' } }
         >
         <RouterLink  to={`/report/EL-DJ/ver/1/Survey/227`}>
          <TableBody>
            <TableRow>
              <CCell component="th" scope="row">设备品种</CCell>
              <CCell>曳引驱动乘客电梯</CCell>
              <CCell>使用登记证编号</CCell>
              <CCell>梯11闽AB139(17)</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row">使用单位名称</CCell>
              <CCell colSpan={3}>林钦全</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row">使用单位地址</CCell>
              <CCell colSpan={3}>福建省连江县马鼻镇南门村岐尾69号</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row">楼盘名称</CCell>
              <CCell colSpan={3}>/</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row">楼盘地址</CCell>
              <CCell colSpan={3}>/</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row">分支机构名称</CCell>
              <CCell colSpan={3}>/</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row">分支机构地址</CCell>
              <CCell colSpan={3}>/</CCell>
            </TableRow>
            <TableRow>
              <CCell component="th" scope="row">设备使用地点</CCell>
              <CCell colSpan={3}>连江县马鼻镇南门村岐尾69号</CCell>
            </TableRow>
            <TableRow>
              <CCell component="th" scope="row">使用单位代码</CCell>
              <CCell colSpan={3}>350122197109084531</CCell>
            </TableRow>
            <TableRow>
              <CCell component="th" scope="row">安全管理人员</CCell>
              <CCell>{orc.安全人员}</CCell>
              <CCell>使用单位设备编号</CCell>
              <CCell>1#</CCell>
            </TableRow>
            <TableRow>
              <CCell component="th" scope="row">制造日期</CCell>
              <CCell>2016-11-22</CCell>
              <CCell>改造日期</CCell>
              <CCell>/</CCell>
            </TableRow>
            <TableRow>
              <CCell component="th" scope="row">制造单位名称</CCell>
              <CCell colSpan={3}>快意电梯股份有限公司</CCell>
            </TableRow>
            <TableRow>
              <CCell component="th" scope="row">改造单位名称</CCell>
              <CCell colSpan={3}>/</CCell>
            </TableRow>
            <TableRow>
              <CCell component="th" scope="row">产品编号</CCell>
              <CCell>ZT1600005085</CCell>
              <CCell>型号</CCell>
              <CCell>METIS</CCell>
            </TableRow>
            <TableRow>
              <CCell component="th" scope="row">维护保养单位名称</CCell>
              <CCell colSpan={3}>福州新奥电梯工程有限公司</CCell>
            </TableRow>
          </TableBody>
        </RouterLink>
       </Table>
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
                      <CCell>1050         kg</CCell>
                      <CCell>额定速度</CCell>
                      <CCell>1.75       m/s</CCell>
                    </TableRow>
                    <TableRow >
                      <CCell>层站数</CCell>
                      <CCell>12  层     12     站     12         门 </CCell>
                      <CCell>控制方式</CCell>
                      <CCell>集选</CCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CCell>
            </TableRow>
            <TableRow>
              <CCell component="th" scope="row">检验依据</CCell>
              <Cell colSpan={6}>《电梯监督检验和定期检验规则——曳引与强制驱动电梯》（TSG T7001-2009）及1号、2号修改单</Cell>
            </TableRow>
            <RouterLink  to={`/report/EL-DJ/ver/1/Instrument/227`}>
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
            <RouterLink  to={`/report/EL-DJ/ver/1/Conclusion/227`}>
             <TableRow>
              <CCell component="th" scope="row">检验结论</CCell>
              <CCell colSpan={6}><Text variant="h1" css={{fontSize:'4rem'}}>{orc.检验结论}</Text></CCell>
            </TableRow>
            </RouterLink>
            <RouterLink  to={`/report/EL-DJ/ver/1/Remark/227`}>
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
            <RouterLink  to={`/report/EL-DJ/ver/1/Appendix/227`}>
            <TableRow>
              <CCell component="th" scope="row">检验日期</CCell>
              <CCell colSpan={2}>{orc.检验日期}</CCell>
              <CCell>下次检验日期</CCell>
              <CCell>/</CCell>
            </TableRow>
            </RouterLink>
            <TableRow>
              <CCell component="th" scope="row">检验人员</CCell>
              <Cell colSpan={4}>{orc.检验人IDs}</Cell>
            </TableRow>
            <TableRow>
              <CCell component="th" scope="row">编制</CCell>
              <CCell>{orc.编制人}</CCell>
              <CCell>日期</CCell>
              <CCell>{orc.编制日期}</CCell>
              <CCell rowSpan={3}>
                <div css={{backgroundImage:`url(${require("../../images/seal.png")})`,backgroundSize:"cover",backgroundPosition:"center",minHeight:'30vmin'}}>
                  <Table  fixed={ ["40%","%"]  }
                          printColWidth={ ["170","230"] }
                          css={ {borderCollapse: 'collapse',height:'fill-available'} }
                  >
                    <TableBody>
                      <TableRow>
                        <CCell css={{border:'none'}}>机构核准证号：</CCell>
                        <CCell css={{border:'none'}}>TS7110236-2022</CCell>
                      </TableRow>
                      <TableRow>
                        <CCell css={{border:'none'}} colSpan={2}>（机构公章或检验专用章）</CCell>
                      </TableRow>
                      <TableRow>
                        <CCell css={{border:'none'}}>签发日期：</CCell>
                        <CCell css={{border:'none'}}>2020-04-22</CCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CCell>
            </TableRow>
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
            <RouterLink  to={`/report/EL-DJ/ver/1/ALL/227`}>
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
           <RouterLink  to={`/report/EL-DJ/ver/1/ReCheck/227`}>
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
                <RouterLink key={i} to={`/report/EL-DJ/ver/1/${ts}/227`}>
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
      <div css={{
            "@media print": {
              display:'none'
            },
            textAlign:'center'
          }}
       >
       - 报告完毕 -<br/>
       <RouterLink to={`/report/EL-DJ/ver/1/printAll/227`}>
         看完整的原始记录
       </RouterLink>
      </div>
    </React.Fragment>
  );
}

