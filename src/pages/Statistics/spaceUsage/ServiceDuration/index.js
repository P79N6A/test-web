// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Card, Icon } from 'antd';
import { Pie } from '@/components/Charts'
import styles from './ServiceDuration.less';
import G from '@/global';
import ProgressLine from './ProgressLine';
import { totalTime, serviceData } from '@/utils/utils';

class ServiceDuration extends Component {

  render() {
    const { serviceDuration, condition_type } = this.props;
    const salesPieData = serviceData(serviceDuration, condition_type);
    return (
      <Card bordered={false} bodyStyle={{ padding: '19px 24px 8px 24px' }}>
        <div>
          <p className={styles.deskDduration}>
            {/* 服务时长统计 */}
            <FormattedMessage id="spaceUsage.server-time" />
            <Icon type="ellipsis" theme="outlined" className={styles.icon} />
          </p>
          <Pie
            subTitle={formatMessage({ id: "spaceUsage.average-time" })}
            total={() => (
              <span
                dangerouslySetInnerHTML={{
                  __html: totalTime(serviceDuration.total_duration === 0 ? 0 : serviceDuration.average_duration),
                }}
              />
            )}
            data={salesPieData}
            height={200}
            color={['#FCB0B1', '#BDE4E1', '#CCCCCC']}
          />
          <p className={styles.totalText}><FormattedMessage id="spaceUsage.all-time" /></p>
          <p className={styles.totalTextContent}>
            {parseInt(serviceDuration.total_duration / (24 * 60), 10)}
            <font className={styles.textStatus}><FormattedMessage id="home.day" /></font>
            {G.moment.duration(serviceDuration.total_duration * 60 * 1000).hours()}
            <font className={styles.textStatus}><FormattedMessage id="home.hour" /></font>
          </p>
          {/* 使用时长 */}
          <div className={styles.useBox}>
            <p className={styles.useTitle}>
              <i />
              <FormattedMessage id="spaceUsage.use.time" />
            </p>
            <p className={styles.useTextContent}>
              {parseInt(serviceDuration.occupied_duration / (24 * 60), 10)}
              <font className={styles.textStatus}><FormattedMessage id="home.day" /></font>
              {G.moment.duration(serviceDuration.occupied_duration * 60 * 1000).hours()}
              <font className={styles.textStatus}><FormattedMessage id="home.hour" /></font>
              <font className={styles.percent}>
                {Number(((serviceDuration.occupied_duration / serviceDuration.total_duration === 0 ? 1 : serviceDuration.total_duration) * 100).toFixed(2))}
                <font className={styles.textStatus}>%</font>
              </font>
            </p>
          </div>
          {/* 空闲时长 */}
          <div className={styles.useBox}>
            <p className={styles.useTitle}>
              <i className={styles.green} />
              <FormattedMessage id="spaceUsage.use.time" />
            </p>
            <p className={styles.useTextContent}>
              {parseInt(serviceDuration.vacant_duration / (24 * 60), 10)}
              <font className={styles.textStatus}><FormattedMessage id="home.day" /></font>
              {G.moment.duration(serviceDuration.vacant_duration * 60 * 1000).hours()}
              <font className={styles.textStatus}><FormattedMessage id="home.hour" /></font>
              <font className={styles.percentGreen}>
                {Number(((serviceDuration.vacant_duration / serviceDuration.total_duration === 0 ? 1 : serviceDuration.total_duration) * 100).toFixed(2))}
                <font className={styles.textStatus}>%</font>
              </font>
            </p>
          </div>
        </div>
      </Card>
    );
  }
}

export default ServiceDuration;
