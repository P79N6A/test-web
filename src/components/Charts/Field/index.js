// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React from 'react';

import styles from './index.less';

const Field = ({ label, value, ...rest }) => (
  <div className={styles.field} {...rest}>
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

export default Field;
