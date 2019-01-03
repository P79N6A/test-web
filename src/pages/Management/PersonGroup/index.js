import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
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
export default class PersonGroup extends Component {
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

  // 清空输入框
  emitEmpty = () => {
    this.groupInput.focus();
    this.setState({ query: '' });
  };

  // 输入框发生改变时
  onChangeSearchInfo = e => {
    this.setState({ query: e.target.value });
  };

  // 鼠标按下时
  handelKeydown = e => {
    if (e.keyCode === 13) {
      this.onSearch();
    }
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
      }
    })
  }

  // 选中组
  changeGroup(id) {
    this.setState({
      groupActive: id
    });
    this.fetchDataList({ groupId: id });
  }

  // 打开添加组的弹窗
  openGroupModel() {
    this.setState({
      groupVisible: true
    })
  }

  // 关闭添加组弹窗
  closeGroupModel(num) {
    this.setState({
      groupVisible: false
    });
    if (num) {
      this.getGroupList();
    }
  }

  // 定义表格
  getColumns(current) {
    const columns = [
      {
        title: '序号',
        key: 'uid',
        width: 70,
        render: (text, record, index) => (
          <Fragment>
            <font>{(current - 1) * 15 + index + 1}</font>
          </Fragment>
        ),
      },
      {
        title: '用户',
        key: 'name',
        render: (text) => {
          return (
            <Fragment>
              <Tooltip placement="topLeft" title={text.name}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <span className={styles.colSql}>{text.name}</span>
                  {
                    text.role === 'superAdmin' ?
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
        }
      },
      {
        title: '手机',
        key: 'phone',
        render: (text) => {
          return (
            <Fragment>
              <Tooltip placement="topLeft" title={text.phone}>
                <span>{text.phone}</span>
              </Tooltip>
            </Fragment>
          )
        }
      },
      {
        title: '邮箱',
        key: 'email',
        render: (text) => {
          return (
            <Fragment>
              <Tooltip placement="topLeft" title={text.email}>
                <span>{text.email}</span>
              </Tooltip>
            </Fragment>
          )
        }
      },
      {
        title: '角色',
        render: (text, record, index) => (
          <Fragment>
            <Select defaultValue={text.role} style={{ width: 120 }} onChange={this.handleChange.bind(this, text, record, index)}>
              <Option value="superAdmin">超级管理员</Option>
              <Option value="groupAdmin">组管理员</Option>
              <Option value="defaultMember">成员</Option>
            </Select>
          </Fragment>
        ),
      },
    ];
    return columns;
  }

  // 改变角色
  handleChange(text, record, index, value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'PersonGroup/changeRole',
      payload: {
        role: value,
        uid: text.uid,
      }
    });
  }
  // 改变页数
  pageChange = current => {
    this.fetchDataList({ current });
  };

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

  // 添加人员
  handleOk = (fieldsValue, avatar, uid) => {
    const fieldsValues = fieldsValue;
    delete fieldsValues.isDel;
    this.setState({ modalLoading: true });
    delete fieldsValues.upload;
    this.addPerson({ ...fieldsValues, avatar, callback: this.upload.bind(this) });
  };

  addPerson(data) {
    const { dispatch } = this.props;
    dispatch({
      type: 'ManagementPerson/addPerson',
      payload: data,
    });
  }

  upload = res => {
    if (res.status === 'success') {
      this.setState({ modalLoading: false, visible: false });
      this.fetchDataList();
    } else {
      this.setState({ modalLoading: false });
    }
  };

  handleCancel = () => {
    this.setState({ visible: false, editValue: {} });
  };

  // 弹窗
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  // 批量导入
  importUser() {
    this.setState({
      importTemplate: true
    })
  }

  // 批量导入关闭弹窗
  closeTemplate() {
    this.setState({
      importTemplate: false
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
        groupActive,
        callback: this.back.bind(this)
      }
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
    const columns = this.getColumns(current);
    const content = (
      <div>
        <font className={styles.delGroup} onClick={this.delGroup.bind(this)}>删除用户组</font>
      </div>
    );
    return (
      <div className={styles.main}>
        <h3>用户组管理</h3>
        <br />
        <Row gutter={24} className={styles.box}>
          {/* 用户组 */}
          <Col span={7} className={styles.boxs}>
            <div className={styles.bg_white}>
              <Input
                className={styles.search}
                value={query}
                placeholder="搜索用户组或成员"
                prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                suffix={suffix}
                ref={node => {
                  this.groupInput = node;
                }}
                onChange={this.onChangeSearchInfo.bind(this)}
                onKeyUp={this.handelKeydown.bind(this)}
              />
              <Button size="small" className={styles.btn} onClick={this.openGroupModel.bind(this)}>创建用户组</Button>
              <ul className={styles.groupBox}>
                <p onClick={this.changeGroup.bind(this, '')} className={[styles.title, groupActive === '' && styles.bg_green].join(' ')}><Icon type="caret-down" className={styles.icon} />所有成员</p>
                {
                  groupList && groupList.length > 0
                    ?
                    groupList.map((item, index) => {
                      return <li key={item.id} onClick={this.changeGroup.bind(this, item.id)} className={[styles.subTitle, groupActive === item.id && styles.bg_green].join(' ')}>{item.name}</li>
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
                <h3>所有成员</h3>
                <p className={styles.del}>
                  <Popover content={content}>
                    <Icon type="ellipsis" className={styles.deleteIcon} />
                  </Popover>
                </p>
                <Button type="default" size="small" className={styles.addBtn} onClick={this.importUser.bind(this)}>
                  导入成员
                </Button>
                <Button icon="plus" type="primary" size="small" className={styles.addBtn} onClick={this.showModal}>
                  添加成员
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
