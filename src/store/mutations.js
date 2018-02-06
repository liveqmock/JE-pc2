
//交易记录zjl
export const search = (state)=>{  //查询
	state.currentPage = 1
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
	if (state.fundsId == "") { //流水编号
		state.fundsId = null
	}
}
export const currentpageChange = (state,payload=1)=>{ //分页change
	state.currentPage = payload
}
export const tabChange=(state,payload)=>{ //切换tab
	state.currentPage = 1
	state.fundsType = payload
	switch (state.fundsType){
		case '0':
			state.formInline.fundsType  = null
			break;
		case '1':
			state.formInline.fundsType = 1
			break
		case '2': 
			state.formInline.fundsType = 2
			break
		default:
			break;
	}
}
export const paymentTabClick = (state,payload)=>{
	state.paymentTab = payload.name
	tradeType(state)
}
export const tradeType = (state)=>{  //paymentTab 改变
	switch (state.paymentTab){
		case '0':    //最近交易记录
			state.formInline.tradeTypeId = null //大类
			state.formInline.busiTypeId = null //小类
			break;
		case '1':    //充值记录
			state.formInline.tradeTypeId = 10
			state.formInline.busiTypeId = 1101
			break
		case '2':   //提现记录
			state.formInline.tradeTypeId = 10 //大类
			state.formInline.busiTypeId = 2101 //小类
			break
		case '3':     //退款记录
			state.formInline.tradeTypeId = 32 //大类
			state.formInline.busiTypeId = null //小类
			break
		default:
			break;
	}
}
export const clearForm = (state)=>{ //清空查询条件
	state.formInline =  {
		fundsId: null,  //流水编号
		time: [],		
		tradeTypeId: null,  //业务大类
		busiTypeId: null,  //业务小类
		fundsType: null, //流水类型 
		startCreateTime: null, //开始时间
		endCreateTime: null //结束时间
	}
}
export const goOrderDetail = (state,payload)=>{   //订单编号存入回话存储（我的订单）
		let supplierOrderDetail = {
			type:'supplierOrderDetail',
			orderSn : payload
		}
		sessionStorage.setItem('supplierOrderDetail', JSON.stringify(supplierOrderDetail))
}
