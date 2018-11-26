import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, message, Button } from 'antd';
import CenterHeader from '@/components/SpaceHeader/CenterHeader'
import styles from './index.less'
import G from '@/global'
import { routerRedux } from 'dva/router';

@connect(({ RetrieveMail }) => ({
  RetrieveMail,
}))
export default class RetrieveMail extends Component {
  state = {
    id: ""
  }

  componentDidMount() {
    this.setState({
      id: this.props.location.query.id
    })
    this.observeName(this.props.location.query.id);
    this.retrievePassword(this.props.location.query.id);
  }

  // 根据 Id 获取名字
  observeName(id) {
    const { dispatch } = this.props;
    dispatch({
      type: 'RetrieveMail/getName',
      payload: { id }
    });
  }

  // 跳到找回密码页面
  goNewPassword() {
    this.props.dispatch(routerRedux.push(`/external/NewPassword?id=${this.props.location.query.id}`));
  }

  // 链接过没过期
  retrievePassword(ids) {
    const { dispatch } = this.props;
    const { id } = this.state;
    dispatch({
      type: 'RetrieveMail/retrievePassword',
      payload: {
        id: id || ids,
        callback: this.release.bind(this),
      }
    })
  }

  // 发送之后的回调
  release(res) {
    const { dispatch } = this.props;
    if (res.status === 'success') {
      this.goNewPassword();
    } else {
      dispatch({
        type: 'RetrieveMail/saveId',
        payload: {
          state: 1
        },
      });
    }
  }

  // 跳转space登录页面
  goOn() {
    this.props.dispatch(routerRedux.push('/user/login'));
  }


  render() {
    const leftImg = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 };
    const centerContent = { xs: 22, sm: 20, md: 18, lg: 16, xl: 14, xxl: 12 };
    const { RetrieveMail } = this.props;
    return (
      <div className={styles.content}>
        {/* 头部 */}
        <Row className={styles.box}>
          <Col {...leftImg}></Col>
          <Col {...centerContent}>
            <CenterHeader />
          </Col>
        </Row>
        {
          RetrieveMail.state === 0
            ?
            <Row className={styles.onePage}>
              <Col {...leftImg}></Col>
              <Col {...centerContent}>
                <h3 className={styles.title}>{RetrieveMail.name}，你好！</h3>
                <h4 className={styles.subtitle}>您刚刚请求了找回空间管理系统的密码，请点击找回密码按钮设置新的密码。</h4>
                <Button type="primary" className={styles.button} onClick={this.goNewPassword.bind(this)}>找回密码</Button>
                <div className={styles.btnNone}>
                  <p>如果按钮无法点击，请直接访问一下链接：<span onClick={this.goNewPassword.bind(this)}>{G.htmlUrl}/external/NewPassword</span>（为保障帐号安全性， 该链接24小时内有效。如果您不想更换密码，无需进行任何操作）</p>
                </div>
                <p className={styles.question}>如有任何问题，可以与我们联系，我们将尽快为你解答。</p>
                <p className={styles.email}>Email:_________<span>电话:_________</span></p>
              </Col>
            </Row>
            :
            <Row className={styles.onePage}>
              <Col {...leftImg}></Col>
              <Col {...centerContent}>
                <h3 className={styles.title}>找回密码</h3>
                <h4 className={styles.subtitle}>此密码找回链接无效或已过期。</h4>
                <Button type="primary" className={styles.button} onClick={this.goOn.bind(this)}>继续</Button>
                <p className={styles.question}>如有任何问题，可以与我们联系，我们将尽快为你解答。</p>
                <p className={styles.email}>Email:_________<span>电话:_________</span></p>
              </Col>
            </Row>
        }
      </div>
    );
  }
}
