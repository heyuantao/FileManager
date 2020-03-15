import React from "react";
import {Table, Popconfirm, message, Button, Modal } from 'antd';
import { fromJS } from "immutable";
import { connect } from "react-redux";
import Settings from "../../settings";
import ReactUploader from "../componments/ReactUploader";

class UploadModal extends React.Component{
    constructor(props) {
        super(props);
        this.state={};
    }

    fetchDownloadUrl = (id)=>{
    }

    handleOk = () => {
        this.props.onOK();
    };

    footerContent =()=>{
        return(
            <Button key="submit" type="primary" onClick={()=>{this.handleOk()}}>OK</Button>
        )

    }
    render() {
        return(
            <div>
                <Modal title="文件上传" visible={this.props.visible} closable={false} footer={this.footerContent()}>
                    <ReactUploader></ReactUploader>
                </Modal>
            </div>
        )

    }
}


export default UploadModal