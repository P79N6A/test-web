import React, { Component } from 'react';
import { connect } from 'dva';
import CustomerModal from '@/pages/Management/components/CustomerModal';
import styles from './Person.less';

@connect(({ ManagementCustomer }) => ({
  ManagementCustomer,
}))
export default class NewNotice extends Component {
  render() {
    const { dispatch, ManagementCustomer } = this.props;
    return (
      <div className={styles.main}>
        <CustomerModal dispatch={dispatch} copyValue={ManagementCustomer.copyValue} />
      </div>
    );
  }
}
