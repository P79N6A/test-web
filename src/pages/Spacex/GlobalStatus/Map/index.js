// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';
import styles from '../index.less';

import RealTimeData from '../components/RealTimeData';
import DefaultStatus from '../components/DefaultStatus';
import SvgMap from '../components/SvgMap';
import { globalSensor, demoSensor } from './config';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      globalOfflineCount: globalSensor.length + 2,
      globalVacantCount: 0,
      globalOccupiedCount: 0,
      demoOfflineCount: demoSensor.length,
      demoVacantCount: 0,
      demoOccupiedCount: 0,
    };
    this.setCount = this.setCount.bind(this);
  }

  setCount(data) {
    const { offlineCount, vacantCount, occupiedCount, type } = data;
    if (type === 'global') {
      this.setState({
        globalOfflineCount: offlineCount + 2,
        globalVacantCount: vacantCount,
        globalOccupiedCount: occupiedCount,
      });
    } else {
      this.setState({
        demoOfflineCount: offlineCount,
        demoVacantCount: vacantCount,
        demoOccupiedCount: occupiedCount,
      });
    }
  }

  render() {
    const {
      globalOfflineCount,
      globalVacantCount,
      globalOccupiedCount,
      demoOfflineCount,
      demoVacantCount,
      demoOccupiedCount,
    } = this.state;
    const offlineCount = globalOfflineCount + demoOfflineCount;
    const vacantCount = globalVacantCount + demoVacantCount;
    const occupiedCount = globalOccupiedCount + demoOccupiedCount;
    const total = offlineCount + vacantCount + occupiedCount;
    return (
      <div className={styles.mapContainer}>
        <font className={styles.title}>Real-time Data</font>
        <div className={styles.realData}>
          <RealTimeData color="#C2CBD3" title="Total" count={total} />
          <RealTimeData color="#A6D6D0" title="Vacant" count={vacantCount} />
          <RealTimeData color="#FCB0B1" title="Occupied" count={occupiedCount} />
          <RealTimeData
            color="#FCB0B1"
            title="Usage"
            count={parseInt((occupiedCount / total) * 100)}
          />
        </div>
        <div className={styles.line} />
        <SvgMap setCount={this.setCount} />
        <div className={styles.line} />
        <DefaultStatus />
      </div>
    );
  }
}

export default Map;
