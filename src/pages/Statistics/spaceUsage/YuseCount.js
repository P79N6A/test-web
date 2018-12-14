import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Icon } from 'antd';
import { ChartCard } from '@/components/Charts';

import styles from './index.less';

class YuseCount extends Component {

  render() {
    const { yesterdayUseCount } = this.props;
    return (
      <ChartCard
        bordered={false}
        title={formatMessage({ id: "spaceUsage.yesterday-use" })}
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
        total={yesterdayUseCount.useCount}
        contentHeight={60}
      >
        <font style={{ marginRight: 50 }}>
          <FormattedMessage id="spaceUsage.week-rate" />
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
          <FormattedMessage id="spaceUsage.day-rate" />
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
