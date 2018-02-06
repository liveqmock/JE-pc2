<template>
	<div id="proRelation">
		<div class="title-top">
			<div class="clearfix">
				<el-breadcrumb class="fl">
					<el-breadcrumb-item >「{{title}}」页面参数配置</el-breadcrumb-item>
				</el-breadcrumb>
				<el-button @click="addRelation=true" class="edit-btn">添加页面元素</el-button>
			</div>
		</div>
		<!--内容区域-->
		<div class="main mt-50 ml-50 pl-50">
			<div class="clearfix">
				<label class="fl">商品图片：</label>
				<div class="fl">
					<img src="../../assets/goods.png" alt="" />
					<img src="../../assets/goods.png" alt="" />
					<img src="../../assets/goods.png" alt="" />
					<img src="../../assets/goods.png" alt="" />
				</div>
			</div>
			<div class="clearfix font-14">
				<div class="mt-20 title">
					<label>商品名称：</label>
					<el-input placeholder="请输入商品名称" readonly></el-input>
				</div>
				<div class="mt-20 fl pr-50 mr-30" v-for="info in data" key="$index">
					<label>{{info.name}}：</label>
					<el-input size="small" placeholder="请输入参数" readonly v-if="info.type==1"></el-input>
					<el-select size="small" v-model="value1" placeholder="请选择参数" clearable readonly v-if="info.type==2">
						<el-option v-for="v in value1" label="v.val" value="v.val" key="$index"></el-option>
					</el-select>
					<span class="width-148" v-if="info.type==3">{{title}}</span>
				</div>
				<ul>
					<li class="mt-20 fl pr-40" v-for="item in checkedList" key="$index">
						<label>{{item.parameterName}}：</label>
						<el-input size="small" readonly placeholder="请输入参数" v-if="item.inputType==1"></el-input>
						<el-select size="small" v-model="value1"  placeholder="请选择参数" clearable readonly v-if="item.inputType==3">
							<el-option v-for="v in item.value1"  :label="v.val" :value="v.val" key="$index"></el-option>
						</el-select>
						<el-button type="text" @click="remove(item)" class="delBtn ml-10">删除</el-button>
					</li>
				</ul>
			</div>
			<div class="mt-50 clearfix">
				<label class="fl">图文详情：</label>
				<UEeditor class="ml-5" ref="ueeditor" v-model="texteArea"></UEeditor>
			</div>
			<div class="mt-50 ml-100">
				<el-button class="ml-10" type="primary" @click="handleTemSave">保存配置</el-button>
				<el-button class="ml-50" @click="handleTemReset">重置模版</el-button>
			</div>
		</div>
		<!--设置关联参数-->
		<el-dialog title="页面元素" v-model="addRelation" @close="adClose">
			<div class="pl-20 pr-20 check">
				<template>
					<div class="clearfix">
						<el-checkbox-group v-model="checkList">
						   	<ul>
						   		<li v-for="par in parList" key="$index" class="fl mt-10 ml-0">
						   			<el-checkbox :label="par.id" @change="handlechange(par)">
								   		<span>{{par.parameterName}}</span>
								   	</el-checkbox>
								   	<span v-if="par.isBase==false">
							   			<i class="el-icon-edit color-blue ml-5" @click="handleEleEdit(par)"></i>
						            	<i class="el-icon-delete color-blue" @click="handleEleDelete(par)"></i>
							   		</span>
						   		</li>
						   	</ul>
						</el-checkbox-group>
					</div>
					<div class="mt-10 ml-0">
				   		<!--<el-checkbox class="mt-10 ml-0">-->
				   			<el-form label-width='0' :model="ruleForm" :rules="rules" ref="ruleForm">
								<el-form-item prop="eleName">
									<el-input class="font-12" v-model="ruleForm.eleName" placeholder="自定义元素" @blur=""></el-input>
						   			<el-button type="text" class="delBtn" @click="handleEleSave('ruleForm')">保存</el-button>
								</el-form-item>
					   		</el-form>
						<!--</el-checkbox>-->
				   	</div>
				</template>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="adSave">确 定</el-button>
				<el-button @click="addRelation = false">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import { axiosApi,basePath } from '../../api/api'
	export default{
		data(){
			return{
				rules:{eleName:[{min: 1,max: 8,message: '长度在 1到 8 个字符',trigger: 'change'}]},
				title: this.$route.params.name,
				value1: '',
				value2: '',
				texteArea: '',
				data:[
					{type:'1',name:'商品编码'},{type:'1',name:'条形码'},{type:'3',name:'分类'},{type:'2',name:'产地',value:[{val:'请选择参数'}]},
					{type:'2',name:'品牌',value:[{val:'请选择参数'}]},{type:'2',name:'包装'},{type:'1',name:'包装规格'},{type:'1',name:'建议零售价'},{type:'2',name:'计量单位'}
				],
				type: '1',
				ruleForm:{
					eleName:'',
				},
				id: '',
				addRelation: false,
				parList:[],//获取全部参数
				parcheckList:[],//弹窗选中参数
				checkList:[],//所选参数id
				checkedList:[]
			}
		},
		methods: {
			//获取某一分类参数信息
			getclassifyParList(){
				const api = "/goods/classifyParameterList/select";
				const body = {classifyId: this.$route.params.id};
				axiosApi(api, body,(res)=>{
					//console.log('success',res)
					if(res.data.data && res.data.data.spuParamterList) {
						this.checkedList = res.data.data.spuParamterList;
					}else{
						this.checkedList = [];
					}
					this.checkList=[];
					this.checkedList.forEach((item)=>{
						this.checkList.push(item.id);
					})
				},1,10,(res)=>{
					//console.log('err',res)
				})
			},
			//分类参数列表查询
			getParameterList(){
				const api = "/goods/spuParameterList/select";
				axiosApi(api, {},(res)=>{
					this.parList = res.data.data;
					this.id = ''
					this.ruleForm.eleName = '';
				},1,10,(res)=>{
					console.log('err',res)
				})
			},
			//自定义元素编辑
			handleEleEdit(par){
				this.ruleForm.eleName = par.parameterName;
				this.id = par.id;
			},
			//自定义元素
			handleEleSave(ruleForm){
				this.$refs[ruleForm].validate((valid) => {
		          	if (valid) {
		          		if(this.id){
							const api = "/goods/spuParameterUpdate/update";
							const body = {id:this.id,parameterName: this.ruleForm.eleName};
							axiosApi(api, body ,(res)=>{
								this.getParameterList();
							},1,10,(res)=>{
								this.$message({
				            		type: 'info',
					            	message: res.data.message,
					            	duration: 1000
					          	});
							})
						}else{
							const api = "/goods/spuParameter/insert";
							const body = {parameterName: this.ruleForm.eleName};
							axiosApi(api, body ,(res)=>{
								this.getParameterList();
							},1,10,(res)=>{
								this.$message({
				            		type: 'info',
					            	message: res.data.message,
					            	duration: 1000
					          	});
							})
						}	
		          	} else {
			            console.log('error submit!!');
			            return false;
		          	}
		        });			
			},
			//自定义元素删除
			handleEleDelete(par){
				const api = "/goods/spuParameterDelete/delete";
				const body = {id: par.id};
				axiosApi(api, body ,(res)=>{
					//console.log('success',res)
					this.$message({
	            		type: 'success',
		            	message: '删除成功！',
		            	duration: 1000
		          	});
					this.getParameterList();
				},1,10,(res)=>{
					//console.log('err',res)
					this.$message({
	            		type: 'info',
		            	message: res.data.message,
		            	duration: 1000
		          	});
				})			
			},
			//监控选择状态
			handlechange(){
				this.parcheckList = [];
				this.checkList.forEach((item1)=>{
					//console.log(item1)
					this.parList.forEach((item2)=>{
						if(item1 == item2.id) {
							this.parcheckList.push(item2)
						}
					})
				})
			},
			//弹窗保存
			adSave(){
				this.addRelation = false;
				this.checkedList = this.parcheckList;
			},
			//弹窗关闭
			adClose(){
				this.checkList = [];
				this.checkedList.forEach((item)=>{
					this.checkList.push(item.id)
				})
			},
			//删除某一已设置参数
			remove(item){
				let index = this.checkedList.indexOf(item);
		        if (index !== -1) {
		          this.checkedList.splice(index, 1)
		          this.checkList.splice(index,1)
		        };
			},
			//模版保存
			handleTemSave(){
				let h = this.$createElement;
				this.$msgbox({
					title: '提示信息',
					message: h('p', null, [
						h('p', {style:'text-align:center'}, '是否确认保存您的修改？'),
					]),
					showCancelButton: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					beforeClose: (action, instance, done) => {
						if(action === 'confirm') {
							this.Save()
							this.$router.push(basePath + '/proCation')
							done()
						} else {
							done()
						}
						delete instance.$slots.default;
					}
				})
			},
			Save(){
				this.texteArea = this.$refs.ueeditor.getContent();
				const api = "/goods/classifyParameterRelation/update";
				const body = {
					classifyId: this.$route.params.id,
					parameterId: this.checkList.join(",")};
				axiosApi(api, body ,(res)=>{
					//console.log('success',res)
					this.$message({
	            		type: 'success',
		            	message: '保存成功',
		            	duration: 1000
		          	});
		          	this.getclassifyParList();
				},1,10,(res)=>{
//					console.log('err',res)
					this.$message({
	            		type: 'info',
		            	message: res.data.message,
		            	duration: 1000
		          	});
				})	
			},
			//重置模版
			handleTemReset(){
				let h = this.$createElement;
				this.$msgbox({
					title: '提示信息',
					message: h('p', null, [
						h('p', {style:'text-align:center'}, '是否确认重置模版？ '),
						h('p', {style:'text-align:center;color:#999;margin-top:10px'}, '重置模版后，您未保存的信息将被覆盖 ')
					]),
					showCancelButton: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					beforeClose: (action, instance, done) => {
						if(action === 'confirm') {
							this.getclassifyParList();
							done()
						} else {
							done()
						}
						delete instance.$slots.default;
					}
				})
			}
		},
		mounted(){
			this.$nextTick(function(){
				this.getclassifyParList();
				this.getParameterList();
			})
		}
	}
</script>
<style lang="less">
	#proRelation{
		.option .el-form-item__label{
			width: 120px;
		}
		img{
			width: 90px;
			height: 90px;
			margin-left: 5px;
		}
		.main label{
			width: 100px;
			text-align: right;
			display: inline-block;
			margin-right: 5px;
		}
		.delBtn{
			width: 26px;
		}
		.width-148{
			width: 148px;
			display: inline-block;
		}
		.title .el-input{
			width: 400px;
		}
		.check{
			height: 300px;
			overflow-y: auto;
			ul li{
				display: inline-block;
				width: 147px;
			}
			i{
				font-size: 10px;
			}
			.el-input{
				width: 92px;
				.el-input__inner{
					height: 26px !important;
				}
			}
		}
		
	} 
</style>