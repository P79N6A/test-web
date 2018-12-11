import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import PageActive from './components/PageActive';
import Urwork from './components/Urwork';
import Siemens from './components/Siemens';
import WeworkChina from './components/WeworkChina';
import styles from './SpaceStatus.less';

@connect(({ user }) => ({
  user,
}))
class SpaceStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offlineCount: 0,
      vacantCount: 0,
      occupiedCount: 0,
    };
    this.setCount = this.setCount.bind(this);
  }

  filterCompany(user) {
    const { username } = user;
    this.isSiemens = username && username.indexOf('siemens') > -1;
    this.isWeworkchina = username && username.indexOf('weworkchina') > -1;
  }

  setCount(data) {
    this.setState(data);
  }

  getPageMap() {
    if (this.isSiemens) return <Siemens setCount={this.setCount} />;
    if (this.isWeworkchina) return <WeworkChina />;
    return <Urwork setCount={this.setCount} />;
  }

  getPageActive() {
    if (this.isSiemens || this.isWeworkchina) return null;
    const { offlineCount, vacantCount, occupiedCount } = this.state;
    return <PageActive data={{ offlineCount, vacantCount, occupiedCount }} />;
  }

  render() {
    const { user } = this.props.user;
    this.filterCompany(user);
    return (
      <div className={this.isSiemens ? styles.containerAll : styles.container}>
        {this.getPageActive()}
        {this.getPageMap()}
      </div>
    );
  }
}

export default SpaceStatus;
