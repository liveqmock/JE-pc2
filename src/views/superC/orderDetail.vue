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
					<div class="title">订单信息</div>
					<el-form class='fl'>
						<el-form-item label="订单编号:">
							{{orderInfoObj.orderSn}}
						</el-form-item>
						<el-form-item label="客户名称:">
							{{orderInfoObj.storeName}} {{orderInfoObj.addrTel}}
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
					<el-tab-pane label="授信凭证" name="3"></el-tab-pane>
					<!--<el-tab-pane label="订单操作日志" name="4"></el-tab-pane>
					<el-tab-pane label="订单备注" name="5"></el-tab-pane>-->
				</el-tabs>

				<div v-if="activeName == '1'">
					<div class="order-detail ">
						<div class="order-content">
							<div class="item mb-20">
								<div class="item-content">
									<div class="item-item clearfix" v-for="(item, index) in orderInfoObj.itemList" key="$index">
										<div class="clearfix order-item-item pt-20 pl-20 pb-20">
											<img v-if="item.fileUrl" class="fl img mr-10" :src="item.fileUrl" alt="spuImage" />
											<img v-else src="../../assets/goods.png" class="fl mr-10" />
											<div class="fl" style="width: 240px;">
												<p class="color-9 font-14">商品编码：{{item.skuNo}}</p>
												<p class="" v-text="item.skuName"> </p>
												<p class="color-9">规格: 1*{{item.specInfoNum}}</p>
											</div>
										</div>
										<div class="order-item-item-2 pt-20 ">
											<p>￥{{item.discountPrice | fmoney}}</p>
										</div>
										<div class="order-item-item-3 pt-20">
											<p>{{item.num}}</p>
										</div>
										<div class="order-item-item-4 pt-20">
											<p class="color-F656 ">￥{{item.discountPrice*item.num | fmoney}}</p>
										</div>
										<div class="pt-20 order-item-item-5" style="width: 100px; text-align: left; padding: 5px;">
											<p>{{orderInfoObj.remark?orderInfoObj.remark:'无备注信息'}}</p>
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
								<div class="goods-money clearfix">
									<div class="goods-moneyR fr">
										<div><label><span class="mr-20">共{{orderInfoObj.totalGoodsNum}}件商品</span>订单金额：</label><span class="ml-10">¥{{orderInfoObj.needPayMoney||0 | fmoney}}</span></div>
										<div><label>实付金额：</label><span class="ml-10">¥{{orderInfoObj.needPayMoney||0 | fmoney}}</span></div>
										<div class="font-20 color-danger"><label>本单分销分成：</label><span class="ml-10">¥{{orderInfoObj.commission||0 | fmoney}}</span></div>
									</div>
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
								{{orderInfoObj.addrTel}}
							</el-form-item>
							<el-form-item label='地址:'>
								{{orderInfoObj.addrInfo}}
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
					<div v-if="orderInfoObj.invoiceInfoVO">
						<!--personalCompanyType==1单位 2个人-->
						<div class="order-info clearfix mb-20" v-if="orderInfoObj.invoiceInfoVO.personalCompanyType==1">
							<div class="title">
								<p class="fl">发票信息</p>
							</div>
							<el-form class='fl mb-10'>
								<el-form-item label="单位名称:">
									{{orderInfoObj.invoiceInfoVO.companyHead}}
								</el-form-item>
								<el-form-item label="纳税人识别号:">
									{{orderInfoObj.invoiceInfoVO.taxpayerIdNo}}
								</el-form-item>
								<!--<el-form-item label='注册地址:'>
									{{orderInfoObj.invoiceInfoVO.registerAddress}}
								</el-form-item>
								<el-form-item label='注册电话:'>
									{{orderInfoObj.invoiceInfoVO.registerPhone}}
								</el-form-item>
								<el-form-item label='开户银行:'>
									{{orderInfoObj.invoiceInfoVO.bankDeposit}}
								</el-form-item>
								<el-form-item label='银行账户:'>
									{{orderInfoObj.invoiceInfoVO.bankCard}}
								</el-form-item>-->
								<el-form-item label="收票人:">
									{{orderInfoObj.invoiceInfoVO.linkman}}
								</el-form-item>
								<el-form-item label="手机号:">
									{{orderInfoObj.invoiceInfoVO.tel}}
								</el-form-item>
								<el-form-item label="收票地址:">
									{{orderInfoObj.invoiceInfoVO.provinceName+" "+orderInfoObj.invoiceInfoVO.cityName+" "+orderInfoObj.invoiceInfoVO.regionName+" "+orderInfoObj.invoiceInfoVO.addr}}
								</el-form-item>
							</el-form>
						</div>

						<div class="order-info clearfix mb-20" v-if="orderInfoObj.invoiceInfoVO.personalCompanyType==2">
							<div class="title">
								<p class="fl">发票信息</p>
							</div>
							<el-form class='fl mb-10'>
								<el-form-item label="发票抬头:">
									个人
								</el-form-item>
								<el-form-item label="收票人:">
									{{orderInfoObj.invoiceInfoVO.linkman}}
								</el-form-item>
								<el-form-item label="手机号:">
									{{orderInfoObj.invoiceInfoVO.tel}}
								</el-form-item>
								<el-form-item label="收票地址:">
									{{orderInfoObj.invoiceInfoVO.provinceName+" "+orderInfoObj.invoiceInfoVO.cityName+" "+orderInfoObj.invoiceInfoVO.regionName+" "+orderInfoObj.invoiceInfoVO.addr}}
								</el-form-item>
							</el-form>
						</div>
					</div>
				</div>
				<!--出库记录-->
				<!--<div v-if=" activeName == '2' " class="noContent">
					<p class="font-20 color-9">暂无记录</p>
				</div>-->
				<div class='' v-if="activeName == '2' ">
					<div class="order-info clearfix mb-20" v-if="orderInfoObj.orderStatus==3 || orderInfoObj.orderStatus==4">
						<div class="title">
							配送信息
						</div>
						<el-form class='fl mb-10'>
							<el-form-item label="物流公司:">
								{{orderInfoObj.expressName}}
							</el-form-item>
							<el-form-item label="物流单号:">
								{{orderInfoObj.expressNum}}
							</el-form-item>
							<el-form-item label='运费:'>
								{{orderInfoObj.freightMoney | fmoney}}
							</el-form-item>
							<el-form-item label='运货日期:'>
								{{orderInfoObj.gmtShipped | time}}
							</el-form-item>
						</el-form>
					</div>
					
					<p class='color-9 mb-10 common'>发货商品</p>
					<el-table class='common mb-50' :data='orderInfoObj.itemList'>
						<el-table-column label='商品编码'>
							<template scope='scope'>
								<p class='color-3F'>{{scope.row.skuNo}}</p>
							</template>
						</el-table-column>
						<el-table-column label='商品名称'>
							<template scope='scope'>
								<p class='color-6'>{{scope.row.skuName}}</p>
							</template>
						</el-table-column>
						<el-table-column label='数量' prop='num'></el-table-column>
					</el-table>
				</div>

				<!--收款记录-->
				<div class="" v-if="activeName == '3'" key='payment'>
					<el-table class='common mb-20' :data='voucherTableList'>
						<el-table-column label="操作人">
							<template scope="scope">
								<span v-if="scope.row.operatorName">{{scope.row.operatorName}}</span>
								<span v-else>--</span>
							</template>
						</el-table-column>
						<el-table-column label="操作时间">
							<template scope="scope">
								<span v-if="scope.row.gmtModified">{{scope.row.gmtModified | time}}</span>
								<span v-else>--</span>
							</template>
						</el-table-column>
						<el-table-column label="审核状态">
							<template scope="scope">
								<span v-if="scope.row.stateName">{{scope.row.stateName}}</span>
								<span v-else>--</span>
							</template>
						</el-table-column>
						<el-table-column label="操作">
							<template scope="scope">
								<!-- 0-未上传；1-通过；2-驳回；3-审核中 -->
								<!-- 审核-通过  -->
								<template v-if="scope.row.state === 1">
									<el-button style="width:auto" @click="handleVoucherSee(scope.row)"  type="text">查看凭证</el-button>
								</template>
								<!-- 其他 -->
								<template v-else>
									<span>--</span>
								</template>
							</template>
						</el-table-column>
					</el-table>
					<!-- 分页 -->
                    <div class="pageBox">
                        <el-pagination class="tar" v-if="total>0"
                            :current-page="currentPage"
                            :page-size='10'
                            :total='total'
                            layout="prev, pager, next, jumper"
                            @current-change="handlePageChange">
                        </el-pagination>
                    </div>
				</div>
			<!-- 查看 凭证 -->
			<imgview ref="imgview" :visible="imgviewVisible" :imgs="voucherImgList" :startindex="0" @close="imgviewVisible=false"></imgview>
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
				voucherTableList : [], // 授信凭证 list data
				total : 0,
				currentPage : 1,
				voucherImgList : [], // 凭证图片 list
				imgviewVisible : false, // 查看凭证 dialog 开关
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.anonOrderDetailInfo() //订单详情
				this.initVoucherTable()// 获取凭证 列表
			})
		},
		methods: {
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
			anonOrderDetailInfo() { //订单详情接口
				this.loading = true
				axiosApi('/superc/order/selectDetailsForWeb', this.getOrderSn(), (res) => {
					this.loading = false
					this.orderInfoObj = res.data.data;
					console.log(this.orderInfoObj,'12345')
				}, 1, 10, (res) => {
					this.loading = false
					this.$message({
						message:res.data.message,
						type:'error',
						duration:2000
					})
				})
			},
			handlePageChange(val) {//分页
				this.currentPage = val;
				this.initVoucherTable();
			},
			initVoucherTable() {// 获取凭证 列表
				axiosApi('/superc/credit/order/backReason',{ orderSn : this.supplierOrderDetail.orderSn },(res) => {
					let data = res.data.data;
					console.log(data,'凭证 列表');
					if(data) {
						this.total = data.totalCount;
						this.voucherTableList = data.elements;
					}
				},this.currentPage,10);
			},
			handleVoucherSee(row){//查看凭证
				row.imgs = row.imgs ? row.imgs : [];
				if(row.imgs.length === 0){
					this.$message.warning('暂未上传凭证');
					return;
				}
				this.imgviewVisible = true;
				this.voucherImgList = row.imgs;
				this.$refs.imgview.setActiveItem(0); 
			},
			handleClick(tab) { //标签页切换tabs
				if(this.activeName == 3) {}
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
		.goods-money{
			line-height: 25px;
			padding: 20px 50px;
			box-sizing: border-box;
			label{
				width: 300px;
				display: inline-block;
				text-align: right;
			}
		}
	}
	
	.mr-45 {
		margin-right: 45px;
	}
</style>