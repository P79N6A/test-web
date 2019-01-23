// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';
import ModelChange from './components/ModelChange';
import styles from './ChangePassword.less';

export default class ChangePassword extends Component {
  render() {
    return (
      <div className={styles.main}>
        <ModelChange />
      </div>
    );
  }
}
