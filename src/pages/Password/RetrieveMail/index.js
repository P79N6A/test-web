import React, { Component } from 'react';
import { connect } from 'dva';
import { FormattedMessage, setLocale } from 'umi/locale';
import { Row, Col, Button } from 'antd';
import CenterHeader from '@/components/SpaceHeader/CenterHeader';
import styles from './index.less';
import { routerRedux } from 'dva/router';

@connect(({ RetrieveMail }) => ({
  RetrieveMail,
}))
export default class RetrieveMail extends Component {
  state = {
    id: ""
  }

  componentDidMount() {
    setLocale(this.props.location.query.lang);
    this.setState({
      id: this.props.location.query.id
    })
    this.retrievePassword(this.props.location.query.id);
  }

  // 跳到找回密码页面
  goNewPassword() {
    this.props.dispatch(routerRedux.push(`/external/NewPassword?id=${this.props.location.query.id}&lang=${this.props.location.query.id}`));
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
    return (
      <div className={styles.content}>
        {/* 头部 */}
        <Row className={styles.box}>
          <Col {...leftImg}></Col>
          <Col {...centerContent}>
            <CenterHeader />
          </Col>
        </Row>
        <Row className={styles.onePage}>
          <Col {...leftImg}></Col>
          <Col {...centerContent}>
            <h3 className={styles.title}>
              <FormattedMessage id="reset.password" />
            </h3>
            <h4 className={styles.subtitle}>
              <FormattedMessage id="reset.password.lose" />
            </h4>
            <Button type="primary" className={styles.button} onClick={this.goOn.bind(this)}>
              <FormattedMessage id="reset.password.continue" />
            </Button>
            <p className={styles.question}><FormattedMessage id="reset.password.connect-us" /></p>
            <p className={styles.email}>Email:_________<span><FormattedMessage id="reset.password.phone" />:_________</span></p>
          </Col>
        </Row>
      </div>
    );
  }
}
