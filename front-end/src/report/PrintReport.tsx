/** @jsx jsx */
import { jsx,} from "@emotion/core";
import * as React from "react";
import {
  Collapse,
  Container,
  Divider,
  Embed, Link,
  ScrollView, Text,
  useInfiniteScroll, useTheme
} from "customize-easy-ui-component";
import { Table, TableBody, TableHead, TableRow, Cell, CCell, RCell } from "../comp/TableExt";
import { useTouchable, OnPressFunction } from "touchable-hook";
import { Helmet } from "react-helmet";

//import { globalHistory  } from "@reach/router";
import { useMedia } from "use-media";
//import { FadeImage } from "../FadeImage";
import faker from "faker/locale/zh_CN";
import { FadeImage } from "../FadeImage";
import { InspectRecordTitle, InternalItemHandResult, TemplateViewProps } from "../original/comp/base";
import { safeBind } from "customize-easy-ui-component/esm/Hooks/compose-bind";

/*let id = 0;
function createData(
  name: string,
  calories: string | number,
  fat:  ReactNode |string | number,
  carbs: ReactNode |string |number,
  protein: ReactNode | string | number
) {
  id += 1;
  return { id, name, calories, fat, carbs, protein };
} */

/*
const rows = [
  createData(faker.name.findName(), 159, 6.0, 24, '网站发布福州市工业和信息化局福州网站发布福网站发布福州市工州市工市财政局关于调整新能源汽车推广应用补助办法的通知对新能源汽车购置补贴新能源汽车推广应用补助'),
  createData("Ice cream sandwich", 237, <Embed width={1000} height={490}>
    <FadeImage src={"http://g1.dfcfw.com/g3/201910/20191025193912.jpg"} alt={"93.77"} />
  </Embed>, "分离福史蒂使用单位福史蒂器恶化伺服", 4.3),
  createData(faker.name.findName(), 262, "分离34f阿什福史蒂芬森大法师多福多寿何器恶化7伺服", 24, "士大夫拔刀术，分离345345fasdfs345345器恶化567伺服5676vr<br>" +
    "<hr>bcvbcv57亲卫队不是大dsf城市vbvbn12"),
  createData("Cupcake", "1高浮雕", <span>（1）应当在任何情况下均能够安全方便地使用通道。采用梯子作为通道时，必须符合以下条件：<br/>①通往机房(机器设备间)的通道不应当高出楼梯所到平面4m； <br/>②梯子必须固定在通道上而不能被移动；<br/>③梯子高度超过1.50m时，其与水平方向的夹角应当在65°
   ～75°之间，并不易滑动或者翻转；<br/>④靠近梯子顶端应当设置容易握到的把手。</span>, 67, "士大夫拔刀术分离345345fasdfs345345器恶化567伺服5676vr"),
  createData("henchandsfasf分散对方", '福史蒂芬森大法师多大法师多福多寿何器', 16.0, 49, <span>sjdfl表<hr/>现出<p>vwe</p></span>),
  createData("henchandsfasf分散对方", '福史蒂芬森大法师多福多寿何器', 16.0, <Embed width={1000} height={490}>
    <FadeImage src={"https://z1.dfcfw.com/2019/11/6/20191106064635702113607.jpg"} alt={"97"} />
  </Embed>, <span>sjdfl表<hr/>现出<p>vwe</p></span>),
  createData("henchandsfasf分散对方", '福史蒂芬5cvds大法师多5646f福多寿何器', 16.0, 49, <span>sjdfl表<hr/>现出<p>vwe</p></span>),
  createData("henchandsfasf分散对方", 3006,
    <span>（1）应当在任何情况下均能够安全方便地使用通道。采用梯子作为通道时，必须符合以下条件：<br/>①通往机房(机器设备间)的通道不应当高出楼梯所到平面4m； <br/>②梯子必须固定在通道上而不能被移动；<br/>③梯子高度超过1.50m时，其与水平方向的夹角应当在65°
   ～75°之间，并不易滑动或者翻转；<br/>④靠近梯子顶端应当设置容易握到的把手。</span>,
    49, <span>sjdfl表<hr/>现出<p>vwe</p></span>),
  createData("Cupcake", "6高浮雕", <Embed width={1000} height={490}>
      <FadeImage src={"http://g1.dfcfw.com/g3/201911/20191102142631.jpg"} alt={"3.77"} />
    </Embed>, 67,
    <div>
      <div  css={{padding:"6px 0"}}>出现下列情况之一时，悬挂钢丝绳和补偿钢丝绳应当报废：<br/>
        ①出现笼状畸变、绳股挤出、扭结、部分压扁、弯折；<br/>②一个捻距内出现的断丝数大于下表列出的数值时：
      </div>
                    <Table  minWidth={'90px'}　css={{borderCollapse:'collapse'}}>
                      <TableRow css={{height:"20"}}>
                        <CCell rowSpan={2}>断丝的形式</CCell>
                        <CCell colSpan={3}>钢丝绳的类型
                        </CCell>
                      </TableRow>
                      <TableRow css={{height:"19 px"}}>
                        <CCell>6×19</CCell>
                        <CCell>13×14</CCell>
                        <CCell>9×19</CCell>
                      </TableRow>
                      <TableRow>
                        <CCell>均布在外层绳股上</CCell>
                        <CCell>24</CCell><CCell>30</CCell><CCell>34</CCell>
                      </TableRow>
                      <TableRow>
                        <CCell>集中在一或者{items&&items[0].upLoadDate}两根外层绳股上</CCell>
                        <CCell>24</CCell><CCell>30</CCell><CCell>34</CCell>
                      </TableRow>
                      <TableRow>
                        <CCell>一根外绳股上相邻的断丝</CCell>
                        <CCell>4</CCell><CCell>4</CCell><CCell>4</CCell>
                      </TableRow>
                      <TableRow>
                        <CCell>股谷（缝）断丝 </CCell>
                        {
                          items? ( items.map(hit => {
                              //const myurl ='/inspect/'+hit.id;
                              return (
                                <CCell>
                                    {hit.no}
                                </CCell>
                              );
                            } ) )
                            :
                            (<React.Fragment>
                              <CCell>2</CCell> <CCell>3</CCell> <CCell>6</CCell>
                            </React.Fragment>)
                        }

                      </TableRow>
                      <TableRow>
                <CCell rowSpan={3} css={{backgroundImage: `url(http://g1.dfcfw.com/g3/201910/20191025193912.jpg)`,backgroundSize:"cover"}}>
                  机构核准证号：TS7110236-2022  （机构公章或检验专用章 ）
                  <Embed width={4} height={4} css={{ maxWidth: '40vmin' }}>
                  </Embed>
                  签发日期：2020-04-22
                </CCell>
                      </TableRow>
                    </Table>
      <div css={{padding:"19px 12px"}}>③钢丝绳直径小于其公称直径的90%；<br/>
        ④钢丝绳严重锈蚀，铁锈填满绳股间隙。<br/>
        采用其他类型悬挂装置的，悬挂装置的磨损、变形等不得超过制造单位设定的报废指标
      </div>
    </div>),
];
*/

//这个printing打印场景，实现比css更加强化CSS层面只能局限DOM节点，而JS操纵能力是在上层的逻辑。
//这个printing修改成应用层面用户的指认：明确为了打印而启动页面，它就和css毫无关系了，和useMedia也无关了。
interface PrintReportProps {
  source: any;
  printing?: boolean;
  template?: React.ReactElement<React.RefForwardingComponent<InternalItemHandResult,TemplateViewProps>>;
}
//viewAll是否是整个报表都一起显示。
//export default function RecordView({printing, inp}:{printing?:boolean,inp:any },props) {
export const PrintReport: React.FunctionComponent<PrintReportProps> = ({
                                                                       printing=false,
                                                                         source,
                                                                       template,
                                                                       ...other
                                                                     }) => {
  const theme = useTheme();

  const ref = React.useRef();
  const [items, setItems] = React.useState(
    Array.from(new Array(3)).map(() => faker.name.firstName())
  );

  function fetchdata() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  }


  const [page, setPage] = React.useState(0);
  //customize-easy-ui-component.useInfiniteScroll必须内容撑开才可以滚动触发函数。
  const [fetching] = useInfiniteScroll({
    container: ref,
    hasMore: page <3,
    onFetch: () => {
      return fetchdata().then(() => {
        setItems([
          ...items,
          ...Array.from(new Array(3)).map(() => faker.name.firstName())
        ]);
        setPage(page + 1);
      });
    }
  });

  //针对较小屏幕优化显示效果； "@media (min-width:690px),print and (min-width:538px)":  "@media (min-width:690px),print and (min-width:538px)"
  //const smallScr = useMedia('only screen and (max-width:799px)');
  //useMedia实际上很可能有一个初始数值false然后才是新的，可能有两次render才会稳住；不能指望一次就能获取正确。打印预览实际是根据当前页面最新状态去打印的。
  //useMedia('print')这个在打印场景时会摇摆，先是=true然后变=false。打印预览useMedia最终竟然是false了，有2次的render。因为打印预览不仅打印，还同时会更新网页；无法！。
  const notSmallScr = useMedia('(min-width:800px),print');

  //小屏幕缺省可隐藏些不重要的内容。
  const [redundance, setRedundance] =React.useState(notSmallScr||printing);
  function onPress() {
    setRedundance(!redundance);
  }
  //这个外来useTouchable组件感觉有点小毛病。
  const { bind, } = useTouchable({
    onPress,
    terminateOnScroll: false,
    delay: 0,
    behavior: "button"
  });
  React.useEffect(() => {
    setRedundance(notSmallScr||printing);
  }, [notSmallScr, printing] );

  console.log("当前的 useMediasmallScr=",notSmallScr, "source=",source);
  //最多＝8列 <Table合计约1040px；原来PDF打印看着像是905px的。
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
        <div role="button" tabIndex={0} {...bind}>
          {!(redundance) && <Text variant="h4">
               {`No：JD2020FTC00004 更多...`}
             </Text>
          }
        </div>
        <Collapse id={'1'} show={redundance} noAnimated>
          <div role="button" {...bind}>
            <div css={{
              textAlign: "center",
              "& > div": {
                marginLeft: "auto",
                marginRight: "auto"
              },
              "@media (min-width:690px),print and (min-width:538px)": {
                display: "flex",
                justifyContent: "space-between",
                "& > div": {
                  margin: theme.spaces.sm,
                }
              }
            }}
            >
              <div>
                <Embed css={{width: "190px",margin: "auto"}} width={95} height={45}>
                  <FadeImage src={`${require("../images/MA.png")}`}/>
                </Embed>
                <br/>
                <Text variant="h5">181320110160</Text>
              </div>
              <div>
                <Embed css={{width: "140px",margin: "auto"}} width={10} height={10}>
                  <FadeImage src={`${require("../images/reportNoQR.png")}`}/>
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
        <Table  fixed={ ["20%","%"]  }
                printColWidth={ ["210","750"] }
                css={ {borderCollapse: 'collapse'} }
        >
          <TableBody>
            <TableRow>
              <RCell css={{border:'none'}}>使用单位</RCell>
              <CCell css={{border:'none',borderBottom:`1px dashed ${theme.colors.intent.primary.light}`}}>林钦全</CCell>
            </TableRow>
            <TableRow>
              <RCell css={{border:'none'}}>分支机构</RCell>
              <CCell css={{border:'none',borderBottom:`1px dashed ${theme.colors.intent.primary.light}`}}>/</CCell>
            </TableRow>
            <TableRow>
              <RCell css={{border:'none'}}>楼盘名称</RCell>
              <CCell css={{border:'none',borderBottom:`1px dashed ${theme.colors.intent.primary.light}`}}>/</CCell>
            </TableRow>
            <TableRow>
              <RCell css={{border:'none'}}>设备类别</RCell>
              <CCell css={{border:'none',borderBottom:`1px dashed ${theme.colors.intent.primary.light}`}}>曳引与强制驱动电梯</CCell>
            </TableRow>
            <TableRow>
              <RCell css={{border:'none'}}>设备品种</RCell>
              <CCell css={{border:'none',borderBottom:`1px dashed ${theme.colors.intent.primary.light}`}}>曳引驱动乘客电梯</CCell>
            </TableRow>
            <TableRow>
              <RCell css={{border:'none'}}>检验日期</RCell>
              <CCell css={{border:'none',borderBottom:`1px dashed ${theme.colors.intent.primary.light}`}}>2020-01-02</CCell>
            </TableRow>
            <TableRow>
              <RCell css={{border:'none'}}>监察识别码</RCell>
              <CCell css={{border:'none',borderBottom:`1px dashed ${theme.colors.intent.primary.light}`}}>TA74507</CCell>
            </TableRow>
            <TableRow>
              <RCell css={{border:'none'}}>设备号</RCell>
              <CCell css={{border:'none',borderBottom:`1px dashed ${theme.colors.intent.primary.light}`}}>3501T104807</CCell>
            </TableRow>
            <TableRow>
              <RCell css={{border:'none'}}>设备代码</RCell>
              <CCell css={{border:'none',borderBottom:`1px dashed ${theme.colors.intent.primary.light}`}}>/</CCell>
            </TableRow>
          </TableBody>
        </Table>
        <br/>
        <div role="button" tabIndex={1} {...bind}>
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
            </div>
          <div role="button" {...bind}>
            <Text variant="h1" css={{textAlign:'center'}}>注意事项</Text>
          </div>
            <Text variant="h4"><br/>
              1. 本报告依据《电梯监督检验和定期检验规则——曳引与强制驱动电梯》（TSG T7001-2009）及1号、2号修改单制定，适用于有机房曳引驱动电梯定期检验。<br/>
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
            </Text>
          <div role="button" {...bind}>
            <Text variant="h2" css={{textAlign:'center'}}>有机房曳引驱动电梯定期检验报告</Text>
          </div>
        </Collapse>
        <Table  fixed={ ["11%","23%","6%","%"]  }
                printColWidth={ ["95","210","110","300"] }
                css={ {borderCollapse: 'collapse' } }
        >
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
              <CCell>林钦全</CCell>
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
        </Table>
        <Table  fixed={ ["6%","7%","7%","9%","10%","17%","%"]  }
                printColWidth={ ["46","46","55","55","130","405","175"] }
                css={ {borderCollapse: 'collapse' } }
        >
          <TableBody>
            <TableRow>
              <CCell component="th" scope="row">设备技术参数</CCell>
              <CCell colSpan={6} css={{padding:0}}>
                <Table  fixed={ ["11%","23%","6%","%"]  }
                        printColWidth={ ["95","210","110","300"] }
                        css={ {borderCollapse: 'collapse' } }
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
            <TableRow >
              <CCell component="th" scope="row" rowSpan={3}>主要检验仪器设备</CCell>
              <CCell>序号</CCell>
              <CCell>仪器名称</CCell>
              <CCell>仪器编号</CCell>
              <CCell>序号</CCell>
              <CCell>仪器名称</CCell>
              <CCell>仪器编号</CCell>
            </TableRow>
            <TableRow >
              <CCell>1</CCell>
              <CCell>宽量面游标卡尺</CCell>
              <CCell>JDA0520</CCell>
              <CCell>2</CCell>
              <CCell>钢卷尺</CCell>
              <CCell>JDA0520</CCell>
            </TableRow>
            <TableRow >
              <CCell>3</CCell>
              <CCell>宽量面游标卡尺</CCell>
              <CCell>JDA0520</CCell>
              <CCell>4</CCell>
              <CCell>钢卷尺</CCell>
              <CCell>JDA0520</CCell>
            </TableRow>
            <TableRow>
              <CCell component="th" scope="row">检验结论</CCell>
              <CCell colSpan={6}><Text variant="h1" css={{fontSize:'4rem'}}>不合格</Text></CCell>
            </TableRow>
            <TableRow>
              <CCell component="th" scope="row">备注</CCell>
              <Cell colSpan={6}>/</Cell>
            </TableRow>
          </TableBody>
        </Table>
        <Table  fixed={ ["11%","23%","6%","12%","%"]  }
                printColWidth={ ["95","210","90","110","300"] }
                css={ {borderCollapse: 'collapse' } }
        >
          <TableBody>
            <TableRow>
              <CCell component="th" scope="row">检验日期</CCell>
              <CCell colSpan={2}>2020-01-02</CCell>
              <CCell>下次检验日期</CCell>
              <CCell>/</CCell>
            </TableRow>
            <TableRow>
              <CCell component="th" scope="row">检验人员</CCell>
              <Cell colSpan={4}>照明士 大夫 照明 开关</Cell>
            </TableRow>
            <TableRow>
              <CCell component="th" scope="row">编制</CCell>
              <CCell>刘洪亮</CCell>
              <CCell>日期</CCell>
              <CCell>2020-01-02</CCell>
              <CCell rowSpan={3}>
                <div css={{backgroundImage:`url(${require("../images/seal.png")})`,backgroundSize:"cover",backgroundPosition:"center",minHeight:'30vmin'}}>
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
          <TableHead >
            <TableRow>
              <CCell>序号</CCell>
              <CCell>检验类别</CCell>
              <CCell colSpan={4}>检验项目及内容</CCell>
              <CCell>检验结果</CCell>
              <CCell>检验结论</CCell>
            </TableRow>
          </TableHead>
          <TableBody>

            <TableRow>
              <CCell component="th" scope="row" rowSpan={5}>1</CCell>
              <CCell rowSpan={5}>B</CCell>
              <CCell rowSpan={5}>1技术资料</CCell>
              <CCell rowSpan={5}>1.4</CCell>
              <CCell rowSpan={5}>使用资料</CCell>
              <Cell>(1)使用登记资料</Cell>
              <CCell>符合</CCell>
              <CCell rowSpan={5}></CCell>
            </TableRow>
            <TableRow key={2}>
              <Cell>(2)安全技术档案</Cell>
              <CCell>符合</CCell>
            </TableRow>
            <TableRow >
              <Cell>(3)管理规章制度</Cell>
              <CCell>符合</CCell>
            </TableRow>
            <TableRow >
              <Cell>(4)日常维护保养合同</Cell>
              <CCell>符合</CCell>
            </TableRow>
            <TableRow >
              <Cell>(5)特种设备作业人员证</Cell>
              <CCell>符合</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" rowSpan={3}>2</CCell>
              <CCell rowSpan={3}>C</CCell>
              <CCell rowSpan={20}>2机房(机器设备间)及相关设备</CCell>
              <CCell rowSpan={3}>2.1</CCell>
              <CCell rowSpan={3}>通道与通道门</CCell>
              <Cell>(1)通道设置</Cell>
              <CCell>资料确认符合</CCell>
              <CCell rowSpan={3}>合格</CCell>
            </TableRow>
            <TableRow >
              <Cell>(2)通道照明</Cell>
              <CCell>资料确认符合</CCell>
            </TableRow>
            <TableRow>
              <Cell>(3)通道门</Cell>
              <CCell>资料确认符合</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row">3</CCell>
              <CCell>C</CCell>
              <CCell>2.5</CCell>
              <Cell colSpan={2}>(1)照明、照明开关</Cell>
              <CCell>符合</CCell>
              <CCell></CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row">4</CCell>
              <CCell>B</CCell>
              <CCell>2.6</CCell>
              <Cell colSpan={2}>(2)主开关与照明等电路的控制关系</Cell>
              <CCell>符合</CCell>
              <CCell></CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" rowSpan={4}>5</CCell>
              <CCell rowSpan={4}>B</CCell>
              <CCell rowSpan={4}>2.7</CCell>
              <CCell rowSpan={4}>驱动主机</CCell>
              <Cell>(2)工作状况</Cell>
              <CCell>符合</CCell>
              <CCell rowSpan={4}>合格</CCell>
            </TableRow>
            <TableRow >
              <Cell>(3)轮槽磨损</Cell>
              <CCell>符合</CCell>
            </TableRow>
            <TableRow >
              <Cell>(4)制动器动作情况</Cell>
              <CCell>符合</CCell>
            </TableRow>
            <TableRow >
              <Cell>★(5)手动紧急操作装置</Cell>
              <CCell>符合</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" rowSpan={6}>6</CCell>
              <CCell rowSpan={6}>B</CCell>
              <CCell rowSpan={6}>2.8</CCell>
              <CCell rowSpan={6}>控制柜、紧急操作和动态测试装置</CCell>
              <Cell>(2)断错相保护</Cell>
              <CCell>符合</CCell>
              <CCell rowSpan={6}></CCell>
            </TableRow>
            <TableRow >
              <Cell>(4)紧急电动运行装置</Cell>
              <CCell>／</CCell>
            </TableRow>
            <TableRow >
              <Cell>☆(6)层门和轿门旁路装置</Cell>
              <CCell>／</CCell>
            </TableRow>
            <TableRow >
              <Cell>☆(7)门回路检测功能</Cell>
              <CCell>／</CCell>
            </TableRow>
            <TableRow >
              <Cell>☆(8)制动器故障保护</Cell>
              <CCell>／</CCell>
            </TableRow>
            <TableRow >
              <Cell>☆(9)自动救援操作装置</Cell>
              <CCell>／</CCell>
            </TableRow>
            <TableRow>
              <CCell component="th" scope="row" rowSpan={3}>7</CCell>
              <CCell rowSpan={3}>B</CCell>
              <CCell rowSpan={3}>2.9</CCell>
              <CCell rowSpan={3}>限速器</CCell>
              <Cell>(2)电气安全装置</Cell>
              <CCell>符合</CCell>
              <CCell rowSpan={3}>合格</CCell>
            </TableRow>
            <TableRow >
              <Cell>(3)封记及运转情况</Cell>
              <CCell>符合</CCell>
            </TableRow>
            <TableRow >
              <Cell>(4)动作速度校验</Cell>
              <CCell>资料确认符合</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row">8</CCell>
              <CCell>C</CCell>
              <CCell>2.10</CCell>
              <Cell colSpan={2}>(2)接地连接</Cell>
              <CCell>符合</CCell>
              <CCell></CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row">9</CCell>
              <CCell>C</CCell>
              <CCell>2.11</CCell>
              <Cell colSpan={2}>电气绝缘</Cell>
              <CCell>资料确认符合</CCell>
              <CCell></CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" rowSpan={2}>10</CCell>
              <CCell rowSpan={2}>C</CCell>
              <CCell rowSpan={6}>3井道及相关设备</CCell>
              <CCell rowSpan={2}>3.4</CCell>
              <Cell rowSpan={2}>井道安全门</Cell>
              <Cell>(3)门锁</Cell>
              <CCell>／</CCell>
              <CCell rowSpan={2}>／</CCell>
            </TableRow>
            <TableRow >
              <Cell>(4)电气安全装置</Cell>
              <CCell>／</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" rowSpan={2}>11</CCell>
              <CCell rowSpan={2}>C</CCell>
              <CCell rowSpan={2}>3.5</CCell>
              <Cell rowSpan={2}>井道检修门</Cell>
              <Cell>(3)门锁</Cell>
              <CCell>／</CCell>
              <CCell rowSpan={2}>／</CCell>
            </TableRow>
            <TableRow >
              <Cell>(4)电气安全装置</Cell>
              <CCell>／</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row">12</CCell>
              <CCell>B</CCell>
              <CCell>3.7</CCell>
              <Cell colSpan={2}>轿厢与井道壁距离</Cell>
              <CCell>间距0.14m</CCell>
              <CCell></CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row">13</CCell>
              <CCell>B</CCell>
              <CCell>3.10</CCell>
              <Cell colSpan={2}>极限开关</Cell>
              <CCell>符合</CCell>
              <CCell></CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row">14</CCell>
              <CCell>C</CCell>
              <CCell rowSpan={7}>3井道及相关设备</CCell>
              <CCell>3.11</CCell>
              <Cell colSpan={2}>井道照明</Cell>
              <CCell>符合</CCell>
              <CCell></CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" rowSpan={2}>15</CCell>
              <CCell rowSpan={2}>C</CCell>
              <CCell rowSpan={2}>3.12</CCell>
              <CCell rowSpan={2}>底坑设施与装置</CCell>
              <Cell>(1)底坑底部</Cell>
              <CCell>符合</CCell>
              <CCell rowSpan={2}>合格</CCell>
            </TableRow>
            <TableRow >
              <Cell>(3)停止装置</Cell>
              <CCell>符合</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row">16</CCell>
              <CCell>B</CCell>
              <CCell>3.14</CCell>
              <Cell colSpan={2}>(2)限速绳张紧装置的电气安全装置</Cell>
              <CCell>符合</CCell>
              <CCell></CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" rowSpan={3}>17</CCell>
              <CCell rowSpan={3}>B</CCell>
              <CCell rowSpan={3}>3.15</CCell>
              <CCell rowSpan={3}>缓冲器</CCell>
              <Cell>(3)固定和完好情况</Cell>
              <CCell>符合</CCell>
              <CCell rowSpan={3}>合格</CCell>
            </TableRow>
            <TableRow >
              <Cell>(4)液位和电气安全装置</Cell>
              <CCell>符合</CCell>
            </TableRow>
            <TableRow >
              <Cell>(5)对重越程距离</Cell>
              <CCell>最大允许值400mm; 测量值260mm</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" rowSpan={2}>18</CCell>
              <CCell rowSpan={2}>C</CCell>
              <CCell rowSpan={10}>4轿厢与对重</CCell>
              <CCell rowSpan={2}>4.1</CCell>
              <CCell rowSpan={2}>轿顶电气装置</CCell>
              <Cell>(1)检修装置</Cell>
              <CCell>符合</CCell>
              <CCell rowSpan={2}>合格</CCell>
            </TableRow>
            <TableRow >
              <Cell>(2)停止装置</Cell>
              <CCell>符合</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" >19</CCell>
              <CCell>C</CCell>
              <CCell>4.3</CCell>
              <Cell colSpan={2}>(3)安全门(窗)电气安全装置</Cell>
              <CCell>／</CCell>
              <CCell>／</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" rowSpan={2}>20</CCell>
              <CCell rowSpan={2}>B</CCell>
              <CCell rowSpan={2}>4.5</CCell>
              <CCell rowSpan={2}>对重(平衡重)块</CCell>
              <Cell>(1)固定</Cell>
              <CCell>符合</CCell>
              <CCell rowSpan={2}>合格</CCell>
            </TableRow>
            <TableRow >
              <Cell>(2)识别数量的措施</Cell>
              <CCell>符合</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" >21</CCell>
              <CCell>C</CCell>
              <CCell>4.6</CCell>
              <Cell colSpan={2}>(2)轿厢超面积载货电梯的控制条件</Cell>
              <CCell>／</CCell>
              <CCell>／</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" rowSpan={2}>22</CCell>
              <CCell rowSpan={2}>B</CCell>
              <CCell rowSpan={2}>4.8</CCell>
              <CCell rowSpan={2}>紧急照明和报警装置</CCell>
              <Cell>(1)紧急照明</Cell>
              <CCell>符合</CCell>
              <CCell rowSpan={2}>不合格</CCell>
            </TableRow>
            <TableRow >
              <Cell>(2)紧急报警装置</Cell>
              <CCell>不符合</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" >23</CCell>
              <CCell>C</CCell>
              <CCell>4.9</CCell>
              <Cell colSpan={2}>地坎护脚板</Cell>
              <CCell>资料确认符合</CCell>
              <CCell>合格</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" >24</CCell>
              <CCell>C</CCell>
              <CCell>4.10</CCell>
              <Cell colSpan={2}>超载保护装置</Cell>
              <CCell>资料确认符合</CCell>
              <CCell>合格</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" >25</CCell>
              <CCell>C</CCell>
              <CCell rowSpan={7}>5<br/>悬挂装置、补偿装置及旋转部件防护</CCell>
              <CCell>5.1</CCell>
              <Cell colSpan={2}>悬挂装置、补偿装置的磨损、断丝、变形等情况</Cell>
              <CCell>符合</CCell>
              <CCell>合格</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" >26</CCell>
              <CCell>C</CCell>
              <CCell>5.2</CCell>
              <Cell colSpan={2}>绳端固定</Cell>
              <CCell>符合</CCell>
              <CCell>合格</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" rowSpan={3}>27</CCell>
              <CCell rowSpan={3}>C</CCell>
              <CCell rowSpan={3}>5.3</CCell>
              <CCell rowSpan={3}>补偿装置</CCell>
              <Cell>(1)绳(链)端固定</Cell>
              <CCell>符合</CCell>
              <CCell rowSpan={3}>合格</CCell>
            </TableRow>
            <TableRow >
              <Cell>(2)电气安全装置</Cell>
              <CCell>／</CCell>
            </TableRow>
            <TableRow >
              <Cell>(3)补偿绳防跳装置</Cell>
              <CCell>／</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" >28</CCell>
              <CCell>B</CCell>
              <CCell>5.5</CCell>
              <Cell colSpan={2}>松绳(链)保护</Cell>
              <CCell>／</CCell>
              <CCell>／</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" >29</CCell>
              <CCell>C</CCell>
              <CCell>5.6</CCell>
              <Cell colSpan={2}>旋转部件的防护</Cell>
              <CCell>符合</CCell>
              <CCell>合格</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" rowSpan={2}>30</CCell>
              <CCell rowSpan={2}>C</CCell>
              <CCell rowSpan={7}>6<br/>轿门与层门</CCell>
              <CCell rowSpan={2}>6.3</CCell>
              <CCell rowSpan={2}>门间隙</CCell>
              <Cell>(1)门扇间隙</Cell>
              <CCell>符合</CCell>
              <CCell rowSpan={2}>合格</CCell>
            </TableRow>
            <TableRow >
              <Cell>(2)人力施加在最不利点时间隙</Cell>
              <CCell>符合</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" >31</CCell>
              <CCell>C</CCell>
              <CCell>6.4</CCell>
              <Cell colSpan={2}>玻璃门防拖曳措施</Cell>
              <CCell>／</CCell>
              <CCell>／</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" >32</CCell>
              <CCell>B</CCell>
              <CCell>6.5</CCell>
              <Cell colSpan={2}>防止门夹人的保护装置</Cell>
              <CCell>符合</CCell>
              <CCell>合格</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" >33</CCell>
              <CCell>B</CCell>
              <CCell>6.6</CCell>
              <Cell colSpan={2}>门的运行与导向</Cell>
              <CCell>符合</CCell>
              <CCell>合格</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" >34</CCell>
              <CCell>B</CCell>
              <CCell>6.7</CCell>
              <Cell colSpan={2}>自动关闭层门装置</Cell>
              <CCell>符合</CCell>
              <CCell>合格</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" >35</CCell>
              <CCell>B</CCell>
              <CCell>6.8</CCell>
              <Cell colSpan={2}>紧急开锁装置</Cell>
              <CCell>符合</CCell>
              <CCell>合格</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" rowSpan={2}>36</CCell>
              <CCell rowSpan={2}>B</CCell>
              <CCell rowSpan={7}>6<br/>轿门与层门</CCell>
              <CCell rowSpan={2}>6.9</CCell>
              <CCell rowSpan={2}>门的锁紧</CCell>
              <Cell>(1)层门门锁装置[不含6.9(1)①]</Cell>
              <CCell>符合</CCell>
              <CCell rowSpan={2}>合格</CCell>
            </TableRow>
            <TableRow >
              <Cell>(2)轿门门锁装置[不含6.9(1)①]</Cell>
              <CCell>符合</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" rowSpan={2}>37</CCell>
              <CCell rowSpan={2}>B</CCell>
              <CCell rowSpan={2}>6.10</CCell>
              <CCell rowSpan={2}>门的闭合</CCell>
              <Cell>(1)机电联锁</Cell>
              <CCell>符合</CCell>
              <CCell rowSpan={2}>合格</CCell>
            </TableRow>
            <TableRow >
              <Cell>(2)电气安全装置</Cell>
              <CCell>符合</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" rowSpan={2}>38</CCell>
              <CCell rowSpan={2}>B</CCell>
              <CCell rowSpan={2}>☆<br/>6.11</CCell>
              <CCell rowSpan={2}>轿门开门限制装置及轿门的开启</CCell>
              <Cell>(1)轿门开门限制装置</Cell>
              <CCell>／</CCell>
              <CCell rowSpan={2}>／</CCell>
            </TableRow>
            <TableRow >
              <Cell>(2)轿门的开启</Cell>
              <CCell>／</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" >39</CCell>
              <CCell>C</CCell>
              <CCell>6.12</CCell>
              <Cell colSpan={2}>门刀、门锁滚轮与地坎间隙</Cell>
              <CCell>符合</CCell>
              <CCell>合格</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" >40</CCell>
              <CCell>C</CCell>
              <CCell rowSpan={7}>8<br/>试验</CCell>
              <CCell>8.1</CCell>
              <Cell colSpan={2}>平衡系数试验</Cell>
              <CCell>资料确认符合</CCell>
              <CCell>合格</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" >41</CCell>
              <CCell>C</CCell>
              <CCell>8.2</CCell>
              <Cell colSpan={2}>★轿厢上行超速保护装置试验</Cell>
              <CCell>符合</CCell>
              <CCell>合格</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" rowSpan={2}>42</CCell>
              <CCell rowSpan={2}>B</CCell>
              <CCell rowSpan={2}>☆<br/>8.3</CCell>
              <CCell rowSpan={2}>轿厢意外移动保护装置试验</CCell>
              <Cell>(1)制停情况</Cell>
              <CCell>／</CCell>
              <CCell rowSpan={2}>／</CCell>
            </TableRow>
            <TableRow >
              <Cell>(2)自监测功能</Cell>
              <CCell>／</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" >43</CCell>
              <CCell>B</CCell>
              <CCell>8.4</CCell>
              <Cell colSpan={2}>轿厢限速器－安全钳试验</Cell>
              <CCell>符合</CCell>
              <CCell>合格</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" >44</CCell>
              <CCell>B</CCell>
              <CCell>8.5</CCell>
              <Cell colSpan={2}>对重(平衡重)限速器—安全钳试验</Cell>
              <CCell>／</CCell>
              <CCell>／</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" >45</CCell>
              <CCell>C</CCell>
              <CCell>8.6</CCell>
              <Cell colSpan={2}>运行试验</Cell>
              <CCell>符合</CCell>
              <CCell>合格</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" rowSpan={3}>46</CCell>
              <CCell rowSpan={3}>B</CCell>
              <CCell rowSpan={8}>8<br/>试验</CCell>
              <CCell rowSpan={3}>8.7</CCell>
              <CCell rowSpan={3}>应急救援试验</CCell>
              <Cell>(1)救援程序</Cell>
              <CCell>符合</CCell>
              <CCell rowSpan={3}>合格</CCell>
            </TableRow>
            <TableRow >
              <Cell>(2)救援通道</Cell>
              <CCell>符合</CCell>
            </TableRow>
            <TableRow >
              <Cell>(3)救援操作</Cell>
              <CCell>符合</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" >47</CCell>
              <CCell>B</CCell>
              <CCell>8.9</CCell>
              <Cell colSpan={2}>空载曳引检查</Cell>
              <CCell>符合</CCell>
              <CCell>合格</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" >48</CCell>
              <CCell>B</CCell>
              <CCell>8.10</CCell>
              <Cell colSpan={2}>上行制动工况曳引检查</Cell>
              <CCell>符合</CCell>
              <CCell>合格</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" >49</CCell>
              <CCell>B</CCell>
              <CCell>8.11</CCell>
              <Cell colSpan={2}>▲下行制动工况曳引检查</Cell>
              <CCell>／</CCell>
              <CCell>／</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" >50</CCell>
              <CCell>B</CCell>
              <CCell>8.12</CCell>
              <Cell colSpan={2}>▲静态曳引试验</Cell>
              <CCell>／</CCell>
              <CCell>／</CCell>
            </TableRow>
            <TableRow >
              <CCell component="th" scope="row" >51</CCell>
              <CCell>B</CCell>
              <CCell>8.13</CCell>
              <Cell colSpan={2}>制动试验</Cell>
              <CCell>／</CCell>
              <CCell>／</CCell>
            </TableRow>
          </TableBody>
        </Table>
        检验不合格项目内容及复检结果
        <Table  fixed={ ["5%","11%","%","14%","14%"]  }
                printColWidth={ ["35","66","700","70","95"] }
                css={ {borderCollapse: 'collapse' } }
        >
          <TableHead >
            <TableRow>
              <CCell>序号</CCell>
              <CCell>类别/编号</CCell>
              <CCell>检验不合格内容记录</CCell>
              <CCell>复检结果</CCell>
              <CCell>复检日期</CCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <CCell component="th" scope="row">1</CCell>
              <CCell>B/4.8</CCell>
              <CCell>紧急报警装置未接到有人值班处。</CCell>
              <CCell>不合格</CCell>
              <CCell>2015-08-13</CCell>
            </TableRow>
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
        - 报告完毕 -
      </div>
    </React.Fragment>
  );
}



/* function getUser() {
  faker.seed(0);
  return {
    name: faker.name.firstName() + " " + faker.name.lastName(),
    uid: faker.random.uuid(),
    description: faker.lorem.sentence()
  };
}*/


/*
在<React.Fragment> 加css是没有用的。
制作模板尺寸格式 <Table fixed={isPrint? ["150px", "300px", "15%", "15%", "50px"] : undefined}> 打印文书需要固定的列宽度/不要能自动调节的。
   实际表格尺寸会被调整；其中x%部分会优先分配的，150px实际也会被调小调大，不限定的"%"的{可变动很大！,最多用在某个列}。
   固定数100px会导致适应不同纸张和缩放比例后打印表格的各列尺寸变化较大！最好统一用％的相对尺寸设置。
html网页最小12px字体，再按照缩放70%打印到纸张，是人眼视力极限最小字，以此敲定70%打印缩放。
这样有一个固定px的<Table fixed={["15%", "40%", "20%", "300px", "15%"]} >导致合计px超出打印默认px，引起实际上自动缩放！
  就算没有超出<Table fixed={["15%", "40%", "20%", "30px", "15%"]}>因为的%自主调整，也会稍有点收缩打印。
  这样的<Table fixed={["1", "2", "3", "1", "1"] }> 都能自动调整(这里数字1其实是1px省略的)，也会有点收缩打印。
  最大情况<Table fixed={printing&&["200px", "200px", "275px", "200px", "200px"] ||undefined}>超过1075px的不设定缩放A4打印就会被修剪掉。
  纯粹用百分比<Table fixed={["16%", "15%", "8%", "25%", "%"] }>或可带点px,就会较好，较少发生收缩打印。
  这样<Table fixed={["100", "30%", "50%", "15%", "25%"] }>也会稍有点收缩打印。
*/

/* useMedia日志：：预览-真实打印-真实打印缩放-预览缩放-回到屏幕; ? 那为什么在css[]内部使用确能做到的；外在hook办不到。
          <Table fixed={printing&&["46","46","55","55","130","405","175","120"] ||undefined}
                 css={ {borderCollapse: 'collapse' } }
          >
Collapse-捕获bounds = DOMRectReadOnly?{x: 0, y: 0, width: 413.59375, height: 3380.796875, top: 0,?…} ; isPrint= false
Collapse-捕获bounds = DOMRectReadOnly?{x: 0, y: 0, width: 413.59375, height: 3380.796875, top: 0,?…} ; isPrint= true
Collapse-捕获bounds = DOMRectReadOnly?{x: 0, y: 0, width: 717, height: 3685, top: 0,?…} ; isPrint= true
Collapse-捕获bounds = DOMRectReadOnly?{x: 0, y: 0, width: 717, height: 3685, top: 0,?…} ; isPrint= false
Collapse-捕获bounds = DOMRectReadOnly?{x: 0, y: 0, width: 759.1875, height: 2538.390625, top: 0,?…} ; isPrint= false
          <Table fixed={printing&&["46","46","55","55","130","405","175","120"]
          || ["5%","5%","6%","6%","10%","%","175","10%"] }
                 css={ {borderCollapse: 'collapse' } }
          >
  media queries查询条件的使用 Query的语法只有四项：and、or、not、only ;
小屏幕非打印的：简化显示。
      <div role="link" tabIndex={0} {...bind}>
            {!(redundance||printing) && `No：JD2020FTC00004   更多...`}
      </div>
      <Collapse id={'1'} show={redundance||printing} noAnimated>
        <div role="link" {...bind}>
        </div>
      </Collapse>
*/

//CSS height: fill-available;最大满屏幕，打印不超一张，用火狐不行！ 不可以加maxHeight:'35vw'高度限制；限制最小不限最大。
//利用fill-available可以轻松地实现等高布局；width:min-content，默认英文单词不换行，最小宽度是里面最长的英文单词的宽度，超小屏幕会超出。

