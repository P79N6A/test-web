import React, { Component } from 'react';
import { Icon } from 'antd';
import { ChartCard } from '@/components/Charts';
import G from '@/global';

import styles from './index.less';

class YpeakCount extends Component {

  render() {
    const { yesterdayUseCount } = this.props;
    return (
      <ChartCard
        bordered={false}
        title="昨日使用峰值"
        subtitle="（个）"
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
        total={yesterdayUseCount.peakCount}
        contentHeight={60}
      >
        <font style={{ marginRight: 50 }}>
          时间
          <span className={styles.trendText}>
            {G.moment(yesterdayUseCount.peakTime).format('MM月 DD日  hh:mm:ss')}
          </span>
        </font>
      </ChartCard>
    );
  }
}

export default YpeakCount;
