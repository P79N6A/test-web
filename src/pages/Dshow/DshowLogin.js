import React, { Component, Fragment } from 'react';

class DshowLogin extends Component {
  state = {
    screenHeight: document.body.scrollHeight
  };

  // 获取 url 参数
  getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); // 匹配目标参数
    if (r != null) return unescape(r[2]); return null; // 返回参数值
  }

  componentDidMount() {
    window.sessionStorage.setItem('deskScreenId', this.getUrlParam('deskScreenId'));
  }

  render() {
    const { screenHeight } = this.state;
    return (
      <iframe
        src={require(`./dshow.html`)}
        width='100%'
        height={screenHeight}
        frameBorder='0'
        scrolling='no'
      />
    );
  }
}
export default DshowLogin;