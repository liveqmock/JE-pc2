<template>	
	<div>
	<div class="title-menu">
			<div class="clearfix">
				<el-breadcrumb class="fl">
					<el-breadcrumb-item>交易记录</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
	</div>
	<div class="trading-water">
		
		<div class="clearfix">
			<el-form :inline='true' :model="formInline" class="form-search fl">
				<el-form-item label="商户名称">
					<el-input placeholder="请输入商户名称或手机号" v-model="formInline.userName"></el-input>		
				</el-form-item>
				<el-form-item label="交易时间">
					<!-- <el-date-picker v-model="formInline.time" type="daterange" placeholder="选择日期范围">
					</el-date-picker> -->
					<ysDaterangePicker v-model="formInline.time"/>
				</el-form-item>
				<el-form-item label="业务大类">
					<el-select v-model="formInline.tradeTypeId" placeholder="请选择" clearable>
						<el-option v-for="(tradeTypeItem,index) in tradeType" :key="index" :label="tradeTypeItem.label" :value="tradeTypeItem.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="业务小类">
					<el-select v-model="formInline.busiTypeId" placeholder="请选择" clearable>
						<el-option v-for="(zy,index) in selection" :label="zy.label" :key="index" :value="zy.value">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<el-button class="fl" type="info" @click="handleSearch">查 询</el-button>
		</div>
		<div class="clearfix">
			<el-table :data="paymentdata" :class="{'table-body-hidden':paymentdata.length==0}" stripe>
				<el-table-column label="流水号" prop="fundsId" ></el-table-column>
				<el-table-column label="操作时间" prop="createdTime" width="110">
					<template scope="scope">
						{{scope.row.createdTime | time}}
					</template>
				</el-table-column>
				<el-table-column label="收入(元)"  >
					<template scope="scope">
						{{scope.row.incomeAmount | fmoney}}
					</template>
				</el-table-column>
				<el-table-column label="支出(元)"  >
					<template scope="scope">
						{{scope.row.payoutAmount | fmoney}}
					</template>
				</el-table-column>
				<el-table-column label="账户余额(元)" >
					<template scope="scope">
						{{scope.row.balance | fmoney}}
					</template>
				</el-table-column>
				<el-table-column label="业务大类">
					<template scope="scope">
						<el-button @click="orderDetail(scope.row.outOrderNo)" v-if="scope.row.tradeTypeId==30" class="transaction-text-btn" type="text">{{scope.row.fundsName}}</el-button>
						<span v-else class="inline-block h32">{{scope.row.fundsName}}</span>
					</template>
				</el-table-column>
				<el-table-column label="业务小类" show-overflow-tooltip>
					<template scope="scope">
						{{scope.row.busiTypeName}}
					</template>
				</el-table-column>
				<el-table-column label="商户名称" prop="companyName" show-overflow-tooltip>
					<template scope="scope">
						{{scope.row.companyName}}
					</template>
				</el-table-column>
				<el-table-column label="备注" prop="remark" show-overflow-tooltip>
					<template scope="scope">
						{{scope.row.fundsDesc}}
					</template>
				</el-table-column>
			</el-table>
			<el-pagination v-if='total>0' class="tar" :current-page="currentPage" :page-size='10' :total='total' layout="prev , pager, next, jumper" @current-change="handleCurrentChange">
			</el-pagination>
			<div class="tac mt-30" v-if="paymentdata.length==0">
				<!-- <img src="../../../assets/empty.png" alt="" /> -->
				<div class="color-9 mt-30">
					<span>暂无记录</span>
				</div>
			</div>

		</div>
	</div>
	</div>
</template>

<script>
	import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
	export default {
		data(){
			return {}
		},
		mounted () {
			this.paymentQuery()
		},
		computed:{
			...mapState('tradingWater',['formInline','paymentdata','tradeType','selection','total','currentPage','basePath']),
			...mapGetters('tradingWater', ['selection'])
		},
		methods:{
			...mapActions('tradingWater',['paymentQuery']),
			...mapMutations('tradingWater', ['currentpageChange','search','goOrderDetail']),
			handleSearch () {
				this.search() //搜索条件
				this.paymentQuery() //接口调用
			},
			handleCurrentChange(val){
				this.currentpageChange(val) //分页change
				this.paymentQuery() //接口调用
			},
			orderDetail(val){
				this.goOrderDetail({
					path: '/TradingWater',
					session: JSON.stringify({type: 'supplierOrderDetail',orderSn:val})
				})
			}
		}
	}
</script>

<style lang="less">
	.trading-water {
		box-sizing: border-box;
		width: 940px;
		margin: 0 auto;
		padding: 50px 0;
		/*表单查询*/
		.form-search {
			width: 660px;
			.el-form-item {
				margin-right: 30px;
			}
			.el-input__inner {
				font-size: 12px;
			}
			.el-form-item__label {
				padding: 0 10px 0 0;
				width: 57px;
				font-size: 12px;
				color: #333333;
				letter-spacing: -0.29px;
			}
			/*日期控件*/
			.el-date-editor--daterange.el-input {
				width: 240px;
			}
		}
		.ctabs {
			.el-tabs__header {
				padding-left: 0px;
			}
			.el-tabs__item {
				font-size: 12px;
			}
		}
		.el-table {
			th>.cell {
				font-weight: normal;
				color: #333333;
			}
			.transaction-text-btn {
				font-size: 12px;width: auto;
			}
		}
		.table-body-hidden {
			.el-table__empty-block {
				display: none;
			}
		}
		.h32{
			height: 32px;line-height: 32px;
		}
	}
</style>