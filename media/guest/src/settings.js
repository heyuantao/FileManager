import cookie from "react-cookie";
import axios from "axios";
import {message} from 'antd';

let baseUrl=""

const csrftoken=cookie.load('csrftoken');
const req=axios.create({
    baseURL:baseUrl,
    headers: {
        'X-CSRFToken': csrftoken,
        'Content-Type': 'application/json;charset=UTF-8',
        "Accept": "application/json"
    }
})

req.interceptors.response.use(
    function (response){
        //let response = success.response;
        if(response.headers["content-type"]!=='application/json'){
            window.location.reload();
        }
        return response;
    },
    function(error){
        let response = error.response;
        if(response){
            if( (response.status!==302)&&(response.data!==undefined)&&(response.data.error_message!==undefined)){
                message.error(response.data.error_message)
            }
            if( response.status >=500 ){
                message.error("请检查您的网络连接")
            }
        }
        throw error;
    }
);


export default{
    request:req,
    autoLogin:false,
    userAPIURL:"/api/v1/user/",
    loginAPIURL:"/api/v1/login/",
    logoutAPIURL:"/api/v1/logout/",
}
