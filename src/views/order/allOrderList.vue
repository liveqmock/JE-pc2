<template>
	<div v-loading="loading">
		<div class="title-menu">
			<div class="clearfix">
				<el-breadcrumb class="fl">
					<el-breadcrumb-item>订单查询</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<el-tabs v-model="activeTab" class='clearfix' @tab-click="handleTabClick">
				<el-tab-pane v-for="item in tabsData" :label="item.val" :name="item.id" key="$index"></el-tab-pane>
			</el-tabs>
		</div>
		<!--插入页面-->
		<div id="merchant-content-div" class='clearfix ptrl-30' >
			<el-form :inline="true" :model="formInlineData" class="clearfix">
				<div style="width:70%" class="fl">
					<el-form-item label="订单编号:">
						<el-input placeholder="请输入订单编号" v-model.trim="formInlineData.orderSn"></el-input>
					</el-form-item>
					<el-form-item label="买家名称:">
						<el-input placeholder="请输入买家名称" v-model.trim="formInlineData.storeName"></el-input>
					</el-form-item>
					<el-form-item label="买家手机:">
						<el-input placeholder="请输入买家手机" v-model.trim="formInlineData.buyerMobile"></el-input>
					</el-form-item>
					<el-form-item label="卖家名称:">
						<el-input placeholder="请输入卖家名称" v-model.trim="formInlineData.sellerName"></el-input>
					</el-form-item>
					<el-form-item label="下单时间:" prop="orderDateRange">
						<!-- <el-date-picker v-model="formInlineData.orderDateRange" class="order-datatimerange" type="datetimerange" placeholder="选择时间范围">
						</el-date-picker> -->
						<ysDaterangePicker v-model="formInlineData.orderDateRange" type="datetime"/>
					</el-form-item>
				</div>
				<el-button @click='handleSearch' type="info" class="supplier-check-btn fl">查询</el-button>
			</el-form>
			<div class="order-list">
				<el-table class="table">
					<el-table-column label='商品' width="330"></el-table-column>
					<el-table-column label='单价' width='80'></el-table-column>
					<el-table-column label='数量' width='70'></el-table-column>
					<el-table-column label='买家名称' width="100"></el-table-column>
					<el-table-column label='卖家名称' width="100"></el-table-column>
					<el-table-column label='支付金额' width="100"></el-table-column>
					<el-table-column label='交易状态' width="90"></el-table-column>
					<el-table-column label='操作'></el-table-column>
				</el-table>
				<div class="table-item-default tac" v-if="tableData.length<=0">
					<img src="../../assets/empty.png" alt="" />
					<div class="color-blue mt-30"><span class="cursor"> 暂无数据 </span></div>
				</div>
				<div >
					<div class="table-item mt-20" v-for='(order, index) in tableData' key='$index'>
						<div class="clearfix table-item-top">
							<span class='fl ml-20 color-9'>下单时间：{{order.gmtCreate | time}}</span>
							<span class='fl ml-50'>订单编号：{{order.sn}}</span>
						</div>
						<div class="table-item-content clearfix" style="display: flex;">
							<!--商品-->
							<div class=" clearfix ">
								<div class="bb clearfix " v-for="(orderItem, index) in order.orderItemVos" key="$index" style="width:450px;padding: 20px 0px 20px 20px;">
									<div class="fl" style="width: 309px;">
										<img v-if="orderItem.image" :src="orderItem.image" class="fl mr-10" />
										<img v-else src="../../assets/goods.png" class="fl mr-10" />
										<p class="color-9 font-14">商品编码：{{orderItem.skuNo}}</p>
										<p>{{orderItem.skuName}}</p>
										<p class="color-9">规格:1*{{orderItem.specInfoNum}}</p>
									</div>
									<div class="fl  tac " style="width:80px;">¥{{orderItem.originPrice | fmoney}}</div>
									<div class="fl  tac " style="width:50px;">{{orderItem.num}}</div>
								</div>
								<!--赠品清单-->
								<div class="bb clearfix " v-for="(orderItem, index) in order.orderGiftResVos" key="$index" style="width: 450px;padding: 20px 0 20px 20px;">
									<div class="fl" style="width: 309px;">
										<img v-if="orderItem.image" :src="orderItem.image" class="fl mr-10" />
	 									<img v-else src="../../assets/goods.png" class="fl mr-10" />
										<p>{{orderItem.skuName}}</p>
									</div>
									<div class="fl  tac " style="width:80px;">¥0</div>
									<div class="fl  tac " style="width:50px;">{{orderItem.giftNum}}</div>
								</div>
							</div>
							<div class="bl bb tac pt-20" style="width: 100px;">
								<p>{{order.buyerName}}</p>
								<p>{{order.buyerPhone}}</p>
							</div>
							<div class="bl bb tac pt-20" style="width: 100px;">
								<p>{{order.sellerName}}</p>
								<p>{{order.sellerPhone}}</p>
							</div>
							<div class="bl bb tac pt-20" style="width: 110px;">
								<p class="tac">¥{{order.needPayMoney | fmoney}}</p>
								<p>含运费(￥{{order.freightMoney | fmoney}})</p>
								<!--<p>{{order.payType==null?'线下支付':''}}</p>
								<p v-if="order.payType == 1">余额支付</p>
								<p v-if="order.payType == 2">授信支付</p>
								<p v-if="order.payType == 3">在线支付</p>-->
							</div>
							<div class="bl bb tac pt-20" style="width: 80px;">
								<!--<p class="color-danger font-14" v-if='order.orderStatus == 1 && (order.lastestRemittanceAuditStatus == 2 || order.lastestRemittanceAuditStatus == null)'>剩余<span v-text="typeof(order.remainAutoCancleTime)=='string'?order.remainAutoCancleTime:null"></span></p>-->
								<p v-if=" order.orderStatus == 0 ">已关闭</p>
								<p v-if=" order.orderStatus == 1 ">待付款</p>
								<p v-if=" order.orderStatus == 2 ">待发货</p>
								<p v-if=" order.orderStatus == 3 ">已发货</p>
								<p v-if=" order.orderStatus == 4 ">已完成</p>
							</div>
							<div class="bl bb tac pt-20" style="flex-grow: 1;width:71px;">
								<router-link :to="`${basePath}/order/orderDetail`">
									<el-button type='text' @click="orderDetail(order.sn)">订单详情</el-button>
								</router-link>
							</div>

						</div>
					</div>
				</div>

			</div>
			<el-pagination v-if='tableData.length>0' class="tar" :current-page="currentPage" :page-size='10' :total='total' layout="prev , pager, next, jumper" @current-change="handleCurrentChange">
				<!-- 分页组件 -->
			</el-pagination>
		</div>

	</div>
</template>
<script>
	import { axiosApi,basePath } from '../../api/api'; // 导入API
	export default {
		data() {
			return {
				tabsData: [{
						id: '6',
						val: '全部订单'
					},
					{
						id: '1',
						val: '待付款'
					},
					{
						id: '2',
						val: '待发货'
					},
					{
						id: '3',
						val: '已发货'
					},
					{
						id: '4',
						val: '已完成'
					},
					{
						id: '0',
						val: '已关闭'
					}
				],
				formInlineData: {
					orderSn: null, //N  订单编号
					storeName: null, //N  买家名称
					buyerMobile: null, //N  买家手机
					itemName: null, //N  商品名称
					sellerName: null, //N  卖家名称
					orderStatus: null, // N  订单状态 0-已关闭 1-待付款 2-待发货 3-已发货 4-已完成
					gmtOrderStart:null,// N 下单开始时间
					gmtOrderEnd:null,// N 下单结束时间
					orderDateRange:[] , //时间范围
					traderType:0
				},
				activeTab: '6', //都是数字
				tableData: [], //全部商户管理的列表
				currentPage: 1,
				total: 0,
				loading: false, // 控制数据的显示
			}

		},
		activated() {
			this.$nextTick(() => {
				this.anonOrderListQuery(this.formInlineData)
			})
		},
		methods: {
			//跳转订单详情页面
			orderDetail(orderSn){
				let supplierOrderDetail = {
					type:'supplierOrderDetail',
					orderSn : orderSn
				}
				sessionStorage.setItem('supplierOrderDetail', JSON.stringify(supplierOrderDetail))
			},
			//订单列表查询及条件查询
			anonOrderListQuery(body){
				this.loading = true
				axiosApi('/anon/order/list/query', body, (res)=>{
//					console.log('订单列表查询及条件查询', res)
					this.tableData = res.data.data.elements
					this.total = res.data.data.totalCount
					this.loading = false
				},this.currentPage,10,(res)=>{
					this.$message({type:'error',message:res.data.message,duration:1000})
					this.loading = false
				})
			},
			//tabs切换
			handleTabClick(val){
				switch (this.activeTab){
					case '6':		//全部订单
						this.formInlineData.orderStatus = null
						break;
					case '1':		//待付款
						this.formInlineData.orderStatus = '1'
						break;
					case '2':		//待付款
						this.formInlineData.orderStatus = '2'
						break;
					case '3':		//待付款
						this.formInlineData.orderStatus = '3'
						break;
					case '4':		//待付款
						this.formInlineData.orderStatus = '4'
						break;
					case '0':		//待付款
						this.formInlineData.orderStatus = '0'
						break;
					default:
						break;
				}
				if(this.currentPage === 1){
					this.anonOrderListQuery(this.formInlineData)
				}else{
					this.currentPage = 1;//赋值自动调用一次接口
				}
				
			},
			//表单条件查询
			handleSearch(){
				//获取开始接受时间
				this.formInlineData.gmtOrderStart =  + new Date(this.formInlineData.orderDateRange[0]) || null
				this.formInlineData.gmtOrderEnd = + new Date(this.formInlineData.orderDateRange[1]) || null
				if(this.currentPage === 1){
					this.anonOrderListQuery(this.formInlineData)
				}else{
					this.currentPage = 1;//赋值自动调用一次接口
				}
			},
			//改变分页
			handleCurrentChange(val){
				this.currentPage = val
				this.anonOrderListQuery(this.formInlineData)
			}
		},
	}
</script>

<style lang="less">
	#merchant-content-div .el-button--text {
		width: auto;
		height: auto;
	}
	
	#merchant-content-div .el-form--inline .el-form-item__label {
		/* 搜索框label 的字体是12px */
		width: 75px;
		font-size: 12px;
	}
	
	#merchant-content-div .el-form--inline .el-input__inner {
		/* 搜索框的字体是12px */
		font-size: 12px;
	}
	
	.supplier-check-btn {
		margin-left: 40px;
	}
	
	.supplier-table-div {
		margin-top: 10px;
		/*el-form inline  */
	}
	
	.supplier-table-div .el-table {
		margin-bottom: 20px;
	}
	#merchant-content-div  .el-date-editor--datetimerange.el-input{width: 240px;}
	#merchant-content-div .order-list{
		.table{
			.el-table__body-wrapper{display: none;}
		}
		.bb{border-bottom: 1px solid #DDDDDD;}
		.bl{border-left: 1px solid #DDDDDD;}
		.el-table .el-table__body-wrapper {
				display: none;
			}
			.table-item {
				border: 1px solid #DDDDDD;
				font-size: 14px;
				border-bottom: none;
				.table-item-content .pbl-20 {
					padding: 0px 0px 20px 20px;
				}
				.table-item-top {
					border-bottom: 1px solid #DDDDDD;
					padding: 10px 0;
					.table-item-top-checkbox {
						margin-left: 14px
					}
				}
				img {
					width: 80px;
					height: 80px;
				}
			}
			.table-item-default {
				height: 530px;
				padding-top: 120px;
			}
	}
</style>