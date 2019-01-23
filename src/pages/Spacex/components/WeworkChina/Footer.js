// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';
import G from '@/global';
import styles from './index.less';

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.footer}>
        <font className={styles.poweredBy}>Powered by</font>
        <img src={`${G.picUrl}image/logoGreen.png`} alt="logo" style={{ height: '20px' }} />
      </div>
    );
  }
}

export default Footer;
