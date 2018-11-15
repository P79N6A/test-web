import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Icon } from 'antd';
import { ChartCard } from '@/components/Charts';

import styles from './index.less';

class DeskCount extends Component {

  render() {
    const { daskTotalCount } = this.props;
    return (
      <ChartCard
        bordered={false}
        title={formatMessage({ id: "spaceState.total.workstations" })}
        subtitle={formatMessage({ id: "spaceUsage.one" })}
        action={
          <Icon
            type="ellipsis"
            theme="outlined"
            style={{
              fontSize: '30px',
              color: 'RGBA(53, 83, 108, 0.2)',
              transform: 'rotate(90deg)',
              opacity: 0
            }}
          />
        }
        total={daskTotalCount.total_count}
        contentHeight={60}
      >
        <font style={{ marginRight: 50 }}>
          <FormattedMessage id="spaceUsage.online" />
          <span className={styles.trendText}>{daskTotalCount.online_count}</span>
        </font>
        <font>
          <FormattedMessage id="device.offline" />
          <span className={styles.trendText}>{daskTotalCount.offline_count}</span>
        </font>
      </ChartCard>
    );
  }
}

export default DeskCount;
