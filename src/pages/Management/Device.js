import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import { Row, Col, Table, Button, Input, Divider, Popconfirm, Pagination, Icon } from 'antd';

import G from '@/global';
import styles from './Person.less';
import EquipModal from './components/EquipModal.js';

@connect(({ manaEquip, user, manaCustomer, loading }) => ({
  manaEquip,
  user,
  manaCustomer,
  loading: loading.effects['manaEquip/fetch'],
}))
export default class Device extends Component {
  // 表单以及分页
  state = {
    query: '',
    filterParam: {},
    sortParam: {},
    modalLoading: false,
    visible: false,
    editValue: {},
    filterStatus: [
      { text: formatMessage({ id: 'device.offline' }), value: 2 },
      { text: formatMessage({ id: 'device.using' }), value: 3 },
      { text: formatMessage({ id: 'device.leisure' }), value: 4 },
    ],
  };

  componentDidMount() {
    this.fetchDataList();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'manaCustomer/setcompanyId',
      payload: '',
    });
  }

  onSearch() {
    this.fetchDataList({ current: 1 });
  }

  onChangeSearchInfo = e => {
    this.setState({ query: e.target.value });
  };

  onMark(text) {
    this.setState({
      visible: true,
      editValue: text,
    });
  }

  getColumns(current, filterStatus, currentAuthority, sortOrder) {
    const columns = [
      {
        title: formatMessage({ id: 'all.serial.number' }),
        key: 'id',
        width: 100,
        render: (text, record, index) => (
          <Fragment>
            <font>{(current - 1) * 15 + index + 1}</font>
          </Fragment>
        ),
      },
      {
        title: formatMessage({ id: 'device.desk.id' }),
        dataIndex: 'serialNumber',
        key: 'serialNumber',
        sorter: true,
        sortOrder: G._.isEmpty(sortOrder) ? undefined : `${sortOrder}end`
      },
      {
        title: formatMessage({ id: 'device.status' }),
        key: 'status',
        filters: filterStatus,
        render: text => {
          return (
            <Fragment>
              <font>{filterStatus[text.status - 2].text}</font>
            </Fragment>
          );
        },
      },
      {
        title: currentAuthority === 'admin' ? formatMessage({ id: 'device.customer' }) : formatMessage({ id: 'device.user' }),
        dataIndex: currentAuthority === 'admin' ? 'companyName' : 'user_name',
        key: currentAuthority === 'admin' ? 'companyName' : 'user_name',
      },
      {
        title: formatMessage({ id: 'all.remarks' }),
        dataIndex: 'remark',
        key: 'remark',
        width: 180,
      },
      {
        title: formatMessage({ id: 'device.use.time' }),
        dataIndex: 'lastOperationTime',
        key: 'lastOperationTime',
        render: text => {
          return text ? <span>{G.moment(text).format('YYYY-MM-DD hh:mm:ss')}</span> : ''
        },
      },
      {
        title: formatMessage({ id: 'all.operating' }),
        key: 'setting',
        width: 170,
        render: (text, record, index) => (
          <Fragment>
            {currentAuthority === 'admin' ? (
              text.companyId ? <Popconfirm
                placement="left"
                title={formatMessage({ id: 'device.remove.message' })}
                onConfirm={this.untiedRemove.bind(this, text)}
                okText={formatMessage({ id: 'all.remove' })}
                cancelText={formatMessage({ id: 'all.cancel' })}
              >
                <a><FormattedMessage id='all.remove' /></a>
              </Popconfirm> : <span style={{ color: '#CCCCCC' }}><FormattedMessage id='all.remove' /></span>
            ) : (
                text.userUid ?
                  <Popconfirm
                    placement="left"
                    title={formatMessage({ id: 'device.untied.message' })}
                    onConfirm={this.untiedConfirm.bind(this, text)}
                    okText={formatMessage({ id: 'device.untied' })}
                    cancelText={formatMessage({ id: 'all.cancel' })}
                  >
                    <a><FormattedMessage id="device.untied" /></a>
                  </Popconfirm> : <span style={{ color: '#CCCCCC' }}><FormattedMessage id="device.untied" /></span>)}
            <Divider type="vertical" />
            <a
              onClick={() => {
                this.onMark(text, record, index);
              }}
            >
              <FormattedMessage id="all.remarks" />
            </a>
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

  handleCancel = () => {
    this.setState({ visible: false, editValue: {} });
  };

  upload = res => {
    if (res.status === 'success') {
      this.setState({ modalLoading: false, visible: false });
      this.fetchDataList();
    } else {
      this.setState({ modalLoading: false });
    }
  };

  // 备注
  handleOk = (fieldsValue, id) => {
    this.setState({ modalLoading: true });
    const { editValue } = this.state;
    if (G._.isEmpty(editValue)) {
      return;
    }
    this.addRemark({ ...fieldsValue, id, callback: this.upload.bind(this) });
  };

  // 解除弹窗
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  emitEmpty = () => {
    this.userNameInput.focus();
    this.setState({ query: '' });
  };

  // 排序筛选
  handleChange = (pagination, filters, sorter) => {
    const { sortParam } = this.state;
    let filterParam;
    let sortParams;
    sortParams = G._.isEmpty(sortParam) ? 'desc' : sortParam === 'desc' ? 'asc' : {};
    filterParam = !G._.isEmpty(filters && filters.status) ? { status: filters.status } : {};
    this.setState({
      filterParam,
      sortParam: sortParams,
    });
    this.fetchDataList({ filterParam, sortParams });
  };

  pageChange = pageNumber => {
    this.fetchDataList({ current: pageNumber });
  };

  // 调用备注的接口
  addRemark(data) {
    const { dispatch } = this.props;
    dispatch({
      type: 'manaEquip/addRemark',
      payload: data,
    });
  }

  untiedConfirm(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'manaEquip/release',
      payload: { id: value.id, callback: this.fetchDataList.bind(this) },
    });
  }

  untiedRemove(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'manaEquip/remove',
      payload: { id: value.id, callback: this.fetchDataList.bind(this) },
    });
  }

  fetchDataList(value) {
    const { dispatch, manaEquip, manaCustomer } = this.props;
    const { companyId } = manaCustomer;
    const equipData = manaEquip.data;
    const { query, filterParam, sortParam } = this.state;
    dispatch({
      type: 'manaEquip/fetch',
      payload: {
        offset: (value && (value.current - 1) * 15),
        limit: (value && value.limit) || equipData.limit,
        query: (value && value.query) || query,
        filterParam: (value && value.filterParam) || filterParam,
        sortParam: G._.isEmpty((value && value.sortParams) || sortParam) ? '' : { serialNumber: (value && value.sortParams) || sortParam },
        companyId,
      },
    });
  }

  render() {
    const { manaEquip, loading, user } = this.props;
    const { visible, modalLoading, editValue, query, filterStatus, sortParam } = this.state;
    const { limit, current, count } = manaEquip.data;
    const columns = this.getColumns(current, filterStatus, user.user.currentAuthority, sortParam);
    const suffix = query ? <Icon type="close-circle" onClick={this.emitEmpty.bind(this)} /> : null;
    return (
      <div className={styles.main}>
        <h3><FormattedMessage id="menu.management.device" /></h3>
        <br />
        <Row className={styles.lageBox}>
          <p><FormattedMessage id="device.list" /></p>
          {/* 查询 */}
          <Col span={24}>
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
              placeholder={user.user.currentAuthority === 'user' ? formatMessage({ id: 'device.search.user.text' }) : formatMessage({ id: 'device.search.admin.text' })}
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
          {/* 表格 */}
          <Col span={24}>
            <Table
              rowKey="id"
              loading={loading}
              dataSource={manaEquip.data.rows}
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
        <EquipModal
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
