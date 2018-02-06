/**
 * 
 * 商家交易流水 
 */
import { axiosApi, basePath } from '../../api/api.js'
import m from '../../main.js';


export default {
    namespaced: true,
    state:{
        //查询表单
        basePath:basePath,
		formInline: {
			time: [],		
			tradeTypeId: null,  //业务大类
			busiTypeId: null,  //业务小类
			fundsType: null, //流水类型 
			startCreateTime: null, //开始时间
            endCreateTime: null, //结束时间
            userName:null //商家名称
        },
        paymentdata:[],// 交易记录数据
        //交易记录
		tradeType:[ //业务大类，业务小类
			{label:'充值提现',value:10,children:[{label:'在线充值',value:1101},{label:'在线消费充值',value:1102},{label:'提现失败返点',value:1106},{label:'余额提现',value:2101}]},
			{label:'转账',value:20,children:[]},
			{label:'交易',value:30,children:[{label:'订单结算',value:1301},{label:'订单撤销退点',value:1303},{label:'订单扣款',value:2301},{label:'订单回款撤销',value:2304}]},
			{label:'调帐',value:40,children:[]},
			{label:'利润',value:31,children:[]},
			{label:'退款',value:32,children:[]},
			{label:'手续费',value:50,children:[{label:'在线支付手续费加点',value:1501},{label:'在线支付手续费扣款',value:2501}]},
			{label:'促销',value:60,children:[]},
			{label:'其他',value:100,children:[]}
        ],
        selection: [],//业务小类
        total:0,//总条数  
        currentPage:1,//页数
    },
    mutations:{
        search(state){  //查询
			if(state.formInline.time.length > 0) {
				state.formInline.time = state.formInline.time.map((item) => {
					if (new Date(item).getTime()==0) {
						return null
					}
					return new Date(item).getTime()
				})
				state.formInline.startCreateTime = state.formInline.time[0]
				state.formInline.endCreateTime = state.formInline.time[1]
			} else {
				state.formInline.startCreateTime = state.formInline.endCreateTime = null
            }
            state.currentPage = 1
		},
        currentpageChange(state,payload=1){ //分页change
			state.currentPage = payload
        },
        goOrderDetail(state,payload){   //订单编号存入回话存储（我的订单）
            sessionStorage.setItem('supplierOrderDetail',payload.session)
            m.$router.push(state.basePath + payload.path + '/orderDetail')	
        },
        
    },
    actions:{
        /* 商家交易记录查询限余额账本 */
        paymentQuery({state,commit}){
            axiosApi('/anon/cbs/pay/traderPaymentQuery',state.formInline,(res)=>{
                ({elements:state.paymentdata, totalCount:state.total} = res.data.data)
            },state.currentPage,10,(err)=>{})
        }
    },
    getters: {
		selection(state){ //业务大小类级联
			let arr = state.tradeType.filter(function(item) {
	          return item.value == state.formInline.tradeTypeId;
	        })
			state.formInline.busiTypeId = null
			return arr.length>0?arr[0].children:[]
        }
    }
}
