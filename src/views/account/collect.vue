<template>
	<div id="account-collect">
		<div class="title-menu">
			<div class="clearfix">
				<el-breadcrumb class="fl">
					<el-breadcrumb-item>收支汇总</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<el-tabs v-model="activeTab" class='clearfix' @tab-click="handleTabClick">
				<el-tab-pane label='收入' name='1'></el-tab-pane>
				<el-tab-pane label='支出' name='2'></el-tab-pane>
			</el-tabs>
		</div>
		<div class="content">
			<div class="fw mb-30">总金额：<span class="color-danger font-20 mr-30">1000.1万元</span>总手续费：<span class="color-danger font-20 ">1000.00</span>元</div>
			<el-form :inline="true" :model="form">
				<el-form-item label="时间" >
					<!-- <el-date-picker
				      v-model="form.timeRange"
				      type="daterange"
				      placeholder="选择日期范围">
				    </el-date-picker> -->
					<ysDaterangePicker v-model="form.timeRange"/>
				</el-form-item>
				<el-form-item label="支付渠道" class="form-item2">
					 <el-select v-model="value" placeholder="请选择">
					    <el-option label="所有渠道" value="0"></el-option>
					    <el-option label="支付宝" value="1"></el-option>
					    <el-option label="农业银行" value="2"></el-option>
					 </el-select>
				</el-form-item>
				<el-form-item>
					<el-button type='info'>搜 索</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type='info'>今天</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type='info'>本周</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type='info'>本月</el-button>
				</el-form-item>
			</el-form>
			<el-table>
				<el-table-column label="支付渠道"></el-table-column>
				<el-table-column label="金额"></el-table-column>
				<el-table-column label="手续费"></el-table-column>
				<el-table-column label="操作">
					<template scope="scope">
						<el-button type='text'>明细</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination v-if='total>0' class="tar" :current-page="currentPage" :page-size='10' :total='total' layout="prev , pager, next, jumper" @current-change="handleCurrentChange">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				activeTab:'1', //标签页
				form:{
					timeRange: []
				}, //查询表单
				currentPage:1, //分页当前页
				total:10,  //总条数
			}
		},
		mounted(){
			this.$nextTick(()=>{
				
			})
		},
		methods:{
			/*当前页改变*/
			handleCurrentChange(){
				
			}
		}
	}
</script>

<style lang="less">
	#account-collect{
		.content{padding: 30px;}
		.fw{font-weight: 700;}
		.el-form{
			.form-item2{
				.el-form-item__label{
					width: 60px;
				}
			}
			.el-form-item{margin-right: 30px;}
			.el-form-item__label{font-size: 12px;padding: 0;padding-right: 10px;width: 40px;}
			.el-input__inner{font-size: 12px;}
			.el-date-editor--daterange.el-input{width: 240px;}
		}
	}
</style>