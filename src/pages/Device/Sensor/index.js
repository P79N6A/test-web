// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import { Row, Col, Icon, Button, Input, Tooltip, Table, Pagination, Divider, message } from 'antd';
import G from '@/global';
import styles from './index.less';
import RemarkModal from './components/RemarkModel'

@connect(({ Sensor, loading }) => ({
  Sensor,
  loading: loading.effects['Sensor/sensorList'],
}))
class Sensor extends Component {
  state = {
    query: '',
    filterParam: {},
    sortParam: {},
    visible: false,
    editValue: {},
  }

  componentDidMount() {
    this.fetchDataList({ current: 1 });
  }

  // 获取搜索框值
  onChangeSearchInfo = e => {
    this.setState({ query: e.target.value });
  };

  // 搜索
  onSearch() {
    this.fetchDataList();
  }

  // 备注弹窗
  onMark(text) {
    this.setState({
      visible: true,
      editValue: text,
    });
  }

  // 表格数据展示
  getColumns(current, sortOrder, stateList) {
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
        title: formatMessage({ id: "gateway.list.number" }),
        key: 'tag',
        sorter: true,
        sortOrder: G._.isEmpty(sortOrder) ? undefined : `${sortOrder}end`,
        render: (text, record, index) => (
          <Fragment>
            <Tooltip placement="topLeft" title={text.tag}>
              <font>{text.tag}</font>
            </Tooltip>
          </Fragment>
        ),
      },
      {
        title: formatMessage({ id: 'device.list.status' }),
        key: 'inUse',
        filters: stateList,
        render: (text) => {
          return (
            <Fragment>
              <Tooltip placement="topLeft" title={text.inUse}>
                <span>{text.inUse}</span>
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
        title: formatMessage({ id: "sensor.list.last-time" }),
        key: 'updatedAt',
        render: (text) => {
          return (
            <Fragment>
              <Tooltip placement="topLeft" title={G.moment(text.updatedAt).format('YYYY-MM-DD HH:mm:ss')}>
                <span>{G.moment(text.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</span>
              </Tooltip>
            </Fragment>
          )
        },
      },
      {
        title: formatMessage({ id: 'all.operating' }),
        width: 170,
        render: (text, record, index) => (
          <Fragment>
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
    const { sortParam } = this.state;
    const filterParam = !G._.isEmpty(filters) ? filters : {};
    const sortParams = G._.isEmpty(sortParam) ? 'desc' : sortParam === 'desc' ? 'asc' : {};
    this.setState({
      filterParam,
      sortParam: sortParams,
    });
    this.fetchDataList({ filterParam, sortParams });
  };

  // 清空搜索框内容
  emitEmpty = () => {
    this.userNameInput.focus();
    this.setState({ query: '' });
  };

  // 分页获取数据
  pageChange = pageNumber => {
    this.fetchDataList({ current: pageNumber });
  };

  // enter 键搜索
  handelKeydown = e => {
    if (e.keyCode === 13) {
      this.onSearch();
    }
  };

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
    this.setState({ visible: false, editValue: {} });
  };

  // 调用备注的接口
  addRemark(data) {
    const { dispatch } = this.props;
    dispatch({
      type: 'Sensor/sensorRemark',
      payload: data,
    });
  }

  // 获取列表
  fetchDataList(value) {
    const { dispatch, Sensor } = this.props;
    const { sensorData } = Sensor;
    const { query, sortParam, filterParam } = this.state;
    dispatch({
      type: 'Sensor/sensorList',
      payload: {
        offset: (value && (value.current - 1) * 15),
        limit: (value && value.limit) || sensorData.limit,
        query: (value && value.query) || query,
        sortParam: G._.isEmpty((value && value.sortParams) || sortParam) ? '' : { tag: (value && value.sortParams) || sortParam },
        filterParam: G._.isEmpty((value && value.filterParam) || filterParam) ? '' : ((value && value.filterParam) || filterParam),
      },
    });
  }

  render() {
    const { query, sortParam, editValue, visible } = this.state;
    const { loading, Sensor } = this.props;
    const { stateList, sensorData } = Sensor;
    const { rows, limit, current, count } = sensorData;
    const suffix = query ? <Icon type="close-circle" onClick={this.emitEmpty.bind(this)} /> : null;
    const columns = this.getColumns(current, sortParam, stateList);
    return (
      <div className={styles.main}>
        <h3><FormattedMessage id="sensor.list.management" /></h3>
        <br />
        <Row className={styles.lageBox}>
          <p><FormattedMessage id="sensor.list" /></p>
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
              placeholder={formatMessage({ id: "sensor.list.number-remark" })}
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
              rowKey="deviceId"
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
        {/* 弹窗 */}
        <RemarkModal
          visible={visible}
          editValue={editValue}
          handleOk={this.handleOk.bind(this)}
          handleCancel={this.handleCancel.bind(this)}
        />
      </div>
    );
  }
}

export default Sensor;