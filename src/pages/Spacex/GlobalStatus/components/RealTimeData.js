import React, { Component } from 'react';
import { Progress } from 'antd';
import styles from '../index.less';

class RealTimeData extends Component {
  render() {
    const { color, title, count } = this.props;
    if (title === 'Usage') {
      return (
        <div className={styles.realTimeView}>
          <div className={styles.realTimeContainer}>
            <font className={styles.realTimeTitle}>{title}</font>
            <div className={styles.realTimeUsageView}>
              <font className={styles.realTimeUsageText}>{count}%</font>
              <Progress percent={count} showInfo={false} strokeColor={color} strokeWidth={2} />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className={styles.realTimeView}>
        <div className={styles.realTimeContainer}>
          <div className={styles.circle} style={{ backgroundColor: color }} />
          <font className={styles.realTimeTitle}>{title}</font>
          <font
            className={styles.realTimeCount}
            style={{ fontSize: title === 'Occupied' ? '36px' : '20px' }}
          >
            {count}
          </font>
        </div>
      </div>
    );
  }
}

export default RealTimeData;
