/** @jsxImportSource @emotion/react */
//代码调试临时整合

import { jsx } from "@emotion/react";
import * as React from "react";
//import { ButtonProps } from "./Button";
//import { IconButtonProps } from "./IconButton";
//import { Layer } from "./Layer";
//import { Positioner, Placements } from "./Positions";
import { ReferenceChildrenProps } from "react-popper";
//import { arrowStyles } from "./Tooltip";
//import { useFocusElement } from "./Hooks/use-focus-trap";
import { animated } from "react-spring";
//import { Sheet } from "./Sheet";
import { useMedia } from "use-media";
import PropTypes from "prop-types";
//import { useTheme } from "./Theme/Providers";
import { OnPressFunction } from "touchable-hook";
//import { mergeRefs } from "./Hooks/merge-refs";

import {ButtonProps,IconButtonProps,Layer, useTheme, Positioner, Placements,arrowStyles,Sheet
} from "customize-easy-ui-component";
import { useFocusElement } from "customize-easy-ui-component/esm/Hooks/use-focus-trap";
import { mergeRefs } from "customize-easy-ui-component/esm/Hooks/merge-refs";


const AnimatedLayer = animated(Layer) as React.FunctionComponent<any>;

interface PopoverProps {
  /** Whether the popover is currently open */
  isOpen?: boolean;
  /** The trigger of the popover */
  children: React.ReactElement<ButtonProps | IconButtonProps>;
  /** the content of the popover */
  content: React.ReactNode;
  /** Whether the menu should close when clicked */
  closeOnMenuItemClick?: boolean;
  /**
   * The default placement of the popover. This will change if
   * the popover cannot properly display in the default position.
   */
  placement?: Placements;
}

/**
 弹出式，像个对话框的，用作菜单列表等。
 */
export const Popover: React.FunctionComponent<PopoverProps> = ({
                                                                 content,
                                                                 children,
                                                                 placement,
                                                                 closeOnMenuItemClick = true,
                                                                 isOpen: defaultShow = false
                                                               }) => {
  const theme = useTheme();
  const [show, setShow] = React.useState(defaultShow);
  const child = React.Children.only(children);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const popoverRef = React.useRef<HTMLDivElement | null>(null);
  useFocusElement(popoverRef, show, {
    escapeDeactivates: true,
    clickOutsideDeactivates: true
  });
  const bg =
    theme.colors.mode === "dark"
      ? theme.colors.background.tint1
      : theme.colors.background.layer;

  function open() {
    setShow(true);
    document.body.addEventListener("click", onBodyClick, false);
    document.body.addEventListener("keydown", onBodyKeyDown, false);
  }

  const unmount = React.useCallback(removeBodyListeners, []);
  //SPA发生路由切换后，会导致先前页面的组件被unmount，假如类似回调函数的钩子还没有处理掉，再次触发调用的，就引起报错 unmounted Error。
  //组件卸载了, "click"的已注册处理函数必须撤销，否则报错。
  React.useEffect(() =>{
      return () => unmount();
    } ,
    [unmount]);

  function close() {
    setShow(false);
    removeBodyListeners();
  }

  function removeBodyListeners() {
    document.body.removeEventListener("click", onBodyClick, false);
    document.body.removeEventListener("keydown", onBodyKeyDown, false);
  }

  //看看是否要关闭对话框
  function onBodyClick(e: MouseEvent) {
    const trigger = triggerRef.current;
    const popover = popoverRef.current;

    if (!trigger || !popover) {
      return;
    }

    // Don't close if clicking the trigger
    if (trigger === e.target || trigger.contains(e.target as Node)) {
      return;
    }

    // or the popover, sometimes
    if (popover === e.target || popover.contains(e.target as Node)) {
      if (closeOnMenuItemClick) {
        const target = e.target as Element;
        if (
          target.hasAttribute('[data-trigger-close="true"]') ||
          target.closest('[data-trigger-close="true"]')
        ) {
          close();
          return;
        }
      }

      return;
    }

    close();
  }

  function onBodyKeyDown(e: KeyboardEvent) {
    // close on escape key or enter
    if (e.keyCode === 27) {
      close();
    }

    // close on enter
    if (closeOnMenuItemClick && e.keyCode === 13) {
      close();
    }
  }

  //弹出的对话框必须跟随这个按钮（=Trigger Button）
  function renderTrigger({ ref }: ReferenceChildrenProps) {
    return React.cloneElement(child, {
      onPress: (e: OnPressFunction) => {
        onTriggerClicked();
        if (child.props.onPress) {
          child.props.onPress(e);
        }
      },
      ref: mergeRefs(ref, triggerRef),
      role: "button",
      "aria-expanded": show,
      "aria-haspopup": true
    });
  }

  function onTriggerClicked() {
    return show ? close() : open();
  }

  return (
    <Positioner placement={placement} isOpen={show} target={renderTrigger}>
      {({ placement, ref, arrowProps, style }, animation) => (
        <AnimatedLayer
          role="dialog"
          elevation="md"
          ref={mergeRefs(ref, popoverRef)}
          style={{
            ...style,
            opacity: animation.opacity
          }}
          data-placement={placement}
          css={{
            zIndex: theme.zIndices.popover,
            margin: theme.spaces.sm,
            borderRadius: theme.radii.md,
            background: bg
          }}
        >
          <div
            data-placement={placement}
            css={arrowStyles(bg)}
            ref={arrowProps.ref}
            style={arrowProps.style}
          />
          {content}
        </AnimatedLayer>
      )}
    </Positioner>
  );
};

Popover.propTypes = {
  isOpen: PropTypes.bool,
  children: PropTypes.element,
  content: PropTypes.node,
  closeOnMenuItemClick: PropTypes.bool,
  placement: PropTypes.oneOf([
    "auto-start",
    "auto",
    "auto-end",
    "top-start",
    "top",
    "top-end",
    "right-start",
    "right",
    "right-end",
    "bottom-end",
    "bottom",
    "bottom-start",
    "left-end",
    "left",
    "left-start"
  ] as Placements[])
};

/**
 * Display popover contents in a bottom sheet if
 * on mobile devices. I generally find that this provides a
 * better use experience on smaller screens. 手机电脑自适应的版本。
 */

export const ResponsivePopover: React.FunctionComponent<PopoverProps> = (
  props: PopoverProps
) => {
  const theme = useTheme();

  // show popover on iPad+  如果最小宽度 >=md: "629px",
  const showPopover = useMedia({
    minWidth: theme.breakpoints.md
  });

  const [isOpen, setIsOpen] = React.useState(false);

  if (showPopover) {
    //电脑版||大屏的，是这样的：
    return <Popover {...props} />;
  }

  //手机版本走下面这样的
  return (
    <React.Fragment>
      {React.cloneElement(React.Children.only(props.children), {
        onPress: () => {
          setIsOpen(true);
        }
      })}
      <Sheet
        position="bottom"
        isOpen={isOpen}
        onRequestClose={() => {
          setIsOpen(false);
        }}
      >
        {props.content}
      </Sheet>
    </React.Fragment>
  );
};

ResponsivePopover.propTypes = {
  ...Popover.propTypes
};
