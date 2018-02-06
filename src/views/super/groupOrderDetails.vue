<template>
	<div id="groupOrderDetails" class="bg-f">
		<div class="title-top">
			<div class="clearfix">
				<el-breadcrumb class="fl">
					<el-breadcrumb-item>订单详情</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</div>
		<div class="width-1280 box-con bdt">
			<!--订单基础信息-->
			<div class="order-info mt-30">
				<div class="order-info-tit pl-20">订单信息</div>
				<div class="order-info-con clearfix">
					<div class="order-info-conL fl">
						<div>
							<label>订单编号：</label>
							<span class="ml-10">{{orderInfo.sn}}</span>
						</div>
						<div>
							<label>供货商名称：</label>
							<span class="ml-10">{{orderInfo.sellerName}}</span>
						</div>
						<div>
							<label>订单状态：</label>
							<span class="ml-10" v-if="orderInfo.orderStatus==0">已关闭</span>
							<span class="ml-10 color-danger" v-if="orderInfo.orderStatus==1">待付款</span>
							<span class="ml-10" v-if="orderInfo.orderStatus==2">待发货</span>
							<span class="ml-10" v-if="orderInfo.orderStatus==3">已发货</span>
							<span class="ml-10" v-if="orderInfo.orderStatus==4">已完成</span>
						</div>
						<div v-if="orderInfo.orderStatus==0">
							<label>关闭原因：</label>
							<span class="ml-10">{{orderInfo.cancleReason}}</span>
						</div>
					</div>
					<div class="fr mt-30 mr-20">
						<span v-if="orderInfo.orderStatus==1">
							<span class="mr-20">还剩<span class="color-danger">{{orderInfo.remainAutoCancleTime}}</span>自动取消</span>
						</span>
					</div>
				</div>
			</div>
			<!--订单详情-->
			<!--购买商品基本信息-->
			<div class='goods-title pl-30 clearfix mt-20'><span class="fl">商品名称</span><span class="fr width-239 tac">总金额</span><span class="fr mr-50">数量</span><span class="fr mr-100">单价</span></div>
			<div class="goods">
				<div class="goods-info clearfix" v-for="g in orderInfo.grouponOrderItemVOs" key="$index">
					<div class="goods-infoL fl clearfix">
						<span class="fl">
								<img v-if="g.fileUrl" :src="g.fileUrl" alt="" />
								<img v-else src="../../assets/goods.png" alt="" />
							</span>
						<span class="w380 ml-15 fl">
								<p>{{g.skuName}}</p>
								<span class="mt-10 color-9" v-if="g.specInfoNum">规格: 1*{{g.specInfoNum}}</span>
						</span>
						<span class="w210 fl tac">￥{{g.originPrice||0 | fmoney}}</span>
						<span class="fl ml-50">{{g.num}}</span>
					</div>
					<span class="goods-infoR tac pt-20">￥{{g.discountTotalPrice | fmoney}}</span>
				</div>
				<div class="goods-money clearfix">
					<div class="goods-moneyR fr">
						<div><label><span class="mr-20">共{{orderInfo.skuTotalNum}}件商品</span>订单金额：</label><span class="ml-10">¥{{orderInfo.needPayMoney||0 | fmoney}}</span></div>
						<div><label>实付金额：</label><span class="ml-10">¥{{orderInfo.needPayMoney||0 | fmoney}}</span></div>
						<div class="font-20 color-danger"><label>本单分销分成：</label><span class="ml-10">¥{{orderInfo.commission||0 | fmoney}}</span></div>
					</div>
				</div>
			</div>
			<!--收货信息-->
			<div class="order-info mt-20">
				<div class="order-info-tit pl-20">收货信息</div>
				<div class="order-info-con">
					<div class="order-info-conL">
						<div><label>收货人：</label><span class="ml-10">{{orderInfo.addrUsername}}</span></div>
						<div><label>联系电话：</label><span class="ml-10">{{orderInfo.addrMobile}}</span></div>
						<div><label>收货地址：</label><span class="ml-10">{{orderInfo.addrProvince}}{{orderInfo.addrCity}}{{orderInfo.addrRegion}}{{orderInfo.addr}}</span></div>
					</div>
				</div>
			</div>
			<!--备注信息-->
			<div class="order-info mt-20">
				<div class="order-info-tit pl-20">备注信息</div>
				<div class="order-info-con">
					<div class="order-info-conL">
						<div>
							<label>备注信息：</label>
							<span class="ml-10" v-if="orderInfo.remark">{{orderInfo.remark}}</span>
							<span class="ml-10" v-else>无</span>
						</div>
					</div>
				</div>
			</div>
			<!--发票信息-->
			<div class="order-info mt-20" v-if="orderInfo.orderInvoicePo">
				<div class="order-info-tit pl-20">发票信息</div>
				<div class="order-info-con">
					<div class="order-info-conL">
						<div>
							<label>发票信息：</label>
							<span class="ml-10" v-if="orderInfo.orderInvoicePo.personalCompanyType==null">无</span>
							<span class="ml-10" v-if="orderInfo.orderInvoicePo.personalCompanyType==2">个人</span>
							<span class="ml-10" v-if="orderInfo.orderInvoicePo.personalCompanyType==1">
									<span>{{orderInfo.orderInvoicePo.companyHead}}</span>
							<span class="ml-5">{{orderInfo.orderInvoicePo.taxpayerIdNo}}</span>
							</span>
						</div>
					</div>
				</div>
			</div>
			<!--配送信息-->
			<div class="order-info mt-20" v-if="(orderInfo.orderStatus==3 || orderInfo.orderStatus==4 )&& orderInfo.shipperType == 3">
				<div class="order-info-tit pl-20">配送信息</div>
				<div class="order-info-con">
					<div class="order-info-conL" v-for='item in formInfo.deliveryVos' key="$index">
						<div>
							<label>物流公司：</label>
							<span class="ml-10">{{item.shipperName}}</span></div>
						<div>
							<label>物流单号：</label>
							<span class="ml-10">{{item.deliveryNo}}</span>
						</div>
						<div>
							<label>运费：</label>
							<span class="ml-10">￥{{formInfo.freightMoney | fmoney}}</span>
						</div>
						<div>
							<label>发货时间：</label>
							<span v-if='orderInfo.gmtShipped' class="ml-10">{{formInfo.gmtShipped | time}}</span>
						</div>
					</div>
				</div>
			</div>
			<!--物流信息-->
			<div class="order-info mt-20" v-if="(orderInfo.orderStatus==3 || orderInfo.orderStatus==4) && orderInfo.shipperType == 3 && formInfo.traceApiDtos !=null">
				<div class="order-info-tit pl-20">物流信息</div>
				<div class="order-info-con pl-20">
					<div class="order-info-conS ml-50">
						<div class="clearfix" v-for='(item,index) in formInfo.traceApiDtos' key='$index' :class='index == 0 ? "color-red":""'>
							<span class="fl">{{item.opeTime | time}}</span>
							<div class="fl ml-10" style="width: 80%;">
								<span>{{item.opeRemark}}</span>
								<span class="ml-10">{{item.opeTitle}}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<el-button v-if="(orderInfo.orderStatus==3 || orderInfo.orderStatus==4) && formInfo.shipperType == 1" class='mt-30 edit-btn' style='float: left;' @click="checkLogistics">查看物流状态</el-button>
		</div>
	</div>
</template>

<script>
	import { axiosApi, basePath } from "../../api/api"
	export default {
		data() {
			return {
				orderInfo: {}, //订单信息
				formInfo: {}, //订单出库发货记录
				host: '',
				sn: ''
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.getOrderInfo();
				this.shipmentRechord();
				this.host = encodeURIComponent(window.location.href);
			})
		},
		methods: {
			getOrderInfo() { //获取订单详细信息
				axiosApi('/groupon/grouponOrderDetail/select', {
				orderSn: sessionStorage.sn,
				isParentOrdersn:sessionStorage.isParentOrdersn
				}, (res) => {
					this.orderInfo = res.data.data;
					this.sn = this.orderInfo.sn
					if(this.orderInfo.remainAutoCancleTime != null && this.orderInfo.remainAutoCancleTime > 0) {
						let time = parseInt(this.orderInfo.remainAutoCancleTime / 1000) //转化为整数
						this.orderInfo.remainAutoCancleTime = this.timeString(time) //转化为时间格式
						let clearTime = null //定义变量
						clearTime = setInterval(() => {
							time--
							this.orderInfo.remainAutoCancleTime = this.timeString(time)
							if(time <= 0) {
								clearTimeout(clearTime)
								if(this.orderInfo.orderStatus == 1) this.orderInfo.orderStatus = 0
							}
						}, 1000)
					} else {
						if(this.orderInfo.orderStatus == 1 && this.orderInfo.remainAutoCancleTime < 0) this.orderInfo.orderStatus = 0
					}
				}, 1, 10, (res) => {
					this.$message({
						type: 'error',
						message: res.data.message,
						duration: 1000
					})
				})
			},
			//订单出库发货记录查询
			shipmentRechord() {
				axiosApi('/groupon/shipmentRechord/query', {
				orderSn: sessionStorage.sn,
				isParentOrdersn:sessionStorage.isParentOrdersn
				}, (res) => {
					this.formInfo = res.data.data;
					if(this.formInfo.traceApiDtos) {
						this.formInfo.traceApiDtos = this.formInfo.traceApiDtos.reverse()
					}
				}, 1, 10, (res) => {
					this.$message({
						type: 'error',
						message: res.data.message,
						duration: 1000
					})
				})
			},

			checkLogistics() { //查看物流
				axiosApi('/groupon/expressInfo/select', {
					type: this.formInfo.deliveryVos[0].shipperName,
					postid: this.formInfo.deliveryVos[0].deliveryNo,
				}, (res) => {
					window.open(res.data.data.url)
				}, 1, 10, (res) => {})
			},
		}
	}
</script>

<style lang="less">
	#groupOrderDetails {
		.bdt {
			border-top: 1px solid #eee;
		}
		.el-tabs__header {
			padding: 0;
			border-bottom: 1px solid #eee;
		}
		.box-con {
			width: 1000px;
			box-sizing: border-box;
			.order-info {
				border: 1px solid #ddd;
				box-sizing: border-box;
				.order-info-tit {
					height: 40px;
					line-height: 40px;
					background-color: #eee;
				}
				.order-info-con {
					.order-info-conL {
						width: 600px;
						line-height: 30px;
						padding: 22.5px 0;
						label {
							width: 150px;
							display: inline-block;
							text-align: right;
						}
					}
					.order-info-conS {
						line-height: 30px;
						padding: 22.5px 0;
						label {
							width: 150px;
							display: inline-block;
							text-align: right;
						}
					}
				}
			}
			.goods {
				border: 1px solid #ddd;
				box-sizing: border-box;
				.goods-info {
					height: 120px;
					border-bottom: 1px solid #ddd;
					span {
						display: inline-block;
					}
					.goods-infoL {
						width: 679px;
						height: 100%;
						padding: 20px;
						box-sizing: border-box;
						border-right: 1px solid #ddd;
						img {
							width: 80px;
							height: 80px;
						}
						.w380 {
							width: 300px;
						}
						.w210 {
							width: 140px;
						}
					}
					.goods-infoR {
						width: 239px;
						display: inline-block;
					}
				}
				.goods-money {
					height: 146px;
					line-height: 25px;
					padding: 30px 50px;
					box-sizing: border-box;
					label {
						width: 300px;
						display: inline-block;
						text-align: right;
					}
				}
			}
			.el-dialog--small {
				min-height: 300px;
				.el-form-item__label {
					width: 140px;
				}
			}
		}
		.goods-title {
			width: 100%;
			height: 40px;
			line-height: 40px;
			border: 1px solid #ddd;
			border-bottom: none;
			box-sizing: border-box;
			background: #eee;
		}
		.width-239 {
			width: 239px;
		}
	}
</style>