<template>
	<div id="people">
		<div class="title-top">
			<div class="clearfix">
				<el-breadcrumb class="fl">
					<el-breadcrumb-item>员工管理</el-breadcrumb-item>
				</el-breadcrumb>
				<el-button v-if='showButton("ADD",100016)' class="edit-btn fr ml-0 mr-30 mt-24" @click.native="change1()">新增员工</el-button>
			</div>
		</div>
		<div class="main">
			<el-form :inline="true" :model="form" label-width="90px" class="clearfix pl-20 pt-30 search">
				<div class="fl width-75p">
					<el-form-item label="用户名:">
						<el-input v-model.trim="form.loginName" @keyup.enter.native='achieve'></el-input>
					</el-form-item>
					<el-form-item label="员工姓名:">
						<el-input v-model.trim="form.employeeName" @keyup.enter.native='achieve'></el-input>
					</el-form-item>
					<el-form-item label="所属部门:">
						<el-cascader @keyup.enter.native='achieve' clearable change-on-select :options="searchDepartmentList" :props="config" v-model="emptyId"></el-cascader>
					</el-form-item>
				</div>
				<el-button type="info" class="fl" @click='achieve'>查询</el-button>
			</el-form>
			<div class="clearfix">
				<span v-if='showButton("DEL_MUL",100016)' class="color-blue cursor fr mr-60" @click="getIds()">批量删除</span >
			</div>
			<el-table :data="tableData" v-loading="Loading" class='ml-30 mt-10 table-default mr-30' @selection-change="handleSelectionChange" stripe>
				<el-table-column type="selection"></el-table-column>
				<el-table-column label="用户名" prop="loginName" width="120">
				</el-table-column>
				<el-table-column label="员工姓名" prop="employeeName" width="120"></el-table-column>
				<el-table-column label="所属部门" prop="departmentName" width="120"></el-table-column>
				<el-table-column label="角色" prop="roleName" width="120"></el-table-column>
				<el-table-column label="职位" prop="position" width="120"></el-table-column>
				<el-table-column label="手机" prop="mobile" width="88"></el-table-column>
				<el-table-column label="状态" width="120">
					<template scope="scope">
						<span>{{scope.row.isDisable=="0"?'正常':'禁用'}}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template scope="scope">
						<router-link :to="`${basePath}/editPeople?id=${scope.row.loginName}`">
							<el-button v-if='showButton("EDIT",100016)' size="small" type='text'>编辑</el-button>
						</router-link>
						<el-button v-if='showButton("DEL",100016)' size="small" class='ml-0' type='text' @click.native="deleteRows(scope.$index, tableData)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-pagination v-if="total>0" class="tar mr-30" :current-page="currentPage" :page-size='10' :total='total' layout="prev , pager, next, jumper" @current-change="handleCurrentChange">
				<!-- 分页组件 -->
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import { axiosApi, basePath } from "../../api/api";
	export default {
		data() {
			return {
				Loading:true,
				form: { //搜索条件
					id: '',
					loginName: '',
					employeeName: '',
					department: '',
					departmentId: []
				},
				activeTab: '1',
				tableData: [], //员工列表
				searchDepartmentList: [], //搜索部门
				//				分页
				currentPage: 1,
				total: 0,
				isPagination: true,
				config: {
					label: "text",
					children: "sub",
					value: "id"
				},
				multipleSelection: [], //选中所有行
				ids: [], //批量删除所以id
				admin: [],
				emptyId: [],
				isadmin: true//判断批量选中的人员中是否存在超级管理员
			}
		},
		methods: {
			handleSelectionChange(val) { //table 选中行
				this.multipleSelection = val
			},
			getIds() {
				let _this = this
				this.multipleSelection.forEach(function(item, index) {
					_this.ids.push(item.id)
					_this.admin.push(item.isAdmin)
				})
				this.deleteall()
			},
			change1: function() {
				this.$router.push(basePath + '/addPeople')
			},
			//加载员工列表/查询
			achieve() {
				const api = "/foundation/employee/selectAll";
				const body = {
					loginName: this.form.loginName,
					employeeName: this.form.employeeName,
					departmentId: this.emptyId[this.emptyId.length - 1],
					appId: 1
				}
				axiosApi(api, body, this.callback, this.currentPage, 10)
			},
			callback(res) {
				this.tableData = res.data.data.elements
				this.total = res.data.data.totalCount
				this.Loading = false
			},
			//查询部门
			searchDepartment() {
				const api = "/foundation/department/displayTree";
				const body = {
					applicationType: 1,
				}
				axiosApi(api, body, this.callback1, this.currentPage, 10)
			},
			callback1(res) {
				this.searchDepartmentList = res.data.data ? res.data.data : [];
			},
			//删除员工
			deleteRows(index, rows) {
				let that = this;
				this.$confirm('您是否要删除员工「' + this.tableData[index].employeeName + '」？', '提示信息', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					if(this.tableData[index].isAdmin == 0) { //不是超级管理员
						const api = "/foundation/employee/delete";
						const body = { ids: [this.tableData[index].id] };
						axiosApi(api, body, (res) => {
							this.$message({
								type: 'success',
								message: '删除成功!',
								duration: 1000
							});
							that.achieve();
						}, this.currentPage, 10, (res) => {
							this.$message({
								type: 'info',
								message: res.data.message,
								duration: 3000
							});
						});
					} else {
						this.$confirm('当前员工不可删除', '提示信息', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						})
					}
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				})
			},
			//批量删除员工
			deleteall() {
				for(let i = 0; i < this.admin.length; i++) {
					if(this.admin[i] == 1) {
						this.isadmin = false;
						break;
					}
				}
				let that = this;
				this.$confirm('您是否要删除选中的员工？', '提示信息', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					if(this.isadmin == true) { //不是超级管理员
						const api = "/foundation/employee/delete";
						const body = { ids: this.ids };
						axiosApi(api, body, (res) => {
							if(this.ids.length > 0) {
								this.$message({
									type: 'success',
									message: '删除成功!',
									duration: 1000
								});
							} else {
								this.$notify({
									type: 'warning',
									message: '您未选中任何员工!',
									duration: 1000
								});
							}
							this.ids = []
							that.achieve();
						}, this.currentPage, 10, (res) => {
							this.$notify({
								type: 'warning',
								message: '您未选中任何员工!',
								duration: 1000
							});
						});
					} else {
						this.$confirm('当前员工不可删除', '提示信息', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						})
					}

				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				})
			},
			//			分页
			handleCurrentChange(val) {
				this.currentPage = val
				this.achieve()
			},
		},
		//进入加载
		activated() {
			this.$nextTick(function() {
				this.achieve();
				this.searchDepartment()
			})
		}
	}
</script>

<style lang="less">
	#people {
		.main{
			.table-default{
				width: 938px;
			}
		}
		.el-button--default {
			margin-right: 0px;
		}
		.el-tabs__header {
			padding-left: 0;
		}
		.mt-24{
			margin-top: 24px;
		}
		.obt{
			margin-top: 67px;
			margin-right: 60px;
		}
		.mr-60{
			margin-right: 60px;
		}
	}
</style>