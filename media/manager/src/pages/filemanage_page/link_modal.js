import React from "react";
import {Table, Popconfirm, message, Button, Modal } from 'antd';
import { fromJS } from "immutable";
import { connect } from "react-redux";
import Settings from "../../settings";

const req = Settings.request;
const fileAPIURL = Settings.fileAPIURL;

class LinkModal extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            url:"",
        }
    }
    componentWillReceiveProps(props) {
        const oldProps = this.props;
        const newProps = props;
        const id = newProps.instanceid;
        if(id!==0){
            this.fetchDownloadUrl(id);
        }
    }
    fetchDownloadUrl = (id)=>{
        const apiURL = fileAPIURL+id+"/";
        req.get(apiURL,{}).then((res)=>{
            const url = res.data.url;
            this.setState({url:url});
        }).catch((err)=>{

        })
    }

    handleOk = (e) => {
        this.props.onOK();
    };

    footerContent =()=>{
        return(
            <Button key="submit" type="primary" onClick={this.handleOk}>OK</Button>
        )

    }
    render() {
        return(
            <div>
                <Modal title="文件下载" visible={this.props.visible} closable={false} footer={this.footerContent()}>
                    <p>{this.state.url}</p>
                    <a href={this.state.url} target="_blank">下载</a>
                </Modal>
            </div>
        )

    }
}


export default LinkModal