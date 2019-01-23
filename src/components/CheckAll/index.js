// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component, Fragment } from 'react';
import { Checkbox } from 'antd';
import { checkData } from "@/utils/utils";
import styles from './index.less'

const CheckboxGroup = Checkbox.Group;

export default class CheckAll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      id: props.id,
      // 一行的全部数据
      plainOptions: props.plainOptions,
      // 默认选中的数据
      checkedList: props.checkedList,
      indeterminate: true,
      checkAll: false,
    }
  }

  onChange = (checkedList) => {
    const { obPermission } = this.props;
    const { plainOptions, id } = this.state;
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkedList.length === plainOptions.length,
    });
    obPermission(id, checkedList, checkedList.length === plainOptions.length);
  }

  onCheckAllChange = (e) => {
    const { obPermission } = this.props;
    const { plainOptions, id } = this.state;
    const newPlainOptions = checkData(plainOptions);
    this.setState({
      checkedList: e.target.checked ? newPlainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
    obPermission(id, e.target.checked ? newPlainOptions : [], e.target.checked);
  }

  render() {
    const { plainOptions, checkedList, indeterminate, title, checkAll } = this.state;
    return (
      <div>
        {plainOptions && plainOptions.length > 0 ? (
          <div className={styles.box}>
            <Checkbox
              className={styles.checkbox}
              indeterminate={indeterminate}
              onChange={this.onCheckAllChange.bind(this)}
              checked={checkAll}
            >
              {title}
            </Checkbox>
            <CheckboxGroup options={plainOptions} value={checkedList} onChange={this.onChange.bind(this)} />
          </div>
        ) :
          ''}
      </div>
    );
  }
}