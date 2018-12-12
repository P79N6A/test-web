import React, { Component } from 'react';
import { Menu, Dropdown, Icon, Spin } from 'antd';
import { connect } from 'dva';

import styles from '../index.less';
import { Area, IntervalChart } from '@/components/Charts';

const menuData = {
  Hour: [{ status: 'Yesterday' }, { status: '7 Days' }, { status: '30 Days' }, { status: 'Year' }],
  Week: [{ status: 'Last 4 Weeks' }, { status: 'Year' }],
};

@connect(({ globalStatus }) => ({
  globalStatus,
}))
class UsingHour extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'Hour',
      status: menuData.Hour[0].status,
    };
    this.hourMenu = (
      <Menu>
        {menuData.Hour.map(value => (
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
    this.weekMenu = (
      <Menu>
        {menuData.Week.map(value => (
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

  setType(type) {
    this.setState({ type, status: menuData[type][0].status });
    this.fetch(type, menuData[type][0].status);
  }

  setMenuStatus(status) {
    this.setState({ status });
    this.fetch(this.state.type, status);
  }

  componentDidMount() {
    const { type, status } = this.state;
    this.fetch(type, status);
  }

  fetch(type, status) {
    const { dispatch } = this.props;
    dispatch({
      type: 'globalStatus/getUsingHour',
      payload: { type, status },
    });
  }

  render() {
    const { loading, globalStatus } = this.props;
    const { usingHour } = globalStatus;
    const { type, status } = this.state;
    return (
      <div className={styles.statisticsLeft}>
        <div className={styles.usingHourTitleView}>
          <font className={styles.usingHourTitle}>Using Hour</font>
          <div className={styles.tabView}>
            <div className={styles.tabHour} onClick={this.setType.bind(this, 'Hour')}>
              <font
                className={styles.tabText}
                style={{ color: type === 'Hour' ? '#35536C' : '#6D86A1' }}
              >
                Hour
              </font>
              <div
                className={styles.tabLine}
                style={{ backgroundColor: type === 'Hour' ? '#35536C' : 'white' }}
              />
            </div>
            <div className={styles.tabWeek} onClick={this.setType.bind(this, 'Week')}>
              <font
                className={styles.tabText}
                style={{ color: type === 'Week' ? '#35536C' : '#6D86A1' }}
              >
                Week
              </font>
              <div
                className={styles.tabLine}
                style={{ backgroundColor: type === 'Week' ? '#35536C' : 'white' }}
              />
            </div>
          </div>
          <div className={styles.dropdownView}>
            <div style={{ flex: 1 }} />
            <Dropdown overlay={type === 'Hour' ? this.hourMenu : this.weekMenu} trigger={['click']}>
              <a className="ant-dropdown-link" href="#">
                {status} <Icon type="down" />
              </a>
            </Dropdown>
          </div>
        </div>
        {type === 'Hour' ? <IntervalChart data={usingHour} /> : <Area data={usingHour} />}
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

export default UsingHour;
