<template>
	<div>
		<div class="title-menu">
			<div class="clearfix">
				<el-breadcrumb class="fl">
					<el-breadcrumb-item>回收站</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<el-tabs v-model="activeTab" class='clearfix'>
				<el-tab-pane v-for="item in tabsData" :label="item.val" :name="item.id" key="$index">

				</el-tab-pane>
			</el-tabs>
		</div>
		<!--插入页面-->
		<div id="recycle-content-div" class='clearfix ptrl-30'>
			<el-form :inline="true" :model="formInlineData" class="clearfix">
				<div style="width:70%" class="fl">
					<el-form-item label="商家编号:">
						<el-input placeholder="请输入商家编号" v-model.trim="formInlineData.traderNumber"></el-input>
					</el-form-item>
					<el-form-item label="商家名称:">
						<el-input placeholder="请输入商家名称" v-model.trim="formInlineData.storeName"></el-input>
					</el-form-item>
					<el-form-item label="用户名:">
						<el-input placeholder="请输入商家名称" v-model.trim="formInlineData.loginName"></el-input>
					</el-form-item>
					<el-form-item label="商家类型:">
						<el-select v-model="formInlineData.traderType" placeholder="请选择状态">
							<el-option label="全部类型" value=""></el-option>
							<el-option label="普通商家" value="1"></el-option>
							<el-option label="品牌商" value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="商家状态:">
						<el-select v-model="formInlineData.isDisable" placeholder="请选择状态">
							<el-option label="全部状态" value=""></el-option>
							<el-option label="启用" value="0"></el-option>
							<el-option label="停用" value="1"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<el-button type="primary" class="supplier-check-btn fl" @click="loading(1)">查 询</el-button>
			</el-form>
			<div class="supplier-table-div">
				<div class="tar pr-30 mb-20">
					<el-button type='text' @click='returnInfo'>批量恢复</el-button>
				</div>
				<el-table :data="supplierTableData" stripe v-loading="supplierLoading" @selection-change="handleSelectionChange">
					<!-- 供货商列表-->
					<el-table-column type='selection' width="55"></el-table-column>
					<el-table-column label="商家编号" prop="traderNumber">
					</el-table-column>
					<el-table-column label="商家名称" prop="storeName">
					</el-table-column>
					<el-table-column label="用户名" prop="loginName">
					</el-table-column>
					<el-table-column label="联系人" prop="linkname">
					</el-table-column>
					<el-table-column label="联系电话" prop="tel">
					</el-table-column>
					<el-table-column label="认证类型" prop="traderType">
						<template scope="scope">
							{{scope.row.traderType == 1?"普通商家":"品牌商"}}
						</template>
					</el-table-column>
					<el-table-column label="状态" prop="isDisable">
						<template scope="scope">
							已删除
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template scope='scope'>
							<el-button type="text" @click="loading(2,scope.row.id)">恢复</el-button>
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
	import { axiosApi, basePath } from '../../api/api'; // 导入API
	export default {
		data() {
			return {
				tabsData: [{
					id: '3',
					val: '全部商家'
				}],
				formInlineData: {
					traderNumber: '',
					loginName: '',
					storeName: '',
					isDisable: '',
					traderType: ''
				},
				activeTab: '3', //都是数字
				supplierTableData: [], //供货商管理的列表
				currentPage: 1,
				total: 0,
				supplierLoading: false, // 控制数据的显示
				multipleSelection: []
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.loading(1)
			})
		},
		methods: {
			callback(res) {
//				console.log(res)
				this.supplierTableData = res.data.data.elements;
				this.currentPage = res.data.data.pageIndex;
				this.total = res.data.data.totalCount;
				this.supplierLoading = false;
			},
			deleteTrader(res) {
				this.$message({
					type: 'success',
					message: '操作成功！',
					duration: 1000
				})
				this.supplierLoading = false;
				this.loading(1)
			},
			handleSelectionChange(val) { //table 选中行
				this.multipleSelection = val
			},
			loading(type, id, body, instance, done) {
				this.supplierLoading = true;
				if(type == 1) {
					const api1 = "/trader/findAllTrader/select";
					const body1 = {
						traderNumber: this.formInlineData.traderNumber,
						loginName: this.formInlineData.loginName,
						storeName: this.formInlineData.storeName,
						isDisable: this.formInlineData.isDisable,
						traderType: this.formInlineData.traderType,
						isDelete: 1
					};
					axiosApi(api1, body1, this.callback, this.currentPage, 10);
				}
				if(type == 2) {
					const api2 = "/trader/deleteTrader/select";
					let body2 = {};
					if(id == "all") {
						body2 = body;
						instance.confirmButtonLoading = false;
						done()
						this.deleteTrader();
					} else {
						body2 = {
							id: id,
							isDelete: 0
						};
						body2 = [body2];
					}
					axiosApi(api2, body2, this.deleteTrader, 1, 10);
				}
			},
			returnInfo() {
				let body = [];
				let that = this;
				let h = this.$createElement;
				if(this.multipleSelection.length > 0) {
					this.multipleSelection.forEach((item) => {
						let temp = {
							id: item.id,
							isDelete: 0
						}
						body.push(temp)
					})
					this.$msgbox({
						title: '提示信息',
						message: 
						 h('p', null, [
						h('p', null, '确定执行该操作？'),
						]),
						showCancelButton: true,
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
						beforeClose: (action, instance, done) => {
							if(action === 'confirm') {
								instance.confirmButtonLoading = true;
								instance.confirmButtonText = '执行中...';
								that.loading(2, "all", body, instance, done);
							} else {
								done();
							}
							delete instance.$slots.default;
						}
					})
				} else {
					this.$message({
						type: 'info',
						message: '请选中要恢复的数据',
						duration: 1000
					})
				}
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.loading(1);
			},
			handleSearch() {
				if(this.currentPage === 1){
					this.loading(1);
				}else{
					this.currentPage = 1;
				}
				
			}
		},

	}
</script>

<style>
	#recycle-content-div .el-button--text {
		width: auto;
		height: auto;
	}
	
	#recycle-content-div .el-form--inline .el-form-item__label {
		/* 搜索框label 的字体是12px */
		width: 75px;
		font-size: 12px;
	}
	
	#recycle-content-div .el-form--inline .el-input__inner {
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