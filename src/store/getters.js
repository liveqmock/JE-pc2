export const selection = (state)=>{ //业务大小类级联
	let arr = state.tradeType.filter(function(item) {
      return item.value == state.formInline.tradeTypeId;
    })
	state.formInline.busiTypeId = null
	return arr.length>0?arr[0].children:[]
}
export const tradeType=(state)=>{
	return state.tradeType
}
export const formInline = (state)=>{
	return state.formInline
}
export const paymentdata = (state)=>{
	return state.paymentdata
}
export const total = (state)=>{
	return state.total
}
export const currentPage = (state)=>{
	return state.currentPage
}
export const fundsType = (state)=>{
	return state.fundsType
}
export const isTabShow = (state)=>{
	return state.isTabShow
}
export const guaranteeBalance = state=> state.guaranteeBalance
export const commissionBalance = state=> state.commissionBalance
