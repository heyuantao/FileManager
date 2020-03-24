import React from "react";
import { Upload, Button, message } from 'antd';
import Settings from "../../settings";
import axios from 'axios';
import WebUploader from 'webuploader';

const req = Settings.request;
const uploadTaskAPIURL = Settings.uploadTaskAPIURL;
//import { UploadOutlined } from '@ant-design/icons';

//props.onSuccess props.onNext props.onError
//props.file props.task props.key

class ReactUploader extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            editable: false, mediaFileList: [], mediaUploading: false, mediaPercent: 0, mediaUrl:"",
        };
    }

    componentDidMount() {
        this._uploader = null;
    }

    componentWillUnmount() {
        if(this._uploader!==null){
            this._uploader.destroy();
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

    uploadSuccessFinished =()=>{
        this.setState({mediaUploading:false,mediaPercent: 0, mediaFileList: []});
        if(this._uploader!==null){
            this._uploader.destroy();
        }
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
                _this.uploadSuccessFinished();
            }).catch((err)=>{
                console.log("Upload error finished !");
                console.log(err);
                console.log(err.res);
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

        console.log(new_file_name);
        //if(new_file.size>1024*1024*50){
        //    message.error("文件大小超出限制");
        //    return;
        //}
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
        //uploader.reset();
        this.setState({mediaFileList:[],mediaUploading:false});
    }

    render() {
        const {mediaFileList,editable,mediaUploading,mediaPercent} = this.state;
        const uploadButtonprops = {
            beforeUpload: file => {this.setState((state) => ({mediaFileList: [file],})); return false;},
            onChange: () =>{},
            showUploadList:false,
            mediaFileList,
        };
        return (
            <div style={{lineHeight:"55.63px"}}>
                <Upload {...uploadButtonprops} >
                    <Button>
                        {/*<UploadOutlined /> Select File*/}
                        选择文件
                    </Button>
                </Upload>
                <span style={{marginRight:"10px"}}></span>
                <div></div>
                <Button type="primary" onClick={this.handleUploadClick} disabled={mediaFileList.length === 0} loading={mediaUploading} style={{ marginTop: 16 }} >
                        {mediaUploading ? '上传中: '+mediaPercent+"%" : '开始上传'}
                </Button>
            </div>
        );
    }
}



export default ReactUploader