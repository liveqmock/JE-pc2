<template>
	<div id="limits">
		<div class="title-top">
			角色管理
			<el-button v-if='showButton("ADD",100014)' class="edit-btn fr mb-10 mt-25 mr-30" @click.native="addRole">新增角色</el-button>
		</div>
		<div class="main mt-20">
			<el-tree v-loading="Loading" :data="data1" :props="defaultProps" node-key="id" :default-expanded-keys="[2,3,4]" :expand-on-click-node="false" :render-content="renderContent"></el-tree>
		</div>
	</div>
</template>
<script>
	import { MessageBox } from 'element-ui';
	import { axiosApi, basePath } from '../../api/api';
	export default {
		data() {
			return {
				Loading: true,
				roleId: [],
				text: "",
				id: '',
				elements: [],
				data1: [],
				disabled: true,
				defaultProps: {
					children: 'sub',
					label: 'text'
				}
			}
		},
		methods: {
			//			获取角色列表
			achieve() {
				const api = "/foundation/role/selectAll";
				const body = {applicationType : 1}
				axiosApi(api, body, this.callback)
			},
			callback(res) {
				this.data1 = res.data.data ? res.data.data :[];
				this.Loading = false;
			},
			renderContent(h, { node, data, store }) {
				return(
				<span>
		            <span>
		              	<span class="el-tree-bg">{node.label}</span>
		            </span>
		            <span class="" >
			            <span class='fr mr-20'>
			              {this.showButton("EDIT",100014)?<el-button size="mini" on-click={ () => this.edit(store, data) }>编辑</el-button>:null}
			              {this.showButton("DEL",100014)?<el-button size="mini" on-click={ () => this.remove(store, data) }>删除</el-button>:null}
			            </span>
		            </span>
			    </span>);
			},
			//删除员工
			remove(store, data) {

				this.roleId = data.id;
				this.text = data.text;
				this.$confirm('您是否要删除角色「' + this.text + '」？', '提示信息', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					const api = "/foundation/role/delete";
					const body = { ids: [this.roleId] };
					axiosApi(api, body, (res) => {
						this.$message({
							type: 'success',
							message: '删除成功!',
							duration: 1000
						});
						this.achieve();
					}, this.currentPage, 10, (res) => {
						this.$notify({
							title: '警告',
							message: res.data.message,
							type: 'warning'
						});
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				})
			},

			//跳转到增加角色
			addRole() {
				this.$router.push(basePath + '/addRole')
			},
			//跳转到编辑角色
			edit(store, data) {
				this.id = data.id,
					this.text = data.text,
					this.isDisplay = data.isDisplay,
					this.$router.push(basePath + '/editRole/' + this.id + '/' + this.text + '/' + this.isDisplay)
			},

		},
		mounted() {
			this.$nextTick(function() {
				this.achieve()
			})
		}
	}
</script>
<style lang="less">
	#limits {
		.el-tree {
			margin: 30px;
			padding: 20px 0;
		}
		.mt-25{
			margin-top: 25px;
		}
		.hide{
			display: none;
		}
	}
</style>