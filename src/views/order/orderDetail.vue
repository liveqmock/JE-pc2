<template>
	<div id="supplier-order-detail" class="bg-f">
		<div class="title-top">
			<div class="clearfix">
				<el-breadcrumb class="fl">
					<el-breadcrumb-item>订单详情</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</div>
		<div class="store-confirm-order">
			<div v-loading='loading ' class="pb-50">
				<div class="order-info clearfix mb-50">
					<div class="title">
						订单信息
					</div>
					<el-form class='fl'>
						<el-form-item label="订单编号:">
							{{orderInfoObj.sn}}
						</el-form-item>
						<el-form-item label="客户名称:">
							{{orderInfoObj.buyerName}} {{orderInfoObj.addrTel}}
						</el-form-item>
						<el-form-item label="卖家名称:">
							{{orderInfoObj.sellerName}} {{orderInfoObj.sellerPhone}}
						</el-form-item>
						<el-form-item label='下单时间:'>
							<span v-if="orderInfoObj.gmtCreate">{{orderInfoObj.gmtCreate | time}}</span>
						</el-form-item>
						<el-form-item label='订单状态:'>
							<p v-if=" orderInfoObj.orderStatus == 0 " class="color-danger">已关闭</p>
							<p v-if=" orderInfoObj.orderStatus == 1 " class="color-danger">待付款</p>
							<p v-if=" orderInfoObj.orderStatus == 2 " class="color-danger">待发货</p>
							<p v-if=" orderInfoObj.orderStatus == 3 " class="color-danger">已发货</p>
							<p v-if=" orderInfoObj.orderStatus == 4 " class="color-danger">已完成</p>
						</el-form-item>
						<el-form-item label='订单金额:'>
							￥{{orderInfoObj.needPayMoney | fmoney}}
						</el-form-item>
					</el-form>
				</div>

				<el-tabs class='tabs' v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="订单详情" name="1"></el-tab-pane>
					<el-tab-pane label="出库／发货记录" name="2"></el-tab-pane>
					<el-tab-pane label="收款纪录" name="3"></el-tab-pane>
					<el-tab-pane label="订单操作日志" name="4"></el-tab-pane>
					<el-tab-pane label="订单备注" name="5"></el-tab-pane>
				</el-tabs>

				<div v-if="activeName == '1'">
					<div class="order-detail ">
						<div class="order-content">
							<div class="item mb-20">
								<div class="item-content">
									<div class="item-item clearfix" v-for="(item, index) in orderInfoObj.orderItemVos" key="$index">
										<div class="clearfix order-item-item pt-20 pl-20 pb-20">
											<img v-if="item.image" class="fl img mr-10" :src="item.image" alt="spuImage" />
											<img v-else src="../../assets/goods.png" class="fl mr-10" />
											<div class="fl" style="width: 240px;">
												<p class="color-9 font-14">商品编码：{{item.skuNo}}</p>
												<p class="" v-text="item.skuName"> </p>
												<p class="color-9">规格: 1*{{item.specInfoNum}}</p>
											</div>
										</div>
										<div class="order-item-item-2 pt-20 ">
											<p>￥{{item.discountPrice}}</p>
										</div>
										<div class="order-item-item-3 pt-20">
											<p>{{item.num}}</p>
										</div>
										<div class="order-item-item-4 pt-20">
											<p class="color-F656 ">￥{{item.discountTotalPrice}}</p>
										</div>
										<div class="pt-20 order-item-item-5">
											<p>{{item.remark?item.remark:'无备注信息'}}</p>
										</div>
									</div>
									<div class="item-item clearfix" v-for="(item, index) in orderInfoObj.orderGiftResVos" key="$index">
										<div class="clearfix order-item-item pt-20 pl-20 pb-20">
											<img v-if="item.image" class="fl img mr-10" :src="item.image" alt="spuImage" />
											<img v-else src="../../assets/goods.png" class="fl mr-10" />
											<div class="fl" style="width: 240px;">
												<p class="mb-20" v-text="item.skuName"> </p>
												<p class="color-9">规格: 1*{{item.specInfoNum}}</p>
											</div>
										</div>
										<div class="order-item-item-2 pt-20 ">
											<p>￥0</p>
										</div>
										<div class="order-item-item-3 pt-20">
											<p>{{item.giftNum}}</p>
										</div>
										<div class="order-item-item-4 pt-20">
											<p class="color-F656 ">￥0</p>
										</div>
										<div class="pt-20 order-item-item-5">
											
										</div>
									</div>
								</div>
								<div class="total clearfix">
									<ul class="fr">
										<li v-if="orderInfoObj.activityCutMoney" class="tar">活动减免金额：<span class='ml-30'>-￥ {{orderInfoObj.activityCutMoney | fmoney}}</span></li>
										<li v-if="orderInfoObj.couponCutMoney" class="tar">优惠券减免金额：<span class='ml-30'>-￥{{orderInfoObj.couponCutMoney | fmoney}} </span></li>
										<li class="tar">运费：<span class='ml-30'>+￥ {{orderInfoObj.freightMoney | fmoney}}</span></li>
										<li class="font-20 payment tar">应付金额：<span class='ml-30'>￥ {{orderInfoObj.needPayMoney | fmoney}}</span></li>
									</ul>
								</div>
							</div>
						</div>
					</div>
					

					<div class="order-info clearfix mb-20">
						<div class="title">
							<p class="fl">收货信息</p>
						</div>
						<el-form class='fl'>
							<el-form-item label="收货人:">
								{{orderInfoObj.addrUsername}}
							</el-form-item>
							<el-form-item label="电话:">
								{{orderInfoObj.addrMobile}}
							</el-form-item>
							<el-form-item label='地址:'>
								{{orderInfoObj.addrProvince}} {{orderInfoObj.addrCity}} {{orderInfoObj.addrRegion}} {{orderInfoObj.addr}}
							</el-form-item>
							<!--<el-form-item label='交货日期:'>
							无交货日期
							<el-button class='ml-30' type='text' style='height: auto;'>修 改</el-button>
						</el-form-item>-->
						</el-form>
					</div>
					<!--赠品信息-->
					<div class="order-info clearfix mb-20" v-if="!!orderInfoObj.orderGiftContent">
						<div class="title">
							<p class="fl">赠品信息</p>
						</div>
						<el-form class='fl clearfix gift'>
							<el-form-item label="赠品信息:">{{orderInfoObj.orderGiftContent}}</el-form-item>
						</el-form>
					</div>
					
					<!--发票信息-->
					<div v-if="orderInfoObj.orderInvoicePo">
						<div class="order-info clearfix mb-20" v-if="orderInfoObj.orderInvoicePo.type==2">
							<div class="title">
								<p class="fl">发票信息</p>
							</div>
							<el-form class='fl mb-10'>
								<el-form-item label="单位名称:">
									{{orderInfoObj.orderInvoicePo.companyHead}}
								</el-form-item>
								<el-form-item label="纳税人识别号:">
									{{orderInfoObj.orderInvoicePo.taxpayerIdNo}}
								</el-form-item>
								<el-form-item label='注册地址:'>
									{{orderInfoObj.orderInvoicePo.registerAddress}}
								</el-form-item>
								<el-form-item label='注册电话:'>
									{{orderInfoObj.orderInvoicePo.registerPhone}}
								</el-form-item>
								<el-form-item label='开户银行:'>
									{{orderInfoObj.orderInvoicePo.bankDeposit}}
								</el-form-item>
								<el-form-item label='银行账户:'>
									{{orderInfoObj.orderInvoicePo.bankCard}}
								</el-form-item>
								<el-form-item label="收票人:">
									{{orderInfoObj.orderInvoicePo.linkman}}
								</el-form-item>
								<el-form-item label="手机号:">
									{{orderInfoObj.orderInvoicePo.tel}}
								</el-form-item>
								<el-form-item label="收票地址:">
									{{orderInfoObj.orderInvoicePo.provinceName+" "+orderInfoObj.orderInvoicePo.cityName+" "+orderInfoObj.orderInvoicePo.regionName+" "+orderInfoObj.orderInvoicePo.addr}}
								</el-form-item>
							</el-form>
						</div>

						<div class="order-info clearfix mb-20" v-if="orderInfoObj.orderInvoicePo.type==1">
							<div class="title">
								<p class="fl">发票信息</p>
							</div>
							<el-form class='fl mb-10'>
								<el-form-item label="发票抬头:">
									{{orderInfoObj.orderInvoicePo.companyHead}}
								</el-form-item>
								<el-form-item label="纳税人识别号:">
									{{orderInfoObj.orderInvoicePo.taxpayerIdNo}}
								</el-form-item>
								<el-form-item label="收票人:">
									{{orderInfoObj.orderInvoicePo.linkman}}
								</el-form-item>
								<el-form-item label="手机号:">
									{{orderInfoObj.orderInvoicePo.tel}}
								</el-form-item>
								<el-form-item label="收票地址:">
									{{orderInfoObj.orderInvoicePo.provinceName+" "+orderInfoObj.orderInvoicePo.cityName+" "+orderInfoObj.orderInvoicePo.regionName+" "+orderInfoObj.orderInvoicePo.addr}}
								</el-form-item>
							</el-form>
						</div>
					</div>
				</div>
				<!--出库记录-->
				<div v-if=" activeName == '2' " class="noContent">
					<p class="font-20 color-9">暂无记录</p>
				</div>
				<!--<div class='' v-if="activeName == '2' &&  orderInfoObj.orderStatus > 2">
					<div class="order-info clearfix mb-20">
						<div class="title">
							配送信息
						</div>
						<el-form class='fl mb-10'>
							<el-form-item label="物流公司:">
								商源物流公司
							</el-form-item>
							<el-form-item label="物流单号:">
								15878784787
							</el-form-item>
							<el-form-item label='运费:'>
								￥0
							</el-form-item>
							<el-form-item label='运货日期:'>
								2017-04-12
							</el-form-item>
						</el-form>
					</div>

					<div class="order-info clearfix mb-20">
						<div class="title">
							物流信息
						</div>
						<el-form class='fl mb-10'>
							<el-form-item label="2017-05-14:">
								商源物流公司
							</el-form-item>
							<el-form-item label="2017-05-14:">
								15878784787
							</el-form-item>
							<el-form-item label='2017-05-14:'>
								￥0
							</el-form-item>
							<el-form-item label='2017-05-14:'>
								2017-04-12
							</el-form-item>
						</el-form>
					</div>

					<p class='color-9 mb-10 common'>发货商品</p>
					<el-table class='common mb-50' :data='goodTable'>
						<el-table-column label='商品名称/编码'>
							<template scope='scope'>
								<p class='color-6'>{{scope.row.name}}</p>
								<p class='color-3F'>{{scope.row.id}}</p>
							</template>
						</el-table-column>
						<el-table-column label='数量' prop='number'></el-table-column>
						<el-table-column label='备注' prop='remark'></el-table-column>
					</el-table>
				</div>-->

				<!--收款记录-->
				<div class="" v-if="activeName == '3'" key='payment'>
					<el-table class='common mb-50' :data='orderInfoObj.paymentLogsVOs'>
						<el-table-column label='支付流水号' prop='paySn' show-overflow-tooltip></el-table-column>
						<el-table-column label='收款时间' show-overflow-tooltip>
							<template scope="scope">
								<span>{{scope.row.payTime | time}}</span>
							</template>
						</el-table-column>
						<el-table-column label='收款账号' prop='traderBankAccount' show-overflow-tooltip></el-table-column>
						<el-table-column label='收款金额' prop='payMoney' show-overflow-tooltip></el-table-column>
						<el-table-column label='支付方式' prop='payMethod'>
							<template scope='scope'>
								<span v-if="scope.row.payMethod==0">组合支付</span>
								<span v-if="scope.row.payMethod==1">线下付款</span>
								<span v-if="scope.row.payMethod==3">在线支付</span>
								<span v-if="scope.row.payMethod==4">余额支付</span>
								<span v-if="scope.row.payMethod!=0&&scope.row.payMethod!=1&&scope.row.payMethod!=3&&scope.row.payMethod!=4">其他</span>
							</template>
						</el-table-column>
						<el-table-column label='状态'>
							<template scope='scope'>
								成功
							</template>
						</el-table-column>
						<el-table-column label='收款凭证'>
							<template scope='scope'>
								<el-button type='text' v-if="scope.row.isHasVoucher?true:false" @click="handleLookremittance(scope.row.id)">查 看</el-button>
								<el-dialog title="付款凭证信息" class="lookpaymentDialog" v-model='lookpaymentVisible'>
									<el-form :model="orderRemittanceApplyVo">
										<div>
											<el-form-item label='持卡人姓名:'>
												<el-input placeholder='持卡人姓名' class="fl" readonly v-model='orderRemittanceApplyVo.bankUserName'></el-input>
											</el-form-item>
											<el-form-item label='收款银行名称:'>
												<el-input class="fl" readonly v-model="orderRemittanceApplyVo.incomeAccountName"></el-input>
											</el-form-item>
											<el-form-item label='收款银行账号:'>
												<el-input class="fl" readonly v-model="orderRemittanceApplyVo.incomeAccountNum"></el-input>
											</el-form-item>
										</div>
										<el-form-item label='付款金额:'>
											<el-input placeholder='请输入付款金额' class="fl" readonly v-model="orderRemittanceApplyVo.amount"></el-input>
										</el-form-item>
										<el-form-item label='汇款凭证:'>
											<el-upload class="avatar-uploader fl" action="/sunrise-gateway/oss/ossUpload" list-type="picture-card" :on-preview="handlePictureCardPreview" :file-list="orderRemittanceApplyVo.fileList"></el-upload>

										</el-form-item>
									</el-form>
									<div slot="footer" class="dialog-footer">
										<el-button type="danger" @click="lookpaymentVisible=false">确 定</el-button>
									</div>
								</el-dialog>
							</template>
						</el-table-column>
					</el-table>
					<el-dialog v-model="dialogVisible" size="tiny" class="showImgDialog">
						<img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
				</div>

				<!--操作日志-->

				<div class="" v-if="activeName == '4'" key='orderLog'>
					<el-table class='common mb-50' :data='orderInfoObj.orderLogVos'>
						<el-table-column label='操作时间' prop='gmtCreate'>
							<template scope="scope">
								<span>{{scope.row.gmtCreate | time}}</span>
							</template>
						</el-table-column>
						<el-table-column label='操作人' prop='operatorName'></el-table-column>
						<el-table-column label='操作' prop='message'></el-table-column>
						<el-table-column label='状态' prop='result'>
							<template scope="scope">
								<span v-text="scope.row.result==1?'成功':'失败'"></span>
							</template>
						</el-table-column>
						<el-table-column label='备注' prop='remark'>
							<template scope="scope">
								<span v-text="scope.row.remark?'scope.row.remark':'无'"></span>
							</template>
						</el-table-column>
					</el-table>
				</div>

				<!--订单备注-->
				<div class="" v-if="activeName == '5' " key="orderRemark">
					<el-table class='common mb-50' :data='orderInfoObj.orderRemarkVos'>
						<el-table-column label='操作人' prop="operatorName"></el-table-column>
						<el-table-column label='类型'>
							<template scope="scope">
								{{scope.row.traderType=='1'?'买方':'卖方'}}
							</template>
						</el-table-column>
						<el-table-column label='备注' prop='remark'></el-table-column>
						<el-table-column label='创建时间'>
							<template scope="scope">
								{{scope.row.gmtCreate | time}}
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { axiosApi, basePath } from "../../api/api"
	export default {
		data() {
			return {
				activeName: '1',
				goodTable: [],
				supplierOrderDetail: null, //sessionStorage:存储orderSn
				orderInfoObj: {}, //订单详情信息
				remarkDialog: false, //添加备注
				loading: false, //loading
				changeAddressVisible: false, //更换地址boolean
				orderDeliveryAddressList: [], //客户地址
				address: {}, //打开地址弹框 默认选中的值,
				paymentLogsVOs: [], //付款记录
				paymentVoucherVisible: false, //付款凭证visible
				imgLoading: false, // 添加凭证图片loading
				sellerBankInfoList: [], // 供应商银行信息列表
				orderSn: null, //订单编号
				orderRemittanceApplyVo: {}, //根据付款凭证ID获取付款信息（查看）
				lookpaymentVisible: false, // 查看付款凭证 显示隐藏
				dialogVisible: false,
				dialogImageUrl: null,
				newRemark: null, //新添加的备注信息
				cancelOrderVisible: false, //取消订单 dialogVisible
				changePriceVisible: false,  //改价dialog
				order: {}, //改价
				order2:{},
				passRemark:false, //备注通过
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.anonOrderDetailInfo() //订单详情
			})
		},
		methods: {
			//图片放大
			handlePictureCardPreview(file) { 
				this.dialogImageUrl = file.url;
				this.dialogVisible = true
			},
			findSellerBankInfoList(body) { //线下支付的账号信息列表
				axiosApi('/trader/findSellerBankInfoList/select', body, (res) => {
//					console.log(res, '-----------')
					this.sellerBankInfoList = res.data.data
				}, 1, 10, (res) => {

				})
			},
			handleLookremittance(id) { //查看付款凭证
				this.remittanceApply({
					id: id
				})
				this.lookpaymentVisible = true
			},
			remittanceApply(body) { //根据付款记录id获取汇款凭证
				axiosApi('/anon/order/remittanceApply/getByPaymentId', body, (res) => {
//					console.log(res, '根据付款记录id获取汇款凭证')
					this.orderRemittanceApplyVo = res.data.data
					this.orderRemittanceApplyVo.fileList = [{
						url: JSON.parse(this.orderRemittanceApplyVo.urls)[0]
					}]
				}, 1, 10, (res) => {

				})
			},
			getOrderSn() { //获取orderSn
				let body = {}
				this.supplierOrderDetail = JSON.parse(sessionStorage.getItem('supplierOrderDetail'))
				if(this.supplierOrderDetail.type == 'supplierOrderDetail') {
					this.orderSn = this.supplierOrderDetail.orderSn
					body = {
						orderSn: this.supplierOrderDetail.orderSn
					}
				}
				return body
			},
			handleClick(tab) { //标签页切换tabs
				if(this.activeName == 3) {}
			},
			anonOrderDetailInfo() { //订单详情接口
				this.loading = true
				axiosApi('/anon/order/detail/info', this.getOrderSn(), (res) => {
					this.loading = false
					this.orderInfoObj = res.data.data
					this.customChange({
						traderId: this.orderInfoObj.buyerId
					}) //调用客户地址列表
					this.findSellerBankInfoList({
						traderId: this.orderInfoObj.sellerId
					})
				}, 1, 10, (res) => {
					this.loading = false
					console.log(res.data)
					this.$message({
						message:res.data.message,
						type:'error',
						duration:2000
					})
				})
			},
			customChange(body) { //客户地址列表
				axiosApi('/trader/orderDeliveryAddress/select', body, (res) => {
//					console.log(res, '地址列表')
					this.orderDeliveryAddressList = res.data.data
					this.orderDeliveryAddressList.forEach((item, index) => {
						if(this.orderInfoObj.addrId == item.id) { //营业地址
							this.address = item
						}

					})
				}, 1, 10, (res) => {

				})
			},
		
		}
	}
</script>

<style lang="less">
	.color-3F {
		color: #3F3F3F;
	}
	.billDialog{
		.el-dialog--small{
			width: 700px ;
		}
		/*width: 700px;*/
		.bill-type {
			text-align: center;
			margin-bottom: 52px;
			.el-radio+.el-radio {
				margin-left: 35px;
			}
		}
		.el-form {
			.el-form-item {
				margin-bottom: 30px;
			}
			.el-form-item__label {
				width: 245px;
				padding-right: 30px;
			}
		}
	}
	#supplier-order-detail {
		.changePriceDialog {
			.el-dialog {
				width: 1000px;
				.el-table{
					.cell{padding: 10px;}
					.el-table__empty-block{display: none;}
				}
			}
			
			
			.el-dialog__body {
				.el-form-item__label {
					font-size: 12px;
					width: 215px;
					margin-right: 20px;
				}
				.el-input__inner {
					font-size: 12px;
				}
				.ferght {
					flex-grow: 1;
				}
				.changePriceInfo {
					padding-bottom: 36px;
					border: 1px solid #DDDDDD;
					border-top: none;
					margin-bottom: 80px;
				}
			}
		}
		.lookpaymentDialog {
			.el-dialog {
				.avatar-uploader {
					.el-upload--picture-card {
						display: none;
					}
				}
				.el-icon-view {
					margin-left: 20px;
				}
				.el-icon-delete2 {
					display: none;
				}
				.el-upload-list--picture-card .el-upload-list__item-status-label {
					display: none;
				}
			}
			.showImgDialog {
				.el-dialog {
					z-index: 10000;
				}
				.el-dialog__body {
					width: auto;
					height: auto;
					img {
						width: auto;
						height: auto;
					}
				}
			}
		}
		.paymentVoucherDialog {
			.el-dialog {
				.el-dialog__body {
					margin-bottom: 50px;
				}
				.el-form-item__label {
					width: 160px;
				}
				.el-form-item__error {
					left: 160px;
				}
				.avatar-uploader {
					width: 100px;
					height: 100px;
					.el-upload {
						width: 110px;
						height: 110px;
						.el-icon-plus {
							width: 100px;
							height: 100px;
							line-height: 110px;
							border: 1px solid #DDDDDD;
						}
						img {
							width: 100px;
							height: 100px;
						}
					}
					.el-upload__tip {
						position: relative;
						bottom: 130px;
						line-height: 16px;
						left: 110px;
						width: 140px;
					}
				}
			}
		}
		.noContent {
			padding-bottom: 257px;
			width: 940px;
			margin: 0 auto;
			p {
				text-align: center;
				margin-top: 50px;
			}
		}
		.changeAddress {
			.el-dialog {
				width: 500px;
			}
		}
		.remarkDialog {
			.el-dialog {
				min-height: 300px;
			}
		}
		.el-button--text {
			width: auto;
		}
		.common {
			width: 940px;
			margin: 0 auto;
		}
		.textrea {
			width: 940px;
			display: block;
			margin-left: 125px;
			.el-textarea__inner {
				border-radius: 0;
			}
		}
		.remark-btn {
			margin-left: 125px;
			margin-bottom: 120px;
		}
		.store-confirm-order {
			width: 1000px;
			margin: 0 auto;
			padding: 0 45px;
			box-sizing: border-box;
		}
		.logo1 {
			height: 114px;
			color: #FF4201;
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-sizing: border-box;
			.logo2 {
				display: flex;
				align-items: center;
				margin-bottom: 30px;
				img {
					height: 30px;
				}
				.br3 {
					height: 30px;
					border-left: 1px solid #333333;
					margin: 0 15px;
				}
			}
		}
		.order-info {
			margin: 0 auto;
			margin-top: 30px;
			/*width: 940px;*/
			border: 1px solid #DDDDDD;
			box-sizing: border-box;
			.title {
				background-color: #EEEEEE;
				height: 40px;
				line-height: 40px;
				padding-left: 20px;
			}
			.el-form-item__label {
				padding: 0;
				line-height: 14px;
				height: 14px;
				padding-right: 20px;
				width: 145px;
			}
			.el-form-item__content {
				line-height: 14px;
			}
			.el-form {
				min-width: 600px;
				margin-top: 30px;
			}
			.gift{
				.el-form-item{
					.el-form-item__label{
						float: left;
						line-height: 20px;
					}
					.el-form-item__content{
						float: left;
						width: 700px;
						line-height: 20px;
					}
				}
			}
		}
		.tabs {
			margin: 0 auto;
			/*width: 940px;*/
			margin-bottom: 30px;
			.el-tabs__header {
				padding-left: 0;
				border-bottom: 1px solid #DDDDDD;
			}
		}
		.order-detail {
			/*width: 940px;*/
			margin: 0 auto;
			.order-content {
				.order-item-item-3 {
					border-right: 1px solid #DDDDDD;
				}
				.order-item-item-4 {
					border-right: 1px solid #DDDDDD;
					width: 180px;
					text-align: center;
				}
				.order-item-item-5 {
					text-align: center;
					flex-grow: 1;
				}
				.message {
					.el-input {
						width: 500px;
					}
				}
				img {
					width: 80px;
					height: 80px;
				}
				.item-content {
					border-top: 1px solid #DDD;
					/*width: 940px;*/
				}
				.item-item {
					border: 1px solid #DDD;
					border-top: none;
					box-sizing: border-box;
					display: flex;
					.el-input {
						width: 90px;
					}
				}
				.order-item-item-2 {
					width: 100px;
					text-align: center;
				}
				.order-item-item-3 {
					width: 100px;text-align: center;
				}
			}
			.total {
				/*width: 940px;*/
				padding: 30px 60px 30px 0;
				border: 1px solid #DDDDDD;
				border-top: none;
				box-sizing: border-box;
				.payment {
					color: #D24C4C;
				}
				span {
					display: inline-block;
					min-width: 70px;
					text-align: left;
				}
				ul li {
					margin-bottom: 5px;
				}
			}
		}
		.el-table {
			.cell {
				padding: 10px 30px;
			}
		}
	}
	
	.mr-45 {
		margin-right: 45px;
	}
</style>