import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Modal, Button, Radio, Row, Col } from 'antd';
import G from '@/global';
import styles from './PersonRole.less';
import RoleShow from '@/components/RoleShow';

const RadioGroup = Radio.Group;

export default class PersonRole extends Component {

  okHandle() {
    const { role, dispatch } = this.props;
    dispatch({
      type: 'ManagementPerson/changeRole',
      payload: {
        role,
        callback: this.call.bind(this)
      }
    });
  }

  call() {
    const { closeRole } = this.props;
    closeRole(1);
  }

  onChange = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ManagementPerson/saveRole',
      payload: e.target.value
    });
  }

  render() {
    const { visible, closeRole, user, role } = this.props;
    const sidebar = user.user.sidebar.data;
    const titleStyle = { xs: 6, sm: 6, md: 6, lg: 6, xl: 6, xxl: 6, style: { paddingLeft: '24px' } };
    if (!visible) return null;
    return (
      <Modal
        width={780}
        visible={true}
        title="设置角色"
        onOk={this.okHandle.bind(this)}
        onCancel={closeRole}
        footer={[
          <Button key="back" size='small' onClick={closeRole}>
            <FormattedMessage id="all.cancel" />
          </Button>,
          <Button key="submit" size='small' type="primary" onClick={this.okHandle.bind(this)}>
            <FormattedMessage id="all.certain" />
          </Button>
        ]}
      >
        <p className={styles.subTitle}>所有角色都可以登录到DShow客户端</p>
        <Row className={styles.rowBox}>
          <RadioGroup style={{ display: 'block' }} onChange={this.onChange} value={role}>
            <Col {...titleStyle}>功能</Col>
            <Col span={6} style={{ textAlign: 'center' }}>
              <Radio value={'manager'}>管理者</Radio>
            </Col>
            <Col span={6} style={{ textAlign: 'center' }}>
              <Radio value={'manager_space'}>空间管理员</Radio>
            </Col>
            <Col span={6} style={{ textAlign: 'center' }}>
              <Radio value={'default'}>普通成员</Radio>
            </Col>
          </RadioGroup>
        </Row>
        <div className={styles.roleBox}>
          <div className={styles.roleLeft}>
            <RoleShow data={sidebar} />
          </div>
          <div className={styles.roleRight}>默认角色</div>
        </div>
      </Modal>
    );
  }
}
