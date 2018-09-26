import React, { Component } from 'react';
import { connect } from 'dva';
import ModelChange from './components/ModelChange';
import styles from './ChangePassword.less';

@connect(({ changePass }) => ({
  changePass,
}))
export default class ChangePassword extends Component {
  render() {
    const changePass = this.props;
    return (
      <div className={styles.main}>
        <ModelChange changePass={changePass} />
      </div>
    );
  }
}
