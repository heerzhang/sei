/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
//import firebase from "firebase/app";
import { Compose } from "./Compose";
import { useSession } from "./auth";
//import { useDocument } from "react-firebase-hooks/firestore";
import { useTheme, Text } from "customize-easy-ui-component";
import { useQuery } from "@apollo/react-hooks";
//import { gql } from "apollo-boost";
import gql from "graphql-tag";


const GET_POSTS = gql`
  query findRecipe($id: ID!) {
    findRecipe(id: $id) {
    id,title,author,image,ingredients,description,createdBy{
    id,username,
    }
     }
  }
`;

export interface RecipeProps {
  id: string;
}

//id 184213562 ;这个id是　云搜索algoliasearch内部生成的objectID:　竟然这样? http://localhost:3000/184213562 ？
export const Recipe: React.FunctionComponent<RecipeProps> = ({ id }) => {
  const theme = useTheme();
  const {user,} = useSession();
  var   value=null;
  console.log("Recipe页面id="+ JSON.stringify(id) );
  const { loading, error, data,  } = useQuery(GET_POSTS, {
    variables: { id },
    notifyOnNetworkStatusChange: true
  });
  //第一个render这里loading=true，要到第二次再执行到了这里才会有data数据!
  console.log("刚Recipe经过"+ JSON.stringify(data) +"进行中"+ JSON.stringify(loading));

  if(!loading){
    if(data){
      const { findRecipe:recipe } = data;
      if(recipe){
        value=recipe;
       //  authjs = JSON.parse(user);
        //setAuthj(authjs); 报错！//React limits the number of renders to prevent an infinite loop.
        console.log("以Recipe从后端获得=" + JSON.stringify(value));
      }
    }
  }
 /* const { value, loading, error } = useDocument(
    firebase
      .firestore()
      .collection("recipes")
      .doc(id)
  ); */

  if (loading) {
    return null;
  }

  if (!loading && !value) {
    return null;
  }

  if (error) {
    return (
      <Text
        muted
        css={{
          display: "block",
          padding: theme.spaces.lg,
          textAlign: "center"
        }}
      >
        Oh bummer! A loading error occurred. Please try reloading.
      </Text>
    );
  }

  //菜谱内容: 富文本编辑器内容defaultDescription={x.description}
  if (value) {
    return (
      <Compose
        readOnly={true}
        id={id}
        editable={true || value.createdBy.id === user.uid}
        defaultCredit={value.author}
        defaultDescription={value.description}
        defaultTitle={value.title}
        defaultIngredients={ JSON.parse( value.ingredients ) }
        defaultImage={value.image}
      />
    );
  }

  return null;
};

