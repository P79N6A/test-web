import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import { Row, Col, Carousel, Button, Icon } from 'antd';
import styles from './Banner.less'

import G from '@/global';

@connect(({ ManagementPerson, user, loading }) => ({
  ManagementPerson,
  user,
  loading: loading.effects['ManagementPerson/fetch'],
}))
export default class Banner extends Component {
  state = {
    // 鼠标 hover 事件
    hoverStatus: false
  }

  // 鼠标移入事件
  bannerMouseEnter() {
    this.setState({
      hoverStatus: true
    })
  }

  bannerMouseLeave() {
    this.setState({
      hoverStatus: false
    })
  }

  render() {
    const { hoverStatus } = this.state;
    return (
      <div className={styles.main}>
        <h3><FormattedMessage id='menu.management.banner' /></h3>
        <div className={styles.box}>
          <Row gutter={24}>
            {/* 展示 */}
            <Col span={8}>
              <div className={styles.bannerBox}>
                <img src={`${G.picUrl}banner_background.png`} />
                <p className={styles.notice}>Banner在DShow上的展示效果预览</p>
                {/* 轮播图 */}
                <Carousel autoplay className={styles.carousel}>
                  <div><img src='http://cdn.space.9amtech.com/image/dshow_banner_notice.png' /></div>
                  <div><img src='http://cdn.space.9amtech.com/image/dshow_banner_active.png' /></div>
                  <div><img src='http://cdn.space.9amtech.com/image/dshow_banner_notify.png' /></div>
                </Carousel>
              </div>
            </Col>
            {/* 列表 */}
            <Col span={16}>
              <p className={styles.bannerTitle}>Banner</p>
              <p className={styles.bannerNotice}>至少保留一个Banner, 最多设置5个Banner，Banner对所有用户可见</p>
              <div className={styles.bannerPicBox}>
                <img className={styles.bannerPic} src='http://cdn.space.9amtech.com/image/dshow_banner_notice.png' />
              </div>
              {/* banner小列表展示 */}
              <ul className={styles.bannerListBox}>
                <li className={styles.bannerList} >
                  <div className={styles.bannerImgBox}
                    onMouseEnter={this.bannerMouseEnter.bind(this)}
                    onMouseLeave={this.bannerMouseLeave.bind(this)}
                  >
                    <img src={`${G.picUrl}dshow_banner_notify.png`} />
                    <div className={styles.bannerModel} style={{ display: hoverStatus ? 'block' : 'none' }}>
                      <Icon type="caret-left" theme="outlined" />
                      <Icon type="caret-right" theme="outlined" />
                      <Icon type="delete" theme="outlined" style={{ float: 'right', lineHeight: '24px', marginRight: '4px' }} />
                    </div>
                  </div>
                  <p className={styles.bannerText}><span className={styles.bannerCircle}></span>已发布</p>
                </li>
                <li className={styles.bannerList}>
                  <img src={`${G.picUrl}banner_add.png`} />
                </li>
              </ul>
              {/* 发布 */}
              <Row gutter={24}>
                <Col span={24}><Button type="primary" className={styles.btn}>发布到 DShow</Button></Col>
                <Col span={24}>
                  <p className={styles.lastTest}>设置完成并点击按钮【发布到 DShow】后系统将最新的Banner同步到DShow端</p>
                  <p className={styles.lastTest}>* 未点击【发布到DShow】时Banner将不会被同步到DShow端 </p>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
