import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './SpaceState.less';
import SpaceSvg from './components/SpaceSvg';
import SpaceTotal from './components/SpaceTotal';

@connect(({ spaceState, getDeskState, loading }) => ({
  spaceState,
  getDeskState,
  loading: loading.effects['spaceState/getSvg'],
}))
export default class SpaceState extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offlineCount: 0,
      vacantCount: 0,
      occupiedCount: 0,
    };
    this.setCount = this.setCount.bind(this);
  }

  setCount(data) {
    this.setState(data);
  }

  render() {
    const { offlineCount, vacantCount, occupiedCount } = this.state;
    const { spaceState, dispatch } = this.props
    return (
      <div className={styles.container}>
        <SpaceTotal dispatch={dispatch} data={{ offlineCount, vacantCount, occupiedCount }} />
        <SpaceSvg dispatch={dispatch} spaceState={spaceState} setCount={this.setCount} />
      </div>
    );
  }
}
