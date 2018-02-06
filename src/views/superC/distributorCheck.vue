<template>
<!-- 分销商审核 -->
	<div id="distributorCheck">
		<div class="title-menu">
			<div class="clearfix">
				<el-breadcrumb class="fl">
					<el-breadcrumb-item>分销商审核</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<el-tabs v-model="type" class='clearfix' @tab-click="handleTabs">
				<el-tab-pane :label='g.label' :name='g.val' v-for="g in dataTabs" key="$index"></el-tab-pane>
			</el-tabs>
		</div>
		<div class="content pl-20 pr-20 mt-5 bg-f">
			<el-form :inline="true" :model="form" ref="searchForm" label-width="70px" class="pl-20 clearfix pt-30">
				<div class="fl">
					<el-form-item label="申请时间">
						<el-date-picker
					      v-model="form.addDateRange"
					      type="daterange"
					      placeholder="选择时间范围"
					      :picker-options="pickerOptions">
					    </el-date-picker>
					</el-form-item>
					<el-form-item label="账号" prop="account" :rules="[{pattern:/^[1]\d{10}$/,message:'请输入正确手机号',trigger:'blur'}]">
						<el-input :maxlength="11" v-model.trim="form.account" placeholder="请输入久集账号"></el-input>
					</el-form-item>
				</div>
				<el-button type="info" class="fl ml-50" @click='search()'>搜索</el-button>
			</el-form>
			<div class="clearfix  mb-10" style="overflow: hidden;">
				<el-button class='fr' type="text" @click="exportExcel">导出</el-button>
			</div>
			<el-table :data="tableData" stripe v-loading="Loading" class="table-default" style="width: 100%">
			    <el-table-column prop="loginName" label="账号" width="120"></el-table-column>
			    <el-table-column prop="employeeName" label="姓名" width="120"></el-table-column>
			    <el-table-column prop="storeName" label="店铺名" width="120"></el-table-column>
			    <el-table-column label="申请说明" width="120">
			    	<template scope="scope">
			    		<el-button @click="lookApplyExplain(scope.row)" type="text">查看</el-button>
			    	</template>
			    </el-table-column>
			    <el-table-column label="合同" width="100">
			    	<template scope="scope">
			    		<el-button @click="lookContract(scope.row)" type="text">查看</el-button>
			    	</template>
			    </el-table-column>
			    <el-table-column label="申请时间" width="130">
			    	<template scope="scope">
				    	<div>{{timeFormat(Number(scope.row.gmtCreate))}}</div>
				    </template>
			    </el-table-column>
			    <el-table-column label="状态" width="120">
			    	<template scope="scope">
			    		<div v-if="scope.row.state==1">待审核</div>
			    		<div v-if="scope.row.state==2">已通过</div>
			    		<div v-if="scope.row.state==3">已驳回</div>
			    		<div v-if="scope.row.state==4">已禁用</div>
			    	</template>
			    </el-table-column>
			    <el-table-column label="操作" width="">
			    	<template scope="scope">
			    			<span v-if="scope.row.state == 1">
	                       		<el-button type="text" @click="handlePass(scope.row)">通过</el-button>
		                       	<el-button type="text" @click="handleReject(scope.row)">驳回</el-button>
	                       </span>
	                       <span v-if="scope.row.state == 2">
		                       	<el-button type="text" @click="handleDis(scope.row)">禁用</el-button>
	                       </span>
	                       </span>
	                       <span v-if="scope.row.state == 4">
	                       		<el-button type="text" @click="handleEnable(scope.row)">启用</el-button>
	                       </span>
	                       <span v-if="scope.row.state == 3">-</span>
	                    </template>
			    </el-table-column>
			</el-table>
			<!-- 分页组件 -->
            <el-pagination  class="tar mt-20 mr-50" :current-page="currentPage" :page-size='10' :total='total' layout="prev , pager, next, jumper" v-if="total>0" @current-change="handleCurrentChanges"
                ></el-pagination>
            <!-- 申请说明弹窗 -->
            <el-dialog size="small" title="申请说明" class="dia" v-model="applyExplainDia">
				<div>{{applyExplain}}</div>
			</el-dialog>
            <!-- 合同弹窗 -->
            <el-dialog size="small" title="合同" class="dia" v-model="contractDia">
				<div v-html="contract"></div>
			</el-dialog>
			<!-- 驳回弹窗 -->
			<el-dialog class="reject" title='驳回' v-model='reject'>
				<el-form ref="rejectForm" class="pr-30"  :model="rejectForm" :rules="rules1">
					<el-form-item class="ml-40" prop="reason">
						<el-input type='textarea' :autosize="{ minRows: 3 ,maxRows: 10}" :maxlength="100" placeholder='请输入驳回理由..' v-model.trim='rejectForm.reason'></el-input>
					</el-form-item>
				</el-form>
				<div slot='footer' class="dialog-footer">
					<el-button type='danger' @click="ensureReject">确定</el-button>
					<el-button @click="reject = false">取消</el-button>
				</div>
			</el-dialog>
		</div>
		<!--导出-->
		<form ref="exportList" action='/sunrise-gateway/export/superc/apply' style="display: none">
			<input type="text" name="startRow" v-model="a">
			<input type="text" name="startCol" v-model="a">
			<input type="text" v-if="form.account" name="loginName" v-model="form.account">
			<input type="text" v-if="form.startTime" name="startTime" v-model="form.startTime">
			<input type="text" v-if="form.endTime" name="endTime" v-model="form.endTime">
			<input type="text" name="fileName" v-model="fileName">
			<input type="text" name="modelName" v-model="modelName">
		</form>
	</div>
</template>
<script>
	import { axiosApi } from '../../api/api'
	export default {
		data(){
			return {
				a: 0,
				fileName: null,
				modelName: 'superc.apply',
				dataTabs: [{label:'全部',val:'0'},{label:'待审核',val:'1'},{label:'已通过',val:'2'},{label:'已驳回',val:'3'},{label:'已禁用',val:'4'}],
				type: '0',
				form:{
					addDateRange:[],
					account:null,
					startTime:null,
					endTime:null
				},
				tableData:[],
				currentPage: 1,
        		total: 1,
        		Loading:false,
        		applyExplain:null,
        		contract:null,
        		applyExplainDia:false,
        		contractDia:false,
        		employeeName:null,
        		pickerOptions: {
					disabledDate(time) {
						let beginDateVal = new Date();
						return time.getTime() > beginDateVal;
					}
				},
				reject:false,
				rejectItem:null,
				rejectForm:{reason:null},
				rules1:{
					reason:[{required:true,message:'驳回理由必填'},{
						min:4,
						max:100,
						message: '驳回理由为4-100位字符'
					}]
				}

			}
		},
		methods:{
			timeFormat(value){
                var myDate = new Date(value);
                var year = myDate.getFullYear();
                var month = myDate.getMonth() + 1 < 10 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1;
                var day = myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate();
                return year + '-' + month + '-' + day;
            },
            queryList(x){
            	this.Loading = true
				this.form.startTime = this.form.addDateRange[0] == undefined ? null : this.form.addDateRange[0].getTime()
				this.form.endTime = this.form.addDateRange[1] == undefined ? null : this.form.addDateRange[1].getTime()
				this.form.startTime = this.form.startTime == null ? null : this.timeFormat(this.form.startTime);
				this.form.endTime = this.form.endTime == null ? null : this.timeFormat(this.form.endTime);
            	let body = {
            		state:this.type== '0' ? null : this.type,
            		loginName:this.form.account,
            		startTime:this.form.startTime,
            		endTime:this.form.endTime
            	}
            	axiosApi('/superc/traderOpenSuperC/sellerApplyList',body,res=>{
            		this.total=res.data.data.totalCount;
					this.tableData = res.data.data.elements
					this.Loading = false
				},x?x:1,10)
            },
			//tab切换
			handleTabs(tab, event) {
				this.queryList()
			},
			search(){
				this.$refs.searchForm.validate((valid)=>{
					if(valid){
						this.queryList()
					}
				})
			},
			handleCurrentChanges(val) {
				this.currentPage = val
				this.queryList(val);
			},
			lookApplyExplain(item){//查看申请说明
				this.applyExplainDia = true
				this.applyExplain = item.applyExplain ? item.applyExplain : '暂无数据'
			},
			lookContract(item){//查看合同
				this.contractDia = true
				this.contract = item.contract ? item.contract : '暂无数据'
			},
			handlePass(item){//通过
				const h = this.$createElement
				this.$msgbox({
					title: '提示信息',
					message: h('p', {style: 'text-align:center'}, '确认通过该账号？'),
					showCancelButton: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					beforeClose: (action, instance, done) => {
						if(action === 'confirm') {
							const body = {
								id:item.id,
								state:2
							}
							axiosApi('/superc.traderOpenSuperC.audit',body,res=>{
								this.queryList()
							},1,10)
							done()
						} else {
							done()
						}
						delete instance.$slots.default;
					}
				})
			},
			handleReject(item){//驳回
				this.reject = true;
				this.rejectItem = item;
			},
			ensureReject(){//确定驳回提交
				this.$refs.rejectForm.validate(valid=>{
					if(valid){
						//操作
						axiosApi('/superc.traderOpenSuperC.audit',{id:this.rejectItem.id,state:3,reason:this.rejectForm.reason},res=>{
							this.reject = false;
							this.queryList()
						},1,10)
					}
				})
			},
			handleDis(item){//禁用
		        const h = this.$createElement
				this.$msgbox({
					title: '提示信息',
					message: h('p', {style: 'text-align:center'}, '确认禁用该账号？'),
					showCancelButton: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					beforeClose: (action, instance, done) => {
						if(action === 'confirm') {
							const body = {
								id:item.id,
								state:4
							}
							axiosApi('/superc.traderOpenSuperC.audit',body,res=>{
								this.queryList()
							},1,10)
							done()
						} else {
							done()
						}
						delete instance.$slots.default;
					}
				})
			},
			handleEnable(item){//启用
				const h = this.$createElement
				this.$msgbox({
					title: '提示信息',
					message: h('p', {style: 'text-align:center'}, '确认重新启用该账号?'),
					showCancelButton: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					beforeClose: (action, instance, done) => {
						if(action === 'confirm') {
							const body = {
								id:item.id,
								state:2
							}
							axiosApi('/superc.traderOpenSuperC.audit',body,res=>{
								this.queryList()
							},1,10)
							done()
						} else {
							done()
						}
						delete instance.$slots.default;
					}
				})
			},
			exportExcel(){//全部导出
				this.form.startTime = this.form.addDateRange[0] == undefined ? null : this.form.addDateRange[0].getTime();
				this.form.endTime = this.form.addDateRange[1] == undefined ? null : this.form.addDateRange[1].getTime();
				let str = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
				this.fileName = '分销商审核列表_' + str + '.xls'
				
				setTimeout(()=>{
					if(this.tableData.length>0){
						this.$refs.exportList.submit()
					}
				},0)
			}
		},
		mounted(){
			//列表查询
			this.queryList()
		}
	}
</script>
<style lang="less">
	#distributorCheck{
		.content{
			padding-bottom: 50px;
			.el-dialog--small{
				min-height: 300px;
				.el-dialog__body{
					&>div{
						padding:0 20px;
						text-indent: 28px;
					}
				}
			}
		}
	}
</style>