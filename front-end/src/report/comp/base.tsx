/** @jsx jsx */
import { jsx, css, SerializedStyles } from "@emotion/core";
import * as React from "react";
import {
  useTheme,
  Text,
  Button,SelectProps,
  IconChevronUp,
  IconChevronDown, Collapse, useCollapse,
  Select, Layer, Check,
} from "customize-easy-ui-component";
import PropTypes from "prop-types";
//import { useUid } from "customize-easy-ui-component/esm/Hooks/use-uid";
import { Dispatch, SetStateAction } from "react";
//import isEqual from "lodash.isequal";
import { MutableRefObject } from "react";
import { Ref } from "react";
//import { Collapse, useCollapse } from "../../comp/Collapse";
//import { useUid } from "customize-easy-ui-component/src/Hooks/use-uid";


export interface InspectRecordHeadColumnProps {
  level: string;
  bigLabel: string;
  label: string;
  tinyLabel?: string;
  children: React.ReactNode;
}
//检验项目的开头几个列的布局
export const InspectRecordHeadColumn: React.FunctionComponent<InspectRecordHeadColumnProps> = ({
                                                                       label,
                                                                       children,
                                                                       level,
                                                                       bigLabel,
                                                                        tinyLabel,
                                                                       ...other
                                                                     }) => {

  return (
    <React.Fragment>
      <div css={{ display: 'flex', justifyContent: 'space-between'}}>
          <Text  variant="h6"> 检验类别 {level}  </Text>
          <Text  variant="h6"> 检验项目与内容及其要求 </Text>
      </div>

      <Text  variant="h6"　css={{ textAlign: 'center' }}>
          <Text  variant="subtitle"　>
            {bigLabel}
          </Text>
          <Text  variant="body"　>
            {label}
          </Text>
       </Text>

        <Text className="Collapse__text" variant="subtitle">
          {
            tinyLabel?  tinyLabel : null
          }
          <hr/>

          {children}

        </Text>

        <Text  variant="h4"　>
          查验结果
        </Text>
    </React.Fragment>
  );
};


InspectRecordHeadColumn.propTypes = {
  level: PropTypes.string.isRequired,
  bigLabel: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  tinyLabel: PropTypes.string,
  children: PropTypes.node
};


export interface InspectZoneHeadColumnProps {
  label: string;
  projects: string[];
  children?: React.ReactNode;
}
//几个检验项目的聚合模式，1个下拉的分区装入多个项目。
export const InspectZoneHeadColumn: React.FunctionComponent<InspectZoneHeadColumnProps> = ({
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
export const InspectItemHeadColumn: React.FunctionComponent<InspectItemHeadColumnProps> = ({
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

//React.useMemo(() =><RenderLoad/>, []); 用它加速显示组件是针对已经在当前界面显示或display：none的才管用;

export interface InspectRecordTitleProps {
  //control参数实际是 useCollapse(show,true) 返回值。
  //底下的?号是必不可少的。
  control:  {　show?:boolean,
              setShow?: React.Dispatch<React.SetStateAction<boolean>>,
              buttonProps?: any ,
              collapseProps?:{id:string,　show:boolean} 　
            };　
  label: string;
  children: React.ReactNode;
  collapseNoLazy?: boolean;
  onPullUp?: () => void;
}
//原始记录的列表项，很像菜单列表标题；　　包装成一个组件，以便　修改和复用。
export const InspectRecordTitle: React.FunctionComponent<InspectRecordTitleProps> = ({
         control,
         label,
         onPullUp,
         collapseNoLazy=false,
         children,
         ...other
      }) => {
  const theme = useTheme();
  //点击最底下的按钮，可以触发编辑器的确认临时存储的功能。
  return (
    <Layer elevation={"sm"}     css={{ padding: '0.25rem' }}>
      <div>
          <Button
            variant="ghost"
            intent="primary"
            iconAfter={control.show  ? <IconChevronUp /> : <IconChevronDown />}
            {...control.buttonProps}
          >
            {<Text variant="h5" css={{color: control.show ? theme.colors.palette.red.base:undefined}}>{label}</Text>}
          </Button>

          <Collapse {...control.collapseProps}  noAnimated>
              {children}
             <div css={{textAlign: 'right',padding:'0.2rem'}}>
              <Button
                variant="ghost"
                intent="primary"
                iconAfter={control.show  ? <IconChevronUp /> : <IconChevronDown />}
                {...control.buttonProps}
                onPress={() =>{
                    onPullUp&&onPullUp();
                    control.setShow(!control.show);
                } }
              >
                {control.show ? "收起" : "更多"}
              </Button>
             </div>
          </Collapse>
      </div>
    </Layer>
  );
};

InspectRecordTitle.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node,
  control: PropTypes.shape({
      show: PropTypes.bool.isRequired,
      setShow: PropTypes.func,
      buttonProps: PropTypes.any.isRequired,
      collapseProps: PropTypes.any.isRequired,
  }).isRequired,　
};

export interface SelectHookforkProps extends SelectProps {
  topDivStyle?: SerializedStyles;
}
//太多重复了，自定义成一个新组件。
export const SelectHookfork: React.FunctionComponent<SelectHookforkProps> = ({
                                                                 value,
                                                                 onChange,
                                                                 topDivStyle,
                                                               ...other
                                                             }) => {
  return (
    <Select inputSize="md" css={{minWidth:'140px',fontSize:'2rem',padding:'0 1rem'}} divStyle={css`max-width:240px;`}
            value={value}  onChange={onChange}  topDivStyle={topDivStyle}
            {...other}
    >
      <option></option>
      <option>√</option>
      <option>▽</option>
      <option>／</option>
      <option>×</option>
      <option>△</option>
    </Select>
  );
};


export interface AntCheckProps
            extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  topDivStyle?: SerializedStyles;
  defaultChecked?: boolean,
  //外部传递来的状态宿主，点击改变inp。
  inp: any,
  setInp: Dispatch<SetStateAction<any>>,
  //子项目名字
  item: string;
  //父项目名字，若sup为空，item直接挂到inp底下第一层属性，否则嵌套在sup底下，支持2两层楼属性。
  sup?: string;
}
//用来简化重复的部分，就像是一个语法糖。
export const AntCheck: React.FunctionComponent<AntCheckProps> = ({
              label,
              id,
              topDivStyle,
              defaultChecked=false,
              inp,
              setInp,
              sup,
              item,
              ...other
}) => {

  //inp属性inp['witnessConfirm']=false可直接改，但做 inp['tool']['vernierCaliper'] = !(inp['tool']['vernierCaliper'])就不生效？!!
  //     defaultChecked={ defaultChecked  } err but not both). Decide between using a controlled or uncontrolled input element

  return (
      <Check label={label}
             checked={ (sup?  inp?.[sup]?.[item]  :  inp?.[item] ) || defaultChecked }
             onChange={e => {
                   setInp( (sup&& inp&&{ ...inp,  [sup]: { ...inp[sup],  [item]  :   !( inp[sup]  &&  inp[sup][item] )   }    } )
                           ||  (sup&& { [sup]: { [item] :  !defaultChecked }  } )
                           ||  (inp&&{ ...inp,   [item]  :  ! inp[item] } )
                           ||  { [item]  :  !defaultChecked }   )
                 }  }
             topDivStyle={topDivStyle}
      />
  );
};

interface IndentationLayTextProps  {
  title?: string | React.ReactNode;
  id?: string;
  children?: React.ReactNode;
  component?: React.ElementType<any>;
}
//子元素缩进排版: 文本段落，缩进的。
export const IndentationLayText: React.FunctionComponent<IndentationLayTextProps> = ({
                 children,
                 title,
                 id,
                 component :Component= "div",
                 ...other
               }) => {
  const theme = useTheme();
  return (
    <Component
      className="Indentation"
      css={{
      }}
      {...other}
    >
      <Text
        className="Indentation__title"
        id={id}
        css={{ margin: 0 }}
        variant="h6"
      >
        {title}
      </Text>
      <div css={{ paddingLeft: '1rem',
            [theme.mediaQueries.sm]: {
              paddingLeft: '0.5rem'
            },
            [theme.mediaQueries.lg]: {
              paddingLeft: '2rem'
            }
           }}>
        {children}
      </div>
    </Component>
  );
};


//par代表整体原后端数据，itemVal是当前条目的截取部分数据。
//把par 直接保存到了useRef做成的 那个不可变previousState当中。
//总的show按钮各分区项目show的控制，以单一个逻辑变量无法完全正确操纵！必须传递然后合并成独立一个show逻辑。
export interface ItemControlProps {
  ref: React.Ref<any>;
  show: boolean;
  //par: any;   改成回调模式，上级深度控制下级，去除组件参数，避免多头受控，可能死循环。   par={},
  //接受par输入的过滤器，回调 过滤有用数据。
  filter: (par: any) => {};
}
//后端数据没有变化的，前端输入正在导致记录变化的，要维持以正在交互的输入为准，等待保存给后端。
//par被上级组件利用回调钩子模式接管控制后，就不能在这里多头设置，否则死循环。
export　function useItemControlAs({
                             ref=null,
                             filter=null,
                             show=false
                            } : ItemControlProps
) {
  const eos =useCollapse(show,true);
  const [inp, setInp] = React.useState(null);
  const [par, setPar] = React.useState(null);
  //用回调钩子setShow来替换；原先的show参数下传配合在useCollapse内部useEffect(() [defaultShow] 做修正方式。
  //回调钩子的模式。在上层父组件去统一调用本函数的，这里仅仅生成函数的代码但还未执行。


  const onParChange = React.useCallback(function (par) {
        //            setPar(par);
        //            setInp(filter(par));
                }, [  ]);


  //【廢棄】setShow功能，無需排序和全部開或拉上。

  //旧的模式,子组件把自己的东西暴露给了父组件；，准备废弃了！
//  React.useImperativeHandle( ref,() => ({ inp ,setShow:eos.setShow, onParChange}), [inp, onParChange,eos.setShow] );
    //不直接用import { usePrevious } from "./Hooks/previous" 减少render次数。
  return {eos, setInp, inp, par};
}



//各个检验单项子组件暴露给父组件的接口数据。
export interface InternalItemHandResult {
  inp: any;
}
//各个检验单项
export interface InternalItemProps  extends React.HTMLAttributes<HTMLDivElement>{
  //par?: any;        //父组件往子组件传数据
  show?: boolean;
//  layout?: any;     //传递一个检验项目开头流程性内容，显示的格式等。
  ref?: any;
 // details?: any[];    //传递各个子项目(若没有子项目的，就算项目本身[0])的定制，测量数据细节内容。
}
//动态载入的模板组件, 所有参数都必须？可选的，否则报错。
export interface TemplateViewProps {
  inp?: any;
  action: string;
  ref?: any;
}


//Hook编译报错，不允许直接套数组()=> 回调函数模式创建；需要包裹一层Component()规避检查。
//若本组件没有重新加载，{count}数组长度变化，会导致ｈｏｏｋ报错。  重命名也逃不掉报错。
//count=下拉组件亦即独立展示项目个数；
//HOOK机制要求，useXXX() 次数与顺序都不允许变化。HOOK报错。
//外部采用路由模式，组件进入后采取根据入口参数来调节count的就没问题，count不会因为两次render表现出个数差异。
export function useProjectListAs({count}) {
  const array= new Array(count).fill(null);
  function WrappedComp(i: number) {
        return React.useRef<InternalItemHandResult>(null);
  };
  return React.useRef<MutableRefObject<InternalItemHandResult>[] | null>(array.map((i) => WrappedComp(i) ) );
}

//自定义Ｈｏｏｋ的 例子。
/*const useValues = () => {
  const [values, setValues] = React.useState({  });
  const itBinds=useProjectListAs({count: 8});
  const updateData = React.useCallback(
    (nextData) => {    },    [values],
  );
  return [values, updateData, itBinds];
};
*/

