//import * as firebase from "firebase/app";
//import "firebase/storage";
//import shortid from "shortid";
import * as React from "react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
//import "./db";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

//import useFetch, { useGet, usePost } from 'use-http'  ;?无法使用{{ process:( load, error ) }}修正中间件FilePond的状态。
//虽然用全局变量可传递load, error函数，可是若想'use-http'多个文件同时上传时，将会交叉混乱。
// import "./image.css";
//import parseXlsx from 'excel';

//const fs = require("fs"); 浏览器上无法使用！报错。TypeError: fs.createWriteStream is not a function；

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);


/*谷歌云 删除

const storage = firebase.storage().ref();
*/

//因为外部引用我这ImageUpload的父组件无法支持多文件的使用，onRequestSave 应只能运行一次 maxFiles={1}。
export function ImageUpload({
  onRequestSave,
  onRequestClear,
  defaultFiles = []
}) {
  const [files, setFiles] = React.useState(defaultFiles);
  const ref = React.useRef(null);

  return (
    <FilePond
      files={files}
      ref={ref}
      labelIdle={`<span class="filepond--label-action"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24"><defs><path id="a" d="M24 24H0V0h24v24z"/></defs><clipPath id="b"><use xlink:href="#a" overflow="visible"/></clipPath><path clip-path="url(#b)" d="M3 4V1h2v3h3v2H5v3H3V6H0V4h3zm3 6V7h3V4h7l1.83 2H21c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V10h3zm7 9c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-3.2-5c0 1.77 1.43 3.2 3.2 3.2s3.2-1.43 3.2-3.2-1.43-3.2-3.2-3.2-3.2 1.43-3.2 3.2z"/></svg><span>Add an image</span></span>`}
      allowMultiple={true}
      maxFiles={1}
      server={{
        process:(fieldName, file, metadata, load, error, progress, abort) => {
          //每个文件独立调process一次，load, error也都是每个文件各自对应的回调，不能共享。
          //const id = shortid.generate();      //file.type  name size
          const formData = new FormData();
          fieldName='file';         //前后端交互的标准的参数？：'file'
          formData.append(fieldName, file, "菜谱图片/"+file.name);
          // formData.append('file', file);    　  //前后端交互的标准的参数？：'file'
          console.log("发送前钩：", formData,file);
          //[无法介入和操作文件流]　metadata为空，fs模块接口也是只剩下close();
          //fetch()不支持进度,无法实现像axios和ajax(XMLHttpRequest)那样对文件上传进度progress提示。
          //progress(true, 500, 1024);
          fetch(`${process.env.REACT_APP_BACK_END}/uploadFile`, {
            body: formData, // must match 'Content-Type' header
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include', // include, same-origin, *omit
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
           })
            .then(response => response.json())   // parses response to JSON
            .then(function(data) {
              //运行到这个位置，实际很可能用户界面上已经中止取消了，可实际可能完成和后端所有流程，只是用户不晓得。
              console.log("钩子readddds：", data);
              if(data && !data.error){
                  load(data.fileDownloadUri);         //可撤销的文件ID;obj.fileName
                  //console.log('后端服务器确认上传好了['+ data.fileName+"];文件ID="+data.fileDownloadUri);
                  //隐藏fileDownloadUri/加密，改成文件的ID去暴露给用户。　保存刚才的文件ＩＤ=onRequestSave(id);
                  onRequestSave(data.fileDownloadUri);
              }else{
                error('oh no');
              }
            })
            .catch(err => { error('oh no');
            });
          //运行到这个位置，可实际上传还在进行当中。
          return {
            abort: () => {
               //ajax.abort();
              abort();
            }
          };
        },
        load: (source, load, error, progress, abort) => {
          console.log("编辑功能，预览source图片="+ JSON.stringify(source) );
          //progress(true, 0, 1024);
          fetch(`${process.env.REACT_APP_BACK_END}/files/`+source+"/load", {
            credentials: 'include', // include, same-origin, *omit
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
          })
            .then(response => {
              if (response.ok) {
                  response.blob().then(blob => {
                    const filename = response.headers.get('Content-Disposition').split('filename*=UTF-8\'\'')[1];
                    //把文件名后缀jsx改成tsx之后decodeURI(filename,"UTF-8")函数竟然不一样了？
                    console.log("钩子---文件名：", decodeURI(filename));
                    load(blob);
                  });
              } else {
                error('oh no');
              }
            })
             .catch(err => { error('oh no');
            });
        },
        revert: (uniqueFileId, load, error) => {
          //回退清除功能＝删除已上传的id URL；
          console.log("清除---恢复revert文件ID="+ JSON.stringify(uniqueFileId) );
          const formData = new FormData();
          formData.append('fileName', uniqueFileId);    　  //前后端交互的标准的参数？：'file'
          //这里无法知道恢复恢复的文件名，FilePond组件在界面可以看见的，但却不提供程序接口。
          fetch(`${process.env.REACT_APP_BACK_END}/files/`+uniqueFileId+"/delete", {
            body: formData, // must match 'Content-Type' header
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include', // include, same-origin, *omit
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
          })
            .then(response => response.json())   // parses response to JSON
            .then(function(data) {
              //运行到这个位置，实际很可能用户界面上已经中止取消了，可实际可能完成和后端所有流程，只是用户不晓得。
              if(data && !data.error){
                console.log('后端服务器revert好:'+ data.fileName);
              }else{
                error('oh no');
              }
            })
            .catch(err => { error('oh no');
            });
          // Should call the load method when done, no parameters required
          load();
        },
        remove: (source, load, error) => {
          console.log("编辑修改？remove文件ID="+ JSON.stringify(source) );
          // Should somehow send `source` to server so server can remove the file with this source
          // Can call the error method if something is wrong, should exit after
          error('oh my goodness');
          // Should call the load method when done, no parameters required
          load();
        }
      }}
      onupdatefiles={fileItems => {
        if (fileItems.length === 0) {
          onRequestClear();
        }
        //这里是FilePond自己的事务，界面更新的，和后端的没半点干系。
        //console.log("onupdatefiles界面更新=", fileItems);
        setFiles(fileItems.map(fileItem => fileItem.file));
      }}
    />
  );
}


//原生XMLHttpRequest (ajax)的简单使用
//FilePond界面提示上传结束，实际后端　还没有存储完成呢。
//server={{ process:自定制；  这段代码参考：  ...node_modules/filepond/dist/filepond.esm.js:1863
//FilePond只是个中间件上传的接口，要配套 后端的实际存储＋服务器，文档https://pqina.nl/filepond/docs/patterns/api/server/
//解决Ajax跨域问题： 必须找目的地的服务器端，设置服务器端 Access-Control-Allow-Origin
//React开发中使用fetch进行异步请求  https://blog.51cto.com/zhuxianzhong/2125523?utm_source=oschina-app
//改造,{{参数内嵌}}?没法用use-http钩子模式的fetch()做上传文件　http://use-http.com/#/　   https://github.com/alex-cory/use-http
//fetch脱离了XHR=是ES6新属原生js,没有传统ajax的abort,还在草案之中;  https://www.jianshu.com/p/7c55f930d363   https://www.cnblogs.com/damowangM/p/10135903.html
