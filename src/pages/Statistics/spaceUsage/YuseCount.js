import React, { Component } from 'react';
import { Icon } from 'antd';
import { ChartCard } from '@/components/Charts';

import styles from './index.less';

class YuseCount extends Component {

  render() {
    const { yesterdayUseCount } = this.props;
    return (
      <ChartCard
        bordered={false}
        title="昨日使用数"
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
        total={yesterdayUseCount.useCount}
        contentHeight={60}
      >
        <font style={{ marginRight: 50 }}>
          周同比
          <span
            className={
              yesterdayUseCount.useWeekState === 'up'
                ? styles.trendTextUp
                : styles.trendTextDown
            }
          >
            <Icon
              type={yesterdayUseCount.useWeekState === 'up' ? 'arrow-up' : 'arrow-down'}
              theme="outlined"
            />
            {yesterdayUseCount.useWeekRate}%
          </span>
        </font>
        <font>
          日环比
          <span
            className={
              yesterdayUseCount.useDayState === 'up' ? styles.trendTextUp : styles.trendTextDown
            }
          >
            <Icon
              type={yesterdayUseCount.useDayState === 'up' ? 'arrow-up' : 'arrow-down'}
              theme="outlined"
            />
            {yesterdayUseCount.useDayRate}%
          </span>
        </font>
      </ChartCard>
    );
  }
}

export default YuseCount;
