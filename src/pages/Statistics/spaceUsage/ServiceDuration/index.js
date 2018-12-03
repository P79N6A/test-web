import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Card, Icon } from 'antd';
import { Pie, yuan } from '@/components/Charts'
import styles from './ServiceDuration.less';
import G from '@/global';
import ProgressLine from './ProgressLine';
import { totalTime, serviceData } from '@/utils/utils';

class ServiceDuration extends Component {

  render() {
    const { serviceDuration } = this.props;
    const salesPieData = serviceData(serviceDuration);
    return (
      <Card bordered={false} bodyStyle={{ padding: '19px 24px 8px 24px' }}>
        <div>
          <p className={styles.deskDduration}>
            <FormattedMessage id="spaceUsage.server.time" />
            <Icon type="ellipsis" theme="outlined" className={styles.icon} />
          </p>
          <Pie
            subTitle="总时长"
            total={() => (
              <span
                dangerouslySetInnerHTML={{
                  __html: totalTime(salesPieData)
                }}
              />
            )}
            data={salesPieData}
            height={180}
            color={['#FCB0B1', '#BDE4E1']}
          />
          <p className={styles.totalText}>平均时长</p>
          <p className={styles.totalTextContent}>8</p>
          <p className={styles.totalTextContentFont}>小时/工位/天</p>
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
