import React from "react";
import {Row, Col, Layout, Form, Icon, Input, Card, Button, Table, message} from "antd";
import { fromJS, List} from "immutable";
import moment from 'moment';
import AppPageHeader from "../componments/app_page_header";
import AppPageFooter from "../componments/app_page_footer";
import Settings from "../../settings";

const { Content } = Layout;
const req = Settings.request;
const fileAPIURL = Settings.fileAPIURL;

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: fromJS({}),
            formFieldValidateInfo: "",
            fetching: false,
            pagination: fromJS({ total: 0, pageSize: 8, current: 1}),
            tableData: fromJS([]),
            expendRowKeys:fromJS([]),
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
        let newPagination=fromJS(pagination)
        this.setState({pagination:newPagination},()=>{this.fetchTableListData()})
    }
    fetchTableListData() {
        const formData = this.state.formData;
        const params = formData.toJS();
        const apiURL = fileAPIURL;
        this.setState({fetching:true});

        req.get(apiURL,{params:params}).then((request)=>{
            const tableData = fromJS(request.data.items);
            const pagination = fromJS(request.data.pagination);
            this.setState({tableData:tableData,pagination:pagination,fetching:false});
            let expendRowKeys=tableData.map((item)=>(item.get("id")));
            this.setState({expendRowKeys:expendRowKeys});
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
    tableColumnFormat(){
        const tableColumn = [
            { title: "序号", dataIndex: "id", key: "id" },
            { title: "文件名", dataIndex: "filename", key: "filename" },
            { title: "更新日期", key: "uploaddate",
                render: (text, record) => (
                    <div>
                        {moment(record.uploaddate).format('YYYY MMMM Do  h:mm')}
                    </div>
                )
            },
            { title: "文件大小", dataIndex: "filesize", key: "filesize" },
            { title: "下载链接",  key: "url",
                render: (text, record) => (
                    <div>
                        <a href={record.url} target="_blank">下载</a>
                    </div>
                )
            }
        ];
        return tableColumn;
    }
    searchInFileList =()=>{
        const formData = this.state.formData;
        return(
            <Form layout="inline">
                <Form.Item label={"文件名"} >
                    <Input value={formData.get("search")} onChange={(e)=>{this.handleFormFieldChange(e.target.value,"search")}}
                            placeholder="winrar" />
                </Form.Item>
                <Form.Item style={{float:"right"}}>
                    <Button onClick={()=>{this.handleSearchSubmit()}} type="primary" style={{marginRight:"10px"}}>查找</Button>
                    <Button onClick={()=>{this.handleSearchClear()}} type="default">清空</Button>
                </Form.Item>
            </Form>
        )
    }
    render() {
        const formData = this.state.formData;
        return (
            <Layout className="layout">
                <AppPageHeader></AppPageHeader>
                <Content style={{background: '#fff',minHeight: "850px", padding: 10 }}>

                    <Row type="flex" justify="space-around" align="middle" style={{marginTop:10}}>
                        <Col span={22}>
                            <Card title="文件列表" style={{marginTop:10}} extra={this.searchInFileList()}>
                                <Table dataSource={this.state.tableData.toJS()} rowKey="id"
                                    onChange={(pagination, filters, sorter)=>{this.handleTableChange(pagination, filters, sorter)}}
                                    columns={this.tableColumnFormat()}>
                                </Table>
                            </Card>
                        </Col>
                    </Row>
                </Content>
                <AppPageFooter></AppPageFooter>
            </Layout>
        )
    }
}

export default HomePage
