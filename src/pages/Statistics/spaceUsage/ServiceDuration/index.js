import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
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
            <FormattedMessage id="spaceUsage.server.time" />
            <Icon type="ellipsis" theme="outlined" className={styles.icon} />
          </p>
          <p className={styles.totalText}><FormattedMessage id="spaceUsage.all.time" /></p>
          <font className={styles.textnumber}>
            {parseInt(serviceDuration.total_duration / (24 * 60), 10)}
            <font className={styles.textStatus}><FormattedMessage id="home.day" /></font>
            {G.moment.duration(serviceDuration.total_duration * 60 * 1000).hours()}
            <font className={styles.textStatus}><FormattedMessage id="home.hour" /></font>
          </font>
          <ProgressLine
            percent={Number(
              ((serviceDuration.occupied_duration / serviceDuration.total_duration) * 100).toFixed(
                2
              )
            )}
            strokeColor="#FCB0B1"
            title={formatMessage({ id: 'spaceUsage.use.time' })}
            day={parseInt(serviceDuration.occupied_duration / (24 * 60), 10)}
            hour={G.moment.duration(serviceDuration.occupied_duration * 60 * 1000).hours()}
          />
          <ProgressLine
            percent={Number(
              ((serviceDuration.vacant_duration / serviceDuration.total_duration) * 100).toFixed(2)
            )}
            strokeColor="#A6D6D0"
            title={formatMessage({ id: 'spaceUsage.free.time' })}
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
