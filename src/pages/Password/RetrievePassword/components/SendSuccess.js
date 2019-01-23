// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';
import { FormattedMessage } from 'umi/locale';
import { Row, Col, Button } from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../index.less'


export default class SendSuccess extends Component {

  // 去登录
  goLogin() {
    const { dispatch } = this.props;
    dispatch({
      type: 'RetrievePassword/emailSave',
      payload: {
        email: "",
        page: 0,
      },
    });
    dispatch(routerRedux.push('/user/login'))
  }

  // 重新发送
  sendAgain() {
    const { RetrievePassword, sendEmails } = this.props;
    const { email } = RetrievePassword;
    sendEmails({ email });
  }

  render() {
    const { RetrievePassword } = this.props;
    return (
      <div className={styles.successBox}>
        <div className={styles.successContent}>
          <div className={styles.successText}>
            <h3><FormattedMessage id="reset.password.send-email-success" /></h3>
            <p>
              <FormattedMessage id="reset.password.send-email-message-one" />
              {RetrievePassword.email}
              <FormattedMessage id="reset.password.send-email-message-two" />
            </p>
            <Row>
              <Col style={{ textAlign: 'center', margin: '35px 0' }}>
                <Button style={{ width: '112' }} type="primary" size='small' onClick={this.goLogin.bind(this)}>
                  <FormattedMessage id="reset.password.go-login" />
                </Button>
              </Col>
            </Row>
            <p className={styles.emailNone}>
              <FormattedMessage id="reset.password.send-email-none" />
              <span onClick={this.sendAgain.bind(this)}>
                <FormattedMessage id="reset.password.send-again" />
              </span>
            </p>
          </div>
        </div>
        <p className={styles.conntectUs}>
          <FormattedMessage id="reset.password.connect-us" />
          <span>Email:_________</span>
          <span>
            <FormattedMessage id="reset.password.phone" />
            :_________
          </span>
        </p>
      </div>
    );
  }
}
