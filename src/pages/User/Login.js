// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import { Alert, message } from 'antd';
import Login from '@/components/Login';
import { routerRedux } from 'dva/router';
import G from '@/global';
import styles from './Login.less';

const { Tab, UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'login/getCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  getSidebar(res) {
    const { dispatch } = this.props;
    if (res.status === 'success') {
      dispatch({
        type: 'login/getSidebarList',
        payload: {
          token: res.data.token,
          callback: this.newRouter.bind(this),
        },
      })
    }
  }

  handleSubmit = (location, err, values) => {
    let role = 'user';
    if (location.pathname === '/admin_user/login') {
      role = 'admin';
    }
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          role,
          type,
          callback: this.getSidebar.bind(this),
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  retrievePassword = () => {
    this.props.dispatch(routerRedux.push('/external/RetrievePassword'))
  }

  newRouter(res) {
    if (res.status === 'success') {
      let path = '';
      if (G._.isEmpty(res.data)) {
        message.error(formatMessage({ id: 'login.set-permission' }));
        return;
      }
      if (res.data[0].children.length > 0) {
        path = res.data[0].children[0].path
      } else {
        path = res.data[0].path
      }
      this.props.dispatch(routerRedux.replace(path));
    }
  }

  render() {
    const { login, submitting, match, location } = this.props;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit.bind(this, location)}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab="">
            {login.status === 'error' &&
              login.type === 'account' &&
              !submitting &&
              this.renderMessage('账户或密码错误（admin/888888）')}
            <UserName name="userName" placeholder={formatMessage({ id: 'login.account' })} />
            <Password
              name="password"
              placeholder={formatMessage({ id: 'customer.operate.password' })}
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit.bind(this, location))}
            />
          </Tab>
          {
            location.pathname && location.pathname === '/user/login' ?
              <p className={styles.retrievePassword} onClick={this.retrievePassword.bind(this)}><FormattedMessage id="reset.password" /></p>
              :
              ''
          }
          <Submit loading={submitting} path={match.path}><FormattedMessage id='menu.user.login' /></Submit>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
