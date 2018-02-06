<template>
	<div id="account-cash-requisition" v-loading="loading">
		<div class="title-menu">
			<div class="clearfix">
				<el-breadcrumb class="fl">
					<el-breadcrumb-item>商家提现申请单</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<el-tabs v-model="activeTab" class='clearfix' @tab-click="handleTabClick">
				<el-tab-pane label='全部' name='0' v-if="showButton('TAKE_PASS',101089)&&showButton('TAKE_WILL',101089)&&showButton('TAKE_SUCCESS',101089)"></el-tab-pane>
				<el-tab-pane label='待审核' name='1' v-if="showButton('TAKE_WILL',101089)"></el-tab-pane>
				<el-tab-pane label='审核未通过' name='2' v-if="showButton('TAKE_WILL',101089)"></el-tab-pane>
				<el-tab-pane label='待打款' name='3' v-if="showButton('TAKE_PASS',101089)"></el-tab-pane>
				<el-tab-pane label='提现成功' name='4' v-if="showButton('TAKE_SUCCESS',101089)"></el-tab-pane>
			</el-tabs>
		</div>
		<div class="content">
			<el-form :inline="true" :model="form">
				<el-form-item label="时间" >
					<!-- <el-date-picker
				      v-model="form.timeRange"
				      type="datetimerange"
				      placeholder="选择日期范围">
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
				<el-table-column label="单据号" prop="cashOrderNo" width="110"></el-table-column>
				<el-table-column label="申请时间" width="110">
					<template scope="scope">{{scope.row.applyTime | time}}</template>
				</el-table-column>
				<el-table-column label="商户名称" prop="storeName" width="120" show-overflow-tooltip></el-table-column>
				<el-table-column label="用户名称" prop="accountUserName" width="120"  show-overflow-tooltip></el-table-column>
				<el-table-column label="银行名称" prop="bankName" width="120" show-overflow-tooltip></el-table-column>
				<el-table-column label="银行卡号" width="110" prop="accountNo"></el-table-column>
				<el-table-column label="可提现金额" width="100" show-overflow-tooltip>
					<template scope="scope">
						<span>¥{{scope.row.balance||0 | fmoney}}</span>
					</template>
				</el-table-column>
				<el-table-column label="提现金额" width="100" show-overflow-tooltip>
					<template scope="scope">
						¥{{scope.row.applyMoney||0 | fmoney}}
					</template>
				</el-table-column>
				<el-table-column label="手续费" width="100" show-overflow-tooltip>
					<template scope="scope">
						<span>¥{{scope.row.commission||0 | fmoney}}</span>
					</template>
				</el-table-column>
				<el-table-column label="最终到账" width="100" show-overflow-tooltip>
					<template scope="scope">
						<span>¥{{scope.row.dealMoney||0 | fmoney}}</span>
					</template>
				</el-table-column>
				<el-table-column label="状态" width="100" show-overflow-tooltip>
					<template scope="scope">
						<span v-if="scope.row.state==1">待审核</span>
						<span v-if="scope.row.state==2">审核未通过</span>
						<span v-if="scope.row.state==3">待打款</span>
						<span v-if="scope.row.state==4">提现成功</span>
					</template>
				</el-table-column>
				<el-table-column label="备注" prop="remark" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" fixed="right" align='center'>
					<template scope="scope">
						<router-link :to="`${basePath}/cashAppAudit`">
							<el-button type="text" v-if="scope.row.state==1" @click="cashAudit(scope.row)">审核</el-button>
						</router-link>
						<el-button v-if="scope.row.state==3" type="text" @click="playMoney(scope.row)">打款</el-button>
						<router-link :to="`${basePath}/cashAppAudit`">
							<el-button type="text" v-if="scope.row.state==2" @click="lookCash(scope.row)">查看</el-button>
						</router-link>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination v-if='total>0' class="tar" :current-page="currentPage" :page-size='10' :total='total' layout="prev , pager, next, jumper" @current-change="handleCurrentChange">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import {axiosApi , basePath} from '../../api/api'
	export default{
		data(){
			return{
				activeTab:'0', //标签页
				form:{timeRange:[]}, //查询表单
				currentPage:1, //分页当前页
				total:10,  //总条数
				data:[],  //提现单数组
				qform:{startCreateTime:null,endCreateTime:null,state:0}, //提现单查询 参数
				loading:false, 
			}
		},
		mounted(){
			if(this.showButton('TAKE_PASS',101089)&&this.showButton('TAKE_WILL',101089)&&this.showButton('TAKE_SUCCESS',101089)) {
				this.activeTab = '0'
			}else if (this.showButton('TAKE_WILL',101089)) {  //待审核
				this.activeTab = '1'
			}else if(this.showButton('TAKE_PASS',101089)){  //待打款
				this.activeTab = '3'
			}else if(this.showButton('TAKE_SUCCESS',101089)){	//提现成功
				this.activeTab = '4'
			}
		},
		activated(){
			this.qform.state = this.activeTab
			this.applyCashQuery(this.qform)
		},
		methods:{
			setCreateTime(type) {
				this.qform.startCreateTime = this.qform.endCreateTime = null
				switch(type) {
					case 0:
						if(this.form.timeRange.length > 0) {
							this.form.timeRange = this.form.timeRange.map((item) => {
								return new Date(item).getTime()
							})
							this.qform.startCreateTime = this.form.timeRange[0]
							this.qform.endCreateTime = this.form.timeRange[1]
						} else {
							this.qform.startCreateTime = this.qform.endCreateTime = null
						}
						break
					case 1:
						this.form.timeRange = []
						this.qform.startCreateTime = this.setStartHours(new Date()).getTime()
						this.qform.endCreateTime = this.setEndHours(new Date()).getTime()
						break
					case 2:
						this.form.timeRange = []
						this.qform.startCreateTime = this.getWeekStartDate().getTime()
						this.qform.endCreateTime = this.getWeekLastDate().getTime()
						break
					case 3:
						this.form.timeRange = []
						this.qform.startCreateTime = this.getMonthFirstDay().getTime()
						this.qform.endCreateTime = this.getMonthLastDay().getTime()
						break
					default:
						break
				}
				this.currentPage = 1
			},
			//查询按钮
			handleSearch(type) {
				this.setCreateTime(type)
				this.applyCashQuery(this.qform)
			},
			//1.14提现单查询
			applyCashQuery(body){
				this.loading = true
				axiosApi('/anon/cbs/pay/applyCashQueryPage',body,(res)=>{
					this.loading = false
					this.data=res.data.data.elements
					this.total = res.data.data.totalCount
				},this.currentPage,10,(res)=>{
					this.loading = false
				})
			},
			//切换 tab
			handleTabClick(){
				this.qform.state = this.activeTab
				this.qform.startCreateTime = null 
				this.qform.endCreateTime = null 
				this.currentPage = 1
				this.applyCashQuery(this.qform)
			},
			/*当前页改变*/
			handleCurrentChange(val){
				this.currentPage = val 
				this.applyCashQuery(this.qform)
			},
			/*打款*/
			playMoney(row){
				let h = this.$createElement;
				this.$msgbox({
					title: '提示信息',
					message:  h('p', {style:'text-align:center'}, '确认要打款吗？'),
					showCancelButton: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					beforeClose: (action, instance, done) => {
						if(action === 'confirm') {
							this.applyCashPlay({'orderNo':row.cashOrderNo})
							done()
						} else {
							done();
						}
						delete instance.$slots.default;
					}
				})
			},
			//1.16提现单打款
			applyCashPlay(body){
				axiosApi('/anon/cbs/pay/applyCashPlay',body,(res)=>{
					this.$message({type:'success',message:'操作成功',duration:1000})
					this.applyCashQuery(this.qform)
				},1,10,(res)=>{
					this.$message({type:'error',message:res.data.message,duration:1000})
				})
			},
			//审核页面
			cashAudit(row){
				sessionStorage.setItem('applyCashDetail',JSON.stringify(row))
			},
			//查看页面
			lookCash(row){
				sessionStorage.setItem('applyCashDetail',JSON.stringify(row))
			},
		}
	}
</script>

<style lang="less">
	#account-cash-requisition{
		.content{padding: 30px;}
		.fw{font-weight: 700;}
		.el-form{
			.el-form-item{margin-right: 30px;}
			.el-form-item__label{font-size: 12px;padding: 0;padding-right: 10px;width: 40px;}
			.el-input__inner{font-size: 12px;}
			.el-date-editor--datetimerange.el-input{width: 240px;}
		}
		.el-button--text{
			width: auto;height: auto;font-size: 12px;
		}
	}
</style>