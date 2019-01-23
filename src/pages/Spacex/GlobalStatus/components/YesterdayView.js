// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';
import G from '@/global';
import styles from '../index.less';

class YesterdayView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { title, count, weeklyRate, dailyRate, color } = this.props;
    return (
      <div className={styles.yesterdayLeft}>
        <div className={styles.yesterdayRow}>
          <div className={styles.occupiedCircle} style={{ backgroundColor: color }} />
          <font className={styles.yesterdayText}>{title}</font>
        </div>
        <font className={styles.yesterdayText2}>{count}</font>
        <div className={styles.weeklyView}>
          <div className={styles.weeklyLeft}>
            <font className={styles.weeklyText}>Weekly</font>
            <font className={styles.weeklyText}>Growth</font>
            <div className={styles.weeklyRateLeft}>
              <img
                src={`${G.picUrl}image/bottom.png`}
                style={{ width: '8px', height: '8px' }}
                alt="top"
              />
              <font className={styles.weeklyRateLeftText}>{weeklyRate}</font>
            </div>
          </div>
          <div className={styles.weeklyLeft}>
            <font className={styles.weeklyText}>Daily</font>
            <font className={styles.weeklyText}>Growth</font>
            <div className={styles.weeklyRateLeft}>
              <img
                src={`${G.picUrl}image/top.png`}
                style={{ width: '8px', height: '8px' }}
                alt="top"
              />
              <font className={styles.weeklyRateRightText}>{dailyRate}</font>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default YesterdayView;
