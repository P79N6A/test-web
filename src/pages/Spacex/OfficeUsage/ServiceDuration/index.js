// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';
import { Card, Icon } from 'antd';
import styles from './ServiceDuration.less';
import G from '@/global';
import ProgressLine from './ProgressLine';

class ServiceDuration extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { serviceDuration } = this.props;
    return (
      <Card bordered={false} bodyStyle={{ padding: '19px 24px 8px 24px' }}>
        <div>
          <p className={styles.deskDduration}>
            服务时长统计
            <Icon type="ellipsis" theme="outlined" className={styles.icon} />
          </p>
          <p className={styles.totalText}>总时长</p>
          <font className={styles.textnumber}>
            {parseInt(serviceDuration.total_duration / (24 * 60), 10)}
            <font className={styles.textStatus}>天</font>
            {G.moment.duration(serviceDuration.total_duration * 60 * 1000).hours()}
            <font className={styles.textStatus}>小时</font>
          </font>
          <ProgressLine
            percent={Number(
              ((serviceDuration.occupied_duration / serviceDuration.total_duration) * 100).toFixed(
                2
              )
            )}
            strokeColor="#FCB0B1"
            title="使用时长"
            day={parseInt(serviceDuration.occupied_duration / (24 * 60), 10)}
            hour={G.moment.duration(serviceDuration.occupied_duration * 60 * 1000).hours()}
          />
          <ProgressLine
            percent={Number(
              ((serviceDuration.vacant_duration / serviceDuration.total_duration) * 100).toFixed(2)
            )}
            strokeColor="#A6D6D0"
            title="空闲时长"
            day={parseInt(serviceDuration.vacant_duration / (24 * 60), 10)}
            hour={G.moment.duration(serviceDuration.vacant_duration * 60 * 1000).hours()}
          />
          <div style={{ height: 55 }} />
        </div>
        <br />
      </Card>
    );
  }
}

export default ServiceDuration;
