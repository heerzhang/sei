/** @jsx jsx */
import { jsx,  } from "@emotion/core";
import * as React from "react";
import {
  Text,
  useTheme,
  Button, MenuItem, MenuList,
  InputGroupLine,
  SuffixInput, useCollapse, Input, ResponsivePopover, IconChevronDown, Layer, TextArea, Select, Touchable
} from "customize-easy-ui-component";
import {Table, TableBody,  TableRow, Cell, CCell} from "../../comp/TableExt";
import {
  IndentationLayText, InspectItemHeadColumn, InspectRecordCollapse, InspectRecordDialog,
  InspectRecordHeadColumn,
  InspectRecordTitle, InspectZoneHeadColumn,
  SelectHookfork, TemplateViewProps,
  useItemControlAs, useItemInputControl, useProjectListAs
} from "../comp/base";
import {  InternalItemHandResult, InternalItemProps } from "../comp/base";
import { callSubitemChangePar, callSubitemShow, mergeSubitemRefs } from "../../utils/tools";
import orderBy from "lodash.orderby";
import { string } from "prop-types";
import { inspectionContent, ReportView } from "./PeriodicalInspection.R-1";
import { Link as RouterLink } from "wouter";
import { EditStorageContext } from "../StorageContext";
import queryString from "query-string";

//模板的动态加载入口文件：  原始记录，一一对应的报告的录入编辑数据，可打印。

let   id = 0;
const genId = () => ++id;
function createItem( itemArea: string, zoneContent: React.ReactNode) {
  return {itemArea,  zoneContent};
}
function verifyAction( action:  string, generalFormat: any[]) {
  let itemNums=action.split(".");
  if(itemNums.length!==2)   return {isItemNo: false};
  let x=parseInt(itemNums[0]);
  let y=parseInt(itemNums[1]);
  if(generalFormat[x-1]?.items[y-1]?.procedure)
      return {isItemNo:true, x:x-1, y:y-1};
  else
    return {isItemNo: false};
}

const OriginalView: React.RefForwardingComponent<InternalItemHandResult,TemplateViewProps>=
  React.forwardRef((
     {inp:oldWay, action='none', children},   ref
  ) => {
    const {storage, setStorage} =React.useContext(EditStorageContext);
    let refSize=0;     //项目可独立编辑，其它没有界面显示的项目部分可以省略inp的传回ref等。动态的可独立编辑项目区的数量。
   // const clRefs =useProjectListAs({count: recordPrintList.length});  　//
    const clRefs =useProjectListAs({count: refSize});
    //? 单个项目独立保存可行吗，　非要全部都来，　项目全部显示时刻就不能修改保存了。?
    //同名字的字段：清除／整体清空／单项目独立保存＋合并。
    const outCome=mergeSubitemRefs( ...clRefs.current! );
    //旧的模式：两次暴露传递，返回给了爷爷辈组件。
    //React.useImperativeHandle( ref,() => ({ inp: outCome }), [outCome] );

    //console.log("实验进行时６３６３　-storage=",storage,"outCome=" );
    //原始记录检验内容通用格式部分：这个是可以跟随检验记录数据变化的可配置部分。
    const generalFormat= React.useMemo(() =>
     [
      {
        //bigNo: 1,
        items:[
          null,null,null,
          {
           // item:1.4,
            procedure:  <div>
                使用单位提供了以下资料：<br/>
               （1）使用登记资料，内容与实物相符；
              <IndentationLayText title={'(2)安全技术档案至少包括：'}>
                ①1.1、1.2、1.3所述文件资料[1.2的(3)项和1.3的(5)项除外];<br/>
                ②监督检验报告;<br/>
                ③定期检验报告;<br/>
                ④日常检查与使用状况记录;<br/>
                ⑤日常维护保养记录;<br/>
                ⑥年度自行检查记录或者报告;<br/>
                ⑦应急救援演习记录;<br/>
                ⑧运行故障和事故记录等;保存完好（本规则实施前已经完成安装、改造或重大修理的，1.1、1.2、1.3项所述文件资料如有缺陷，应当由使用单位联系相关单位予以完善，可不作为本项审核结论的否决内容）；
              </IndentationLayText>
              <IndentationLayText title={'(3)以岗位责任制为核心的电梯运行管理规章制度，包括：'}>
                ①事故与故障的应急措施和救援预案；<br/>
                ②电梯钥匙使用管理制度等；
              </IndentationLayText>
               （4）与取得相应资质单位签订的日常维护保养合同；<br/>
               （5）按照规定配备的电梯安全管理和作业人员的特种设备作业人员证。
            </div>,
            details:[],
          }
        ]
      },
      {
        //bigNo: 2,
        items:[
          {
            //item:2.1,
            procedure: <div>
              （1）应当在任何情况下均能够安全方便地使用通道。采用梯子作为通道时，必须符合以下条件：
                <IndentationLayText >
                  ①通往机房(机器设备间)的通道不应当高出楼梯所到平面4m；<br/>
                  ②梯子必须固定在通道上而不能被移动；<br/>
                  ③梯子高度超过1.50m时，其与水平方向的夹角应当在65°～75°之间，并不易滑动或者翻转；<br/>
                  ④靠近梯子顶端应当设置容易握到的把手。
                </IndentationLayText>
              （2）通道应当设置永久性电气照明；<br/>
              （3）机房通道门的宽度应当不小于0.60m，高度应当不小于1.80m，并且门不得向机房内开启。门应当装有带钥匙的锁，并且可以从机房内不用钥匙打开。门外侧有下述或者类似的警示标志：“电梯机器——危险 未经允许禁止入内”
              </div>,
            details:[ (inp,setInp)=>{
                return <React.Fragment>
                     采用梯子作为通道时
                  <InputGroupLine label={`机房高出平面`}>
                    <SuffixInput
                      placeholder="请输入测量数"
                      value={ inp?.机房高出 ||''}
                      onChange={e => setInp({ ...inp, 机房高出: e.currentTarget.value||undefined}) }
                    >m</SuffixInput>
                  </InputGroupLine>
                  <InputGroupLine label={`水平方向夹角`}>
                    <SuffixInput
                      placeholder="请输入测量数"
                      value={ inp?.梯子夹角 ||''}
                      onChange={e => setInp({ ...inp, 梯子夹角: e.currentTarget.value||undefined}) }
                    >(°)</SuffixInput>
                  </InputGroupLine>
                  <InputGroupLine  label='用梯子作为通道时，测量结果判定'>
                    <SelectHookfork value={ inp?.梯子判定 ||''}
                                    onChange={e => setInp({ ...inp, 梯子判定: e.currentTarget.value||undefined}) }
                    />
                  </InputGroupLine>
                </React.Fragment>
              },
              null,
              (inp,setInp)=>{
                return  <React.Fragment>
                     机房通道门
                  <InputGroupLine label={`宽度`}>
                    <SuffixInput
                      placeholder="请输入测量数"
                      value={ inp?.通道门宽 ||''}
                      onChange={e => setInp({ ...inp, 通道门宽: e.currentTarget.value||undefined}) }
                    >m</SuffixInput>
                      </InputGroupLine>
                      <InputGroupLine label={`高度`}>
                    <SuffixInput
                      placeholder="请输入测量数"
                      value={ inp?.通道门高 ||''}
                      onChange={e => setInp({ ...inp, 通道门高: e.currentTarget.value||undefined}) }
                    >m</SuffixInput>
                      </InputGroupLine>
                      <InputGroupLine  label='机房通道门的测量结果判定'>
                        <SelectHookfork value={ inp?.通道判定 ||''}
                      onChange={e => setInp({ ...inp, 通道判定: e.currentTarget.value||undefined}) }
                      />
                    </InputGroupLine>
                </React.Fragment>
              }
            ]
          },
          null,null,null,
          {
           // item:2.5,
            procedure:  <div>
              （1）机房(机器设备间)设有永久性电气照明；在靠近入口(或多个入口)处的适当高度设置一个开关，控制机房(机器设备间)照明
            </div>,
            details:[]
          },
          {
            //item:2.6,
            procedure:  <div>
              （2）主开关不得切断轿厢照明和通风、机房（机器设备间）照明和电源插座、轿顶与底坑的电源插座、电梯井道照明、报警装置的供电电路
            </div>,
            details:[]
          },
          {
           // item:2.7,
            procedure:  <div>
              （2）驱动主机工作时无异常噪声和振动；<br/>
              （3）曳引轮轮槽不得有缺损或者不正常磨损；如果轮槽的磨损可能影响曳引能力时，进行曳引能力验证试验；<br/>
              （4）制动器动作灵活，制动时制动闸瓦(制动钳)紧密、均匀地贴合在制动轮(制动盘)上，电梯运行时制动闸瓦(制动钳)与制动轮(制动盘)不发生摩擦，制动闸瓦(制动钳)以及制动轮(制动盘)工作面上没有油污；<br/>
              （5）手动紧急操作装置符合以下要求：<br/>
              ①对于可拆卸盘车手轮，设有一个电气安全装置，最迟在盘车手轮装上电梯驱动主机时动作；<br/>
              ②松闸扳手涂成红色，盘车手轮是无辐条的并且涂成黄色，可拆卸盘车手轮放置在机房内容易接近的明显部位；<br/>
              ③在电梯驱动主机上接近盘车手轮处，明显标出轿厢运行方向，如果手轮是不可拆卸的，可以在手轮上标出；<br/>
              ④能够通过操纵手动松闸装置松开制动器，并且需要以一个持续力保持其松开状态；<br/>
              ⑤进行手动紧急操作时，易于观察到轿厢是否在开锁区
            </div>,
            details:[]
          },
          {
            //item:2.8,
            procedure:  <div>
              (2)断相、错相保护功能有效；电梯运行与相序无关时，可以不设错相保护。
              <IndentationLayText title={'(4)紧急电动运行装置应当符合以下要求：'}>
                ①依靠持续揿压按钮来控制轿厢运行，此按钮有防止误操作的保护，按钮上或其近旁标出 相应的运行方向<br/>
                ②一旦进入检修运行，紧急电动运行装置控制轿厢运行的功能由检修控制装置所取代；<br/>
                ③进行紧急电动运行操作时，易于观察到轿厢是否在开锁区。
              </IndentationLayText>
              <IndentationLayText title={'(6)层门和轿门旁路装置应当符合以下要求：'}>
                ①在层门和轿门旁路装置上或者其附近标明“旁路”字样,并且标明旁路装置的“旁路”状态或者“关”状态;<br/>
                ②旁路时取消正常运行(包括动力操作的自动门的任何运行);只有在检修运行或者紧急电动运行状态下,轿厢才能够运行;运行期间,轿厢上的听觉信号和轿底的闪烁灯起作用;<br/>
                ③能够旁路层门关闭触点、层门门锁触点、轿门关闭触点、轿门门锁触点;不能同时旁路层门和轿门的触点;对于手动层门,不能同时旁路层门关闭触点和层门门锁触点;<br/>
                ④提供独立的监控信号证实轿门处于关闭位置。
              </IndentationLayText>
              (7)应当具有门回路检测功能,当轿厢在开锁区域内、轿门开启并且层门门锁释放时,监测检查
              轿门关闭位置的电气安全装置、检查层门门锁锁紧位置的电气安全装置和轿门监控信号的正确动
              作;如果监测到上述装置的故障,能够防止电梯的正常运行。<br/>
              (8)应当具有制动器故障保护功能,当监测到制动器的提起(或者释放)失效时,能够防止电梯的正常启动。
              <IndentationLayText title={'(9)自动救援操作装置(如果有)应该符合以下要求:'}>
                ①设有铭牌,标明制造单位名称、产品型号、产品编号、主要技术参数,加装的自动救援操作装置的铭牌和该装置的产品质量证明文件相符;<br/>
                ②在外电网断电至少等待3s后自动投入救援运行,电梯自动平层并且开门;<br/>
                ③当电梯处于检修运行、紧急电动运行、电气安全装置动作或者主开关断开时,不得投入救援运行;<br/>
                ④设有一个非自动复位的开关,当该开关处于关闭状态时,该装置不能启动救援运行。
              </IndentationLayText>
            </div>,
            details:[]
          },
          {
            //item:2.9,
            procedure:  <div>
              （2）限速器或者其他装置上设有在轿厢上行或者下行速度达到限速器动作速度之前动作的电气安全装置，以及验证限速器复位状态的电气安全装置<br/>
              （3）限速器各调节部位封记完好，运转时不得出现碰擦、卡阻、转动不灵活等现象，动作正常<br/>
              （4）受检电梯的维护保养单位应当每2年(对于使用年限不超过15年的限速器)或者每年(对于使用年限超过15年的限速器)进行一次限速器动作速度校验，校验结果应当符合要求
            </div>,
            details:[]
          },
          {
           // item:2.10,
            procedure:  <div>
              （2）所有电气设备及线管、线槽的外露可以导电部分应当与保护导体（PE，地线）可靠连接
            </div>,
            details:[]
          },
          {
           // item:2.11,
            procedure:  <div>
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
            </div>,
            details:[(inp,setInp)=>{
              return <React.Fragment>
                数据测量
                <InputGroupLine  label='动力电路' >
                  <SuffixInput
                    value={inp?.动力电阻 ||''}
                    onChange={e => setInp({ ...inp, 动力电阻: e.currentTarget.value||undefined}) }
                    inputSize="md"
                    type="text"
                    placeholder="请输入测量数"
                  >MΩ
                  </SuffixInput>
                </InputGroupLine>
                <InputGroupLine  label='照明电路' >
                  <SuffixInput
                    value={inp?.照明电阻 ||''}
                    onChange={e => setInp({ ...inp, 照明电阻: e.currentTarget.value||undefined}) }
                    inputSize="md"
                    type="text"
                    placeholder="请输入测量数"
                  >MΩ
                  </SuffixInput>
                </InputGroupLine>
                <InputGroupLine  label='安全装置电路' >
                  <SuffixInput
                    value={inp?.安全装置电阻 ||''}
                    onChange={e => setInp({ ...inp, 安全装置电阻: e.currentTarget.value||undefined}) }
                    inputSize="md"
                    type="text"
                    placeholder="请输入测量数"
                  >MΩ
                  </SuffixInput>
                </InputGroupLine>
              </React.Fragment>
            }
            ]
          }
        ]
      },
      {
       // bigNo: 3,
        items:[
          null,null,null,
          {
            //item:3.4,
            procedure:  <div>
              （3）门上应当装设用钥匙开启的锁，当门开启后不用钥匙能够将其关闭和锁住，在门锁住后，不用钥匙能够从井道内将门打开；<br/>
              （4）应当设置电气安全装置以验证门的关闭状态。
            </div>,
            details:[]
          },
          {
            //item:3.5,
            procedure:  <div>
              （3）应当装设用钥匙开启的锁，当门开启后不用钥匙能够将其关闭和锁住，在门锁住后，不用钥匙能够从井道内将门打开；<br/>
              （4）应当设置电气安全装置以验证门的关闭状态。
            </div>,
            details:[]
          },
          null,
          {
            //item:3.7,
            procedure:  <div>
              （1）轿厢与面对轿厢入口的井道壁的间距不大于0.15m，对于局部高度不大于0.50m或者采用垂直滑动门的载货电梯，该间距可以增加到0.20m。如果轿厢装有机械锁紧的门并且门只能在开锁区内打开时，则上述间距不受限制。
            </div>,
            details:[(inp,setInp)=>{
              return <React.Fragment>
                数据及测量
                <InputGroupLine label={`间距`}>
                  <SuffixInput
                    placeholder="请输入测量数"
                    value={ inp?.轿井间距 ||''}
                    onChange={e => setInp({ ...inp, 轿井间距: e.currentTarget.value||undefined}) }
                  >m</SuffixInput>
                </InputGroupLine>
              </React.Fragment>
            }]
          },
          null,null,
          {
            //item:3.10,
            procedure:  <div>
              （1）井道上下两端应当装设极限开关，该开关在轿厢或者对重接触缓冲器前起作用，并且在缓冲器被压缩期间保持其动作状态。
            </div>,
            details:[]
          },
          {
            //item:3.11,
            procedure:  <div>
              （1）井道应当装设永久性电气照明。对于部分封闭井道，如果井道附近有足够的电气照明，井道内可以不设照明
            </div>,
            details:[]
          },
          {
           // item:3.12,
            procedure:  <div>
              （1）底坑底部应当光滑平整，不得渗水、漏水；<br/>
              （3）底坑内应当设置在进入底坑时和底坑地面上均能方便操作的停止装置，停止装置的操作装置为双稳态、红色、标以“停止”字样，并且有防止误操作的保护
            </div>,
            details:[]
          },
          null,
          {
            //item:3.14,
            procedure:  <div>
              （2）当限速器绳断裂或者过分伸长时，应当通过一个电气安全装置的作用，使电梯停止运转
            </div>,
            details:[]
          },
          {
            //item:3.15,
            procedure:  <div>
              （3）缓冲器应当固定可靠、无明显倾斜，并且无断裂、塑性变形、剥落、破损等现象；<br/>
              （4）耗能型缓冲器液位应当正确，有验证柱塞复位的电气安全装置。<br/>
              （5）对重缓冲器附近应当设置永久性的明显标识，标明当轿厢位于顶层端站平层位置时，对重装置撞板与其缓冲器顶面间的最大允许垂直距离；并且该垂直距离不超过最大允许值
            </div>,
            details:[null,null,
              (inp,setInp)=>{
                return <React.Fragment>
                  (5)对重越程距离
                  <InputGroupLine label={`最大允许值`}>
                    <SuffixInput
                      placeholder="请输入测量数"
                      value={ inp?.对重越程最大 ||''}
                      onChange={e => setInp({ ...inp, 对重越程最大: e.currentTarget.value||undefined}) }
                    >mm</SuffixInput>
                  </InputGroupLine>
                  <InputGroupLine label={`测量值`}>
                    <SuffixInput
                      placeholder="请输入测量数"
                      value={ inp?.对重越程 ||''}
                      onChange={e => setInp({ ...inp, 对重越程: e.currentTarget.value||undefined}) }
                    >mm</SuffixInput>
                  </InputGroupLine>
                </React.Fragment>
              }
            ]
          },
        ]
      },
      {
        //bigNo: 4,
        items:[
          {
            //item:4.1,
            procedure:  <div>
              （1）轿顶应当装设一个易于接近的检修运行控制装置，并且符合以下要求：<br/>
              ①由一个符合电气安全装置要求，能够防止误操作的双稳态开关（检修开关）进行操作；<br/>
              ②一经进入检修运行时，即取消正常运行（包括任何自动门操作）、紧急电动运行、对接操作运行，只有再一次操作检修开关，才能使电梯恢复正常工作；<br/>
              ③依靠持续揿压按钮来控制轿厢运行，此按钮有防止误操作的保护，按钮上或其近旁标出相应的运行方向；<br/>
              ④该装置上设有一个停止装置，停止装置的操作装置为双稳态、红色、并标以“停止”字样，并且有防止误操作的保护；<br/>
              ⑤检修运行时，安全装置仍然起作用。<br/>
              （2）轿顶应当装设一个从入口处易于接近的停止装置，停止装置的操作装置为双稳态、红色、并标以“停止”字样，并且有防止误操作的保护。如果检修运行控制装置设在从入口处易于接近的位置，该停止装置也可以设在检修运行控制装置上
            </div>,
            details:[]
          },
          null,
          {
            //item:4.3,
            procedure:  <div>
              如果轿厢设有安全窗（门），应当符合以下要求：<br/>
              （3）其锁紧由电气安全装置予以验证。
            </div>,
            details:[]
          },
          null,
          {
            //item:4.5,
            procedure:  <div>
              （1）对重(平衡重)块可靠固定；<br/>
              （2）具有能够快速识别对重(平衡重)块数量的措施(例如标明对重块的数量或者总高度)
            </div>,
            details:[]
          },
          {
            //item:4.6,
            procedure:  <div>
              （2）对于为了满足使用要求而轿厢面积超出上述规定的载货电梯，必须满足以下条件：<br/>
              ①在从层站装卸区域总可看见的位置上设置标志，表明该载货电梯的额定载重量；<br/>
              ②该电梯专用于运送特定轻质货物，其体积可保证在装满轿厢情况下，该货物的总质量不会超过额定载重量；<br/>
              ③该电梯由专职司机操作，并严格限制人员进入。
            </div>,
            details:[]
          },
          null,
          {
            //item:4.8,
            procedure:  <div>
              轿厢内应当装设符合下述要求的紧急报警装置和紧急照：<br/>
              （1）正常照明电源中断时，能够自动接通紧急照明电源；<br/>
              （2）紧急报警装置采用对讲系统以便与救援服务持续联系，当电梯行程大于30m时，在轿厢和机房（或者紧急操作地点）之间也设置对讲系统，紧急报警装置的供电来自本条（1）所述的紧急照明电源或者等效电源；在启动对讲系统后，被困乘客不必再做其他操作
            </div>,
            details:[]
          },
          {
            //item:4.9,
            procedure:  <div>
              （1）轿厢地坎下应当装设护脚板，其垂直部分的高度不小于0.75m，宽度不小于层站入口宽度
            </div>,
            details:[(inp,setInp)=>{
              return <React.Fragment>
                数据及测量
                <InputGroupLine label={`护脚板高度`}>
                  <SuffixInput
                    placeholder="请输入测量数"
                    value={ inp?.护脚板高 ||''}
                    onChange={e => setInp({ ...inp, 护脚板高: e.currentTarget.value||undefined}) }
                  >m</SuffixInput>
                </InputGroupLine>
                <InputGroupLine  label='测量结果判定'>
                  <SelectHookfork value={ inp?.护脚板高判定 ||''}
                                  onChange={e => setInp({ ...inp, 护脚板高判定: e.currentTarget.value||undefined}) }
                  />
                </InputGroupLine>
              </React.Fragment>
            }
            ]
          },
          {
            //item:4.10,
            procedure:  <div>
              （1）设置当轿厢内的载荷超过额定载重量时，能够发出警示信号，并且使轿厢不能运行的超载保护装置。该装置最迟在轿厢内的载荷达到110％额定载重量(对于额定载重量小于750kg的电梯，最迟在超载量达到75kg)时动作，防止电梯正常启动及再平层，并且轿内有音响或者发光信号提示，动力驱动的自动门完全打开，手动门保持在未锁状态
            </div>,
            details:[]
          }
        ]
      },
      {
        //bigNo: 5,
        items:[
          {
            //item:5.1,
            procedure:  <div>
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
            </div>,
            details:[(inp,setInp)=>{
              return <React.Fragment>
                数据及测量
                <InputGroupLine label={`②断丝数`}>
                  <SuffixInput
                    placeholder="请输入测量数"
                    value={ inp?.断丝数 ||''}
                    onChange={e => setInp({ ...inp, 断丝数: e.currentTarget.value||undefined}) }
                  >根</SuffixInput>
                </InputGroupLine>
                <InputGroupLine  label='②一个捻距断丝数,结果判定'>
                  <SelectHookfork value={ inp?.断丝判定  ||''}
                                  onChange={e => setInp({ ...inp, 断丝判定: e.currentTarget.value||undefined}) }
                  />
                </InputGroupLine>
                <InputGroupLine label={`③钢丝绳直径`}>
                  <SuffixInput
                    placeholder="请输入测量数"
                    value={ inp?.钢绳直径 ||''}
                    onChange={e => setInp({ ...inp, 钢绳直径: e.currentTarget.value||undefined}) }
                  >mm</SuffixInput>
                </InputGroupLine>
                <InputGroupLine label={`③公称直径`}>
                  <SuffixInput
                    placeholder="请输入测量数"
                    value={ inp?.钢绳公称 ||''}
                    onChange={e => setInp({ ...inp, 钢绳公称: e.currentTarget.value||undefined}) }
                  >mm</SuffixInput>
                </InputGroupLine>
                <InputGroupLine  label='③钢丝绳直径小于公称90%,结果判定'>
                  <SelectHookfork value={ inp?.钢绳判定 ||''}
                                  onChange={e => setInp({ ...inp, 钢绳判定: e.currentTarget.value||undefined}) }
                  />
                </InputGroupLine>
              </React.Fragment>
            }
            ]
          },
          {
            //item:5.2,
            procedure:  <div>
              （1）悬挂钢丝绳绳端固定应当可靠，弹簧、螺母、开口销等连接部件无缺损。<br/>
              采用其他类型悬挂装置的，其端部固定应当符合制造单位的规定。
            </div>,
            details:[]
          },
          {
            //item:5.3,
            procedure:  <div>
              （1）补偿绳（链）端固定应当可靠；<br/>
              （2）应当使用电气安全装置来检查补偿绳的最小张紧位置；<br/>
              （3）当电梯的额定速度大于3.5m/s时，还应当设置补偿绳防跳装置，该装置动作时应当有一个电气安全装置使电梯驱动主机停止运转。
            </div>,
            details:[]
          },
          null,
          {
            //item:5.5,
            procedure:  <div>
              （1）如果轿厢悬挂在两根钢丝绳或者链条上，则应当设置检查绳(链)松弛的电气安全装置，当其中一根钢丝绳(链条)发生异常相对伸长时，电梯应当停止运行
            </div>,
            details:[]
          },
          {
            //item:5.6,
            procedure:  <div>
              （1）在机房（机器设备间）内的曳引轮、滑轮、链轮、限速器，在井道内的曳引轮、滑轮、链轮、限速器及张紧轮、补偿绳张紧轮，在轿厢上的滑轮、链轮等与钢丝绳、链条形成传动的旋转部件，均应当设置防护装置，以避免人身伤害、钢丝绳或链条因松弛而脱离绳槽或链轮、异物进入绳与绳槽或链与链轮之间；<br/>
              对于允许按照GB 7588—1995及更早期标准生产的电梯，可以按照以下要求检验：<br/>
              ①采用悬臂式曳引轮或者链轮时，有防止钢丝绳脱离绳槽或者链条脱离链轮的装置，并且当驱动主机不装设在井道上部时，有防止异物进入绳与绳槽之间或者链条与链轮之间的装置；<br/>
              ②井道内的导向滑轮、曳引轮、轿架上固定的反绳轮和补偿绳张紧轮，有防止钢丝绳脱离绳槽和进入异物的防护装置
            </div>,
            details:[]
          },
        ]
      },
      {
        //bigNo: 6,
        items:[
          null,null,
          {
            //item:6.3,
            procedure:  <div>
              <IndentationLayText title={'门关闭后,应当符合以下要求:'}>
                (1) 门扇之间及门扇与立柱、门楣和地坎之间的间的间隙,对于乘客电梯不大于6mm;对于载货电梯不大于8mm,使用过程中由于磨损,允许达10mm;<br />
                (2) 在水平移动门和折叠门主动门扇的开启方向,以150N的人力施加在一个最不利的点，前条所述的间
                隙允许增大，但对于旁开门不大于30mm，对于中分门其总和不大于45mm
              </IndentationLayText>
            </div>,
            details:[(inp,setInp)=>{
              return <React.Fragment>
                点击下方标题修改
                <Table css={{borderCollapse:'collapse'}}>
                  <TableBody>
                    <RouterLink to={`/report/EL-DJ/ver/1/gap/227?from=6.3`}>
                      <TableRow >
                        <CCell>层</CCell>
                        <CCell>门扇隙</CCell>
                        <CCell>门套隙</CCell>
                        <CCell>地坎隙</CCell>
                        <CCell>施力隙</CCell>
                      </TableRow>
                    </RouterLink>
                    {inp?.层站?.map((a,i)=>{
                      return <TableRow key={i}>
                        <CCell>{a}</CCell>
                        <CCell>{inp?.门扇隙?.[a]||''}</CCell>
                        <CCell>{inp?.门套隙?.[a]||''}</CCell>
                        <CCell>{inp?.地坎隙?.[a]||''}</CCell>
                        <CCell>{inp?.施力隙?.[a]||''}</CCell>
                      </TableRow>
                    }) }
                  </TableBody>
                </Table>
              </React.Fragment>
            }, null
            ]
          },
          {
            //item:6.4,
            procedure:  <div>
              （1）层门和轿门采用玻璃门时，应当有防止儿童的手被拖曳的措施
            </div>,
            details:[]
          },
          {
            //item:6.5,
            procedure:  <div>
              （1）动力驱动的自动水平滑动门应当设置防止门夹人的保护装置，当人员通过层门入口被正在关闭的门扇撞击或者将被撞击时，该装置应当自动使门重新开启
            </div>,
            details:[]
          },
          {
            //item:6.6,
            procedure:  <div>
              （1）层门和轿门正常运行时不得出现脱轨、机械卡阻或者在行程终端时错位；由于磨损、锈蚀或者火灾可能造成层门导向装置失效时，应当设置应急导向装置，使层门保持在原有位置
            </div>,
            details:[]
          },
          {
            //item:6.7,
            procedure:  <div>
              （1）在轿门驱动层门的情况下，当轿厢在开锁区域之外时，如果层门开启（无论何种原因），应当有一种装置能够确保该层门自动关闭。自动关闭装置采用重块时，应当有防止重块坠落的措施
            </div>,
            details:[]
          },
          {
            //item:6.8,
            procedure:  <div>
              （1）每个层门均应当能够被一把符合要求的钥匙从外面开启；紧急开锁后，在层门闭合时门锁装置不应当保持开锁位置
            </div>,
            details:[]
          },
          {
            //item:6.9,
            procedure:  <div>
              <IndentationLayText title={'(1)每个层门都应当设有符合下述要求的门锁装置:'}>
                ②锁紧动作由重力、永久磁铁或者弹簧来产生和保持，即使永久磁铁或者弹簧失效，重力亦不能导致开锁；<br/>
                ③轿厢在锁紧元件啮合不小于7mm时才能启动；<br/>
                ④门的锁紧由一个电气安全装置来验证，该装置由锁紧元件强制操作而没有任何中间机构，并且能够防止误动作；
              </IndentationLayText>
              (2)如果轿门采用了门锁装置,该装置也应当符合本条(1)的要求。
            </div>,
            details:[(inp,setInp)=>{
              let  toothUnquf=inp?.层站?.find((f,i)=>{
                return parseFloat(inp?.门锁啮长?.[f])<7;
              });
              return <React.Fragment>
                <RouterLink  to={`/report/EL-DJ/ver/1/gap/227?from=6.9`}>
                 (点击修改)已检门锁啮合长度:
                </RouterLink>
                   <div>
                    {inp?.层站?.map(a=>{
                      return ` ${a}层:${inp?.门锁啮长?.[a]||''};`
                    }) }
                  </div>
                <InputGroupLine  label='(1)③门锁啮合长度{自动填}'>
                  <SelectHookfork value={toothUnquf? '×': inp?.层站?.length>=1? '√':''} disabled/>
                </InputGroupLine>
              </React.Fragment>
            }, null
            ]
          },
          {
            //item:6.10,
            procedure:  <div>
              （1）正常运行时应当不能打开层门，除非轿厢在该层门的开锁区域内停止或停站；如果一个层门或者轿门（或者多扇门中的任何一扇门）开着，在正常操作情况下，应当不能启动电梯或者不能保持继续运行；<br/>
              （2）每个层门和轿门的闭合都应当由电气安全装置来验证，如果滑动门是由数个间接机械连接的门扇组成，则未被锁住的门扇上也应当设置电气安全装置以验证其闭合状态
             </div>,
            details:[]
          },
          {
            //item:6.11,
            procedure:  <div>
              （1）应当设置轿门开门限制装置，当轿厢停在开锁区域外时，能够防止轿厢内的人员打开轿门离开轿厢；<br/>
              （2）在轿厢意外移动保护装置允许的最大制停距离范围内，打开对应的层门后，能够不用工具(三角钥匙或者永久性设置在现场的工具除外)从层站处打开轿门
            </div>,
            details:[]
          },
          {
            //item:6.12,
            procedure:  <div>
              1）轿门门刀与层门地坎，层门锁滚轮与轿厢地坎的间隙应当不小于5mm；电梯运行时不得互相碰擦
            </div>,
            details:[(inp,setInp)=>{
                let  knifeUnquf=inp?.层站?.find((f,i)=>{
                  return parseFloat(inp?.刀坎距?.[f])<5;
                });
                let  rollerUnquf=inp?.层站?.find((f,i)=>{
                  return parseFloat(inp?.轮坎距?.[f])<5;
                });
                return <React.Fragment>
                  <RouterLink  to={`/report/EL-DJ/ver/1/gap/227?from=6.12`}>
                   <Touchable  component={'div'} >
                     (点击修改):
                    <div>
                      轿门门刀与层门地坎间距:
                      {inp?.层站?.map(a=>{
                        return ` ${a}层:${inp?.刀坎距?.[a]||''};`
                      }) }
                    </div>
                    <div>
                      门锁滚轮与轿门地坎间距:
                      {inp?.层站?.map(a=>{
                        return ` ${a}层:${inp?.轮坎距?.[a]||''};`
                      }) }
                    </div>
                   </Touchable>
                  </RouterLink>
                  <InputGroupLine  label='间隙应当不小于5mm{自动填}'>
                    <SelectHookfork value={knifeUnquf||rollerUnquf? '×': inp?.层站?.length>=1? '√':''} disabled/>
                  </InputGroupLine>
                </React.Fragment>
              }
            ]
          }
        ]
      },
      null,
      {
        //bigNo: 8,
        items:[
          {
            //item:8.1,
            procedure:  <div>
              （1）曳引电梯的平衡系数应当在0.40～0.50之间，或者符合制造（改造）单位的设计值
            </div>,
            details:[]
          },
          {
            //item:8.2,
            procedure:  <div>
              （1）当轿厢上行速度失控时，轿厢上行超速保护装置应当动作，使轿厢制停或者至少使其速度降低至对重缓冲器的设计范围；该装置动作时，应当使一个电气安全装置动作
            </div>,
            details:[]
          },
          {
            //item:8.3,
            procedure:  <div>
              （1）轿厢在井道上部空载，以型式试验证书所给出的试验速度上行并触发制停部件，仅使用制停部件能够使电梯停止，轿厢的移动距离在型式试验证书给出的范围内；
              （2）如果电梯采用存在内部冗余的制动器作为制停部件，则当制动器提起(或者释放)失效，或者制动力不足时，应当关闭轿门和层门，并且防止电梯的正常启动
            </div>,
            details:[]
          },
          {
            //item:8.4,
            procedure:  <div>
              （2）定期检验：轿厢空载，以检修速度下行，进行限速器-安全钳联动试验，限速器－安全钳动作应当可靠
            </div>,
            details:[]
          },
          {
            //item:8.5,
            procedure:  <div>
              （1）轿厢空载，以检修速度上行，进行限速器-安全钳联动试验，限速器－安全钳动作应当可靠
            </div>,
            details:[]
          },
          {
            //item:8.6,
            procedure:  <div>
             （1）轿厢空载，以正常运行速度上、下运行，呼梯、楼层显示等信号系统功能有效、指示正确、动作无误，轿厢平层良好，无异常现象发生；对于设有IC卡系统的电梯，轿厢内的人员无需通过IC卡系统即可到达建筑物的出口层，并且在电梯退出正常服务时，自动退出IC卡功能
            </div>,
            details:[]
          },
          {
            //item:8.7,
            procedure:  <div>
              （1）在机房内或者紧急操作和动态测试装置上设有明晰的应急救援程序；<br/>
              （2）建筑物内的救援通道保持通畅，以便相关人员无阻碍地抵达实施紧急操作的位置和层站等处；<br/>
              （3）在各种载荷工况下，按照本条(1)所述的应急救援程序实施操作，能够安全、及时地解救被困人员
            </div>,
            details:[]
          },
          null,
          {
            //item:8.9,
            procedure:  <div>
              （1）当对重压在缓冲器上而曳引机按电梯上行方向旋转时，应当不能提升空载轿厢
            </div>,
            details:[]
          },
          {
            //item:8.10,
            procedure:  <div>
              （1）轿厢空载以正常运行速度上行至行程上部，切断电动机与制动器供电，轿厢应当完全停止
            </div>,
            details:[]
          },
          {
            //item:8.11,
            procedure:  <div>
              （1）轿厢装载125%额定载重量，以正常运行速度下行至行程下部，切断电动机与制动器供电，轿厢应当完全停止
            </div>,
            details:[]
          },
          {
            //item:8.12,
            procedure:  <div>
               （1）对于轿厢面积超过规定的载货电梯，以轿厢实际面积所对应的125%额定载重量进行静态曳引试验；对于额定载重量按照单位轿厢有效面积不小于200kg/m2计算的汽车电梯，以150%额定载重量做静态曳引试验；历时10min，曳引绳应当没有打滑现象
            </div>,
            details:[]
          },
          {
            //item:8.13,
            procedure:  <div>
              （1）轿厢装载125%额定载重量，以正常运行速度下行时，切断电动机和制动器供电，制动器应当能够使驱动主机停止运转，试验后轿厢应无明显变形和损坏
            </div>,
            details:[]
          }
        ]
      }
    ]
        ,[]);

    const renderItemsContent =React.useMemo(() => {
      let seq = 0;
      let htmlTxts =[];
      inspectionContent.forEach((rowBigItem, x) => {
        rowBigItem && rowBigItem.items.forEach((item, y) => {
          if(item){
            seq += 1;
            const rowHead =<ItemUniversal key={seq} ref={null}  x={x}  y={y}  show={action==='printAll'} alone={false}
                                procedure={generalFormat[x].items[y].procedure}  details={generalFormat[x].items[y].details}
                           />;
            htmlTxts.push(rowHead);
          }
        });
      });
      return ( <React.Fragment key={'item1.1'}>
        {htmlTxts}
      </React.Fragment> );
    }, [action, generalFormat]);

    const {isItemNo, x, y} =verifyAction(action,generalFormat);
    //这里action是 '2.1' ALL none printAll 这样的路由参数 ?readOnly=1&。
    const recordList= React.useMemo(() =>
          {
           if(isItemNo){
             return <React.Fragment>
                <ItemUniversal key={0} ref={null}  x={x}  y={y} show={true}
                      procedure={generalFormat[x].items[y].procedure}  details={generalFormat[x].items[y].details}
                 />
              </React.Fragment>;
           }else{
              const itemA=recordPrintList.find((one)=>one.itemArea===action);
              if(itemA){
                 return <React.Fragment>
                     {
                          React.cloneElement(itemA.zoneContent as React.ReactElement<any>, {
                           ref: null,
                           key: itemA.itemArea,
                           show: true
                         })
                     }
                 </React.Fragment>;
              }else if(action==='ALL' || action==='printAll'){
                return recordPrintList.map((each, i) => {
                  if(each.itemArea==='item1.1')
                    return  renderItemsContent;
                  else
                    return React.cloneElement(each.zoneContent as React.ReactElement<any>, {
                      ref: clRefs.current![i],
                      show: action==='printAll',
                      key: i
                    });
                });
              }
            }
          return  null;
         }
                ,[action, generalFormat,isItemNo,x,y,clRefs,renderItemsContent]);

  //  console.log("公用配置对象--isItemNo=",isItemNo,"x=", x,"y=",y, generalFormat, "inspectionContent=", inspectionContent);

    return <React.Fragment>
          {recordList}
          { (action==='ALL' || action==='printAll') &&
            <Button size="lg" intent={'primary'} onPress={() =>{ setStorage({...storage, ...outCome}) }}>
            全部输入一起确认
            </Button>
          }
        </React.Fragment>;
  } );

const ItemInstrumentTable: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    { children, show },  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {仪器表} =par||{};
      return {仪器表};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter, show});
    const [seq, setSeq] = React.useState(null);   //表對象的當前一條。
    const [obj, setObj] = React.useState({no:'',name:'',type:'',powerOn:'',shutDown:''});
    React.useEffect(() => {
      let size =inp?.仪器表?.length;
      setSeq(size>0?  size-1:null);
    }, [inp]);
    function onModifySeq(idx,it){
      setObj(it);
      setSeq(idx);
    };
    function onDeleteSeq(idx,it){
      inp?.仪器表?.splice(idx,1);
      setInp({...inp,仪器表: [...inp?.仪器表] });
      setSeq(null);
    };
    function onInsertSeq(idx,it){
      inp?.仪器表?.splice(idx,0, obj);
      setInp({...inp,仪器表:[...inp?.仪器表] });
      setSeq(idx);
    };
    function onAddSeq(idx){
      let size =inp?.仪器表?.push(obj);
      setInp( (inp?.仪器表&&{...inp,仪器表:[...inp?.仪器表] } )  || {...inp,仪器表:[obj] } );
      setSeq((inp?.仪器表&&(size-1))  || 0 );
    };

    const editor=<Layer elevation={"sm"} css={{ padding: '0.25rem' }}>
      <div>
        <InputGroupLine label={`测量设备名称`}>
          <Input   value={obj.name ||''}   onChange={e =>setObj({...obj, name: e.currentTarget.value} ) } />
        </InputGroupLine>
        <InputGroupLine label={`规格型号`}>
          <Input   value={obj.type ||''}   onChange={e =>setObj({...obj, type: e.currentTarget.value} ) } />
        </InputGroupLine>
        <InputGroupLine label={`测量设备编号`}>
          <Input   value={obj.no ||''}   onChange={e =>setObj({...obj, no: e.currentTarget.value} ) } />
        </InputGroupLine>
        <InputGroupLine  label='性能状态-开机后'>
          <SelectHookfork value={obj.powerOn ||''}  onChange={e =>setObj({...obj, powerOn: e.currentTarget.value} ) } />
        </InputGroupLine>
        <InputGroupLine  label='性能状态-关机前'>
          <SelectHookfork value={obj.shutDown ||''}  onChange={e =>setObj({...obj, shutDown: e.currentTarget.value} ) } />
        </InputGroupLine>
        <Button onPress={() => {
          if(seq !== null) {
            inp?.仪器表?.splice(seq, 1, obj);
            setInp({ ...inp, 仪器表: [...inp?.仪器表] });
          }
          else setInp({ ...inp, 仪器表: [obj] });
        } }
        >{inp?.仪器表?.length>0? `改一条就确认`: `新增一条`}</Button>
      </div>
    </Layer>;

    const instrumentTable=<div>
      {inp?.仪器表?.map((a,i)=>{
        return <React.Fragment  key={i}>
          <div>{`${i+1}`}
            <ResponsivePopover
              content={
                <MenuList>
                  <MenuItem onPress={()=>onModifySeq(i,a)}>修改</MenuItem>
                  <MenuItem onPress={()=>onDeleteSeq(i,a)}>刪除这条</MenuItem>
                  <MenuItem onPress={()=>onInsertSeq(i,a)}>插入一条</MenuItem>
                  <MenuItem onPress={()=>onAddSeq(i)}>末尾新增一条</MenuItem>
                </MenuList>
              }
            >
              <Button  size="md" iconAfter={<IconChevronDown />} variant="ghost" css={{whiteSpace:'unset'}}>
                {`[${a.no}] ${a.name||''} 型号${a.type||''} 开机${a.powerOn||''} 关机${a.shutDown||''}`}
              </Button>
            </ResponsivePopover>
          </div>
          {i===seq && editor}
        </React.Fragment>;
      }) }
    </div>;

    return (
      <InspectRecordTitle  control={eos} label={'主要检验仪器设备'}>
        <Text  variant="h5">
          二、主要测量设备性能检查
        </Text>
        使用的仪器设备表:
        <hr/>
        {instrumentTable}
        {seq===null && editor}
      </InspectRecordTitle>
    );
  } );

const ItemSurveyLinkMan: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    { children, show },  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      //devCod,检验日期：这些字段要提升到关系数据库表中，json半结构化数据的就不做保留。
      //安全人员,联系电话：放json，算是过度性质输入形态。报告正式批准/终结后，就该触发修改同步到库表中去。也可反馈给下一次定期检验，继承或修改。
      const {devCod,检验日期,安全人员,联系电话} =par||{};
      return {devCod,检验日期,安全人员,联系电话};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter, show});

    return (
      <InspectRecordTitle  control={eos}   label={'一、设备概况'}>
        允许直接修改部分
        <InputGroupLine  label='设备号{将来是点击链接自动获得}' >
          <Input  value={inp?.devCod ||''}  placeholder="那一台电梯？暂时要求，将来是点击链接自动获得"
                 onChange={e => setInp({ ...inp, devCod: e.currentTarget.value||undefined}) } />
        </InputGroupLine>
        <InputGroupLine  label='检验日期{将来提升到创立原始记录的前置输入}' >
          <Input value={inp?.检验日期 ||''}  placeholder="基准日" type='date'
                 onChange={e => setInp({ ...inp, 检验日期: e.currentTarget.value}) } />
        </InputGroupLine>
        <InputGroupLine  label='安全管理人员' >
          <Input  value={inp?.安全人员 ||''}
                 onChange={e => setInp({ ...inp, 安全人员: e.currentTarget.value||undefined}) } />
        </InputGroupLine>
        <InputGroupLine  label='联系电话1' >
          <Input  value={inp?.联系电话 ||''}
                 onChange={e => setInp({ ...inp, 联系电话: e.currentTarget.value||undefined}) } />
        </InputGroupLine>
        不可修改的明细：待续或点外部链接。
      </InspectRecordTitle>
    );
  } );

const ItemRemarks: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    { children, show },  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {自检材料,校验材料,整改材料,资料及编号,memo} =par||{};
      return {自检材料,校验材料,整改材料,资料及编号,memo};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter, show});

    return (
      <InspectRecordTitle  control={eos}   label={'见证材料或问题备注'}>
        六、见证材料{`{将来可能只需输入编号链接即可}`}
        <InputGroupLine  label='1、维保自检材料' >
          <Input  value={inp?.自检材料 ||''}  placeholder="使用默认规则，缺省编号情况的可不填"
                 onChange={e => setInp({ ...inp, 自检材料: e.currentTarget.value||undefined}) } />
        </InputGroupLine>
        <InputGroupLine  label='2、限速器动作速度校验材料' >
          <Input  value={inp?.校验材料 ||''}
                 onChange={e => setInp({ ...inp, 校验材料: e.currentTarget.value||undefined}) } />
        </InputGroupLine>
        <InputGroupLine  label='3、使用单位整改反馈材料' >
          <Input  value={inp?.整改材料 ||''}
                 onChange={e => setInp({ ...inp, 整改材料: e.currentTarget.value||undefined}) } />
        </InputGroupLine>
        <InputGroupLine  label='4、其他资料及编号' >
          <Input  value={inp?.资料及编号 ||''}
                 onChange={e => setInp({ ...inp, 资料及编号: e.currentTarget.value||undefined}) } />
        </InputGroupLine>
        七、备注<br/><br/>
        纸质正式报告备注可能只取前几行
         <TextArea  value={inp?.memo ||''} rows={10} placeholder="网页版本正式报告备注可随意多写"
                    onChange={e => setInp({ ...inp, memo: e.currentTarget.value||undefined}) } />
      </InspectRecordTitle>
    );
  } );

const ItemConclusion: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    { children, show },  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
     //检验人IDs编制日期编制人结论：这些字段要提升到关系数据库表中，而不是json字段里面。只能保留上级语义更强的，json半结构化数据的就不做保留。
      const {检验结论,编制日期,编制人,检验人IDs} =par||{};
      return {检验结论,编制日期,编制人,检验人IDs};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter, show});

    return (
      <InspectRecordTitle  control={eos}   label={'下结论!'}>
        五、现场检验意见
        <InputGroupLine  label='检验结论{签名后结论不能再改}' >
          <Select inputSize="md" css={{minWidth:'140px',fontSize:'2rem',padding:'0 1rem'}}
                  value={ inp?.检验结论  ||''}
                  onChange={e => setInp({ ...inp, 检验结论: e.currentTarget.value||undefined}) }
          >
            <option></option>
            <option>合格</option>
            <option>不合格</option>
            <option>复检合格</option>
            <option>复检不合格</option>
          </Select>
        </InputGroupLine>
        <InputGroupLine  label='检验人员{用户ID列表,将来签名，登录来签注}' >
          <Input  value={inp?.检验人IDs ||''} placeholder="输入本系统用户ID，将来签名后结论不能再改，多人签名：以 分割"
                 onChange={e => setInp({ ...inp, 检验人IDs: e.currentTarget.value||undefined}) } />
        </InputGroupLine>
        <InputGroupLine  label='编制人员{将来是提交人员，自动的}' >
          <Input  value={inp?.编制人 ||''} placeholder="目前直接输入名字，一个人"
                 onChange={e => setInp({ ...inp, 编制人: e.currentTarget.value||undefined}) } />
        </InputGroupLine>
        <InputGroupLine  label='编制日期{将来等于提交日，自动的}' >
          <Input  value={inp?.编制日期 ||''}  type='date'
                 onChange={e => setInp({ ...inp, 编制日期: e.currentTarget.value}) } />
        </InputGroupLine>
      </InspectRecordTitle>
    );
  } );

const ItemRecheckResult: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    { children, show },  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {unq} =par||{};
      return {unq};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter, show});
    const [seq, setSeq] = React.useState(null);   //表對象的當前一條。
    const [obj, setObj] = React.useState({no:'',desc:'',rres:'',rdate:''});
    React.useEffect(() => {
      let size =inp?.unq?.length;
      setSeq(size>0?  size-1:null);
    }, [inp]);
    function onModifySeq(idx,it){
      setObj(it);
      setSeq(idx);
    };
    function onDeleteSeq(idx,it){
      inp?.unq?.splice(idx,1);
      setInp({...inp,unq: [...inp?.unq] });
      setSeq(null);
    };
    function onInsertSeq(idx,it){
      inp?.unq?.splice(idx,0, obj);
      setInp({...inp,unq:[...inp?.unq] });
      setSeq(idx);
    };
    function onAddSeq(idx){
      let size =inp?.unq?.push(obj);
      setInp( (inp?.unq&&{...inp,unq:[...inp?.unq] } )  || {...inp,unq:[obj] } );
      setSeq((inp?.unq&&(size-1))  || 0 );
    };

    const editor=<Layer elevation={"sm"} css={{ padding: '0.25rem' }}>
      <div>
        <InputGroupLine label={`类别/编号{将来自动的不能改}`}>
          <Input   value={obj.no ||''} placeholder="目前是人工输入，类比B/4.8这样的"
                 onChange={e =>setObj({...obj, no: e.currentTarget.value} ) } />
        </InputGroupLine>
        <InputGroupLine label={`不合格内容描述{将来自动的}`}>
          <Input   value={obj.desc ||''}  placeholder="目前是人工输入，正式报告要呈现不合格说明"
                 onChange={e =>setObj({...obj, desc: e.currentTarget.value} ) } />
        </InputGroupLine>
        <InputGroupLine label={`复检结果`}>
          <SelectHookfork value={obj.rres ||''}
                          onChange={e =>setObj({...obj, rres: e.currentTarget.value} ) }
          />
        </InputGroupLine>
        <InputGroupLine  label='复检日期' >
          <Input  value={obj.rdate ||''}  type='date'
                 onChange={e =>setObj({...obj, rdate: e.currentTarget.value} ) } />
        </InputGroupLine>
        <Button onPress={() => {
          if(seq !== null) {
            inp?.unq?.splice(seq, 1, obj);
            setInp({ ...inp, unq: [...inp?.unq] });
          }
          else setInp({ ...inp, unq: [obj] });
        } }
        >{inp?.unq?.length>0? `改一条就确认`: `新增一条`}</Button>
      </div>
    </Layer>;

    const myTable=<div>
      {inp?.unq?.map((a,i)=>{
        return <React.Fragment  key={i}>
          <div>{`${i+1}`}
            <ResponsivePopover
              content={
                <MenuList>
                  <MenuItem onPress={()=>onModifySeq(i,a)}>修改</MenuItem>
                  <MenuItem onPress={()=>onDeleteSeq(i,a)}>刪除这条</MenuItem>
                  <MenuItem onPress={()=>onInsertSeq(i,a)}>插入一条</MenuItem>
                  <MenuItem onPress={()=>onAddSeq(i)}>末尾新增一条</MenuItem>
                </MenuList>
              }
            >
              <Button  size="md" iconAfter={<IconChevronDown />} variant="ghost" css={{whiteSpace:'unset'}}>
                {`[${a.rdate}] 项目${a.no||''}： ${a.desc||''}。 复检结果${a.rres||''}`}
              </Button>
            </ResponsivePopover>
          </div>
          {i===seq && editor}
        </React.Fragment>;
      }) }
    </div>;
  //不合格unq表数据生成时机：复检编制开始时初始化来的。在初检场景看到是动态校验目的前端显示表还未存储到后端数据库。
    return (
      <InspectRecordTitle  control={eos} label={'不合格复检结果记录'}>
        <Text  variant="h5">
          四、检验不合格记录及复检结果
        </Text>
        明细表: 初检报告后才显示,复检时修改但是不能删除;
        <hr/>
        {myTable}
        {seq===null && editor}
      </InspectRecordTitle>
    );
  } );

const ItemAppendixB: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    { children, show },  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {检验条件,温度,电压值} =par||{};
      return {检验条件,温度,电压值};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter, show});
    const theme = useTheme();
    const [floor, setFloor] = React.useState(null);

    return (
      <React.Fragment>
        <InspectRecordTitle  control={eos} label={'附录B：现场检验条件'}>
          1、机房或者机器设备间的空气温度保持在5℃～40℃之间；<br/>
          2、电源输入电压波动在额定电压值±7％的范围内；<br/>
          3、环境空气中没有腐蚀性和易燃性气体及导电尘埃； <br/>
          4、检验现场（主要指机房或者机器设备间、井道、轿顶、底坑）清洁，没有与电梯工作无关的物品和设备，基站、相关层站等检验现场放置表明正在进行检验的警示牌；<br/>
          5、对井道进行了必要的封闭。 <br/>
          特殊情况下，电梯设计文件对温度、湿度、电压、环境空气条件等进行了专门规定的，检验现场的温度、湿度、电压、环境空气条件等应当符合电梯设计文件的规定。
          <hr/>
          <div>
            确认过的记录:
            {inp?.检验条件?.map((a,i)=>{
              return <React.Fragment key={i}>
                <br/>{
                `[${a}]日: ${inp?.温度?.[a]||''} ℃, ${inp?.电压值?.[a]||''} V;`
              }
              </React.Fragment>;
            }) }
          </div>
          新增检查=>
          <InputGroupLine  label='首先设置当前检验日期'>
            <SuffixInput
                type='date'
              value={floor||''}
              onChange={e => {setFloor( e.currentTarget.value) }}
            >
              <Button onPress={() =>floor&&(inp?.检验条件?.includes(floor)? null:
                  setInp( (inp?.检验条件&&{...inp,检验条件:[...inp?.检验条件,floor] } )
                    || {...inp,检验条件:[floor] } )
              )}
              >新增</Button>
            </SuffixInput>
          </InputGroupLine>
          <div css={{ textAlign: 'center' }}>
            <Button css={{ marginTop: theme.spaces.sm }} size="sm"
                    onPress={() => floor&&inp?.检验条件?.includes(floor) &&(
                      setInp({...inp,检验条件:[...inp.检验条件.filter(a => a!==floor )],
                        温度:{...inp?.温度,[floor]:undefined}, 电压值:{...inp?.电压值,[floor]:undefined}
                      })
                    )}
            >刪除</Button>
          </div>
          <InputGroupLine label={`机房空气温度(${floor}):`}>
            <SuffixInput
              placeholder="请输入测量数"
              value={ (inp?.温度?.[floor] ) || ''}
              onChange={e => floor&&setInp({ ...inp, 温度:{...inp?.温度,[floor]:e.currentTarget.value||undefined} }) }
            >℃</SuffixInput>
          </InputGroupLine>
          <InputGroupLine label={`电源输入电压(${floor}):`}>
            <SuffixInput
              placeholder="请输入测量数"
              value={ (inp?.电压值?.[floor] ) || ''}
              onChange={e => floor&&setInp({ ...inp, 电压值:{...inp?.电压值,[floor]:e.currentTarget.value||undefined} }) }
            >V</SuffixInput>
          </InputGroupLine>
        </InspectRecordTitle>
      </React.Fragment>
    );
  } );

//提供給6.3 6.9 6.12項目公用的部分。
//'附录A 层门间隙、啮合长度' 这7个测量数据，单独放一个编辑组件。而原本'6.3','6.9','6.12'只读和跳转连接。
const ItemGapMeasure: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    { children, show },  ref
  ) => {
    const {storage, setStorage} =React.useContext(EditStorageContext);
    const getInpFilter = React.useCallback((par) => {
      const {层站,门扇隙,门套隙,地坎隙,施力隙,门锁啮长,刀坎距,轮坎距,门扇间隙,最不利隙,层门锁,轿门锁,刀轮地隙} =par||{};
      return {层站,门扇隙,门套隙,地坎隙,施力隙,门锁啮长,刀坎距,轮坎距,门扇间隙,最不利隙,层门锁,轿门锁,刀轮地隙};
    }, []);
    const { eos, setInp, inp, par } = useItemControlAs({ref,  filter: getInpFilter, show});
    React.useEffect(() => {
      storage&&setInp(getInpFilter(storage));
    }, [storage, setInp, getInpFilter] );

    const theme = useTheme();
    const [floor, setFloor] = React.useState(null);
    //const cAppendix =useCollapse(true,true);
    let  toothUnquf=inp?.层站?.find((f,i)=>{
      return parseFloat(inp?.门锁啮长?.[f])<7;
    });
    let  knifeUnquf=inp?.层站?.find((f,i)=>{
      return parseFloat(inp?.刀坎距?.[f])<5;
    });
    let  rollerUnquf=inp?.层站?.find((f,i)=>{
      return parseFloat(inp?.轮坎距?.[f])<5;
    });
    const qs= queryString.parse(window.location.search);
    console.log("参数第三层路由mathched qs=",qs);
    return (
     <InspectRecordTitle  control={eos} label={'附录A 层门间隙、啮合长度'}>
        <div>
          <RouterLink  to={`/report/EL-DJ/ver/1/${qs.from?qs.from:'6.3'}/227`}>
          (点击回检验项)已检记录,每层七个尺寸:
           </RouterLink>
          {inp?.层站?.map((a,i)=>{
            return <React.Fragment key={i}>
              <br/>{
              `[${a}]层: ${inp?.门扇隙?.[a]||''} , ${inp?.门套隙?.[a]||''} , ${inp?.地坎隙?.[a]||''} , ${inp?.施力隙?.[a]||''} , ${inp?.门锁啮长?.[a]||''} , ${inp?.刀坎距?.[a]||''} , ${inp?.轮坎距?.[a]||''};`
            }
            </React.Fragment>;
          }) }
        </div>
        新增检查=>
        <InputGroupLine  label='首先设置当前层站号'>
          <SuffixInput
            value={floor||''}
            onChange={e => {setFloor( e.currentTarget.value) }}
          >
            <Button onPress={() =>floor&&(inp?.层站?.includes(floor)? null:
                setInp( (inp?.层站&&{...inp,层站:[...inp?.层站,floor] } )
                  || {...inp,层站:[floor] } )
            )}
            >新增</Button>
          </SuffixInput>
        </InputGroupLine>
        <div css={{ textAlign: 'center' }}>
          <Button css={{ marginTop: theme.spaces.sm }} size="sm"
                  onPress={() => floor&&inp?.层站?.includes(floor) &&(
                    setInp({...inp,层站:[...inp.层站.filter(a => a!==floor )],
                      门扇隙:{...inp?.门扇隙,[floor]:undefined}, 门套隙:{...inp?.门套隙,[floor]:undefined}, 地坎隙:{...inp?.地坎隙,[floor]:undefined}
                      , 施力隙:{...inp?.施力隙,[floor]:undefined}, 门锁啮长:{...inp?.门锁啮长,[floor]:undefined}, 刀坎距:{...inp?.刀坎距,[floor]:undefined}
                      , 轮坎距:{...inp?.轮坎距,[floor]:undefined}
                    })
                  )}
          >刪除该层</Button>
        </div>
        <InputGroupLine label={`层门门扇间间隙(层号 ${floor}):`}>
          <SuffixInput
            placeholder="请输入测量数"
            value={ (inp?.门扇隙?.[floor] ) || ''}
            onChange={e => floor&&setInp({ ...inp, 门扇隙:{...inp?.门扇隙,[floor]:e.currentTarget.value||undefined} }) }
          >mm</SuffixInput>
        </InputGroupLine>
        <InputGroupLine label={`层门门扇与门套间隙(层号 ${floor}):`}>
          <SuffixInput
            placeholder="请输入测量数"
            value={ (inp?.门套隙?.[floor] ) || ''}
            onChange={e => floor&&setInp({ ...inp, 门套隙:{...inp?.门套隙,[floor]:e.currentTarget.value||undefined} }) }
          >mm</SuffixInput>
        </InputGroupLine>
        <InputGroupLine label={`层门扇与地坎间隙(层号 ${floor}):`}>
          <SuffixInput
            placeholder="请输入测量数"
            value={ (inp?.地坎隙?.[floor] ) || ''}
            onChange={e => floor&&setInp({ ...inp, 地坎隙:{...inp?.地坎隙,[floor]:e.currentTarget.value||undefined} }) }
          >mm</SuffixInput>
        </InputGroupLine>
        <InputGroupLine label={`层门扇间施力间隙(层号 ${floor}):`}>
          <SuffixInput
            placeholder="请输入测量数"
            value={ (inp?.施力隙?.[floor] ) || ''}
            onChange={e => floor&&setInp({ ...inp, 施力隙:{...inp?.施力隙,[floor]:e.currentTarget.value||undefined} }) }
          >mm</SuffixInput>
        </InputGroupLine>
        <InputGroupLine label={`门锁啮合长度(层号 ${floor}):`}>
          <SuffixInput
            placeholder="请输入测量数"
            value={ (inp?.门锁啮长?.[floor] ) || ''}
            onChange={e => floor&&setInp({ ...inp, 门锁啮长:{...inp?.门锁啮长,[floor]:e.currentTarget.value||undefined} }) }
          >mm</SuffixInput>
        </InputGroupLine>
        <InputGroupLine label={`轿门门刀与层门地坎间距(层号 ${floor}):`}>
          <SuffixInput
            placeholder="请输入测量数"
            value={ (inp?.刀坎距?.[floor] ) || ''}
            onChange={e => floor&&setInp({ ...inp, 刀坎距:{...inp?.刀坎距,[floor]:e.currentTarget.value||undefined} }) }
          >mm</SuffixInput>
        </InputGroupLine>
        <InputGroupLine label={`门锁滚轮与轿门地坎间距(层号 ${floor}):`}>
          <SuffixInput
            placeholder="请输入测量数"
            value={ (inp?.轮坎距?.[floor] ) || ''}
            onChange={e => floor&&setInp({ ...inp, 轮坎距:{...inp?.轮坎距,[floor]:e.currentTarget.value||undefined} }) }
          >mm</SuffixInput>
        </InputGroupLine>
        <Button size="lg" intent={'primary'} onPress={() =>{ setStorage({...storage, ...inp}) }}>
          修改确认
        </Button>
      </InspectRecordTitle>
    );
  } );

//检验项目的标准化展示组件
export interface ItemUniversalProps  extends React.HTMLAttributes<HTMLDivElement>{
  show?: boolean;
  alone?: boolean;
  //检验项目配置对象标准的索引.[x].[y] ； 这里x是大项目；y是检验项目{还可拆分成几个更小项目的}。比如对应action="2.1"就是x=1,y=0的配置。
  x: number;
  y: number;
  ref?: any;
  procedure?: any;     //传递一个检验项目开头流程性内容，显示的格式等。
  details?: any[];     //传递各个子项目(若没有子项目的，就算项目本身[0])的定制，测量数据细节内容。
}
//引进Render Props模式提高复用能力 { details[0](inp,setInp)  }；就可以配置成通用的组件。
//forwardRef实际上已经没用了　ref，可改成简易的组件模式。
const ItemUniversal: React.RefForwardingComponent<InternalItemHandResult,ItemUniversalProps>=
  React.forwardRef((
    { children, show=true, procedure, details, x, y ,alone=true},  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      let fields={};
      //配置动态命名的字段获取旧的值，还想保存修改数据，还要界面同步显示变化数值的场景，就按这里做法。
      inspectionContent[x].items[y].names?.map((aName,i)=> {
        const namexD = `${aName}_D`;
        fields[aName] =par[aName];
        fields[namexD] =par[namexD];
      });
      inspectionContent[x].items[y].addNames.forEach(name=>
        fields[name] =par[name]
      );
      return fields;
    }, [x,y]);
    //旧的模式： const {inp, setInp} = useItemInputControl({ref,  filter: getInpFilter, show});
    const [inp, setInp] = React.useState(null);
 /*   React.useEffect(() => {
      eos.show&& storage&& setInp(getInpFilter(storage));
    }, [eos.show, storage, setInp, getInpFilter] );
*/
    //因为Hook不能用逻辑条件，只能上组件分解了，按条件分解两个组件。
    const mainContent =<React.Fragment>
          <div css={{ display: 'flex', justifyContent: 'space-around' }}>
            <Text variant="h6">检验项目: {`${x + 1}.${y + 1}`}</Text>
            <Text variant="h6">{`${x + 1} ${inspectionContent[x].bigLabel}`}</Text>
          </div>
          <div css={{ display: 'flex', justifyContent: 'space-around' }}>
            <Text variant="h6">{`${x + 1}.${y + 1} ${inspectionContent[x].items[y].label}`}</Text>
            <Text variant="h6">检验类别 {`${inspectionContent[x].items[y].iClass}`}  </Text>
          </div>
          <hr/>
          {procedure}
          <Text variant="h5">
            查验结果
          </Text>
          {inspectionContent[x].items[y].subItems ? (inspectionContent[x].items[y].subItems?.map((a, i) => {
              const namex = `${inspectionContent[x].items[y].names[i]}`;
              const namexD = `${inspectionContent[x].items[y].names[i]}_D`;
              return <React.Fragment key={i}>
                {details[i] && details[i](inp, setInp)}
                <InputGroupLine label={inspectionContent[x].items[y].subItems[i]}>
                  <SelectHookfork value={(inp?.[namex]) || ''} onChange={e => {
                    inp[namex] = e.currentTarget.value || undefined;
                    setInp({ ...inp });
                  }}
                  />
                </InputGroupLine>
                <InputGroupLine label='描述或问题'>
                  <Input value={(inp?.[namexD]) || ''} onChange={e => {
                    inp[namexD] = e.currentTarget.value || undefined;
                    setInp({ ...inp });
                  }}
                  />
                </InputGroupLine>
              </React.Fragment>;
            }))
            :
            (inspectionContent[x].items[y].names?.map((a, i) => {
              const namex = `${inspectionContent[x].items[y].names[i]}`;
              const namexD = `${inspectionContent[x].items[y].names[i]}_D`;
              return <React.Fragment key={i}>
                {details[i] && details[i](inp, setInp)}
                <InputGroupLine label={inspectionContent[x].items[y].label}>
                  <SelectHookfork value={(inp?.[namex]) || ''} onChange={e => {
                    inp[namex] = e.currentTarget.value || undefined;
                    setInp({ ...inp });
                  }}
                  />
                </InputGroupLine>
                <InputGroupLine label='描述或问题'>
                  <Input value={(inp?.[namexD]) || ''} onChange={e => {
                    inp[namexD] = e.currentTarget.value || undefined;
                    setInp({ ...inp });
                  }}
                  />
                </InputGroupLine>
              </React.Fragment>;
            }))
          }
         </React.Fragment>;
    //下拉列表标题=检验类别+项目内容；
    //逻辑组件内部的钩子Hook有差异需求。分解成两个组件逻辑合并后，性能是有提升。
    return (
      <React.Fragment>
        {!alone && <InspectRecordCollapse inp={inp} setInp={setInp}  getInpFilter={getInpFilter} show={show}
                            label={`${inspectionContent[x].items[y].iClass}${inspectionContent[x].items[y].label}`}>
                 {mainContent}
             </InspectRecordCollapse>
        }
        {alone && <InspectRecordDialog inp={inp} setInp={setInp} getInpFilter={getInpFilter} >
                  {mainContent}
              </InspectRecordDialog>
        }
      </React.Fragment>
    );
  } );

//項目標記符列表：不能用ALL none preview printAll item1.1 保留字；
//对应某个报告模板的底下所有的编辑修改的组件；原始记录打印展示项目的全部列表。
const recordPrintList =[
  createItem('Survey', <ItemSurveyLinkMan/>),
  createItem('Instrument', <ItemInstrumentTable/>),
  createItem('item1.1', <ItemUniversal x={0} y={0}/>),
  createItem('gap', <ItemGapMeasure/>),
  createItem('Appendix', <ItemAppendixB/>),
  createItem('Remark', <ItemRemarks/>),
  createItem('ReCheck', <ItemRecheckResult/>),
  createItem('Conclusion', <ItemConclusion/>),
];

//模板定义实例； 2个输出名字不能改。
export  const  originalTemplate= <OriginalView inp={null} action='ALL'/>;
export  const  reportTemplate= <ReportView source={null} action='ALL'/>;
