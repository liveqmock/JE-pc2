<template>
	<div id="adManage">
		<div class="title-menu">
			<div class="clearfix">
				<el-breadcrumb class="fl">
					<el-breadcrumb-item>广告管理</el-breadcrumb-item>
				</el-breadcrumb>
				<span class="fr mr-30 font-12 mt-30">
					<el-select size="mini" v-model="selSite" placeholder="请选择站点" @change="checkSite">
					    <el-option v-for="item in siteList" key="$index" :label="item.name" :value="item.id">{{item.name}}
					    </el-option>
					</el-select>
				</span>
			</div>
			<el-tabs  v-model="appType" @tab-click="appTypeChanged()">
				<el-tab-pane label="PC端广告管理" name="1"></el-tab-pane>
				<el-tab-pane label="移动端广告管理" name="2"></el-tab-pane>
			</el-tabs>
		</div>
		<div class="mr-30 ml-30 ad_manage">
			<div v-for="plan in planList">
				<div class="bbd clearfix ">
					<el-tabs class="fl mt-30" v-model="activeTab">
						<el-tab-pane :label="plan.planName" name="1"></el-tab-pane>
					</el-tabs>
					<span class="fl ml-10 mt-40 color-9">已发布了 {{plan.advertisementList.length}} 个广告，还可以发布 {{plan.positionCountMax-plan.advertisementList.length}} 个广告</span>
					<el-button v-if='showButton("ADD",100022)' :disabled="plan.positionCountMax<=plan.advertisementList.length" class="edit-btn mr-0" @click="addAd(plan)">新增广告</el-button>
				</div>
				<div class="mt-20 tab">
					<el-table :data="plan.advertisementList" border style="width: 100%">
						<el-table-column label="广告标题" width="340">
					    	<template scope="scope">
					    		<span>{{scope.row.advertisementName}}</span>
					    	</template>
					    </el-table-column>
					    <el-table-column label="发布时间" width="260">
					    	<template scope="scope">
					    		<span>{{scope.row.gmtCreate | time}}</span>
					    	</template>
					    </el-table-column>
					    <el-table-column label="操作">
					    	<template scope="scope">
					    		<el-button v-if="scope.$index!=0 && showButton('TOP',100022)" type="text" @click.native="handleMoveToTop(plan, scope)">置顶</el-button>
					    		<el-button type="text" v-if='showButton("EDIT",100022)' @click.native="handleEdit(plan, scope)">编辑</el-button>
					    		<el-button type="text" v-if='showButton("DEL",100022)' @click.native="handleDelete(plan, scope)">删除</el-button>
					    	</template>
					    </el-table-column>
					</el-table>
				</div>
			</div>
			
		</div>
	</div>
</template>

<script>
	import { axiosApi, getUrlParam, basePath } from '../../api/api';
	
	export default{
		data(){
			return{
				siteList: [],
				planList: [],
		        selSite: '',
				activeTab:'1',
				appType: '1'
				
			}
		},
		methods:{
			appTypeChanged(tab){
				this.loadPlanList();
			},
			loadSiteList() {
				axiosApi("/unlogin/foundation/site/selectAll", {}, (res)=>{
					if(res.data.data.length>0){
						this.siteList = res.data.data;
						if(this.selSite == "")this.selSite = this.siteList[0].id;
						this.loadPlanList();
					}else{
						this.siteList = []
					}
				});
			},
			sortOnePlan(plan) {
				if (null != plan.advertisementList){
					plan.advertisementList.sort(function(a,b){return a.sort>b.sort?-1:1});
				}else{
					plan.advertisementList = [];
				}
			},
			sortAdList() {
				for (var i=0; i<this.planList.length; ++i) {
					this.sortOnePlan(this.planList[i]);
				}
			},
			loadPlanList() {
//				console.log(this.selSite,'111')
				axiosApi("/foundation/advertisementplan/selectAll", { districtId:this.selSite, appId:2, appType: this.appType }, (res)=>{
//					console.log(res,'广告')
					this.planList = res.data.data.elements;
					this.sortAdList();
				});
			},
			
			deleteAd(plan, indexInPlan, adId){
				axiosApi("/foundation/advertisement/delete", {"ids":[adId]}, (res)=>{
					plan.advertisementList.splice(indexInPlan, 1);
					this.$message({
						type: 'success',
						message: '操作成功',
						duration: 1000
					});
				});
			},
			
			addAd(plan){
				this.$router.push(`${basePath}/editAd?adPlanId=${plan.id}&appType=${this.appType}`);
			},
			handleEdit(plan, scope){
				this.$router.push(basePath+'/editAd/' + scope.row.id + "?adPlanId=" + plan.id);
			},
			handleDelete(plan, scope){
				this.$confirm('此操作将删除通知, 是否继续?', '提示信息', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
				  this.deleteAd(plan, scope.$index, scope.row.id);
				}).catch(() => {
				  this.$message({
					type: 'info',
					message: '已取消删除'
				  });
				});
			},
			//切换站点
			checkSite(){
				sessionStorage.districtId = this.selSite;
				this.loadPlanList();
			},
			
			handleMoveToTop(plan, scope) {
				var newSort = 1 + plan.advertisementList[0].sort;
				scope.row.sort = newSort;
				this.sortOnePlan(plan);
				axiosApi("/foundation/advertisement/update", scope.row, (res)=>{
				});
			}
		},
		activated(){
			this.$nextTick(() => {
				this.loadSiteList();
			})
		}
	}
</script>

<style lang="less">
	#adManage{
		.ad_manage{
			.el-tabs__header{
				padding-left: 0;
			}
			.el-button.is-disabled, .el-button.is-disabled:focus{
				background-color: #fff;
			}
			.is-disabled.edit-btn span{
				color: #999;
			}
			.tab{
				.cell{
					text-align: center;
				}
				.el-button{
					width: auto;
				}
			}
		}
		 
	}
</style>