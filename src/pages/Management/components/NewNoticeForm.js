import React, { Component } from 'react';
import { Form, Input, Select, Row, Col, Button, message } from 'antd';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import G from '@/global';

const SelectOption = Select.Option;

const FormItem = Form.Item;


class NewNoticeForm extends Component {
  state = {
    editorState: '',
    editor: EditorState.createEmpty(),
  };

  componentWillMount() {
    const { dispatch } = this.props;
    // 请求全部人员
    dispatch({
      type: 'manaPerson/fetch',
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
    this.children.unshift(<SelectOption key="all">全部</SelectOption>);
  }

  selectAll() {
    const { form } = this.props;
    form.setFieldsValue({
      person: this.valueOfAll,
    });
  }

  handleChange(values) {
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
        type: 'manaNotice/sendNotice',
        payload: {
          title: values.title,
          receivers: values.person,
          content: editorState,
          callback: this.sendResponse,
        },
      });
    });
  }

  sendResponse(res) {
    if (res.status === 'success') {
      message.success('发送成功');
      history.back(-1);
    } else {
      message.error('发送失败');
    }
  }

  checkEditor(rule, value, callback) {
    const { editorState } = this.state;
    if (editorState === '' || editorState.length === 8) {
      callback('请填写内容');
    } else {
      callback();
    }
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { editor } = this.state;
    return (
      <Form>
        <FormItem>
          {getFieldDecorator('title', {
            rules: [
              { required: true, message: '请输入标题' },
              {
                max: 20,
                message: '最大长度20',
              },
            ],
          })(<Input placeholder="请输入标题" size="large" />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('person', {
            rules: [{ required: true, message: '请选择接收人' }],
          })(
            <Select
              mode="multiple"
              allowClear
              size="large"
              placeholder="请选择接收人"
              onChange={this.handleChange.bind(this)}
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
              }}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              editorStyle={{ width: '100%', height: 350, backgroundColor: '#ffffff' }}
              // toolbarStyle={{ color: '#000', opacity: '0.65' }}
              onEditorStateChange={this.onEditorStateChange.bind(this)}
            />
          )}
        </FormItem>
        <Row>
          <Col span={24} style={{ textAlign: 'left' }}>
            <Button type="primary" size='small' htmlType="submit" onClick={this.handleCommit.bind(this)}>
              发布
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              size='small'
              onClick={() => {
                history.back(-1);
              }}
            >
              取消
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(NewNoticeForm);
