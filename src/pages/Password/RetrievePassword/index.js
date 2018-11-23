import React, { Component } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import LeftHeader from '@/components/SpaceHeader/LeftHeader'
import Footer from '@/layouts/Footer'
import SendEmail from './components/SendEmail'
import SendSuccess from './components/SendSuccess'
import styles from './index.less'

@connect(({ RetrievePassword }) => ({
  RetrievePassword,
}))
export default class RetrievePassword extends Component {

  // 发送邮箱
  sendEmails(form) {
    const { dispatch } = this.props;
    // 添加
    dispatch({
      type: 'RetrievePassword/sendEmail',
      payload: {
        ...form,
        callback: this.release.bind(this),
      },
    });
  }

  // 发送之后的回调
  release(res) {
    const { dispatch } = this.props;
    if (res.status === 'success') {
      dispatch({
        type: 'RetrievePassword/emailSave',
        payload: {
          page: 1
        },
      });
    } else {
      message('发送失败，请刷新页面重试！')
    }
  }

  render() {
    const { dispatch, RetrievePassword } = this.props;
    const { page } = RetrievePassword;
    return (
      <div className={styles.box}>
        <LeftHeader />
        <div className={styles.content}>
          {
            page === 1
              ?
              <SendSuccess dispatch={dispatch} RetrievePassword={RetrievePassword} sendEmails={this.sendEmails.bind(this)} />
              :
              <SendEmail dispatch={dispatch} RetrievePassword={RetrievePassword} sendEmails={this.sendEmails.bind(this)} />
          }
        </div>
        <Footer />
      </div>
    );
  }
}
