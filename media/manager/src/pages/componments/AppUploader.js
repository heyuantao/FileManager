import axios from 'axios';
import WebUploader from 'webuploader';

class APPUploader{

    constructor() {
        this.clip_upload_data_url = 'http://webstorage.heyuantao.cn/api/upload/'
        this.clip_upload_success_url = 'http://webstorage.heyuantao.cn/api/upload/success/'
    }

    upload(file,key,task){
        const _this = this;
        const webuploader = WebUploader.create({
            server: _this.clip_upload_url, chunked: true, chunkSize: 5 * 1024 * 1024, chunkRetry: 3, threads: 3, duplicate: true,
            formData: {task:task,key:key},
        });

        const runtimeForRuid = new WebUploader.Runtime.Runtime();
        const wuFile = new WebUploader.File(new WebUploader.Lib.File(WebUploader.guid('rt_'),file));
        webuploader.addFiles(wuFile);
        this._webuploader = webuploader;

    }

    scribe(onSuccess,onError,onNext){
        const _this = this;
        const webuploader = this._webuploader;

        webuploader.on('startUpload', function(){ });        //开始上传时，调用该方法

        webuploader.on('uploadProgress', function(file, percentage) { //一个分片上传成功后，调用该方法
            const percentage_string = parseInt(percentage*100);
            onNext(percentage_string);
        });

        webuploader.on('uploadSuccess', function(file) { //整个文件的所有分片都上传成功，调用该方法 上传的信息（文件唯一标识符，文件后缀名）
            const data = {'task': task, 'key':key,'ext': file.source['ext'], 'type': file.source['type']};
            axios.post(_this.clip_upload_success_url,data).then((res)=>{
                console.log('Upload success in APPUploader.scribe() !')
                onSuccess();
            }).catch((err)=>{
                console.log("Upload error in APPUploader.scribe() !");
                console.log(err);
                console.log(err.res);
                onError();
            })
        });

        webuploader.on('uploadError', function(file) {   //上传过程中发生异常，调用该方法
            console.log('Upload error in APPUploader.scribe() !');
            onError();
        });

        webuploader.upload();
    }

    unscribe(){
        const webuploader = this._webuploader;
        webuploader.destroy();
    }
}

let uploader = new APPUploader()

export default uploader
