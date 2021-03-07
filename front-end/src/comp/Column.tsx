/** @jsxImportSource @emotion/react */
import * as React from "react";
import PropTypes from "prop-types";
import { LayoutMediaQueryFactory } from '@s-ui/react-layout-media-query'
import LayoutMediaQuery from '@s-ui/react-layout-media-query'
import ResizeReporter from 'react-resize-reporter'

type LayerElevations = "xs" | "sm" | "md" | "lg" | "xl";
/*
 列式布局: column
 布局子孙都是平等的，宽度都平均分配，预期高度在同一行排列也是均衡整齐或高度一致的，
 父窗口宽度不确定的， 具体显示几个列是自适应的，最多列数固定。
 列数动态确定， 之后的子孙实际宽度都是铺满的100%。
 不使用滚动条的，大尺寸元素上 都没有固定数值的px;
子孙的宽度没有固定px的，布局组件的子孙都是可在宽度上做自适应的。只有目标多少列排列是敲定固定的，也就是预期最大父窗口宽度场合可以安排最多几个列的元素。
 宽度上 竟然小到了1列都放不下了， fitable=true传递给子孙；
子孙输入Line组件的断线折腰宽度在布局组件上就的设置switchPx参数。
布局组件来传递进来布局紧凑与否参数fitable。也就是遇到最小最小的父窗口宽度情形，在只安排单列元素场合下的，给输入Line组件紧凑提示。
 最后一行：非满格的 落单子孙个数， 居中？，宽度协调一致。
 最多列数是应用场景 程序敲定， 大概会放得下几个列啊{已经考虑了需求上级大的布局切换需求后，反正就是最大可能性几个列}。
*/



function validChildrenCount(children: any) {
    return React.Children.toArray(children).filter(child =>
        React.isValidElement(child)
    ).length;
}


interface LineColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The size of the shadow to use */
  elevation?: LayerElevations;
  /** The contents of the layer */
  children: React.ReactNode;
    //根据换行px数 ，来切换显示2个显示模式。 缺省>=360px 正常模式，否则紧凑模式。
    switchPx?: number;
}

/**
 * 父辈窗口屏幕宽度就算再大，也是只安排1个列的，布局思路。
 * Line1Column,... Line5Column
 */
export const Line1Column: React.FunctionComponent<LineColumnProps> =(
  {
    elevation = "md",
    children,
    switchPx=336,
    ...other
  }
) => {
  //const theme = useTheme();
  const BREAKPOINTS = {
    md: switchPx
  }
  //回调函数{SM, MD, LG, XL} ) => {}是按照从大到小排列if语句<><>，大的优先顺序触发。
  //缺点：不能像Hook那样提前在函数体前面获得逻辑！只能直接做嵌套;
  // 回调函数转成 大写字母。
  //回调{( { MD } ) => {， 实际执行频率很低的，切换时可能 有MD=undefined状态。
  const LayoutMediaQueryBootstrap = LayoutMediaQueryFactory(BREAKPOINTS)

  return (
    <LayoutMediaQueryBootstrap>
      {( { MD } ) => {
        return(
          <React.Fragment>
            {
              React.Children.map(children, (child, i) => {
                if (!React.isValidElement(child)) {
                  return child;
                }
                return React.cloneElement(child as any, {
                  fitable: MD
                });
              })
            }
          </React.Fragment>
        )
      }}
    </LayoutMediaQueryBootstrap>
  );
};


Line1Column.displayName = "Line1Column";

Line1Column.propTypes = {
  elevation: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  children: PropTypes.node
};


//第二版本 布局组件L2Column来配合。
export const Line1ColumnR: React.FunctionComponent<LineColumnProps> =(
    {
        elevation = "md",
        children,
        switchPx=336,
        ...other
    }
) => {
    //const theme = useTheme();
    const [fitable, setFitable] = React.useState(true);
    //必须加一层div{{ position: 'relative' }}，后面给出的宽度才对的。
    return (
        <div style={{ position: 'relative' }}>
            <ResizeReporter  onWidthChanged={(width)=>{
                        setFitable((width>=switchPx) );
                    }
                 }
            />
            {
                React.Children.map(children, (child, i) => {
                    if (!React.isValidElement(child)) {
                        return child;
                    }
                    return React.cloneElement(child as any, {
                        fitable: false
                    });
                })
            }
        </div>
    );
};


