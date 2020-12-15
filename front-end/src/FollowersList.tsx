import * as React from "react";
import { useFollowerIngs } from "./hooks/useHelpers";
import {
  List,
  ListItem,
  Avatar,
  IconButton,
  Button,
  Popover,
  MenuList,
  MenuItem,
  Text,
  useToast,
  useTheme,
  IconMoreVertical,
  Skeleton
} from "customize-easy-ui-component";
import { useConfirmFollow, useKickoutFollower } from "./db";
import { useState } from "react";

export interface FollowersListProps {}

export const FollowersList: React.FunctionComponent<
  FollowersListProps
> = props => {
  const theme = useTheme();
  const toast = useToast();
  const { loading, userList:followers } = useFollowerIngs();

  const [displayConfirm, setDisplayConfirm] = useState(false);
  const {setOptions, userList:confirmOK, submitfunc:confirmFollow, } = useConfirmFollow();
  const [relation, setRelation] = React.useState(null);
  console.log("来看当前的relation=",relation );

  const { submitfunc:deleteRequestFollow } = useKickoutFollower(relation && relation.id);

  /* if (loading) {
    return <Spinner center css={{ marginTop: theme.spaces.lg }} />;
  } */

  if (!loading && (!followers || (followers && followers.length === 0))) {
    return (
      <Text
        muted
        css={{
          fontSize: theme.fontSizes[0],
          display: "block",
          margin: theme.spaces.lg
        }}
      >
        You currently have no followers. Users will appear here once they start
        following you.
      </Text>
    );
  }

  async function deleteRelation(relation) {
    try {
      await deleteRequestFollow();
    } catch (err) {
      console.error(err);
      toast({
        title: "An error occurred. Please try again.",
        subtitle: err.message,
        intent: "danger"
      });
    }
  }

  async function acceptRequest(relation) {
    try {
      setOptions({userId:relation.id } );
     　//若不加await 那么confirmFollow(); 将会不等待后端即刻返回。 加await会等待结果应答后继续。
      await confirmFollow();
     /*   toast({
        title: `Right on! ${relation.displayName ||
          relation.email} is now following you.`,
        subtitle: `服务端回报=${confirmOK}，保证服务端这时刻处理结束，但是confirmOK却不是服务端最新的！`,
        intent: "success"
       });　*/
      setDisplayConfirm(true);   　//触发显示信息；　本页面之内的简单的 reducer类似的。
    } catch (err) {
      console.error(err);
      toast({
        title: "An error occurred. Please try again.",
        subtitle: err.message,
        intent: "danger"
      });
    }
  }

  function onDisplayConfirm() {
    toast({
      title: `Right s now following you.`,
      subtitle: `服务端回报=${confirmOK}，保证服务端这时刻处理结束，而且confirmOK是服务端最新的！`,
      intent: "success"
    });
    //清除状态 　toast不是对话框，它只会显示一回？＝触发性质的，可以onClose: ()。
    setDisplayConfirm(false);
    //一次性显示提示信息的。 　假如是对话框OK的按钮，点击确认后onClose: () 状态改变，继续触发另外的功能。
  }
  console.log("服务confirmOK=" + JSON.stringify(confirmOK));
  displayConfirm && onDisplayConfirm();

  return (
    <List
      css={{
        overflowY: "scroll",
        height: "100%",
      }}
    >
      {loading && (
        <React.Fragment>
          <ListItem
            interactive={false}
            contentBefore={
              <Skeleton
                css={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%"
                }}
              />
            }
            primary={<Skeleton css={{ maxWidth: "200px" }} />}
          />
          <ListItem
            interactive={false}
            contentBefore={
              <Skeleton
                css={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%"
                }}
              />
            }
            primary={<Skeleton css={{ maxWidth: "200px" }} />}
          />
        </React.Fragment>
      )}
      {followers && followers.map(userB => {
        return (
          <ListItem
            key={userB.fromUser.id}
            interactive={false}
            contentBefore={
              <Avatar
                size="sm"
                src={userB.fromUser.photoURL}
                name={userB.fromUser.username || userB.fromUser.mobile}
              />
            }
            primary={userB.fromUser.username || userB.fromUser.mobile}
            contentAfter={
              userB.confirmed ? (
                <Popover
                  content={
                    <MenuList>
                      <MenuItem onPress={() => {
                          setRelation(userB.fromUser);
                          deleteRelation(userB.fromUser)
                        }
                      }>
                        踢出该 user对我的关注
                      </MenuItem>
                      <MenuItem onPress={() => {  }  }>一些功能</MenuItem>
                      <MenuItem onPress={() => {  }  }>一些功能</MenuItem>
                    </MenuList>
                  }
                >
                  <IconButton
                    onPress={e => e.stopPropagation()}
                    variant="ghost"
                    icon={<IconMoreVertical />}
                    label="Options"
                  />
                </Popover>
              ) : (
                <Button
                  onPress={() => acceptRequest(userB.fromUser)}
                  intent="primary"
                  size="sm"
                >
                   接受该 request关注
                </Button>
              )
            }
          />
        );
      })}
    </List>
  );
};
