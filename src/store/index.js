import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as mutations from './mutations'
import * as getters from './getters'
/*站点管理  预览*/
import homeSearch from './modules/homeindex.js'
/* 商家交易流水 vuex */
import tradingWater from "./modules/tradingWater.js"

Vue.use(Vuex)

const state = {
	//交易记录
	tradeType:[ //业务大类，业务小类
		{label:'充值提现',value:10,children:[{label:'在线充值',value:1101},{label:'在线消费充值',value:1102},{label:'提现失败返点',value:1106},{label:'余额提现',value:2101}]},
		{label:'转账',value:20,children:[]},
		{label:'交易',value:30,children:[{label:'订单结算',value:1301},{label:'订单撤销退点',value:1303},{label:'订单扣款',value:2301},{label:'订单回款撤销',value:2304}]},
		{label:'调帐',value:40,children:[]},
		{label:'利润',value:31,children:[]},
		{label:'退款',value:32,children:[]},
		{label:'手续费',value:50,children:[]},
		{label:'促销',value:60,children:[]},
		{label:'其他',value:100,children:[]}
	],
	//查询表单
	formInline: {
		fundsId: null,  //流水编号
		time: [],		
		tradeTypeId: null,  //业务大类
		busiTypeId: null,  //业务小类
		fundsType: null, //流水类型 
		startCreateTime: null, //开始时间
		endCreateTime: null //结束时间
	},
	paymentdata:[], // zjl 交易记录数据
	total:0, //zjl 交易记录总条数
	currentPage:1, //zj l
	fundsType: '0', //明细类型 流水类型2-支出 1-收入
	pageSize: 10, //zjl 每页显示条目个数
	//交易记录
	paymentTab:'0',  //账户中心Tab切换
	guaranteeBalance:0,  //待结算金额
	/* 3期新添手续费 */
	commissionBalance:0  //待结算手续费
}
const store = new Vuex.Store({
	state,
	getters,
	mutations,
	actions,
	modules: {
		homeSearch: homeSearch,
		tradingWater: tradingWater
	}
})
export default store
