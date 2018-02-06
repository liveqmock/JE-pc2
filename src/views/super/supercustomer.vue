<template>
	<div id="super-customer">
		<div class="title-top">
			团购商家
			<el-button v-if='showButton("ADD",140001)' class="edit-btn" @click="isAdd = true">新增商家</el-button>
		</div>
		<add-customer v-on:close="handleSearch" :visible.sync="isAdd"></add-customer>
		<div class="p30">
			<el-form :inline="true" :model="formInlineData" class="search clearfix">
				<div style="width:70%" class="fl">
					<el-form-item label="商家账号:">
						<el-input placeholder="请输入商家账号" v-model.trim="formInlineData.loginName"></el-input>
					</el-form-item>
					<el-form-item label="商家名称:">
						<el-input placeholder="请输入商家名称" v-model.trim="formInlineData.storeName" :maxlength="20"></el-input>
					</el-form-item>
					<el-form-item label="团购状态:">
						<el-select v-model="formInlineData.isOpenGroupBuying" placeholder="请选择状态">
							<el-option label="全部状态" value="null"></el-option>
							<el-option label="开启" value="1"></el-option>
							<el-option label="关闭" value="2"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<el-button @click='handleSearch(0)' type="info" class="fl ml-30">查询</el-button>
			</el-form>
			<el-table class="mt-30" :data="tableData" stripe>
				<el-table-column label="商家账号" prop="loginName" width="200px">
				</el-table-column>
				<el-table-column label="商家名称" prop='storeName' show-overflow-tooltip>
				</el-table-column>
				<el-table-column label="状态" width="200px">
					<template scope="scope">
						{{scope.row.isOpenGroupBuying==1?'开启':'关闭'}}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="150px" align="center">
					<template scope='scope'>
						<div>
							<el-button v-if='showButton("CLOSE",140001)' type='text' @click='handleDelete(scope.row,scope.row.isOpenGroupBuying)'>{{scope.row.isOpenGroupBuying=='1'?'关闭':'开启'}}</el-button>
							<el-button v-if='showButton("DEL",140001)' type='text' @click.native='handleDelete(scope.row,0)'>删除</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination v-if='total>0' class="tar" :current-page.sync="currentPage" :page-size='10' :total='total' layout="prev , pager, next, jumper" @current-change="handleSearch">
				<!-- 分页组件 -->
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import { axiosApi, basePath } from "~/api/api"
	import { MessageBox } from 'element-ui';

	export default {
		data() {
			return {
				formInlineData: {
					isOpenGroupBuying: null
				},
				total: 0,
				currentPage: 1,
				tableData: [],
				isAdd: false, //新增商家弹窗
			}
		},
		mounted() {
			this.handleSearch()
		},
		methods: {
			handleSearch(payload) {
				payload==0&&(this.currentPage=1)
				axiosApi("/groupon/bigTrader/selectPageList", {
					loginName: this.formInlineData.loginName,
					storeName: this.formInlineData.storeName,
					isOpenGroupBuying: this.formInlineData.isOpenGroupBuying
				}, res => {
					this.tableData = res.data.data.elements || []
					this.total = res.data.data.totalCount
				}, this.currentPage, 10)
			},
			handleDelete(item, type) {
				//type 0:删除，1：关闭， 2：开通
				let state = ""
				let content = ""
				if(type == 0) {
					state = 0
					content = "确认删除该商户，删除后，团购模块将从商户的菜单列表移除"
				} else if(type == 1) {
					state = 2
					content = "确认关闭团购功能？"
				} else if(type == 2) {
					state = 1
					content = "确认重新开启团购功能？"
				}
				this.$confirm(content, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					axiosApi("/groupon/bigTraderOpenGroup/batchUpdate", {
						traderIds: [item.id],
						isOpenGroupBuying: state
					}, res => {
						this.$message({
							type: 'success',
							message: '操作成功!',
							duration: 1000
						});
						this.handleSearch()
					}, this.currentPage, 10, (res) => {
						if(res.data.code == "SUPERT0015") {
							MessageBox.alert(res.data.message, '提示', {
								confirmButtonText: '确定'
							});
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				})
			}
		}
	}
</script>

<style lang="less">
	#super-customer {
		.el-table {
			.el-button {
				width: auto;
			}
		}
	}
</style>