import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Row, Col, Button } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './../index.less'


export default class SendSuccess extends Component {

  // 去登录
  goLogin() {
    const { dispatch } = this.props;
    dispatch({
      type: 'RetrievePassword/emailSave',
      payload: {
        email: "",
        page: 0
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
    return (
      <div className={styles.successBox}>
        <div className={styles.successContent}>
          <div className={styles.successText}>
            <h3>邮箱发送成功</h3>
            <p>我们已向您的注册邮箱xxxxxx@123.com发送了一封密码找回邮件，请注意查收。</p>
            <Row>
              <Col style={{ textAlign: 'center', margin: '35px 0' }}>
                <Button style={{ width: '112' }} type="primary" size='small' onClick={this.goLogin.bind(this)}>去登录</Button>
              </Col>
            </Row>
            <p className={styles.emailNone}>没有收到邮箱？<span onClick={this.sendAgain.bind(this)}>重新发送</span></p>
          </div>
        </div>
        <p className={styles.conntectUs}>
          如有任何问题，可以与我们联系，我们将尽快为你解答。
          <span>Email:_________</span>
          <span>电话:_________</span>
        </p>
      </div>
    );
  }
}
