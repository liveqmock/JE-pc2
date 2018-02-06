<template>
	<div id="add-customer">
		<el-dialog title="新增商家" :visible.sync="isAdd" @close="goPage">
			<el-form :inline="true" :model="form" class="clearfix" label-width="115px">
				<el-form-item class="fl" label="商家名称:">
					<el-input v-model.trim="form.storeName"></el-input>
				</el-form-item>
				<el-button type="primary" class="fl ml-50" @click="handleSearch">查询</el-button>
			</el-form>
			<el-table @selection-change="handleSelectionChange" :data="userList" tooltip-effect="dark" class="mt-10 ml-30 mr-30">
				<el-table-column type="selection" width="50">
				</el-table-column>
				<el-table-column label="商家编号" prop="traderNumber" width="180">
				</el-table-column>
				<el-table-column label="商家名称" prop="storeName" show-overflow-tooltip>
				</el-table-column>
				<el-table-column label="用户名" prop="loginName" width="160">
				</el-table-column>
				<el-table-column label="联系人" prop="linkname" width="160">
				</el-table-column>
				<el-table-column label="联系电话" prop="tel" width="160">
				</el-table-column>
			</el-table>
			<el-pagination class="tar mr-30" v-if='total>0' :current-page.sync="curPage" :page-size='10' :total='total' layout="prev , pager, next, jumper" @current-change="handleSearch(true)">
			</el-pagination>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleSave">确 定</el-button>
				<el-button @click="goPage">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { axiosApi } from "~/api/api"
	export default {
		props: ["visible"],
		data() {
			return {
				form: {}, //查询条件
				curPage: 1,
				total: 0,
				userList: [], //商家数据
				isAdd: false,
				multipleSelection: [], //被选中的商家

			}
		},
		watch: {
			visible(val) {
				this.isAdd = val
				this.form.storeName=""
				this.curPage = 1
				this.handleSearch()
			}
		},
		methods: {
			handleSearch(val) {
				axiosApi("/groupon/bigTrader/selectPageList", {
					storeName: this.form.storeName,
					isOpenGroupBuying: 0
				}, res => {
					this.userList = res.data.data.elements || []
					this.total = res.data.data.totalCount
				}, this.curPage, 10)

			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			handleSave() {
				let a = this.multipleSelection.map(item => item.id)
				if(a.length > 0) {
					axiosApi("/groupon/bigTraderOpenGroup/batchUpdate", {
						traderIds: this.multipleSelection.map(item => item.id),
						isOpenGroupBuying: 1
					}, res => {
						this.$message({
							type: 'success',
							message: '操作成功!',
							duration: 1000
						})
						this.$emit("close")
					})
				}
				this.goPage()
			},
			goPage() {
				this.$emit("update:visible", false)
			}
		}
	}
</script>

<style lang="less">
	#add-customer {
		.el-dialog--small {
			width: 970px;
			.el-dialog__body {
				padding: 30px 0 100px;
			}
		}
	}
</style>