import React, { Component, Fragment } from 'react';
import G from '@/global'

class DshowLogin extends Component {
  state = {
    screenHeight: document.body.scrollHeight,
    iframeUrl: ''
  };

  // 获取 url 参数
  getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); // 匹配目标参数
    if (r != null) return unescape(r[2]); return null; // 返回参数值
  }

  componentDidMount() {
    window.sessionStorage.setItem('deskScreenId', this.getUrlParam('deskScreenId'));
    window.sessionStorage.setItem('lang', this.getUrlParam('lang'));
    window.sessionStorage.setItem('errorLists', JSON.stringify(G.errorLists));
    window.sessionStorage.setItem('DshowUrl', process.DSHOW_URL);
    this.setState({
      iframeUrl: G.env ? `${G.htmlUrl}/static/dshow.html` : require('@/static/dshow.html')
    })
  }

  render() {
    const { screenHeight, iframeUrl } = this.state;
    return (
      <iframe
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