<template>
	<div id="proOrigin">
		<div class="title-top">
			产地管理
			<el-button v-if='showButton("ADD",100003)' @click="add" class="edit-btn">添加产地</el-button>
			<el-dialog :title="title" v-model="addOrigin">
				<el-form>
					<el-form-item label="产地名称:" class="mt-70">
						<el-input size="small" @change="change()" v-model.trim="originName" auto-complete="off" placeholder="请输入产地名称"></el-input>
						<span v-if="bool" class="color-danger font-12">*输入名称过长</span>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="handleSave">确 定</el-button>
					<el-button @click="addOrigin = false">取 消</el-button>
				</div>
			</el-dialog>
		</div>
		<div class="pt-30 pl-30 pr-30">
			<div class="search">
				<label class="font-12">产地名称：</label>
				<el-input v-model.trim="orgName" @keyup.enter.native="handleSearch" placeholder="请输入产地名称"></el-input>
				<el-button @click="handleSearch" type="info" class="ml-50">查询</el-button>
			</div>
			<div class="clearfix bg-f mt-50" v-loading="loading">
				<el-table :data="tableData" stripe style="width: 100%">
					<el-table-column label="产地名称" width="180px" align="center">
						<template scope="scope">
							<div>{{scope.row.productAreaName}}</div>
						</template>
					</el-table-column>
					<el-table-column width="517px">
					</el-table-column>
					<el-table-column label="操作" align="center">
						<template scope="scope">
							<!--<el-dropdown> 
	                            <span class="el-dropdown-link">
	                               	 操作<i class="el-icon-caret-bottom el-icon--right"></i>
	                            </span>
	                            <el-dropdown-menu slot="dropdown" >
	                                <el-dropdown-item class="son" @click.native="handleEdit(scope)">编辑</el-dropdown-item>
	                                <el-dropdown-item class="son" @click.native="handleDelete(scope)" >删除</el-dropdown-item>
	                            </el-dropdown-menu>
	                        </el-dropdown>-->
							<span class="handleBtn">
	                        	<el-button v-if='showButton("EDIT",100003)' type="text" @click.native="handleEdit(scope)">编辑</el-button>
	                        	<el-button v-if='showButton("DEL",100003)' type="text" @click.native="handleDelete(scope)">删除</el-button>
	                        </span>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination v-if="total>0" class="tar" :current-page="currentPage" :page-size='10' :total='total' layout="prev , pager, next, jumper" @current-change='handleCurrentChange'>
					<!-- 分页组件 -->
				</el-pagination>
			</div>
		</div>
	</div>
</template>
<script>
	import { axiosApi, basePath } from '../../api/api';
	export default {
		data() {
			return {
				addOrigin: false,
				title: '',
				originName: '',
				orgName: '',
				id: '',
				tableData: [],
				total: 0,
				currentPage: 1,
				loading: false,
				bool: false
			}
		},
		methods: {
			//分页
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getAreaList();
			},
			//加载列表
			getAreaList() {
				this.loading = true;
				const api = "/goods/productAreaPageList/select";
				const body = {
					productAreaName: this.orgName.trim()
				};
				axiosApi(api, body, this.callback, this.currentPage, 10)
			},
			callback(res) {
				this.loading = false;
				if(res.data.data) {
					this.tableData = res.data.data.elements;
					this.total = res.data.data.totalCount;
				}
			},
			//验证产地正则
			change() {
				let reg = /^1\d{10}$/;
				if(reg.test(this.originName)) {
					this.bool = true;
				} else {
					this.bool = false;
				}
			},
			//添加
			add() {
				this.addOrigin = true;
				this.title = '添加产地';
				this.originName = '';
				this.id = '';
				this.change()
			},
			//修改
			handleEdit(scope) {
				this.addOrigin = true;
				this.title = '编辑产地';
				this.originName = scope.row.productAreaName;
				this.id = scope.row.id;
				this.change()
			},
			//保存
			handleSave() {
				if(this.originName != '') {
					if(this.id == '') {
						//console.log('添加')
						const api = "/goods/productArea/insert";
						const body = {
							productAreaName: this.originName
						};
						axiosApi(api, body, this.update, this.currentPage, 10, this.otherCallback)
					} else {
						//console.log('编辑')
						const api = "/goods/productArea/update";
						const body = {
							id: this.id,
							productAreaName: this.originName
						};
						axiosApi(api, body, this.update, this.currentPage, 10, this.otherCallback)
					}
				} else {
					this.$message({
						type: 'info',
						message: '请确保信息已全部填写完毕！'
					});
				}
			},
			otherCallback(res) {
				this.$message({
					type: 'info',
					message: res.data.message,
					duration: 1000
				});
			},
			update(res) {
				this.addOrigin = false;
				this.$message({
					type: 'success',
					message: '保存成功！'
				});
				this.getAreaList();
			},
			//删除
			handleDelete(scope) {
				this.id = scope.row.id;
				this.originName = scope.row.productAreaName;
				this.$confirm('您是否要删除产地「' + this.originName + '」？', '提示信息', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					const api = "/goods/productArea/delete";
					const body = {
						id: this.id
					};
					axiosApi(api, body, (res) => {
						this.$message({
							type: 'success',
							message: '删除成功!',
							duration: 1000
						});
						this.getAreaList();
					}, this.currentPage, 10, (res) => {
						this.$message({
							type: 'info',
							message: res.data.message,
							duration: 3000
						});
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				})
			},
			//查询
			handleSearch() {
				if(this.currentPage == 1) {
					this.getAreaList()
				} else {
					this.currentPage = 1
				}
			}
		},
		mounted() {
			this.$nextTick(function() {
				this.change();
				this.getAreaList();
			})
		}
	}
</script>
<style lang="less">
	#proOrigin {
		.handleBtn .el-button {
			width: 56px;
		}
		.el-dialog--small{
			min-height: 294px;
			.el-dialog__body{
				padding: 0;
			}
		}
	}
</style>