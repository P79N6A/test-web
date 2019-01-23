// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Modal, Button, Form, Row, Col } from 'antd';
import styles from './Permission.less';
import CheckAll from '@/components/CheckAll';
import { checkPermissionData } from '@/utils/utils';

class Permission extends Component {
  state = {
    loading: false,
  };

  onCancel(res) {
    const { closeModel } = this.props;
    closeModel(res);
  }

  okHandle = () => {
    const { addPermission, companyId, dispatch } = this.props;
    dispatch({
      type: 'ManagementCustomer/setPermissions',
      payload: {
        companyId,
        addPermission,
        callback: this.onCancel.bind(this, 1),
      },
    })
  };

  // 获取自组件的回调函数
  obPermission(id, list) {
    const { permissionList, addPermission, dispatch } = this.props;
    const data = addPermission;
    if (list && list.length > 0) {
      list.forEach((item) => {
        if (data.indexOf(item) < 0) {
          data.push(item);
        }
      })
    } else {
      const delData = [];
      permissionList.forEach((item) => {
        if (item.menu_id === id) {
          item.child && item.child.forEach((lItem) => {
            delData.push(lItem.menu_id);
          })
        }
      });
      delData && delData.forEach((bItem) => {
        if (data.indexOf(bItem) > -1) {
          data.splice(data.indexOf(bItem), 1);
        }
      })
    }
    dispatch({
      type: 'ManagementCustomer/saveAddPermissions',
      payload: {
        addPermission: data,
      },
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
