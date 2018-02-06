import { axiosApi } from '~/api/api.js'
export const paymentQuery = ({commit,state},payload)=>{
	axiosApi('/anon/cbs/pay/paymentQuery',state.formInline,(res)=>{
		({elements:state.paymentdata, totalCount:state.total} = res.data.data)
		state.isTabShow = state.formInline.tradeTypeId == null||state.formInline.tradeTypeId == ""
	},state.currentPage,state.pageSize,(res)=>{
		
	})
}

export const platformInfo = ({commmit,state},payload)=>{
	axiosApi('/anon/cbs/account/platformInfo',{},(res)=>{
		state.guaranteeBalance = res.data.data.guaranteeBalance
		state.commissionBalance = res.data.data.commissionBalance
	},null,null,(res)=>{
		
	})
}
