import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Icon } from 'antd';
import { ChartCard } from '@/components/Charts';

import styles from './index.less';

class YunuseCount extends Component {

  render() {
    const { yesterdayUseCount } = this.props;
    return (
      <ChartCard
        bordered={false}
        title={formatMessage({ id: "spaceUsage.yesterday.unuse" })}
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
        total={yesterdayUseCount.unuseCount}
        contentHeight={60}
      >
        <font style={{ marginRight: 50 }}>
          <FormattedMessage id="spaceUsage.week.rate" />
          <span
            className={
              yesterdayUseCount.unuseWeekState === 'up'
                ? styles.trendTextUp
                : styles.trendTextDown
            }
          >
            <Icon
              type={yesterdayUseCount.unuseWeekState === 'up' ? 'arrow-up' : 'arrow-down'}
              theme="outlined"
            />
            {yesterdayUseCount.unuseWeekRate}%
          </span>
        </font>
        <font>
          <FormattedMessage id="spaceUsage.day.rate" />
          <span
            className={
              yesterdayUseCount.unuseDayState === 'up'
                ? styles.trendTextUp
                : styles.trendTextDown
            }
          >
            <Icon
              type={yesterdayUseCount.unuseDayState === 'up' ? 'arrow-up' : 'arrow-down'}
              theme="outlined"
            />
            {yesterdayUseCount.unuseDayRate}%
          </span>
        </font>
      </ChartCard>
    );
  }
}

export default YunuseCount;
