import React, { Component } from 'react';
import { connect } from 'dva';
import CustomerModal from './components/CustomerModal';
import styles from './NewCustomer.less';

@connect(({ ManagementCustomer }) => ({
  ManagementCustomer,
}))
export default class NewCustomer extends Component {
  render() {
    const { dispatch, ManagementCustomer } = this.props;
    return (
      <div className={styles.main}>
        <CustomerModal dispatch={dispatch} copyValue={ManagementCustomer.copyValue} />
      </div>
    );
  }
}