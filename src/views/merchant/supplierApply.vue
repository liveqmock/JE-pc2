<template>
	<div id="supplier-apply">
		<div class="title-menu">
			<div class="clearfix">
				<el-breadcrumb class="fl">
					<el-breadcrumb-item>品牌商品申请</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<el-tabs v-model="activeTab" class='clearfix' @tab-click="handleTabClick">
				<el-tab-pane v-for="item in tabsData" :label="item.val" :name="item.id" key="$index">

				</el-tab-pane>
			</el-tabs>
		</div>
		<!--插入页面-->
		<el-badge class="mark" :max="99" :value="pendingCount" />
		<div id="merchant-content-div" class='clearfix ptrl-30'>
			<el-form :inline="true" class="clearfix">
				<div style="width:70%" class="fl">
					<el-form-item label="商品名称:">
						<el-input placeholder="请输入商品名称" v-model.trim="spuName"></el-input>
					</el-form-item>
					<el-form-item label="商家名称:">
						<el-input placeholder="请输入商家名称" v-model.trim="storeName"></el-input>
					</el-form-item>
				</div>
				<el-button type="info" class="supplier-check-btn fl" @click="loading(1)">查询</el-button>
			</el-form>
			<div class="supplier-table-div">
				<el-table :data="supplierTableData" v-loading.lock ='applyLoading' stripe>
					<!-- 商品列表-->
					<el-table-column label="申请商品" width="320px">
						<template scope="scope">
							<div class="fl">
								<img v-if="scope.row.defaultPicture" :src="scope.row.defaultPicture" />
								<img v-else src="../../assets/goods.png" alt="" />
							</div>
							<div class="fl w208">
								<div>{{scope.row.spuName}}</div>
								<div class="color-9">建议零售价：{{scope.row.msrp}}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="分类">
						<template scope="scope">
							<div>{{scope.row.classifyName}}</div>
						</template>
					</el-table-column>
					<el-table-column label="品牌">
						<template scope="scope">
							<div>{{scope.row.brandName}}</div>
						</template>
					</el-table-column>
					<el-table-column label="商家信息">
						<template scope="scope">
							<p>{{scope.row.storeName}}</p>
							<p class="mt-10">{{scope.row.loginName}}</p>
						</template>
					</el-table-column>
					<el-table-column label="状态">
						<template scope="scope">
							{{scope.row.status == 1?"待审核":"未通过"}}
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center">
						<template scope="scope">
							<span v-if='showButton("AUDIT",100026)'>
								<router-link :to="`${basePath}/merchant/supplierDetail/${scope.row.id}`">
									<el-button type="text" >{{activeTab == 1?"审核":"查看"}}</el-button>
								</router-link>
							</span>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination v-if="total>0" class="tar" :current-page="currentPage" :page-size='10' :total='total' layout="prev , pager, next, jumper" @current-change="handleCurrentChange">
					<!-- 分页组件 -->
				</el-pagination>
			</div>
		</div>

	</div>
</template>
<script>
	import { axiosApi,basePath } from '../../api/api'; // 导入API
	export default {
		data() {
			return {
				tabsData: [{
						id: '1',
						val: '待审核'
					},
					{
						id: '3',
						val: '未通过'
					}
				],
				storeName: null,
				spuName: null,
				activeTab: '1', //都是数字
				supplierTableData: [], //供货商管理的列表
				currentPage: 1,
				total: 0,
				supplierLoading: false, // 控制数据的显示
				pendingCount:null,
				applyLoading:false,   //loading  Boolean 
			}
		},
		activated() {
			this.$nextTick(() => {
				this.loading(1);
				this.spuAuthorizationCount()
			})
		},
		methods: {
			spuAuthorizationList(res) {
//				console.log(res)
				this.supplierTableData = res.data.data.elements;
				this.currentPage = res.data.data.pageIndex;
				this.total = res.data.data.totalCount;
				this.applyLoading = false
			},
			loading(type, id) {
				this.applyLoading = true
				if(type == 1) {
					const api1 = "/goods/spuAuthorizationList/select"; //列表
					const body1 = {
						status: this.activeTab,
						storeName: this.storeName,
						spuName: this.spuName
					};
					axiosApi(api1, body1, this.spuAuthorizationList, this.currentPage, 10);
				}
			},
			handleTabClick(tab) {
				this.currentPage = 1;
				this.loading(1);
			},
			handleCurrentChange(val) { // 处理 改变当前页
				this.currentPage = val
				this.loading(1);
			},
			
			//未授权的spu件数
			spuAuthorizationCount(){
				const api = '/goods/spuAuthorizationCount/select'
				axiosApi(api,{},(res)=>{
//					console.log(res,'未授权的spu件数')
					this.pendingCount = res.data.data.pendingCount
				},1,10,(res)=>{
//					console.log(res,'未授权的spu件数ERROR')
				})
			}
		},

	}
</script>

<style>
	#merchant-content-div .el-button--text {
		width: auto;
		height: auto;
	}
	#merchant-content-div .el-form--inline .el-form-item__label {
		/* 搜索框label 的字体是12px */
		width: 75px;
		font-size: 12px;
	}
	
	#merchant-content-div .el-form--inline .el-input__inner {
		/* 搜索框的字体是12px */
		font-size: 12px;
	}
	
	.supplier-check-btn {
		margin-left: 40px;
	}
	
	.supplier-table-div {
		margin-top: 10px;
		/*el-form inline  */
	}
	.supplier-table-div .w208{
		width: 208px;
	}
	.supplier-table-div .el-table {
		margin-bottom: 20px;
	}
	#supplier-apply .el-badge__content{
		position: relative;bottom: 40px;left: 90px;
	}
</style>