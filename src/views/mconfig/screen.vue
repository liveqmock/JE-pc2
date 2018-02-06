<template>
	<div id="screen">
		<div class="title-top">分类筛选项</div>
		<div class="mr-30 ml-30 mt-30">
			<template>
			  <el-table :data="tableData" border style="width: 100%">
			    <el-table-column label="分类名称" width="380">
			    	<template scope="scope">
			    		<span>{{scope.row.classifyName}}</span>
			    	</template>
			    </el-table-column>
			    <el-table-column label="操作">
			    	<template scope="scope">
			    		<el-button v-if='showButton("OPTION",100024)' type="text" @click.native="handleAdd(scope)">筛选项配置</el-button>
			    	</template>
			    </el-table-column>
			  </el-table>
			</template>
		</div>
		<!--弹出框-->
		<!--<el-dialog title="分类筛选项" v-model="isShowAddDialog">
			<el-form :model='form' label-width='170px' class="mt-40">
				<el-form-item label="分类:">
					<span class="ml-10">{{form.classifyName}}</span>
				</el-form-item>
				<el-form-item label="筛选项:">
					<el-checkbox-group v-model="form.checkList" >
					    <el-checkbox class='mb-10 ml-10' v-for='(item,index) in filterBaseList' key="$index" :label="item.id">{{item.filterName}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleSaveAdd()">确 定</el-button>
				<el-button @click="handleCancelAdd()">取 消</el-button>
			</div>
		</el-dialog>-->
	</div>
</template>

<script>
	import { axiosApi, basePath } from '../../api/api';
	
	export default{
		data(){
			return{
				form:{checkList:[], classifyId:0, classifyName:''},
				isShowAddDialog:false,
				filterBaseList:[],
				tableData: []
			}
		},
		methods:{
			loadClassifyList(){
				axiosApi("/goods/classifyTopList/select", null, (res)=>{
					this.tableData = res.data.data;
				});
			},
			loadFilterBaseList(){
				axiosApi("/goods/filterBaseList/select", null, (res)=>{
					this.filterBaseList = res.data.data;
				});
			},
			
			handleAdd(scope){
//				console.log(scope)
				this.$router.push(basePath+'/addScreen/' + scope.row.id);
//				this.isShowAddDialog = true;
//				this.form.classifyId = scope.row.id;
//				this.form.classifyName = scope.row.classifyName;
//				
//				axiosApi("/goods/classifyFilterRelation/select", {"classifyId":scope.row.id}, (res)=>{
//					if (null != res.data.data && null != res.data.data.filterId && res.data.data.filterId.length > 0) {
//						let cls = res.data.data.filterId.split(",");
//						this.form.checkList = [];
//						for (let i=0; i<cls.length; ++i) {
//							this.form.checkList.push(parseInt(cls[i]));
//						}
//					} else {
//						this.form.checkList = [];
//					}
//				});
			},
//			handleSaveAdd(){
//				let filterIdStr = "";
//				for (let i=0; i<this.form.checkList.length; ++i) {
//					filterIdStr += (this.form.checkList[i] + ",");
//				}
//				if (filterIdStr.length > 0) {
//					filterIdStr = filterIdStr.substr(0, filterIdStr.length-1);
//				} else {
//					filterIdStr = null;
//				}
//				axiosApi("/goods/classifyFilterRelation/update", {"classifyId":this.form.classifyId, "filterId":filterIdStr}, (res)=>{
//					this.$message({
//						type: 'info',
//						message: '编辑成功'
//					});
//				});
//				
//				this.isShowAddDialog = false;
//			},
//			handleCancelAdd(){
//				this.isShowAddDialog = false;
//			},
		},
		mounted(){
			this.loadClassifyList();
			this.loadFilterBaseList();
			
			if (this.notExistWangMin) {
				this.wangmin = '作者王敏, QQ591593903';
			}
		}
	}
</script>

<style lang="less">
	#screen{
		.cell{
			text-align: center;
		}
		.el-checkbox-group{
			padding-right: 50px;
		}
	}
</style>