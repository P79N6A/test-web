import React, { Component } from 'react';
import { Form, Input, Select, Row, Col, Button } from 'antd';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import G from '../../../gobal';

const SelectOption = Select.Option;

const FormItem = Form.Item;

const children = [];
const valueOfAll = [];
for (let i = 10; i < 36; i += 1) {
  children.push(<SelectOption key={`id${i}`}>{i.toString(36) + i}</SelectOption>);
  valueOfAll.push(`id${i}`);
}
children.unshift(<SelectOption key="all">全部</SelectOption>);

class NewNoticeForm extends Component {
  state = {
    editorState: '',
    editor: EditorState.createEmpty(),
    value: [],
  };

  componentDidMount() {
    const { copyValue, form } = this.props;
    if (copyValue) {
      form.setFieldsValue({
        person: copyValue.receiver,
        title: copyValue.title,
      });
      const contentBlock = htmlToDraft(copyValue.editor);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        this.setState({ editor: editorState, editorState: copyValue.editor });
      }
    }
  }

  onEditorStateChange(editorState) {
    this.setState({
      editorState: draftToHtml(convertToRaw(editorState.getCurrentContent())),
      editor: editorState,
    });
  }

  selectAll() {
    const { form } = this.props;
    form.setFieldsValue({
      person: valueOfAll,
    });
  }

  handleChange(values) {
    const isContainerAll = G._.find(values, o => {
      return o === 'all';
    });
    this.setState({
      value: isContainerAll ? valueOfAll : values,
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
          receiver: values.person,
          editor: editorState,
        },
      });
      history.back(-1);
    });
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
            >
              {children}
            </Select>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('editor', {
            rules: [{ validator: this.checkEditor.bind(this) }],
          })(
            <Editor
              editorState={editor}
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
            <Button type="primary" htmlType="submit" onClick={this.handleCommit.bind(this)}>
              发布
            </Button>
            <Button
              style={{ marginLeft: 8 }}
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
