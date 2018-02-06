<template>
	<div id="allMerchantList">
		<div class="title-menu">
			<div class="clearfix">
				<el-breadcrumb class="fl">
					<el-breadcrumb-item>商家管理</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<el-tabs v-model="activeTab" class='clearfix' @tab-click="handleTabClick">
				<el-tab-pane label='全部商家' name='3'></el-tab-pane>
				<el-tab-pane label='待审核' name='2'></el-tab-pane>
				<el-tab-pane label='未通过' name='1'></el-tab-pane>
			</el-tabs>
		</div>
		<!--插入页面-->
		<el-badge class="mark" :max="99" :value="Integer" />
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
					<el-form-item label="商家类型:">
						<el-select v-model="formInlineData.traderType" placeholder="请选择状态">
							<el-option label="全部类型" value=""></el-option>
							<el-option label="普通商家" value="1"></el-option>
							<el-option label="品牌商" value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="商家状态:" v-if="activeTab=='3'">
						<el-select v-model="formInlineData.isDisable" placeholder="请选择状态">
							<el-option label="全部状态" value=""></el-option>
							<el-option label="正常" value="0"></el-option>
							<el-option label="禁用" value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="营业状态:" v-if="activeTab=='3'">
						<el-select v-model="formInlineData.businessStatus" placeholder="请选择状态">
							<el-option label="全部" value=""></el-option>
							<el-option label="营业中" :value="0"></el-option>
							<el-option label="打烊中" :value="1"></el-option>
							<el-option label="已关闭" :value="2"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<el-button @click='handleSearch' type="info" class="supplier-check-btn fl">查询</el-button>
			</el-form>
			<div class="supplier-table-div">
				<!--<div style="padding-right:30px;margin-bottom:20px;" class="tar" v-if="activeTab=='3'">
					<span class="cursor mr-20">
            			<el-button type='text' @click='handleDeleteTrader'>批量删除</el-button>
            		</span>
					<span class="cursor">
            			<el-button type='text' @click='goRecycle'>回收站</el-button>
            		</span>
				</div>-->
				<el-table :key="mkey" :data="tableData" stripe v-loading="loading" @selection-change="handleSelectionChange">
					<!-- 供货商列表-->
					<el-table-column type='selection' whdth="50px" v-if="activeTab=='3'"></el-table-column>
					<el-table-column label="商家编号" prop="traderNumber">
					</el-table-column>
					<el-table-column label="商家名称" prop='storeName' show-overflow-tooltip>
					</el-table-column>
					<el-table-column label="用户名" prop='loginName' width="120px">
					</el-table-column>
					<el-table-column v-if="activeTab=='3'" label="营业状态" prop='businessStatus'>
						<template scope='scope'>
							<span v-if="scope.row.businessStatus === 0">营业中</span>
							<span v-if="scope.row.businessStatus === 1">打烊中</span>
							<span v-if="scope.row.businessStatus === 2">已关闭</span>
						</template>
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
								<router-link :to="`${basePath}/merchant/merchantEdit/${scope.row.id}`">
									<el-button v-if='showButton("EDIT",100007)' type='text'>编 辑</el-button>
								</router-link>
							</div>
							<!--<div class="mb-10"><el-button type='text' @click.native='handleEdit(scope.row)' >编 辑</el-button></div>
								<div><el-button type='text' @click.native='handleDelete(scope.row)' >删 除</el-button></div>-->
							<div v-else>
								<router-link :to="scope.row.state==1?`${basePath}/merchant/merchantEdit/${scope.row.id}/${scope.row.state}`:`${basePath}/merchant/merchantDetail/${scope.row.id}`">
									<el-button v-if='showButton("AUDIT",100007)' type='text'>{{scope.row.state=='1'?'审核':'查看'}}</el-button>
								</router-link>
							</div>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination v-if='total>0' class="tar" :current-page="currentPage" :page-size='10' :total='total' layout="prev , pager, next, jumper" @current-change="handleCurrentChange">
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
				formInlineData: {
					traderNumber: '', //N  商家编号
					storeName: '', //N  商户名称
					loginName: '', //N  用户名
					traderType: '', //N  商家类型  1普通 2 品牌
					isDisable: '', //N  isDisable是否禁用   0正常 1禁用
					state: '', // N  审核状态  1待审核2审核通过3审核未通过
					isDelete: '0', // Y  是否删除 只有回收站列表时传1，其它列表传0  
					businessStatus: '', // 0 营业中 1 打样中 2 关闭中  '' 全部
				},
				mkey: +new Date(),
				activeTab: '3', //都是数字
				tableData: [], //全部商户管理的列表
				currentPage: 1,
				total: 0,
				isPagination: false, //分页 显示 控制
				isDisable: {},
				loading: false, // 控制数据的显示，
				multipleSelection: [], //table 选中行
				Integer: null //统计待审核的数量
			}

		},
		activated() {
			this.$nextTick(() => {
				// if(localStorage.getItem('activeTab')) {
				// 	this.activeTab = localStorage.getItem('activeTab')
				// 	localStorage.removeItem('activeTab')
				// }
				this.findAllTrader()
				this.countTraderByType()
				this.mkey = +new Date();
			})
		},
		methods: {
			countTraderByType() { //平台：全部商家或品牌商》待审核数量
				const api = '/trader/countTraderByType/select'
				let body = this.formInlineData
				this.formInlineData.state = '1'
				axiosApi(api, body, (res) => {
					//					console.log(res,'数量角标')
					this.Integer = res.data.data
				})
			},
			findAllTrader() { //平台：全部商家（包括待审核，未通过，品牌商，回收站及模糊查询）接口
				const api = '/trader/findAllTrader/select'
				let body = this.formInlineData
				this.loading = true
				if(this.activeTab == '3') {
					this.formInlineData.state = '2'
				}
				axiosApi(api, body, this.findAllTraderCallback, this.currentPage, 10)
			},
			findAllTraderCallback(res) { //平台：全部商家 回调函数
				//				console.log('全部商户', res)
				this.tableData = res.data.data.elements
				this.total = res.data.data.totalCount
				this.loading = false
			},
			handleTabClick(tab) { //标签页切换函数
				this.formInlineData = {
					traderNumber: '', //N  商家编号
					storeName: '', //N  商户名称
					loginName: '', //N  用户名
					traderType: '', //N  商家类型  1普通 2 品牌
					isDisable: '', //N  isDisable是否禁用   0正常 1禁用
					state: '', // N  审核状态  1待审核2审核通过3审核未通过
					isDelete: '0', // Y  是否删除 只有回收站列表时传1，其它列表传0  
					businessStatus: '',
				}
				if(tab.name == '3') {
					this.formInlineData.state = ''
				}
				if(tab.name == '2') { //待审核
					this.formInlineData.isDisable = ''
					this.formInlineData.state = '1'
				}
				if(tab.name == '1') { //未通过
					this.formInlineData.isDisable = ''
					this.formInlineData.state = '3'
				}
				this.currentPage = 1
				this.findAllTrader()
				this.countTraderByType()
				this.mkey = +new Date();
			},
			handleCurrentChange(val) { // 处理 改变当前页
				this.currentPage = val
				this.findAllTrader()
				this.countTraderByType()
			},
			handleSearch() {
				if(this.currentPage === 1){
					this.findAllTrader()
					this.countTraderByType()
				}else{
					this.currentPage = 1;
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
					this.countTraderByType()
				})
			},
			handleSelectionChange(val) { //table 选中行
				//				console.log(val)
				this.multipleSelection = val
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
			handleLook(row) { //详情
				if(row.state == '1') {
					this.$router.push(`${basePath}/merchant/merchantEdit/${row.id}/${row.state}`)
				} else {
					this.$router.push(`${basePath}/merchant/merchantDetail/${row.id}`)
				}

			},
			goRecycle() {
				this.$router.push(`${basePath}/merchant/recycle`)
			}
		},
	}
</script>

<style lang='less'>
	#allMerchantList {
		.el-badge__content {
			position: relative;
			bottom: 40px;
			left: 180px;
		}
		.el-button--text {
			width: auto;
			height: auto;
		}
		.el-form--inline .el-form-item__label {
			/* 搜索框label 的字体是12px */
			width: 75px;
			font-size: 12px;
		}
		.el-form--inline .el-input__inner {
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
	}
</style>