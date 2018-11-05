import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import { Row, Col, Carousel, Button, Icon } from 'antd';
import BannerModal from './components/BannerModal'
import styles from './Banner.less'

import G from '@/global';

@connect(({ Banner, loading }) => ({
  Banner,
  loading: loading.effects['Banner/fetch'],
}))
export default class Banner extends Component {
  state = {
    // 鼠标 hover 事件
    hoverStatus: false,
    modalLoading: false
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'Banner/getBanner'
    });
  }

  // 鼠标移入事件
  bannerMouseEnter() {
    this.setState({
      hoverStatus: true
    })
  }

  // 鼠标移出
  bannerMouseLeave() {
    this.setState({
      hoverStatus: false
    })
  }

  // 添加图片弹窗显示
  addBanner = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Banner/changeVisible',
      payload: {
        visible: true
      }
    });
  }

  // 添加 Banner
  addBanners() {
    const { dispatch, Banner } = this.props;
    const { bannerSrc, type, bannerUrl } = Banner.bannerAdd;
    dispatch({
      type: 'Banner/addBanner',
      payload: {
        bannerSrc,
        type,
        bannerUrl,
        callback: this.addBannerBack.bind(this),
      },
    });
  }

  addBannerBack(res) {
    const { dispatch } = this.props;
    dispatch({
      type: 'Banner/changeVisible',
      payload: {
        visible: false,
        bannerSrc: '',
        type: 0,
        bannerUrl: '',
        title: ''
      }
    });
    if (res.status === 'success') {
      dispatch({
        type: 'Banner/getBanner'
      });
    } else {
      message.error(response.message || 'error');
    }
  }

  // 发布 Banner
  bannerPublish() {
    const { dispatch } = this.props;
    dispatch({
      type: 'Banner/bannerPublish'
    });
  }

  render() {
    const { hoverStatus, modalLoading } = this.state;
    const { Banner, dispatch } = this.props;
    const { bannerAdd, bannerList } = Banner;
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
                  {bannerList && bannerList.length > 0 ? bannerList.map((item, i) => (<div key={`carousel_${item.bannerId}`}><img src={item.src} /></div>))
                    : (<img className={styles.bannerNone} src={`${G.picUrl}banner_none_add.png`} />)}
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
              {bannerList && bannerList.length > 0 ?
                (
                  <ul className={styles.bannerListBox}>
                    {bannerList.map((item, i) => (
                      <li className={styles.bannerList} key={`banner_${item.bannerId}`}>
                        <div className={styles.bannerImgBox}
                          onMouseEnter={this.bannerMouseEnter.bind(this)}
                          onMouseLeave={this.bannerMouseLeave.bind(this)}
                        >
                          <img src={item.src} />
                          <div className={styles.bannerModel} style={{ display: hoverStatus ? 'block' : 'none' }}>
                            <Icon type="caret-left" theme="outlined" />
                            <Icon type="caret-right" theme="outlined" />
                            <Icon type="delete" theme="outlined" style={{ float: 'right', lineHeight: '24px', marginRight: '4px' }} />
                          </div>
                        </div>
                        <p className={styles.bannerText}><span className={styles.bannerCircle}></span>已发布</p>
                      </li>
                    ))}
                    {/* 添加图片 */}
                    {bannerList.length >= 5 ? '' : (
                      <li className={styles.bannerList} onClick={this.addBanner.bind(this)}>
                        <img className={styles.addBanner} src={`${G.picUrl}banner_add.png`} />
                      </li>
                    )}

                  </ul>) : (
                  <ul className={styles.bannerListBox}>
                    <li className={styles.bannerList} onClick={this.addBanner.bind(this)}>
                      <img className={styles.addBanner} src={`${G.picUrl}banner_add.png`} />
                    </li>
                  </ul>
                )}
              {/* 发布 */}
              <Row gutter={24}>
                <Col span={24}>
                  <Button onClick={this.bannerPublish.bind(this)} type="primary" size='small' className={styles.btn}>发布到 DShow</Button>
                </Col>
                <Col span={24}>
                  <p className={styles.lastTest}>设置完成并点击按钮【发布到 DShow】后系统将最新的Banner同步到DShow端</p>
                  <p className={styles.lastTest}>* 未点击【发布到DShow】时Banner将不会被同步到DShow端 </p>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        {/* model */}
        <BannerModal
          dispatch={dispatch}
          loading={modalLoading}
          Banner={Banner}
          addBanners={this.addBanners.bind(this)}
          bannerAdd={bannerAdd} />
      </div>
    );
  }
}
