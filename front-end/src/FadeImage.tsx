/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import { useTheme } from "customize-easy-ui-component";

/**
 * Fade in an image when it loads. Note, this needs to go
 * within an 'Embed' container to work properly
 * @param param0
 */

export interface FadeImageProps {
  src?: string;
  alt?: string;
  hidden?: boolean;
}

export const FadeImage: React.FunctionComponent<FadeImageProps> = ({
  alt,
  src,
  hidden,
  ...other
}) => {
  const theme = useTheme();
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  function onLoad() {
    setLoaded(true);
  }

  function onError() {
    setError(true);
  }

  if (error) {
    return null;
  }
  //给<img的src若不是真正的图片格式的，就不会真的去下载。
  //<img src="http://localhost:8083/files/30/load"　，不是真图片的情况，浏览器看不到<img >，自动剔除？？

  return src ? (
    <img
      onLoad={onLoad}
      onError={onError}
      aria-hidden={hidden}
      css={{
        opacity: loaded ? 1 : 0,
        transition: "opacity 0.1s ease"
      }}
      src={src}
      {...other}
      alt={alt}
    />
  ) : (
    <div css={{ background: theme.colors.background.tint1 }} />
  );
};
