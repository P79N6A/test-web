import React, { Component } from 'react';
import { Menu, Dropdown, Icon } from 'antd';
import G from '@/global';
import styles from './index.less';

const menuData = ['3RD FLOOR', '5TH FLOOR', '6TH FLOOR'];
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
    this.menu = (
      <Menu>
        <Menu.Item key="0">
          <a onClick={this.setIndex.bind(this, 0)}>{menuData[0]}</a>
        </Menu.Item>
        <Menu.Item key="1">
          <a onClick={this.setIndex.bind(this, 1)}>{menuData[1]}</a>
        </Menu.Item>
        <Menu.Item key="2">
          <a onClick={this.setIndex.bind(this, 2)}>{menuData[2]}</a>
        </Menu.Item>
      </Menu>
    );
  }

  setIndex(index) {
    this.props.setIndex(index);
  }

  render() {
    const { index } = this.props;
    return (
      <div className={styles.header}>
        <div>
          <Dropdown overlay={this.menu} trigger={['click']}>
            <a className={styles.floor}>
              {menuData[index]} <Icon type="down" />
            </a>
          </Dropdown>
          <div className={styles.floorLine} />
          <font className={styles.floorText}>CHINA OVERSEAS</font>
        </div>
        <div style={{ flex: 1 }} />
        <img
          src={`${G.picUrl}weworkX9am.png`}
          alt="weworkX9am"
          style={{ width: '255px' }}
        />
      </div>
    );
  }
}

export default Header;
