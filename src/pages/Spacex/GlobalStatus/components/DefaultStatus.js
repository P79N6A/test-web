// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';
import styles from '../index.less';

class DefaultStatus extends Component {
  render() {
    return (
      <div className={styles.defaultContainer}>
        <font className={styles.defaultText}>9AM · DEMO</font>
        <div style={{ flex: 1 }} />
        <div className={styles.occupiedView} />
        <font className={styles.occupiedText}>Occupied</font>
        <div className={styles.vacantView} />
        <font className={styles.vacantText}>Vacant</font>
        <div className={styles.offlineView} />
        <font className={styles.offlineText}>Offline</font>
      </div>
    );
  }
}

export default DefaultStatus;
