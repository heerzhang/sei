/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import { useGestureResponder } from "react-gesture-responder";
//import { getDirection } from "./Sheet";
import { useSpring, SpringConfig } from "react-spring";
import PropTypes from "prop-types";
//import { safeBind } from "./Hooks/compose-bind";
//import {IconButton} from "./IconButton";

import {
  Navbar,
  Toolbar,
  Input,
  Text,
  Button,
  IconButton,
  MenuList,
  MenuItem,
  useTheme,
  InputBaseProps,
  useToast,
  LayerLoading,
  Container,
  ResponsivePopover,
  IconX,
  IconMoreVertical,
  IconArrowLeft,
  Tooltip, usePrevious ,
} from "customize-easy-ui-component";
import { safeBind } from "customize-easy-ui-component/esm/Hooks/compose-bind";


export interface ScrollViewHandles {
  scrollTo(x?: number, y?: number): void;
}

export interface ScrollViewProps extends React.HTMLAttributes<HTMLDivElement> {
  /** enable overflow-y scrolling */
  overflowY?: boolean;
  /** enable overflow-x scrolling */
  overflowX?: boolean;
  /** spring animation configuration */
  scrollAnimationConfig?: SpringConfig;
  /** access to ref dom element　这个是内部嵌套的div的　 */
  innerRef?: React.RefObject<any>;
  /* 这个用于访问子组件scrollTo()的。 目的不一样 */
  ref?: any;
}

/**
 * A scroll view with some helpers, including:
 *  - smooth scrolling
 *  - gesture claiming
 * @param param0
 * @param componentRef  改成 ref
 */

//export const ScrollViewOrg= React.forwardRef(ScrollViewForward);  // 告警！实际innerRef 和 componentRef可以是等价的。

export const ScrollView: React.RefForwardingComponent<
    ScrollViewHandles,
    ScrollViewProps
    > = React.forwardRef(
    (
        {
            overflowY,
            children,
            overflowX,
            innerRef,
            scrollAnimationConfig = { tension: 190, friction: 15, mass: 0.2 },
            ...other
        } : ScrollViewProps,
        ref
    ) =>  {
        const scrRef = React.useRef<HTMLDivElement>(null);

        /**
         * A spring for animating scroll positions
         */

        const [, setScroll] = useSpring(() => {
            return {
                config: scrollAnimationConfig,
                from: { x: 0, y: 0 },
                to: { x: 0, y: 0 },
                onFrame: (animated: any) => {
                    if (overflowX && scrRef.current) {
                        scrRef.current.scrollLeft = animated.x;
                    }

                    if (overflowY && scrRef.current) {
                        scrRef.current!.scrollTop = animated.y;
                    }
                }
            };
        });

        /**
         * Expose an imperate scrollTo method
         */

        React.useImperativeHandle(
            ref,
            () => ({
                scrollTo: (x?: number, y?: number) => {
                    console.log("访问内部组件scrollTo:的", x, y,"scrRef.current=", scrRef.current, "ref=",ref);
                    if (scrRef.current) {
                        const from = {
                            x: scrRef.current.scrollLeft,
                            y: scrRef.current.scrollTop
                        };

                        setScroll({
                            from,
                            to: { x, y },
                            reset: true
                        } as any);
                    }
                }
            }),
            [setScroll]
        );

        /**
         * Use a pan responder to determine if our scrollview should
         * claim the responder (and cancel other gestures out). Only
         * enabled on touch devices.
         */

        const { bind } = useGestureResponder(
            {
                onStartShouldSet: () => false,
                onTerminationRequest: () => false, // once we claim it, we keep it
                onMoveShouldSet: ({ initial, initialDirection, xy }) => {
                    if (initialDirection[0] !== 0 && overflowX) {
                        return true;
                    }

                    if (initialDirection[1] !== 0 && overflowY) {
                        return true;
                    }

                    return false;
                }
            },
            {
                enableMouse: false
            }
        );

     // 把innerRef?  与 ref?  都 绑定到内部第二个div上。

        return (
            <div className="ScrollView" {...other} {...bind}>
                <div
                    className="ScrollView__scroll-containerr"
                    css={{
                        transform: "translateZ(0)",
                        overflowX: overflowX ? "scroll" : undefined,
                        overflowY: overflowY ? "scroll" : undefined,
                        WebkitOverflowScrolling: "touch"
                    }}
                    {...safeBind({ ref: innerRef }, { ref: scrRef }, other)}
                >
                    {children}
                </div>
            </div>
        );
    }
);

ScrollView.propTypes = {
    overflowY: PropTypes.bool,
    children: PropTypes.node,
    overflowX: PropTypes.bool,
    scrollAnimationConfig: PropTypes.shape({
        tension: PropTypes.number,
        mass: PropTypes.number,
        friction: PropTypes.number
    })
};

