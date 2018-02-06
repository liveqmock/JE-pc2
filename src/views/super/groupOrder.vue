<template>
	<div v-loading="loading" id="groupOrder">
		<div class="title-menu">
			<div class="clearfix">
				<el-breadcrumb class="fl">
					<el-breadcrumb-item>订单管理</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<div style='position: relative;'>
				<el-tabs v-model="activeTab" class='clearfix' @tab-click="handleTabClick">
					<el-tab-pane v-for="item in tabsData" :label="item.val" :name="item.id" key="$index"></el-tab-pane>
				</el-tabs>
				<!--未付款标记-->
				<el-badge class="notPayCountmark" :max="99" :value="badge.notPayCount" />
				<!--待发货标记-->
				<el-badge class="notDeliveryCount" :max="99" :value="badge.notDeliveryCount" />
				<!--待收货标记-->
				<el-badge class="orderDeliveriedCount" :max="99" :value="badge.orderDeliveriedCount" />
			</div>
		</div>
		<!--插入页面-->
		<div id="group-content-div" class='clearfix ptrl-30'>
			<el-form :inline="true" :model="formInlineData" class="clearfix">
				<div style="width:70%" class="fl">
					<el-form-item label="销售单号:">
						<el-input placeholder="请输入销售单号" v-model.trim="formInlineData.orderSn"></el-input>
					</el-form-item>
					<el-form-item label="关联单号:">
						<el-input placeholder="请输入关联单号" v-model.trim="formInlineData.parentOrderSn"></el-input>
					</el-form-item>
					<el-form-item label="上游卖家:">
						<el-input placeholder="请输入上游卖家" v-model.trim="formInlineData.parentStoreName"></el-input>
					</el-form-item>
					<el-form-item label="商家类型:">
						<el-select v-model="formInlineData.type" clearable placeholder="请选择商家类型">
							<el-option label="大B自销" value="1"></el-option>
							<el-option label="小B自销" value="2"></el-option>
							<el-option label="小B代销" value="3"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="超团卖家:">
						<el-input placeholder="请输入超团卖家名称" v-model.trim="formInlineData.storeName"></el-input>
					</el-form-item>
					<el-form-item label="顾客:">
						<el-input placeholder="请输入顾客名称" v-model.trim="formInlineData.addrUsername"></el-input>
					</el-form-item>
					<el-form-item label="下单时间:" prop="orderDateRange">
						<el-date-picker v-model="formInlineData.orderDateRange" class="order-datatimerange" type="datetimerange" placeholder="选择时间范围">
						</el-date-picker>
					</el-form-item>
				</div>
				<el-button @click='handleSearch' type="info" class="supplier-check-btn fl">查询</el-button>
			</el-form>
			<div class="clearfix">
				<span class="color-blue cursor fr mr-30 mb-10" @click="exportOrder">批量导出</span >
			</div>
			<div class="order-list" style="margin-top: -20px;">
				<el-checkbox v-model="checkAll" @change="handleCheckAllChange"  class="checkedAll"></el-checkbox>
				<el-table class="table">
					<el-table-column label='商品' width="315" align="center"></el-table-column>
					<el-table-column label='商品金额' width='80'></el-table-column>
					<el-table-column label='佣金' width='50'></el-table-column>
					<el-table-column label='数量' width='40'></el-table-column>
					<el-table-column label='上游卖家' width="80"></el-table-column>
					<el-table-column label='超团卖家' width="75"></el-table-column>
					<el-table-column label='类型' width="55"></el-table-column>
					<el-table-column label='支付金额' width="75"></el-table-column>
					<el-table-column label='顾客' width="40"></el-table-column>
					<el-table-column label='订单状态' width="80"></el-table-column>
					<el-table-column label='操作'></el-table-column>
				</el-table>
				<div class="table-item-default tac" v-if="tableData.length<=0">
					<img src="../../assets/empty.png" alt="" />
					<div class="color-blue mt-30"><span class="cursor">暂无数据 </span></div>
		</div>
		<div>
			<el-checkbox-group v-model="checkOrder" @change="handleCheckChange">
				<div class="table-item mt-10" v-for='(order, index) in tableData' key='$index'>
					<div class="clearfix table-item-top lh-20 bbd bg-e">
						<el-checkbox class="fl" :label="order"></el-checkbox>
						<span class='fl'>销售单号：{{order.sn}}</span>
						<span v-if='order.parentOrderSn' class='fl ml-20'>进货单号：{{order.parentOrderSn}}</span>
						<span class='fl color-6 ml-20'>下单时间：{{order.gmtCreate | timeGroup}}</span>
						<span class='fr color-6 mr-30' v-if="order.orderStatus==1">还剩<span class="color-danger">{{order.remainAutoCancleTime}}</span>自动取消</span>
					</div>
					<div class="table-item-content clearfix bbd" style="display: flex;">
						<div class=" clearfix" style="width:580px;box-sizing: border-box;">
							<!--商品清单-->
							<div class="clearfix " :class='index != order.grouponOrderItemVOs.length-1 ? "bb":""' v-for="(orderItem, index) in order.grouponOrderItemVOs" key="$index" style="padding: 20px 0 20px 20px;">
								<div class="fl clearfix" style="width: 279px;">
									<img v-if="orderItem.fileUrl" :src="orderItem.fileUrl" class="fl mr-20" />
									<img v-else src="../../assets/goods.png" class="fl mr-20" />
									<div class="fl">
										<!--<p class="tal" style="width: 179px;">商品编码:{{orderItem.goodsNo}}</p>
										<p class="tal" style="width: 179px;">{{orderItem.skuName}}</p>-->
										<p class="clearfix">
											<span class="fl">商品编码:</span>
											<span class="fl" style="width:100px;word-wrap:break-word">{{orderItem.goodsNo}}</span>

										</p>
										<p style="width: 179px;">{{orderItem.skuName}}</p>
									</div>
								</div>
								<div class="fl tac " style="width:70px;word-wrap:break-word">¥{{orderItem.originPrice | fmoney}}</div>
								<div v-if='orderItem.commission != null' class="fl tac " style="width:70px;word-wrap:break-word">¥{{orderItem.commission | fmoney}}</div>
								<div v-else class="fl tac " style="width:70px;">--</div>
								<div class="fl tac" style="width:30px;">{{orderItem.num}}</div>
							</div>
						</div>
						<div class="bl tac pt-20" style="width:83px;">{{order.parentStoreName ? order.parentStoreName : '--'}}</div>
						<div class="bl tac pt-20" style="width:83px;">{{order.buyerName ? order.buyerName : '--'}}</div>
						<div class="bl tac pt-20" style="width:71px;">{{order.type == 1 ? '大B自销' : order.type == 2 ? '小B自销' : '小B代销'}}</div>
						<div class="bl tac pt-20" style="width:80px;">¥{{order.needPayMoney | fmoney}}</div>

						<div class="bl tac pt-20" style="width:60px;word-wrap:break-word">
							<div class="tac">{{order.addrUsername}}</div>
						</div>
						<div class="bl tac pt-20" style="width:63px;">
							<span v-if="order.orderStatus==0">已关闭</span>
							<span v-if="order.orderStatus==1">待付款</span>
							<span v-if="order.orderStatus==2">待发货</span>
							<span v-if="order.orderStatus==3">待收货</span>
							<span v-if="order.orderStatus==4">已完成</span>
						</div>
						<div class="bl tac pt-20" style="width:80px;">
							<div class="">
								<el-button type="text" class="ml-0" @click="goDetails(order)">订单详情</el-button>
							</div>
						</div>
					</div>
				</div>
			</el-checkbox-group>
		</div>

	</div>
	<el-pagination v-if='tableData.length>0' class="tar" :current-page="currentPage" :page-size='10' :total='total' layout="prev , pager, next, jumper" @current-change="handleCurrentChange">
		<!-- 分页组件 -->
	</el-pagination>
	</div>
	<!-- 导出 -->
	<form ref="downClientForm1" action='/sunrise-gateway/export/groupon/order/list' style="display: none">
		<input type="hidden" name="modelName" v-model="a">
		<input type="hidden" name="fileName" v-model="b">
		<input type="hidden" name="orderSns" v-model="checkOrderSn">
	</form>
	<form ref="downClientForm2" action='/sunrise-gateway/export/groupon/order/list' style="display: none">
		<input type="hidden" name="modelName" v-model="a">
		<input type="hidden" name="fileName" v-model="b">
		<input type="hidden" name="orderSn" v-model="formInlineData.orderSn">
		<!--订单编号-->
		<input type="hidden" name="parentOrderSn" v-model="formInlineData.parentOrderSn">
		<!--关联单号1-->
		<input type="hidden" name="addrUsername" v-model="formInlineData.addrUsername">
		<!--顾客-->
		<input type="hidden" name="parentStoreName" v-model="formInlineData.parentStoreName">
		<!--上游卖家1-->
		<input type="hidden" name="type" v-model="formInlineData.type">
		<!--类型1-->
		<input type="hidden" name="storeName" v-model="formInlineData.storeName">
		<!--超团卖家1-->
		<input type="hidden" name="gmtOrderStart" v-model="formInlineData.gmtOrderStart">
		<!--开始时间-->
		<input type="hidden" name="gmtOrderEnd" v-model="formInlineData.gmtOrderEnd">
		<!--结束时间-->
		<input type="hidden" name="orderStatus" v-model="formInlineData.orderStatus">
		<!--订单状态-->
		<input type="hidden" name="searchType" v-model="searchType">
		<!--导出类型-->
	</form>
	</div>
</template>
<script>
	import { axiosApi, basePath } from '../../api/api'; // 导入API
	export default {
		data() {
			return {
				a: 'empty',
				b: '订单列表.xls',
				//start
				type: '',
				checkAll: false, //选中状态
				checkOrder: [], //选中的每行订单数据
				ordersListResVo: [], //订单数据
				checkOrderSn: [], //选中的每行订单数据
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
					orderStatus: null, // N  订单状态 0-已关闭 1-待付款 2-待发货 3-已发货 4-已完成
					orderSn: null, //N  销售单号
					parentOrderSn: null, //关联单号
					parentStoreName: null, //上游卖家
					type: null, //类型
					addrUsername: null, //顾客
					storeName: null, //超团商家
					gmtOrderStart: null, // N 下单开始时间
					gmtOrderEnd: null, // N 下单结束时间
					orderDateRange: [], //时间范围
				},
				activeTab: '6', //都是数字
				tableData: [], //全部商户管理的列表
				currentPage: 1,
				total: 0,
				loading: false, // 控制数据的显示
				badge: { //标记
					notPayCount: 0, //未付款
					notDeliveryCount: 0, //已付款-待发货
					orderDeliveriedCount: 0, //已发货-待收货
					successCount: 0, //已完成
					cancleCount: 0, //已取消
					notAuditCount: 0, //未审核
				},
				searchType: 1
			}

		},
		mounted() {
			this.$nextTick(() => {
				//导出的选中数据  清空
				this.checkOrderSn = ""
				this.getOrderList()
				this.anonOrderCount() //角标
			})
		},
		methods: {
			//批量导出
			exportOrder() {
				if(this.checkOrderSn.length > 0) {
					this.$refs.downClientForm1.submit();
					this.checkAll = false
					this.handleCheckAllChange()
				} else {
					if(this.tableData.length > 0) {
						this.formInlineData.gmtOrderStart = this.formInlineData.orderDateRange[0] == undefined ? null : this.formInlineData.orderDateRange[0].getTime();
						this.formInlineData.gmtOrderEnd = this.formInlineData.orderDateRange[1] == undefined ? null : this.formInlineData.orderDateRange[1].getTime();
						this.$refs.downClientForm2.submit();
					} else {
						this.$message({
							type: 'info',
							message: '暂无数据可导出!',
							duration: 1000
						});
					}

				}

			},
			//订单列表查询及条件查询
			getOrderList(body) {
				this.loading = true
				axiosApi('/groupon/orderList/select', {}, (res) => {
					this.tableData = res.data.data ? res.data.data.elements : []
					this.total = res.data.data ? res.data.data.totalCount : '';
					/*定时器显示*/
					this.tableData.forEach((item, index) => {
						if(item.remainAutoCancleTime !== null && item.remainAutoCancleTime > 0) {
							let time = parseInt(item.remainAutoCancleTime / 1000) //转化为整数
							item.remainAutoCancleTime = this.timeString(time) //转化为时间格式
							let clearTime = null //定义变量
							clearTime = setInterval(() => {
								time--
								item.remainAutoCancleTime = this.timeString(time)
								if(time <= 0) {
									clearTimeout(clearTime)
									if(item.orderStatus === 1) item.orderStatus = 0
								}
							}, 1000)
						} else {
							if(item.orderStatus === 1) item.orderStatus = 0
						}

					})
					this.loading = false
				}, this.currentPage, 10, (res) => {
					this.$message({
						type: 'error',
						message: res.data.message,
						duration: 1000
					})
					this.loading = false
				})
			},
			//跳转订单详情页面
			goDetails(val) {
				let sn = val.type == 3 ? val.parentOrderSn : val.sn
				let isParentOrdersn = val.type == 3 ? true : false
				this.$router.push(basePath + '/super/groupOrderDetails')
				sessionStorage.setItem('sn', sn);
				sessionStorage.setItem('isParentOrdersn', isParentOrdersn);
			},
			//角标
			anonOrderCount() { //订单统计(角标)
				axiosApi('/groupon/countOrderList/select', {}, (res) => {
					this.badge = res.data.data
				}, 1, 10, (res) => {

				})
			},
			//订单列表查询及条件查询
			getSearch(body) {
				this.loading = true
				axiosApi('/groupon/orderList/select', body, (res) => {
					this.tableData = res.data.data ? res.data.data.elements : []
					this.total = res.data.data ? res.data.data.totalCount : '';
					/*定时器显示*/
					this.tableData.forEach((item, index) => {
						if(item.remainAutoCancleTime !== null && item.remainAutoCancleTime > 0) {
							let time = parseInt(item.remainAutoCancleTime / 1000) //转化为整数
							item.remainAutoCancleTime = this.timeString(time) //转化为时间格式
							let clearTime = null //定义变量
							clearTime = setInterval(() => {
								time--
								item.remainAutoCancleTime = this.timeString(time)
								if(time <= 0) {
									clearTimeout(clearTime)
									if(item.orderStatus === 1) item.orderStatus = 0
								}
							}, 1000)
						} else {
							if(item.orderStatus === 1) item.orderStatus = 0
						}

					})
					this.anonOrderCount() //角标
					this.loading = false
				}, this.currentPage, 10, (res) => {
					this.$message({
						type: 'error',
						message: res.data.message,
						duration: 1000
					})
					this.loading = false
				})
			},
			//tabs切换
			handleTabClick(val) {
				switch(this.activeTab) {
					case '6': //全部订单
						this.formInlineData.orderStatus = null
						break;
					case '1': //待付款
						this.formInlineData.orderStatus = '1'
						break;
					case '2': //待付款
						this.formInlineData.orderStatus = '2'
						break;
					case '3': //待付款
						this.formInlineData.orderStatus = '3'
						break;
					case '4': //待付款
						this.formInlineData.orderStatus = '4'
						break;
					case '0': //待付款
						this.formInlineData.orderStatus = '0'
						break;
					default:
						break;
				}
				this.checkAll = false; //切换选中清空
				this.checkOrder = []; //切换选中清空
				if(this.currentPage === 1) {
					this.getSearch(this.formInlineData)
				} else {
					this.currentPage = 1; //赋值自动调用一次接口
				}
				this.anonOrderCount() //角标
			},
			//表单条件查询
			handleSearch() {
				//获取开始接受时间
				this.formInlineData.gmtOrderStart = this.formInlineData.orderDateRange[0] == undefined ? null : this.formInlineData.orderDateRange[0].getTime()
				this.formInlineData.gmtOrderEnd = this.formInlineData.orderDateRange[1] == undefined ? null : this.formInlineData.orderDateRange[1].getTime()
				if(this.currentPage === 1) {
					this.getSearch(this.formInlineData)
				} else {
					this.currentPage = 1; //赋值自动调用一次接口
				}
			},
			//改变分页
			handleCurrentChange(val) {
				this.currentPage = val
				this.getSearch(this.formInlineData)
				this.anonOrderCount() //角标
			},
			//new 
			handleCheckAllChange(val) { /*table全选*/
				if(this.checkAll) {
					this.tableData.forEach(item => {
						this.checkOrder.push(item)
					});
					this.checkOrderSn = this.tableData.map(i => i.sn).join()
				} else {
					this.checkOrder = [];
					this.checkOrderSn = ""
				}
			},
			handleCheckChange(val) { //单选
				let checkedCount = val.length;
				this.checkAll = checkedCount === this.tableData.length;
				this.checkOrderSn = val.map(i => i.sn).join()
			},
		},
	}
</script>

<style lang="less">
	#groupOrder {
		/*角标样式*/
		.notPayCountmark {
			position: absolute;
			left: 173px;
			bottom: 17px;
		}
		.notDeliveryCount {
			position: absolute;
			left: 248px;
			bottom: 17px;
		}
		.orderDeliveriedCount {
			position: absolute;
			left: 322px;
			bottom: 17px;
		}
		/*主内容区样式old*/
		#group-content-div .el-button--text {
			width: auto;
			height: auto;
		}
		#group-content-div .el-form--inline .el-form-item__label {
			/* 搜索框label 的字体是12px */
			width: 75px;
			font-size: 12px;
		}
		#group-content-div .el-form--inline .el-input__inner {
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
		#group-content-div .el-date-editor--datetimerange.el-input {
			width: 240px;
		}
		#group-content-div .order-list {
			.table {
				.el-table__body-wrapper {
					display: none;
				}
			}
			.bb {
				border-bottom: 1px solid #DDDDDD;
			}
			.bl {
				border-left: 1px solid #DDDDDD;
			}
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
			.el-date-editor--daterange.el-input {
				width: 240px;
			}
			.el-form--inline {
				width: 650px;
				.el-form-item__label {
					font-size: 12px;
					width: 60px;
				}
			}
			.el-table .el-table__body-wrapper {
				display: none;
			}
			.order-datatimerange {
				width: 240px;
			}
			.el-table {
				border: none;
				font-size: 14px;
				th>.cell {
					line-height: 12px;
					padding: 10px 0 10px 0;
				}
				th.is-leaf {
					border-bottom: 0;
				}
			}
			.checkedAll {
				position: relative;
				top: 30px;
			}
			.el-checkbox {
				width: 30px;
				margin-left: 30px;
				.el-checkbox__input {
					height: 20px;
				}
			}
			.el-checkbox__inner {
				width: 20px;
				height: 20px;
			}
			.el-checkbox__inner::after {
				top: 2px;
			}
			.table-item {
				.bl {
					border-left: 1px solid #DDD;
				}
				border: 1px solid #DDDDDD;
				font-size: 14px;
				border-bottom: none;
				.table-item-content .pbl-20 {
					padding: 0px 0px 20px 20px;
				}
				.table-item-top {
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
			.w100 {
				width: 100px;
			}
			.table-item-default {
				height: 530px;
				padding-top: 120px;
			}
			.el-dialog--small {
				min-height: 300px;
				.el-form-item__label {
					width: 140px;
				}
			}
			.sendGoods .el-form-item__error {
				margin-left: 140px;
			}
			.el-checkbox__label {
				display: none;
			}
		}
	}
</style>