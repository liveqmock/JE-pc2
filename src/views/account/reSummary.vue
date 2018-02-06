<template>
	<div id="re-summary" v-loading="loading">
		<div class="title-menu">
			<div class="clearfix">
				<el-breadcrumb class="fl">
					<el-breadcrumb-item>收支汇总</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</div>
		<div class="content">
            <div class="fw mb-20">
				<span class="mr-50">总金额: <span class="color-danger font-20">{{allMoney||0}}</span>万元</span>
				总手续费：<span class="color-danger font-20">{{allCommission||0 | fmoney}}</span>元
			</div>
			<el-form :inline="true" :model="form">
                <el-form-item label="所有渠道">
					<el-select v-model="form.gateId" clearable>
                        <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.gateName"
                        :value="item.id">
                        </el-option>
                    </el-select>
				</el-form-item>
				<el-form-item label="时间">
					<!-- <el-date-picker v-model="form.timeRange" type="datetimerange" placeholder="选择日期范围">
					</el-date-picker> -->
					<ysDaterangePicker v-model="form.timeRange" type="datetime"/>
				</el-form-item>
				<el-form-item>
					<el-button type='info' class="ml-30" @click="handleSearch(0)">搜 索</el-button>
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
				<el-table-column label="支付渠道" prop="gateName" align="center"></el-table-column>
				<el-table-column label="金额" show-overflow-tooltip align="center">
					<template scope="scope">
						<span>¥{{(scope.row.totalAmount / 10000).toFixed(6)||0}}万元</span>
					</template>
				</el-table-column>
				<el-table-column label="手续费" show-overflow-tooltip align="center">
					<template scope="scope">
						<span>¥{{scope.row.totalCommission||0 | fmoney}}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" show-overflow-tooltip align="center">
					<template scope="scope">
						<el-button type="text" @click="detail(scope.row)">明细</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
    import { axiosApi, basePath } from '../../api/api'; // 导入API
    import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				form: {
                    timeRange: [],
					gateId:null, //支付渠道id
				}, //查询表单
				currentPage: 1, //分页当前页
				total: 10, //总条数
                options: [], //所有渠道list
                fundsType:'1',
                startCreateTime:null, //开始时间
                endCreateTime: null, //结束时间
                selection:[],
                loading:false,
				data:[],
				allMoney:0, //总金额
				allCommission:0 //总手续费
			}
        },
        computed:{
			...mapState('tradingWater',['tradeType'])
        },
        watch:{
            'form.tradeTypeId'(val){
                let arr = this.tradeType.filter(function(item) {
                    return item.value == val;
                })
                this.form.busiTypeId = null
                this.selection = arr.length>0?arr[0].children:[]
            }
        },
		activated() {
			this.gateList();this.searchTime();
		},
		methods: {
			// 1.25网关渠道收支汇总查询
			gateCount(body){
				axiosApi('/anon/cbs/pay/gateCount',body,(res)=>{
					this.data = res.data.data
					if(this.data.length>0){
						this.allMoney = (this.data.map((item)=> item.totalAmount).reduce((x,y)=>x+y) / 10000 ).toFixed(6)
						this.allCommission = this.data.map((item)=> item.totalCommission).reduce((x,y)=>x+y)
					}
				})
			},
			//1.24获取支付渠道列表	anon/cbs/pay/gateList
			gateList(){ 
				axiosApi('/anon/cbs/pay/gateList',{},(res)=>{
					this.options = res.data.data//[{},{}]
				})
			},
			//时间搜索
			searchTime() {
				let body = {}
				if(this.form.gateId !== null && this.form.gateId !== ''){
					body.gateIdLists = [this.form.gateId]
				}
				this.gateCount(Object.assign(body,{startCreatedTime: this.startCreateTime,endCreatedTime: this.endCreateTime}))
			},
			//查询按钮
			handleSearch(type) {
				this.setCreateTime(type)
				this.searchTime()
			},
			setCreateTime(type) {
				switch(type) {
					case 0:
						if (this.form.timeRange) {
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
			detail(row){ //明细
				this.$router.push(basePath+ '/channelPayment?gateId='+row.gateId+'&startTime='+this.startCreateTime+'&endTime='+this.endCreateTime+'&gateName='+row.gateName)
			}
		}
	}
</script>

<style lang="less">
	#re-summary {
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
			.el-form-item__label {
				font-size: 12px;
				padding: 0;
				padding-right: 10px;
				width: 60px;
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