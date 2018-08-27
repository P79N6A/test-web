import React, { Component } from 'react';
import { connect } from 'dva';
import NewNoticeForm from './components/NewNoticeForm';
import styles from './Person.less';

@connect(({ manaNotice }) => ({
  manaNotice,
}))
export default class NewNotice extends Component {
  render() {
    const { dispatch, manaNotice } = this.props;
    return (
      <div className={styles.main}>
        <h3>新建通知</h3>
        <br />
        <NewNoticeForm dispatch={dispatch} copyValue={manaNotice.copyValue} />
      </div>
    );
  }
}
