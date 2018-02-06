<template>
	<div id="proBrand">
		<div class="title-top">
			品牌管理
			<el-button v-if='showButton("ADD",100002)' @click="add" class="edit-btn">添加品牌</el-button>
			<el-dialog :title="title" v-model="addBrand" @close="close">
				<el-form>
					<el-form-item label="品牌名称:">
						<el-input size="small" v-model.trim="brandName" auto-complete="off" placeholder="请输入品牌名称"></el-input>
					</el-form-item>
					<el-form-item label="所属分类:">
						<el-select :class="{ 'min-height': classifyList.length == 0 }" size="small" v-model="classifyList" multiple placeholder="请选择分类">
						    <el-option v-for="item in classifyOptions" :key="item.id" :label="item.classifyName" :value="item.id">
						    </el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="品牌logo:">
						<el-upload class="avatar-uploader" action="/sunrise-gateway/oss/ossUpload" :show-file-list="false" :on-success="handleAvatarScucess" :before-upload="beforeAvatarUpload" :on-error="errFun" v-loading="loading">
							<img v-if="logoIcon" :src="logoIcon" class="avatar" >
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer clearfix">
					<el-button type="primary" @click="handleSave">确 定</el-button>
					<el-button @click="close">取 消</el-button>
				</div>
			</el-dialog>
		</div>
		<div class="pt-30 pl-30 pr-30">
			<div class="search">
				<span>
					<label class="font-12">品牌名称：</label>
					<el-input v-model.trim="braName" @keyup.enter.native="handleSearch" placeholder="请输入品牌名称"></el-input>
				</span>
				<span class="ml-20">
					<label class="font-12">所属分类：</label>
					<el-select v-model="classify" clearable>
					    <el-option v-for="item in classifyOptions" :key="item.id" :label="item.classifyName" :value="item.id">
					    </el-option>
					</el-select>
				</span>
				<el-button @click.native="handleSearch" type="info" class="ml-50">查询</el-button>
			</div>
			<div class="clearfix bg-f mt-50" v-loading="brandLoading">
				<el-table :data="tableData" stripe style="width: 100%">
					 <el-table-column label="品牌图片" width="180px" align="center">
				    	<template scope="scope">
				    		<span class="el-logo">
				    			<img class="bd" v-if="scope.row.logoIcon" :src="scope.row.logoIcon" alt="" />
				    			<img class="bd" v-else src="../../assets/brand.png"/>
				    		</span>
				    	</template>
				    </el-table-column>
				    <el-table-column label="品牌名称" width="280px" align="center">
				    	<template scope="scope">
				    		<div>{{scope.row.brandName}}</div>
				    	</template>
				    </el-table-column>
				    <el-table-column label="所属分类" width="290px" align="center">
				    	<template scope="scope">
				    		<div>{{scope.row.relatedClassify}}</div>
				    	</template>
				    </el-table-column>
				    <el-table-column label="操作" align="center">
				        <template scope="scope">
	                        <span class="handleBtn">
	                        	<el-button v-if='showButton("EDIT",100002)' type="text" @click.native="handleEdit(scope)">编辑</el-button>
	                        	<el-button v-if='showButton("DEL",100002)' type="text" @click.native="handleDelete(scope)">删除</el-button>
	                        </span>
	                    </template>
				    </el-table-column>
				</el-table>
				<el-pagination v-if="total>0"  class="tar"
	                :current-page = "currentPage"
	                :page-size = '10'
	                :total = 'total'
	                layout = "prev , pager, next, jumper"
	                @current-change='handleCurrentChange'
	                >                      <!-- 分页组件 -->
	            </el-pagination>
			</div>
		</div>
	</div>
</template>
<script>
	import { axiosApi,basePath } from '../../api/api';
	export default{
		data(){
			return{
				addBrand: false,
				title:'',
				brandName:'',
				id:'',
				braName:'',//品牌名称
				classify: '',//分类Id
				logoIcon: '',
        		dialogVisible: false,
				tableData: [],
		        total:0,            
              	currentPage:1,
              	brandLoading: false,
              	loading: false,
              	classifyOptions: [],
			    classifyList: []
			}
		},
		methods: {
			//分页
			handleCurrentChange(val){
				this.currentPage = val;
				this.getBrandList();
			},
			//加载列表
			getBrandList(){
				this.brandLoading = true;
				const api = "/goods/classifyBrandListQuery/select";
				const body = { brandName:this.braName.trim(),classifyId:this.classify };
				axiosApi(api, body,this.callback,this.currentPage,10)
			},
			callback(res){
				//console.log(res,'加载默认列表')
				this.brandLoading = false;
				if(res.data.data){
					this.tableData = res.data.data.elements;
					this.total = res.data.data.totalCount;
				}
			},
			//加载所属分类列表
			getClassify(){
				const api = "/goods/classifyTopList/select";
				const body = {};
				axiosApi(api, body,(res)=>{
					//console.log(res,'分类')
					this.classifyOptions = res.data.data;
				})
			},
			//添加
			add(){
				this.addBrand = true;
	        	this.title = '添加品牌';
	        	this.brandName = '';
	        	this.logoIcon = '';
	        	this.id = '';
				this.classifyList = [];
			},
			close(){//窗口关闭
				this.addBrand = false;
				this.logoIcon = '';
			},
			getEditClassify(id){//编辑时已有的分类
				const api = "/goods/brandClassifyRelationQuery/select";
				const body = { brandId:id };
				axiosApi(api, body,(res)=>{
					//console.log(res,'已关联分类')
					this.classifyList = [];
					res.data.data.forEach((item)=>{
						this.classifyList.push(item.id)
					})
				})
			},
			//修改
			handleEdit(scope){
//				console.log(scope)
				this.addBrand = true;
	        	this.title = '编辑品牌';
	        	this.brandName = scope.row.brandName;
	        	this.logoIcon = scope.row.logoIcon;
	        	this.id = scope.row.id;
	        	this.getEditClassify(this.id);
			},
			//保存
			handleSave(){
				console.log(this.classifyList)
				if(this.brandName != ''){
					if(this.id == ''){
						//console.log('添加')
						const api = "/goods/brand/insert";
		        		const body = {logoIcon:this.logoIcon, brandName :this.brandName, classifyIdList:this.classifyList };
		        		axiosApi(api, body,this.update,this.currentPage,10,this.otherCallback)
					}else{
						//console.log('编辑')
						const api = "/goods/brand/update";
		        		const body = {id:this.id,logoIcon:this.logoIcon,brandName :this.brandName,classifyIdList:this.classifyList};
		        		axiosApi(api, body,this.update,this.currentPage,10,this.otherCallback)
					}
				}else{
					this.$message({
		            	type: 'info',
		            	message: '请输入品牌名称！'
		          	});
				}
			},
			update(res){//成功回调
				this.addBrand=false;
				this.$message({
	            	type: 'success',
	            	message: '保存成功！'
	          	});
				this.getBrandList();
			},
			otherCallback(res){//失败回调
				this.$message({
	            	type: 'info',
	            	message: res.data.message,
	            	duration: 1000
	          	});
			},
			handleDelete(scope){//删除
	        	this.$confirm('您是否要删除品牌「' + scope.row.brandName + '」？', '提示信息', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	const api = "/goods/brand/delete";
		        	const body = {id: scope.row.id};
		        	axiosApi(api, body,(res)=>{
				        this.$message({
				            type: 'success',
				            message: '删除成功!',
				            duration: 1000
				        });
				        this.getBrandList();
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
			//查询
			handleSearch(){
				if(this.currentPage == 1){
	        		this.getBrandList()
	        	}else{
	        		this.currentPage = 1
	        	}
			},
			//上传图片
			beforeAvatarUpload(file) {
				this.loading = true;
				const isImage = (file.type.indexOf('jpg') != -1 || file.type.indexOf('jpeg') != -1 || file.type.indexOf('png') != -1 || file.type.indexOf('bmp') != -1);
				const isLt4M = file.size / 1024 / 1024 < 4;
				if(!isImage) {
					this.loading = false;
					this.$message.error('上传图片只能是jpg、jpeg、png、bmp格式');
				}
				if(!isLt4M) {
					this.loading = false;
					this.$message.error('上传图片大小不能超过 4MB');
				}
				return isImage && isLt4M;
			},
			handleAvatarScucess(res) {//上传成功时的状态
				this.loading = false;
				this.logoIcon = res.data[0];
			},
			handlePictureCardPreview(file) {//预览
				this.logoIcon = file.url;
				this.dialogVisible = true;
			},
			errFun(err) {
//				console.log(err);
			},
		},
		mounted(){
			this.$nextTick(function(){
				this.getBrandList();//加载列表
	        	this.getClassify();//加载分类
			})
		}
	}
</script>
<style lang="less">
	#proBrand{
		.el-logo{
			display: inline-block;
			width: 60px;
			height: 60px;
			img{
				width: 100%;
				height: 100%;
			}	
		}
		.avatar{
			width: 150px;height: 150px;
			line-height: 150px;
		}
		.avatar-uploader-icon{
			border: 1px solid #ddd;
			width: 150px;height: 150px;
			line-height: 150px;
			font-size: 30px;
		}
		.handleBtn .el-button{
			width: 56px;
		}
		.el-input{
			min-height: 32px;
			height: auto;
		}
		.min-height .el-input__inner{
			height: 32px !important;
		}
	}
</style>