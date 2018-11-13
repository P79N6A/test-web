import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import * as qiniu from 'qiniu-js';
import { Modal, Button, Input, Form, Table, Pagination, Row, Col, Radio, Upload, Icon, message } from 'antd';
import G from '@/global';
import styles from './BannerModal.less';

const RadioGroup = Radio.Group;

class BannerModel extends Component {
  state = {
    imageUrl: '',
    avatarLoading: false,
    modal: {
      title: '添加Banner',
      certain: '保存',
      cancel: '取消',
      // 0 是首页，1 是选择默认图片，2 是选择通知页面
      type: 0
    },
    // 选择默认图片
    defaultBanner: '',
    error: {
      bannerPic: '',
      bannerNotice: '',
      bannerUrl: ''
    }
  };

  componentDidMount() {
    const { Banner, dispatch } = this.props;
    const { current } = Banner.noticeData;
    this.fetchNoticeList(current);
    dispatch({
      type: 'Banner/getDefaultBanner'
    });
  }

  // 改变弹窗内容以及状态
  changeModal = (value) => {
    const { modal } = this.state;
    this.setState({
      modal: {
        ...modal,
        ...value
      }
    })
  }

  // 取消
  onCancel = () => {
    const { modal } = this.state;
    if (modal.type === 0) {
      this.changeAddText({
        visible: false,
        bannerSrc: '',
        type: 0,
        bannerUrl: ''
      })
    } else {
      if (modal.type === 1) {
        this.setState({
          imageUrl: '',
          avatarLoading: false,
        })
      } else {
        this.changeAddText({
          title: '',
          bannerUrl: ''
        })
      }
      this.changeModal({ title: '添加Banner', certain: '保存', type: 0 })
    }
  }

  // 保存
  okHandle = () => {
    const { modal, imageUrl } = this.state;
    const { addBanners, Banner } = this.props;
    const { bannerSrc, type, bannerUrl } = Banner.bannerAdd;
    const reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
    if (modal.type === 0) {
      if (!bannerSrc) {
        message.error('请上传 Banner');
        return
      }
      if (type === 0 && !bannerUrl) {
        message.error('请选择通知');
        return
      }
      if (type === 1 && !bannerUrl) {
        message.error('请输入外部链接');
        return
      }
      if (type === 1 && !reg.test(bannerUrl)) {
        message.error('请正确输入外部链接');
        return
      }
      addBanners();
    } else {
      if (modal.type === 1) {
        this.changeAddText({
          bannerSrc: imageUrl
        })
      }
      this.changeModal({ title: '添加Banner', certain: '保存', type: 0 })
    }
  };

  // 选择打开通知还是外部连接
  onChangeType = (e) => {
    this.changeAddText({ type: e.target.value, title: '' })
  }

  // 修改参数
  changeAddText(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'Banner/changeVisible',
      payload: {
        ...value
      }
    });
  }

  // 获取通知列表
  fetchNoticeList(current) {
    const { dispatch } = this.props;
    dispatch({
      type: 'Banner/fetch',
      payload: {
        offset: (current - 1) * 6,
        limit: 6
      },
    });
  }

  // 翻页
  pageChange = pageNumber => {
    this.fetchNoticeList(pageNumber);
  };

  handleChanges = () => { };

  // 通知列表
  getColumnes(current) {
    const columns = [
      {
        title: formatMessage({ id: 'notice.title' }),
        key: 'title',
        render: (text) => {
          return (
            <Fragment>
              <span className={styles.colSql}>
                {text.title}
              </span>
            </Fragment>
          )
        }
      },
      {
        title: formatMessage({ id: 'notice.receiver' }),
        key: 'unreadCount',
        render: (text, record, index) => {
          return (
            <Fragment>
              <font style={{ cursor: 'pointer' }}>{`${text.viewCount}/${text.unreadCount + text.viewCount}`}</font>
            </Fragment>
          )
        },
      },
      {
        title: formatMessage({ id: 'notice.release.time' }),
        key: 'createdAt',
        render: (text) => {
          return (
            <Fragment>
              <span>{G.moment(text.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
            </Fragment>
          )
        }
      },
    ];
    return columns;
  }

  // 列表单选
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.changeAddText({
      title: selectedRows[0].title,
      bannerUrl: selectedRows[0].noticeId
    })
  }

  next() { }

  error() {
    this.setState({ avatarLoading: false });
  }

  complete(response) {
    this.setState({
      avatarLoading: false,
      imageUrl: G.picUrl + response.key,
    });
    this.changeAddText({
      bannerSrc: G.picUrl + response.key
    })
  }

  checkImageWH(file, width, height) {
    return new Promise(function (resolve, reject) {
      let filereader = new FileReader();
      if (file.size > 1024000) {
        reject({ title: '仅支持2Mb及以下的图片上传' });
      }
      const imgType = file.name.split('.')[file.name.split('.').length - 1];
      if ('png,jpeg,jpg'.indexOf(imgType) < 0) {
        reject({ title: '图片格式不正确' });
      }
      filereader.onload = e => {
        let src = e.target.result;
        const image = new Image();
        image.onload = function () {
          const rate = Number((this.height / this.width).toFixed(4));
          if (width && this.width > width) {
            reject({
              title: '请上传宽小于' + width + '的图片'
            });
          } else if (height && this.height > height) {
            reject({
              title: '请上传高小于' + height + '的图片',
            });
          } else if (rate !== (height / width)) {
            reject({
              title: '图片比例为1024/576'
            });
          } else {
            resolve();
          }
        };
        image.onerror = reject;
        image.src = src;
      };
      filereader.readAsDataURL(file);
    });
  }


  beforeUpload(file) {
    this.checkImageWH(file, 1024, 576).then((res) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'ManagementPerson/getQiniuToken',
        payload: {
          callback: (res) => {
            if (res.status === 'success') {
              const config = { useCdnDomain: true };
              const putExtra = { mimeType: ['image/png', 'image/jpeg', 'image/gif'] };
              const avatarUrl = `${JSON.parse(window.sessionStorage.getItem('userInfo')).uid}_banner_${G.moment().unix()}.png`;
              this.setState({ avatarLoading: true });
              let options = { maxWidth: 1024, maxHeight: 576 };
              qiniu.compressImage(file, options).then(data => {
                const observable = qiniu.upload(data.dist, avatarUrl, res.data, putExtra, config)
                observable.subscribe(this.next.bind(this), this.error.bind(this), this.complete.bind(this));
              })
              return false;
            } else {
              message.error(formatMessage({ id: 'person.refresh.page' }));
            }
          }
        }
      });
    }).catch((err) => {
      Modal.error(err)
    });
  }

  // 鼠标移入事件
  defaultBannerMouseEnter(value) {
    this.setState({
      defaultBanner: value
    })
  }

  // 鼠标移出
  defaultBannerMouseLeave() {
    this.setState({
      defaultBanner: ''
    })
  }

  // 选择默认图片
  chooseDefaultBannerUrl(value) {
    this.setState({
      imageUrl: value
    })
  }

  // 获取文本内容
  onChangeTextArea = (e) => {
    this.changeAddText({
      bannerUrl: e.target.value
    })
  }

  render() {
    const { modal, avatarLoading, imageUrl, defaultBanner, bannerUrl } = this.state;
    const { bannerAdd, loading, Banner } = this.props;
    const { limit, current, count } = Banner.noticeData;
    const { defaultBannerList } = Banner;
    const columns = this.getColumnes(current);
    const leftImg = {
      xs: 24,
      sm: 24,
      md: 14,
      lg: 14,
      xl: 14,
      xxl: 14,
      style: { marginBottom: 24 },
    };
    const rightText = {
      xs: 24,
      sm: 24,
      md: 10,
      lg: 10,
      xl: 10,
      xxl: 10,
      style: { marginBottom: 24 },
    };
    const rowSelection = {
      columnTitle: "选择",
      type: 'radio',
      onChange: this.onSelectChange,
    }

    return (
      <Modal
        width={780}
        visible={bannerAdd.visible}
        title={modal.title}
        onOk={this.okHandle}
        onCancel={this.onCancel}
        footer={[
          <Button key="back" size='small' onClick={this.onCancel}>
            {modal.cancel}
          </Button>,
          <Button key="submit" size='small' type="primary" onClick={this.okHandle}>
            {modal.certain}
          </Button>
        ]}
      >
        {modal.type === 0 ?
          < div className={styles.screenShow}>
            <Row gutter={24}>
              {/* 展示 */}
              <Col {...leftImg}>
                {bannerAdd.bannerSrc ?
                  <img className={styles.bannerNone} src={bannerAdd.bannerSrc} /> :
                  <img className={styles.bannerNone} src={`${G.picUrl}image/banner_none_add.png`} />
                }
              </Col>
              <Col {...rightText}>
                <p className={styles.bannerAddTitle}>上传图片</p>
                <p className={styles.bannerAddText}>建议图片宽度1024px，高度576px，</p>
                <p className={styles.bannerAddText}>支持小于2Mb的jpg/png格式图片上传。</p>
                <Upload
                  name="avatar"
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload.bind(this)} >
                  <Button className={styles.btn} key="local" size='small' type="primary">
                    <Icon type={avatarLoading ? 'loading' : 'plus'} />
                    本地上传
                  </Button>
                </Upload>
                <Button className={styles.btnDefault}
                  key="choose"
                  size='small'
                  onClick={this.changeModal.bind(this, { title: '添加Banner', type: 1, certain: '确定' })}>选择系统默认图片</Button>
              </Col>
            </Row>
            <p className={styles.bannerAddTitle}>跳转到</p>
            <RadioGroup onChange={this.onChangeType.bind(this)} className={styles.btnGroup} value={bannerAdd.type}>
              <Row gutter={24}>
                <Col span={4}>
                  <Radio value={0}>打开通知</Radio>
                </Col>
                <Col span={15}>
                  <Input placeholder="点击【选择通知】按钮选择需打开的通知" disabled value={bannerAdd.title} />
                </Col>
                <Col span={5}>
                  <Button
                    key="notice"
                    size='small'
                    type="primary"
                    disabled={bannerAdd.type === 0 ? false : true}
                    onClick={this.changeModal.bind(this, { title: '选择通知', type: 2, certain: '确定' })}>选择通知</Button>
                </Col>
              </Row>
              <br />
              <Row gutter={24}>
                <Col span={4}>
                  <Radio value={1}>打开外部链接</Radio>
                </Col>
                <Col span={20}>
                  <Input placeholder="请输入网址" value={bannerAdd.bannerUrl} onChange={this.onChangeTextArea.bind(this)} disabled={bannerAdd.type === 1 ? false : true} />
                </Col>
              </Row>
            </RadioGroup>
          </div> : (modal.type === 1 ? (
            <div className={styles.screenShow}>
              <p className={styles.bannerAddText}>以下封面由9AM平台提供</p>
              {defaultBannerList && defaultBannerList.length > 0 ? defaultBannerList.map((item, i) => (
                <div
                  key={`${item.id}_defaultBanner`}
                  className={styles.defaultBannerList}
                  onClick={this.chooseDefaultBannerUrl.bind(this, item.url)}
                  onMouseEnter={this.defaultBannerMouseEnter.bind(this, item.id)}
                  onMouseLeave={this.defaultBannerMouseLeave.bind(this)}>
                  <img src={item.url} />
                  <div className={styles.bannerIconBox} style={{ opacity: item.url === imageUrl ? 1 : (item.id === defaultBanner ? 1 : 0) }}>
                    <Icon className={styles.bannerIcon}
                      style={{ opacity: item.url === imageUrl ? 1 : 0 }}
                      type="check-circle" theme="outlined" />
                  </div>
                </div>
              )) : ""}
            </div>
          ) : (
              <div className={styles.screenShow}>
                <p className={styles.bannerAddText}>选择一条通知，在DShow中点击Banner后将跳转到该通知详情页面</p>
                <Table
                  rowKey="_id"
                  loading={loading}
                  dataSource={Banner.noticeData.row}
                  columns={columns}
                  onChange={this.handleChanges.bind(this)}
                  pagination={false}
                  rowSelection={rowSelection}
                />
                <Pagination
                  style={{ marginTop: 20, float: 'right' }}
                  current={current}
                  showQuickJumper
                  total={count}
                  pageSize={limit}
                  onChange={this.pageChange.bind(this)}
                />
              </div>
            ))
        }
      </Modal >
    );
  }
}

export default Form.create()(BannerModel);
