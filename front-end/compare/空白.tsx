const InternalItem6d3: React.RefForwardingComponent<InternalItemHandResult,InternalItemProps>=
  React.forwardRef((
    props:{ children },  ref
  ) => {
    const getInpFilter = React.useCallback((par) => {
      const {层站,门扇隙,门套隙,地坎隙,施力隙,门锁啮长,刀坎距,轮坎距,doorClearance,manPowerGap,doorLock,cabinLock,lengthDoorLock,clearanceKnife} =par||{};
      return {层站,门扇隙,门套隙,地坎隙,施力隙,门锁啮长,刀坎距,轮坎距,doorClearance,manPowerGap,doorLock,cabinLock,lengthDoorLock,clearanceKnife};
    }, []);
    const { eos, setInp, inp } = useItemControlAs({ref,  filter: getInpFilter});
    const theme = useTheme();
    const [floor, setFloor] = React.useState(null);
    const cAppendix =useCollapse(false,true);
    let  toothUnquf=inp?.层站?.find((f,i)=>{
      return parseFloat(inp?.门锁啮长?.[f])<7;
    });
    let  knifeUnquf=inp?.层站?.find((f,i)=>{
      return parseFloat(inp?.刀坎距?.[f])<5;
    });
    let  rollerUnquf=inp?.层站?.find((f,i)=>{
      return parseFloat(inp?.轮坎距?.[f])<5;
    });

    return (
      <React.Fragment>
        <InspectRecordTitle  control={eos}   label={'层门间隙门锁'}>
    <InspectZoneHeadColumn label={'6 轿门与层门'} projects={['6.3','6.9','6.12']} />
    <InspectRecordTitle  control={cAppendix} label={'附录A 层门间隙、啮合长度'}>
      <div>
        已检记录,每层七个尺寸:
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
        autoFocus={true}
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
      autoFocus={true}
    placeholder="请输入测量数"
    value={ (inp?.门扇隙?.[floor] ) || ''}
    onChange={e => floor&&setInp({ ...inp, 门扇隙:{...inp?.门扇隙,[floor]:e.currentTarget.value? e.currentTarget.value:undefined} }) }
  >mm</SuffixInput>
    </InputGroupLine>
    <InputGroupLine label={`层门门扇与门套间隙(层号 ${floor}):`}>
    <SuffixInput
      autoFocus={true}
    placeholder="请输入测量数"
    value={ (inp?.门套隙?.[floor] ) || ''}
    onChange={e => floor&&setInp({ ...inp, 门套隙:{...inp?.门套隙,[floor]:e.currentTarget.value? e.currentTarget.value:undefined} }) }
  >mm</SuffixInput>
    </InputGroupLine>
    <InputGroupLine label={`层门扇与地坎间隙(层号 ${floor}):`}>
    <SuffixInput
      autoFocus={true}
    placeholder="请输入测量数"
    value={ (inp?.地坎隙?.[floor] ) || ''}
    onChange={e => floor&&setInp({ ...inp, 地坎隙:{...inp?.地坎隙,[floor]:e.currentTarget.value? e.currentTarget.value:undefined} }) }
  >mm</SuffixInput>
    </InputGroupLine>
    <InputGroupLine label={`层门扇间施力间隙(层号 ${floor}):`}>
    <SuffixInput
      autoFocus={true}
    placeholder="请输入测量数"
    value={ (inp?.施力隙?.[floor] ) || ''}
    onChange={e => floor&&setInp({ ...inp, 施力隙:{...inp?.施力隙,[floor]:e.currentTarget.value? e.currentTarget.value:undefined} }) }
  >mm</SuffixInput>
    </InputGroupLine>
    <InputGroupLine label={`门锁啮合长度(层号 ${floor}):`}>
    <SuffixInput
      autoFocus={true}
    placeholder="请输入测量数"
    value={ (inp?.门锁啮长?.[floor] ) || ''}
    onChange={e => floor&&setInp({ ...inp, 门锁啮长:{...inp?.门锁啮长,[floor]:e.currentTarget.value? e.currentTarget.value:undefined} }) }
  >mm</SuffixInput>
    </InputGroupLine>
    <InputGroupLine label={`轿门门刀与层门地坎间距(层号 ${floor}):`}>
    <SuffixInput
      autoFocus={true}
    placeholder="请输入测量数"
    value={ (inp?.刀坎距?.[floor] ) || ''}
    onChange={e => floor&&setInp({ ...inp, 刀坎距:{...inp?.刀坎距,[floor]:e.currentTarget.value? e.currentTarget.value:undefined} }) }
  >mm</SuffixInput>
    </InputGroupLine>
    <InputGroupLine label={`门锁滚轮与轿门地坎间距(层号 ${floor}):`}>
    <SuffixInput
      autoFocus={true}
    placeholder="请输入测量数"
    value={ (inp?.轮坎距?.[floor] ) || ''}
    onChange={e => floor&&setInp({ ...inp, 轮坎距:{...inp?.轮坎距,[floor]:e.currentTarget.value? e.currentTarget.value:undefined} }) }
  >mm</SuffixInput>
    </InputGroupLine>
    </InspectRecordTitle>

    <InspectItemHeadColumn  level={'C'} label={'6.3 门间隙'}  >
    <IndentationLayText title={'门关闭后,应当符合以下要求:'}>
      (1) 门扇之间及门扇与立柱、门楣和地坎之间的间的间隙,对于乘客电梯不大于6mm;对于载货电梯不大于8mm,使用过程中由于磨损,允许达10mm;<br />
    (2) 在水平移动门和折叠门主动门扇的开启方向,以150N的人力施加在一个最不利的点，前条所述的间
    隙允许增大，但对于旁开门不大于30mm，对于中分门其总和不大于45mm
    </IndentationLayText>
    <Table css={{borderCollapse:'collapse'}}>
    <TableBody>
      <TableRow >
        <CCell>层</CCell>
    <CCell>门扇隙</CCell>
    <CCell>门套隙</CCell>
    <CCell>地坎隙</CCell>
    <CCell>施力隙</CCell>
    </TableRow>
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
    </InspectItemHeadColumn>
    <InputGroupLine  label='(1)门扇间隙'>
    <SelectHookfork value={ inp?.doorClearance ||''}
    onChange={e => setInp({ ...inp, doorClearance: e.currentTarget.value||undefined}) }
    />
    </InputGroupLine>
    <InputGroupLine  label='(2)人力施加在最不利点时间隙'>
    <SelectHookfork value={ inp?.manPowerGap ||''}
    onChange={e => setInp({ ...inp, manPowerGap: e.currentTarget.value||undefined}) }
    />
    </InputGroupLine>

    <InspectItemHeadColumn  level={'B'} label={'6.9 门的锁紧'}  >
    <IndentationLayText title={'(1)每个层门都应当设有符合下述要求的门锁装置:'}>
                ②锁紧动作由重力、永久磁铁或者弹簧来产生和保持，即使永久磁铁或者弹簧失效，重力亦不能导致开锁；<br/>
                ③轿厢在锁紧元件啮合不小于7mm时才能启动；<br/>
                ④门的锁紧由一个电气安全装置来验证，该装置由锁紧元件强制操作而没有任何中间机构，并且能够防止误动作；
              </IndentationLayText>
              (2)如果轿门采用了门锁装置,该装置也应当符合本条(1)的要求。
            </InspectItemHeadColumn>
            <div>
            已检门锁啮合长度:
    {inp?.层站?.map(a=>{
      return ` ${a}层:${inp?.门锁啮长?.[a]||''};`
    }) }
    </div>
    <InputGroupLine  label='(1)③门锁啮合长度'>
    <SelectHookfork value={toothUnquf? '×': inp?.层站?.length>=1? '√':''} disabled/>
    </InputGroupLine>
    <InputGroupLine  label='(1)层门门锁装置'>
    <SelectHookfork value={ inp?.doorLock ||''}
    onChange={e => setInp({ ...inp, doorLock: e.currentTarget.value||undefined}) }
    />
    </InputGroupLine>
    <InputGroupLine  label='(2)轿门门锁装置'>
    <SelectHookfork value={ inp?.cabinLock ||''}
    onChange={e => setInp({ ...inp, cabinLock: e.currentTarget.value||undefined}) }
    />
    </InputGroupLine>

    <InspectItemHeadColumn  level={'C'} label={'6.12 门刀、门锁滚轮与地坎间隙'}>
      1）轿门门刀与层门地坎，层门锁滚轮与轿厢地坎的间隙应当不小于5mm；电梯运行时不得互相碰擦
    </InspectItemHeadColumn>
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
    <InputGroupLine  label='间隙应当不小于5mm'>
    <SelectHookfork value={knifeUnquf||rollerUnquf? '×': inp?.层站?.length>=1? '√':''} disabled/>
    </InputGroupLine>
    <InputGroupLine  label='(1)门刀、门锁滚轮与地坎间隙'>
    <SelectHookfork value={ inp?.clearanceKnife ||''}
    onChange={e => setInp({ ...inp, clearanceKnife: e.currentTarget.value||undefined}) }
    />
    </InputGroupLine>
    </InspectRecordTitle>
    </React.Fragment>
  );
  } );
