// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage, getLocale } from 'umi/locale';
import { connect } from 'dva';
import { Row, Col, Table, Button, Input, Divider, Pagination, Icon, Popconfirm, Tooltip, Modal, message } from 'antd';

import G from '@/global';
import styles from './Person.less';
import PersonModal from './components/PersonModal';
import PersonTemplate from './components/PersonTemplate';

@connect(({ ManagementPerson, loading }) => ({
  ManagementPerson,
  loading: loading.effects['ManagementPerson/fetch'],
}))
class Person extends Component {
  // 表单以及分页
  state = {
    query: '',
    filterParam: {},
    sortParam: {},
    modalLoading: false,
    visible: false,
    editValue: {},
    filterStatus: [
      { text: formatMessage({ id: 'person.list.status.disconnected' }), value: 1 },
      { text: formatMessage({ id: 'person.list.status.connected' }), value: 2 },
    ],
    importTemplate: false,
    roleVisible: false,
    uid: '',
    role: '',
    email: '',
  };

  componentDidMount() {
    const { ManagementPerson } = this.props;
    const { current } = ManagementPerson.data;
    this.fetchDataList({ current });
    this.getGroupList();
  }

  onSearch() {
    this.fetchDataList({ offset: 0 });
  }

  onEdit(text) {
    this.setState({
      visible: true,
      editValue: text,
    });
  }

  onDelete(text) {
    this.updatePerson({ uid: text.uid, isDel: true, callback: this.update.bind(this) });
  }

  onChangeSearchInfo = e => {
    this.setState({ query: e.target.value });
  };

  // 取消组管理员
  onCancel(text) {
    this.changeRole(text.uid, 'user', 'groupAdmin', '1');
  }

  // 获取用户组列表
  getGroupList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ManagementPerson/usersGroupList',
      payload: {},
    })
  }

  getColumns(current, filterStatus, listTitle) {
    const columns = [
      {
        title: listTitle.serialNumber,
        key: 'uid',
        width: 70,
        render: (text, record, index) => (
          <Fragment>
            <font>{(current - 1) * 15 + index + 1}</font>
          </Fragment>
        ),
      },
      {
        title: listTitle.name,
        key: 'name',
        render: (text) => {
          return (
            <Fragment>
              <Tooltip placement="topLeft" title={text.name}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <span className={styles.colSql}>{text.name}</span>
                  {
                    text.role === 'companyAdmin' ?
                      <img className={styles.titleTop} src={`${G.picUrl}image/super_admin.png`} />
                      :

                      text.role === 'groupAdmin' ?
                        <img className={styles.titleTop} src={`${G.picUrl}image/group_admin.png`} />
                        :
                        ''
                  }
                </div>
              </Tooltip>
            </Fragment>
          )
        },
      },
      {
        title: listTitle.phone,
        key: 'phone',
        render: (text) => {
          return (
            <Fragment>
              <Tooltip placement="topLeft" title={text.phone}>
                <span>{text.phone}</span>
              </Tooltip>
            </Fragment>
          )
        },
      },
      {
        title: listTitle.email,
        key: 'email',
        render: (text) => {
          return (
            <Fragment>
              <Tooltip placement="topLeft" title={text.email}>
                <span>{text.email}</span>
              </Tooltip>
            </Fragment>
          )
        },
      },
      {
        title: listTitle.position,
        key: 'position',
        render: (text) => {
          return (
            <Fragment>
              <Tooltip placement="topLeft" title={text.position}>
                <span>{text.position}</span>
              </Tooltip>
            </Fragment>
          )
        },
      },
      {
        title: listTitle.status,
        key: 'status',
        filters: filterStatus,
        filterMultiple: false,
        render: (text, record, index) => {
          return (
            text.resource ? (
              <Fragment>
                <Tooltip placement="topLeft" title={text.resource.serialNumber}>
                  <font>{text.resource.serialNumber}</font>
                </Tooltip>
              </Fragment>
            ) :
              (
                <Fragment>
                  <Tooltip placement="topLeft" title={filterStatus[0].text}>
                    <font>{filterStatus[0].text}</font>
                  </Tooltip>
                </Fragment>
              )
          );
        },
      },
      {
        title: listTitle.remarks,
        key: 'remark',
        render: (text) => {
          return (
            <Fragment>
              <Tooltip placement="topLeft" title={text.remark}>
                <span>{text.remark}</span>
              </Tooltip>
            </Fragment>
          )
        },
      },
      {
        title: listTitle.operate,
        width: 210,
        render: (text, record, index) => (
          <Fragment>
            <a
              onClick={() => {
                this.onEdit(text, record, index);
              }}
            >
              {listTitle.edit}
            </a>
            <Divider type="vertical" />
            <Popconfirm
              placement="left"
              title={formatMessage({ id: 'person.list.delete.tip' })}
              onConfirm={this.onDelete.bind(this, text)}
              okText={formatMessage({ id: 'all.certain' })}
              cancelText={formatMessage({ id: 'all.cancel' })}
            >
              <a>{listTitle.delete}</a>
            </Popconfirm>
            <Divider type="vertical" />
            {
              // 超级管理员禁用
              text.role === 'companyAdmin' ? <a className={styles.disabledColor}><FormattedMessage id="person.list.set.group.management" /></a> :
                text.role === 'groupAdmin'
                  ? (
                    <Popconfirm
                      placement="left"
                      title={formatMessage({ id: 'person.list.cancel.group.management.tip' })}
                      onConfirm={this.onCancel.bind(this, text)}
                      okText={formatMessage({ id: 'all.certain' })}
                      cancelText={formatMessage({ id: 'all.cancel' })}
                    >
                      <a><FormattedMessage id="person.list.acncel.group.management" /></a>
                    </Popconfirm>
                  ) : (
                    <a
                      onClick={() => {
                        this.openRole(text, record, index);
                      }}
                    >
                      <FormattedMessage id="person.list.set.group.management" />

                    </a>
                  )}
          </Fragment>
        ),
      },
    ];
    return columns;
  }

  handelKeydown = e => {
    if (e.keyCode === 13) {
      this.onSearch();
    }
  };

  emitEmpty = () => {
    this.userNameInput.focus();
    this.setState({ query: '' });
  };

  // 弹窗
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = (fieldsValue, avatar, uid) => {
    const fieldsValues = fieldsValue;
    delete fieldsValues.isDel;
    this.setState({ modalLoading: true });
    delete fieldsValues.upload;
    const { editValue } = this.state;
    if (G._.isEmpty(editValue)) {
      this.addPerson({ ...fieldsValues, avatar, callback: this.upload.bind(this) });
      return;
    }
    fieldsValues.uid = uid;
    this.updatePerson({ ...fieldsValues, avatar, callback: this.update.bind(this) });
  };

  upload = res => {
    if (res.status === 'success') {
      this.setState({ modalLoading: false, visible: false });
      this.fetchDataList();
      this.clearContent();
    } else {
      this.setState({ modalLoading: false });
    }
  };

  update = res => {
    if (res.status === 'success') {
      this.setState({ modalLoading: false, visible: false, editValue: {} });
      this.fetchDataList();
      this.clearContent();
    } else {
      this.setState({ modalLoading: false });
    }
  };

  handleCancel = () => {
    this.setState({ visible: false, editValue: {} });
  };

  handleChange = (pagination, filters, sorter) => {
    let filterParam = {};
    if (!G._.isEmpty(filters && filters.status)) {
      filterParam = Number(filters.status[0]);
    }
    this.setState({
      filterParam,
    });
    this.fetchDataList({ filterParam });
  };

  pageChange = current => {
    this.fetchDataList({ current });
  };

  // 清除子组件编辑框内容
  clearContent() {
    this.refs.personModel.setFieldsValue({
      name: '',
      phone: '',
      email: '',
      position: '',
      remark: '',
      groupId: '',
    });
  }

  fetchDataList(value) {
    const { dispatch, ManagementPerson } = this.props;
    const personData = ManagementPerson.data;
    const { query, filterParam, sortParam } = this.state;
    dispatch({
      type: 'ManagementPerson/fetch',
      payload: {
        limit: (value && value.limit) || personData.limit,
        offset: (value && (value.current - 1) * 15),
        query: (value && value.query) || query,
        userStatus: (value && value.filterParam) || filterParam,
        sortParam: (value && value.sortParam) || sortParam,
      },
    });
  }

  addPerson(data) {
    const { dispatch } = this.props;
    dispatch({
      type: 'ManagementPerson/addPerson',
      payload: data,
    });
  }

  updatePerson(data) {
    const { dispatch } = this.props;
    dispatch({
      type: 'ManagementPerson/updatePerson',
      payload: data,
    });
  }

  // 批量导入
  importUser() {
    this.setState({
      importTemplate: true,
    })
  }

  // 批量导入关闭弹窗
  closeTemplate() {
    this.setState({
      importTemplate: false,
    });
    const { ManagementPerson } = this.props;
    const { current } = ManagementPerson.data;
    this.fetchDataList({ current });
  }

  // 打开权限弹窗
  openRole(text, record, index) {
    this.setState({
      roleVisible: true,
      uid: text.uid,
      email: text.email,
      role: 'groupAdmin',
    });
  }

  // 关闭权限弹窗
  closeRole() {
    this.setState({
      roleVisible: false,
      uid: '',
      email: '',
      role: '',
    });
  }

  // 设置管理员
  okHandle() {
    const { uid, role, email } = this.state;
    this.changeRole(uid, role, 'user', email);
  }

  changeRole(uid, role, oldRole, email) {
    const { dispatch } = this.props;
    const lang = getLocale();
    if (!email) {
      message.error(formatMessage({ id: 'person.role.add-email' }))
      return null;
    }
    dispatch({
      type: 'ManagementPerson/changeRole',
      payload: {
        role,
        uid,
        oldRole,
        lang,
        email,
        callback: this.call.bind(this),
      },
    });
  }

  // 取消（设置）管理员的回调函数
  call(res) {
    this.closeRole();
    const { ManagementPerson } = this.props;
    const { current } = ManagementPerson.data;
    this.fetchDataList({ current });
  }

  render() {
    const { ManagementPerson, loading, dispatch } = this.props;
    const { modalLoading, visible, editValue, query, filterStatus, importTemplate, roleVisible } = this.state;
    const { limit, count, current } = ManagementPerson.data;
    const { groupList } = ManagementPerson;
    const listTitle = {
      serialNumber: formatMessage({ id: 'all.serial.number' }),
      name: formatMessage({ id: 'person.list.name' }),
      phone: formatMessage({ id: 'person.list.phone' }),
      email: formatMessage({ id: 'app.settings.basic.email' }),
      position: formatMessage({ id: 'person.list.position' }),
      status: formatMessage({ id: 'person.list.use.status' }),
      remarks: formatMessage({ id: 'all.remarks' }),
      operate: formatMessage({ id: 'all.operating' }),
      edit: formatMessage({ id: 'all.edit' }),
      delete: formatMessage({ id: 'all.delete' }),
    }
    const columns = this.getColumns(current, filterStatus, listTitle);
    const suffix = query ? <Icon type="close-circle" onClick={this.emitEmpty.bind(this)} /> : null;
    return (
      <div className={styles.main}>
        <h3><FormattedMessage id="menu.management.person" /></h3>
        <br />
        <Row className={styles.lageBox}>
          <Col span={10}>
            <Button icon="plus" type="primary" size='small' onClick={this.showModal} style={{ marginRight: '20px' }}>
              <FormattedMessage id="all.add" />
            </Button>
            <Button type="default" size='small' onClick={this.importUser.bind(this)}><FormattedMessage id="person.import.batch" /></Button>
          </Col>
          <Col span={14}>
            <Button
              className={styles.rights}
              size='small'
              icon="search"
              type="primary"
              onClick={this.onSearch.bind(this)}
            >
              <FormattedMessage id="all.search" />
            </Button>
            <Input
              value={query}
              className={styles.widthInput}
              placeholder={formatMessage({ id: 'person.list.search.text' })}
              suffix={suffix}
              ref={node => {
                this.userNameInput = node;
              }}
              onChange={this.onChangeSearchInfo.bind(this)}
              onKeyUp={this.handelKeydown.bind(this)}
            />
          </Col>
          <br />
        </Row>
        <Row className={styles.lageBox}>
          {/* 表单 */}
          <Col span={24}>
            <Table
              rowKey="uid"
              loading={loading}
              dataSource={ManagementPerson.data.rows}
              columns={columns}
              onChange={this.handleChange.bind(this)}
              pagination={false}
            />
            <Pagination
              style={{ marginTop: 20, float: 'right' }}
              current={current}
              showQuickJumper
              total={count}
              pageSize={limit}
              onChange={this.pageChange.bind(this)}
            />
          </Col>
        </Row>
        {/* 添加以及编辑模板 */}
        <PersonModal
          ref="personModel"
          dispatch={dispatch}
          visible={visible}
          loading={modalLoading}
          editValue={editValue}
          groupList={groupList}
          handleOk={this.handleOk.bind(this)}
          handleCancel={this.handleCancel.bind(this)}
        />
        {/* 导入模板 */}
        <PersonTemplate
          visible={importTemplate}
          closeTemplate={this.closeTemplate.bind(this)}
          errorList={ManagementPerson.errorList}
          dispatch={dispatch}
        />
        {/* 设置为管理员 */}
        <Modal
          visible={roleVisible}
          title={formatMessage({ id: 'person.role.set-group-manager' })}
          onOk={this.okHandle.bind(this)}
          onCancel={this.closeRole.bind(this)}
          footer={[
            <Button key="back" size="small" onClick={this.closeRole.bind(this)}>
              <FormattedMessage id="all.cancel" />
            </Button>,
            <Button key="submit" size="small" type="primary" onClick={this.okHandle.bind(this)}>
              <FormattedMessage id="all.certain" />
            </Button>,
          ]}
        >
          <p><FormattedMessage id="person.role.set-group-manager-permission" /></p>
          <p className={styles.openPermission}><FormattedMessage id="person.role.group-manager-open-permission" /></p>
          <p className={styles.firstPage}><FormattedMessage id="person.role.group-manager-home" /></p>
          <p className={styles.firstPage}><FormattedMessage id="person.role.group-manager-notice" /></p>
          <p className={styles.firstPage}><FormattedMessage id="person.role.group-manager-device" /></p>
          <p className={styles.firstPage}><FormattedMessage id="person.role.group-manager-person" /></p>
        </Modal>
      </div>
    );
  }
}

export default Person;