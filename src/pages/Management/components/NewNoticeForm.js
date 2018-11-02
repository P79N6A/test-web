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
    messages: '',
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

    if (copyValue) {
      form.setFieldsValue({
        person: copyValue.receivers || [],
        title: copyValue.title || '',
        type: copyValue.type || 0,
        messages: copyValue.message || '',
      });
      const contentBlock = htmlToDraft(copyValue.content);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        this.setState({ editor: editorState, editorState: copyValue.content });
      }
    }
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
      const { editorState } = this.state;
      if (err) {
        return;
      }
      dispatch({
        type: 'ManagementNotice/sendNotice',
        payload: {
          title: values.title,
          receivers: values.person,
          content: editorState,
          type: type,
          message: messages,
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
      link: G.uploadPicUrl + response.key
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
              const avatarUrl = `${JSON.parse(window.sessionStorage.getItem('userInfo')).uid}_${G.moment().unix()}.png`;
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
    this.contentTypeCopy = Number(a);
    if (a === 0) {
      this.setState({
        prompt: {
          visible: true,
          title: '确认提示',
          content: '切换到文本后，图片将会被清空，确定切换为文本吗？'
        }
      });
    } else {
      this.setState({
        prompt: {
          visible: true,
          title: '确认提示',
          content: '切换到海报后，文本信息将会被清空，确定切换为海报吗？'
        }
      });
    }
  };

  // 弹窗回调
  handleOk = (e) => {
    this.setState({
      messages: '',
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
      messages: e.target.value
    })
  }

  nexts() { }

  errors() {
    this.setState({ avatarLoading: false });
  }

  completes(response) {
    this.setState({
      avatarLoading: false,
      messages: G.uploadPicUrl + response.key,
    });
  }

  // 上传海报
  beforeUpload(file) {
    const { dispatch } = this.props;
    dispatch({
      type: 'ManagementPerson/getQiniuToken',
      payload: {
        callback: (res) => {
          if (res.status === 'success') {
            const config = { useCdnDomain: true };
            const putExtra = { mimeType: ['image/png', 'image/jpeg', 'image/gif'] };
            const avatarUrl = `${JSON.parse(window.sessionStorage.getItem('userInfo')).uid}_${G.moment().unix()}.png`;
            this.setState({ avatarLoading: true });
            const observable = qiniu.upload(file, avatarUrl, res.data, putExtra, config);
            observable.subscribe(this.nexts.bind(this), this.errors.bind(this), this.completes.bind(this));
            return false;
          } else {
            message.error(formatMessage({ id: 'person.refresh.page' }));
          }
        }
      },
    });
  }

  normFile = e => {
    if (!e || !e.fileList) {
      return e;
    }
    const { fileList } = e;
    return fileList;
  };

  handleChangePic = info => {
    if (info.file.status === 'uploading') {
      this.setState({ avatarLoading: true });
      return;
    }
    if (info.file.status === 'error') {
      getBase64(info.file.originFileObj, messages => {
        this.setState({
          messages,
          avatarLoading: false,
        });
      });
    }
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { editor, type, messages, avatarLoading } = this.state;
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
                inline: { inDropdown: true },
                list: { inDropdown: true },
                textAlign: { inDropdown: true },
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
          <p className={styles.title}>推送设置</p>
          <p className={styles.content}>必填，推送消息将以弹框形式显示，可选择推送文本信息或海报</p>
          <Row gutter={24}>
            <Col xl={8} lg={8} md={8} sm={8} xs={8}>
              <p className={styles.modelShow}>展示模版</p>
              <div className={styles.mobileShow}>
                <div className={styles.mobile}>
                  {/* 内容展示区 */}
                  <div className={styles.mobileText}>
                    {!messages ? (<div className={styles.mobileNone}>
                      <h3>暂无内容</h3>
                      <p className={styles.mobileNoneText}>请在右侧设置推送内容 </p>
                    </div>)
                      : (type === 0 ? <p>{messages}</p> : <img src={messages} />)
                    }
                  </div>
                  <Icon type="close-circle" theme="filled" style={{ fontSize: '24px', marginTop: '15px', color: '#F3F5F7' }} />
                </div>
              </div>
            </Col>
            <Col xl={16} lg={16} md={16} sm={16} xs={16} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <Radio.Group value={type} onChange={this.onChangeType}>
                <Radio.Button value={0}>文本</Radio.Button>
                <Radio.Button value={1}>海报</Radio.Button>
              </Radio.Group>
              <div className={styles.textContent}>
                {type === 0 ?
                  <FormItem style={{ width: '100%', height: '100%', paddingTop: '10px' }}>
                    {getFieldDecorator('messages', {
                      rules: [
                        { required: true, message: '请输入摘要信息' },
                        {
                          max: 50,
                          message: '最大长度50',
                        },
                      ],
                    })(<TextArea
                      rows={14}
                      placeholder={'摘要信息将在推送的弹框中显示'}
                      style={{ resize: 'none', width: '100%' }}
                      onChange={this.onChangeTextArea} />)}
                  </FormItem> :
                  <FormItem style={{
                    width: '100%',
                    height: '100%',
                    marginTop: '20px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    {getFieldDecorator('message', {
                      valuePropName: 'fileList',
                      getValueFromEvent: this.normFile,
                      rules: [
                        { required: true, message: '请上传海报' }
                      ],
                    })(
                      <Upload
                        className={styles.avatarUploader}
                        name="poster"
                        listType="picture-card"
                        accept="image/*"
                        showUploadList={false}
                        onChange={this.handleChangePic.bind(this)}
                        beforeUpload={this.beforeUpload.bind(this)}
                      >
                        {!messages ? (
                          uploadButton
                        ) : (
                            <img className={styles.avatar} src={messages} alt="poster" />
                          )}
                      </Upload>
                    )}
                    {!messages ? (
                      <font className={styles.avatarTest}>建议图片宽度1024px，高度1138px。<br />（最小宽度512px，高度569px支持类型jpg、png）</font>
                    ) : ''}
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
