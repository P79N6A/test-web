import React, { Component } from 'react';
import enLocal from 'moment/locale/en-au';
import Header from './components/Header';
import G from '@/global';
import styles from './index.less';
import Map from './Map';
import Statistics from './Statistics';

class GlobalStatus extends Component {
  componentWillMount() {
    G.moment.locale('en', enLocal);
  }

  render() {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.content}>
          <Map />
          <div className={styles.space} />
          <Statistics />
        </div>
      </div>
    );
  }
}

export default GlobalStatus;
