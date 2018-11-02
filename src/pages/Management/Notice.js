/* eslint-disable react/no-danger */
import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
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
  Popover,
  Tooltip
} from 'antd';

import G from '@/global';
import styles from './Notice.less';
import { routerRedux } from 'dva/router';

@connect(({ ManagementNotice, loading, ManagementPerson }) => ({
  ManagementPerson,
  ManagementNotice,
  loading: loading.effects['ManagementNotice/fetch'],
}))

export default class Notice extends Component {
  // 表单以及分页
  state = {
    query: '',
    detail: {
      title: 'Title',
      lookNum: 20,
      lastTime: '2018-04',
      content: '<p>Hello World</p>',
    },
    noticeState: [],
    state: [formatMessage({ id: 'notice.empty' }), formatMessage({ id: 'notice.send' }), formatMessage({ id: 'notice.revice' }), formatMessage({ id: 'notice.upcoming' }), formatMessage({ id: 'notice.read' })]
  };

  componentDidMount() {
    const { dispatch, ManagementNotice } = this.props;
    const { current } = ManagementNotice.data;
    this.fetchDataList(current);
    dispatch({
      type: 'ManagementNotice/setCopyValue',
      payload: '',
    });
  }

  onSearch() {
    this.fetchDataList(1);
  }

  onChangeSearchInfo = e => {
    this.setState({ query: e.target.value });
  };

  handleClickChange = (noticeId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ManagementNotice/getNoticeStat',
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
          <p key={comment._id}><span>{comment.username || formatMessage({ id: 'notice.no.nickname' })}</span><span style={{ float: 'right' }}>{state[comment.readingState]}</span></p>
        ))}
      </div>
    );
    const columns = [
      {
        title: formatMessage({ id: 'all.serial.number' }),
        key: 'id',
        width: 100,
        render: (text, record, index) => (
          <Fragment>
            <font>{(current - 1) * 15 + index + 1}</font>
          </Fragment>
        ),
      },
      {
        title: formatMessage({ id: 'notice.title' }),
        key: 'title',
        render: (text) => {
          return (
            <Fragment>
              <Tooltip placement="topLeft" title={text.title}>
                <span onClick={this.goDetail.bind(this, text)} className={styles.colSql}>
                  <span className={styles.titleTop} style={{ opacity: text.topStatus ? '1' : '0' }}>置顶</span>
                  {text.title}
                </span>
              </Tooltip>
            </Fragment>
          )
        }
      },
      {
        title: formatMessage({ id: 'notice.receiver' }),
        key: 'unreadCount',
        width: 150,
        render: (text, record, index) => {
          return (
            <Fragment>
              <Popover
                placement="rightTop"
                content={contest}
                title={formatMessage({ id: 'notice.delivered' })}
                trigger="click"
                onClick={this.handleClickChange.bind(this, text.noticeId)}>
                <font style={{ cursor: 'pointer' }}>{`${text.viewCount}/${text.unreadCount + text.viewCount}`}</font>
              </Popover>
            </Fragment>
          )
        },
      },
      {
        title: formatMessage({ id: 'notice.release.time' }),
        key: 'createdAt',
        render: (text) => {
          return (
            <Fragment>
              <Tooltip placement="topLeft" title={G.moment(text.createdAt).format('YYYY-MM-DD hh:mm:ss')}>
                <span>{G.moment(text.createdAt).format('YYYY-MM-DD hh:mm:ss')}</span>
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
            <Popconfirm
              placement="left"
              title={text.topStatus ? formatMessage({ id: 'notice.down.message' }) : formatMessage({ id: 'notice.top.message' })}
              onConfirm={this.untiedConfirm.bind(this, text)}
              okText={formatMessage({ id: 'all.certain' })}
              cancelText={formatMessage({ id: 'all.cancel' })}
            >
              <a>{text.topStatus ? formatMessage({ id: 'notice.unpin' }) : formatMessage({ id: 'notice.topping' })}</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a onClick={this.copyPush.bind(this, text)}><FormattedMessage id='notice.copy' /></a>
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

  handleChange = () => { };

  copyPush = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ManagementNotice/setCopyValue',
      payload: value,
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
      type: 'ManagementNotice/topNotice',
      payload: {
        status: !value.topStatus,
        noticeId: value.noticeId,
        callback: this.release.bind(this),
      },
    });
  }

  fetchDataList(current) {
    const { ManagementNotice, dispatch } = this.props;
    const { limit } = ManagementNotice.data;
    const { query } = this.state;
    dispatch({
      type: 'ManagementNotice/fetch',
      payload: {
        offset: (current - 1) * 15, limit, query
      },
    });
  }

  newNotice() {
    this.props.dispatch(routerRedux.push('/management/newNotice'))
  }

  goDetail(text) {
    const { dispatch } = this.props;
    dispatch({
      type: 'ManagementNotice/setCopyValue',
      payload: text,
    });
    this.props.dispatch(routerRedux.push('/management/detailNotice'))
  }

  render() {
    const { ManagementNotice, loading } = this.props;
    const { query, noticeState, state } = this.state;
    const { limit, current, count } = ManagementNotice.data;
    const columns = this.getColumns(current, noticeState, state);
    const suffix = query ? <Icon type="close-circle" onClick={this.emitEmpty.bind(this)} /> : null;
    return (
      <div className={styles.main}>
        <h3><FormattedMessage id='menu.management.notice' /></h3>
        <br />
        <Row className={styles.lageBox}>
          <p><FormattedMessage id='notice.list' /></p>
          {/* 查询 */}
          <Col span={6}>
            <Button icon="plus" type="primary" size='small' onClick={this.newNotice.bind(this)}>
              <FormattedMessage id='all.add' />
            </Button>
          </Col>
          <Col span={18}>
            <Button
              className={styles.rights}
              size='small'
              icon="search"
              type="primary"
              onClick={this.onSearch.bind(this)}
            >
              <FormattedMessage id='all.search' />
            </Button>
            <Input
              value={query}
              className={styles.widthInput}
              placeholder={formatMessage({ id: 'notice.title' })}
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
              dataSource={ManagementNotice.data.row}
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
