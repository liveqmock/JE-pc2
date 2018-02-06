<template>

	<div id="resource">
		<div class="title-menu">
			<div class="clearfix">
				<el-breadcrumb class="fl">
					<el-breadcrumb-item>菜单 / 资源配置</el-breadcrumb-item>
				</el-breadcrumb>
				<el-button @click="addMenu" class="edit-btn mr-30">添加</el-button>
			</div>
			<el-tabs v-model="activeTab" class='clearfix' @tab-click="loading">
				<el-tab-pane label='平台系统' name='1'></el-tab-pane>
				<el-tab-pane label='客户系统' name='2'></el-tab-pane>
			</el-tabs>
			
		</div>
		<div id="tree">
			<el-tree :data="menuList" :props="defaultProps" :render-content="renderContent">
			</el-tree>
		</div>
	</div>

</template>

<script>
	import { axiosApi,basePath } from '../../api/api';
	import { bus } from "../../main";
	export default {
		data() {
			return {
				activeTab: "1",
				menuList: [],
				defaultProps: {
					children: 'sub',
					label: 'text'
				}
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.loading();
			})
		},
		methods: {
			addMenu() {
				this.$router.push(basePath+'/ResourceAdd');
			},
			prohibition(store, data, e) {
				if(e&&e.stopPropagation){//非IE
				　　e.stopPropagation();
				}else{//IE
				　　window.event.cancelBubble=true;
				}
//				console.log(999,data,store)
//				const isDisplay = data.isDisplay == 0 ? 1 : 0;
				axiosApi('/foundation/resource/setStatus', { 'id': data.id, 'isDisplay': data.isDisplay }, (res) => {
						this.$message({
							message: '操作成功！',
							type: 'success',
							duration:1000
						});
						this.loading();
				});
			},
			bluepencil(store, data, e) {
				if(e&&e.stopPropagation){//非IE
				　　e.stopPropagation();
				}else{//IE
				　　window.event.cancelBubble=true;
				}
				this.$router.push(`${basePath}/resourceAdd/${data.id}`);
			},
			remove(store, data, e) {
				if(e&&e.stopPropagation){//非IE
				　　e.stopPropagation();
				}else{//IE
				　　window.event.cancelBubble=true;
				}
//				console.log(data)
				this.$confirm('此操作将永久删除 "'+ data.text +' ", 是否继续?', '提示信息', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					axiosApi('/foundation/resource/delete', { 'resources': [data.id] }, (res) => {
//						console.log(res, "remove");
//						this.menuList = res.data.data;
						this.$message({
							message: '操作成功！',
							type: 'success',
							duration:1000
						});
						this.loading();
						axiosApi("/foundation/resource/displaytree", {"loginName": sessionStorage.loginName, 'appId': 2}, (res)=>{
							bus.$emit('naveTree',res.data.data);
						}, 1, 10);
					},1,10,(res)=>{
						 this.$notify({
				         	title: '警告',
				         	message: res.data.message,
				         	type: 'warning'
				        });
					});
				}).catch(() => {});
				//store.remove(data);

			},
			renderContent(h, { node, data, store }) {
				// <el-button size="mini" on-click={ () => this.prohibition(store, data, event) }>{ data.isDisplay == 0 ? "禁用" : "启用" }</el-button>
		  //             <el-button size="mini" on-click={ () => this.remove(store, data, event) }>删除</el-button>
				return(
					<span>
		            <span>
		              <span>{node.label}</span>
		            </span>
		            <span style="float: right; margin-right: 20px">
		            <span style="margin-right: 100px">{ data.type == 1 ? "菜单" : "按钮" }</span>
		              <el-button size="mini" on-click={ () => this.bluepencil(store, data, event) }>编辑</el-button>
		              
		            </span>
		          </span>);
			},
			loading() {
				axiosApi('/foundation/resource/displaytreeForManger', { 'appId': this.activeTab}, (res) => {
					this.menuList = res.data.data ? res.data.data : [];
				});
			}
		}
	}
</script>

<style lang="less">
	#resource{
		#tree{
			.el-tree {
				margin: 30px;
				padding: 20px 0;
			}
			.el-tree-node{
				white-space: normal;
			}
		} 
	}
	
</style>