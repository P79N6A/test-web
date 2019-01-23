// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Icon } from 'antd';
import styles from './index.less';
import G from '@/global'

export default {
  UserName: {
    props: {
      size: 'large',
      prefix: <Icon type="user" className={styles.prefixIcon} />,
      placeholder: 'admin',
    },
    rules: [
      {
        required: true,
        message: formatMessage({ id: 'login.user.name' }),
      },
    ],
  },
  Password: {
    props: {
      size: 'large',
      prefix: <Icon type="lock" className={styles.prefixIcon} />,
      type: 'password',
      placeholder: '888888',
    },
    rules:
      [
        { required: true, message: formatMessage({ id: 'customer.operate.password-text' }) },
        {
          min: 8,
          message: formatMessage({ id: 'test.min.long.eight' }),
        },
        {
          max: 20,
          message: formatMessage({ id: 'test.max.long.twenty' }),
        },
        {
          pattern: G.passCheck,
          message: formatMessage({ id: 'customer.operate.password-message' }),
        },
      ]
  },
  Mobile: {
    props: {
      size: 'large',
      prefix: <Icon type="mobile" className={styles.prefixIcon} />,
      placeholder: 'mobile number',
    },
    rules: [
      {
        required: true,
        message: 'Please enter mobile number!',
      },
      {
        pattern: /^1\d{10}$/,
        message: 'Wrong mobile number format!',
      },
    ],
  },
  Captcha: {
    props: {
      size: 'large',
      prefix: <Icon type="mail" className={styles.prefixIcon} />,
      placeholder: 'captcha',
    },
    rules: [
      {
        required: true,
        message: 'Please enter Captcha!',
      },
    ],
  },
};
