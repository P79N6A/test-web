import React, { Component } from 'react';
import styles from './Count.less';

class Count extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { title, lineColor, count } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.rowView}>
          <div className={styles.line} style={{ backgroundColor: lineColor }} />
          <font className={styles.useCountDes}>{title}</font>
        </div>
        <font className={styles.useCount}>{count}</font>
      </div>
    );
  }
}

export default Count;
