// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';
import styles from './index.less';

class Count extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { title, lineColor, count, className } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.rowView}>
          <div className={styles.line} style={{ backgroundColor: lineColor }} />
          <font className={`${styles.useCountDes} ${className}`}>{title}</font>
        </div>
        <font className={`${styles.useCount} ${className}`}>{count}</font>
      </div>
    );
  }
}

export default Count;
