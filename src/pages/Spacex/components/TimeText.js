// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';
import G from '@/global';
import styles from '../SpaceStatus.less';

class TimeText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moment: G.moment(),
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({
        moment: G.moment(),
      });
    }, 1000);
  }

  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
  }

  render() {
    const { moment } = this.state;
    return <div className={styles.time}>{moment.format('MM月DD日 HH:mm:ss')}</div>;
  }
}

export default TimeText;
