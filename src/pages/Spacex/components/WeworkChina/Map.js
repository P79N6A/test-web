// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';
import G from '@/global';
import { connect } from 'dva';
import { updateSvgElement } from '@/utils/utils';
import { wework3FloorSensors, wework5FloorSensors, wework6FloorSensors } from './SensorConfig';
import styles from './index.less';

const svg3FloorPath = require('@/static/weworkChina3Floor.svg');
const svg5FloorPath = require('@/static/weworkChina5Floor.svg');
const svg6FloorPath = require('@/static/weworkChina6Floor.svg');
const svg3FloorPathNumber = require('@/static/weworkChina3FloorNumber.svg');
const svg5FloorPathNumber = require('@/static/weworkChina5FloorNumber.svg');
const svg6FloorPathNumber = require('@/static/weworkChina6FloorNumber.svg');

const sensorsArr = [wework3FloorSensors, wework5FloorSensors, wework6FloorSensors];
const { env } = G;

@connect(() => ({}))
class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate() {
    this.loadSvg();
  }

  componentDidMount() {
    this.loadSvg();
  }

  componentWillUnmount() {
    this.interval && clearInterval(this.interval);
  }

  loadSvg() {
    const { index } = this.props;
    this.svgDoc = null;
    this.rect = null;
    const background = document.getElementById(`weworkChina${index}`);
    background.addEventListener('load', this.svgLoaded.bind(this, background), false);
  }

  svgLoaded(background) {
    this.svgDoc = background.contentDocument;
    this.rect = this.svgDoc.getElementsByTagName('rect');
    this.startInterval();
  }

  startInterval() {
    this.interval = setInterval(() => {
      this.fetch();
    }, 3000);
  }

  fetch() {
    if (this.deskStatusLoading) return;
    const { dispatch, index } = this.props;
    this.deskStatusLoading = true;
    dispatch({
      type: 'spacex/getDeviceStatus',
      payload: {
        callback: this.updateAllSvg.bind(this),
        tags: { tags: sensorsArr[index] },
      },
    });
  }

  updateAllSvg(data) {
    this.deskStatusLoading = false;
    if (!data || !this.svgDoc) {
      return;
    }
    updateSvgElement(data, this.svgDoc, this.updateSvg.bind(this));
  }

  updateSvg(element, stroke, fill) {
    element.setAttribute('stroke', stroke);
    element.setAttribute('fill', fill);
  }

  getSvgSrc(index) {
    const { origin } = window.location;
    const svg3FloorUrl = `${origin}/static/weworkChina3Floor.svg`;
    const svg5FloorUrl = `${origin}/static/weworkChina5Floor.svg`;
    const svg6FloorUrl = `${origin}/static/weworkChina6Floor.svg`;
    const svg3FloorUrlNumber = `${origin}/static/weworkChina3FloorNumber.svg`;
    const svg5FloorUrlNumber = `${origin}/static/weworkChina5FloorNumber.svg`;
    const svg6FloorUrlNumber = `${origin}/static/weworkChina6FloorNumber.svg`;
    const svgArr = {
      // 不带编号
      regular: [
        { path: svg3FloorPath, url: svg3FloorUrl },
        { path: svg5FloorPath, url: svg5FloorUrl },
        { path: svg6FloorPath, url: svg6FloorUrl },
      ],
      // 带编号
      haveNumber: [
        { path: svg3FloorPathNumber, url: svg3FloorUrlNumber },
        { path: svg5FloorPathNumber, url: svg5FloorUrlNumber },
        { path: svg6FloorPathNumber, url: svg6FloorUrlNumber },
      ],
    };
    return env ? svgArr.haveNumber[index].url : svgArr.haveNumber[index].path;
  }

  render() {
    const { index } = this.props;
    const src = this.getSvgSrc(index);
    return (
      <div className={styles.svgContainer}>
        <iframe
          title="weworkChina"
          className={styles.svg}
          src={src}
          width="100%"
          height="100%"
          id={`weworkChina${index}`}
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          scrolling="yes"
        />
      </div>
    );
  }
}

export default Map;
