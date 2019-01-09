import React, { Component } from 'react';
import { connect } from 'dva';
import { FormattedMessage, setLocale } from 'umi/locale';
import { Row, Col, Button } from 'antd';
import CenterHeader from '@/components/SpaceHeader/CenterHeader';
import { routerRedux } from 'dva/router';
import styles from './index.less';

@connect(({ RetrieveMail }) => ({
  RetrieveMail,
}))
class RetrieveMail extends Component {
  state = {
    id:'',
  }

  componentDidMount() {
    const {location}=this.props;
    setLocale(location.query.lang);
    this.setState({
      id: location.query.id,
    })
    this.retrievePassword(location.query.id);
  }

  // 跳到找回密码页面
  goNewPassword() {
    const {dispath,location}=this.props;
    dispatch(routerRedux.push(`/external/NewPassword?id=${location.query.id}&lang=${location.query.id}`));
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
      },
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
          state: 1,
        },
      });
    }
  }

  // 跳转space登录页面
  goOn() {
    const {dispatch}=this.props;
    dispatch(routerRedux.push('/user/login'));
  }


  render() {
    const leftImg = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 };
    const centerContent = { xs: 22, sm: 20, md: 18, lg: 16, xl: 14, xxl: 12 };
    return (
      <div className={styles.content}>
        {/* 头部 */}
        <Row className={styles.box}>
          <Col {...leftImg} />
          <Col {...centerContent}>
            <CenterHeader />
          </Col>
        </Row>
        <Row className={styles.onePage}>
          <Col {...leftImg} />
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
            <p className={styles.email}>
              Email:_________
              <span>
                <FormattedMessage id="reset.password.phone" />
                :_________
              </span>
            </p>
          </Col>
        </Row>
      </div>
    );
  }
}

export default RetrieveMail;