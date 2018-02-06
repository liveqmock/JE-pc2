import Vue from 'vue';
require('es6-promise').polyfill();
import axios from 'axios';
//axios.defaults.withCredentials = true;
import { MessageBox } from 'element-ui';
import m from '../main.js';
export const baseURI = '/sunrise-gateway';
export const httpHeaderConfig = { headers: { "Content-Type": "application/json;charset=UTF-8" } };
export const basePath = '/platform'

export const axiosApi = (api, body, callack, pageIndex, pageSize, otherCallback) => {
	for(let item in body){//搜索条件去掉空格
		if(typeof body[item] == "string"){
			body[item] = body[item].trim();
		}
	}
    body = JSON.stringify(body);
    let data = {
        "body": body,
        "ctrlData": {
            "pageIndex": pageIndex == undefined ? 1 : pageIndex,
            "pageSize": pageSize == undefined ? 1000 : pageSize
        }
    };
    data = JSON.stringify(data);
    return (axios.post(`${baseURI}` + api, data, httpHeaderConfig).then((res) => {
        switch (res.data.code) {
            case "000000": //系统交易成功
                callack(res);
                break;
            case "999999": //系统异常
                if (typeof(otherCallback) == 'function') otherCallback(res);
                MessageBox.alert(res.data.message, '提示', {
                    confirmButtonText: '确定'
                });
                break;
            case "AUTH_001": //用户未登陆
                if (typeof(otherCallback) == 'function') otherCallback(res);
				sessionStorage.clear();//清除全部缓存
				m.$router.push({path:basePath+"/login?isForce=true"});
                break;
            case "AUTH_002": //用户无权限
                if (typeof(otherCallback) == 'function') otherCallback(res);
                MessageBox.alert(res.data.message, '提示', {
                    confirmButtonText: '确定'
                });
                break;
			
			case "LOGIN_006":
				if (typeof(otherCallback) == 'function') otherCallback(res);
				sessionStorage.clear();//清除全部缓存
				m.$router.push({path:basePath+"/login?isForce=true"});
                break;
			
            default:
                if (typeof(otherCallback) == 'function') otherCallback(res);
                break;
        }
    }).catch((err) => {
        MessageBox.alert(err, '提示', {
            confirmButtonText: '确定'
        });
    }))
}

// 获取url中的参数
export const getUrlParam = (name) => {
	var ss = window.location.href.split('?');
	if (!ss || ss.length < 2)
		return null;
	var paramStr = ss[1];
	
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	
	var r = paramStr.match(reg);  //匹配目标参数
	if (r != null) return decodeURI(r[2]); return null; //返回参数值
}
