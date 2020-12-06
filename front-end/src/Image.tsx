
import { jsx,css } from "@emotion/core";
import * as React from "react";
//import * as firebase from "firebase/app";
//import "firebase/storage";
import { Embed } from "customize-easy-ui-component";
import { FadeImage } from "./FadeImage";

interface ImageProps {
  id: string;
  prefix?: string;
  alt: string;
}
//<Embed>能根据上级div宽度高度来自动调整下一级的图片的输出大小。
//一个Image嵌套好几层组件才能到　<img src="" alt="" class="css-11nysj5-FadeImage">。
//缩略图和完整图都是同一个图片的数据内容，　不做差异化处理！
//图片文件要：　根据id, prefix在此生成src及 URL的？
export const Image = ({ alt, id, prefix = "thumb@" }: ImageProps) => {
  //缩略图thumb-sm@和完整图片thumb@的url不一样的； 需要后端服务器的 支持缩略，不同的URL;
  //看应用，专门的缩略图，做独立存储的缩略？，或　一边下载一边压缩的缩略。　没有必要性，直接下载完整图。
  const { src, error } = useFirebaseImage(prefix, id);

  if (error) {
    return null;
  }

  return (
    <Embed width={1000} height={700}>
      <FadeImage src={src} alt={alt} />
    </Embed>
  );
};

function storeURL(key: string, url: string) {
  window.localStorage.setItem(key, url);
}

function hasURL(key: string) {
  const url = window.localStorage.getItem(key);
  return url || null;
}

/**
 * A wrapper around setState which caches our value
 */


//useCachedState返回的［1］＝set钩子函数＝＝保存key的信息到localStorage里去的。
export function useCachedState(key: string) {
  //先从localStorage里面查询key的存储数据给state；
  //若localStorage里面能够匹配到这个key,直接就用它value; = 客户端浏览器的K/V缓存,　？更新同步？。
  const [state, setState] = React.useState(hasURL(key));

  const options: [string, (nextState: string) => void] = [
    state,
    (nextState: string) => {
      storeURL(key, nextState);
      setState(nextState);
    }
  ];

  return options;
}



/**
 * Fetch and cache our firebase download URL
 * @param prefix string
 * @param id string
 */
//原来含义　凭id　去映射出　文件的下载地址。
//自带localStorage缓存？
//参数id　实际＝菜谱的image字段内容，id不是直接的文件URL, 要映射image文件的真正url需要另外生成。
//prefix作废不用。 thumb-sm@是给列表的微缩图片{加载频率更大的！}，　而thumb@是完整图。要后端支持；
export function useFirebaseImage(prefix: string = "thumb@", id?: string) {
  //云存储：  const storage = firebase.storage().ref();
  const key = prefix + id;
  //针对key，把它的信息从localStorage里读出给imageURL，或者用钩子setImageURL函数设置新的存储信息。
  const [imageURL, setImageURL] = useCachedState(key);
  //console.log("进useCachedState面key="+key+ ",imageURL＝"+ JSON.stringify(imageURL) );
  const [error, ] = React.useState(null);
  //let filter={id: id };
  //钩子函数内部嵌套着其它钩子函数：
  //const {items,loadMore,loading,loadingError} =useQueryFileUrl(filter);

  React.useEffect(() => {
    if (!id) {
      return;
    }

    if (imageURL) {
      return;   　　//缓存里面已经有的，就没必要查firebase.storage；
    }
    //要从后端服务器　获取文件ＩＤ所对应的真实文件下载的URL;
    setImageURL(`${process.env.REACT_APP_BACK_END}/files/`+id+"/load");

    /*
    //setImageURL是做缓存在本地的存储key-url。
    //存储中间件生成最终的URL;
    storage
      .child(key)
      .getDownloadURL()
      .then((url: string) => {
        setImageURL(url);      //缓存localStorage去的；
        setError(null);
      })
      .catch(err => {
        setError(err);
      });
    */
  }, [key,id,imageURL,setImageURL] );

  //数据库的字段image实际就是id字符串; 并不是最终的图片的URL。
  //根据prefix, id 来间接的{　firebase.storage()的中间件根据id来影射出的　}生成真正的http图片的URL。
  return {
    src: imageURL,
    error
  };
}


