import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Modal, Button, Input, message } from 'antd';
import G from '@/global';
import styles from './GroupModal.less';

export default class GroupModal extends Component {
  state = {
    group: ''
  }

  okHandle() {
    const { group } = this.state;
    const { dispatch, closeGroupModel } = this.props;
    if (group.length <= 0) {
      message.error('请填写用户组名称');
      return;
    }
    if (group.length > 20) {
      message.error('用户组名字长度不能超过20字符');
      return;
    }
    dispatch({
      type: 'PersonGroup/addUsersGroup',
      payload: {
        group,
        callback: this.handelBack.bind(this)
      }
    })
  }

  handelBack(res) {
    const { closeGroupModel } = this.props;
    this.setState({ group: '' });
    closeGroupModel(true);
  }

  changeGroupInfo = e => {
    this.setState({ group: e.target.value });
  };

  render() {
    const { closeGroupModel, visible } = this.props;
    const { group } = this.state;
    if (!visible) return null;
    return (
      <Modal
        visible={visible}
        title="创建用户组"
        onOk={this.okHandle.bind(this)}
        onCancel={closeGroupModel}
        footer={[
          <Button key="back" size="small" onClick={closeGroupModel}>
            <FormattedMessage id="all.cancel" />
          </Button>,
          <Button key="submit" size="small" type="primary" onClick={this.okHandle.bind(this)}>
            <FormattedMessage id="all.save" />
          </Button>
        ]}
      >
        <Input
          value={group}
          onChange={this.changeGroupInfo.bind(this)}
          className={styles.group}
          placeholder="请输入用户组名称"
        />
      </Modal>
    );
  }
}
