import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Tabs } from 'antd';
import Gateway from '@/pages/Setting/Gateway';
import VirtualGateway from '@/pages/Setting/VirtualGateway';
import AdminSensor from '@/pages/Setting/AdminSensor';
import styles from './index.less';

const TabPane = Tabs.TabPane;
export default class All extends Component {
  state = {
    key: "gateway",
    id: ""
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
      id
    })
  }

  render() {
    const { key, id } = this.state;
    return (
      <div className={styles.main}>
        <h3>网关管理</h3>
        <Tabs activeKey={key} onChange={this.callback.bind(this)}>
          <TabPane tab="物理网关" key="gateway">{key === 'gateway' ? <Gateway saveGatewayParams={this.saveGatewayParams.bind(this)} /> : ''}</TabPane>
          <TabPane tab="虚拟网关" key="virtual_gateway">{key === 'virtual_gateway' ? <VirtualGateway id={id} /> : ''}</TabPane>
          <TabPane tab="传感器" key="admin_sensor">{key === 'admin_sensor' ? <AdminSensor /> : ''}</TabPane>
        </Tabs>
      </div>
    );
  }
}
