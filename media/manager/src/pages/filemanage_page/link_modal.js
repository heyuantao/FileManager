import React from "react";
import {Table, Popconfirm, message, Button, Modal } from 'antd';
import { fromJS } from "immutable";
import { connect } from "react-redux";
import axios from 'axios';

class LinkModal extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            url:"",
            key:"",
        }
    }
    componentWillReceiveProps(props) {
        const oldProps = this.props;
        const newProps = props;
        const id = newProps.instanceid;
        if(id!==0){
            this.fetchDownloadUrl();
        }
    }
    fetchDownloadUrl = ()=>{
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
                <Modal title="Download URL" visible={this.props.visible} closable={false} footer={this.footerContent()}>
                    <p>{this.state.url}</p>
                    <a href={this.state.url} target="_blank">下载</a>
                </Modal>
            </div>
        )

    }
}


export default LinkModal