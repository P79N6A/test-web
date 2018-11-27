import React, { Component } from 'react';
import styles from './../SpaceState.less';
import { Icon } from 'antd';
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

  // 属性改变时
  componentWillReceiveProps(nextProps) {
    if (this.filter !== nextProps.filter && (nextProps.filter && nextProps.filter.length > 0)) {
      // 赋值之前先把之前的定位小按钮隐藏
      if (this.filter && this.filter.length > 0) {
        for (let index = 0; index < this.filter.length; index++) {
          this.svgDoc.getElementById("icon" + this.filter[index].htmlId).setAttribute('width', 0);
          this.svgDoc.getElementById("icon" + this.filter[index].htmlId).setAttribute('height', 0);
        }
      }
      // 赋值
      this.filter = nextProps.filter;
      // 在查找出来的 htmlId 里面添加小图标
      for (let index = 0; index < nextProps.filter.length; index++) {
        // 如果存在就设定宽高为 0
        if (this.svgDoc.getElementById("icon" + nextProps.filter[index].htmlId)) {
          this.svgDoc.getElementById("icon" + nextProps.filter[index].htmlId).setAttribute('width', 20);
          this.svgDoc.getElementById("icon" + nextProps.filter[index].htmlId).setAttribute('height', 20);
        } else {
          // 如果不存在就向内部添加一个
          var rectObj = document.createElementNS("http://www.benzhi.co/App_Uploads/Maker/web/d16f06d6-5760-44fc-a761-37dcded2ad84.jpg", "rect");
          if (rectObj) {
            rectObj.setAttribute("width", 20);
            rectObj.setAttribute("height", 20);
            rectObj.setAttribute("id", "icon" + nextProps.filter[index].htmlId);
            this.svgDoc.getElementById(nextProps.filter[index].htmlId).appendChild(rectObj);
          }
        }
      }
    }
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
    // 给所有小方块添加鼠标滑动事件
    for (let i = 0; i < this.rect.length; i++) {
      this.rect[i].onmouseover = (ev) => {
        let x, y;
        if (!ev) ev = window.event;
        if (ev.pageX || ev.pageY) {
          x = ev.pageX, y = ev.pageY;
        } else {
          x = ev.clientX + document.documentElement.scrollLeft - document.body.clientLeft;
          y = ev.clientY + document.documentElement.scrollTop - document.body.clientTop
        };
        const model = document.getElementById('modelName');
        const modelContent = document.getElementById('modelContent');
        modelContent.innerHTML = this.rect[i].id;
        model.style.display = "block";
        model.style.left = x + "px";
        model.style.top = y + 25 + "px";
      }
      this.rect[i].onmouseout = () => {
        document.getElementById('modelName').style.display = "none";
      }
    }
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

  // 弹窗
  bannerMouseEnter() {
    document.getElementById('modelName').style.display = "block";
  }

  bannerMouseLeave() {
    document.getElementById('modelName').style.display = "none";
  }

  render() {
    const { spaceState, filter } = this.props;
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
        <p id="modelName" className={styles.modelP}
          onMouseEnter={this.bannerMouseEnter.bind(this)}
          onMouseLeave={this.bannerMouseLeave.bind(this)}>
          <Icon className={styles.model_font} type="caret-up" theme="filled" />
          <font id="modelContent"></font>
        </p>
      </div>
    );
  }
}
