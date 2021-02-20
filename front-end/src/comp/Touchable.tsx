/** @jsxImportSource @emotion/react */
//代码调试临时整合

import { jsx } from "@emotion/react";
import * as React from "react";
import cx from "classnames";
//import { safeBind } from "./Hooks/compose-bind";
import { safeBind } from "customize-easy-ui-component/esm/Hooks/compose-bind";
import { OnPressFunction, useTouchable } from "customize-easy-ui-component";



/**
 * Touchable is a low level component which implements
 * the useTouchable hook. It provides consistent hover and
 * active styles on desktop and mobile devices.
 */

export interface TouchableProps {
  onPress?: OnPressFunction;
  disabled?: boolean;
  /** By default, a touchable element will only highlight after a short
   * delay to prevent unintended highlights when scrolling. This will
   * only effect touch devices. */
  delay?: number;
  /**
   * By default, a touchable element will have an expanded press area of 20px
   * on touch devices. This will only effect touch devices.
   */
  pressExpandPx?: number;
  /** Whether active presses should be terminated when scrolling occurs. Typically this should be true. */
  terminateOnScroll?: boolean;
  component?: React.ElementType<any>;
  //配合router Link路由SPA单页面场景跳转使用的，跳转新的路由页面后可能出现Can't perform a React state update on an unmounted component
  noBind?:boolean;
  [key: string]: any; // lame hack to allow component injection
}

export const Touchable=
    React.forwardRef((
        {
            children,
            className = "",
            delay,
            pressExpandPx,
            terminateOnScroll = true,
            component: Component = "button",
            onPress,
            disabled = false,
            noBind =false,
            ...other
        }: TouchableProps,
        ref: React.Ref<any>
    ) => {
        const isLink = other.to || other.href;
        const { bind, hover, active } = useTouchable({
            onPress,
            disabled,
            delay,
            terminateOnScroll,
            pressExpandPx,
            behavior: isLink ? "link" : "button"
        });

        return (
            <Component
                className={cx("Touchable", className, {
                    "Touchable--hover": hover,
                    "Touchable--active": active
                })}
                {...safeBind({ ref }, noBind? {}:bind, other)}
            >
                {children}
            </Component>
        );
    } );

