import React from "react";
import {Table, Popconfirm, message, Button, Modal,Collapse } from 'antd';
import { fromJS } from "immutable";
import { connect } from "react-redux";
import Settings from "../../settings";

const { Panel } = Collapse;

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
    pannelOneHeader =()=>{
        return(
            <div>
                <div style={{display:"inline"}}>浏览器下载链接</div>
                <a href={this.state.url} target="_blank" style={{marginLeft:"10px",display:"inline"}}>下载</a>
            </div>

        )
    }
    render() {
        return(
            <div>
                <Modal title="文件下载" visible={this.props.visible} closable={false} footer={this.footerContent()}>
                    <Collapse defaultActiveKey={['1','2']} >
                        <Panel header={this.pannelOneHeader()} key="1">
                            <p>{this.state.url}</p>

                        </Panel>
                        <Panel header="命令行下载链接" key="2">
                            <p>{this.state.url}</p>
                        </Panel>
                    </Collapse>

                </Modal>
            </div>
        )

    }
}


export default LinkModal