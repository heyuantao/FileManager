import React from "react";
import {Row, Col, Layout, Form, Icon, Input, Card, Button, Table, message, Popconfirm} from "antd";
import { fromJS, List} from "immutable";
import moment from 'moment';
import LinkModal from "./link_modal";
import Settings from "../../settings";

const { Content } = Layout;
const req = Settings.request;
const fileAPIURL = Settings.fileAPIURL;

class FileList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: fromJS({}),formFieldValidateInfo: "",
            fetching: false,
            tableData: fromJS([]),pagination: fromJS({ total: 0, pageSize: 8, current: 1}),
            linkModalVisible:false, linkModalInstanceId:0,
        }
    }
    componentDidMount() {
        this.fetchTableListData();
    }
    validateFormField() {
        let formData = this.state.formData;
        this.setState({ formFieldValidateInfo: "" })

        if (!formData.get("search")) {
            message.error("文件名不能为空！");
            return -1
        }
        return 1;
    }
    handleTableChange(pagination, filters, sorter){
        console.log(pagination);
        let newPagination=fromJS(pagination)
        this.setState({pagination:newPagination},()=>{this.fetchTableListData()})
    }
    fetchTableListData() {
        const params = this.state.pagination.merge(this.state.formData).toJS();
        const apiURL = fileAPIURL;
        this.setState({fetching:true});
        req.get(apiURL,{params:params}).then((request)=>{
            const tableData = fromJS(request.data.items);
            const pagination = fromJS(request.data.pagination);
            this.setState({tableData:tableData,pagination:pagination,fetching:false});
            //let expendRowKeys=tableData.map((item)=>(item.get("id")));
            //this.setState({expendRowKeys:expendRowKeys});
        }).catch((error)=>{
            this.setState({fetching:false});
        })

    }
    handleFormFieldChange(value, fieldName) {
        let dict = {}; dict[fieldName] = value;
        let change = fromJS(dict);
        this.setState({ formData: this.state.formData.merge(change) });
    }
    handleSearchSubmit(){
        if(this.validateFormField()<0){
            return;
        }
        this.fetchTableListData();
    }
    handleSearchClear(){
        const formData = fromJS({});
        const tableData = fromJS([]);
        this.setState({formData:formData,tableData:tableData},()=>{
            this.fetchTableListData();
        });
    }
    handleDeleteTableItem = (id,key)=>{
        const apiURL = fileAPIURL+id+"/";
        req.delete(apiURL,{"key":key}).then((res)=>{
            message.success('Delete Success !');
            this.fetchTableListData();
        }).catch((err)=>{
            message.error('Delete Error !');
        })
    }
    handleLinkClick = (id,key)=>{
        this.setState({linkModalVisible:true,linkModalInstanceId:id});
    }
    handleLinkModalClose =()=>{
        this.setState({linkModalVisible:false,linkModalInstanceId:0});
    }
    handleUploadModalClose =()=>{
        this.setState({uploadModalVisible:false});
    }
    tableColumnFormat(){
        const tableColumn = [
            { title: "文件名", dataIndex: "filename", key: "filename" },
            { title: "更新日期", key: "uploaddate",
                render: (text, record) => (
                    <div>
                        {moment(record.uploaddate).format('YYYY MMMM Do  h:mm')}
                    </div>
                )
            },
            { title: "文件大小", dataIndex: "filesize", key: "filesize" },
            { title: "可浏览", key: "browserable",
                render: (text,record) =>(
                    <div>
                        { (record.browserable===true)&&<span>普通用户可见</span>}
                        { (record.browserable===false)&&<span>仅管理员可见</span>}
                    </div>
                )
            },
            { title: "下载链接",  key: "url",
                render: (text, record) => (
                    <div>
                        <a onClick={(event)=>{this.handleLinkClick(record.id,record.filename)}}>地址</a>
                    </div>
                )
            },
            {title:'操作',  key:'action',
                render: (text, record) => (
                    <span>
                        <Popconfirm title="Delete?" okText="Confirm" cancelText="Cancel"
                            onConfirm={() => { this.handleDeleteTableItem(record.id,record.filename) }}>
                            <a>删除</a>
                        </Popconfirm>
                    </span>
                ),
            },
        ];
        return tableColumn;
    }

    render() {
        const formData = this.state.formData;
        return (
            <div>
                <Row type="flex" justify="space-between" align="middle" style={{marginTop:10}}>
                    <Col><h2>文件列表</h2></Col>
                    <Col>
                        <Form layout="inline">
                            <Form.Item label={"文件名"} >
                                <Input value={formData.get("search")} onChange={(e)=>{this.handleFormFieldChange(e.target.value,"search")}}
                                       placeholder="winrar" />
                            </Form.Item>
                            <Form.Item style={{float:"right"}}>
                                <Button onClick={()=>{this.handleSearchSubmit()}} type="primary" style={{marginRight:"10px"}}>查找</Button>
                                <Button onClick={()=>{this.handleSearchClear()}} type="default" style={{marginRight:"10px"}}>清空</Button>
                                <Button onClick={()=>{this.props.close()}} type="default">文件上传</Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
                <Row type="flex" justify="space-around" align="middle" style={{marginTop:10}}>
                    <Col span={24}>
                        <Table dataSource={this.state.tableData.toJS()} rowKey="id" pagination={this.state.pagination.toJS()}
                               onChange={(pagination, filters, sorter)=>{this.handleTableChange(pagination, filters, sorter)}}
                               columns={this.tableColumnFormat()}>
                        </Table>
                    </Col>
                </Row>

                <LinkModal visible={this.state.linkModalVisible} instanceid={this.state.linkModalInstanceId}
                    onOK={()=>{this.handleLinkModalClose()}}></LinkModal>
            </div>

        )
    }
}

export default FileList
