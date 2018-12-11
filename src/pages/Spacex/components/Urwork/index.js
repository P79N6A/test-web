import React, { Component } from 'react';
import G from '@/global';
import { connect } from 'dva';
import styles from '../../SpaceStatus.less';
import { sensorA, sensorB, sensorC } from './SensorConfig';
import TimeText from '../TimeText';

const sensors = [];
sensors.push(...sensorA, ...sensorB, ...sensorC);
const defaultTable = {
  A21258: { humansensor: '0', status: 'offline' },
  A21240: { humansensor: '0', status: 'offline' },
  A21306: { humansensor: '0', status: 'offline' },
  A21271: { humansensor: '0', status: 'offline' },
};
const defaultTwins = {
  A21221: { humansensor: '0', status: 'offline' },
  A21215: { humansensor: '0', status: 'offline' },
};
const {
  strokeOffline,
  fillOffline,
  strokeVacant,
  fillVacant,
  strokeOccupied,
  fillOccupied,
} = G.svgColor;

@connect(() => ({}))
export default class Urwork extends Component {
  constructor(props) {
    super(props);
    this.defaultTable = defaultTable;
    this.defaultTwins = defaultTwins;
  }

  componentDidMount() {
    const background = document.getElementById('backgroundsvg');
    background.addEventListener('load', this.svgLoaded.bind(this, background), false);
  }

  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
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
    if (this.deskStatusLoading) return;
    this.deskStatusLoading = true;
    const { dispatch } = this.props;
    dispatch({
      type: 'spacex/getDeviceStatus',
      payload: {
        callback: this.updateAllSvg.bind(this),
        tags: { tags: sensors },
      },
    });
  }

  updateAllSvg(data) {
    this.deskStatusLoading = false;
    if (!data) return;
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
        if (defaultTable[htmlId]) {
          this.defaultTable[htmlId] = { humansensor, status };
          fill = stroke;
        }
        if (defaultTwins[htmlId]) {
          this.defaultTwins[htmlId] = { humansensor, status };
          fill = stroke;
        }
        this.updateSvg(element, stroke, fill);
      }
    }
    const tableSvg = this.svgDoc.getElementById('A21258-A21240-A21306-A21271');
    const twinsSvg = this.svgDoc.getElementById('A21221-A21215');
    if (tableSvg) this.updateTable(tableSvg, this.defaultTable);
    if (twinsSvg) this.updateTable(twinsSvg, this.defaultTwins);
    const { setCount } = this.props;
    setCount({
      offlineCount,
      vacantCount,
      occupiedCount,
    });
  }

  updateTable(element, data) {
    let onlineCount = 0;
    let occupyCount = 0;
    G._.forEach(data, value => {
      if (value.status === 'online') onlineCount += 1;
      if (parseInt(value.humansensor, 10) === 1 && value.status === 'online') occupyCount += 1;
    });
    const stroke =
      onlineCount === 0 ? strokeOffline : occupyCount === 0 ? strokeVacant : strokeOccupied;
    const fill = onlineCount === 0 ? fillOffline : occupyCount === 0 ? fillVacant : fillOccupied;
    this.updateSvg(element, stroke, fill);
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
    const { pathname, origin } = window.location;
    let svgPath = require('@/static/urworkbg.svg');
    let svgUrl = `${origin}/static/urworkbg.svg`;
    if (pathname.indexOf('/space-demo') > -1) {
      svgPath = require('@/static/urworkbg-demo.svg');
      svgUrl = `${origin}/static/urworkbg-demo.svg`;
    }
    return (
      <div className={styles.svgRight}>
        <iframe
          title="backgroundsvg"
          className={styles.svgPic}
          src={G.env ? svgUrl : svgPath}
          width="100%"
          height="100%"
          id="backgroundsvg"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          scrolling="yes"
        />
        <TimeText />
      </div>
    );
  }
}
