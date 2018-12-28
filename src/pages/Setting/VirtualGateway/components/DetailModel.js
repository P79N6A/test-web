import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Modal, Button, Row, Col, Table, Pagination, Input, Icon, Tooltip } from 'antd';
import G from '@/global';
import styles from './DetailModel.less';

class DetailModel extends Component {
  state = {
    // 虚拟网关状态
    stateData: [
      { text: "在线", value: 0 },
      { text: "离线", value: 1 },
    ],
    query: "",
    filterParam: {},
    // 传感器状态
    sensorState: [
      { text: "占用", value: 0 },
      { text: "空闲", value: 1 },
      { text: "离线", value: 2 },
    ]
  }

  componentDidMount() {
    this.fetchDataList({ current: 1 });
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
  getColumns(sensorState) {
    const columns = [
      {
        title: "传感器ID",
        key: 'gatewayId',
        render: (text, record, index) => (
          <Fragment>
            <Tooltip placement="topLeft" title={text.gatewayId}>
              <span>{text.gatewayId}</span>
            </Tooltip>
          </Fragment>
        ),
      },
      {
        title: "状态",
        key: 'state',
        filters: sensorState,
        render: text => {
          return (
            <Fragment>
              <Tooltip placement="topLeft" title={sensorState[text.state].text}>
                <font>{sensorState[text.state].text}</font>
              </Tooltip>
            </Fragment>
          );
        }
      },
    ];
    return columns;
  }

  // 分页获取数据
  pageChange = pageNumber => {
    this.fetchDataList({ current: pageNumber });
  };

  // 表格排序筛选
  handleChange = (pagination, filters, sorter) => {
    let filterParam;
    filterParam = !G._.isEmpty(filters.state) ? filters : {};
    this.setState({
      filterParam,
    });
    this.fetchDataList({ filterParam });
  };

  // 获取列表
  fetchDataList(value) {
    const { dispatch, gatewayList, detailData } = this.props;
    const { virtualGateway } = detailData;
    const { query, filterParam } = this.state;
    dispatch({
      type: 'virtualGateway/virtualGatewaySensorList',
      payload: {
        virtualGateway,
        offset: (value && (value.current - 1) * 15),
        limit: (value && value.limit) || gatewayList.limit,
        query: (value && value.query) || query,
        filterParam: G._.isEmpty((value && value.filterParam) || filterParam) ? '' : ((value && value.filterParam) || filterParam)
      },
    });
  }

  render() {
    const { visible, handClose, detailData, gatewayList } = this.props;
    const { stateData, query, sensorState } = this.state;
    const { virtualGateway, state } = detailData;
    const { rows, limit, current, count } = gatewayList;
    const columns = this.getColumns(sensorState);
    const suffix = query ? <Icon type="close-circle" onClick={this.emitEmpty.bind(this)} /> : null;
    if (!visible) return null;
    return (
      <Modal
        width={780}
        visible={visible}
        title="虚拟网关详情"
        onOk={handClose}
        onCancel={handClose}
        footer={[
          <Button key="back" size="small" onClick={handClose}>
            <FormattedMessage id="all.close" />
          </Button>
        ]}
      >
        <div className={styles.main}>
          <p className={styles.gatewayState}>虚拟网关ID：{virtualGateway}</p>
          <p className={styles.gatewayState}>虚拟网关状态：{stateData[state].text}</p>
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
                placeholder="传感器ID"
                suffix={suffix}
                ref={node => {
                  this.userNameInput = node;
                }}
                onChange={this.onChangeSearchInfo.bind(this)}
                onKeyUp={this.handelKeydown.bind(this)}
              />
              <span className={styles.gatewayState}>传感器列表</span>
            </Col>
            <br />
          </Row>
          <Row className={styles.lageBox}>
            <Col span={24}>
              <Table
                rowKey="gateway_id"
                dataSource={rows}
                columns={columns}
                pagination={false}
                onChange={this.handleChange.bind(this)}
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
      </Modal>
    );
  }
}

export default DetailModel;
