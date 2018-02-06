<template>
	<div id="branderList">
		<div class="title-menu">
			<div class="clearfix">
				<el-breadcrumb class="fl">
					<el-breadcrumb-item>品牌商</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<el-tabs v-model="activeTab" class='clearfix' @tab-click="handleTabClick">
				<el-tab-pane v-for="item in tabsData" :label="item.val" :name="item.id" key="$index">

				</el-tab-pane>
			</el-tabs>
		</div>
		<!--插入页面-->
		<el-badge class="mark" :max="99" :value="Integer"/>
		<div id="merchant-content-div" class='clearfix ptrl-30'>
			<el-form :inline="true" :model="formInlineData" class="clearfix">
				<div style="width:70%" class="fl">
					<el-form-item label="商家编号:">
						<el-input placeholder="请输入商家编号" v-model.trim="formInlineData.traderNumber"></el-input>
					</el-form-item>
					<el-form-item label="商家名称:">
						<el-input placeholder="请输入商家名称" v-model.trim="formInlineData.storeName"></el-input>
					</el-form-item>
					<el-form-item label="用户名:">
						<el-input placeholder="请输入用户名" v-model.trim="formInlineData.loginName"></el-input>
					</el-form-item>
					<el-form-item label="商家状态:" v-if="activeTab=='3'">
						<el-select v-model="formInlineData.isDisable" placeholder="请选择状态">
							<el-option label="全部状态" value=""></el-option>
							<el-option label="正常" value="0"></el-option>
							<el-option label="禁用" value="1"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<el-button @click='handleSearch' type="info" class="supplier-check-btn fl">查询</el-button>
			</el-form>
			<div class="supplier-table-div">
				<!--<div style="padding-right:30px;margin-bottom:20px;" class="tar"  v-if="activeTab=='3'">
					<span class="cursor mr-20">
            			<el-button type='text' @click='handleDeleteTrader'>批量删除</el-button>
	            	</span>
						<span class="cursor">
	            		<el-button type='text' @click='goRecycle'>回收站</el-button>
	            	</span>
				</div>-->
				<el-table :data="tableData" stripe v-loading="loading" @selection-change="handleSelectionChange">
					<!-- 供货商列表-->
					<el-table-column type='selection' v-if="activeTab=='3'"></el-table-column>
					<el-table-column label="商家编号" prop="traderNumber">
					</el-table-column>
					<el-table-column label="商家名称" prop='storeName' show-overflow-tooltip>
					</el-table-column>
					<el-table-column label="用户名" prop='loginName' width="120px">
					</el-table-column>
					<el-table-column label="联系人" prop='linkname'>
					</el-table-column>
					<el-table-column label="联系电话" prop='tel' width="120px">
					</el-table-column>
					<el-table-column label="认证类型">
						<template scope='scope'>{{scope.row.traderType=='1'?'普通商户':'品牌商'}}</template>
					</el-table-column>
					<el-table-column label="状态">
						<template scope='scope'>
							<span v-if="scope.row.state=='2'">{{scope.row.isDisable=='1'?'禁用':'正常'}}</span>
							<span v-else>{{scope.row.state=='1'?'待审核':'未通过'}}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center">
						<template scope='scope'>
							<div v-if="scope.row.state=='2'">
								<div>
									<router-link :to="`${basePath}/branderList/merchantEdit/${scope.row.id}`">
										<el-button v-if='showButton("EDIT",100008)' type='text'>编 辑</el-button>
									</router-link>
								</div>
								<!--<div class="mb-10"><el-button type='text' @click.native='handleEdit(scope.row)' >编 辑</el-button></div>
								<div><el-button type='text' @click.native='handleDelete(scope.row)' >删 除</el-button></div>-->
							</div>
							<div v-else>
								<router-link :to="scope.row.state=='1'?`${basePath}/merchant/brandCheck/${scope.row.id}/${scope.row.certId}`:`${basePath}/merchant/brandDetail/${scope.row.id}/${scope.row.certId}`">
									<el-button v-if='showButton("AUDIT",100008)' type='text' @click='handleLook(scope.row)'>{{scope.row.state=='1'?'审核':'查看'}}</el-button>
								</router-link>
							</div>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination v-if='total>0' class="tar" :current-page.sync="currentPage" :page-size='10' :total='total' layout="prev , pager, next, jumper" @current-change="handleCurrentChange">
					<!-- 分页组件 -->
				</el-pagination>
			</div>
		</div>

	</div>
</template>
<script>
	import { axiosApi, basePath } from '../../api/api'; // 导入API
	export default {
		data() {
			return {
				tabsData: [{
						id: '3',
						val: '全部品牌商'
					},
					{
						id: '2',
						val: '待审核'
					},
					{
						id: '1',
						val: '未通过'
					}
				],
				formInlineData: {
					traderNumber: '', //N  商家编号
					storeName: '', //N  商户名称
					loginName: '', //N  用户名
					traderType: '', //N  商家类型  1普通 2 品牌
					isDisable: '', //N  isDisable是否禁用   0正常 1禁用
					state: '', // N  审核状态  1待审核2审核通过3审核未通过
					isDelete: '0' // Y  是否删除 只有回收站列表时传1，其它列表传0  
				},
				activeTab: '3', //都是数字
				tableData: [], //全部商户管理的列表
				currentPage: 1,
				total: 0,
				isPagination: false, //分页 显示 控制
				isDisable: {},
				loading: false, // 控制数据的显示,
				Integer: null, //统计待审核的数量
				multipleSelection: [] //table 选中行
			}
		},
		activated() {
			this.$nextTick(() => {
				if(localStorage.getItem('activeTab')) {
					this.activeTab = localStorage.getItem('activeTab')
					localStorage.removeItem('activeTab')
					if(this.activeTab == '2') { //跳转回来的时候 state 赋值 1
						this.formInlineData.state = '1'
						this.formInlineData.isDisable = '' //切换待审核，未通过状态的时候重置是否禁用
						this.findBrandingBusiness()
					}
					if(this.activeTab == '1') {
						this.formInlineData.state = '3'
						this.formInlineData.isDisable = '' //切换待审核，未通过状态的时候重置是否禁用
						this.findBrandingBusiness()
					}
					if(this.activeTab == '3') {
						this.findAllTrader() //全部商家调用
					}
				}
				if(this.activeTab == '3') {
					this.findAllTrader() //全部商家调用
				}
				this.countBrandingBusinessByState()

			})
		},
		methods: {
			findAllTrader() { //平台：全部商家（包括待审核，未通过，品牌商，回收站及模糊查询）接口
				const api = '/trader/findAllTrader/select'
				this.formInlineData.traderType = 2 //搜索全部的品牌商
				let body = this.formInlineData
				this.loading = true
				if(this.activeTab == '3') {
					this.formInlineData.state = '2'
				}
				axiosApi(api, body, this.findAllTraderCallback, this.currentPage, 10)
			},
			findAllTraderCallback(res) { //平台：全部商家 回调函数
				//				console.log('品牌商', res)
				this.tableData = res.data.data.elements
				this.total = res.data.data.totalCount
				this.loading = false
			},

			findBrandingBusiness() { //平台：品牌商》待审核，未通过的列表接口
				const api = '/trader/findBrandingBusiness/select'
				this.loading = true
				let body = this.formInlineData
				axiosApi(api, body, (res) => {
					//					console.log(res)
					this.tableData = res.data.data.elements
					this.total = res.data.data.totalCount
					this.loading = false
				}, this.currentPage, 10)
			},
			countBrandingBusinessByState() { //平台：品牌商》待审核数
				const api = '/trader/countBrandingBusinessByState/select'
				this.formInlineData.state = '1'
				this.formInlineData.traderType = null
				let body = this.formInlineData
				axiosApi(api, body, (res) => {
					this.Integer = res.data.data
				}, this.currentPage, 10)
			},
			handleTabClick(tab) { //标签页切换函数
				//				console.log(tab.name)
				this.currentPage = 1
				this.formInlineData = {
					traderNumber: '', //N  商家编号
					storeName: '', //N  商户名称
					loginName: '', //N  用户名
					traderType: '', //N  商家类型  1普通 2 品牌
					isDisable: '', //N  isDisable是否禁用   0正常 1禁用
					state: '', // N  审核状态  1待审核2审核通过3审核未通过
					isDelete: '0' // Y  是否删除 只有回收站列表时传1，其它列表传0  
				}
				if(tab.name == '3') {
					this.formInlineData.state = ''
					this.findAllTrader()
				}
				if(tab.name == '2') { //待审核
					this.formInlineData.state = '1'
					this.formInlineData.isDisable = ''
					this.formInlineData.traderType = null
					this.findBrandingBusiness()
				}
				if(tab.name == '1') { //未通过
					this.formInlineData.state = '3'
					this.formInlineData.isDisable = ''
					this.formInlineData.traderType = null
					this.findBrandingBusiness()
				}
				this.countBrandingBusinessByState()
			},
			handleSearch() {
				if(this.currentPage === 1){
					if(this.activeTab == '3') {
						this.findAllTrader()
					} else {
						this.findBrandingBusiness()
					}
					this.countBrandingBusinessByState()
				}else{
					this.currentPage = 1;
				}
				
			},
			handleCurrentChange(val) { // 处理 改变当前页
				this.currentPage = val
				if(this.activeTab == '3') {
					this.findAllTrader()
				} else {
					this.findBrandingBusiness()
				}
				this.countBrandingBusinessByState()
			},
			handleLook(row) { //品牌商未通过查看
				//审核
				if(row.state == '1') {
					this.$router.push(`${basePath}/merchant/brandCheck/${row.id}/${row.certId}`)
				} else {
					this.$router.push(`${basePath}/merchant/brandDetail/${row.id}/${row.certId}`)
				}
			},
			handleDeleteTrader() { //商家批量删除函数

				let body = []
				let that = this
				let h = this.$createElement;
				if(this.multipleSelection.length > 0) {
					this.multipleSelection.forEach((item) => {
						let temp = {
							id: item.id,
							isDelete: '1'
						}
						body.push(temp)
					})
					this.$msgbox({
						title: '提示信息',
						message: h('p', null, [
							h('p', null, '删除后数据会进去回收站，确定删除？'),
						]),
						showCancelButton: true,
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
						beforeClose: (action, instance, done) => {
							if(action === 'confirm') {
								instance.confirmButtonLoading = true;
								instance.confirmButtonText = '执行中...';
								that.deleteTrader(body, instance, done)
							} else {
								done();
							}
							delete instance.$slots.default;
						}
					})
				} else {
					this.$message({
						type: 'info',
						message: '请选中要删除的数据',
						duration: 1000
					})
				}

			},
			deleteTrader(body, instance, done) { //平台：商家删除
				const api = '/trader/deleteTrader/select'
				axiosApi(api, body, (res) => {
					//					console.log('删除', res)
					instance.confirmButtonLoading = false;
					done()
					this.$message({
						type: 'success',
						message: '操作成功',
						duration: 1000
					})
					this.findAllTrader()
				})
			},
			handleDelete(row) { //商家删除函数
				let that = this
				let h = this.$createElement;
				this.$msgbox({
					title: '提示信息',
					message: h('p', null, [
						h('p', null, '删除后此条数据会进去回收站，确定删除？'),
					]),
					showCancelButton: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					beforeClose: (action, instance, done) => {
						if(action === 'confirm') {
							instance.confirmButtonLoading = true;
							instance.confirmButtonText = '执行中...';
							that.deleteTrader([{
								id: row.id,
								isDelete: '1'
							}], instance, done)
						} else {
							done();
						}
						delete instance.$slots.default;
					}
				})
			},
			handleSelectionChange(val) { //table 选中行
				//				console.log(val)
				this.multipleSelection = val
			},
			goRecycle() {
				this.$router.push(`${basePath}/merchant/recycle`)
			}

		},

	}
</script>

<style>
	#branderList .el-badge__content {
		position: relative;
		bottom: 40px;
		left: 195px;
	}
	
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
	
	.supplier-table-div .el-table {
		margin-bottom: 20px;
	}
</style>