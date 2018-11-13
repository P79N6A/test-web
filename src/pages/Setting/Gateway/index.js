import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import { Row, Col, Icon, Button, Input, Tooltip, Table, Pagination, Divider } from 'antd';
import G from '@/global';
import styles from './index.less';

@connect(({ Gateway, loading }) => ({
  Gateway,
  loading: loading.effects['Gateway/gatewayList'],
}))
export default class Gateway extends Component {
  state = {
    // 多选
    selectedRowKeys: [],
    query: '',
    filterParam: {},
    sortParam: {},
    visible: false,
    remarks: '',
  }

  componentDidMount() {
    this.fetchDataList();
  }

  // 批量配置
  configuration() { }

  // 清空搜索框内容
  emitEmpty = () => {
    this.userNameInput.focus();
    this.setState({ query: '' });
  };

  // 获取搜索框值
  onChangeSearchInfo = e => {
    this.setState({ query: e.target.value });
  };

  // enter 键搜索
  handelKeydown = e => {
    if (e.keyCode === 13) {
      this.onSearch();
    }
  };

  // 搜索
  onSearch() {
    this.fetchDataList({ current: 1 });
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
        filterParam: G._.isEmpty((value && value.filterParam) || filterParam) ? '' : (value.filterParam || sortParam)
      },
    });
  }

  // 分页获取数据
  pageChange = pageNumber => {
    this.fetchDataList({ current: pageNumber });
  };

  // 表格排序筛选
  handleChange = (pagination, filters, sorter) => {
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

  // 表格数据展示
  getColumns(sortOrder, customerList, positionList) {
    const columns = [
      {
        title: "编号",
        key: 'gatewayId',
        width: 100,
        sorter: true,
        sortOrder: G._.isEmpty(sortOrder) ? undefined : `${sortOrder}end`,
        render: (text, record, index) => (
          <Fragment>
            <Tooltip placement="topLeft" title={text.gatewayId}>
              <font>{text.gatewayId}</font>
            </Tooltip>
          </Fragment>
        ),
      },
      {
        title: "所属客户",
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
        }
      },
      {
        title: formatMessage({ id: 'device.status' }),
        key: 'status',
        render: text => {
          return (
            <Fragment>
              <Tooltip placement="topLeft" title={text.status}>
                <font>{text.status}</font>
              </Tooltip>
            </Fragment>
          );
        }
      },
      {
        title: "位置",
        key: "position",
        filters: positionList,
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
        }
      },
      {
        title: "连接状态",
        key: 'statuse',
        render: (text) => {
          return (
            <Fragment>
              <Tooltip placement="topLeft" title={text.status}>
                <span>{text.status}</span>
              </Tooltip>
            </Fragment>
          )
        }
      },
      {
        title: formatMessage({ id: 'all.operating' }),
        key: 'setting',
        width: 170,
        render: (text, record, index) => (
          <Fragment>
            <a
              onClick={() => {
                this.onMark(text, record, index);
              }}
            >
              配置
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
        )
      }
    ];
    return columns;
  }

  // table 多选
  onSelectChange = (selectedRowKeys, selectedRows) => {
    let array = [];
    if (!G._.isEmpty(selectedRows)) {
      selectedRows.map((item, i) => {
        array.push(item.gatewayId)
      })
    }
    this.setState({
      selectedRowKeys: array
    });
  }

  // 备注弹窗
  onMark(text) { }

  render() {
    const { selectedRowKeys, query, sortParam } = this.state;
    const { loading, Gateway } = this.props;
    const { rows, limit, current, count } = Gateway.gatewayData;
    const suffix = query ? <Icon type="close-circle" onClick={this.emitEmpty.bind(this)} /> : null;
    const columns = this.getColumns(sortParam, Gateway.customerList, Gateway.positionList);
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    return (
      <div className={styles.main}>
        <h3><FormattedMessage id="menu.setting.gateway" /></h3>
        <br />
        <Row className={styles.lageBox}>
          <p>网关列表</p>
          <Col span={24}>
            <Button
              size='small'
              type="primary"
              onClick={this.configuration.bind(this)}
            >
              批量配置
            </Button>
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
              placeholder={'IP / Name'}
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
      </div>
    );
  }
}
