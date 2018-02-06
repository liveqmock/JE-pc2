<template>
	<div id="proCation">
		<div class="title-top">
			分类管理
			<el-button v-if='showButton("ADD",100005)' @click="addClass" class="edit-btn">添加分类</el-button>
			<el-dialog :title="titleName" v-model="addCation">
				<el-form :model="ruleForm1" :rules="rules" ref="ruleForm1">
					<el-form-item label="所属品类:" class="mt-50" required>
						<el-select v-model="cationId" size="small" placeholder="请选择所属品类">
							<el-option v-for="item in cationList" :label="item.classificationName" :value="item.id" key="$index"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="分类名称:" prop="cationName">
						<el-input size="small" v-model.trim="ruleForm1.cationName" auto-complete="off" placeholder="请输入分类名称"></el-input>
					</el-form-item>
					<el-form-item label='分类图标:' v-if="parentId==0" required>
						<el-select v-model="iconInfo" size="small" placeholder="请选择分类图标">
							<el-option v-for="icon in iconfont" :label="icon.label" :value="icon.value" key="$index">
								<i class="fl iconfont" :class="icon.value"></i>
								<span class="fr">{{ icon.label }}</span>
							</el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="handleSave('ruleForm1')">确 定</el-button>
					<el-button @click="addCation = false">取 消</el-button>
				</div>
			</el-dialog>
			<el-dialog title="添加子类" v-model="addSubCation">
				<el-form :model="ruleForm2" :rules="ruleL" ref="ruleForm2">
					<el-form-item label="所属分类:" class="mt-50">
						<span>{{ruleForm1.cationName}}</span>
					</el-form-item>
					<el-form-item label="子类名称:" class="mt-20" prop="classSubName">
						<el-input size="small" v-model.trim="ruleForm2.classSubName" auto-complete="off" placeholder="请输入子类名称"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="handleSubSave('ruleForm2')">确 定</el-button>
					<el-button @click="addSubCation = false">取 消</el-button>
				</div>
			</el-dialog>
		</div>
		<div class="pt-30 pl-30 pr-30">
			<el-tree :data="treeData" :props="defaultProps" :expand-on-click-node="false" @node-click="handleNodeClick" :render-content="renderContent"></el-tree>
		</div>
	</div>
</template>
<script>
	import { axiosApi,basePath } from '../../api/api';
	export default{
		data(){
			return{
				rules:{cationName:[{ required:true, min: 1,max: 8,message: '长度在 1到 8 个字符',trigger: 'blur'}]},
				ruleL:{classSubName:[{ required:true, min: 1,max: 8,message: '长度在 1到 8 个字符',trigger: 'blur'}]},
				addCation: false,
				addSubCation: false,
				titleName:'',
				cationId:'',
				iconInfo:'',
				parentId:'',
		        cationList:[],
		        id:'',
		        treeData:[],
		        defaultProps: {
					children: 'sub',
					label: 'classifyName'
				},
				// icons: [],
				ruleForm1:{
					cationName:''
				},
				ruleForm2:{
					classSubName:''
				},
		        total:0,            
              	currentPage:1
			}
		},
		methods: {
	        handleNodeClick(){
	        	
	        },
	        //获取分类列表信息
	        getClassifyList(){
	        	this.categoryLoading = true
	        	const api = "/goods/classifyList/select";
				const body = {};
				axiosApi(api, body,this.callback,this.currentPage,10)
	        },
	        callback(res){
	        	//console.log(res)
	        	this.treeData = res.data.data;
    			this.categoryLoading = false
	        },
	        //获取品类信息
	         getFicationList(){
	         	let that = this;
				const api = "/goods/classificationList/select";
				const body = {};
				axiosApi(api, body,function(res){
					that.cationList = res.data.data;
				})
	        },
	        renderContent(h, { node, data, store }) {
			    return (
			        <span>
			            <span>
			              	<span><i class= {data.icon + " iconfont mr-5 color-blue"}></i>{node.label}</span>
			            </span>
			            <span class="handleBtn" style="float: right; margin-right: 20px">
			            	{data.treeNode != '3' && this.showButton("ADD_CH",100005)?<el-button type="text" on-click={ () => this.handleAdd(store, data) }>添加子类</el-button> : null}
				            {this.showButton("EDIT",100005)?<el-button type="text" on-click={ () => this.handleEdit(store, data) }>编辑</el-button> : null}
							{data.parentId == '0' && this.showButton("SET",100005)?<el-button type="text" on-click={ () => this.handleSet(store, data) }>页面参数</el-button> : null}
              				{this.showButton("DEL",100005)?<el-button type="text" on-click={ () => this.handleDelete(store, data) }>删除</el-button> : null}
			            </span>
			    </span>);
			},
			//页面参数
			handleSet(store, data){
//				console.log(data)
				this.$router.push(basePath+'/proRelation/'+data.id+'/'+data.classifyName)
			},
	        //添加子类
	        handleAdd(store, data){
	        	this.addSubCation = true;
	        	this.ruleForm1.cationName = data.classifyName;
	        	this.cationId = data.classificationId;
	        	this.parentId = data.id;
	        	this.ruleForm2.classSubName = ''
	        },
	        //子类添加保存
	        handleSubSave(ruleForm2){
	        	this.$refs[ruleForm2].validate((valid) => {
		          	if (valid) {
			            if(this.ruleForm2.classSubName != ''){
				        	const api = "/goods/classify/insert";
							const body = {classificationId:this.cationId,parentId:this.parentId,classifyName:this.ruleForm2.classSubName};
							axiosApi(api, body,this.callbackSub,this.currentPage,10,this.otherCallback)
						}else{
							this.$message({
				            	type: 'info',
				            	message: '请确保信息已全部填写完毕！'
				          	});
						}
		          	} else {
		            	console.log('error submit!!');
		            	return false;
		         	}
		        });
	        	
	        },
	        callbackSub(res){
	        	this.addSubCation = false;
	        	this.$message({
	            	type: 'success',
	            	message: '子类添加成功！'
	          	});
	        	this.getClassifyList()
	        },
	        //添加一级分类
	        addClass(){
	        	this.addCation = true;
	        	this.titleName = '添加分类';
	        	this.getFicationList();
	        	this.id = '';
	        	this.iconInfo='';
	        	this.parentId = 0;
	        	this.cationId = '';
	        	this.ruleForm1.cationName = '';
	        },
	        //修改
	        handleEdit(store, data){
	        	this.addCation = true;
	        	this.titleName = '编辑分类';
	        	this.getFicationList();
	        	this.id = data.id;
	        	this.iconInfo= data.icon;
	        	this.parentId = data.parentId;
	        	this.cationId = data.classificationId;
	        	this.ruleForm1.cationName = data.classifyName;
	        },
	        //保存
	        handleSave(ruleForm1){
	        	this.$refs[ruleForm1].validate((valid) => {
		          	if (valid) {
	          			if(this.ruleForm1.cationName != ''){
			        		if(this.id == ''){
				        		//console.log('添加')
				        		const api = "/goods/classify/insert";
								const body = {classificationId:this.cationId,parentId:this.parentId,classifyName:this.ruleForm1.cationName,icon:this.iconInfo};
								axiosApi(api, body,this.update,this.currentPage,10,this.otherCallback)
				        	}else if(this.id != '' && this.parentId == 0){
				        		//console.log('一级修改')
				        		const api = "/goods/classifyTop/update";
								const body = {classificationId:this.cationId,id:this.id,classifyName:this.ruleForm1.cationName,icon:this.iconInfo};
								axiosApi(api, body,this.update,this.currentPage,10,this.otherCallback)
				        	}else{
				        		//console.log('一级以下修改')
				        		const api = "/goods/classifySub/update";
								const body = {id:this.id,classifyName:this.ruleForm1.cationName};
								axiosApi(api, body,this.update,this.currentPage,10,this.otherCallback)
				        	}
			        	}else{
			        		this.$message({
				            	type: 'info',
				            	message: '请确保信息已全部填写完毕！'
				          	});
			        	}
		          	} else {
			            console.log('error submit!!');
			            return false;
		          	}
		        });	
	        	
	        },
	        otherCallback(res){
				this.$message({
	            	type: 'info',
	            	message: "品类名称不能为空",
	            	duration: 1000
	          	});
			},
	        update(res){
	        	this.addCation = false;
	        	this.$message({
	            	type: 'success',
	            	message: '保存成功！'
	          	});
	        	this.getClassifyList()
	        },
	        //删除
	        handleDelete(store,data){
	        	this.id = data.id;
	        	this.ruleForm1.cationName = data.classifyName;
	        	this.$confirm('您确定要删除分类「' + this.ruleForm1.cationName + '」？', '提示信息', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	const api = "/goods/classify/delete";
		        	const body = {id:this.id};
		        	axiosApi(api, body,(res)=>{
				        this.$message({
				            type: 'success',
				            message: '删除成功!',
				            duration: 1000
				        });
				        this.getClassifyList();
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
	        }
	   },
	   mounted(){
	   	this.$nextTick(function(){
	   		this.getClassifyList();
	   	})
	   }
	}
</script>
<style lang="less">
	#proCation{
		.el-tree-node__expand-icon{
			margin-left: 20px;
		}
		.handleBtn .el-button{
			width: 56px;
		}
		.show{
			display: inline-block;
		}
		.hide{
			display: none;
		}
		.el-form-item__error{
			margin-left: 185px;
		}
	}
</style>