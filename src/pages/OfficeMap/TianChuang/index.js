// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';
import { connect } from 'dva';
import PageMapTemplate from '@/components/PageMapTemplate';
import G from '@/global';
import params from './config';

const offlineStrokeColor = '#DBDBDB';
const offlineFillColor = '#F3F3F3';
const activeStrokeColor = '#FF5A5F';
const activeFillColor = '#F7D7D9';
const freeStrokeColor = '#00A699';
const freeFillColor = '#C4E6E5';
const svgPath = require('@/static/tianchuang.svg');

@connect(({ officeMap }) => ({
  officeMap,
}))
class TianChuang extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offlineCount: params.length,
      vacantCount: 0,
      occupiedCount: 0,
    };
  }

  componentDidMount() {
    const background = document.getElementById('tianchuangsvg');
    background.addEventListener('load', this.svgLoaded.bind(this, background), false);
  }

  componentWillUnmount() {
    this.interval && clearInterval(this.interval);
  }

  /**
   * @method svg加载完成
   * @param {*} background
   */
  svgLoaded(background) {
    this.svgDoc = background.contentDocument;
    this.rect = this.svgDoc.getElementsByTagName('rect');
    this.interval = setInterval(() => {
      this.fetch();
    }, 3000);
    this.fetch();
  }

  fetch() {
    const { dispatch } = this.props;
    if (this.deskStatusLoading) return;
    this.deskStatusLoading = true;
    dispatch({
      type: 'officeMap/getDeviceStatus',
      payload: {
        callback: this.updateAllSvg.bind(this),
        tags: { tags: params },
        noFilter: true,
      },
    });
  }

  /**
   * @method 请求异常处理
   */
  fetchError() {
    this.offlineMode(this.rect);
    this.setCount({
      offlineCount: params.length,
      vacantCount: 0,
      occupiedCount: 0,
    });
  }

  /**
   * @method 设置所有元素为离线模式
   * @param {*} rect
   */
  offlineMode(rect) {
    if (!rect) return;
    for (let i = 0; i < rect.length; i += 1) {
      this.updateSvg(rect[i], offlineFillColor, offlineStrokeColor);
    }
  }

  /**
   * @method 更新 svg 所有元素，并且统计在线、离线个数
   * @param {*} data
   */
  updateAllSvg(response) {
    this.deskStatusLoading = false;
    if (response.status !== 'success') return;
    const { data } = response;
    let offlineCount = 0;
    let vacantCount = 0;
    let occupiedCount = 0;
    for (let i = 0; i < data.length; i += 1) {
      const { tag, humansensor, status } = data[i];
      const htmlId = tag.replace('_', '');
      const element = this.svgDoc.getElementById(htmlId);
      if (htmlId && element) {
        let fillColor = '';
        let strokeColor = '';
        if (status === 'offline') {
          offlineCount += 1;
          fillColor = offlineFillColor;
          strokeColor = offlineStrokeColor;
        } else if (parseInt(humansensor, 10) === 0) {
          vacantCount += 1;
          fillColor = freeFillColor;
          strokeColor = freeStrokeColor;
        } else {
          occupiedCount += 1;
          fillColor = activeFillColor;
          strokeColor = activeStrokeColor;
        }
        this.updateSvg(element, fillColor, strokeColor);
      }
    }
    this.setCount({
      offlineCount,
      vacantCount,
      occupiedCount,
    });
  }

  setCount(data) {
    this.setState(data);
  }

  updateSvg(element, fillColor, stroleColor) {
    element.setAttribute('fill', fillColor);
    element.setAttribute('stroke', stroleColor);
    element.setAttribute('fill-opacity', 1);
  }

  render() {
    const { offlineCount, vacantCount, occupiedCount } = this.state;
    const svgUrl = `${origin}/static/tianchuang.svg`;
    return (
      <PageMapTemplate
        offlineCount={offlineCount}
        vacantCount={vacantCount}
        occupiedCount={occupiedCount}
      >
        <iframe
          title="tianchuangsvg"
          src={G.env ? svgUrl : svgPath}
          width="100%"
          height="100%"
          id="tianchuangsvg"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          scrolling="yes"
        />
      </PageMapTemplate>
    );
  }
}

export default TianChuang;
