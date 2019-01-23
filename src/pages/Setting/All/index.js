// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Tabs } from 'antd';
import Gateway from '@/pages/Setting/Gateway';
import AdminSensor from '@/pages/Setting/AdminSensor';
import styles from './index.less';

const TabPane = Tabs.TabPane;
export default class All extends Component {
  state = {
    key: 'gateway',
    id: '',
  }

  callback(key) {
    this.setState({
      key,
    })
  }

  // 获取物理网关传递的参数
  saveGatewayParams(key, id) {
    this.setState({
      key,
      id,
    })
  }

  render() {
    const { key, id } = this.state;
    return (
      <div className={styles.main}>
        <h3><FormattedMessage id="gateway.management" /></h3>
        <Tabs activeKey={key} onChange={this.callback.bind(this)}>
          <TabPane tab={formatMessage({ id: 'gateway.management.gateway' })} key="gateway">{key === 'gateway' ? <Gateway saveGatewayParams={this.saveGatewayParams.bind(this)} /> : ''}</TabPane>
          <TabPane tab={formatMessage({ id: 'menu.device.sensor' })} key="admin_sensor">{key === 'admin_sensor' ? <AdminSensor /> : ''}</TabPane>
        </Tabs>
      </div>
    );
  }
}
