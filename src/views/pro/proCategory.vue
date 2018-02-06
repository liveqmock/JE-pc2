<template>
	<div id="proCategory">
		<div class="title-top">
			品类管理
			<el-button @click="add" class="edit-btn">添加品类</el-button>
			<el-dialog :title="title" v-model="addCategory">
				<el-form>
					<el-form-item label="品类名称:" class="mt-70">
						<el-input size="small" v-model.trim="categoryName" auto-complete="off" placeholder="请输入品类名称"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="handleSave">确 定</el-button>
					<el-button @click="addCategory = false">取 消</el-button>
				</div>
			</el-dialog>
		</div>
		<div class="pt-30 pl-30 pr-30">
			<div class="clearfix bg-f mt-50" v-loading="categoryLoading">
				<el-table :data="tableData" stripe style="width: 100%">
					<el-table-column label="品类名称" width="180px" align="center">
						<template scope="scope">
							<div>{{scope.row.classificationName}}</div>
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
	                        	<el-button type="text" @click.native="handleEdit(scope)">编辑</el-button>
	                        	<el-button type="text" @click.native="handleDelete(scope)">删除</el-button>
	                        </span>
						</template>
					</el-table-column>
				</el-table>
				<!--<el-pagination  class="tar"
	                :current-page = "currentPage"
	                :page-size = '10'
	                :total = 'total'
	                layout = "prev , pager, next, jumper"
	                >                      <!-- 分页组件 -->
				<!--</el-pagination>-->
			</div>
		</div>
	</div>
</template>
<script>
	import { axiosApi, basePath } from '../../api/api';
	export default {
		data() {
			return {
				addCategory: false,
				categoryLoading: false,
				title: '',
				categoryName: '',
				id: '',
				tableData: []
			}
		},
		methods: {
			//加载列表
			getFicationList() {
				this.categoryLoading = true
				//console.log("proCategory");
				const api = "/goods/classificationList/select";
				const body = {};
				axiosApi(api, body, this.callback)
			},
			callback(res) {
				let data = res.data.data;
				//console.log(data)
				this.tableData = data;
				this.categoryLoading = false
			},
			//添加
			add() {
				this.addCategory = true;
				this.title = '添加品类';
				this.categoryName = '';
				this.id = '';
			},
			//修改
			handleEdit(scope) {
				this.addCategory = true;
				this.title = '编辑品类';
				this.categoryName = scope.row.classificationName;
				this.id = scope.row.id;
			},
			//保存
			handleSave() {
				if(this.categoryName != '') {
					if(this.id == '') {
						//console.log('添加')
						const api = "/goods/classification/insert";
						const body = {
							classificationName: this.categoryName
						};
						axiosApi(api, body, this.update, this.currentPage, 10, this.otherCallback)
					} else {
						//console.log('修改')
						const api = "/goods/classification/update";
						const body = {
							id: this.id,
							classificationName: this.categoryName
						};
						axiosApi(api, body, this.update, this.currentPage, 10, this.otherCallback);
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
				this.addCategory = false;
				this.$message({
					type: 'success',
					message: '保存成功！'
				});
				this.getFicationList();
			},
			//删除
			handleDelete(scope) {
				this.id = scope.row.id;
				this.categoryName = scope.row.classificationName;
				this.$confirm('您是否要删除品类「' + this.categoryName + '」？', '提示信息', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					const api = "/goods/classification/delete";
					const body = {
						id: this.id
					};
					axiosApi(api, body, (res) => {
						this.$message({
							type: 'success',
							message: '删除成功!',
							duration: 1000
						});
						this.getFicationList();
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
			}
		},
		mounted() {
			this.$nextTick(function() {
				this.getFicationList();
			})
		}
	}
</script>
<style lang="less">
	#proCategory {
		.handleBtn .el-button {
			width: 56px;
		}
		.el-dialog--small {
			min-height: 294px;
			.el-dialog__body {
				padding: 0;
			}
		}
	}
</style>