import React, { Component } from 'react';
import styles from './../SpaceState.less';
import G from '@/global'
import TimeText from './TimeText.js'

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
const strokeOffline = '#DBDBDB';
const fillOffline = '#F3F3F3';
const strokeOccupied = '#FF5A5F';
const fillOccupied = '#FFDEDF';
const strokeVacant = '#00A699';
const fillVacant = '#CCEDEB';
export default class SpaceSvg extends Component {

  constructor(props) {
    super(props);
    this.svgName = '';
    this.token = '';
    this.defaultTable = defaultTable;
    this.defaultTwins = defaultTwins;
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'spaceState/getSvg'
    });
  }

  // 待 svg 加载完成之后绑定监听函数
  componentDidUpdate(newProps, newState) {
    const newestSvg = newProps.spaceState.svg;
    if (newestSvg && newestSvg.svgName) {
      if (!this.svgName && this.svgName !== newestSvg.svgName) {
        this.bindClick(newestSvg.svgId);
      }
    }
  }

  bindClick(svgId) {
    // 找到 ID 为 backgroundsvg 的元素
    const background = document.getElementById(svgId);
    // 添加监听，以便于修改里面的元素
    background.addEventListener('load', this.svgLoaded.bind(this, background), false);
  }

  svgLoaded(background) {
    // 找到 svg 里面所有的元素
    this.svgDoc = background.contentDocument;
    // 找到所有的小方块
    this.rect = this.svgDoc.getElementsByTagName('rect');
    // 首次调用以防延迟
    const { dispatch, spaceState } = this.props;
    const { svg } = spaceState;
    dispatch({
      type: 'spaceState/getDeskState',
      payload: {
        svgId: svg.svgId,
        callback: this.showDesk.bind(this),
      },
    });
    // 根据 svgId 获取 svg 内全部桌子状态
    this.deskState()
  }

  // svg 实时状态展示
  deskState() {
    const { dispatch, spaceState } = this.props;
    const { svg } = spaceState;
    this.interval = setInterval(() => {
      dispatch({
        type: 'spaceState/getDeskState',
        payload: {
          svgId: svg.svgId,
          callback: this.showDesk.bind(this),
        },
      });
    }, 3000);
  }

  // 展示桌子状态
  showDesk(data) {
    let offlineCount = 0;
    let vacantCount = 0;
    let occupiedCount = 0;
    for (let i = 0; i < data.length; i += 1) {
      const { htmlId } = data[i];
      const element = this.svgDoc.getElementById(htmlId);
      if (htmlId && element) {
        const { humansensor } = data[i].devices[0].deviceTwin;
        const { status } = data[i].devices[0].deviceTwin;
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
    // 修改统计数
    const { setCount } = this.props;
    setCount({
      offlineCount,
      vacantCount,
      occupiedCount,
    });
  }

  // 填充桌子颜色
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

  // 填充传感器颜色
  updateSvg(element, stroke, fill) {
    element.setAttribute('stroke', stroke);
    element.setAttribute('fill', fill);
  }

  // 页面结束，清除倒计时
  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
  }

  render() {
    const { spaceState } = this.props
    const { svg } = spaceState;
    return (
      <div className={styles.svgRight}>
        {svg.svgName &&
          <iframe
            className={styles.svgPic}
            src={G.env ? `${G.htmlUrl}/static/svg/${svg.svgName}` : require('@/static/svg/urwork.svg')}
            width="100%"
            height="100%"
            id={svg.svgId}
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            scrolling="yes"
          />}
        <TimeText />
      </div>
    );
  }
}
