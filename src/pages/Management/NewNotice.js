import React, { Component } from 'react';
import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import NewNoticeForm from './components/NewNoticeForm';
import styles from './NewNotice.less';

@connect(({ manaNotice, manaPerson }) => ({
  manaNotice,
  manaPerson,
}))
export default class NewNotice extends Component {
  render() {
    const { dispatch, manaNotice, manaPerson } = this.props;
    return (
      <div className={styles.main}>
        <h3><FormattedMessage id='menu.management.newNotice' /></h3>
        <br />
        <NewNoticeForm
          dispatch={dispatch}
          copyValue={manaNotice.copyValue}
          user={manaPerson.data.rows}
        />
      </div>
    );
  }
}
