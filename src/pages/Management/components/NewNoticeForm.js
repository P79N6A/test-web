import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Select, Row, Col, Button, message, Radio, Icon, Modal, Upload } from 'antd';
import * as qiniu from 'qiniu-js';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import G from '@/global';
import styles from './NewNoticeForm.less'

const SelectOption = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;


class NewNoticeForm extends Component {
  state = {
    editorState: '',
    editor: EditorState.createEmpty(),
    type: 0,
    poster: '',
    posterMessage: '',
    avatarLoading: false,
    // 切换为海报提示的显示隐藏
    prompt: {
      visible: false,
      title: '',
      content: ''
    }

  };

  componentWillMount() {
    const { dispatch } = this.props;
    // 请求全部人员
    dispatch({
      type: 'ManagementPerson/fetch',
      payload: {
        offset: 0,
        limit: 100000,
      },
    });
  }

  componentDidMount() {
    const { copyValue, form } = this.props;
    if (!copyValue) return;
    let fieldsValue = {
      person: copyValue.receivers || [],
      title: copyValue.title || '',
      type: copyValue.type,
      text: copyValue.message || ''
    };
    form.setFieldsValue(fieldsValue);
    const contentBlock = htmlToDraft(copyValue.content);
    if (!contentBlock) return;
    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
    const editorState = EditorState.createWithContent(contentState);
    this.setState({
      editor: editorState,
      editorState: copyValue.content,
      type: copyValue.type,
      poster: copyValue.message
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!G._.isEqual(this.user, nextProps.user)) {
      this.configSelectOption(nextProps.user);
      this.user = nextProps.user;
    }
  }

  onEditorStateChange(editorState) {
    this.setState({
      editorState: draftToHtml(convertToRaw(editorState.getCurrentContent())),
      editor: editorState,
    });
  }

  configSelectOption(user) {
    this.children = [];
    this.valueOfAll = [];
    for (let i = 0; i < user.length; i += 1) {
      this.children.push(<SelectOption key={user[i].uid}>{user[i].name}</SelectOption>);
      this.valueOfAll.push(user[i].uid);
    }
    this.children.unshift(<SelectOption key="all"><FormattedMessage id='notice.all' /></SelectOption>);
  }

  selectAll() {
    const { form } = this.props;
    form.setFieldsValue({
      person: this.valueOfAll,
    });
  }

  handleChangeTest(values) {
    const isContainerAll = G._.find(values, o => {
      return o === 'all';
    });
    if (isContainerAll) {
      setTimeout(() => {
        this.selectAll();
      }, 100);
    }
  }

  handleCommit() {
    const { form, dispatch } = this.props;
    form.validateFields((err, values) => {
      const { editorState, type, poster } = this.state;
      if ((type === 1 && !this.checkPoster()) || err) {
        return
      }
      dispatch({
        type: 'ManagementNotice/sendNotice',
        payload: {
          title: values.title,
          receivers: values.person,
          content: editorState,
          type: type,
          message: type === 0 ? values.text : poster,
          callback: this.sendResponse,
        },
      });
    });
  }

  sendResponse(res) {
    if (res.status === 'success') {
      message.success(formatMessage({ id: 'notice.sent.successfully' }));
      history.back(-1);
    } else {
      message.error(formatMessage({ id: 'notice.failed.to.send' }));
    }
  }

  checkEditor(rule, value, callback) {
    const { editorState } = this.state;
    if (editorState === '' || editorState.length === 8) {
      callback(formatMessage({ id: 'notice.send.message' }));
    } else {
      callback();
    }
  }

  // editor
  next() { }

  error() { }

  complete(resolve, response) {
    const data = {
      link: G.picUrl + response.key
    }
    resolve({ data })
  }

  // 富文本编辑器内部上传图片
  uploadImageCallBack(file) {
    return new Promise((resolve) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'ManagementPerson/getQiniuToken',
        payload: {
          callback: (res) => {
            if (res.status === 'success') {
              const config = { useCdnDomain: true };
              const putExtra = { mimeType: ['image/png', 'image/jpeg', 'image/gif'] };
              const avatarUrl = `${JSON.parse(window.sessionStorage.getItem('userInfo')).uid}_richtext_${G.moment().unix()}.png`;
              const observable = qiniu.upload(file, avatarUrl, res.data, putExtra, config);
              observable.subscribe(this.next.bind(this), this.error.bind(this), this.complete.bind(this, resolve));
            } else {
              message.error(formatMessage({ id: 'notice.refresh' }));
            }
          }
        },
      });
    })
  }

  // 选择文本或者海报
  onChangeType = e => {
    const a = e.target.value;
    const { poster } = this.state;
    this.contentTypeCopy = Number(a);
    if (a === 0) {
      if (!poster) {
        this.setState({
          prompt: {
            visible: false
          },
          type: 0
        });
      } else {
        this.setState({
          prompt: {
            visible: true,
            title: formatMessage({ id: "notice.certain.title" }),
            content: formatMessage({ id: "notice.certain.text" })
          }
        });
      }
    } else {
      if (!poster) {
        this.setState({
          type: 1
        });
      } else {
        this.setState({
          prompt: {
            visible: true,
            title: formatMessage({ id: "notice.certain.title" }),
            content: formatMessage({ id: "notice.certain.poster" })
          }
        });
      }
    }
  };

  // 弹窗回调
  handleOk = (e) => {
    this.setState({
      poster: '',
      posterMessage: '',
      prompt: {
        visible: false
      },
      type: Number(this.contentTypeCopy)
    });
  }

  handleCancel = (e) => {
    this.setState({
      prompt: {
        visible: false
      }
    });
  }

  // 获取文本内容
  onChangeTextArea = (e) => {
    this.setState({
      poster: e.target.value
    })
  }

  // 校验海报是否存在
  checkPoster() {
    const { poster } = this.state;
    if (!poster) {
      this.setState({
        posterMessage: formatMessage({ id: "notice.poster.message" })
      });
      return false;
    }
    return true;
  }

  nexts() { }

  errors() {
    this.setState({ avatarLoading: false });
  }

  completes(response) {
    this.setState({
      avatarLoading: false,
      poster: G.picUrl + response.key,
      posterMessage: ''
    });
  }

  checkImageWH(file, width, height) {
    return new Promise(function (resolve, reject) {
      let filereader = new FileReader();
      if (file.size > 1024000) {
        reject({ title: formatMessage({ id: "notice.poster.message.two" }) });
      }
      const imgType = file.name.split('.')[file.name.split('.').length - 1];
      if ('png,jpeg,jpg'.indexOf(imgType) < 0) {
        reject({ title: formatMessage({ id: "notice.poster.message.error" }) });
      }
      filereader.onload = e => {
        let src = e.target.result;
        const image = new Image();
        image.onload = function () {
          const rate = Number((this.height / this.width).toFixed(4));
          const myRate = Number((height / width).toFixed(4));
          if (512 > this.width > width) {
            reject({
              title: formatMessage({ id: "notice.poster.message.width.min" }) + width + formatMessage({ id: "notice.poster.message.width.max" })
            });
          } else if (569 > this.height > height) {
            reject({
              title: formatMessage({ id: "notice.poster.message.height.min" }) + height + formatMessage({ id: "notice.poster.message.height.max" }),
            });
          } else if (rate !== myRate) {
            reject({
              title: formatMessage({ id: 'notice.poster.message.rate' })
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

  // 上传海报
  beforeUpload(file) {
    this.checkImageWH(file, 1024, 1138).then((res) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'ManagementPerson/getQiniuToken',
        payload: {
          callback: (res) => {
            if (res.status === 'success') {
              const config = { useCdnDomain: true };
              const putExtra = { mimeType: ['image/png', 'image/jpeg', 'image/gif'] };
              const avatarUrl = `${JSON.parse(window.sessionStorage.getItem('userInfo')).uid}_poster_${G.moment().unix()}.png`;
              this.setState({ avatarLoading: true });
              let options = { maxWidth: 1024, maxHeight: 1138 };
              qiniu.compressImage(file, options).then(data => {
                const observable = qiniu.upload(data.dist, avatarUrl, res.data, putExtra, config)
                observable.subscribe(this.nexts.bind(this), this.errors.bind(this), this.completes.bind(this));
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

  normFile = e => {
    if (!e || !e.fileList) {
      return e;
    }
    const { fileList } = e;
    return fileList;
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { editor, type, poster, posterMessage, avatarLoading } = this.state;
    const uploadButton = (
      <div className={styles.posterAdd}>
        <Icon className={styles.posterIcon} style={{ paddingRight: '16px', fontSize: '24px', fontWeight: '800' }} type={avatarLoading ? 'loading' : 'plus'} />添加海报
      </div>
    );
    return (
      <Form style={{ backgroundColor: '#fff', padding: '30px 20px', borderRadius: '4px', width: '100%', height: '100%' }}>
        <FormItem>
          {getFieldDecorator('title', {
            rules: [
              { required: true, message: formatMessage({ id: 'notice.input.title' }) },
              {
                max: 100,
                message: formatMessage({ id: 'test.max.long.one.hundred' }),
              },
            ],
          })(<Input placeholder={formatMessage({ id: 'notice.input.title' })} size="large" />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('person', {
            rules: [{ required: true, message: formatMessage({ id: 'notice.select.receiver' }) }],
          })(
            <Select
              mode="multiple"
              allowClear
              size="large"
              placeholder={formatMessage({ id: 'notice.select.receiver' })}
              onChange={this.handleChangeTest.bind(this)}
              style={{ width: '100%' }}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {this.children}
            </Select>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('editor', {
            rules: [{ validator: this.checkEditor.bind(this) }],
          })(
            <Editor
              editorState={editor}
              toolbar={{
                options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'image', 'history'],
                fontSize: {
                  options: [28, 24, 20, 18, 14]
                },
                colorPicker: {
                  colors: [
                    'rgb(53, 83, 108)', 'rgb(166, 214, 208)', 'rgb(113, 175, 168)', 'rgb(154, 169, 181)', 'rgb(252, 176, 177)',
                    'rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
                    'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
                    'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
                    'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
                    'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
                    'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)'],
                },
                fontFamily: {
                  options: ["苹方", "微软雅黑", "DINPro", "Helvetica", "SF UI Text", "Arial"]
                },
                inline: { inDropdown: true },
                list: { inDropdown: true },
                textAlign: { inDropdown: true },
                embedded: { display: false },
                link: { inDropdown: true },
                history: { inDropdown: true },
                image: { uploadCallback: this.uploadImageCallBack.bind(this), previewImage: true },
              }}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              editorStyle={{ width: '100%', height: 350, backgroundColor: '#ffffff', borderRadius: '0 0 8px 8px', border: '1px solid #d9d9d9', borderTop: 'none' }}
              onEditorStateChange={this.onEditorStateChange.bind(this)}
            />
          )}
        </FormItem>
        {/* 推送设置 */}
        <div>
          <p className={styles.title}><FormattedMessage id="notice.push.setting" /></p>
          <p className={styles.content}><FormattedMessage id="notice.push.setting.title" /></p>
          <Row gutter={24}>
            <Col xl={8} lg={8} md={8} sm={8} xs={8}>
              <div className={styles.titleBox}>
                <p className={styles.modelShow}><FormattedMessage id="notice.display.template" /></p>
              </div>
              <div className={styles.mobileShow}>
                <div className={styles.mobile}>
                  {/* 内容展示区 */}
                  <div className={styles.mobileText}>
                    {!poster ? (<div className={styles.mobileNone}>
                      <h3><FormattedMessage id="notice.no.content" /></h3>
                      <p className={styles.mobileNoneText}><FormattedMessage id="notice.right.content" /></p>
                    </div>)
                      : (type === 0 ? <p>{poster}</p> : <img src={poster} />)
                    }
                  </div>
                  <Icon type="close-circle" theme="filled" style={{ fontSize: '24px', marginTop: '15px', color: '#F3F5F7' }} />
                </div>
              </div>
            </Col>
            <Col xl={16} lg={16} md={16} sm={16} xs={16} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <Radio.Group value={type} onChange={this.onChangeType}>
                <Radio.Button value={0}><FormattedMessage id="notice.text" /></Radio.Button>
                <Radio.Button value={1}><FormattedMessage id="notice.poster" /></Radio.Button>
              </Radio.Group>
              <div className={styles.textContent}>
                {type === 0 ?
                  <FormItem style={{ width: '100%', height: '100%', paddingTop: '18px' }}>
                    {getFieldDecorator('text', {
                      rules: [
                        { required: type === 0 ? true : false, message: formatMessage({ id: 'notice.text.message' }) },
                        {
                          max: 50,
                          message: formatMessage({ id: "test.max.long.fifty" }),
                        },
                      ],
                    })(<TextArea
                      rows={14}
                      placeholder={formatMessage({ id: "notice.text.show" })}
                      style={{ resize: 'none', width: '100%', padding: '18px 20px', height: '320px' }}
                      onChange={this.onChangeTextArea} />)}
                  </FormItem> :
                  <FormItem style={{
                    width: '100%',
                    height: '93%',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    marginTop: '13px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <Upload
                      className={styles.avatarUploader}
                      name="poster"
                      listType="picture-card"
                      accept="image/*"
                      showUploadList={false}
                      beforeUpload={this.beforeUpload.bind(this)}
                    >
                      {!poster ? (
                        uploadButton
                      ) : (
                          <img className={styles.avatar} src={poster} alt="poster" />
                        )}
                    </Upload>
                    {!poster ? (
                      <font className={styles.avatarTest}><FormattedMessage id="notice.image.message.one" /><br /><FormattedMessage id="notice.image.message.two" /></font>
                    ) : ''}
                    <p style={{ color: 'red', textAlign: 'left', fontSize: '14px' }}>{posterMessage}</p>
                  </FormItem>
                }
              </div>
            </Col>
          </Row>
          {/* 切换为海报的提示 */}
          <Modal
            title={this.state.prompt.title}
            visible={this.state.prompt.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <p>{this.state.prompt.content}</p>
          </Modal>
        </div>
        {/* 发布 */}
        <Row style={{ paddingTop: '30px', borderTop: '1px solid #F2F2F2' }}>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button
              style={{ marginRight: 8 }}
              size='small'
              onClick={() => {
                history.back(-1);
              }}
            >
              <FormattedMessage id='all.cancel' />
            </Button>
            <Button type="primary" size='small' htmlType="submit" onClick={this.handleCommit.bind(this)}>
              <FormattedMessage id='notice.publish' />
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(NewNoticeForm);