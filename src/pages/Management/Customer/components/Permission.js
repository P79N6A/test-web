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
        callback: this.onCancel.bind(this, 1)
      }
    })
  };

  // 获取自组件的回调函数
  obPermission(id, list) {
    const { permissionList, addPermission, dispatch } = this.props;
    let data = addPermission;
    if (list && list.length > 0) {
      list.map((item) => {
        if (data.indexOf(item) < 0) {
          data.push(item);
        }
      })
    } else {
      let delData = [];
      permissionList.map((item) => {
        if (item.menu_id === id) {
          item.child && item.child.map((lItem) => {
            delData.push(lItem.menu_id);
          })
        }
      });
      delData && delData.map((bItem) => {
        if (data.indexOf(bItem) > -1) {
          data.splice(data.indexOf(bItem), 1);
        }
      })
    }
    dispatch({
      type: 'ManagementCustomer/saveAddPermissions',
      payload: {
        addPermission: data,
      }
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
        visible={true}
        title="设置功能权限"
        onOk={this.okHandle}
        onCancel={this.onCancel.bind(this, 0)}
        footer={[
          <Button key="back" size='small' onClick={this.onCancel.bind(this, 0)}>
            取消
          </Button>,
          <Button key="submit" size='small' type="primary" loading={loading} onClick={this.okHandle}>
            保存
          </Button>
        ]}
      >
        <p className={styles.subTitle}>设置权限后，该客户将在Space管理后台开通对应的功能</p>
        {
          dataList && dataList.length > 0 ?
            dataList.map((item, index) => {
              return <CheckAll
                key={item.title + index}
                obPermission={this.obPermission.bind(this)}
                plainOptions={item.plainOptions}
                checkedList={item.checkedList}
                title={item.title}
                id={item.id} />
            })
            :
            '暂无数据'
        }
      </Modal>
    );
  }
}

export default Form.create()(Permission);