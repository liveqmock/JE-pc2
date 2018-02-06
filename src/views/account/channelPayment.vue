<template>
	<div id="account-recharge" v-loading="loading">
		<div class="title-menu">
			<div class="clearfix">
				<el-breadcrumb class="fl">
					<el-breadcrumb-item>{{$route.query.gateName}}渠道收支明细</el-breadcrumb-item>
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
				<el-table-column label="日期" align="center">
                    <template scope="scope">
						<span>{{scope.row.createdTime | time}}</span>
					</template>
                </el-table-column>
				<el-table-column label="商家" prop="storeName" width="110" align="center"></el-table-column>
				<el-table-column label="金额" show-overflow-tooltip align="center">
					<template scope="scope">
						<span>¥{{scope.row.payAmount | fmoney}}</span>
					</template>
				</el-table-column>
                <el-table-column label="手续费" show-overflow-tooltip align="center">
					<template scope="scope">
						<span>- ¥{{scope.row.commission | fmoney}}</span>
					</template>
				</el-table-column>
				<el-table-column label="最终到账" show-overflow-tooltip align="center">
					<template scope="scope">
						<span>¥{{scope.row.realAmount | fmoney}}</span>
					</template>
				</el-table-column>
                <el-table-column label="单据号" prop="payNo" align="center"></el-table-column>
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
				if (this.$route.query.startTime!=='null'&&this.$route.query.endTime!=='null') {
					this.form.timeRange = [this.$route.query.startTime*1,this.$route.query.endTime*1]
					this.startCreateTime = this.$route.query.startTime*1
					this.endCreateTime = this.$route.query.endTime*1
					let	body = Object.assign({gateId:this.$route.query.gateId||null},{startCreatedTime: this.startCreateTime,endCreatedTime: this.endCreateTime})
					this.gateOrderList(body)
				}else{
					this.gateOrderList(Object.assign({gateId:this.$route.query.gateId||null},{startCreatedTime: null,endCreatedTime: null}))
				}
			})
		},
		methods: {
			//anon/cbs/pay/ gateOrderList1.26网关单查询
			gateOrderList(body){
				axiosApi('/anon/cbs/pay/gateOrderList',body,(res)=>{
					({elements:this.data,totalCount:this.total} = res.data.data);
				},this.currentPage,10)
			},
			//时间搜索
			searchTime() {
				this.gateOrderList(Object.assign({gateId:this.$route.query.gateId||null},{startCreatedTime: this.startCreateTime,endCreatedTime: this.endCreateTime}))
			},
			//查询按钮
			handleSearch(type) {
				this.setCreateTime(type)
				this.searchTime()
			},
			/*当前页改变*/
			handleCurrentChange(val) {
				this.currentPage = val
				this.searchTime()
			},
			setCreateTime(type) {
				switch(type) {
					case 0:
						if (this.form.timeRange) {  //清空会得到 undefined,需要判断是否存在
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
						}else{
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
				this.form.timeRange = [this.startCreateTime,this.endCreateTime]
				this.currentPage = 1
			},
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