// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React, { Component } from 'react';
import { formatMessage, FormattedMessage, getLocale } from 'umi/locale';
import { connect } from 'dva';
import { Row, Col, Carousel, Button, Icon, Modal } from 'antd';
import BannerModal from './components/BannerModal'
import styles from './Banner.less'
import G from '@/global';

const confirm = Modal;

@connect(({ Banner, loading }) => ({
  Banner,
  loading: loading.effects['Banner/fetch'],
}))
class Banner extends Component {
  state = {
    // 鼠标 hover 事件
    modalLoading: false,
    bannerId: '',
    bannerUrl: {
      src: '',
      id: '',
    },
    sortBanner: [],
  }

  componentDidMount() {
    this.getBannerList();
  }

  // 属性改变时
  componentWillReceiveProps(nextProps) {
    const { Banner } = nextProps;
    const { bannerList } = Banner;
    if (bannerList && bannerList.length > 0) {
      const newBannerList = [];
      bannerList.forEach((item, i) => {
        newBannerList.push(item.bannerId)
      })
      this.setState({
        bannerUrl: {
          src: bannerList[0].src,
          id: bannerList[0].bannerId,
        },
        sortBanner: newBannerList,
      })
    }
  }

  // 获取 banner 列表
  getBannerList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'Banner/getBanner',
    });
  }

  // 添加图片弹窗显示
  addBanner = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Banner/changeVisible',
      payload: {
        visible: true,
      },
    });
  }

  // 鼠标移入事件
  bannerMouseEnter(bannerId) {
    this.setState({
      bannerId,
    })
  }

  // 鼠标移出
  bannerMouseLeave() {
    this.setState({
      bannerId: '',
    })
  }

  // banner 点击事件
  changeBannerShow(src, id) {
    this.setState({
      bannerUrl: {
        src,
        id,
      },
    })
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

  // 删除 banner
  bannerDel(bannerId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'Banner/delBanner',
      payload: {
        bannerId,
        callback: this.getBannerList.bind(this),
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
        title: '',
      },
    });
    if (res.status === 'success') {
      this.getBannerList();
    } else {
      message.error(G.errorLists[res.code][`message_${getLocale()}`] || 'error');
    }
  }

  // 发布 Banner
  bannerPublish() {
    const { dispatch } = this.props;
    dispatch({
      type: 'Banner/bannerPublish',
      payload: {
        callback: this.getBannerList.bind(this),
      },
    });
  }

  // 删除确认
  delConfirm(bannerId) {
    const _this = this;
    confirm({
      title: formatMessage({ id: "notice.operate.certain-title" }),
      content: formatMessage({ id: "banner.delete-message" }),
      okText: formatMessage({ id: "all.certain" }),
      cancelText: formatMessage({ id: "all.cancel" }),
      okButtonProps: {
        size: 'small',
      },
      cancelButtonProps: {
        size: 'small',
      },
      onOk() {
        _this.bannerDel(bannerId);
      },
      onCancel() {},
    });
  }

  // 移动banner
  moveBanner(index, direction) {
    let x = 0; let y = 0;
    const { sortBanner } = this.state;
    const { dispatch } = this.props;
    if (direction === 'left') {
      y = index + 1;
      x = index;
    } else {
      y = index + 2;
      x = index + 1;
    }
    sortBanner.splice(x - 1, 1, ...sortBanner.splice(y - 1, 1, sortBanner[x - 1]));
    dispatch({
      type: 'Banner/sortBanner',
      payload: {
        bannerList: sortBanner,
        callback: this.getBannerList.bind(this),
      },
    });
  }

  render() {
    const { modalLoading, bannerId, bannerUrl } = this.state;
    const { Banner, dispatch } = this.props;
    const { bannerAdd, bannerList } = Banner;
    const leftImg = {
      xs: 7,
      sm: 7,
      md: 7,
      lg: 7,
      xl: 7,
      xxl: 6,
    };
    return (
      <div className={styles.main}>
        <h3><FormattedMessage id='menu.management.banner' /></h3>
        <div className={styles.box}>
          <Row gutter={24}>
            {/* 展示 */}
            <Col {...leftImg}>
              <div className={styles.bannerBox}>
                <img src={`${G.picUrl}image/banner_background.png`} />
                <p className={styles.notice}><FormattedMessage id="banner.dshow-message" /></p>
                {/* 轮播图 */}
                <Carousel autoplay className={styles.carousel}>
                  {bannerList && bannerList.length > 0 ? bannerList.map((item, i) => (<div key={`carousel_${item.bannerId}`}><img src={item.src} /></div>))
                    : (<img className={styles.bannerNone} src={`${G.picUrl}${formatMessage({ id: "image.banner.none-add" })}`} />)}
                </Carousel>
              </div>
            </Col>
            {/* 列表 */}
            <Col span={12}>
              <p className={styles.bannerTitle}>Banner</p>
              <p className={styles.bannerNotice}><FormattedMessage id="banner.dshow-message-one" /></p>
              <div className={styles.bannerPicBox}>
                <img className={styles.bannerPic} src={bannerUrl.src} />
              </div>
              {/* banner小列表展示 */}
              {bannerList && bannerList.length > 0 ?
                (
                  <ul className={styles.bannerListBox}>
                    {bannerList.map((item, i) => (
                      <li className={styles.bannerList} key={`banner_${item.bannerId}`}>
                        <div
                          className={styles.bannerImgBox}
                          onMouseEnter={this.bannerMouseEnter.bind(this, item.bannerId)}
                          onMouseLeave={this.bannerMouseLeave.bind(this)}
                        >
                          <img
                            onClick={this.changeBannerShow.bind(this, item.src, item.bannerId)}
                            src={item.src}
                            style={{ borderBottom: bannerUrl.id === item.bannerId ? '3px solid #A6D6D0' : '3px solid #FFF' }}
                          />
                          <div className={styles.bannerModel} style={{ display: bannerList.length > 1 ? bannerId === item.bannerId ? 'block' : 'none' : 'none' }}>
                            <Icon style={{ display: i === 0 ? 'none' : '' }} onClick={this.moveBanner.bind(this, i, 'left')} type="caret-left" theme="outlined" />
                            <Icon style={{ display: i === (bannerList.length - 1) ? 'none' : '' }} onClick={this.moveBanner.bind(this, i, 'right')} type="caret-right" theme="outlined" />
                            <Icon onClick={this.delConfirm.bind(this, item.bannerId)} type="delete" theme="outlined" style={{ float: 'right', lineHeight: '24px', marginRight: '4px' }} />
                          </div>
                        </div>
                        {item.status === 1 ? (
                          <p className={styles.bannerText}>
                            <span className={styles.bannerCircle} style={{ backgroundColor: '#A6D6D0' }} />
                            <FormattedMessage id="banner.published" />
                          </p>
                        ) : (
                          <p className={styles.bannerText}>
                            <span className={styles.bannerCircle} style={{ backgroundColor: '#FCB0B1' }} />
                            <FormattedMessage id="banner.unpublished" />
                          </p>
                          )}
                      </li>
                    ))}
                    {/* 添加图片 */}
                    {bannerList.length >= 5 ? '' : (
                      <li className={styles.bannerList} onClick={this.addBanner.bind(this)}>
                        <img className={styles.addBanner} src={`${G.picUrl}${formatMessage({ id: "image.banner.add-en" })}`} />
                      </li>
                    )}
                  </ul>) : (
                    <ul className={styles.bannerListBox}>
                      <li className={styles.bannerList} onClick={this.addBanner.bind(this)}>
                        <img className={styles.addBanner} src={`${G.picUrl}${formatMessage({ id: "image.banner.add-en" })}`} />
                      </li>
                    </ul>
                )}
              {/* 发布 */}
              <Row gutter={24}>
                <Col span={24}>
                  <Button onClick={this.bannerPublish.bind(this)} type="primary" size='small' className={styles.btn}><FormattedMessage id="banner.publish-dshow" /></Button>
                </Col>
                <Col span={24}>
                  <p className={styles.lastTest}><FormattedMessage id="banner.publish-dshow.message-one" /></p>
                  <p className={styles.lastTest}><FormattedMessage id="banner.publish-dshow.message-two" /></p>
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
          bannerAdd={bannerAdd}
        />
      </div>
    );
  }
}

export default Banner;
