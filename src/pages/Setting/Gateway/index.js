// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import { Row, Col, Icon, Button, Input, Tooltip, Table, Pagination, Divider, message } from 'antd';
import G from '@/global';
import styles from './index.less';
import RemarkModal from './components/RemarkModel'
import ConfigureModel from './components/ConfigureModel'

@connect(({ Gateway, gatewayRemark, changeConfigureModel, gatewayCommand, loading }) => ({
  Gateway,
  gatewayRemark,
  changeConfigureModel,
  gatewayCommand,
  loading: loading.effects['Gateway/gatewayList'],
}))
class Gateway extends Component {
  state = {
    query: '',
    filterParam: {},
    sortParam: {},
    visible: false,
    editValue: {},
  }

  componentDidMount() {
    this.fetchDataList({ current: 1 });
    this.getCustomer();
  }

  // 搜索
  onSearch() {
    this.fetchDataList();
  }

  // 获取搜索框值
  onChangeSearchInfo = e => {
    this.setState({ query: e.target.value });
  };

  // 备注弹窗
  onMark(text) {
    this.setState({
      visible: true,
      editValue: text,
    });
  }

  // 获取客户列表
  getCustomer() {
    const { dispatch } = this.props;
    dispatch({
      type: 'Gateway/customerList',
    });
  }

  // 表格数据展示
  getColumns(sortOrder, customerList) {
    const columns = [
      {
        title: formatMessage({ id: "gateway.list.number" }),
        key: 'SerialNumber',
        width: 100,
        sorter: true,
        sortOrder: G._.isEmpty(sortOrder) ? undefined : `${sortOrder}end`,
        render: (text, record, index) => (
          <Fragment>
            <Tooltip placement="topLeft" title={text.SerialNumber}>
              <font style={{ cursor: 'pointer' }}>
                {text.SerialNumber}
              </font>
            </Tooltip>
          </Fragment>
        ),
      },
      {
        title: formatMessage({ id: "device.list.customer" }),
        key: 'companyName',
        filters: customerList,
        render: (text) => {
          return (
            <Fragment>
              <Tooltip placement="topLeft" title={text.companyName}>
                <span>{text.companyName}</span>
              </Tooltip>
            </Fragment>
          )
        },
      },
      {
        title: formatMessage({ id: "gateway.list.position" }),
        key: "position",
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
        title: formatMessage({ id: 'all.remarks' }),
        key: 'remark',
        render: text => {
          return (
            <Fragment>
              <Tooltip placement="topLeft" title={text.remark}>
                <font>{text.remark}</font>
              </Tooltip>
            </Fragment>
          );
        },
      },
      {
        title: formatMessage({ id: 'all.operating' }),
        key: 'setting',
        render: (text, record, index) => (
          <Fragment>
            <a
              onClick={() => {
                const array = [];
                array.push(text.id)
                this.changeConfigure({ configureList: array, configureVisible: true });
              }}
            >
              <FormattedMessage id="gateway.list.configure" />
            </a>
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

  // 表格排序筛选
  handleChange = (pagination, filters, sorter) => {
    filters.companyId = filters.companyName;
    delete filters.companyName;
    const { sortParam } = this.state;
    let filterParam;
    let sortParams;
    filterParam = !G._.isEmpty(filters) ? filters : {};
    sortParams = G._.isEmpty(sortParam) ? 'desc' : sortParam === 'desc' ? 'asc' : {};
    this.setState({
      filterParam,
      sortParam: sortParams,
    });
    this.fetchDataList({ filterParam, sortParams });
  };

  // enter 键搜索
  handelKeydown = e => {
    if (e.keyCode === 13) {
      this.onSearch();
    }
  };

  // 分页获取数据
  pageChange = pageNumber => {
    this.fetchDataList({ current: pageNumber });
  };

  // 清空搜索框内容
  emitEmpty = () => {
    this.userNameInput.focus();
    this.setState({ query: '' });
  };

  // table 多选
  onSelectChange = (selectedRowKeys, selectedRows) => {
    const array = [];
    if (!G._.isEmpty(selectedRows)) {
      selectedRows.forEach((item, i) => {
        array.push(item.id)
      })
    }
    this.changeConfigure({ configureList: array });
  }

  // 确定备注
  handleOk = (fieldsValue, id) => {
    const { editValue } = this.state;
    if (G._.isEmpty(editValue)) {
      return;
    }
    this.addRemark({ ...fieldsValue, id, callback: this.upload.bind(this) });
  };

  upload = res => {
    this.setState({ visible: false, editValue: {} });
    this.fetchDataList();
  };

  // 关闭备注弹窗
  handleCancel = () => {
    this.setState({ visible: false, remarks: '' });
  };

  // 关闭设置弹窗
  handClose = () => {
    this.changeConfigure({ configureList: [], configureVisible: false });
    this.fetchDataList({ current: 1 });
  }

  // 调用备注的接口
  addRemark(data) {
    const { dispatch } = this.props;
    dispatch({
      type: 'Gateway/gatewayRemark',
      payload: data,
    });
  }

  // 修改配置弹窗显示隐藏以及配置列表数据
  changeConfigure(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'Gateway/changeConfigureModel',
      payload: { ...value },
    });
  }

  // 获取列表
  fetchDataList(value) {
    const { dispatch, Gateway } = this.props;
    const { gatewayData } = Gateway;
    const { query, sortParam, filterParam } = this.state;
    dispatch({
      type: 'Gateway/gatewayList',
      payload: {
        offset: (value && (value.current - 1) * 15),
        limit: (value && value.limit) || gatewayData.limit,
        query: (value && value.query) || query,
        sortParam: G._.isEmpty((value && value.sortParams) || sortParam) ? '' : { resourceTotal: (value && value.sortParams) || sortParam },
        filterParam: G._.isEmpty((value && value.filterParam) || filterParam) ? '' : ((value && value.filterParam) || filterParam),
      },
    });
  }

  // 配置网关
  configuration() {
    const { Gateway } = this.props;
    const { configureList } = Gateway;
    if (G._.isEmpty(configureList)) {
      message.error(formatMessage({ id: "gateway.list.choose" }));
    } else {
      this.changeConfigure({ configureVisible: true });
    }
  }

  // 处理去虚拟网关页面
  goVirtualGateway(text, record, index) {
    const { saveGatewayParams } = this.props;
    saveGatewayParams("virtual_gateway", text.id);
  }

  render() {
    const { query, sortParam, editValue, visible } = this.state;
    const { loading, Gateway, dispatch } = this.props;
    const { configureList, configureVisible } = Gateway;
    const { rows, limit, current, count } = Gateway.gatewayData;
    const suffix = query ? <Icon type="close-circle" onClick={this.emitEmpty.bind(this)} /> : null;
    const columns = this.getColumns(sortParam, Gateway.customerList);
    const rowSelection = {
      configureList,
      onChange: this.onSelectChange,
    }
    return (
      <div className={styles.main}>
        <Row className={styles.lageBox}>
          <Col span={24}>
            <Button
              size='small'
              type="primary"
              onClick={this.configuration.bind(this)}
            >
              <FormattedMessage id="gateway.configure.batch-configure" />
            </Button>
            <Button
              className={styles.rights}
              size="small"
              icon="search"
              type="primary"
              onClick={this.onSearch.bind(this)}
            >
              <FormattedMessage id="all.search" />
            </Button>
            <Input
              value={query}
              className={styles.widthInput}
              placeholder="网关 / 备注"
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
          <Col span={24}>
            <Table
              rowKey="gateway_id"
              loading={loading}
              dataSource={rows}
              columns={columns}
              onChange={this.handleChange.bind(this)}
              pagination={false}
              rowSelection={rowSelection}
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
        <RemarkModal
          visible={visible}
          editValue={editValue}
          handleOk={this.handleOk.bind(this)}
          handleCancel={this.handleCancel.bind(this)}
        />
        <ConfigureModel
          configureVisible={configureVisible}
          configureList={configureList}
          dispatch={dispatch}
          handClose={this.handClose.bind(this)}
        />
      </div>
    );
  }
}

export default Gateway;