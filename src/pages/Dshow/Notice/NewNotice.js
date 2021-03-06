// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';
import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import NewNoticeForm from './components/NewNoticeForm';
import styles from './NewNotice.less';

@connect(({ ManagementNotice, ManagementPerson }) => ({
  ManagementNotice,
  ManagementPerson,
}))
class NewNotice extends Component {
  render() {
    const { dispatch, ManagementNotice, ManagementPerson } = this.props;
    return (
      <div className={styles.main}>
        <h3><FormattedMessage id='menu.management.newNotice' /></h3>
        <br />
        <NewNoticeForm
          dispatch={dispatch}
          copyValue={ManagementNotice.copyValue}
          user={ManagementPerson.data.rows}
        />
      </div>
    );
  }
}

export default NewNotice;