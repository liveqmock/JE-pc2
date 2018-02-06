<template>
	<div id="account-center">
		<div class="title-menu">
			<div class="clearfix">
				<el-breadcrumb class="fl">
					<el-breadcrumb-item>账户中心</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<el-tabs v-model="fundsType" class='clearfix' @tab-click="handleTabClick">
				<el-tab-pane label='全部' name='0'></el-tab-pane>
				<el-tab-pane label='收入明细' name='1'></el-tab-pane>
				<el-tab-pane label='支出明细' name='2'></el-tab-pane>
			</el-tabs>
		</div>
		<div class="content">
			<div class="fw mb-20">
				<span class="mr-50">当前待结算金额：<span class="color-danger font-20">{{guaranteeBalance||0 | fmoney}}</span>元</span>
				待结算手续费：<span class="color-danger font-20">{{commissionBalance||0 | fmoney}}</span>元
			</div>
			<el-form :inline="true" :model="formInline">
				<el-form-item label="时间" >
					<!-- <el-date-picker
				      v-model="formInline.time"
				      type="datetimerange"
				      placeholder="选择日期范围">
				    </el-date-picker> -->
					<ysDaterangePicker v-model="formInline.time" type="datetime"/>
				</el-form-item>
				<el-form-item>
					<el-button type='info' @click="handleSearch(0)">搜 索</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type='info' @click="handleSearch(1)">今天</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type='info' @click="handleSearch(2)">本周</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type='info' @click="handleSearch(3)">本月</el-button>
				</el-form-item>
			</el-form>
			<el-table :data="paymentdata" :class="{'table-body-hidden':paymentdata.length==0}" stripe>
				<el-table-column label="流水号" prop="fundsId" ></el-table-column>
				<el-table-column label="操作时间" prop="createdTime" width="110">
					<template scope="scope">
						{{scope.row.createdTime | time}}
					</template>
				</el-table-column>
				<el-table-column label="收入(元)" >
					<template scope="scope">
						{{scope.row.incomeAmount | fmoney}}
					</template>
				</el-table-column>
				<el-table-column label="支出(元)" >
					<template scope="scope">
						{{scope.row.payoutAmount | fmoney}}
					</template>
				</el-table-column>
				<el-table-column label="账户余额(元)" prop="">
					<template scope="scope">
						{{scope.row.balance | fmoney}}
					</template>
				</el-table-column>
				<el-table-column label="业务大类">
					<template scope="scope">
						<router-link :to="`${basePath}/account/orderDetail`" v-if="scope.row.tradeTypeId==30">
							<el-button @click="orderDetail(scope.row.outOrderNo)" class="transaction-text-btn" type="text">{{scope.row.fundsName}}</el-button>
						</router-link>
						<span v-else class="inline-block h32">{{scope.row.fundsName}}</span>
					</template>
				</el-table-column>
				<el-table-column label="业务小类" show-overflow-tooltip>
					<template scope="scope">
						{{scope.row.busiTypeName}}
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
		</div>
	</div>
</template>

<script>
	import {mapGetters,mapActions,mapMutations} from 'vuex'
	import { basePath } from "../../api/api"
	export default{
		data(){
			return{}
		},
		activated(){
			this.$nextTick(()=>{
				if(this.fundsType == '0') {
					this.formInline.fundsType = null
				}
				this.paymentQuery()
				this.platformInfo()
			})
		},
		computed: {
			...mapGetters([
				'selection', 'tradeType', 'formInline', 'paymentdata', 'total', 'currentPage', 'fundsType', 'isTabShow'
				,'guaranteeBalance','commissionBalance'
			])
		},
		methods:{
			...mapActions([
				'paymentQuery','platformInfo'
			]),
			...mapMutations([
				'currentpageChange',
				'tabChange',
				'search',
				'clearForm',
				'goOrderDetail'
			]),
			/*当前页改变*/
			handleCurrentChange(val) { //分页change
				this.currentpageChange(val)
				this.paymentQuery()
			},
			handleTabClick(val) {
				this.tabChange(val.name)
				this.paymentQuery()
			},
			orderDetail(val){
				this.goOrderDetail(val)
			},
			setCreateTime(type) {
				switch(type) {
					case 0:
						if(this.formInline.time.length > 0) {
							this.formInline.time = this.formInline.time.map((item) => {
								if (new Date(item).getTime()==0) {
									return null
								}
								return new Date(item).getTime()
							})
							this.formInline.startCreateTime = this.formInline.time[0]
							this.formInline.endCreateTime = this.formInline.time[1]
						} else {
							this.formInline.startCreateTime = this.formInline.endCreateTime = null
						}
						break
					case 1:
						this.formInline.time  = []
						this.formInline.startCreateTime = this.setStartHours(new Date()).getTime()
						this.formInline.endCreateTime = this.setEndHours(new Date()).getTime()
						break
					case 2:
						this.formInline.time  = []
						this.formInline.startCreateTime = this.getWeekStartDate().getTime()
						this.formInline.endCreateTime = this.getWeekLastDate().getTime()
						break
					case 3:
						this.formInline.time  = []
						this.formInline.startCreateTime = this.getMonthFirstDay().getTime()
						this.formInline.endCreateTime = this.getMonthLastDay().getTime()
						break
					default:
						break;
				}
				this.currentpageChange(1)
			},
			handleSearch(type){
				this.setCreateTime(type)
				this.paymentQuery()
			}
		}
	}
</script>

<style lang="less">
	#account-center{
		.content{padding: 30px;}
		.fw{font-weight: 700;}
		.el-form{
			.el-form-item{margin-right: 30px;}
			.el-form-item__label{font-size: 12px;padding: 0;padding-right: 10px;width: 40px;}
			.el-input__inner{font-size: 12px;}
			.el-date-editor--datetimerange.el-input {
				width: 240px;
			}
		}
		.table-body-hidden {
			.el-table__empty-block {
				/*display: none;*/
			}
		}
		.h32{
			height: 32px;line-height: 32px;
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
	}
</style>