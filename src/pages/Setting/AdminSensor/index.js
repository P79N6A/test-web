import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import { Row, Col, Icon, Button, Input, Tooltip, Table, Pagination, Modal } from 'antd';
import styles from './index.less';
import G from '@/global';

@connect(({ adminSensor, loading }) => ({
  adminSensor,
  loading: loading.effects['adminSensor/adminSensorList'],
}))
export default class AdminSensor extends Component {
  state = {
    query: '',
    visible: false,
    sensorId: '',
    // 虚拟网关状态
    stateData: [
      { text: "在线", value: 0 },
      { text: "离线", value: 1 },
    ],
    // 传感器状态
    sensorState: [
      { text: "占用", value: 0 },
      { text: "空闲", value: 1 },
      { text: "离线", value: 2 },
    ],
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
  getColumns(current) {
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
        title: "传感器编号",
        key: 'number',
        render: (text, record, index) => (
          <Fragment>
            <Tooltip placement="topLeft" title={text.number}>
              <font onClick={this.showDetail.bind(this, text.id)}>{text.number}</font>
            </Tooltip>
          </Fragment>
        ),
      },
      {
        title: "物理网关ID",
        key: 'gatewayId',
        render: (text) => {
          return (
            <Fragment>
              <Tooltip placement="topLeft" title={text.gatewayId}>
                <span>{text.gatewayId}</span>
              </Tooltip>
            </Fragment>
          )
        }
      },
      {
        title: "客户",
        key: 'customerName',
        render: text => {
          return (
            <Fragment>
              <Tooltip placement="topLeft" title={text.customerName}>
                <font>{text.customerName}</font>
              </Tooltip>
            </Fragment>
          );
        }
      }
    ];
    return columns;
  }

  // 分页获取数据
  pageChange = pageNumber => {
    this.fetchDataList({ current: pageNumber });
  };

  // 获取列表
  fetchDataList(value) {
    const { dispatch, adminSensor } = this.props;
    const { adminSensorData } = adminSensor;
    const { query } = this.state;
    dispatch({
      type: 'adminSensor/adminSensorList',
      payload: {
        offset: (value && (value.current - 1) * 15),
        limit: (value && value.limit) || adminSensorData.limit,
        query: (value && value.query) || query,
      },
    });
  }

  // 显示详情页面
  showDetail(id) {
    const { dispatch } = this.props;
    this.setState({
      visible: true,
      sensorId: id,
    });
    dispatch({
      type: 'adminSensor/getGatewayStatus',
      payload: {
        id,
      }
    })
  }

  // 关闭详情页面
  handClose() {
    this.setState({
      visible: false,
      sensorId: '',
    })
  }

  render() {
    const { query, visible, sensorId, sensorState, stateData } = this.state;
    const { adminSensorData, sensorData } = this.props.adminSensor;
    const { rows, limit, current, count } = adminSensorData;
    const columns = this.getColumns(current);
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
        {/* 详情弹窗 */}
        <Modal
          visible={visible}
          title="传感器详情"
          onOk={this.handClose.bind(this)}
          onCancel={this.handClose.bind(this)}
          footer={[
            <Button key="back" size="small" onClick={this.handClose.bind(this)}>
              <FormattedMessage id="all.close" />
            </Button>
          ]}
        >
          <p>传感器ID：{sensorId}</p>
          {
            !G._.isEmpty(sensorData) ?
              <span>
                <p>传感器状态：{sensorState[sensorData.sensor_state].text}</p>
                <p>虚拟网关ID：{sensorData.virtual_gateway_id}</p>
                <p>虚拟网关状态：{stateData[sensorData.virtual_gateway_state].text}</p>
              </span>
              :
              ''
          }
        </Modal>
      </div>
    );
  }
}
