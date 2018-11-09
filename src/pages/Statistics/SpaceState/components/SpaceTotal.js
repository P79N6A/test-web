import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import styles from './../SpaceState.less';
import { Progress } from 'antd';
import Count from '@/components/Count';

export default class SpaceTotal extends Component {

  render() {
    const { data } = this.props;
    const { offlineCount, vacantCount, occupiedCount } = data;
    const total = vacantCount + offlineCount + occupiedCount;
    const onlineCount = vacantCount + occupiedCount;
    const scale = parseFloat(document.documentElement.style.fontSize) / 10;
    return (
      <div className={styles.svgLeft}>
        <div className={styles.top}>
          <p className={styles.sizeTwo + " " + styles.nowText}><FormattedMessage id="spaceState.real.time.statistics" /></p>
          <div className={styles.useCountView}>
            <div className={styles.line} />
            <font className={styles.useCountDes + " " + styles.sizeOne}><FormattedMessage id="spaceState.used.workstations" /></font>
          </div>
          <p className={styles.useCount + " " + styles.sizeFour}>{occupiedCount}</p>
          <div className={styles.rowView}>
            <Count className={styles.sizeOne} title={formatMessage({ id: 'spaceState.total.workstations' })} lineColor="#9AA9B5" count={total} />
            <div className={styles.lineView} />
            <Count className={styles.sizeOne} title={formatMessage({ id: 'spaceState.free.workstations' })} lineColor="#A6D6D0" count={vacantCount} />
          </div>
        </div>
        {/* bottom */}
        <div className={styles.lineRow} />
        <div className={styles.bottom}>
          <font className={styles.sizeTwo + " " + styles.useRate}><FormattedMessage id="home.inuse.rate" /></font>
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
            <font className={styles.sizeOne + " " + styles.useRateText}><FormattedMessage id="spaceState.rate.workstations" /></font>
            <div style={{ flex: 1 }} />
            <font className={styles.sizeThree + " " + styles.rateText}>
              {parseInt((occupiedCount / onlineCount) * 100, 10) || 0}%
              </font>
          </div>
        </div>
      </div>
    );
  }
}
