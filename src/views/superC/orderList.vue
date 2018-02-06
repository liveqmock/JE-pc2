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
					<el-form-item label="订单商品:">
						<el-input placeholder="请输入订单商品" v-model.trim="formInlineData.skuName"></el-input>
					</el-form-item>
					<el-form-item label="久集帐号:">
						<el-select v-model="formInlineData.supercStoreId" placeholder="请选择久集帐号" clearable>
							<el-option v-for="g in superCList" :label="g.storeName" :value="g.id" key="$index"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="供应商:">
						<el-select v-model="formInlineData.sellerId" placeholder="请选择供应商帐号" clearable>
							<el-option v-for="g in storeList" :label="g.storeName" :value="g.traderId" key="$index"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="下单时间:" prop="orderDateRange">
						<el-date-picker v-model="formInlineData.orderDateRange" class="order-datatimerange" type="datetimerange" placeholder="选择时间范围">
						</el-date-picker>
					</el-form-item>
				</div>
				<el-button @click='handleSearch' type="info" class="supplier-check-btn fl">查询</el-button>
			</el-form>
			<div class='tar clearfix'>
				<el-button type='text' class="fr" @click="exportExcel">批量导出</el-button>
			</div>
			<div class="order-list">
				<el-checkbox v-model="checkAll" @change="handleCheckAllChange" class="checkedAll"></el-checkbox>
				<el-table>
					<el-table-column label='' width="50"></el-table-column>
					<el-table-column label='商品' width="200" align="center"></el-table-column>
					<el-table-column label='单价' width="86"></el-table-column>
					<el-table-column label='数量' width="74"></el-table-column>
					<el-table-column label='久集' width="80"></el-table-column>
					<el-table-column label='佣金' width="64"></el-table-column>
					<el-table-column label='供应商' width="66"></el-table-column>
					<el-table-column label='买家' width="72"></el-table-column>
					<el-table-column label='订单状态' width="64"></el-table-column>
					<el-table-column label='订单金额' width="88"></el-table-column>
					<el-table-column label='操作' align="center" width="96"></el-table-column>
				</el-table>
				<div class="table-item-default tac" v-if="tableData.length<=0">
					<img src="../../assets/empty.png" alt="" />
					<div class="color-blue mt-30"><span class="cursor"> 暂无数据 </span></div>
				</div>
				<div v-else>
					<el-checkbox-group v-model="checkOrder"  @change="handleCheckChange">
						<div class="table-item mt-10" v-for='(order, index) in tableData' key='$index'>
							<div class="clearfix table-item-top lh-20 bbd bg-e">
								<el-checkbox class="fl" :label="order"></el-checkbox>
								<span class='fl'>订单编号：{{order.orderSn}}</span>
								<span class='fl color-6 ml-30'>下单时间：{{order.gmtCreate | time}}</span>
								<!--<span class='fr color-6 mr-30' v-if="order.orderStatus==1">还剩<span class="color-danger">{{order.remainAutoCancelTime}}</span>自动取消</span>-->
							</div>
							<div class="table-item-content clearfix bbd" style="display: flex;" >
								<div class=" clearfix" style="width:405px;box-sizing: border-box;" >
									<!--商品清单-->
									<div class="bb clearfix "  v-for="(orderItem, index) in order.itemList" key="$index"
										style="padding: 20px 0 20px 20px;">
										<div class="fl" style="width: 234px;">
											<img v-if="orderItem.fileUrl" :src="orderItem.fileUrl" class="fl mr-20" />
											<img v-else src="../../assets/goods.png" class="fl mr-10" />
											<p>{{orderItem.skuName}}</p>
											<p class="color-9">规格:1*{{orderItem.specInfoNum}}</p>
										</div>
										<div class="fl tac " style="width:82px;">¥{{orderItem.discountPrice | fmoney}}</div>
										<div class="fl tac " style="width:66px;">{{orderItem.num}}</div>
									</div>
								</div>
								<div class="bl bb tac pt-20" style="width:83px;word-break: break-all">{{order.storeName}}</div>
								<div class="bl bb tac pt-20" style="width:63px;word-break: break-all">￥{{order.commission | fmoney}}</div>
								<!-- 供应商 -->
								<div class="bl bb tac pt-20" style="width:63px;">{{order.applyName}}</div>
								<div class="bl bb tac pt-20" style="width:71px;word-break: break-all">{{order.addrUsername}}</div>
								<div class="bl bb tac pt-20" style="width:63px;">
									<span v-if="order.orderStatus==0">已关闭</span>
									<span v-if="order.orderStatus==1">待付款</span>
									<span v-if="order.orderStatus==2">待发货</span>
									<span v-if="order.orderStatus==3">已发货</span>
									<span v-if="order.orderStatus==4">已完成</span>
								</div>
								<div class="bl bb tac pt-20" style="width:90px;">
									<div class="tac">¥{{order.needPayMoney | fmoney}}</div>
									<div class="tac">（含运费：¥0.00）</div>
								</div>
								<div class="bl bb tac" :style="{paddingTop : '15px'}" style="flex-grow: 1;" >
									<div :style="{width : '90px'}" class="w100">
										<template  v-if="order.creditState === 1">
											<el-button :style="{marginLeft : '0'}" @click="handleWitchExamine(order)" type="text">查看凭证</el-button>
										</template>
										<router-link :to="`${basePath}/superc/orderDetail`">
											<el-button type='text' @click="orderDetail(order.orderSn)">订单详情</el-button>
										</router-link>
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
		<!--导出-->
		<form ref="exportList" action='/sunrise-gateway/export/superc/order/exportForPlatform' style="display: none">
			<input type="text" name="startRow" v-model="a">
			<input type="text" name="startCol" v-model="a">
			<input type="text" v-if="formInlineData.sellerId" name="sellerId" v-model="formInlineData.sellerId">
			<input type="text" v-if="formInlineData.orderSn" name="orderSn" v-model="formInlineData.orderSn">
			<input type="text" v-if="formInlineData.skuName" name="skuName" v-model="formInlineData.skuName">
			<input type="text" v-if="formInlineData.orderStatus" name="orderStatus" v-model="formInlineData.orderStatus">
			<input type="text" v-if="formInlineData.supercStoreId" name="supercStoreId" v-model="formInlineData.supercStoreId">
			<input type="text" v-if="formInlineData.startTime" name="startTime" v-model="formInlineData.startTime">
			<input type="text" v-if="formInlineData.endTime" name="endTime" v-model="formInlineData.endTime">
			<input type="text" v-if="idStr" name="idStr" v-model="idStr">
			<input type="text" name="fileName" v-model="fileName">
			<input type="text" name="modelName" v-model="modelName">
		</form>
		<!-- 查看 凭证 -->
		<imgview ref="imgview" :visible="imgviewVisible" :imgs="voucherImgList" :startindex="0" @close="imgviewVisible=false"></imgview>
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
					skuName: null, //N  订单商品
					supercStoreId: null, //N  久集账号
					sellerId: null, //N  商户id供应商
					orderStatus: null, // N  订单状态 0-已关闭 1-待付款 2-待发货 3-已发货 4-已完成
					startTime:null,// N 下单开始时间
					endTime:null,// N 下单结束时间
					orderDateRange:[] , //时间范围
					traderType:0
				},
				activeTab: '6', //都是数字
				tableData: [], //全部商户管理的列表
				currentPage: 1,
				total: 0,
				loading: false, // 控制数据的显示
				checkAll:false,//选中状态
				checkOrder:[], //选中的每行订单数据
				fileName: null,//导出名称
				a: 0,//固定值 写死
				modelName: 'platform.superc.order',
				idStr:[],//批量导出选中列表
				storeList: [],//供应商列表
				superCList: [],//久集账号列表
				voucherImgList : [], // 凭证图片 list
				imgviewVisible : false, // 查看凭证 dialog 开关
			}

		},
		activated() {
			this.$nextTick(() => {
				this.anonOrderListQuery(this.formInlineData)
				this.getStoreList()//加载供应商列表
				this.getSupercList()//加载久集列表
			})
		},
		methods: {
			// 获取 凭证图片 银行信息
			getVoucherImg(orderSn) {
				return (
					new Promise((resove,reject) => {
						axiosApi('/superc/credit/order/imgUploadPre',{ orderSn : orderSn },(res)=>{
							let data = res.data.data;
							if(data){
								let bankInfo = {
									bankName : data.bankName,
									bankUserName : data.bankUserName,
									bankCard : data.bankCard,
								};
								resove({
									img : data.imgs ? data.imgs : [],
									bankInfo : bankInfo,
								});
							}
						});
					})
				)
			},
			// 查看 凭证
			handleWitchExamine(row) {
				/* this.imgviewVisible = true;
				this.voucherImgList = [
					'http://pic.58pic.com/58pic/13/23/37/01958PICjAH_1024.jpg',
					'http://pic31.nipic.com/20130802/7487939_094504476000_2.jpg'
				];
				this.$refs.imgview.setActiveItem(0); */
				this.getVoucherImg(row.orderSn).then((data) => {
					if(data.img.length>0){
						this.imgviewVisible = true;
						this.voucherImgList = data.img;
						this.$refs.imgview.setActiveItem(0); 
					}
				});
			},
			//跳转订单详情页面
			orderDetail(orderSn){
				let supplierOrderDetail = {
					type:'supplierOrderDetail',
					orderSn : orderSn
				}
				sessionStorage.setItem('supplierOrderDetail', JSON.stringify(supplierOrderDetail))
			},
			getStoreList(){/*供应商列表*/
				axiosApi('/superc/traderOpenSuperC/selectList/all',{},(res)=>{
//					console.log('供应商帐号',res)
					this.storeList = res.data.data;
				},1,10,(res)=>{})
			},
			getSupercList(){/*久集列表*/
				axiosApi('/superc/querySupercForSeller/select',{},(res)=>{
//					console.log('jiuji 帐号',res)
					this.superCList = res.data.data;
				},1,10,(res)=>{})
			},
			//订单列表查询及条件查询
			anonOrderListQuery(body){
				this.loading = true
				axiosApi('/superc/order/selectPageList/all', body, (res)=>{
					console.log('订单列表查询及条件查询', res)
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
				this.formInlineData.startTime = this.formInlineData.orderDateRange[0] == undefined ? null : this.formInlineData.orderDateRange[0].getTime()
				this.formInlineData.endTime = this.formInlineData.orderDateRange[1] == undefined ? null : this.formInlineData.orderDateRange[1].getTime()
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
			},
			handleCheckAllChange(val){/*table全选*/
				if(this.checkAll) {
					this.tableData.forEach(item => {
						this.checkOrder.push(item)
						this.idStr.push(item.id)
					});
				} else {
					this.checkOrder = [];
					this.idStr = []
				}
			},
			
			handleCheckChange(val){//单选
				let checkedCount = val.length;
				this.checkAll = checkedCount === this.tableData.length;
				this.idStr = [];
				val.forEach(item => {
					this.idStr.push(item.id)
				});
			},
			exportExcel(){//批量导出
				this.formInlineData.startTime =  this.formInlineData.orderDateRange[0] == undefined? null: this.formInlineData.orderDateRange[0].getTime(); 
				this.formInlineData.endTime = this.formInlineData.orderDateRange[1] == undefined? null : this.formInlineData.orderDateRange[1].getTime();
				let str = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
				this.fileName = '订单列表_' + str + '.xls'
				
				setTimeout(()=>{
					if(this.tableData.length>0){
						this.$refs.exportList.submit()
					}else{
						this.$message.warning('暂无数据，无法导出');
					}
				},0)
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
		.el-table .el-table__body-wrapper,.el-checkbox__label { display: none; }
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
		.el-table{
			border: none;font-size: 14px;
			th>.cell{line-height: 12px; padding: 10px 0 10px 0;text-align: center;}
			th.is-leaf{
				border-bottom: 0;
			}
		}
		.checkedAll {
			position: relative;
			top: 30px;
		}
		.el-checkbox{
			width: 70px;
			margin-left: 30px;
			.el-checkbox__input{height: 20px;}
		}
		.el-checkbox__inner{width: 20px;height: 20px;}
		.el-checkbox__inner::after {top: 2px;}
		.w100{ width: 100px; }
	}
</style>