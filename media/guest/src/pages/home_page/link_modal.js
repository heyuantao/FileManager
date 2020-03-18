import React from "react";
import {Table, Popconfirm, message, Button, Modal, Collapse } from 'antd';
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
            instanceData:fromJS({}),
        }
    }
    componentWillReceiveProps(props) {
        const oldProps = this.props;
        const newProps = props;
        const id = newProps.instanceid;
        if(id!==0){
            this.fetchInstanceData(id);
        }
    }
    fetchInstanceData = (id)=>{
        const apiURL = fileAPIURL+id+"/";
        req.get(apiURL,{}).then((res)=>{
            const data = fromJS(res.data);
            this.setState({instanceData:data});
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
                <Modal title="文件下载" visible={this.props.visible} closable={false} footer={this.footerContent()} width="800px">
                    <Collapse defaultActiveKey={['1','2']} >
                        <Panel header="浏览器下载链接" key="1">
                            <p>{this.state.instanceData.get('url')}</p>
                            <a href={this.state.instanceData.get('url')} target="_blank">下载</a>
                        </Panel>
                        <Panel header="命令行下载链接" key="2">
                            <p>{this.state.instanceData.get('wget_download_command')}</p>
                        </Panel>
                    </Collapse>

                </Modal>
            </div>
        )

    }
}


export default LinkModal