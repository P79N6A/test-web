// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';
import { connect } from 'dva';
import G from '@/global';

import styles from './index.less';
import { tags, boothArr } from './config';

const svgPath = require('@/static/beijingfun.svg');

@connect(() => ({}))
export default class WeworkFun extends Component {
  componentDidMount() {
    const background = document.getElementById('beijingfun');
    background.addEventListener('load', this.svgLoaded.bind(this, background), false);
  }

  svgLoaded(background) {
    this.svgDoc = background.contentDocument;
    this.rect = this.svgDoc.getElementsByTagName('rect');
    this.interval = setInterval(() => {
      this.fetch();
    }, 3000);
    this.fetch();
  }

  componentWillUnmount() {
    this.interval && clearInterval(this.interval);
  }

  fetch() {
    const { dispatch } = this.props;
    if (this.deskStatusLoading) return;
    this.deskStatusLoading = true;
    dispatch({
      type: 'officeMap/getDeviceStatus',
      payload: {
        callback: this.updateAllSvg.bind(this),
        tags: { tags },
        noFilter: true,
      },
    });
  }

  updateAllSvg(response) {
    this.deskStatusLoading = false;
    if (response.status !== 'success') return;
    const { data } = response;
    for (let i = 0; i < data.length; i += 1) {
      const { tag, humansensor, status } = data[i];
      const htmlId = tag.replace('_', '');
      const element = this.svgDoc.getElementById(htmlId);
      if (!element) continue;
      if (status === 'offline') {
        this.updateSvg(element, '#cccccc', '#666666', 1);
        continue;
      }
      if (parseInt(humansensor) === 1) {
        this.updateSvg(element, '#F5CECE', '#FA7676', 1);
        continue;
      }
      this.updateSvg(element, '#00A699', '#00A699', 0.2);
    }
    this.updateBooth(data);
  }

  updateBooth(data) {
    for (let i = 0; i < boothArr.length; i++) {
      const booth = G._.filter(data, value => {
        const { tag } = value;
        const htmlId = tag.replace('_', '');
        return boothArr[i].includes(htmlId);
      });
      let offlineLength = 0;
      let occupiedLength = 0;
      for (let j = 0; j < booth.length; j++) {
        const { humansensor, status } = booth[j];
        if (status === 'offline') {
          offlineLength++;
          continue;
        }
        if (parseInt(humansensor) === 1) {
          occupiedLength++;
          continue;
        }
      }
      const element = this.svgDoc.getElementById(boothArr[i].toString());
      if (offlineLength === booth.length) {
        this.updateSvg(element, '#cccccc', '#666666', 1);
      } else if (occupiedLength > 0) {
        this.updateSvg(element, '#F5CECE', '#FA7676', 1);
      } else {
        this.updateSvg(element, '#00A699', '#00A699', 0.2);
      }
    }
  }

  updateSvg(element, fillColor, stroleColor, opacity) {
    element.setAttribute('fill', fillColor);
    element.setAttribute('stroke', stroleColor);
    element.setAttribute('fill-opacity', opacity);
  }

  render() {
    const svgUrl = `${origin}/static/beijingfun.svg`;
    return (
      <div className={styles.main}>
        <iframe
          title="beijingfun"
          src={G.env ? svgUrl : svgPath}
          width="1024px"
          height="768px"
          id="beijingfun"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          scrolling="no"
        />
      </div>
    );
  }
}
