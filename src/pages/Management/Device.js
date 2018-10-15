import React, { Component, Fragment } from 'react';
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
      { text: '未绑定', value: 1 },
      { text: '离线', value: 2 },
      { text: '使用中', value: 3 },
      { text: '空闲', value: 4 },
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
        title: '序号',
        key: 'id',
        render: (text, record, index) => (
          <Fragment>
            <font>{(current - 1) * 15 + index + 1}</font>
          </Fragment>
        ),
      },
      {
        title: '桌子编号',
        dataIndex: 'serialNumber',
        key: 'serialNumber',
        sorter: true,
        sortOrder: `${sortOrder}end` || ''
      },
      {
        title: '状态',
        key: 'status',
        filters: filterStatus,
        render: text => {
          return (
            <Fragment>
              <font>{filterStatus[text.status - 1].text}</font>
            </Fragment>
          );
        },
      },
      {
        title: currentAuthority === 'admin' ? '所属客户' : '用户',
        dataIndex: currentAuthority === 'admin' ? 'companyName' : 'user_name',
        key: currentAuthority === 'admin' ? 'companyName' : 'user_name',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 150,
      },
      {
        title: '最后使用时间',
        dataIndex: 'lastOperationTime',
        key: 'lastOperationTime',
        render: text => {
          return text ? <span>{G.moment(text).format('YYYY-MM-DD hh:mm:ss')}</span> : ''
        },
        width: 170,
      },
      {
        title: '操作',
        key: 'setting',
        render: (text, record, index) => (
          <Fragment>
            {currentAuthority === 'admin' ? (
              text.companyId ? <Popconfirm
                placement="left"
                title="移除后该设备将从企业中移除，确定要移除吗？"
                onConfirm={this.untiedRemove.bind(this, text)}
                okText="移除"
                cancelText="取消"
              >
                <a>移除</a>
              </Popconfirm> : <span style={{ color: '#CCCCCC' }}>移除</span>
            ) : (
                text.userUid ?
                  <Popconfirm
                    placement="left"
                    title="解除绑定后，该用户将被强制退出该设备，导致用户无法正常使用（可重新登录使用）"
                    onConfirm={this.untiedConfirm.bind(this, text)}
                    okText="解绑"
                    cancelText="取消"
                  >
                    <a>解绑</a>
                  </Popconfirm> : <span style={{ color: '#CCCCCC' }}>解绑</span>)}
            <Divider type="vertical" />
            <a
              onClick={() => {
                this.onMark(text, record, index);
              }}
            >
              备注
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
        <h3>设备管理</h3>
        <br />
        <Row className={styles.lageBox}>
          <p>设备列表</p>
          {/* 查询 */}
          <Col span={24}>
            <Button
              className={styles.rights}
              size='small'
              icon="search"
              type="primary"
              onClick={this.onSearch.bind(this)}
            >
              搜索
            </Button>
            <Input
              value={query}
              className={styles.widthInput}
              placeholder={user.user.currentAuthority === 'user' ? "设备编号 / 使用者 / 备注" : "设备编号 / 所属客户 / 备注"}
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
