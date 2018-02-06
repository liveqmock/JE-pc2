<template>
	<div id="addScreen">
		<div class="title-top">
			<el-breadcrumb separator="  ">
				<el-breadcrumb-item :to="path">分类筛选项</el-breadcrumb-item>
				<el-breadcrumb-item class="el-icon-arrow-right"></el-breadcrumb-item>
				<el-breadcrumb-item><span class="mr-10">「{{classifyName}}」</span>筛选项配置</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="main ml-50 mr-50 font-14">
			<div class="mt-50">
				<div class="clearfix">
					<label><span class="icon mr-5"></span>现有分类</label><span class="color-9 ml-10">(当前有{{relatedBrandNum}}项，还可添加{{remainBrandNum}}项)</span>
					<el-button class="fr edit-btn mr-0 mt-0" @click="isShow=true" :disabled="remainBrandNum==0">添加筛选项</el-button>
				</div>
				<div class="clearfix mt-20 Btn">
					<el-table :data="tableData" stripe style="width: 100%">
						<el-table-column label="品牌图片" width="170px" align="center">
					    	<template scope="scope">
					    		<span class="el-logo">
					    			<img :src="scope.row.logoIcon" alt="" />
					    		</span>
					    	</template>
					  	</el-table-column>
					  	<el-table-column label="品牌名称" width="517px" align="center">
					  		<template scope="scope">
					    		<span>{{scope.row.brandName}}</span>
					    	</template>
					  	</el-table-column>
					    <el-table-column label="操作" align="center">
					        <template scope="scope">
	                        	<el-button type="text" v-if="scope.$index!=0" @click.native="handleTop(scope)">置顶</el-button>
	                        	<el-button type="text" @click.native="handleDelete(scope)">删除</el-button>
		                    </template>
					    </el-table-column>
					</el-table>
				</div>
			</div>
		</div>
		<!--弹出框-->
		<el-dialog title="选择筛选项" :visible.sync="isShow">
			<div class="mt-10">
				<label>品牌名称：</label>
				<el-input v-model.trim="brandName" placeholder="请输入品牌名称"></el-input>
				<el-button @click.native="handleSearch" type="primary" class="ml-50">查询</el-button>
			</div>
			<div class="clearfix mt-30 Btn">
				<el-table :data="tableDataAll" stripe style="width: 100%">
					<el-table-column label="品牌图片" width="170px" align="center">
					    	<template scope="scope">
					    		<span class="el-logo">
					    			<img :src="scope.row.logoIcon" alt="" />
					    		</span>
					    	</template>
					  	</el-table-column>
					  	<el-table-column label="品牌名称" width="517px" align="center">
					  		<template scope="scope">
					    		<span>{{scope.row.brandName}}</span>
					    	</template>
					  	</el-table-column>
				    <el-table-column label="操作" align="center">
				        <template scope="scope">
                        	<el-button type="text" @click.native="handleAdd(scope)">添加</el-button>
	                    </template>
				    </el-table-column>
				</el-table>
				<el-pagination v-if="tableDataAll.length>0"  class="tar"
	                :current-page = "currentPage"
	                :page-size = '7'
	                :total = 'totalCount'
	                layout = "prev , pager, next, jumper"
	                @current-change='handleCurrentChange'
	                >                      <!-- 分页组件 -->
	            </el-pagination>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { axiosApi, basePath } from '../../api/api';
	export default{
		data(){
			return{
				path: { path: basePath + "/screen" },
				tableData: [],
				relatedBrandNum: 0,//已添加
				remainBrandNum: 20,//可添加
				tableDataAll: [],
				currentPage: 1,
				totalCount: 0,
				brandName: null,
				isShow: false,
				classifyId: null,//分类Id
				classifyName: null,//分类名称
			}
		},
		methods: {
			handleSearch(){
				if(this.currentPage === 1){
					this.loading();
				}else{
					this.currentPage = 1;
				}
			},
			//获取已添加品牌信息
			checkLoading(){
				const api = "/goods/singleClassifyBrandQuery/select";
				const body = { id: this.$route.params.id };
				axiosApi(api, body,(res)=>{
					//console.log(res,'已有列表')
					this.tableData = res.data.data.brandList;
					this.relatedBrandNum = res.data.data.relatedBrandNum;
					this.remainBrandNum = res.data.data.remainBrandNum;
					this.classifyName = res.data.data.classifyName
				})
			},
			//获取可添加品牌信息
			loading(){
				const api = "/goods/brandListWithOutRelated/select";
				const body = { classifyId: this.$route.params.id,brandName: this.brandName };
				axiosApi(api, body,(res)=>{
//					console.log(res,'可添加列表')
					this.tableDataAll = res.data.data.elements;
					this.totalCount = res.data.data.totalCount;
				},this.currentPage,7)
			},
			//可添加筛选项分页
			handleCurrentChange(val){
				this.currentPage = val;
				this.loading();
			},
			//查询
//			handleSearch(){
//				this.loading();
//			},
			//置顶
			handleTop(scope){
				const api = "/goods/classifyBrandSetTop/update";
				const body = { classifyId: this.$route.params.id,brandId:scope.row.id};
				axiosApi(api, body,(res)=>{
//					console.log(res,'置顶')
					this.$message({
						type: 'success',
						message: '操作成功',
						duration: 1000
					});
					this.checkLoading();
				})
			},
			//删除
			handleDelete(scope){
				this.$confirm('确认删除品牌「' + scope.row.brandName + '」？', '提示信息', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	const api = "/goods/classifyBrandDel/update";
					const body = { classifyId: this.$route.params.id,brandId:scope.row.id};
					axiosApi(api, body,(res)=>{
//						console.log(res,'删除')
						this.$message({
							type: 'success',
							message: '删除成功',
							duration: 1000
						});
						this.checkLoading();
						this.loading();
					})
		        }).catch(() => {
		          	this.$message({
		            	type: 'info',
		            	message: '已取消删除'
		          	}); 
		        })
			},
			//添加
			handleAdd(scope){
//				console.log(scope)
				const api = "/goods/classifyBrandAdd/update";
				const body = { classifyId: this.$route.params.id,brandId:scope.row.id};
				axiosApi(api, body,(res)=>{
//					console.log(res,'添加')
					this.$message({
						type: 'success',
						message: '操作成功',
						duration: 1000
					});
					this.checkLoading();
					this.loading();
//					this.isShow = false
				},this.currentPage,10,(res)=>{
					this.$message({
						type: 'info',
						message: res.data.message,
						duration: 1000
					});
				})
			}
		},
		mounted(){
			this.$nextTick(function(){
				this.checkLoading();
				this.loading();
			})
		}
	}
</script>

<style lang="less">
	#addScreen{
		.icon{
			border: 2px solid #27B0FC;
			height: 10px;
			display: inline-block;
			vertical-align: middle;
		}
		.el-dialog {
			width: 950px;
			height: 725px;
		}
		.table-default.el-table .cell{
			padding: 3px 15px 0;
		}
		.el-dialog__body {
			padding: 20px 30px;
		}
		.el-form .el-input{
			width: 170px;
		}
		.Btn{
			.el-button{
				width: 28px;	
			}
			.el-logo{
				display: inline-block;
				width: 40px;
				height: 40px;
				img{
					width: 100%;
					height: 100%;
				}	
			}
		}
	}
</style>