// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import { Row, Col, Table, Button, Input, Divider, Popconfirm, Pagination, Icon, Tooltip, message } from 'antd';
import Permission from './components/Permission'
import G from '@/global';
import styles from './Customer.less';
import { routerRedux } from 'dva/router';
import { checkAddPermission } from '@/utils/utils'

@connect(({ ManagementCustomer, loading }) => ({
  ManagementCustomer,
  loading: loading.effects['ManagementCustomer/fetch'],
}))
class Wework extends Component {
  // 表单以及分页
  state = {
    query: '',
    sortParam: {},
    visible: false,
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
      type: 'ManagementCustomer/setEditValue',
      payload: text,
    });
    this.newCustomer();
  }

  getColumns(current, sortOrder) {
    const columns = [
      {
        title: formatMessage({ id: 'all.serial.number' }),
        key: 'id',
        width: 70,
        render: (text, record, index) => (
          <Fragment>
            <font>{(current - 1) * 15 + index + 1}</font>
          </Fragment>
        ),
      },
      {
        title: formatMessage({ id: 'customer.list.name' }),
        key: 'companyName',
        render: text => {
          return (
            <Fragment>
              <Tooltip placement="topLeft" title={text.companyName}>
                <font>{text.companyName}</font>
              </Tooltip>
            </Fragment>
          );
        },
      },
      {
        title: formatMessage({ id: 'customer.list.account-number' }),
        key: 'company.account',
        render: text => {
          return (
            <Fragment>
              <Tooltip placement="topLeft" title={text.company.account}>
                <font>{text.company.account}</font>
              </Tooltip>
            </Fragment>
          );
        },
      },
      {
        title: formatMessage({ id: 'home.device.number' }),
        dataIndex: 'resourceTotal',
        key: 'resourceTotal',
        sorter: true,
        sortOrder: G._.isEmpty(sortOrder) ? undefined : `${sortOrder}end`,
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
        title: formatMessage({ id: 'customer.list.offline-devices' }),
        dataIndex: 'resourceOffline',
        key: 'resourceOffline',
      },
      {
        title: formatMessage({ id: 'home.users.number' }),
        dataIndex: 'userTotal',
        key: 'userTotal',
      },
      {
        title: formatMessage({ id: 'all.remarks' }),
        key: 'company.remark',
        render: text => {
          return (
            <Fragment>
              <Tooltip placement="topLeft" title={text.company.remark}>
                <font>{text.company.remark}</font>
              </Tooltip>
            </Fragment>
          );
        },
      },
      {
        title: formatMessage({ id: 'all.operating' }),
        key: 'setting',
        width: 300,
        render: (text, record, index) => (
          <Fragment>
            <Popconfirm
              placement="left"
              title={formatMessage({ id: 'customer.list.reset-password-message' })}
              onConfirm={this.untiedConfirm.bind(this, text)}
              okText={formatMessage({ id: 'all.certain' })}
              cancelText={formatMessage({ id: 'all.cancel' })}
            >
              <a><FormattedMessage id='customer.list.reset-password' /></a>
            </Popconfirm>
            <Divider type="vertical" />
            <a
              onClick={() => {
                this.onMark(text, record, index);
              }}
            >
              <FormattedMessage id='all.edit' />
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                this.obpermission(text, record, index);
              }}
            >
              <FormattedMessage id="customer.permission" />
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
    const { sortParam } = this.state;
    const sortParams = G._.isEmpty(sortParam) ? 'desc' : sortParam === 'desc' ? 'asc' : {};
    this.setState({
      sortParam: sortParams,
    });
    this.fetchDataList({ sortParams });
  };

  pageChange = pageNumber => {
    this.fetchDataList({ current: pageNumber });
  };

  // 获取权限列表
  obpermission(text) {
    const { dispatch } = this.props;
    dispatch({
      type: 'ManagementCustomer/permissionsList',
      payload: {
        companyId: text.companyId,
        callback: this.showModel.bind(this),
      },
    });
    dispatch({
      type: 'ManagementCustomer/saveCompanyId',
      payload: {
        companyId: text.companyId,
      },
    });
  }

  // 回调函数
  showModel(res) {
    const { dispatch } = this.props;
    const addPermission = checkAddPermission(res.data);
    if (res.status === 'success') {
      this.setState({
        visible: true,
      });
      dispatch({
        type: 'ManagementCustomer/saveAddPermissions',
        payload: {
          addPermission,
        },
      })
    }
  }

  // 关闭弹窗
  closeModel(res) {
    this.setState({
      visible: false,
    });
    if (res === 1) {
      this.fetchDataList();
    }
  }

  // 跳转到设备列表
  jump(text, record) {
    const { dispatch } = this.props;
    const { companyId } = record;
    dispatch({
      type: 'ManagementCustomer/setcompanyId',
      payload: companyId,
    });
    dispatch(routerRedux.push('/management/device'))
  }

  // 添加客户
  newCustomer() {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/management/newCustomer'))
  }

  // 重置密码
  untiedConfirm(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'ManagementCustomer/resetPassword',
      payload: { companyId: value.companyId, callback: this.fetchDataList.bind(this) },
    });
  }

  fetchDataList(value) {
    const { dispatch, ManagementCustomer } = this.props;
    const equipData = ManagementCustomer.data;
    const { query, sortParam } = this.state;
    dispatch({
      type: 'ManagementCustomer/fetch',
      payload: {
        offset: (value && (value.current - 1) * 15),
        limit: (value && value.limit) || equipData.limit,
        query: (value && value.query) || query,
        sortParam: G._.isEmpty((value && value.sortParams) || sortParam) ? '' : { resourceTotal: (value && value.sortParams) || sortParam },
      },
    });
  }

  render() {
    const { ManagementCustomer, loading, dispatch } = this.props;
    const { query, sortParam, visible } = this.state;
    const { limit, current, count } = ManagementCustomer.data;
    const columns = this.getColumns(current, sortParam);
    const suffix = query ? <Icon type="close-circle" onClick={this.emitEmpty.bind(this)} /> : null;
    return (
      <div className={styles.main}>
        <h3><FormattedMessage id='menu.management.customer' /></h3>
        <br />
        <Row className={styles.lageBox}>
          <p><FormattedMessage id='customer.list' /></p>
          {/* 查询 */}
          <Col span={6}>
            <Button icon="plus" type="primary" size='small' onClick={this.newCustomer.bind(this)}>
              <FormattedMessage id='all.add' />
            </Button>
          </Col>
          <Col span={18}>
            <Button
              className={styles.rights}
              icon="search"
              size='small'
              type="primary"
              onClick={this.onSearch.bind(this)}
            >
              <FormattedMessage id='all.search' />
            </Button>
            <Input
              value={query}
              className={styles.widthInput}
              placeholder={formatMessage({ id: 'customer.list.search-text' })}
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
              dataSource={ManagementCustomer.data.rows}
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
        <Permission
          dispatch={dispatch}
          visible={visible}
          companyId={ManagementCustomer.companyId}
          permissionList={ManagementCustomer.permissionList}
          addPermission={ManagementCustomer.addPermission}
          closeModel={this.closeModel.bind(this)}
        />
      </div>
    );
  }
}

export default Wework;