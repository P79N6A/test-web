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

  render() {
    const { closeGroupModel, visible } = this.props;
    const { groupName } = this.state;
    if (!visible) return null;
    return (
      <Modal
        visible={visible}
        title={formatMessage({ id: 'person.group.create' })}
        onOk={this.okHandle.bind(this)}
        onCancel={closeGroupModel}
        footer={[
          <Button key="back" size="small" onClick={closeGroupModel}>
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
