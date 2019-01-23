// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';
import { connect } from 'dva';
import G from '@/global';
import PageMapTemplate from '@/components/PageMapTemplate';

const params = ['A2_1202', 'A2_1203', 'A2_1204', 'A2_1327', 'A2_1328'];
const offlineColor = '#DFE4E8';
const activeColor = '#FCB0B1';
const freeColor = '#BDE4E1';
const svgPath = require('@/static/microsoft.svg');

@connect(() => ({}))
class MicrosoftHall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offlineCount: params.length,
      vacantCount: 0,
      occupiedCount: 0,
    };
  }

  componentDidMount() {
    const background = document.getElementById('microsoftsvg');
    background.addEventListener('load', this.svgLoaded.bind(this, background), false);
  }

  componentWillUnmount() {
    this.interval && clearInterval(this.interval);
  }

  // svg加载完成
  svgLoaded(background) {
    this.svgDoc = background.contentDocument;
    this.rect = this.svgDoc.getElementsByTagName('rect');
    this.path = this.svgDoc.getElementsByTagName('path');
    this.interval = setInterval(() => {
      this.fetch();
    }, 3000);
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

  // 请求异常处理
  fetchError() {
    this.offlineMode(this.rect, this.path);
    this.setCount({
      offlineCount: params.length,
      vacantCount: 0,
      occupiedCount: 0,
    });
  }

  // 设置所有元素为离线模式
  offlineMode(rect, path) {
    if (!rect || !path) return;
    for (let i = 0; i < rect.length; i += 1) {
      this.updateSvg(rect[i], offlineColor);
    }
    for (let i = 0; i < path.length; i += 1) {
      this.updateSvg(path[i], offlineColor);
    }
  }

  // 更新 svg 所有元素，并且统计在线、离线个数
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
        let color = '';
        if (status === 'offline') {
          offlineCount += 1;
          color = offlineColor;
        } else if (parseInt(humansensor, 10) === 0) {
          vacantCount += 1;
          color = freeColor;
        } else {
          occupiedCount += 1;
          color = activeColor;
        }
        this.updateSvg(element, color);
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

  updateSvg(element, color) {
    element.setAttribute('fill', color);
  }

  render() {
    const { offlineCount, vacantCount, occupiedCount } = this.state;
    const svgUrl = `${origin}/static/microsoft.svg`;
    return (
      <PageMapTemplate
        offlineCount={offlineCount}
        vacantCount={vacantCount}
        occupiedCount={occupiedCount}
      >
        <iframe
          title="microsoftsvg"
          src={G.env ? svgUrl : svgPath}
          width="100%"
          height="100%"
          id="microsoftsvg"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          scrolling="yes"
        />
      </PageMapTemplate>
    );
  }
}

export default MicrosoftHall;
