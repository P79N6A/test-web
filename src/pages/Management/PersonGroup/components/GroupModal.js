import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Modal, Button, Input, message } from 'antd';
import styles from './GroupModal.less';

export default class GroupModal extends Component {
  state = {
    groupName: '',
  }

  changeGroupInfo = e => {
    this.setState({ groupName: e.target.value });
  };

  okHandle() {
    const { groupName } = this.state;
    const { dispatch } = this.props;
    if (groupName.length <= 0) {
      message.error(formatMessage({ id: 'person.group.add.group.name' }));
      return;
    }
    if (groupName.length > 20) {
      message.error(formatMessage({ id: 'person.group.add.group.check.message' }));
      return;
    }
    dispatch({
      type: 'PersonGroup/addUsersGroup',
      payload: {
        groupName,
        callback: this.handelBack.bind(this),
      },
    })
  }

  handelBack(res) {
    const { closeGroupModel } = this.props;
    this.setState({ groupName: '' });
    closeGroupModel(true);
  }

  // 关闭弹窗
  closeGroup() {
    const { closeGroupModel } = this.props;
    this.setState({ groupName: '' });
    closeGroupModel();
  }

  render() {
    const { visible } = this.props;
    const { groupName } = this.state;
    if (!visible) return null;
    return (
      <Modal
        visible={visible}
        title={formatMessage({ id: 'person.group.create' })}
        onOk={this.okHandle.bind(this)}
        onCancel={this.closeGroup.bind(this)}
        footer={[
          <Button key="back" size="small" onClick={this.closeGroup.bind(this)}>
            <FormattedMessage id="all.cancel" />
          </Button>,
          <Button key="submit" size="small" type="primary" onClick={this.okHandle.bind(this)}>
            <FormattedMessage id="all.save" />
          </Button>,
        ]}
      >
        <Input
          value={groupName}
          onChange={this.changeGroupInfo.bind(this)}
          className={styles.group}
          placeholder={formatMessage({ id: 'person.group.add.group.placeholder' })}
        />
      </Modal>
    );
  }
}
