<template>
	<div id="account-recharge" v-loading="loading">
		<div class="title-menu">
			<div class="clearfix">
				<el-breadcrumb class="fl">
					<el-breadcrumb-item>充值单</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</div>
		<div class="content">
			<el-form :inline="true" :model="form">
				<el-form-item label="时间">
					<!-- <el-date-picker v-model="form.timeRange" type="datetimerange" placeholder="选择日期范围">
					</el-date-picker> -->
					<ysDaterangePicker v-model="form.timeRange" type="datetime"/>
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
			<el-table :data="data">
				<el-table-column label="单据号" prop="rechargeNo"></el-table-column>
				<el-table-column label="充值时间" width="110">
					<template scope="scope">
						<span>{{scope.row.createdTime | time}}</span>
					</template>
				</el-table-column>
				<el-table-column label="商户名称" prop="storeName" show-overflow-tooltip></el-table-column>
				<el-table-column label="支付渠道" show-overflow-tooltip>
					<template scope="scope">
						{{scope.row.bankName}}
					</template>
				</el-table-column>
				<el-table-column label="账号" show-overflow-tooltip>
					<template scope="scope">
						{{scope.row.bankCode}}
					</template>
				</el-table-column>
				<el-table-column label="充值金额" show-overflow-tooltip>
					<template scope="scope">
						<span>¥{{scope.row.rechargeAmount | fmoney}}</span>
					</template>
				</el-table-column>
				<el-table-column label="手续费" show-overflow-tooltip>
					<template scope="scope">
						<span>¥{{scope.row.commission | fmoney}}</span>
					</template>
				</el-table-column>
				<el-table-column label="最终到账" show-overflow-tooltip>
					<template scope="scope">
						<span>¥{{scope.row.dealAmount | fmoney}}</span>
					</template>
				</el-table-column>
				<el-table-column label="状态" show-overflow-tooltip>
					<template scope="scope">
						<span v-if="scope.row.state == 0">充值中</span>
						<span v-if="scope.row.state == 1">充值成功</span>
						<span v-if="scope.row.state == 2">充值失败</span>
					</template>
				</el-table-column>
				<el-table-column label="备注" show-overflow-tooltip prop="remark"></el-table-column>
			</el-table>
			<el-pagination v-if='total>0' class="tar" :current-page="currentPage" :page-size='10' :total='total' layout="prev , pager, next, jumper" @current-change="handleCurrentChange">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import { axiosApi, basePath } from '../../api/api'; // 导入API
	export default {
		data() {
			return {
				activeTab: '1', //标签页
				form: {
					timeRange: []
				}, //查询表单
				currentPage: 1, //分页当前页
				total: 10, //总条数
				data: [], //充值单数据
				orderNo: null, //充值单号
				startCreateTime: null, //开始时间
				endCreateTime: null, //结束时间
				state: null, //状态
				loading:false, 
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.chargeCashQuery({})
			})
		},
		methods: {
			setCreateTime(type) {
				switch(type) {
					case 0:
						if(this.form.timeRange.length > 0) {
							this.form.timeRange = this.form.timeRange.map((item) => {
								if (new Date(item).getTime()==0) {
									return null
								}
								return new Date(item).getTime()
							})
							this.startCreateTime = this.form.timeRange[0]
							this.endCreateTime = this.form.timeRange[1]
						} else {
							this.startCreateTime = this.endCreateTime = null
						}
						break
					case 1:
						this.startCreateTime = this.setStartHours(new Date()).getTime()
						this.endCreateTime = this.setEndHours(new Date()).getTime()
						break
					case 2:
						this.startCreateTime = this.getWeekStartDate().getTime()
						this.endCreateTime = this.getWeekLastDate().getTime()
						break
					case 3:
						this.startCreateTime = this.getMonthFirstDay().getTime()
						this.endCreateTime = this.getMonthLastDay().getTime()
						break
					default:
						break;
				}
				this.currentPage = 1
			},
			//时间搜索
			searchTime() {
				this.chargeCashQuery({
					startCreatedTime: this.startCreateTime,
					endCreatedTime: this.endCreateTime
				})
			},
			//查询按钮
			handleSearch(type) {
				this.setCreateTime(type)
				this.searchTime()
			},
			//充值单查询
			chargeCashQuery(body) {
				this.loading = true
				axiosApi('/anon/cbs/pay/chargeCashQuery', body, (res) => {
					this.loading = false;
					({elements: this.data,totalCount: this.total} = res.data.data)
				}, this.currentPage, 10, (res) => {
					this.loading = false
				})
			},
			/*当前页改变*/
			handleCurrentChange(val) {
				this.currentPage = val
				this.searchTime()
			}
		}
	}
</script>

<style lang="less">
	#account-recharge {
		.el-date-editor--datetimerange.el-input {
			width: 240px;
		}
		.content {
			padding: 30px;
		}
		.fw {
			font-weight: 700;
		}
		.el-form {
			.form-item2 {
				.el-form-item__label {
					width: 60px;
				}
			}
			.el-form-item {
				margin-right: 30px;
			}
			.el-form-item__label {
				font-size: 12px;
				padding: 0;
				padding-right: 10px;
				width: 40px;
			}
			.el-input__inner {
				font-size: 12px;
			}
			.el-date-editor--daterange.el-input {
				width: 240px;
			}
		}
	}
</style>