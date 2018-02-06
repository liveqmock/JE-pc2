<template>
	<div id="department" v-loading="Loading">
		
		<div class="title-top">
			<div class="clearfix">
				<el-breadcrumb class="fl">
					<el-breadcrumb-item>部门管理</el-breadcrumb-item>
				</el-breadcrumb>
				<el-button v-if='showButton("ADD",100015)' @click="addPar" class="fr edit-btn">新增部门</el-button>
			</div>
		</div>
		
		<div class="main pl-30 pt-30 pr-30">
			<div class="clearfix width-970 bg-f mt-30">
				<div class="main-l mr-30 fl scroll-style">
					<el-tree :data="depList" :props="defaultProps" default-expand-all :expand-on-click-node="false" @node-click="handleNodeClick" :render-content="renderContent"></el-tree>
				</div>
				<div class="main-r fl">
					<el-table :data="elements" stripe style="width: 100%;">
					    <el-table-column  label="用户名" width="120">
					    	<template scope="scope">
					    		<span>{{scope.row.loginName}}</span>
					    	</template>
					    </el-table-column>
					    <el-table-column label="员工姓名" width="90">
					    	<template scope="scope">
					    		<span>{{scope.row.employeeName}}</span>
					    	</template>
					    </el-table-column>
					    <el-table-column label="所属部门" width="">
					    	<template scope="scope">
					    		<span>{{scope.row.departmentName}}</span>
					    	</template>
					    </el-table-column>
					    <el-table-column label="职位" width="100">
					    	<template scope="scope">
					    		<span>{{scope.row.position}}</span>
					    	</template>
					    </el-table-column>
					    <el-table-column label="手机" width="120">
					    	<template scope="scope">
					    		<span>{{scope.row.mobile}}</span>
					    	</template>
					    </el-table-column>
					    <el-table-column label="状态" width="80">
					        <template scope="scope">
		                       <span>{{scope.row.isDisable=="0"?'启用':'停用'}}</span>
		                    </template>
					    </el-table-column>
					</el-table>
					<el-pagination v-if="elements.length>0"
						class="tar"
		                :current-page = "currentPage"
		                :page-size = '10'
		                :total = 'totalCount'
		                layout = "prev , pager, next, jumper"
		                @current-change='handleCurrentChange'
		                >                      <!-- 分页组件 -->
		            </el-pagination>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import { axiosApi,basePath } from '../../api/api';
	export default{
		data(){ 
			return{
				Loading:false,
				id: 'XX',
				depId:'',
				elements:[],
				depList:[],
				defaultProps: {
					children: 'sub',
					label: 'text'
				},
				totalCount:0,
				currentPage:1
			}
		},
		methods: {
			handleCurrentChange(val) {
	            this.currentPage = val;
	            this.getEmpList();
//	            console.log(`当前页: ${val}`);
	        },
			handleDetails(data) {
//				console.log(data);
			},
			handleNodeClick(data) {
//				console.log(data);
			},
			renderContent(h, { node, data, store }) {
			    return (
			        <span>
			            <span>
			              	<span class="el-tree-bg" on-click={ () => this.search(data) }>{node.label}</span>
			            </span>
			            <span class={data.isTop?'hide':'iconBtn hide color-9'}>
				            {this.showButton("EDIT",100015)?<i class="iconfont icon-editor pl-20" on-click={ () => this.edit(store, data) }></i>:null}
				            {this.showButton("DEL",100015)?<i class="iconfont icon-delete ml-5" on-click={ () => this.remove(store, data) }></i>:null}
			            </span>
			    </span>);
			},
			//点击部门切换右侧信息
			search(data){
				this.depId = data.id;
				let tree = document.getElementsByClassName('el-tree-node__content');
				for(var i=0;i<tree.length;i++){
					tree[i].onclick = function(){
						for(var i=0;i<tree.length;i++){
							tree[i].className = "el-tree-node__content";
						}
						this.className = "el-tree-node__content tree-active";
					}
				}
				this.getEmpList();
			},
			edit(store, data){
				this.depId = data.id;
				this.$router.push(basePath+"/dep/addPartment/"+this.depId);
			},
			//部门删除
			remove(store, data) {
				this.depId = data.id;
		        this.$confirm('是否确认删除部门「' +data.text+ '」？', '提示信息', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	const api = "/foundation/department/delete";
		        	const body = {id:this.depId};
		        	axiosApi(api, body,(res)=>{
				        this.$message({
				            type: 'success',
				            message: '删除成功!',
				            duration: 1000
				        });
				        this.getDepList();
				    },this.currentPage,10,(res)=>{
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
			addPar(){
				this.$router.push(basePath+"/dep/addPartment/" + this.id)
			},
			//部门列表查询
			getDepList(){
				const api = "/foundation/department/displayTree";
				axiosApi(api, {applicationType: 1},(res)=>{
					this.depList = res.data.data ? res.data.data : [];
	       			//console.log(this.depList)
				},1,10);
			},
			//查询员工列表
			getEmpList(){
				this.Loading = true;
				const api = "/foundation/employee/selectAll";
				const body = {appId: 1,departmentId:this.depId};
				axiosApi(api, body,this.emplist,this.currentPage,10)
			},emplist(res){
//				console.log('获取员工列表:',res)
	       		let emplist = res.data.data;
	       		this.totalCount = emplist.totalCount; 
	       		this.elements = emplist.elements;
	       		this.Loading = false;
//	       		console.log(this.elements)
	      	}
		},
		mounted(){
			this.$nextTick(function(){
	  			this.getDepList();
	  			this.getEmpList();
	  		})
		}
	}
</script>
<style lang="less">
	#department{
		.width-970{
			width: 970px;
		}
		.main-l{
			width: 210px;
			overflow-x: auto;
			border: 1px solid #DDDDDD;
		}
		.main-r{
			width: 700px;
		}
		.hide{
			display: none;
		}
		.el-table table .cell{
			text-align: center;
		}
		.el-tree{
			border: 0;
			min-height: 500px;
			float: left;
		}
		.el-tree-node__content {
			min-width: 200px;
		    padding-right: 10px;
		}
		.el-tree-bg{
			padding-left: 25px;
			margin-left: -3px;
			background: url(../../assets/icon-1.png) no-repeat 0 40%;
		}
		.el-tree-node__content:hover{
			color: #00AAEE;
			.iconBtn{
				display: inline-block;
				i:hover{
					color: #00AAEE;
				}
			}
		}
		.tree-active{
			color: #00AAEE;
			background: #F4F5F9;
		}
		.el-tree-node{
			white-space: nowrap;
		}
	}
</style>