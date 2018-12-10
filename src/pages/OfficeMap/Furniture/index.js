import React, { Component } from 'react';

import Header from './Header';
import Pesk from './Pesk';
import styles from './Furniture.less';

class Furniture extends Component {
  render() {
    const { href } = window.location;
    const number = href.substr(href.indexOf('demo')).split('-');
    return (
      <div className={styles.main}>
        <Header />
        <Pesk number={parseInt(number[0].substr(4), 10)} shouldRotate={number[1]} />
        <font className={styles.text}>9AM Standing Desk and Smart Workspace Solution</font>
      </div>
    );
  }
}

export default Furniture;
