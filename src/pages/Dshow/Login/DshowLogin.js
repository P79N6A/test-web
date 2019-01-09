import React, { Component, Fragment } from 'react';
import G from '@/global'

class DshowLogin extends Component {
  state = {
    screenHeight: document.body.scrollHeight,
    iframeUrl: '',
  };

  componentDidMount() {
    window.sessionStorage.setItem('deskScreenId', this.getUrlParam('deskScreenId'));
    window.sessionStorage.setItem('lang', this.getUrlParam('lang'));
    window.sessionStorage.setItem('errorLists', JSON.stringify(G.errorLists));
    window.sessionStorage.setItem('DshowUrl', process.DSHOW_URL);
    window.sessionStorage.setItem('cdnUrl', G.picUrl);
    this.setState({
      iframeUrl: G.env ? `${G.htmlUrl}/static/dshow.html` : require('@/static/dshow.html'),
    })
  }

  // 获取 url 参数
  getUrlParam(name) {
    const reg = new RegExp(`(^|&)${  name  }=([^&]*)(&|$)`); // 构造一个含有目标参数的正则表达式对象
    const r = window.location.search.substr(1).match(reg); // 匹配目标参数
    if (r != null) return unescape(r[2]); return null; // 返回参数值
  }

  render() {
    const { screenHeight, iframeUrl } = this.state;
    return (
      <iframe
        title='Dshow'
        src={iframeUrl}
        width='100%'
        height={screenHeight}
        frameBorder='0'
        scrolling='no'
      />
    );
  }
}
export default DshowLogin;