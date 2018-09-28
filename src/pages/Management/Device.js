import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Table, Button, Input, Divider, Popconfirm, Pagination, Icon } from 'antd';

import G from '@/global';
import styles from './Person.less';
import EquipModal from './components/EquipModal.js';

@connect(({ manaEquip, manaCustomer, loading }) => ({
  manaEquip,
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
      { text: '全部', value: 1 },
      { text: '使用中', value: 2 },
      { text: '空闲', value: 3 },
      { text: '离线', value: 4 },
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

  getColumns(current, filterStatus) {
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
        title: '用户',
        dataIndex: 'user_name',
        key: 'user_name',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 260,
      },
      {
        title: '最后使用时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
      },
      {
        title: '操作',
        key: 'setting',
        render: (text, record, index) => (
          <Fragment>
            <Popconfirm
              placement="left"
              title="解除绑定后，该用户将被强制退出该设备，导致用户无法正常使用（可重新登录使用）"
              onConfirm={this.untiedConfirm.bind(this, text)}
              okText="解绑"
              cancelText="取消"
            >
              <a>解绑</a>
            </Popconfirm>
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
    let filterParam = {};
    let sortParam = {};
    if (!G._.isEmpty(filters && filters.status)) {
      filterParam = { status: filters.status };
    }
    if (!G._.isEmpty(sorter)) {
      sortParam = { serialNumber: sorter.order === 'descend' ? 'desc' : 'asc' };
    }
    this.setState({
      filterParam,
      sortParam,
    });
    this.fetchDataList({ filterParam, sortParam });
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
        sortParam: (value && value.sortParam) || sortParam,
        companyId,
      },
    });
  }

  render() {
    const { manaEquip, loading } = this.props;
    const { visible, modalLoading, editValue, query, filterStatus } = this.state;
    const { limit, current, count } = manaEquip.data;
    const columns = this.getColumns(current, filterStatus);
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
              placeholder="设备编号 / 使用者 / 备注"
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
