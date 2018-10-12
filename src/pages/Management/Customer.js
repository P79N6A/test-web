import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Table, Button, Input, Divider, Popconfirm, Pagination, Icon } from 'antd';

import G from '@/global';
import styles from './Person.less';
import { routerRedux } from '../../../node_modules/dva/router';

@connect(({ manaCustomer, loading }) => ({
  manaCustomer,
  loading: loading.effects['manaCustomer/fetch'],
}))
export default class Wework extends Component {
  // 表单以及分页
  state = {
    query: '',
    sortParam: {},
  };

  componentDidMount() {
    this.fetchDataList();
  }

  onSearch() {
    this.fetchDataList({ offset: 0 });
  }

  onChangeSearchInfo = e => {
    this.setState({ query: e.target.value });
  };

  // 编辑
  onMark(text) {
    const { dispatch } = this.props;
    dispatch({
      type: 'manaCustomer/setEditValue',
      payload: text,
    });
    this.newCustomer();
  }

  getColumns(current) {
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
        title: '客户名称',
        dataIndex: 'companyName',
        key: 'companyName',
      },
      {
        title: '账号',
        dataIndex: 'company.account',
        key: 'company.account',
      },
      {
        title: '设备数',
        dataIndex: 'resourceTotal',
        key: 'resourceTotal',
        sorter: true,
        render: (text, record) => (
          <a
            onClick={() => {
              this.jump(text, record);
            }}
          >
            {text}
          </a>
        ),
      },
      {
        title: '离线设备数',
        dataIndex: 'resourceOffline',
        key: 'resourceOffline',
      },
      {
        title: '用户数',
        dataIndex: 'userTotal',
        key: 'userTotal',
      },
      {
        title: '备注',
        dataIndex: 'company.remark',
        key: 'company.remark',
        width: 260,
      },
      {
        title: '操作',
        key: 'setting',
        width: 160,
        render: (text, record, index) => (
          <Fragment>
            <Popconfirm
              placement="left"
              title="确定要重置密码吗？"
              onConfirm={this.untiedConfirm.bind(this, text)}
              okText="确定"
              cancelText="取消"
            >
              <a>重置密码</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a
              onClick={() => {
                this.onMark(text, record, index);
              }}
            >
              编辑
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

  emitEmpty = () => {
    this.userNameInput.focus();
    this.setState({ query: '' });
  };

  // 排序筛选
  handleChange = (pagination, filters, sorter) => {
    let sortParam = {};
    if (!G._.isEmpty(sorter)) {
      sortParam = { resourceOffline: sorter.column.order === 'descend' ? 'desc' : 'asc' };
    }
    this.setState({
      sortParam,
    });
    this.fetchDataList({ sortParam });
  };

  pageChange = pageNumber => {
    this.fetchDataList({ current: pageNumber });
  };

  // 跳转到设备列表
  jump(text, record) {
    const { dispatch } = this.props;
    const { companyId } = record;
    dispatch({
      type: 'manaCustomer/setcompanyId',
      payload: companyId,
    });
    this.props.dispatch(routerRedux.push('/management/device'))
  }

  // 添加客户
  newCustomer() {
    this.props.dispatch(routerRedux.push('/management/newCustomer'))
  }

  // 重置密码
  untiedConfirm(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'manaCustomer/resetPassword',
      payload: { account: value.company.account, callback: this.fetchDataList.bind(this) },
    });
  }

  fetchDataList(value) {
    const { dispatch, manaCustomer } = this.props;
    const equipData = manaCustomer.data;
    const { query, sortParam } = this.state;
    dispatch({
      type: 'manaCustomer/fetch',
      payload: {
        offset: (value && (value.current - 1) * 15),
        limit: (value && value.limit) || equipData.limit,
        query: (value && value.query) || query,
        sortParam: (value && value.sortParam) || sortParam,
      },
    });
  }

  render() {
    const { manaCustomer, loading } = this.props;
    const { query } = this.state;
    const { limit, current, count } = manaCustomer.data;
    const columns = this.getColumns(current);
    const suffix = query ? <Icon type="close-circle" onClick={this.emitEmpty.bind(this)} /> : null;
    return (
      <div className={styles.main}>
        <h3>客户管理</h3>
        <br />
        <Row className={styles.lageBox}>
          <p>客户列表</p>
          {/* 查询 */}
          <Col span={12}>
            <Button icon="plus" type="primary" size='small' onClick={this.newCustomer.bind(this)}>
              新增
            </Button>
          </Col>
          <Col span={12}>
            <Button
              className={styles.rights}
              icon="search"
              size='small'
              type="primary"
              onClick={this.onSearch.bind(this)}
            >
              搜索
            </Button>
            <Input
              value={query}
              className={styles.widthInput}
              placeholder="客户名称 / 账号 / 备注"
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
              rowKey="companyId"
              loading={loading}
              dataSource={manaCustomer.data.rows}
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
      </div>
    );
  }
}
