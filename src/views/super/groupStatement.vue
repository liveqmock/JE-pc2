<template>
	<div id="groupStatement">
		<div class="title-top bg-f">
			团购报表
		</div>
		<div class="bg-f mt-5 main">
			<el-form :inline="true" :model="formInlineData" class="clearfix mt-30 ml-30">
				<div style="width:70%" class="fl">
					<el-form-item label="上游商家:">
						<el-input placeholder="请输入上游商家" v-model.trim="formInlineData.parentStoreName"></el-input>
					</el-form-item>
					<el-form-item label="团购商家:">
						<el-input placeholder="请输入团购商家" v-model.trim="formInlineData.storeName"></el-input>
					</el-form-item>
					<el-form-item label="团购名称:">
						<el-input placeholder="请输入团购名称" v-model.trim="formInlineData.grouponName"></el-input>
					</el-form-item>
					<el-form-item label="分享企业:">
						<el-input placeholder="请输入分享企业" v-model.trim="formInlineData.companyName"></el-input>
					</el-form-item>
					<el-form-item label="分享日期:" prop="orderDateRange">
						<el-date-picker v-model="formInlineData.orderDateRange" class="datatimerange" type="datetimerange" placeholder="选择时间范围">
						</el-date-picker>
					</el-form-item>
				</div>
				<el-button @click='handleSearch' type="info" class="supplier-check-btn fl">查询</el-button>
			</el-form>
			<div class="content ml-30 mr-30" v-loading='loading1'>
				<el-table>
					<el-table-column label='团购名称' width="150" align="center"></el-table-column>
					<el-table-column label='团购商家' width="100" align="center"></el-table-column>
					<el-table-column label='手机' width='100' align="center"></el-table-column>
					<el-table-column label='上游商家' width='130' align="center"></el-table-column>
					<el-table-column label='分享企业' width='140' align="center"></el-table-column>
					<el-table-column label='下单数' width="60" align="center"></el-table-column>
					<el-table-column label='团购金额' width="82" align="center"></el-table-column>
					<el-table-column label='佣金营收' width="60" align="center"></el-table-column>
					<el-table-column label='分享日期' align="center"></el-table-column>
				</el-table>
				<div class="table-item-default tac" v-if="tableData.length<=0">
					<img src="../../assets/empty.png" alt="" />
					<div class="color-blue mt-30"><span class="cursor">暂无数据 </span></div>
				</div>
				<div class="info" v-for='item in tableData' key='$index'>
					<div class="fl clearfix br"><span class="fl tac" style="width: 153px;">{{item.grouponName}}</span></div>
					<div class="fl clearfix br"><span class="fl tac" style="width: 103px;">{{item.storeName}}</span></div>
					<div class="fl clearfix br"><span class="fl tac" style="width: 91px;">{{item.tel}}</span></div>
					<div class="fl clearfix br">
						<div v-if='item.parentStoreNameList !=null' class="fl tac" style="width: 141px;">
							<span class="fl tac hide" :title="item1" style="width: 141px;" v-for='item1 in item.parentStoreNameList' key='$index'>
						{{item1}}
						</span>
						</div>
						<span v-if='item.parentStoreNameList ==null' class="fl tac" style="width: 141px;">
						<span>--</span>
						</span>
					</div>
					<div class="fl">
						<div v-if='item.companyVOList != null' class="clearfix p" v-for='item2 in item.companyVOList' key='$index'>
							<span style="width: 142px;word-break: break-word;" class="fl tac bbe" >{{item2.companyName ? item2.companyName : '--'}}</span>
							<span v-if='item2.orderQuantity' class="fl cursor color-blue tac bbe" style="width: 51px;" @click='open(item2)'>{{item2.orderQuantity}}</span>
							<span v-else class="fl tac bbe" style="width: 51px;">0</span>
							<span v-if='item2.orderAmount && item2.orderAmount != 0' class="fl tac bbe" style="width: 83px;">&yen;{{item2.orderAmount}}</span>
							<span v-else class="fl tac bbe" style="width: 83px;">--</span>
							<span v-if='item2.commissionAmount && item2.commissionAmount != 0' class="fl tac bbe" style="width: 71px;">&yen;{{item2.commissionAmount}}</span>
							<span v-else class="fl tac bbe" style="width: 71px;">--</span>
							<span class="fl tac bbe" style="width: 98px;border: none;padding-top: 20px;">{{item2.gmtCreate | timeGroup}}</span>
						</div>
						<div v-if='item.companyVOList == null' class="clearfix p" style="height: 38px;">
							<span class="fl tac bbe" style="width: 142px;">--</span>
							<span class="fl tac bbe" style="width: 51px;">--</span>
							<span class="fl tac bbe" style="width: 83px;">--</span>
							<span class="fl tac bbe" style="width: 71px;">--</span>
							<span class="fl tac bbe" style="width: 98px;border: none;">--</span>
						</div>
					</div>

				</div>
			</div>
			<el-pagination v-if='total>0' class="tar mr-30" :current-page="currentPage" :page-size='10' :total='total' layout="prev , pager, next, jumper" @current-change="handleCurrentChange">
				<!-- 分页组件 -->
			</el-pagination>
			<!--订单弹框-->
			<el-dialog :title="title" v-model='openOrder'>
				<div class="content mr-30 ml-30" v-loading='loading'>
					<el-table>
						<el-table-column label='商品' width="350" align="center"></el-table-column>
						<el-table-column label='单价' width="70"></el-table-column>
						<el-table-column label='数量' width="50"></el-table-column>
						<el-table-column label='团购金额' width="110"></el-table-column>
						<el-table-column label='佣金盈收' width="110"></el-table-column>
						<el-table-column label='订单状态' width="105"></el-table-column>
						<el-table-column label='类型'></el-table-column>
					</el-table>
					<div class="table-item mt-10" v-for='(order, index) in ordersListResVo' key='$index'>
						<div class="clearfix table-item-top lh-20 bbd bg-e">
							<span class='fl ml-30'>订单编号：{{order.sn}}</span>
							<span class='fl color-6 ml-30'>下单时间：{{order.gmtCreate | timeGroup}}</span>
							<span v-if='order.parentStoreName' class='fl color-6 ml-30'>上游商家：{{order.parentStoreName}}</span>
						</div>
						<div class="table-item-content clearfix bbd" style="display: flex;">
							<div class="clearfix" style="box-sizing: border-box;">
								<!--商品清单-->
								<div class="clearfix " :class='index != order.grouponOrderItemVOs.length-1 ? "bb":""' v-for="(orderItem, index) in order.grouponOrderItemVOs" key="$index" style="padding: 20px 0 20px 20px;">
									<div class="fl" style="width: 309px;">
										<img v-if="orderItem.fileUrl" :src="orderItem.fileUrl" class="fl mr-20" />
										<img v-else src="../../assets/goods.png" class="fl mr-20" />
										<div class="fl">
											<p class="clearfix">
												<span class="fl">商品编码:</span>
												<span class="fl" style="width:100px;word-wrap:break-word">{{orderItem.goodsNo}}</span>
											</p>
											<p style="width: 179px;">{{orderItem.skuName}}</p>
										</div>
									</div>
									<div class="fl tac " style="width:80px;">&yen;{{orderItem.originPrice | fmoney}}</div>
									<div class="fl tac" style="width:50px;">{{orderItem.num}}</div>
									<div class="fl tac" style="width:110px;">&yen;{{orderItem.discountTotalPrice | fmoney}}</div>
									<div v-if='orderItem.commission != null' class="fl tac" style="width:110px;">&yen;{{orderItem.commission | fmoney}}</div>
									<div v-else='orderItem.commission == null' class="fl tac" style="width:110px;">--</div>
								</div>
							</div>
							<div class="bl tac pt-20 fl" style="width:100px;">
								<span v-if="order.orderStatus==0">已关闭</span>
								<span v-if="order.orderStatus==1">待付款</span>
								<span v-if="order.orderStatus==2">待发货</span>
								<span v-if="order.orderStatus==3">待收货</span>
								<span v-if="order.orderStatus==4">已完成</span>
							</div>
							<div class="bl tac pt-20 fl" style="width:100px;">
								<span>{{order.type == 1 ? '大B自销' : order.type == 2 ? '小B自销' : '小B代销'}}</span>
							</div>
						</div>
					</div>
					<el-pagination v-if='total1>0' class="tar" :current-page="currentPage1" :page-size='10' :total='total1' layout="prev , pager, next, jumper" @current-change="handleCurrentChangeOpen">
						<!-- 分页组件 -->
					</el-pagination>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import { axiosApi, basePath } from "../../api/api";
	export default {
		data() {
			return {
				loading: false,
				loading1: true,
				checkAll: false, //选中状态
				checkOrder: [], //选中的每行订单数据
				checkOrderSn: [], //选中的每行订单数据
				formInlineData: {
					parentStoreName: null, //上游商家名称
					storeName: null, //超团卖家
					grouponName: null, //团购名称
					companyName: null, //企业名称
					startDate: null, //start
					endDate: null, //end
					orderDateRange: [], //时间范围
				},
				tableData: [], //团购列表数据
				total: 0,
				currentPage: 1,
				total1: 0,
				currentPage1: 1,
				openOrder: false,
				ordersListResVo: [], //订单数据
				title: '', //弹框title
				grouponCompanyId: '' //弹框入参
			}
		},
		methods: {
			open(val) {
				this.currentPage1 = 1
				this.title = val.companyName
				this.grouponCompanyId = val.grouponCompanyId
				this.loading = true
				this.getSearch(val.grouponCompanyId)
				this.openOrder = true
			},
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
			//企业订单弹窗数据
			getSearch() {
				this.loading = true
				axiosApi('/groupon/orderList/select', {
					companyId: this.grouponCompanyId
				}, (res) => {
					this.total1 = res.data.data.totalCount
					this.ordersListResVo = res.data.data.elements
					this.loading = false
				}, this.currentPage1, 10, (res) => {
					this.$message({
						type: 'error',
						message: res.data.message,
						duration: 1000
					})
					this.loading = false
				})
			},
			achieve(body) {
				this.loading1 = true
				axiosApi('/groupon/statisticsGrouponAll/list', body, (res) => {
					this.tableData = res.data.data.elements ? res.data.data.elements : []
					this.total = res.data.data ? res.data.data.totalCount : '';
					this.loading1 = false
				}, this.currentPage, 10, (res) => {
					this.$message({
						type: 'error',
						message: res.data.message,
						duration: 1000
					})
				})
			},
			//表单条件查询
			handleSearch() {
				//获取开始接受时间
				this.formInlineData.startDate = this.formInlineData.orderDateRange[0] == undefined ? null : this.formInlineData.orderDateRange[0].getTime()
				this.formInlineData.endDate = this.formInlineData.orderDateRange[1] == undefined ? null : this.formInlineData.orderDateRange[1].getTime()
				if(this.currentPage === 1) {
					this.achieve(this.formInlineData)
				} else {
					this.currentPage = 1; //赋值自动调用一次接口
				}
			},
			//改变分页
			handleCurrentChange(val) {
				this.currentPage = val
				this.achieve(this.formInlineData)
			},
			//改变分页(弹窗)
			handleCurrentChangeOpen(val) {
				this.currentPage1 = val
				this.getSearch()
			},
		}, //进入加载
		mounted() {
			this.$nextTick(() => {
				this.achieve()
			})
		},
	}
</script>

<style lang="less">
	#groupStatement {
		.hide {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.bbe {
			border-right: 1px solid #DDDDDD;
			height: 70px;
			padding: 25px 0 20px 0;
			box-sizing: border-box;
		}
		.br {
			border-right: 1px solid #DDDDDD;
			display: flex;
			display: -webkit-flex;
			align-items: center;
		}
		.main {
			.el-button--text {
				width: auto;
				height: auto;
			}
			.el-form--inline .el-form-item__label {
				/* 搜索框label 的字体是12px */
				width: 75px;
				font-size: 12px;
			}
			.el-form--inline .el-input__inner {
				/* 搜索框的字体是12px */
				font-size: 12px;
			}
			.datatimerange {
				width: 240px;
			}
		}
		.content {
			.info {
				overflow: hidden;
				font-size: 12px;
				display: flex;
				border: 1px solid #ddd;
				border-top: 0;
				.p {
					display: flex;
					align-items: center;
					justify-content: flex-start;
					border-bottom: 1px solid #ddd;
					&:last-child {
						border-bottom: 0;
					}
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
			.table-item-default {
				height: 530px;
				padding-top: 120px;
			}
			.el-checkbox__label {
				display: none;
			}
		}
		.el-dialog--small {
			width: 950px !important;
			left: 53%;
		}
	}
</style>