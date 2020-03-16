//代码封装了webuploader，并通过axios进行文件分片上传，项目在安装时可能依赖jquery
import axios from 'axios';
import WebUploader from 'webuploader';

class ReactWebUploader{
    //设定分片上传和上传完成的数据接口
    constructor() {
        this.clip_upload_data_url       = 'http://webstorage.heyuantao.cn/api/upload/'
        this.clip_upload_success_url    = 'http://webstorage.heyuantao.cn/api/upload/success/'
    }
    //开始上传之前调用
    // 参数说明：file为html5的文件对象;key为目标存储生成的key,也是上传后的文件名;task时服务器发送的上传编号;key和task都为字符型，用于上传时验证授权信息
    upload(file,key,task){
        this.key = key;
        this.task = task;
        const _this = this;
        const webuploader = WebUploader.create({
            server: _this.clip_upload_data_url, chunked: true, chunkSize: 5 * 1024 * 1024, chunkRetry: 3, threads: 3, duplicate: true,
            formData: {task:task,key:key},
        });
        const runtimeForRuid = new WebUploader.Runtime.Runtime();
        const wuFile = new WebUploader.File(new WebUploader.Lib.File(WebUploader.guid('rt_'),file));
        webuploader.addFiles(wuFile);
        this._webuploader = webuploader;
    }
    //三个为回调函数:
    // onSuccess用于上传成功时调用,参数为对于文件的key；
    // onError当上传失败时调用,参数为对于文件的key；
    // onNext当上传分片成功时调用，该函数会被多次调用，其参数时字符型的进度信息
    scribe(onSuccess,onError,onNext){
        const _this = this;
        const webuploader = this._webuploader;
        //开始上传时，调用该方法
        webuploader.on('startUpload', function(){ });
        //当文件分片上传成功后，不断调用该方法
        webuploader.on('uploadProgress', function(file, percentage) {
            const percentage_str = parseInt(percentage*100);
            onNext(percentage_str);
        });
        //整个文件的所有分片都上传成功，调用该方法 上传的信息（文件唯一标识符，文件后缀名）
        webuploader.on('uploadSuccess', function(file) {
            const data = {'task': _this.task, 'key':_this.key,'ext': file.source['ext'], 'type': file.source['type']};
            axios.post(_this.clip_upload_success_url,data).then((res)=>{
                console.log('Upload success in ReactWebUploader.scribe() by webuploader on uploadSuccess callback !')
                onSuccess(_this.key);
            }).catch((err)=>{
                console.log("Upload error in ReactWebUploader.scribe() by webuploader on uploadSuccess callback !");
                onError(_this.key);
            })
        });
        //上传失败时调用
        webuploader.on('uploadError', function(file) {   //上传过程中发生异常，调用该方法
            console.log('Upload error in ReactWebUploader.scribe() by webuploader on uploadError callback !');
            onError(_this.key);
        });
        //开始进行文件上传
        webuploader.upload();
    }
    //文件上传完成后，手动调用该函数销毁所创建的webuploader对象
    unscribe(){
        const webuploader = this._webuploader;
        webuploader.destroy();
    }
}

let reactWebUploader = new ReactWebUploader()

export default reactWebUploader
