/** @jsxImportSource @emotion/react */
import { jsx,  } from "@emotion/react";
import * as React from "react";
import {
   useTheme, InputGroupLine, SuffixInput, Button, Input
} from "customize-easy-ui-component";

import { CCell, Cell, Table, TableBody, TableRow } from "../../comp/TableExt";
import { InspectRecordLayout, InternalItemHandResult, InternalItemProps, useItemInputControl } from "../comp/base";
import { Link as RouterLink } from "wouter";
import * as queryString from "querystring";
import Img_Seal from '../../images/seal.png';


//不同版本能够直接复用的组件； 内容相对重复；减少代码数量的重复和冗余。

//即使多版本间会有调整的，还可以添加注入的参数或者内部逻辑判定来适应。
export const ItemSurveyLinkMan=
  React.forwardRef((
    { children, show ,alone=true}:InternalItemProps,  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      //devCod,检验日期：这些字段要提升到关系数据库表中，json半结构化数据的就不做保留。
      //安全人员,联系电话：放json，算是过度性质输入形态。报告正式批准/终结后，就该触发修改同步到库表中去。也可反馈给下一次定期检验，继承或修改。
      const {devCod,检验日期,安全人员,联系电话} =par||{};
      return {devCod,检验日期,安全人员,联系电话};
    }, []);
    const {inp, setInp} = useItemInputControl({ ref });
    return (
      <InspectRecordLayout inp={inp} setInp={setInp}  getInpFilter={getInpFilter} show={show}
                           alone={alone}  label={'一、设备概况'} >
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
      </InspectRecordLayout>
    );
  } );

//提供給6.3 6.9 6.12項目公用的部分。
//'附录A 层门间隙、啮合长度' 这7个测量数据，单独放一个编辑组件。而原本'6.3','6.9','6.12'只读和跳转连接。
export const ItemGapMeasure=
  React.forwardRef((
    { children, show ,alone=true, repId}:InternalItemProps,  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {层站,门扇隙,门套隙,地坎隙,施力隙,门锁啮长,刀坎距,轮坎距,门扇间隙,最不利隙,层门锁,轿门锁,刀轮地隙} =par||{};
      return {层站,门扇隙,门套隙,地坎隙,施力隙,门锁啮长,刀坎距,轮坎距,门扇间隙,最不利隙,层门锁,轿门锁,刀轮地隙};
    }, []);
    const {inp, setInp} = useItemInputControl({ ref });
    const theme = useTheme();
    const [floor, setFloor] = React.useState(null);
    const qs= queryString.parse(window.location.search);
    //console.log("参数第三层路由mathched qs=",qs);
    return (
      <InspectRecordLayout inp={inp} setInp={setInp}  getInpFilter={getInpFilter} show={show}
                           alone={alone}  label={'附录A 层门间隙、啮合长度'}>
        <div>
          <RouterLink  to={`/report/EL-DJ/ver/1/${qs.from?qs.from:'6.3'}/${repId}`}>
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
        新增检查=＞
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
      </InspectRecordLayout>
    );
  } );


export const 检验编制核准= ( { orc }
) => {
  return <React.Fragment>
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
        <div css={{backgroundImage:`url(${Img_Seal})`,backgroundSize:"cover",backgroundPosition:"center",minHeight:'30vmin'}}>
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
  </React.Fragment>;
};

//注意<RouterLink to={`/report/`}>不能直接套在函数上面，其底下必须见到<>。
export const 检验设备情况= ( { orc }
) => {
  return <React.Fragment>
    <TableBody>
      <TableRow>
        <CCell component="th" scope="row">设备品种</CCell>
        <CCell>{orc.设备品种}</CCell>
        <CCell>使用登记证编号</CCell>
        <CCell>{orc.使用证号}</CCell>
      </TableRow>
      <TableRow >
        <CCell component="th" scope="row">使用单位名称</CCell>
        <CCell colSpan={3}>{orc.使用单位}</CCell>
      </TableRow>
      <TableRow >
        <CCell component="th" scope="row">使用单位地址</CCell>
        <CCell colSpan={3}>{orc.使用单位地址}</CCell>
      </TableRow>
      <TableRow >
        <CCell component="th" scope="row">楼盘名称</CCell>
        <CCell colSpan={3}>{orc.楼盘}</CCell>
      </TableRow>
      <TableRow >
        <CCell component="th" scope="row">楼盘地址</CCell>
        <CCell colSpan={3}>{orc.楼盘地址}</CCell>
      </TableRow>
      <TableRow >
        <CCell component="th" scope="row">分支机构名称</CCell>
        <CCell colSpan={3}>{orc.分支机构 || '／'}</CCell>
      </TableRow>
      <TableRow >
        <CCell component="th" scope="row">分支机构地址</CCell>
        <CCell colSpan={3}>{orc.分支机构地址 || '／'}</CCell>
      </TableRow>
      <TableRow>
        <CCell component="th" scope="row">设备使用地点</CCell>
        <CCell colSpan={3}>{orc.设备使用地点}</CCell>
      </TableRow>
      <TableRow>
        <CCell component="th" scope="row">使用单位代码</CCell>
        <CCell colSpan={3}>350122197109084531</CCell>
      </TableRow>
      <TableRow>
        <CCell component="th" scope="row">安全管理人员</CCell>
        <CCell>{orc.安全人员}</CCell>
        <CCell>使用单位设备编号</CCell>
        <CCell>{orc.单位内部编号}</CCell>
      </TableRow>
      <TableRow>
        <CCell component="th" scope="row">制造日期</CCell>
        <CCell>{orc.制造日期 || '／'}</CCell>
        <CCell>改造日期</CCell>
        <CCell>{orc.改造日期 || '／'}</CCell>
      </TableRow>
      <TableRow>
        <CCell component="th" scope="row">制造单位名称</CCell>
        <CCell colSpan={3}>{orc.制造单位 || '／'}</CCell>
      </TableRow>
      <TableRow>
        <CCell component="th" scope="row">改造单位名称</CCell>
        <CCell colSpan={3}>{orc.改造单位 || '／'}</CCell>
      </TableRow>
      <TableRow>
        <CCell component="th" scope="row">产品编号</CCell>
        <CCell>ZT1600005085</CCell>
        <CCell>型号</CCell>
        <CCell>{orc.型号}</CCell>
      </TableRow>
      <TableRow>
        <CCell component="th" scope="row">维护保养单位名称</CCell>
        <CCell colSpan={3}>{orc.维保单位}</CCell>
      </TableRow>
    </TableBody>
  </React.Fragment>;
};




