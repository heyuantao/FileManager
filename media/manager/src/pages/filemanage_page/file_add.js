import React from "react";
import {Link} from "react-router";
import {Row, Col, Icon, Form, Input, Button, Alert, message, Upload, Radio} from 'antd';
import { fromJS } from "immutable";
import axios from 'axios';
import Settings from "../../settings";
import reactWebUploader from "../componments/ReactWebUploader";

const FormItem = Form.Item;

const req = Settings.request
const fileAPIURL = Settings.fileAPIURL;
const uploadTaskAPIURL = Settings.uploadTaskAPIURL;

class FileAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: fromJS({browserable:true}),formFieldValidateInfo: "",fetching: false,
            sizeLimit:0,
            editable: false, mediaFileList: [], mediaUploading: false, mediaPercent: 0, mediaUrl:"",
        }
    }
    componentDidMount(){
        this.fetchData()
    }
    componentWillUnmount() {
        if(this._reactWebUploader!==null){
            this._reactWebUploader.unscribe();
        }
    }
    fetchData(){
    }
    handleFieldChange(value, field) {
        let dict = {}; dict[field] = value;
        let change = fromJS(dict);
        this.setState({ formData: this.state.formData.merge(change) }, () => { this.validateForm() })
    }

    validateForm() {
        console.log(this.state.formData.toJS());
        let formData = this.state.formData;
        this.setState({ formFieldValidateInfo: "" });
        if ( !formData.get("filename") ) {
            this.setState({ formFieldValidateInfo: "请输入文件名 ！" }); return -1;
        }
        if( this.state.mediaFileList.length === 0 ){
            this.setState({ formFieldValidateInfo: "请选择文件 ！" }); return -1;
        }
        return 1;
    }

    onReactWebUploaderSuccess =(key)=>{
        console.log("上传成功");
        if(this._reactWebUploader!==null){
            this._reactWebUploader.unscribe();
        }
        this._reactWebUploader=null;

        this.setState({mediaUploading:false,mediaPercent: 0, mediaFileList: []});
        const formData = this.state.formData.merge({key:key});
        req.post(fileAPIURL,formData.toJS()).then(()=>{
            message.success('保存记录成功');
            this.props.close();
        }).catch((error)=>{
            message.error('保存记录失败');
        })
        this.setState({mediaUploading:true});
    }
    onReactWebUploaderError =(key)=>{
        if(this._reactWebUploader!==null){
            this._reactWebUploader.unscribe();
        }
        this._reactWebUploader=null;
        this.setState({mediaUploading:true});
        message.error('上传失败')
    }
    onReactWebUploaderNext =(percent)=>{
        this.setState({mediaPercent:percent});
    }
    uploadFile =(file,key,task)=>{
        reactWebUploader.upload(file,key,task);
        this._reactWebUploader= reactWebUploader;
        reactWebUploader.scribe(this.onReactWebUploaderSuccess,this.onReactWebUploaderError,this.onReactWebUploaderNext);

    }

    handleUploadClick =()=>{
        let file = null;
        if(this.state.mediaFileList.length===0){
            message.error('未选择文件');
            return;
        }
        file = this.state.mediaFileList[0];
        this.setState({mediaUploading:true});
        req.post(uploadTaskAPIURL,{'key':file.name}).then((res)=>{
            const task = res.data.task;
            const key = res.data.key;
            const size = res.data.size;
            this.uploadFile(file,key,task);
        }).catch((err)=>{
            message.error('初始化失败，请刷新该页面');
            this.setState({mediaUploading:false});
        })

    }
    render() {
        const _this = this;
        const formData = this.state.formData;
        const disabled = this.state.mediaUploading;
        const formItemLayout = { labelCol: { xs: { span: 24 }, sm: { span: 8 }, }, wrapperCol: { xs: { span: 24 }, sm: { span: 16 }, }, };
        const tailFormItemLayout = { wrapperCol: { xs: { span: 24, offset: 0, }, sm: { span: 16, offset: 8, }, }, };
        const {mediaFileList,editable,mediaUploading,mediaPercent} = this.state;
        const uploadButtonprops = {
            beforeUpload: file => {
                const formData = this.state.formData.merge({filename:file.name})
                _this.setState({mediaFileList: [file],formData:formData},()=>{_this.validateForm()} ); return false;
                },
            onChange: () =>{},
            showUploadList:false,
            mediaFileList,
        };
        return (
            <div>
                <Row type="flex" justify="space-between" align="middle" style={{marginTop:10}}>
                    <Col><h2>添加文件</h2></Col>
                </Row>
                <Row type="flex" justify="space-around" align="middle" style={{marginTop:10}}>
                    <Col span={12} >
                        <Form className="login-form">
                            <FormItem label="选择文件" required={true}  {...formItemLayout} >
                                <Upload {...uploadButtonprops}>
                                    <Button disabled={disabled}>
                                        选择文件
                                    </Button>
                                </Upload>
                            </FormItem>
                            <FormItem {...formItemLayout} label="上传后的文件名"  required={true}>
                                <Input value={formData.get("filename")} disabled={disabled}
                                       onChange={(e) => { this.handleFieldChange(e.target.value, "filename") }}
                                       placeholder="" />
                            </FormItem>
                            <Form.Item label="浏览状态" required={true} {...formItemLayout}  >
                                <Radio.Group value={formData.get("browserable")} onChange={(e) => { this.handleFieldChange(e.target.value, "browserable") }}
                                    defaultValue={true} buttonStyle="solid" disabled={disabled}>
                                    <Radio.Button value={true}>可浏览</Radio.Button>
                                    <Radio.Button value={false}>不可浏览</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            <FormItem hasFeedback  {...tailFormItemLayout}>
                                <Button type="primary" onClick={this.handleUploadClick} disabled={this.state.formFieldValidateInfo==="" ? false:true}
                                        loading={mediaUploading} style={{ marginTop: 16,marginRight:20}} >
                                    {mediaUploading ? '上传中: '+mediaPercent+"%" : '上传'}
                                </Button>
                                <Button onClick={()=>{this.props.close()}}>取消</Button>
                            </FormItem>
                            <FormItem hasFeedback  {...tailFormItemLayout}>
                                {(this.state.formFieldValidateInfo !== "") &&
                                    <Alert message={this.state.formFieldValidateInfo} type="error" />
                                }
                            </FormItem>

                        </Form>
                    </Col>

                </Row>
            </div>
        )
    }
}

export default FileAdd
