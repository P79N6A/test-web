import React, { Component } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import { getLocale } from 'umi/locale';
import LeftHeader from '@/components/SpaceHeader/LeftHeader';
import Footer from '@/layouts/Footer';
import SendEmail from './components/SendEmail';
import SendSuccess from './components/SendSuccess';
import styles from './index.less';
import G from '@/global';

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
        lang: getLocale(),
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
      message.error(G.errorLists[res.code][`message_${getLocale()}`])
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
