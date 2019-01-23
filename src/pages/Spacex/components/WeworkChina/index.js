// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';
import styles from './index.less';
import Header from './Header';
import StatusLine from './StatusLine';
import Footer from './Footer';
import Map from './Map';

class WeworkChina extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
    this.setIndex = this.setIndex.bind(this);
  }

  setIndex(index) {
    this.setState({ index });
  }

  render() {
    const { index } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.container2}>
          <Header index={index} setIndex={this.setIndex} />
          <Map index={index} />
          <StatusLine />
          <Footer />
        </div>
      </div>
    );
  }
}

export default WeworkChina;
