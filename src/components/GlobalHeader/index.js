// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import RightContent from './RightContent';

export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  render() {
    const { collapsed, isMobile, logo, currentUser, slideMenuShow } = this.props;
    return (
      <div className={styles.header}>
        {isMobile ? (
          <Link to="/home" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>
        ) : slideMenuShow ? (
          <div className={styles.logoPc} id="logo">
            <Link to="/home">
              <img src={logo} alt="logo" />
            </Link>
          </div>
        ) : (<Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />)}
        <RightContent {...this.props} currentUser={currentUser} />
      </div>
    );
  }
}
