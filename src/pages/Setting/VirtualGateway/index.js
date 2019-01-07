import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { connect } from 'dva';
import { Row, Col, Icon, Button, Input, Tooltip, Table, Pagination } from 'antd';
import DetailModel from './components/DetailModel';
import G from '@/global';
import styles from './index.less';

@connect(({ virtualGateway, loading }) => ({
  virtualGateway,
  loading: loading.effects['virtualGateway/virtualGatewayList'],
}))
export default class VirtualGateway extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: props.id,
      filterParam: {},
      filterStatus: [
        { text: formatMessage({ id: 'virtual.gateway.script' }), value: 0 },
        { text: formatMessage({ id: 'gateway' }), value: 1 },
      ],
    }
  }

  componentDidMount() {
    this.fetchDataList({ current: 1 });
    this.getCustomer();
  }

  // 获取客户列表
  getCustomer() {
    const { dispatch } = this.props;
    dispatch({
      type: 'virtualGateway/customerList',
    });
  }

  // enter 键搜索
  handelKeydown = e => {
    if (e.keyCode === 13) {
      this.onSearch();
    }
  };

  // 搜索
  onSearch() {
    this.fetchDataList();
  }

  // 清空搜索框内容
  emitEmpty = () => {
    this.userNameInput.focus();
    this.setState({ query: '' });
  };

  // 获取搜索框值
  onChangeSearchInfo = e => {
    this.setState({ query: e.target.value });
  };

  // 表格数据展示
  getColumns(current, sortOrder, customerList, filterStatus) {
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
        title: formatMessage({ id: 'gateway.management.virtual.gateway' }),
        key: 'virtualGateway',
        render: (text, record, index) => {
          return (
            <Fragment>
              <Tooltip placement="topLeft" title={text.virtualGateway}>
                <span onClick={() => {
                  this.showDetail(text, record, index);
                }} style={{ cursor: 'pointer' }}>{text.virtualGateway}</span>
              </Tooltip>
            </Fragment>
          )
        }
      },
      {
        title: formatMessage({ id: 'gateway.management.gateway' }),
        key: "gateway",
        render: (text) => {
          return (
            <Fragment>
              <Tooltip placement="topLeft" title={text.gateway}>
                <span>{text.gateway}</span>
              </Tooltip>
            </Fragment>
          )
        }
      },
      {
        title: formatMessage({ id: 'virtual.gateway.type' }),
        key: 'type',
        filters: filterStatus,
        render: text => {
          return (
            <Fragment>
              <Tooltip placement="topLeft" title={filterStatus[text.type].text}>
                <font>{filterStatus[text.type].text}</font>
              </Tooltip>
            </Fragment>
          );
        }
      },
      {
        title: formatMessage({ id: 'admin.sensor.list.customer' }),
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
        title: formatMessage({ id: 'all.operating' }),
        key: 'setting',
        render: (text, record, index) => (
          <Fragment>
            <CopyToClipboard text={text.connectString}>
              <a><FormattedMessage id="virtual.gateway.copy.connect.string" /></a>
            </CopyToClipboard>
          </Fragment>
        )
      }
    ];
    return columns;
  }

  // 表格排序筛选
  handleChange = (pagination, filters, sorter) => {
    filters.companyId = filters.companyName;
    delete filters.companyName;
    let filterParam;
    filterParam = !G._.isEmpty(filters) ? filters : {};
    this.setState({
      filterParam,
    });
    this.fetchDataList({ filterParam });
  };

  // 获取列表
  fetchDataList(value) {
    const { dispatch, virtualGateway } = this.props;
    const { virtualGatewayData } = virtualGateway;
    const { query, filterParam } = this.state;
    dispatch({
      type: 'virtualGateway/virtualGatewayList',
      payload: {
        offset: (value && (value.current - 1) * 15),
        limit: (value && value.limit) || virtualGatewayData.limit,
        query: (value && value.query) || query,
        filterParam: G._.isEmpty((value && value.filterParam) || filterParam) ? '' : ((value && value.filterParam) || filterParam)
      },
    });
  }

  // 分页获取数据
  pageChange = pageNumber => {
    this.fetchDataList({ current: pageNumber });
  };

  // 展示详情
  showDetail(text, record, index) {
    const { dispatch } = this.props;
    dispatch({
      type: 'virtualGateway/changeDetailData',
      payload: {
        visible: true,
        detailData: {
          ...text
        }
      },
    });
  }

  // 关闭详情页
  handClose() {
    const { dispatch } = this.props;
    dispatch({
      type: 'virtualGateway/changeDetailData',
      payload: {
        visible: false,
        detailData: {}
      },
    });
  }

  render() {
    const { query, sortParam, filterStatus } = this.state;
    const { loading, virtualGateway, dispatch } = this.props;
    const { virtualGatewayData, customerList, detail, gatewayList } = virtualGateway;
    const { rows, limit, current, count } = virtualGatewayData;
    const columns = this.getColumns(current, sortParam, customerList, filterStatus);
    const suffix = query ? <Icon type="close-circle" onClick={this.emitEmpty.bind(this)} /> : null;
    return (
      <div className={styles.main}>
        <Row className={styles.lageBox}>
          <Col span={24}>
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
              placeholder={formatMessage({ id: 'gateway.management.virtual.gateway' }) / formatMessage({ id: 'gateway.management.gateway' })}
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
        {/* 详情页面 */}
        <DetailModel
          visible={detail.visible}
          detailData={detail.detailData}
          gatewayList={gatewayList}
          dispatch={dispatch}
          handClose={this.handClose.bind(this)}
        />
      </div>
    );
  }
}
