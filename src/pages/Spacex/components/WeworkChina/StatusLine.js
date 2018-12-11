import React, { Component } from 'react';
import styles from './index.less';

class StatusLine extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.status}>
        <div style={{ flex: 1 }} />
        <div className={styles.occupiedSquare} />
        <font className={styles.occupiedText}>Occupied</font>
        <div className={styles.vacantSquare} />
        <font className={styles.vacantText}>Vacant</font>
        <div className={styles.offlineSquare} />
        <font className={styles.offlineText}>Offline</font>
      </div>
    );
  }
}

export default StatusLine;
