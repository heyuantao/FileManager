import React from "react";
import {Row, Col, Icon, Form, Input, Button, Alert, message, Upload, Radio} from 'antd';
import { fromJS } from "immutable";
import Settings from "../../settings";
import {ReactFileUploader, isUploadFileExceedSizeLimit} from "../componments/ReactWebUploader";

const FormItem = Form.Item;

const req = Settings.request
const fileAPIURL = Settings.fileAPIURL;
const uploadTaskAPIURL = Settings.uploadTaskAPIURL;

class FileEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            formData: fromJS({browserable:true}),formFieldValidateInfo: "",fetching: false, editable: false,
            sizeLimit:0,
            mediaFileList: [], mediaUploading: false, mediaPercent: 0, mediaUrl:"",
        }
    }

    componentDidMount(){
        this.fetchData()
    }

    componentWillUnmount() {
        this.cleanUploadFile();
    }

    fetchData(){
        this.getUploadSizeLimit();
        const url = fileAPIURL+this.props.instanceId+"/";
        //console.log(url);
        req.get(url,{}).then((res)=>{
            const data = res.data;
            //console.log(data);
            this.setState({formData:fromJS((data))});
        }).catch((err)=>{
            message.error('获取文件信息失败')
        })
    }

    getUploadSizeLimit =()=>{
        req.get(uploadTaskAPIURL,{}).then((res)=>{
            const sizeLimit = res.data.size;
            this.setState({sizeLimit:sizeLimit});
        }).catch((err)=>{
            message.error('获取文件上传大小上限失败');
        })
    }

    isUploadFileExceedSizeLimit =(file,sizeLimit)=>{
        if(sizeLimit===-1){
            return false;
        }else if(file.size > this.props.sizeLimit){
            return false;
        }else{
            return true;
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
        //if( this.state.mediaFileList.length === 0 ){
        //    this.setState({ formFieldValidateInfo: "请选择文件 ！" }); return -1;
        //}
        return 1;
    }

    onFileUploaderSuccess =(key)=>{
        this.setState({mediaPercent: 0, mediaFileList: []});
        const formData = this.state.formData.merge({key:key});
        const url = fileAPIURL+this.props.instanceId+"/";
        req.put(url,formData.toJS()).then(()=>{
            message.success('保存记录成功');
            this.cleanUploadFile();
            this.setState({mediaUploading:false});
            this.props.changeModeAndInstanceId("list");
        }).catch((error)=>{
            message.error('保存记录失败');
            this.setState({mediaUploading:false});
            this.cleanUploadFile();
        });
    }

    onFileUploaderError =(key)=>{
        this.cleanUploadFile()
        this.setState({mediaUploading:false});
        message.error('上传失败')
    }

    onFileUploaderNext =(percent)=>{
        this.setState({mediaPercent:percent});
    }

    onFilePreUploadError =(msg)=>{
        this.cleanUploadFile()
        this.setState({mediaUploading:false});
        message.error(msg);
    }

    uploadFile =(file,key,task)=>{
        const fileUploader = ReactFileUploader.create(file,key,task);
        this._fileUploader= fileUploader;
        this._fileUploader.scribe(this.onFileUploaderSuccess,this.onFileUploaderError,this.onFileUploaderNext,this.onFilePreUploadError);
    }

    cleanUploadFile =()=>{
        if((this._fileUploader)&&(this._fileUploader!==null)){
            const fileUploader = this._fileUploader;
            this._fileUploader=null;
            fileUploader.unscribe();
        }
    }

    handleUploadButtonClick =()=>{
        let file = null;
        if(this.state.mediaFileList.length===0){    //如果用户不上传文件，则直接调用上传成功的函数
            const key = this.state.formData.get('key');
            this.onFileUploaderSuccess(key);
            return;
        }
        file = this.state.mediaFileList[0];
        if(isUploadFileExceedSizeLimit(file,this.state.sizeLimit)===true){
            const sizeInMB = Math.floor(this.state.sizeLimit/(1024*1024));
            message.error('上传的文件不能超过'+sizeInMB+"MB");
            return;
        }
        if(file.size===0){
            message.error('该文件大小为零');
            return;
        }
        this.setState({formData:this.state.formData.merge({filesize:file.size})});
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
                    <Col><h2>文件编辑</h2></Col>
                </Row>
                <Row type="flex" justify="space-around" align="middle" style={{marginTop:60}}>
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
                                <Button type="primary" onClick={this.handleUploadButtonClick} disabled={this.state.formFieldValidateInfo==="" ? false:true}
                                        loading={mediaUploading} style={{ marginTop: 16,marginRight:20}} >
                                    {mediaUploading ? '上传中: '+mediaPercent+"%" : '保存'}
                                </Button>
                                <Button onClick={()=>{this.props.changeModeAndInstanceId('list')}}>取消</Button>
                            </FormItem>
                            <FormItem hasFeedback  {...tailFormItemLayout} style={{marginBottom:"200px"}}>
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

export default FileEdit
