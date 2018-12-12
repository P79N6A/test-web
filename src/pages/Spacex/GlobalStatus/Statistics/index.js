import React, { Component } from 'react';
import styles from '../index.less';

import ServiceHour from '../components/ServiceHour';
import WorkStation from '../components/WorkStation';
import UsingHour from '../components/UsingHour';
import UsingRanking from '../components/UsingRanking';

class Statistics extends Component {
  componentWillMount() {}

  render() {
    return (
      <div className={styles.statisticsContainer}>
        <ServiceHour />
        <div className={styles.statisticsLine} />
        <WorkStation />
        <div className={styles.statisticsLine} />
        <div className={styles.bottomView}>
          <UsingHour />
          <div className={styles.statisticsLine2} />
          <UsingRanking />
        </div>
      </div>
    );
  }
}

export default Statistics;
