// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import StationRate from './StationRate';
import ServiceDuration from './ServiceDuration';
import Deskcount from './DeskCount';
import Yusecount from './YuseCount';
import Yunusecount from './YunuseCount';
import DeskDuration from './DeskDuration';
import DeskUseDuration from './DeskUseDuration';
import G from '@/global';
import { getUserInfo } from '@/utils/authority';

@connect(({ spacexOffice, user, loading }) => ({
  spacexOffice,
  user,
  loading: loading.effects['spacexOffice/getUseRate'],
}))
export default class OfficeUsage extends Component {
  state = {
    type: 'WEEKLY',
    desk_use_rank_HOT: false,
    desk_use_rank_FREE: false,
  };

  componentWillMount() {
    const userInfo = getUserInfo();
    const user = JSON.parse(userInfo);
    this.token = user.token;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'spacexOffice/checkLoginStatus',
      payload: {
        callback: this.requestAllData.bind(this),
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    const { user } = nextProps.user;
    if (user && user.token && this.token !== user.token && this.token) {
      const { dispatch } = this.props;
      dispatch({
        type: 'spacexOffice/checkLoginStatus',
        payload: {
          callback: this.requestAllData.bind(this),
        },
      });
      this.token = user.token;
    }
  }

  getUseRate() {
    const { dispatch } = this.props;
    const dates = G.moment(new Date()).format('YYYY-MM-DD');
    dispatch({ type: 'spacexOffice/getUseRate', payload: { type: 'WEEKLY', date: dates } });
  }

  setVisible(params) {
    const { state } = this;
    this.setState({
      ...state,
      ...params,
    });
  }

  requestAllData(response) {
    if (response.status === 'success') {
      this.fetchData();
      if (this.hotRank) this.hotRank.fetchData();
      if (this.freeRank) this.freeRank.fetchData();
      if (this.deskDuration) this.deskDuration.fetchData();
    }
  }

  fetchData() {
    const { dispatch } = this.props;
    dispatch({ type: 'spacexOffice/getDeskCount' });
    dispatch({ type: 'spacexOffice/getYuseCount' });
    dispatch({ type: 'spacexOffice/getYunuseCount' });
    dispatch({ type: 'spacexOffice/getYpeakCount' });
    dispatch({ type: 'spacexOffice/getServiceDuration' });
    this.getUseRate({});
  }

  render() {
    const { desk_use_rank_HOT, desk_use_rank_FREE } = this.state;
    const { spacexOffice, dispatch } = this.props;
    const {
      useRate,
      daskTotalCount,
      yesterdayUseCount,
      serviceDuration,
      deskAvgDuration,
      deskUseRank_hot,
      deskUseRank_free,
    } = spacexOffice;

    const topColResponsiveProps = {
      xs: 24,
      sm: 24,
      md: 12,
      lg: 12,
      xl: 8,
      xxl: 8,
      style: { marginBottom: 24 },
    };

    const deskrankprops = {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 12,
      xl: 12,
      style: { marginBottom: 24 },
    };

    return (
      <Fragment>
        {/* one */}
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <Deskcount daskTotalCount={daskTotalCount} />
          </Col>
          <Col {...topColResponsiveProps}>
            <Yusecount yesterdayUseCount={yesterdayUseCount} />
          </Col>
          <Col {...topColResponsiveProps}>
            <Yunusecount yesterdayUseCount={yesterdayUseCount} />
          </Col>
        </Row>
        {/* two */}
        <Row gutter={24}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <StationRate useRate={useRate} dispatch={dispatch} />
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <ServiceDuration serviceDuration={serviceDuration} />
          </Col>
        </Row>
        {/* three */}
        <DeskDuration
          ref={o => {
            this.deskDuration = o;
          }}
          deskAvgDuration={deskAvgDuration}
          dispatch={dispatch}
        />
        {/* four */}
        <Row gutter={24}>
          <Col {...deskrankprops}>
            <DeskUseDuration
              ref={o => {
                this.hotRank = o;
              }}
              desk_use_rank={desk_use_rank_HOT}
              deskUseRank={deskUseRank_hot}
              color="rgba(252, 176, 177, 1)"
              dispatch={dispatch}
              setVisible={this.setVisible.bind(this)}
            />
          </Col>
          <Col {...deskrankprops}>
            <DeskUseDuration
              ref={o => {
                this.freeRank = o;
              }}
              desk_use_rank={desk_use_rank_FREE}
              deskUseRank={deskUseRank_free}
              color="rgba(166, 214, 208, 1)"
              dispatch={dispatch}
              setVisible={this.setVisible.bind(this)}
            />
          </Col>
        </Row>
      </Fragment>
    );
  }
}
