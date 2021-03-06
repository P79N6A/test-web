// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage, getLocale } from 'umi/locale';
import { connect } from 'dva';
import { Row, Col, Table, Button, Input, Icon, Pagination, Tooltip, Select, Popover } from 'antd';
import GroupModal from './components/GroupModal';
import PersonModal from '@/pages/Management/Person/components/PersonModal';
import PersonTemplate from '@/pages/Management/Person/components/PersonTemplate';
import G from '@/global';
import styles from './index.less';

const Option = Select.Option;

@connect(({ PersonGroup, ManagementPerson, loading }) => ({
  PersonGroup,
  ManagementPerson,
  loading: loading.effects['PersonGroup/fetch'],
}))
class PersonGroup extends Component {
  state = {
    query: '',
    groupActive: '',
    visible: false,
    modalLoading: false,
    groupVisible: false,
    importTemplate: false,
  };

  componentDidMount() {
    this.getGroupList();
    this.fetchDataList();
  }

  // 输入框发生改变时
  onChangeSearchInfo = e => {
    this.setState({ query: e.target.value });
  };

  // 搜索
  onSearch() {
    this.getGroupList();
    this.fetchDataList();
  }

  // 获取用户组列表
  getGroupList() {
    const { dispatch } = this.props;
    const { query } = this.state;
    dispatch({
      type: 'PersonGroup/usersGroupList',
      payload: {
        query,
      },
    })
  }

  // 定义表格
  getColumns(current, groupActive) {
    const columns = [
      {
        title: formatMessage({ id: 'all.serial.number' }),
        key: 'uid',
        width: 70,
        render: (text, record, index) => (
          <Fragment>
            <font>{(current - 1) * 15 + index + 1}</font>
          </Fragment>
        ),
      },
      {
        title: formatMessage({ id: 'device.list.user' }),
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
        title: formatMessage({ id: 'person.list.phone' }),
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
        title: formatMessage({ id: 'app.settings.basic.email' }),
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
        title: formatMessage({ id: 'person.role' }),
        render: (text, record, index) => (
          <Fragment>
            <Select defaultValue={text.role} style={{ width: 120 }} onChange={this.handleChange.bind(this, text, record, index, groupActive)}>
              <Option value="companyAdmin"><FormattedMessage id="person.group.super.admin" /></Option>
              {
                groupActive === '' || groupActive === 'Default' ? ''
                  :
                  (<Option value="groupAdmin"><FormattedMessage id="person.group.group.admin" /></Option>)
              }
              <Option value="user"><FormattedMessage id="person.group.default.member" /></Option>
            </Select>
          </Fragment>
        ),
      },
    ];
    return columns;
  }

  // 清空输入框
  emitEmpty = () => {
    this.groupInput.focus();
    this.setState({ query: '' });
  };

  // 鼠标按下时
  handelKeydown = e => {
    if (e.keyCode === 13) {
      this.onSearch();
    }
  };

  // 改变页数
  pageChange = current => {
    this.fetchDataList({ current });
  };

  // 添加人员
  handleOk = (fieldsValue, avatar, uid) => {
    const fieldsValues = fieldsValue;
    delete fieldsValues.isDel;
    this.setState({ modalLoading: true });
    delete fieldsValues.upload;
    this.addPerson({ ...fieldsValues, avatar, callback: this.upload.bind(this) });
  };

  upload = res => {
    const { groupActive } = this.state;
    if (res.status === 'success') {
      this.setState({ modalLoading: false, visible: false });
      this.fetchDataList({ groupId: groupActive });
    } else {
      this.setState({ modalLoading: false });
    }
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  // 弹窗
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  addPerson(data) {
    const { dispatch } = this.props;
    dispatch({
      type: 'ManagementPerson/addPerson',
      payload: data,
    });
  }

  // 获取人员列表
  fetchDataList(value) {
    const { dispatch, PersonGroup } = this.props;
    const { query } = this.state;
    const { limit, current } = PersonGroup.data;
    dispatch({
      type: 'PersonGroup/fetch',
      payload: {
        limit: (value && value.limit) || limit,
        offset: (value && (value.current - 1) * 15) || (current - 1) * 15,
        groupId: (value && value.groupId),
        query,
      },
    });
  }

  // 改变角色
  handleChange(text, record, index, groupActive, value) {
    const { dispatch } = this.props;
    if (!text.email) return null;
    dispatch({
      type: 'PersonGroup/changeRole',
      payload: {
        role: value,
        uid: text.uid,
        groupId: groupActive,
        oldRole: text.role,
        lang: getLocale(),
      },
    });
  }

  // 选中组
  changeGroup(id) {
    this.setState({
      groupActive: id,
    });
    this.fetchDataList({ groupId: id });
  }

  // 打开添加组的弹窗
  openGroupModel() {
    this.setState({
      groupVisible: true,
    })
  }

  // 关闭添加组弹窗
  closeGroupModel(num) {
    this.setState({
      groupVisible: false,
    });
    if (num) {
      this.getGroupList();
    }
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

  // 删除用户组
  delGroup() {
    const { dispatch } = this.props;
    const { groupActive } = this.state;
    dispatch({
      type: 'PersonGroup/usersGroupUpdate',
      payload: {
        isDel: true,
        groupId: groupActive,
        callback: this.back.bind(this),
      },
    })
  }

  back(res) {
    this.getGroupList();
  }

  render() {
    const { query, groupActive, visible, modalLoading, groupVisible, importTemplate } = this.state;
    const suffix = query ? <Icon type="close-circle" onClick={this.emitEmpty.bind(this)} /> : null;
    const { PersonGroup, dispatch, loading, ManagementPerson } = this.props;
    const { limit, count, current, rows } = PersonGroup.data;
    const { groupList } = PersonGroup;
    const columns = this.getColumns(current, groupActive);
    const content = (
      <div>
        <font className={styles.delGroup} onClick={this.delGroup.bind(this)}><FormattedMessage id="person.group.del" /></font>
      </div>
    );
    return (
      <div className={styles.main}>
        <h3><FormattedMessage id="person.group.management" /></h3>
        <br />
        <Row gutter={24} className={styles.box}>
          {/* 用户组 */}
          <Col span={7} className={styles.boxs}>
            <div className={styles.bg_white}>
              <Input
                className={styles.search}
                value={query}
                placeholder={formatMessage({ id: 'person.group.search.placeholder' })}
                prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                suffix={suffix}
                ref={node => {
                  this.groupInput = node;
                }}
                onChange={this.onChangeSearchInfo.bind(this)}
                onKeyUp={this.handelKeydown.bind(this)}
              />
              <Button size="small" className={styles.btn} onClick={this.openGroupModel.bind(this)}><FormattedMessage id="person.group.create" /></Button>
              <ul className={styles.groupBox}>
                {
                  groupList && groupList.length > 0
                    ?
                    groupList.map((item, index) => {
                      return index === 0 ? <p key={item.id} onClick={this.changeGroup.bind(this, item.id)} className={[styles.title, groupActive === item.id && styles.bg_green].join(' ')}>{item.id.indexOf('Default') !== -1 ? formatMessage({ id: 'person.group.Ungrouped-members' }) : item.name}</p> : ''
                    })
                    :
                    ''
                }
                <p onClick={this.changeGroup.bind(this, '')} className={[styles.title, groupActive === '' && styles.bg_green].join(' ')}>
                  <Icon type="caret-down" className={styles.icon} />
                  <FormattedMessage id="person.group.all.member" />
                </p>
                {
                  groupList && groupList.length > 0
                    ?
                    groupList.map((item, index) => {
                      return index > 0 ? <li key={item.id} onClick={this.changeGroup.bind(this, item.id)} className={[styles.subTitle, groupActive === item.id && styles.bg_green].join(' ')}>{item.name}</li> : ''
                    })
                    :
                    ''
                }
              </ul>
            </div>
          </Col>
          {/* 用户列表 */}
          <Col span={17} className={styles.boxs}>
            <div className={styles.rightList}>
              <div className={styles.titleBox}>
                <h3><FormattedMessage id="person.group.all.member" /></h3>
                <p className={styles.del}>
                  <Popover content={content}>
                    <Icon type="ellipsis" className={styles.deleteIcon} />
                  </Popover>
                </p>
                <Button type="default" size="small" className={styles.addBtn} onClick={this.importUser.bind(this)}>
                  <FormattedMessage id="person.group.import.member" />
                </Button>
                <Button icon="plus" type="primary" size="small" className={styles.addBtn} onClick={this.showModal}>
                  <FormattedMessage id="person.group.add.member" />
                </Button>
              </div>
              <div className={styles.userList}>
                <Table
                  rowKey="uid"
                  loading={loading}
                  dataSource={rows}
                  columns={columns}
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
              </div>
            </div>
          </Col>
        </Row>
        {/* 添加用户组弹窗 */}
        <GroupModal
          dispatch={dispatch}
          visible={groupVisible}
          closeGroupModel={this.closeGroupModel.bind(this)}
        />
        {/* 添加以及编辑模板 */}
        <PersonModal
          dispatch={dispatch}
          visible={visible}
          loading={modalLoading}
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
          groupActive={groupActive}
        />
      </div>
    );
  }
}

export default PersonGroup;