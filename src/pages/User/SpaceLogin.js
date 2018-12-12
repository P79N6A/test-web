import React, { Component } from 'react';
import { connect } from 'dva';
import { Alert } from 'antd';
import Login from '@/components/Login';
import styles from './SpaceLogin.less';

const { UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: '',
  };

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    const { dispatch } = this.props;
    if (!err) {
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
          redirect: values.userName === '9amGlobal' ? '/spacex/global-status' : '/spacex',
        },
      });
    }
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          <div>
            <br />
            <UserName name="userName" placeholder="账户" />
            <Password name="password" placeholder="密码" />
          </div>
          <Submit loading={submitting} path="/spacex-user/login">登录</Submit>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
