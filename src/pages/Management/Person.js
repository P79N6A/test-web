import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import { Row, Col, Table, Button, Input, Divider, Pagination, Icon, Popconfirm, Tooltip } from 'antd';

import G from '@/global';
import styles from './Person.less';
import PersonModal from './components/PersonModal';

@connect(({ ManagementPerson, user, loading }) => ({
  ManagementPerson,
  user,
  loading: loading.effects['ManagementPerson/fetch'],
}))
export default class Person extends Component {
  // 表单以及分页
  state = {
    query: '',
    filterParam: {},
    sortParam: {},
    modalLoading: false,
    visible: false,
    editValue: {},
    filterStatus: [
      { text: formatMessage({ id: 'person.status.unconnect' }), value: 1 },
      { text: formatMessage({ id: 'person.status.connected' }), value: 2 }
    ],
  };

  componentDidMount() {
    const { ManagementPerson } = this.props;
    const { current } = ManagementPerson.data;
    this.fetchDataList({ current });
  }

  onSearch() {
    this.fetchDataList({ offset: 0 });
  }

  onChangeSearchInfo = e => {
    this.setState({ query: e.target.value });
  };

  handelKeydown = e => {
    if (e.keyCode === 13) {
      this.onSearch();
    }
  };

  onEdit(text) {
    this.setState({
      visible: true,
      editValue: text,
    });
  }

  onDelete(text) {
    this.updatePerson({ uid: text.uid, isDel: true, callback: this.update.bind(this) });
  }

  getColumns(current, filterStatus, listTitle) {
    const columns = [
      {
        title: listTitle.serialNumber,
        key: 'uid',
        width: 100,
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
                <span>{text.name}</span>
              </Tooltip>
            </Fragment>
          )
        }
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
        }
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
        }
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
        }
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
            ) : (
                <Fragment>
                  <Tooltip placement="topLeft" title={filterStatus[text.status - 2].text}>
                    <font>{filterStatus[text.status - 2].text}</font>
                  </Tooltip>
                </Fragment>
              )
          );
        },
      },
      {
        title: listTitle.remarks,
        key: 'remark',
        width: 160,
        render: (text) => {
          return (
            <Fragment>
              <Tooltip placement="topLeft" title={text.remark}>
                <span>{text.remark}</span>
              </Tooltip>
            </Fragment>
          )
        }
      },
      {
        title: listTitle.operate,
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
              title={formatMessage({ id: 'person.delete.tip' })}
              onConfirm={this.onDelete.bind(this, text)}
              okText={formatMessage({ id: 'all.certain' })}
              cancelText={formatMessage({ id: 'all.cancel' })}
            >
              <a>{listTitle.delete}</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];
    return columns;
  }

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
    } else {
      this.setState({ modalLoading: false });
    }
  };

  update = res => {
    if (res.status === 'success') {
      this.setState({ modalLoading: false, visible: false, editValue: {} });
      this.fetchDataList();
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

  render() {
    const { ManagementPerson, user, loading, dispatch } = this.props;
    const { modalLoading, visible, editValue, query, filterStatus } = this.state;
    const { limit, count, current } = ManagementPerson.data;
    const listTitle = {
      serialNumber: formatMessage({ id: 'all.serial.number' }),
      name: formatMessage({ id: 'person.name' }),
      phone: formatMessage({ id: 'person.phone' }),
      email: formatMessage({ id: 'app.settings.basic.email' }),
      position: formatMessage({ id: 'person.position' }),
      status: formatMessage({ id: 'person.use.status' }),
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
          <p><FormattedMessage id="person.list" /></p>
          <Col span={12}>
            <Button icon="plus" type="primary" size='small' onClick={this.showModal}>
              <FormattedMessage id="all.add" />
            </Button>
          </Col>
          <Col span={12}>
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
              placeholder={formatMessage({ id: 'person.search.text' })}
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
        {/* 弹窗 */}
        <PersonModal
          dispatch={dispatch}
          user={user}
          visible={visible}
          loading={modalLoading}
          editValue={editValue}
          handleOk={this.handleOk.bind(this)}
          handleCancel={this.handleCancel.bind(this)}
        />
      </div>
    );
  }
}
