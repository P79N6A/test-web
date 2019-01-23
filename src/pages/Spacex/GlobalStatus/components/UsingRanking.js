// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';
import { Menu, Dropdown, Icon, Spin } from 'antd';
import { LineBar, MiniLine } from '@/components/Charts';
import { connect } from 'dva';
import styles from '../index.less';

@connect(({ globalStatus, loading }) => ({
  globalStatus,
  loading: loading.effects['globalStatus/getUsingRanking'],
}))
class UsingRanking extends Component {
  constructor(props) {
    super(props);
    const menuData = [{ status: 'Last 4 Weeks' }, { status: 'Year' }];
    this.state = {
      status: menuData[0].status,
    };
    this.menu = (
      <Menu>
        {menuData.map(value => (
          <Menu.Item>
            <a
              target="_blank"
              rel="noopener noreferrer"
              onClick={this.setMenuStatus.bind(this, value.status)}
            >
              {value.status}
            </a>
          </Menu.Item>
        ))}
      </Menu>
    );
  }

  setMenuStatus(status) {
    this.setState({ status });
    this.fetch(status);
  }

  componentDidMount() {
    const { status } = this.state;
    this.fetch(status);
  }

  fetch(status) {
    const { dispatch } = this.props;
    dispatch({
      type: 'globalStatus/getUsingRanking',
      payload: { status },
    });
  }

  render() {
    const { loading, globalStatus } = this.props;
    const { usingRanking } = globalStatus;
    const { status } = this.state;
    return (
      <div className={styles.statisticsRight}>
        <div className={styles.usingHourTitleView}>
          <font className={styles.usingHourTitle}>Top</font>
          <div className={styles.tabView} />
          <div className={styles.dropdownView}>
            <div style={{ flex: 1 }} />
            <Dropdown overlay={this.menu} trigger={['click']}>
              <a className="ant-dropdown-link" href="#">
                {status} <Icon type="down" />
              </a>
            </Dropdown>
          </div>
        </div>
        <div style={{ height: '5px' }} />
        <MiniLine height={180} data={usingRanking} color="#FCB0B1" />
        <Spin
          size="large"
          style={{
            display: loading ? 'block' : 'none',
            position: 'absolute',
            left: '50%',
            top: '50%',
          }}
        />
      </div>
    );
  }
}

export default UsingRanking;
