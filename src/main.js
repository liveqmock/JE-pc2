import Vue from 'vue'
import store from './store'
import axios from 'axios';
import ElementUI from 'element-ui'
//import '../theme/index.css'
import '../theme/iconfont.css'
import '../theme/common.css'
import '../platform/static/ueditor/themes/default/css/ueditor.css'
import '../platform/static/ueditor/themes/iframe.css'
import '../platform/static/ueditor/third-party/codemirror/codemirror.css'
import App from './App.vue'
import router from './router/router'
import { baseURI, basePath, httpHeaderConfig } from "./api/api";
import registercomponent from './components/registercomponent'

Vue.use(ElementUI)
registercomponent.init()

Vue.prototype.basePath = basePath;

export const bus = new Vue();

Vue.prototype.iconfont = [
	{ label: '全部', value: 'icon-liquor-all' },
	{ label: '白酒', value: 'icon-liquor' },
	{ label: '啤酒', value: 'icon-beer' },
	{ label: '葡萄酒', value: 'icon-wine' },
	{ label: '洋酒', value: 'icon-foreign-wine' },
	{ label: '黄酒', value: 'icon-rice-wine' },
	{ label: '养生酒', value: 'icon-health-wine' },
	{ label: '其他', value: 'icon-other-wine' }
];

let buttonList
bus.$on('buttonList', (data) => {
    buttonList = data;
})
Vue.prototype.showButton = (code, parentId)=>{
	if(!buttonList) buttonList = JSON.parse(sessionStorage.getItem("buttonList"))
	let bool;
	if(!!buttonList) for(var i = 0;i < buttonList.length;i++){
		if(buttonList[i].code == code && buttonList[i].parentId == parentId) {
			bool = true;
			break
		}else{
			bool = false;
		}
	}
	if(sessionStorage.getItem("isAdmin") == 1) bool = true;
	return bool;
}

const loadUserApi = (successCallback, failCallback) => {
    let data = {
        "body": "{}",
        "ctrlData": {
            "pageIndex": 1,
            "pageSize": 10
        }
    };
    data = JSON.stringify(data);
    return (axios.post(`${baseURI}` + "/employee/getLoginInfo", data, httpHeaderConfig).then((res) => {
        switch (res.data.code) {
            case "000000":
                successCallback(res);
                break;
            default:
                failCallback();
                break;
        }
    }).catch((err) => {
        failCallback();
    }))
}
const gotoPageWithSession = (to, next) => {
 if (to.path == basePath+'/login') {
    next({ path: basePath+'/welcome' });
  } else {
    next();
  }
};
router.beforeEach((to, from, next) => {
  if(to.query.isForce){
  	next();
	return;
  }
  if(to.path.indexOf('register') >= 0){
  	next();
	return;
  }
  
  let loginNameInSession = sessionStorage.getItem('loginName1');
  // loginNameInSession不为空
  if (loginNameInSession) {
	gotoPageWithSession(to, next);
	return;
  }else {
		// loginNameInSession 从请求中获取一次
		loadUserApi(
			res => {
				sessionStorage.setItem('loginName', res.data.data.loginName);
				sessionStorage.setItem('traderId',res.data.data.traderId);
				sessionStorage.setItem("isAdmin",res.data.data.isAdmin);
				gotoPageWithSession(to, next);
			},
			res => {
				sessionStorage.clear();//清除全部缓存
				next({ path: basePath+'/login?isForce=true' });
			}
		);
	}
});
let setStartHours = date =>{
	return new Date(date.setHours(0, 0, 0, 0))
}
let setEndHours = date =>{
	return new Date(date.setHours(23, 59, 59, 0))
}
let getWeekStartDate = ()=>{
	let Nowdate = new Date();
	let WeekFirstDay = new Date(Nowdate - (Nowdate.getDay()) * 86400000);
	return setStartHours(WeekFirstDay)
}
//设置0点
Vue.prototype.setStartHours = date=>{
	return new Date(date.setHours(0, 0, 0, 0))
}
//设置23点59分59秒
Vue.prototype.setEndHours = date=>{
	return new Date(date.setHours(23, 59, 59, 0))
}
//获得本周的开始日期 
Vue.prototype.getWeekStartDate = ()=>{
	let Nowdate = new Date();
	let WeekFirstDay = new Date(Nowdate - (Nowdate.getDay()) * 86400000);
	return setStartHours(WeekFirstDay)
}
//获得本周的结束日期
Vue.prototype.getWeekLastDate = ()=>{
	let Nowdate = new Date();
	let WeekFirstDay = getWeekStartDate()
	let WeekLastDay = new Date((WeekFirstDay / 1000 + 6 * 86400) * 1000);
	return setEndHours(WeekLastDay)
}
//本月第一天 
Vue.prototype.getMonthFirstDay = ()=>{
	let Nowdate = new Date();
	let MonthFirstDay = new Date(Nowdate.getFullYear(), Nowdate.getMonth(), 1);
	return setStartHours(MonthFirstDay)
}
//本月最后一天
Vue.prototype.getMonthLastDay = ()=>{
	let Nowdate = new Date();
	let MonthNextFirstDay = new Date(Nowdate.getFullYear(), Nowdate.getMonth() + 1, 1);
	let MonthLastDay = new Date(MonthNextFirstDay - 86400000);
	return setEndHours(MonthLastDay)
}

//vue时间过滤 (1293072805)
Vue.filter('time', function(value) {
	var myDate = new Date(value);
	var year = myDate.getFullYear();
	var month = myDate.getMonth() + 1;
	var day = myDate.getDate();
	var hours = myDate.getHours();
	var minutes = myDate.getMinutes();
	return year + '-' + (month >= 10 ? month : '0' + month) + '-' + (day >= 10 ? day : '0' + day) + ' ' + (hours >= 10 ? hours : '0' + hours) + ':' + (minutes >= 10 ? minutes : '0' + minutes);
});
//vue时间过滤 (1293072805)(适用于超团)
Vue.filter('timeGroup', function(value=0) {
	var myDate = new Date(value);
	var year = myDate.getFullYear();
	var month = myDate.getMonth() + 1;
	var day = myDate.getDate();
	var hours = myDate.getHours();
	var minutes = myDate.getMinutes();
	var seconds = myDate.getSeconds();
	return year + '-' + (month >= 10 ? month : '0' + month) + '-' + (day >= 10 ? day : '0' + day) + ' ' + (hours >= 10 ? hours : '0' + hours) + ':' + (minutes >= 10 ? minutes : '0' + minutes) + ':' + (seconds >= 10 ? seconds : '0' + seconds);
});
//vue数字转字符串
Vue.filter('toString', function(value) {
	return value.toString();
});

//vue 钱过滤器
Vue.filter('fmoney', function(s=0) { //s:传入的float数字 ，n:希望返回小数点几位 
	let n = 2;
	n = n > 0 && n <= 20 ? n : 2;
	s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
	var l = s.split(".")[0].split("").reverse(),
		r = s.split(".")[1];
	let t = "";
	for(let i = 0; i < l.length; i++) {
		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
	}
	return t.split("").reverse().join("") + "." + r;
})
//标准时间转化为时间戳
export function timeStamp(str) {
	str = str.replace(/-/g, "/");
	var date = new Date(str);
	return date.getTime();
}

let checkTime = i=>{
	i = i >= 10 ? i : '0' + i
	return i
}
/*时间戳转化时间字符串*/
Vue.prototype.timeString = (time)=>{
	let hour = parseInt(time / 60 / 60)
	let minute = parseInt(time / 60 % 60)
	let second = parseInt(time % 60)
	hour = checkTime(hour)
	minute = checkTime(minute)
	second = checkTime(second)
	time = hour + ':' + minute + ':' + second
	return time;
}

const m = new Vue({
	el: '#app',
	store,
	router: router,
	render: h => h(App)
})
export default m