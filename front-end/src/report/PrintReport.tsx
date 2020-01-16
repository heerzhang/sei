/** @jsx jsx */
import { jsx,} from "@emotion/core";
import * as React from "react";
import {
   ScrollView,
 useInfiniteScroll
} from "customize-easy-ui-component";
import {Table, TableBody, TableHead, TableRow, Cell, CCell} from "../comp/TableExt";



//import { globalHistory  } from "@reach/router";
import { useMedia } from "use-media";
//import { FadeImage } from "../FadeImage";
import faker from "faker/locale/zh_CN";

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
      <Table css={{borderCollapse:'collapse'}}>
        <TableRow css={{height:'23px'}}>
          <CCell rowSpan={2}>断丝的形式</CCell>
          <CCell colSpan={3}>钢丝绳的类型
          </CCell>
        </TableRow>
        <TableRow css={{height:'23px'}}>
          <CCell>6×19</CCell>
          <CCell>8×19</CCell>
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
          <CCell>1</CCell><CCell>1</CCell><CCell>1</CCell>
        </TableRow>
        <TableRow>
          <Cell colSpan={4}>注：上述断丝数参考长度为一个捻距，约为6d（d表示钢丝绳
            的公称直径，mm）</Cell>
        </TableRow>
      </Table>
      <div css={{padding:"19px 12px"}}>③钢丝绳直径小于其公称直径的90%；<br/>
        ④钢丝绳严重锈蚀，铁锈填满绳股间隙。<br/>
        采用其他类型悬挂装置的，悬挂装置的磨损、变形等不得超过制造单位设定的报废指标
      </div>
    </div>),
];
*/

//printing是否是打印预览。
export default function PrintReport({printing, }:{printing?:boolean, },props) {
 // const theme = useTheme();

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

  const printSizeW = useMedia('print and (min-width: 769px) and (max-width: 769px)');

  console.log("当前的 useMedia PRTreport printSizeW=",printSizeW, "printing=",printing, fetching);
  //最多＝8列 <Table合计约1040px；原来PDF打印看着像是905px的。
  return (
    <React.Fragment>

      <ScrollView  css={{ height: "100%" }} >
        <div >
          <Table  fixed={ ["5%","5%","6%","6%","10%","%","175","10%"]  }
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

              <TableRow key={1}>
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
              <TableRow key={2}>
                <Cell>(3)管理规章制度</Cell>
                <CCell>符合</CCell>
              </TableRow>
              <TableRow key={2}>
                <Cell>(4)日常维护保养合同</Cell>
                <CCell>符合</CCell>
              </TableRow>
              <TableRow key={2}>
                <Cell>(5)特种设备作业人员证</Cell>
                <CCell>符合</CCell>
              </TableRow>
              <TableRow key={1}>
                <CCell component="th" scope="row" rowSpan={3}>2</CCell>
                <CCell rowSpan={3}>C</CCell>
                <CCell rowSpan={20}>2机房(机器设备间)及相关设备</CCell>
                <CCell rowSpan={3}>2.1</CCell>
                <CCell rowSpan={3}>通道与通道门</CCell>
                <Cell>(1)通道设置</Cell>
                <CCell>资料确认符合</CCell>
                <CCell rowSpan={3}>合格</CCell>
              </TableRow>
              <TableRow key={2}>
                <Cell>(2)通道照明</Cell>
                <CCell>资料确认符合</CCell>
              </TableRow>
              <TableRow key={2}>
                <Cell>(3)通道门</Cell>
                <CCell>资料确认符合</CCell>
              </TableRow>
              <TableRow key={1}>
                <CCell component="th" scope="row">3</CCell>
                <CCell>C</CCell>
                <CCell>2.5</CCell>
                <Cell colSpan={2}>(1)照明、照明开关</Cell>
                <CCell>符合</CCell>
                <CCell></CCell>
              </TableRow>
              <TableRow key={1}>
                <CCell component="th" scope="row">4</CCell>
                <CCell>B</CCell>
                <CCell>2.6</CCell>
                <Cell colSpan={2}>(2)主开关与照明等电路的控制关系</Cell>
                <CCell>符合</CCell>
                <CCell></CCell>
              </TableRow>
              <TableRow key={5}>
                <CCell component="th" scope="row" rowSpan={4}>5</CCell>
                <CCell rowSpan={4}>B</CCell>
                <CCell rowSpan={4}>2.7</CCell>
                <CCell rowSpan={4}>驱动主机</CCell>
                <Cell>(2)工作状况</Cell>
                <CCell>符合</CCell>
                <CCell rowSpan={4}></CCell>
              </TableRow>
              <TableRow key={2}>
                <Cell>(3)轮槽磨损</Cell>
                <CCell>符合</CCell>
              </TableRow>
              <TableRow key={2}>
                <Cell>(4)制动器动作情况</Cell>
                <CCell>符合</CCell>
              </TableRow>
              <TableRow key={2}>
                <Cell>★(5)手动紧急操作装置</Cell>
                <CCell>符合</CCell>
              </TableRow>
              <TableRow key={5}>
                <CCell component="th" scope="row" rowSpan={6}>6</CCell>
                <CCell rowSpan={6}>B</CCell>
                <CCell rowSpan={6}>2.8</CCell>
                <CCell rowSpan={6}>控制柜、紧急操作和动态测试装置</CCell>
                <Cell>(2)断错相保护</Cell>
                <CCell>符合</CCell>
                <CCell rowSpan={6}></CCell>
              </TableRow>
              <TableRow key={2}>
                <Cell>(4)紧急电动运行装置</Cell>
                <CCell>／</CCell>
              </TableRow>
              <TableRow key={2}>
                <Cell>☆(6)层门和轿门旁路装置</Cell>
                <CCell>／</CCell>
              </TableRow>
              <TableRow key={2}>
                <Cell>☆(7)门回路检测功能</Cell>
                <CCell>／</CCell>
              </TableRow>
              <TableRow key={2}>
                <Cell>☆(8)制动器故障保护</Cell>
                <CCell>／</CCell>
              </TableRow>
              <TableRow key={2}>
                <Cell>☆(9)自动救援操作装置</Cell>
                <CCell>／</CCell>
              </TableRow>
              <TableRow key={5}>
                <CCell component="th" scope="row" rowSpan={3}>7</CCell>
                <CCell rowSpan={3}>B</CCell>
                <CCell rowSpan={3}>2.9</CCell>
                <CCell rowSpan={3}>限速器</CCell>
                <Cell>(2)电气安全装置</Cell>
                <CCell>符合</CCell>
                <CCell rowSpan={3}>合格</CCell>
              </TableRow>
              <TableRow key={2}>
                <Cell>(3)封记及运转情况</Cell>
                <CCell>符合</CCell>
              </TableRow>
              <TableRow key={2}>
                <Cell>(4)动作速度校验</Cell>
                <CCell>资料确认符合</CCell>
              </TableRow>
              <TableRow key={5}>
                <CCell component="th" scope="row">8</CCell>
                <CCell>C</CCell>
                <CCell>2.10</CCell>
                <Cell colSpan={2}>(2)接地连接</Cell>
                <CCell>符合</CCell>
                <CCell></CCell>
              </TableRow>
              <TableRow key={5}>
                <CCell component="th" scope="row">9</CCell>
                <CCell>C</CCell>
                <CCell>2.11</CCell>
                <Cell colSpan={2}>电气绝缘</Cell>
                <CCell>资料确认符合</CCell>
                <CCell></CCell>
              </TableRow>
              <TableRow key={5}>
                <CCell component="th" scope="row" rowSpan={2}>10</CCell>
                <CCell rowSpan={2}>C</CCell>
                <CCell rowSpan={6}>3井道及相关设备</CCell>
                <CCell rowSpan={2}>3.4</CCell>
                <Cell rowSpan={2}>井道安全门</Cell>
                <Cell>(3)门锁</Cell>
                <CCell>／</CCell>
                <CCell rowSpan={2}></CCell>
              </TableRow>
              <TableRow key={2}>
                <Cell>(4)电气安全装置</Cell>
                <CCell>／</CCell>
              </TableRow>
              <TableRow key={11}>
                <CCell component="th" scope="row" rowSpan={2}>11</CCell>
                <CCell rowSpan={2}>C</CCell>
                <CCell rowSpan={2}>3.5</CCell>
                <Cell rowSpan={2}>井道检修门</Cell>
                <Cell>(3)门锁</Cell>
                <CCell>／</CCell>
                <CCell rowSpan={2}></CCell>
              </TableRow>
              <TableRow key={2}>
                <Cell>(4)电气安全装置</Cell>
                <CCell>／</CCell>
              </TableRow>
              <TableRow key={11}>
                <CCell component="th" scope="row">12</CCell>
                <CCell>B</CCell>
                <CCell>3.7</CCell>
                <Cell colSpan={2}>轿厢与井道壁距离</Cell>
                <CCell>间距0.14m</CCell>
                <CCell></CCell>
              </TableRow>
              <TableRow key={11}>
                <CCell component="th" scope="row">13</CCell>
                <CCell>B</CCell>
                <CCell>3.10</CCell>
                <Cell colSpan={2}>极限开关</Cell>
                <CCell>符合</CCell>
                <CCell></CCell>
              </TableRow>
              <TableRow key={11}>
                <CCell component="th" scope="row">14</CCell>
                <CCell>C</CCell>
                <CCell rowSpan={7}>3井道及相关设备</CCell>
                <CCell>3.11</CCell>
                <Cell colSpan={2}>井道照明</Cell>
                <CCell>符合</CCell>
                <CCell></CCell>
              </TableRow>
              <TableRow key={11}>
                <CCell component="th" scope="row" rowSpan={2}>15</CCell>
                <CCell rowSpan={2}>C</CCell>
                <CCell rowSpan={2}>3.12</CCell>
                <CCell rowSpan={2}>底坑设施与装置</CCell>
                <Cell>(1)底坑底部</Cell>
                <CCell>符合</CCell>
                <CCell rowSpan={2}></CCell>
              </TableRow>
              <TableRow key={2}>
                <Cell>(3)停止装置</Cell>
                <CCell>符合</CCell>
              </TableRow>
              <TableRow key={11}>
                <CCell component="th" scope="row">16</CCell>
                <CCell>B</CCell>
                <CCell>3.14</CCell>
                <Cell colSpan={2}>(2)限速绳张紧装置的电气安全装置</Cell>
                <CCell>符合</CCell>
                <CCell></CCell>
              </TableRow>
              <TableRow key={5}>
                <CCell component="th" scope="row" rowSpan={3}>17</CCell>
                <CCell rowSpan={3}>B</CCell>
                <CCell rowSpan={3}>3.15</CCell>
                <CCell rowSpan={3}>缓冲器</CCell>
                <Cell>(3)固定和完好情况</Cell>
                <CCell>符合</CCell>
                <CCell rowSpan={3}></CCell>
              </TableRow>
              <TableRow key={2}>
                <Cell> <div>
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
                        <Cell colSpan={4}>注：上述断丝数参考长度为一个捻距，约为6d（d表示钢丝绳
                          的公称直径，mm）</Cell>
                      </TableRow>
                    </Table>
                    <div css={{padding: `${11} 0 6px`}}>
                      "③钢丝绳直径小于其公称直径的90%；<br/>"+
                      "④钢丝绳严重锈蚀，铁锈填满绳股间隙。【】<br/>
                      采用其他类型悬挂装置的，悬挂装置的磨损、变形等不得超过制造单位设定的报废指标
                    </div>
                  </div>
                </div></Cell>
                <CCell>符合</CCell>
              </TableRow>
              <TableRow key={2}>
                <Cell>(5)对重越程距离</Cell>
                <CCell>最大允许值400mm;测量值260mm</CCell>
              </TableRow>
            </TableBody>
          </Table>

        </div>
      </ScrollView>
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
*/

