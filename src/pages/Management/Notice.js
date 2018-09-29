/* eslint-disable react/no-danger */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Table,
  Button,
  Input,
  Divider,
  Drawer,
  Icon,
  Pagination,
  Popconfirm,
  Popover
} from 'antd';

import G from '../../gobal';
import styles from './Notice.less';
import { routerRedux } from '../../../node_modules/dva/router';

@connect(({ manaNotice, loading, manaPerson }) => ({
  manaPerson,
  manaNotice,
  loading: loading.effects['manaNotice/fetch'],
}))

export default class Notice extends Component {
  // 表单以及分页
  state = {
    query: '',
    visible: false,
    detail: {
      title: '标题',
      lookNum: 20,
      lastTime: '2018-04',
      content: '<p>Hello World</p>',
    },
    noticeState: [],
    state: ['空', '已发送', '已接收', '待办', '已读']
  };

  componentDidMount() {
    const { dispatch, manaNotice } = this.props;
    const { current } = manaNotice.data;
    this.fetchDataList(current);
    dispatch({
      type: 'manaNotice/setCopyValue',
      payload: '',
    });
    // 请求全部人员
    dispatch({
      type: 'manaPerson/fetch',
      payload: {
        offset: 0,
        limit: 10000,
      },
    });
  }

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onSearch() {
    this.fetchDataList(1);
  }

  onChangeSearchInfo = e => {
    this.setState({ query: e.target.value });
  };

  // 详情
  onDetail(text) {
    this.setState({
      detail: {
        title: text.title,
        lookNum: text.viewCount,
        lastTime: text.createdAt,
        content: text.content,
      },
    });
    this.showDrawer();
  }

  handleClickChange = (noticeId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'manaNotice/getNoticeStat',
      payload: {
        noticeId,
        callback: (res) => {
          this.setState({
            noticeState: res.data.row
          })
        }
      },
    });
  }

  getColumns(current, noticeState, state) {
    const contest = (
      <div>
        {noticeState.map((comment) => (
          <p key={comment._id}><span>{comment.username || '暂无昵称'}</span><span style={{ float: 'right' }}>{state[comment.readingState]}</span></p>
        ))}
      </div>
    );
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
        title: '标题',
        dataIndex: 'title',
        width: '200px',
        key: 'title',
        render: text => {
          return <span className={styles.colSql}>{text}</span>;
        },
      },
      {
        title: '接收人',
        key: 'unreadCount',
        render: (text, record, index) => {
          return (
            <Fragment>
              <Popover
                placement="rightTop"
                content={contest}
                title="已送达人员"
                trigger="click"
                onClick={this.handleClickChange.bind(this, text.noticeId)}>
                <font style={{ cursor: 'pointer' }}>{`${text.viewCount}/${text.unreadCount + text.viewCount}`}</font>
              </Popover>
            </Fragment>
          )
        },
      },
      {
        title: '发布时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: text => {
          return <span>{G.moment(text).format('YYYY-MM-DD hh:mm:s')}</span>;
        },
      },
      {
        title: '操作',
        key: 'setting',
        render: (text, record, index) => (
          <Fragment>
            <Popconfirm
              placement="left"
              title={text.topStatus ? '确定要取消置顶此条通知吗？' : '确定要置顶此条通知吗？'}
              onConfirm={this.untiedConfirm.bind(this, text)}
              okText="确定"
              cancelText="取消"
            >
              <a>{text.topStatus ? '取消置顶' : '置顶'}</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a onClick={this.copyPush.bind(this, text)}>复制</a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                this.onDetail(text, record, index);
              }}
            >
              详情
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

  // 详情
  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  handleChange = () => { };

  copyPush = value => {
    const { dispatch } = this.props;
    const { values } = value;
    dispatch({
      type: 'manaNotice/setCopyValue',
      payload: values,
    });
    this.newNotice();
  };

  pageChange = pageNumber => {
    this.fetchDataList(pageNumber);
  };

  release() {
    this.fetchDataList(1);
  }

  // 置顶
  untiedConfirm(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'manaNotice/topNotice',
      payload: {
        status: !value.topStatus,
        noticeId: value.noticeId,
        callback: this.release.bind(this),
      },
    });
  }

  fetchDataList(current) {
    const { manaNotice, dispatch } = this.props;
    const { limit } = manaNotice.data;
    const { query } = this.state;
    dispatch({
      type: 'manaNotice/fetch',
      payload: {
        offset: (current - 1) * 15, limit, query
      },
    });
  }

  newNotice() {
    this.props.dispatch(routerRedux.push('/management/newNotice'))
  }

  render() {
    const { manaNotice, loading } = this.props;
    const { query, detail, visible, noticeState, state } = this.state;
    const { limit, current, count } = manaNotice.data;
    const columns = this.getColumns(current, noticeState, state);
    const suffix = query ? <Icon type="close-circle" onClick={this.emitEmpty.bind(this)} /> : null;
    return (
      <div className={styles.main}>
        <h3>通知管理</h3>
        <br />
        <Row className={styles.lageBox}>
          <p>通知列表</p>
          {/* 查询 */}
          <Col span={12}>
            <Button icon="plus" type="primary" onClick={this.newNotice.bind(this)}>
              新建
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
              value={query}
              className={styles.widthInput}
              placeholder="标题"
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
          {/* 表单 */}
          <Col span={24}>
            <Table
              rowKey="_id"
              loading={loading}
              dataSource={manaNotice.data.row}
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
        <Drawer
          width={512}
          closable={true}
          title={detail.title}
          placement="right"
          onClose={this.onClose}
          visible={visible}
        >
          <p>
            <Icon type="eye-o" style={{ marginRight: '6px' }} />
            {detail.lookNum}
            <Icon type="clock-circle-o" style={{ marginLeft: '18px', marginRight: '6px' }} />
            {G.moment(detail.lastTime).format('YYYY-MM-DD hh:mm:s')}
          </p>
          <br />
          <br />
          <div dangerouslySetInnerHTML={{ __html: detail.content }} />
        </Drawer>
      </div>
    );
  }
}
