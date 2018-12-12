import React, { Component } from 'react';
import G from '@/global';
import { connect } from 'dva';
import { globalSensor, demoSensor } from '../Map/config';
import styles from '../index.less';

const svgPath = require('@/static/global.svg');

const {
  strokeOffline,
  fillOffline,
  strokeVacant,
  fillVacant,
  strokeOccupied,
  fillOccupied,
} = G.svgColor;

@connect(({ globalStatus }) => ({
  globalStatus,
}))
class SvgMap extends Component {
  componentDidMount() {
    const background = document.getElementById('globalsvg');
    background.addEventListener('load', this.svgLoaded.bind(this, background), false);
  }

  componentWillUnmount() {
    if (this.globalInterval) clearInterval(this.globalInterval);
    if (this.demoInterval) clearInterval(this.demoInterval);
  }

  svgLoaded(background) {
    this.svgDoc = background.contentDocument;
    this.rect = this.svgDoc.getElementsByTagName('rect');
    this.startGlobalInterval();
    this.startDemoInterval();
  }

  startGlobalInterval() {
    this.globalInterval = setInterval(() => {
      this.fetch('global');
    }, 3000);
    this.fetch('global');
  }

  startDemoInterval() {
    this.demoInterval = setInterval(() => {
      this.fetchDemo('demo');
    }, 1000 * 10);
    this.fetchDemo('demo');
  }

  fetch(type) {
    const { dispatch } = this.props;
    if (this.deskStatusLoading) return;
    this.deskStatusLoading = true;
    dispatch({
      type: 'globalStatus/getDeviceStatus',
      payload: {
        callback: this.updateAllSvg.bind(this, type),
        tags: { tags: globalSensor },
      },
    });
  }

  fetchDemo(type) {
    const { dispatch } = this.props;
    dispatch({
      type: 'globalStatus/getDemoDeviceStatus',
      payload: {
        callback: this.updateAllSvg.bind(this, type),
        tags: { tags: demoSensor },
      },
    });
  }

  updateAllSvg(type, data) {
    if (type === 'global') this.deskStatusLoading = false;
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
      type,
    });
  }

  updateSvg(element, stroke, fill) {
    element.setAttribute('stroke', stroke);
    element.setAttribute('fill', fill);
  }

  render() {
    const svgUrl = `${origin}/static/global.svg`;
    return (
      <div className={styles.svg}>
        <iframe
          title="globalsvg"
          src={G.env ? svgUrl : svgPath}
          className={styles.svgView}
          width="100%"
          height="100%"
          id="globalsvg"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          scrolling="yes"
        />
      </div>
    );
  }
}

export default SvgMap;
