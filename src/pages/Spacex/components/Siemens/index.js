import React, { Component } from 'react';
import G from '@/global';
import { getUserInfo } from '@/utils/authority';
import { connect } from 'dva';

import styles from '../../SpaceStatus.less';
import { sensorD } from './SensorConfig';

const svgPath = require('@/static/siemens.svg');

const URL = process.IXAM_API;
const {
  strokeOffline,
  fillOffline,
  strokeVacant,
  fillVacant,
  strokeOccupied,
  fillOccupied,
} = G.svgColor;

@connect(() => ({}))
class Siemens extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const background = document.getElementById('backgroundsvg');
    background.addEventListener('load', this.svgLoaded.bind(this, background), false);
  }

  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
  }

  getUrl(sensor) {
    return `${URL}/devices/status`;
  }

  // svg加载完成
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
    const { dispatch } = this.props;
    if (this.deskStatusLoading) return;
    this.deskStatusLoading = true;
    dispatch({
      type: 'spacex/getDeviceStatus',
      payload: {
        callback: this.updateAllSvg.bind(this),
        tags: { tags: sensorD },
      },
    });
  }

  updateAllSvg(data) {
    this.deskStatusLoading = false;
    if (!data) {
      return;
    }
    let offlineCount = 0;
    let vacantCount = 0;
    let occupiedCount = 0;
    for (let i = 0; i < data.length; i += 1) {
      const { tag, humansensor, status } = data[i];
      const htmlId = tag.replace('_', '');
      const element = this.svgDoc.getElementById(htmlId);
      if (htmlId && element) {
        let stroke = '';
        let fill = '';
        if (status === 'offline') {
          offlineCount += 1;
          stroke = strokeOffline;
          fill = fillOffline;
        } else if (parseInt(humansensor, 10) === 0) {
          vacantCount += 1;
          stroke = strokeVacant;
          fill = fillVacant;
        } else {
          occupiedCount += 1;
          stroke = strokeOccupied;
          fill = fillOccupied;
        }
        this.updateSvg(element, stroke, fill);
      }
    }
    const { setCount } = this.props;
    setCount({
      offlineCount,
      vacantCount,
      occupiedCount,
    });
  }

  updateSvg(element, stroke, fill) {
    element.setAttribute('stroke', stroke);
    element.setAttribute('fill', fill);
  }

  offlineMode(rect) {
    if (!rect) return;
    for (let i = 0; i < rect.length; i += 1) {
      const htmlId = rect[i].getAttribute('id');
      if (htmlId.indexOf('kong') > -1) continue;
      this.updateSvg(rect[i], strokeOffline, fillOffline);
    }
  }

  render() {
    const { origin } = window.location;
    const svgUrl = `${origin}/static/siemens.svg`;

    const emptyWidth = document.body.clientWidth * 0.04;
    return (
      <div
        className={styles.svgRightAll}
        style={{
          width: document.body.clientWidth,
          minWidth: '800px',
          minHeight: ((document.body.clientWidth - emptyWidth) * 730) / 1366,
        }}
      >
        <iframe
          title="backgroundsvg"
          className={styles.svgPicAll}
          src={G.env ? svgUrl : svgPath}
          width="100%"
          height="100%"
          id="backgroundsvg"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          scrolling="yes"
        />
        <div style={{ width: emptyWidth }} />
      </div>
    );
  }
}

export default Siemens;