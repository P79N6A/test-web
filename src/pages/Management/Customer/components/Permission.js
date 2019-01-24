// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Modal, Button, Form } from 'antd';
import styles from './Permission.less';
import SelectRole from '@/components/SelectRole';

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
        services: addPermission,
        callback: this.onCancel.bind(this, 1),
      },
    })
  };

  // 获取自组件的回调函数
  obPermission(type, value, choose) {
    const { permissionList, dispatch } = this.props;
    let result = [];
    if (type === 'parent') {
      result = permissionList.map((item) => {
        if (value === item.serviceId) {
          item.choose = choose;
          const { children } = item;
          if (children.length > 0) {
            for (let i = 0; i < children.length; i++) {
              children[i].choose = choose;
            }
          }
        }
        return item
      });
    } else {
      result = permissionList.map((item) => {
        const { children } = item;
        if (children.length > 0) {
          let num = 0;
          for (let i = 0; i < children.length; i++) {
            // 给点击的更改 choose
            if (children[i].serviceId === value) {
              children[i].choose = choose;
            }
            // 判断父级的 choose
            if (children[i].choose) {
              num++;
            }
          }
          // 更改父级的 choose
          num === 0 ? item.choose = false : item.choose = true;
        }
        return item
      });
    }
    dispatch({
      type: 'ManagementCustomer/savePermissionsList',
      payload: result,
    })
  }

  render() {
    const { loading } = this.state;
    const { visible, permissionList, addPermission } = this.props;
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
          permissionList.length > 0 ? (
            <SelectRole
              data={permissionList}
              result={addPermission}
              obPermission={this.obPermission.bind(this)}
            />
          ) :
            <FormattedMessage id="spaceUsage.none" />
        }
      </Modal>
    );
  }
}

export default Form.create()(Permission);
