/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import * as React from "react";
import Axios from "axios";
import InfiniteScroll from "react-intersection-observing-infinity-scroll";
export default　class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commits: [],
    };
  }
  componentDidMount() {
    this.fetchCommits();
  }
  render() {
    const { commits } = this.state;
    const commitList = commits.map(commit => {
      return (
          <div>{commit.commit.message}</div>
      );
    });
    return (
      <div   css={{
        overflowY: "scroll",
        height: "477px",
      }}>
     {commitList}
      </div>
    );
  }
  fetchCommits = async (page) => {
    this.setState(prevState => ({ ...prevState, isLoading: true }));
    const res = await Axios(
      "https://api.github.com/repos/pluto-net/scinapse-web-client/commits",
      {
        headers: {
          Accept: "application/vnd.github.v3+json"
        },
        params: {
          type: "all",
        }
      }
    );
    this.setState(prevState => ({
      ...prevState,
      commits: [...prevState.commits, ...res.data],
    }));
  };
}
