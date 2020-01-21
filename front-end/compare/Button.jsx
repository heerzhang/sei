"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
/** @jsx jsx */
var core_1 = require("@emotion/core");
var React = require("react");
var color_1 = require("color");
var prop_types_1 = require("prop-types");
//import { alpha, lighten } from "./Theme/colors";
//import { Spinner } from "./Spinner";
//import { useTheme } from "./Theme/Providers";
//import { Theme } from "./Theme";
//import { IconWrapper } from "./IconWrapper";
var touchable_hook_1 = require("touchable-hook");
var classnames_1 = require("classnames");
//import { safeBind } from "./Hooks/compose-bind";
//import { BreakPointType } from "./Theme/breakpoints";
var customize_easy_ui_component_1 = require("customize-easy-ui-component");
var compose_bind_1 = require("customize-easy-ui-component/esm/Hooks/compose-bind");
var colors_1 = require("customize-easy-ui-component/esm/Theme/colors");
var getTextColor = function (background, theme) {
    return color_1.default(background).isDark() ? "white" : theme.modes.light.text.default;
};
exports.getHeight = function (size) {
    if (size === "xs")
        return "25px";
    if (size === "sm")
        return "30px";
    if (size === "lg")
        return "48px";
    if (size === "xl")
        return "60px";
    return "40px";
};
var getPadding = function (size, screen) {
    if (screen === 'sm') {
        if (size === "xs")
            return "0 0.4rem";
        if (size === "sm")
            return "0 0.4rem";
        if (size === "lg")
            return "0 0.6rem";
        if (size === "xl")
            return "0 0.6rem";
    }
    else if (screen === 'lg') {
        if (size === "xs")
            return "0 0.8rem";
        if (size === "sm")
            return "0 1.2rem";
        if (size === "lg")
            return "0 2rem";
        if (size === "xl")
            return "0 3rem";
    }
    if (size === "xs")
        return "0 0.6rem";
    if (size === "sm")
        return "0 0.8rem";
    if (size === "lg")
        return "0 1.1rem";
    if (size === "xl")
        return "0 1.5rem";
    return "0 1rem";
};
var getFontSize = function (size, theme) {
    if (size === "xs")
        return theme.fontSizes[0];
    if (size === "lg")
        return theme.fontSizes[2];
    if (size === "sm")
        return theme.fontSizes[0];
    if (size === "xl")
        return theme.fontSizes[3];
    return theme.fontSizes[1];
};
var getDisplay = function (block) { return (block ? "flex" : "inline-flex"); };
function gradient(start, end) {
    return "linear-gradient(to top, " + start + ", " + end + ")";
}
function insetShadow(from, to) {
    return "inset 0 0 0 1px " + from + ", inset 0 -1px 1px 0 " + to;
}
function focusShadow(first, second, third) {
    return "0 0 0 3px " + first + ", inset 0 0 0 1px " + second + ", inset 0 -1px 1px 0 " + third;
}
exports.focusShadow = focusShadow;
exports.buttonReset = core_1.css({
    textDecoration: "none",
    background: "none",
    whiteSpace: "nowrap",
    WebkitAppearance: "none",
    boxSizing: "border-box",
    textAlign: "center",
    WebkitFontSmoothing: "antialiased",
    border: "none",
    textRendering: "optimizeLegibility",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    cursor: "pointer",
    boxShadow: "none"
});
/**
 * Intent describes the intention of the button
 * -- eg., does it indicate danger?
 */
var getIntentStyles = function (theme, intent, _hover, active) {
    var dark = theme.colors.mode === "dark";
    var palette = theme.colors.palette;
    var activeShadow = dark
        ? insetShadow(colors_1.alpha(palette.gray.dark, 1), colors_1.alpha(palette.gray.dark, 0.9))
        : insetShadow(colors_1.alpha(palette.gray.dark, 0.5), colors_1.alpha(palette.gray.dark, 0.5));
    switch (intent) {
        case "none": {
            if (dark)
                return core_1.css([
                    {
                        backgroundColor: theme.colors.scales.gray[5],
                        color: getTextColor(theme.colors.intent.none.base, theme),
                        background: gradient(theme.colors.intent.none.base, colors_1.lighten(theme.colors.intent.none.base, 0.6)),
                        boxShadow: insetShadow(colors_1.alpha(theme.colors.palette.gray.dark, 0.9), colors_1.alpha(theme.colors.palette.gray.dark, 0.8)),
                        '&[aria-expanded="true"]': {
                            background: "none",
                            backgroundColor: theme.colors.intent.none.base,
                            boxShadow: insetShadow(colors_1.alpha(palette.gray.base, 1), colors_1.alpha(palette.gray.base, 0.9))
                        }
                    },
                    active && {
                        background: "none",
                        backgroundColor: theme.colors.intent.none.base,
                        boxShadow: insetShadow(colors_1.alpha(theme.colors.palette.gray.dark, 1), colors_1.alpha(theme.colors.palette.gray.dark, 0.9))
                    }
                ]);
            return core_1.css([
                {
                    backgroundColor: "white",
                    color: getTextColor(theme.colors.intent.none.lightest, theme),
                    background: gradient(theme.colors.intent.none.lightest, "white"),
                    boxShadow: insetShadow(colors_1.alpha(theme.colors.palette.gray.dark, 0.2), colors_1.alpha(theme.colors.palette.gray.dark, 0.1)),
                    '&[aria-expanded="true"]': {
                        background: "none",
                        backgroundColor: theme.colors.intent.none.lightest,
                        boxShadow: insetShadow(colors_1.alpha(palette.gray.dark, 0.3), colors_1.alpha(palette.gray.dark, 0.15))
                    }
                },
                active && {
                    background: "none",
                    backgroundColor: theme.colors.intent.none.lightest,
                    boxShadow: insetShadow(colors_1.alpha(palette.gray.dark, 0.3), colors_1.alpha(palette.gray.dark, 0.15))
                }
            ]);
        }
        case "primary":
            return core_1.css([
                {
                    backgroundColor: theme.colors.intent.primary.base,
                    color: getTextColor(theme.colors.intent.primary.base, theme),
                    backgroundImage: gradient(theme.colors.intent.primary.base, color_1.default(theme.colors.intent.primary.base)
                        .lighten(0.4)
                        .toString()),
                    boxShadow: dark
                        ? insetShadow(theme.colors.palette.gray.dark, theme.colors.palette.gray.dark)
                        : insetShadow(colors_1.alpha(palette.gray.dark, 0.2), colors_1.alpha(palette.gray.dark, 0.2)),
                    '&[aria-expanded="true"]': {
                        boxShadow: activeShadow,
                        backgroundImage: gradient(theme.colors.intent.primary.dark, theme.colors.intent.primary.base)
                    }
                },
                active && {
                    boxShadow: activeShadow,
                    backgroundImage: gradient(theme.colors.intent.primary.dark, theme.colors.intent.primary.base)
                }
            ]);
        case "success":
            return core_1.css([
                {
                    backgroundColor: theme.colors.intent.success.base,
                    color: getTextColor(theme.colors.intent.success.base, theme),
                    backgroundImage: gradient(theme.colors.intent.success.base, color_1.default(theme.colors.intent.success.base)
                        .lighten(0.5)
                        .toString()),
                    boxShadow: dark
                        ? insetShadow(theme.colors.palette.gray.dark, theme.colors.palette.gray.dark)
                        : insetShadow(colors_1.alpha(palette.gray.dark, 0.2), colors_1.alpha(palette.gray.dark, 0.2)),
                    '&[aria-expanded="true"]': {
                        boxShadow: activeShadow,
                        backgroundImage: gradient(color_1.default(theme.colors.intent.success.base)
                            .darken(0.2)
                            .toString(), theme.colors.intent.success.base)
                    }
                },
                active && {
                    boxShadow: activeShadow,
                    backgroundImage: gradient(color_1.default(theme.colors.intent.success.base)
                        .darken(0.2)
                        .toString(), theme.colors.intent.success.base)
                }
            ]);
        case "danger":
            return core_1.css([
                {
                    backgroundColor: theme.colors.intent.danger.base,
                    color: getTextColor(theme.colors.intent.danger.base, theme),
                    backgroundImage: gradient(theme.colors.intent.danger.base, color_1.default(theme.colors.intent.danger.base)
                        .lighten(0.3)
                        .toString()),
                    boxShadow: dark
                        ? insetShadow(theme.colors.palette.gray.dark, theme.colors.palette.gray.dark)
                        : insetShadow(colors_1.alpha(palette.gray.dark, 0.2), colors_1.alpha(palette.gray.dark, 0.2)),
                    '&[aria-expanded="true"]': {
                        boxShadow: activeShadow,
                        backgroundImage: gradient(color_1.default(theme.colors.intent.danger.base)
                            .darken(0.2)
                            .toString(), theme.colors.intent.danger.base)
                    }
                },
                active && {
                    boxShadow: activeShadow,
                    backgroundImage: gradient(color_1.default(theme.colors.intent.danger.base)
                        .darken(0.2)
                        .toString(), theme.colors.intent.danger.base)
                }
            ]);
        case "warning":
            return core_1.css([
                {
                    backgroundColor: theme.colors.intent.warning.base,
                    color: getTextColor(theme.colors.intent.warning.base, theme),
                    backgroundImage: gradient(theme.colors.intent.warning.base, color_1.default(theme.colors.intent.warning.base)
                        .lighten(0.4)
                        .toString()),
                    boxShadow: dark
                        ? insetShadow(theme.colors.palette.gray.dark, theme.colors.palette.gray.dark)
                        : insetShadow(colors_1.alpha(palette.gray.dark, 0.2), colors_1.alpha(palette.gray.dark, 0.2)),
                    '&[aria-expanded="true"]': {
                        boxShadow: activeShadow,
                        backgroundImage: gradient(color_1.default(theme.colors.intent.warning.base)
                            .darken(0.2)
                            .toString(), theme.colors.intent.warning.base)
                    }
                },
                active && {
                    boxShadow: activeShadow,
                    backgroundImage: gradient(color_1.default(theme.colors.intent.warning.base)
                        .darken(0.2)
                        .toString(), theme.colors.intent.warning.base)
                }
            ]);
    }
};
// variations to the ghost buttons based on intent
var ghostIntents = function (theme, intent, hover, active) {
    var none = intent === "none";
    var dark = theme.colors.mode === "dark";
    var base = none
        ? theme.colors.text.default
        : theme.colors.intent[intent].base;
    if (dark && !none) {
        base = theme.colors.intent[intent].light;
    }
    return core_1.css([
        {
            color: none ? theme.colors.text.muted : base,
            opacity: 1,
            background: "transparent",
            boxShadow: "none",
            transition: "box-shadow 0.07s cubic-bezier(0.35,0,0.25,1), background 0.07s cubic-bezier(0.35,0,0.25,1), opacity 0.35s cubic-bezier(0.35,0,0.25,1)",
            '&[aria-expanded="true"]': {
                background: colors_1.alpha(base, 0.15),
                boxShadow: "none",
                opacity: 1
            }
        },
        hover && {
            background: colors_1.alpha(base, 0.07)
        },
        active && {
            background: colors_1.alpha(base, 0.15),
            boxShadow: "none",
            opacity: 1
        }
    ]);
};
// variations to the outline buttons based on intent
var outlineIntents = function (theme, intent, hover, active) {
    var none = intent === "none";
    var dark = theme.colors.mode === "dark";
    var base = none
        ? theme.colors.text.default
        : theme.colors.intent[intent].base;
    if (dark && !none) {
        base = theme.colors.intent[intent].light;
    }
    return core_1.css([
        {
            color: base,
            borderColor: colors_1.alpha(base, 0.2),
            boxShadow: "none",
            transition: "box-shadow 0.07s cubic-bezier(0.35,0,0.25,1), background 0.07s cubic-bezier(0.35,0,0.25,1)",
            '&[aria-expanded="true"]': {
                background: colors_1.alpha(base, 0.15)
            }
        },
        hover && {
            background: colors_1.alpha(base, 0.05)
        },
        active && {
            background: colors_1.alpha(base, 0.15)
        }
    ]);
};
var variants = {
    default: core_1.css({}),
    ghost: core_1.css({
        background: "transparent",
        boxShadow: "none"
    }),
    outline: core_1.css({
        border: "1px solid",
        background: "none"
    })
};
var iconSpaceForSize = function (theme) { return ({
    xs: "calc(" + theme.iconSizes.xs + " + 0.6rem)",
    sm: "calc(" + theme.iconSizes.sm + " + 0.6rem)",
    md: "calc(" + theme.iconSizes.md + " + 0.6rem)",
    lg: "calc(" + theme.iconSizes.lg + " + 0.6rem)",
    xl: "calc(" + theme.iconSizes.xl + " + 0.6rem)"
}); };
/**
 * Your standard Button element
 */
exports.Button = React.forwardRef(function (_a, ref) {
    var _b;
    var _c = _a.size, size = _c === void 0 ? "md" : _c, block = _a.block, _d = _a.variant, variant = _d === void 0 ? "default" : _d, _e = _a.intent, intent = _e === void 0 ? "none" : _e, _f = _a.className, className = _f === void 0 ? "" : _f, _g = _a.disabled, disabled = _g === void 0 ? false : _g, _h = _a.loading, loading = _h === void 0 ? false : _h, _j = _a.component, Component = _j === void 0 ? "div" : _j, iconBefore = _a.iconBefore, iconAfter = _a.iconAfter, children = _a.children, _k = _a.pressDelay, pressDelay = _k === void 0 ? 0 : _k, pressExpandPx = _a.pressExpandPx, onPress = _a.onPress, _l = _a.noBind, noBind = _l === void 0 ? false : _l, other = __rest(_a, ["size", "block", "variant", "intent", "className", "disabled", "loading", "component", "iconBefore", "iconAfter", "children", "pressDelay", "pressExpandPx", "onPress", "noBind"]);
    var theme = customize_easy_ui_component_1.useTheme();
    var isLink = other.to || other.href;
    console.log("Button获 ｀｀｀ isLink=", isLink ? "link" : "button", "[to]", other.to, "[href]", other.href, ": " + children);
    var _m = touchable_hook_1.useTouchable({
        onPress: onPress,
        delay: pressDelay,
        pressExpandPx: pressExpandPx,
        disabled: disabled,
        behavior: isLink ? "link" : "button"
    }), bind = _m.bind, hover = _m.hover, active = _m.active;
    // how necessary is this?
    var intentStyle = React.useMemo(function () { return getIntent(variant, intent, theme, hover, active); }, [variant, intent, theme, hover, active]);
    if (other.type === "submit" && Component === "div") {
        Component = "button";
    }
    return (<Component className={classnames_1.default("Button", "Touchable", className, {
        "Touchable--hover": hover,
        "Touchable--active": active
    })} role={isLink ? "link" : "button"} tabIndex={0} css={[
        exports.buttonReset,
        (_b = {
                width: block ? "100%" : undefined,
                fontWeight: 500,
                position: "relative",
                fontFamily: theme.fonts.base,
                borderRadius: theme.radii.sm,
                fontSize: getFontSize(size, theme),
                padding: getPadding(size, 'default')
            },
            _b[theme.mediaQueries.sm] = {
                padding: getPadding(size, 'sm'),
                whiteSpace: 'unset',
            },
            _b[theme.mediaQueries.lg] = {
                padding: getPadding(size, 'lg'),
            },
            _b.height = exports.getHeight(size),
            _b.display = getDisplay(block),
            _b.alignItems = "center",
            _b.justifyContent = "center",
            _b[":focus"] = {
                outline: theme.outline
            },
            _b[":focus:not([data-focus-visible-added])"] = {
                outline: other.autoFocus ? "theme.outline" : "none"
            },
            _b),
        variants[variant],
        intentStyle,
        disabled && {
            opacity: 0.6,
            pointerEvents: "none"
        },
        loading && {
            "& > :not(.Spinner)": {
                opacity: 0,
                transition: "opacity 0.1s ease"
            }
        },
        (iconBefore || (block && iconAfter)) && {
            paddingLeft: "0.65rem"
        },
        (iconAfter || (block && iconBefore)) && {
            paddingRight: "0.65rem"
        }
    ]} {...(noBind ? compose_bind_1.safeBind({ ref: ref }, other) : compose_bind_1.safeBind(bind, { ref: ref }, other))}>
        {loading && (<div className="Spinner" css={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)"
    }}>
            <customize_easy_ui_component_1.Spinner delay={1} size={size}/>
          </div>)}

        {iconBefore && (<customize_easy_ui_component_1.IconWrapper css={{ marginRight: theme.spaces.sm }} size={size} color="currentColor" aria-hidden>
            {iconBefore}
          </customize_easy_ui_component_1.IconWrapper>)}

        {typeof children === "string" ? (<span css={{
        flex: 1,
        // kinda lame hack to center our text in block
        // mode with icons before and after
        marginRight: block && iconBefore && !iconAfter
            ? iconSpaceForSize(theme)[size]
            : 0,
        marginLeft: block && iconAfter && !iconBefore
            ? iconSpaceForSize(theme)[size]
            : 0
    }} aria-hidden={loading}>
            {children}
          </span>) : (children)}

        {iconAfter && (<customize_easy_ui_component_1.IconWrapper color="currentColor" css={{ marginLeft: theme.spaces.sm }} size={size}>
            {iconAfter}
          </customize_easy_ui_component_1.IconWrapper>)}
      </Component>);
});
exports.Button.displayName = "Button";
exports.Button.propTypes = {
    variant: prop_types_1.default.oneOf(["default", "ghost", "outline"]),
    size: prop_types_1.default.oneOf(["xs", "sm", "md", "lg", "xl"]),
    block: prop_types_1.default.bool,
    intent: prop_types_1.default.oneOf([
        "none",
        "primary",
        "success",
        "warning",
        "danger"
    ]),
    iconBefore: prop_types_1.default.node,
    iconAfter: prop_types_1.default.node
};
function getIntent(variant, intent, theme, hover, active) {
    switch (variant) {
        case "default":
            return getIntentStyles(theme, intent, hover, active);
        case "ghost":
            return ghostIntents(theme, intent, hover, active);
        case "outline":
            return outlineIntents(theme, intent, hover, active);
    }
}
