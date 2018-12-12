import React, { Component } from 'react';
import { Progress, Spin } from 'antd';
import G from '@/global';
import { connect } from 'dva';
import YesterdayView from './YesterdayView';
import styles from '../index.less';

@connect(({ globalStatus, loading }) => ({
  globalStatus,
  loading: loading.effects['globalStatus/getServiceHour'],
}))
class ServiceView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'globalStatus/getServiceHour',
    });
    dispatch({
      type: 'globalStatus/getYesterdayData',
    });
  }

  render() {
    const { globalStatus, loading } = this.props;
    const { yesterdayData, serviceHour } = globalStatus;
    const { total, occupied, vacant } = serviceHour;
    const {
      occupiedCount,
      occupiedRise,
      occupiedDecline,
      vacantCount,
      vacantRise,
      vacantDecline,
    } = yesterdayData;

    let totalTitle = `${G.moment.duration(total, 's').hours()}Hr`;
    if (total >= 86400) {
      totalTitle = `${parseInt(total / 86400)}Day${totalTitle}`;
    }
    let occupiedTitle = `${G.moment.duration(occupied, 's').hours()}Hr`;
    if (occupied >= 86400) {
      occupiedTitle = `${parseInt(occupied / 86400)}Day${occupiedTitle}`;
    }
    let vacantTitle = `${G.moment.duration(vacant, 's').hours()}Hr`;
    if (vacant >= 86400) {
      vacantTitle = `${parseInt(vacant / 86400)}Day${vacantTitle}`;
    }

    return (
      <div className={styles.serviceHourContainer}>
        <div className={styles.serviceHourLeft}>
          <font className={styles.serviceHourText}>Total Service Hour</font>
          <div className={styles.serviceHourCircleView}>
            <div className={styles.serviceHourCircleContainer}>
              <Progress
                type="circle"
                percent={parseInt((occupied / total) * 100) || 0}
                format={() => (
                  <div className={styles.circleView}>
                    <font className={styles.totalText}>Total</font>
                    <font className={styles.totalText2}>{totalTitle}</font>
                  </div>
                )}
                width={106}
                strokeWidth={6}
              />
              <div className={styles.statisticsLine2} />
              <div className={styles.statisticsLine2} />
              <div className={styles.serviceHourCount}>
                <div className={styles.serviceHourCount2}>
                  <div className={styles.occupiedCircle} />
                  <font className={styles.occupiedTextSmall}>Occupied</font>
                </div>
                <div className={styles.occupiedCount2}>
                  <font className={styles.totalText3}>{occupiedTitle}</font>
                  <div style={{ flex: 1 }} />
                  <font className={styles.occupiedTextCount}>
                    {parseInt((occupied / total) * 100) || 0}%
                  </font>
                </div>
                <div className={styles.serviceHourCount2} style={{ marginTop: '25px' }}>
                  <div className={styles.occupiedCircle} style={{ backgroundColor: '#BDE4E1' }} />
                  <font className={styles.occupiedTextSmall}>Vacant</font>
                </div>
                <div className={styles.occupiedCount2}>
                  <font className={styles.totalText3}>{vacantTitle}</font>
                  <div style={{ flex: 1 }} />
                  <font className={styles.occupiedTextCount} style={{ color: '#BDE4E1' }}>
                    {100 - parseInt((occupied / total) * 100) || 0}%
                  </font>
                </div>
              </div>
            </div>
          </div>
          <Spin
            size="large"
            style={{
              display: loading ? 'block' : 'none',
              position: 'absolute',
              left: '50%',
              top: '50%',
            }}
          />
        </div>
        <div className={styles.statisticsLine2} />
        <div className={styles.serviceHourRight}>
          <font className={styles.serviceHourTitle}>Yesterday Data</font>
          <div style={{ height: '15px' }} />
          <Progress
            percent={parseInt((occupiedCount / (occupiedCount + vacantCount)) * 100) || 0}
            showInfo={false}
            strokeColor="#FCB0B1"
          />
          <div className={styles.yesterdayView}>
            <YesterdayView
              title="Yesterday Occupied"
              count={occupiedCount}
              weeklyRate={`${occupiedRise}%`}
              dailyRate={`${occupiedDecline}%`}
              color="#FCB0B1"
            />
            <div className={styles.yesterdayLine} />
            <YesterdayView
              title="Yesterday Vacant"
              count={vacantCount}
              weeklyRate={`${vacantRise}%`}
              dailyRate={`${vacantDecline}%`}
              color="#BDE4E1"
            />
          </div>
          <Spin
            size="large"
            style={{
              display: loading ? 'block' : 'none',
              position: 'absolute',
              left: '50%',
              top: '50%',
            }}
          />
        </div>
      </div>
    );
  }
}

export default ServiceView;
