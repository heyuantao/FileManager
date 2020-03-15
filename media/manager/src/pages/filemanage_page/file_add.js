import React from "react";
import {Row, Col, Layout, Form, Icon, Input, Card, Button, Table, message, Popconfirm, Radio, Upload, Alert} from "antd";
import { fromJS, List} from "immutable";
import moment from 'moment';
import LinkModal from "./link_modal";
import UploadModal from "./upload_modal";
import Settings from "../../settings";
import ReactUploader from "../componments/ReactUploader";
import WebUploader from "webuploader";
import axios from "axios";

const { Content } = Layout;
const req = Settings.request;
const fileAPIURL = Settings.fileAPIURL;
const FormItem = Form.Item;
const uploadTaskAPIURL = Settings.uploadTaskAPIURL;

class FileAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: fromJS({}),formFieldValidateInfo: "",
            fetching: false,
            sizeLimit:0,
            editable: false, mediaFileList: [], mediaUploading: false, mediaPercent: 0, mediaUrl:"",
        }
    }

    makeid =()=> {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    uploadSuccessFinished =(key)=>{
        this.setState({mediaUploading:false,mediaPercent: 0, mediaFileList: []});
        if(this._uploader!==null){
            this._uploader.destroy();
        }
        let formData = this.state.formData.merge({key:key});
        console.log("Upload");
        console.log(formData.toJS());
        req.post(fileAPIURL,formData.toJS()).then(()=>{
            message.success('保存记录成功');
        }).catch((error)=>{
            message.error('保存记录失败');
        })
        //req.post()
        message.success('上传成功');
    }

    uploadErrorFinished =()=>{
        this.setState({mediaUploading:false,mediaPercent: 0});
        if(this._uploader!==null){
            this._uploader.destroy();
        }
        message.error('上传失败')
    }

    handleUploadProcess =(task,key,file)=>{
        const clip_upload_url = "http://webstorage.heyuantao.cn/api/upload/";
        const clip_upload_success_url = "http://webstorage.heyuantao.cn/api/upload/success/";
        const _this = this;
        const uploader = WebUploader.create({
            //swf: 'https://cdn.bootcss.com/webuploader/0.1.1/Uploader.swf', //swf位置，这个可能与flash有关
            server: clip_upload_url,                        //接收每一个分片的服务器地址
            chunked: true, chunkSize: 5 * 1024 * 1024, chunkRetry: 3, threads: 3, duplicate: true,
            formData: {task:task,key:key},
        });

        uploader.on('startUpload', function(){ });        //开始上传时，调用该方法

        uploader.on('uploadProgress', function(file, percentage) { //一个分片上传成功后，调用该方法
            const percentage_string = parseInt(percentage*100);
            _this.setState({mediaPercent:percentage_string});
        });

        uploader.on('uploadSuccess', function(file) { //整个文件的所有分片都上传成功，调用该方法 上传的信息（文件唯一标识符，文件后缀名）
            const data = {'task': task, 'key':key,'ext': file.source['ext'], 'type': file.source['type']};
            axios.post(clip_upload_success_url,data).then((res)=>{
                console.log('Upload success finished !')
                _this.uploadSuccessFinished(key);
            }).catch((err)=>{
                console.log("Upload error finished !");
                _this.uploadErrorFinished();
            })
        });

        uploader.on('uploadError', function(file) {   //上传过程中发生异常，调用该方法
            console.log('Upload error finished !');
            _this.uploadErrorFinished();
        });

        const runtimeForRuid = new WebUploader.Runtime.Runtime();
        const wuFile = new WebUploader.File(new WebUploader.Lib.File(WebUploader.guid('rt_'),file));
        uploader.addFiles(wuFile);
        this._uploader = uploader;
        uploader.upload();
    }

    handleUploadClick = () => {
        const {mediaFileList} = this.state;
        const new_file = mediaFileList[0];
        const new_file_name = this.makeid()+"_"+new_file.name;
        const sizeLimit = this.state.sizeLimit; //-1 is not limit

        console.log(new_file_name);
        if( (new_file.size>sizeLimit)&&(sizeLimit!==-1)){
            message.error("文件大小超出限制");
            return;
        }
        this.setState({formData:this.state.formData.merge({filesize:new_file.size})});
        this.setState({mediaUploading:true});
        req.post(uploadTaskAPIURL,{'key':new_file_name}).then((res)=>{
            const task = res.data.task;
            const key = res.data.key;
            const size = res.data.size;
            console.log(task);
            console.log(key);
            this.handleUploadProcess(task,key,new_file);
        }).catch((err)=>{
            message.error('初始化失败，请刷新该页面');
            this.setState({mediaUploading:false});
        })
    }

    uploadFinished =()=>{
        const uploader = this._uploader;
        uploader.reset();
        this.setState({mediaFileList:[],mediaUploading:false});
    }

    getSize =()=>{
        req.get(uploadTaskAPIURL,{}).then((res)=>{
            const sizeLimit = res.data.size;
            this.setState({sizeLimit:sizeLimit});
        }).catch((err)=>{
            message.error('获取文件上传大小上限失败');
        })
    }

    componentDidMount() {
        this._uploader = null;
        this.getSize();
    }
    componentWillUnmount() {
        if(this._uploader!==null){
            this._uploader.destroy();
        }
    }

    handleFieldChange(value, field) {
        let dict = {}; dict[field] = value;
        let change = fromJS(dict);
        this.setState({ formData: this.state.formData.merge(change) }, () => { this.validateForm() })
    }

    validateForm() {
        let formData = this.state.formData;
        this.setState({ formFieldValidateInfo: "" });
        if ( !formData.get("filename") ) {
            this.setState({ formFieldValidateInfo: "请输入文件名 ！" }); return -1;
        }
        //if ( !formData.get("broswerable") ) {
        //    this.setState({ formFieldValidateInfo: "请选择是否可浏览 ！" }); return -1;
        //}
        if( this.state.mediaFileList.length === 0 ){
            this.setState({ formFieldValidateInfo: "请选择文件 ！" }); return -1;
        }
        return 1;
    }

    render() {
        const _this = this;
        const formData = this.state.formData;
        const formItemLayout = { labelCol: { xs: { span: 24 }, sm: { span: 8 }, }, wrapperCol: { xs: { span: 24 }, sm: { span: 16 }, }, };
        const tailFormItemLayout = { wrapperCol: { xs: { span: 24, offset: 0, }, sm: { span: 16, offset: 8, }, }, };
        const {mediaFileList,editable,mediaUploading,mediaPercent} = this.state;
        const uploadButtonprops = {
            beforeUpload: file => {_this.setState((state) => ({mediaFileList: [file],}),()=>{_this.validateForm()} ); return false;},
            onChange: () =>{},
            showUploadList:false,
            mediaFileList,
        };
        return (
            <div>
                <Row type="flex" justify="space-between" align="middle" style={{marginTop:10}}>
                    <Col><h2>添加文件</h2></Col>
                    <Col>
                        <Form layout="inline">
                            <Form.Item style={{float:"right"}}>
                                <Button onClick={()=>{this.props.close()}} type="default">取消</Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
                <Row type="flex" justify="space-around" align="middle" style={{marginTop:10}}>
                    <Col span={12} >
                        <Form className="login-form">
                            <FormItem {...formItemLayout} label="文件名"  required={true}>
                                <Input value={formData.get("filename")} disabled={false}
                                       onChange={(e) => { this.handleFieldChange(e.target.value, "filename") }}
                                       placeholder="" />
                            </FormItem>
                            <Form.Item label="浏览状态" required={true} {...formItemLayout}  >
                                <Radio.Group value={formData.get("broswerable")} onChange={(e) => { this.handleFieldChange(e.target.value, "broswerable") }}
                                    defaultValue={true} buttonStyle="solid" >
                                    <Radio.Button value={true}>可浏览</Radio.Button>
                                    <Radio.Button value={false}>不可浏览</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            <FormItem label="选择文件" required={true}  {...formItemLayout}>
                                <Upload {...uploadButtonprops} >
                                    <Button>
                                        选择文件
                                    </Button>
                                </Upload>
                                <span style={{marginRight:"10px"}}></span>
                                <Button type="primary" onClick={this.handleUploadClick} disabled={this.state.formFieldValidateInfo==="" ? false:true}
                                        loading={mediaUploading} style={{ marginTop: 16 }} >
                                    {mediaUploading ? '上传中: '+mediaPercent+"%" : '开始上传'}
                                </Button>
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
