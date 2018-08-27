import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Table, Button, Input, Divider, Pagination } from 'antd';

import styles from './Person.less';
import PersonModal from './components/PersonModal';

@connect(({ manaPerson, user, loading }) => ({
  manaPerson,
  user,
  loading: loading.effects['manaPerson/fetch'],
}))
export default class Wework extends Component {
  // 表单以及分页
  state = {
    quire: '',
    filteredInfo: {},
    loading: false,
    visible: false,
    editValue: {},
  };

  componentDidMount() {
    const { manaPerson } = this.props;
    const { currentPage, currentNum } = manaPerson.data;
    this.fetchDataList(currentPage, currentNum);
  }

  onSearch() {
    const { manaPerson } = this.props;
    const { currentNum } = manaPerson.data;
    const { quire } = this.state;
    this.fetchDataList(1, currentNum, quire);
  }

  onChangeSearchInfo = e => {
    this.setState({ quire: e.target.value });
  };

  onEdit(text) {
    this.setState({
      visible: true,
      editValue: text,
    });
  }

  onDelete(text, record, index) {
    // console.log('********* 删除 ******** ', text, record, index);
  }

  getColumns(filteredInfo) {
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '手机',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '职务',
        dataIndex: 'duty',
        key: 'duty',
      },
      {
        title: '使用状态',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: '备注',
        dataIndex: 'mark',
        key: 'mark',
        filters: [
          { text: '管理员', value: '管理员' },
          { text: '内部员工', value: '内部员工' },
          { text: '游客', value: '游客' },
        ],
        filteredValue: filteredInfo.mark || null,
        onFilter: (value, record) => record.mark.includes(value),
      },
      {
        title: '操作',
        key: 'setting',
        render: (text, record, index) => (
          <Fragment>
            <a
              onClick={() => {
                this.onEdit(text, record, index);
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                this.onDelete(text, record, index);
              }}
            >
              删除
            </a>
          </Fragment>
        ),
      },
    ];
    return columns;
  }

  // 弹窗
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    // console.log('******* handleOK ******* ', fieldsValue);
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  };

  handleCancel = () => {
    this.setState({ visible: false, editValue: {} });
  };

  handleChange = (pagination, filters) => {
    this.setState({
      filteredInfo: filters,
    });
  };

  pageChange = pageNumber => {
    const { manaPerson } = this.props;
    const { currentNum } = manaPerson.data;
    const { quire } = this.state;
    this.fetchDataList(pageNumber, currentNum, quire);
  };

  fetchDataList(currentPage, currentNum, quire) {
    const { dispatch } = this.props;
    dispatch({
      type: 'manaPerson/fetch',
      payload: { currentPage, currentNum, quire },
    });
  }

  render() {
    const { manaPerson, user } = this.props;
    const { filteredInfo, loading, visible, editValue } = this.state;
    const columns = this.getColumns(filteredInfo);
    const { currentNum, currentPage, totalNum } = manaPerson.data;
    return (
      <div className={styles.main}>
        <h3>人员管理</h3>
        <br />
        <Row className={styles.lageBox}>
          {/* 查询 */}
          <Col span={12}>
            <Button icon="plus" type="primary" onClick={this.showModal}>
              添加
            </Button>
          </Col>
          <Col span={12}>
            <Button
              className={styles.rights}
              icon="search"
              type="primary"
              onClick={this.onSearch.bind(this)}
            >
              搜索
            </Button>
            <Input
              className={styles.widthInput}
              placeholder="姓名 / 手机 / 备注"
              onChange={this.onChangeSearchInfo.bind(this)}
            />
          </Col>
          <br />
        </Row>
        <Row className={styles.lageBox}>
          {/* 表单 */}
          <Col span={24}>
            <Table
              rowKey="id"
              dataSource={manaPerson.data.dataList}
              columns={columns}
              onChange={this.handleChange.bind(this)}
              pagination={false}
            />
            <Pagination
              style={{ marginTop: 20, float: 'right' }}
              current={currentPage}
              showQuickJumper
              total={totalNum}
              pageSize={currentNum}
              onChange={this.pageChange.bind(this)}
            />
          </Col>
        </Row>
        {/* 弹窗 */}
        <PersonModal
          user={user}
          visible={visible}
          loading={loading}
          editValue={editValue}
          handleOk={this.handleOk.bind(this)}
          handleCancel={this.handleCancel.bind(this)}
        />
      </div>
    );
  }
}
