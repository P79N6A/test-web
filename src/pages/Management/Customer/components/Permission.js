// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Modal, Button, Form, Row, Col } from 'antd';
import styles from './Permission.less';
import CheckAll from '@/components/CheckAll';
import { checkPermissionData, checkOperateData } from '@/utils/utils';
import G from '@/global';

class Permission extends Component {
  state = {
    loading: false,
    localData: [],
  };

  onCancel(res) {
    const { closeModel } = this.props;
    closeModel(res);
  }

  okHandle = () => {
    const { addPermission, companyId, dispatch } = this.props;
    const { localData } = this.state;
    dispatch({
      type: 'ManagementCustomer/setPermissions',
      payload: {
        companyId,
        services: G._.isEmpty(localData) ? addPermission : checkOperateData(localData, addPermission),
        callback: this.onCancel.bind(this, 1),
      },
    })
  };

  // 获取自组件的回调函数
  obPermission(id, list, checkAll) {
    const { localData } = this.state;
    const chooseData = localData;
    if (chooseData.length > 0) {
      chooseData.forEach((item, index) => {
        if (item.parent === id) {
          chooseData.splice(index, 1)
        }
      })
    }
    chooseData.push({ parent: id, children: list, checkAll });
    this.setState({
      localData: chooseData,
    })
  }

  render() {
    const { loading } = this.state;
    const { visible, permissionList } = this.props;
    const dataList = checkPermissionData(permissionList);
    if (!visible) return null;
    return (
      <Modal
        width={780}
        visible
        title={formatMessage({ id: "customer.permission.set-permission" })}
        onOk={this.okHandle}
        onCancel={this.onCancel.bind(this, 0)}
        footer={[
          <Button key="back" size='small' onClick={this.onCancel.bind(this, 0)}>
            <FormattedMessage id="all.cancel" />
          </Button>,
          <Button key="submit" size='small' type="primary" loading={loading} onClick={this.okHandle}>
            <FormattedMessage id="all.save" />
          </Button>,
        ]}
      >
        <p className={styles.subTitle}><FormattedMessage id="customer.permission.set-permission-message" /></p>
        {
          dataList && dataList.length > 0 ?
            dataList.map((item, index) => {
              return (
                <CheckAll
                  key={item.title}
                  obPermission={this.obPermission.bind(this)}
                  plainOptions={item.plainOptions}
                  checkedList={item.checkedList}
                  title={item.title}
                  id={item.id}
                />
              )
            })
            :
            <FormattedMessage id="spaceUsage.none" />
        }
      </Modal>
    );
  }
}

export default Form.create()(Permission);
