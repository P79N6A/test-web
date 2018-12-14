import React, { Component } from 'react';
import { FormattedMessage } from 'umi/locale';
import styles from './../SpaceState.less';
import Urwork from "./svg/urwork";

export default class SpaceSvg extends Component {

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'spaceState/getSvg',
      payload: {
        callback: this.getSvgCall.bind(this)
      }
    });
  }

  // 获取svg之后的回调函数
  getSvgCall(res) {
    const { dispatch } = this.props;
    if (res.status === 'success') {
      // 首次调用以防延迟
      dispatch({
        type: 'spaceState/getDeskState',
        payload: {
          svgId: res.data.svgId
        },
      });
      this.deskState();
    }
  }

  // svg 实时状态展示
  deskState() {
    const { dispatch, spaceState } = this.props;
    const { svg } = spaceState;
    this.interval = setInterval(() => {
      dispatch({
        type: 'spaceState/getDeskState',
        payload: {
          svgId: svg.svgId
        },
      });
    }, 3000);
  }

  render() {
    const { spaceState, setCount, filter } = this.props;
    const { svg, data } = spaceState;
    return (
      <div className={styles.svgRight}>
        {svg.svgName && svg.svgName === 'urwork.svg' ?
          <Urwork data={data} svg={svg} setCount={setCount} filter={filter} />
          :
          <div className={styles.svgPic}>
            <FormattedMessage id="spaceUsage.none" />
          </div>
        }
      </div>
    );
  }
}
