// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';
import { Card, Progress } from 'antd';
import styles from '../SpaceStatus.less';
import Count from './Count';

export default class PageActive extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { data } = this.props;
    const { offlineCount, vacantCount, occupiedCount } = data;
    const total = vacantCount + offlineCount + occupiedCount;
    const onlineCount = vacantCount + occupiedCount;
    let scale = parseFloat(document.documentElement.style.fontSize) / 10;
    if (scale < 1) scale = 1;
    return (
      <div className={styles.svgLeft}>
        <div className={styles.top}>
          <p className={`${styles.sizeTwo} ${styles.nowText}`}>实时数据</p>
          <div className={styles.useCountView}>
            <div className={styles.line} />
            <font className={`${styles.useCountDes} ${styles.sizeOne}`}>使用工位数</font>
          </div>
          <p className={`${styles.useCount} ${styles.sizeFour}`}>{occupiedCount}</p>
          <div className={styles.rowView}>
            <Count className={styles.sizeOne} title="工位总数" lineColor="#9AA9B5" count={total} />
            <div className={styles.lineView} />
            <Count
              className={styles.sizeOne}
              title="空闲工位数"
              lineColor="#A6D6D0"
              count={vacantCount}
            />
          </div>
        </div>
        {/* bottom */}
        <div className={styles.lineRow} />
        <div className={styles.bottom}>
          <font className={`${styles.sizeTwo} ${styles.useRate}`}>使用率</font>
          <div className={styles.progress}>
            <Progress
              strokeLinecap="square"
              type="circle"
              percent={parseInt((occupiedCount / onlineCount) * 100, 10) || 0}
              width={100 * scale}
              strokeWidth={10 * scale}
              strokeColor="#FCB0B1"
              showInfo={false}
            />
          </div>
          <div className={styles.useRateView}>
            <div className={styles.redCircle} />
            <font className={`${styles.sizeOne} ${styles.useRateText}`}>工位使用率</font>
            <div style={{ flex: 1 }} />
            <font className={`${styles.sizeThree} ${styles.rateText}`}>
              {parseInt((occupiedCount / onlineCount) * 100, 10) || 0}%
            </font>
          </div>
        </div>
      </div>
    );
  }
}
