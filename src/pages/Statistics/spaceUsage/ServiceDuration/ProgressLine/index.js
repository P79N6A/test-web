import React, { Component } from 'react';
import { FormattedMessage } from 'umi/locale';
import { Progress } from 'antd';
import styles from './ProgressLine.less';

class ProgressLine extends Component {
  render() {
    const { percent, strokeColor, title, day, hour } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.rowView}>
          <div className={styles.redcircle} style={{ borderColor: strokeColor }} />
          <font className={styles.useDuration}>{title}</font>
          <div style={{ flex: 1 }} />
          <font className={styles.textnumber}>
            {day}
            <font className={styles.textStatus}><FormattedMessage id="home.day" /></font>
            {hour}
            <font className={styles.textStatus}><FormattedMessage id="home.hour" /></font>
          </font>
        </div>
        <Progress
          percent={percent}
          status="active"
          strokeColor={strokeColor}
          strokeWidth={6}
          style={{ marginTop: 20 }}
        />
      </div>
    );
  }
}

export default ProgressLine;
