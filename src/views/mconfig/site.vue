<template>
	<div id="site">
		<div class="title-menu">
			<div class="clearfix">
				<el-breadcrumb class="fl">
					<el-breadcrumb-item>站点管理</el-breadcrumb-item>
				</el-breadcrumb>
				<!--<el-button v-if='showButton("ADD",100025)' class="edit-btn mr-30" @click="isShowAddSiteDialog=true">新增站点</el-button>-->
				<el-button v-if='showButton("ADD",100025)' class="edit-btn mr-30" @click="goToAddSite">新增站点</el-button>
			</div>
			<el-tabs  v-model="activeTab">
				<el-tab-pane label="所有站点" name="1"></el-tab-pane>
			</el-tabs>
		</div>
		
		<div class="mr-30 ml-30">
			<div class="mt-30 tab">
				<template>
				  <el-table :data="siteList" border style="width: 100%">
				    <el-table-column label="站点名称" width="260">
				    	<template scope="scope">
				    		<span>{{scope.row.name}}</span>
				    	</template>
				    </el-table-column>
				    <el-table-column label="开通时间" width="260">
				    	<template scope="scope">
				    		<span>{{scope.row.gmtCreate | time}}</span>
				    	</template>
				    </el-table-column>
				    <el-table-column label="操作">
				    	<template scope="scope">
				    		<router-link :to="basePath +'/sitepreview?name='+ scope.row.name+'&id='+scope.row.id" target="_blank">
					    		<el-button type="text" class="siteInfo-btn">预览</el-button>
					    	</router-link>
							<el-button type="text" class="siteInfo-btn" @click="seeDetails(scope.row)">查看详情</el-button>
							<el-button type="text" class="siteInfo-btn" @click="editSite(scope.row)">编辑站点</el-button>
							<!--<el-button type="text" class="siteInfo-btn" >删除站点</el-button>-->
				    	</template>
				    </el-table-column>
				  </el-table>
				</template>
			</div>
		</div>
		<!--开通站点弹出框-->
		<!-- <el-dialog class="add-site-dialog" title="请选择需要开通的站点" v-model="isShowAddSiteDialog"> -->
			<!--<el-form>
				<el-form-item label="省:" required class="mt-50 pt-10">
					<el-select v-model="selProvinceName" clearable placeholder="请选择省" @change="selProvinceChanged()">
						<el-option v-for="item in provinceList" :label="item.text" :value="item.text" :key="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="市:" required>
					<el-select v-model="selCityName" clearable placeholder="请选择市" @change="selCityChanged()">
						<el-option v-for="item in cityList" :label="item.text" :value="item.text" :key="item.id"></el-option>
					</el-select>
				</el-form-item>
			</el-form>-->
			<!--<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="addSite()">确定</el-button>
				<el-button @click="isShowAddSiteDialog=false">取消</el-button>
			</div>-->
		<!-- </el-dialog> -->
		<!--站点详情显示-->
		<el-dialog :title="title" v-model='isShow' class="site-info-dialog">
			<div class="mb-20" v-for="i in areas">
				<div class="siteP font-16">{{i.label}}</div>
				<div class="site-flex mt-10" v-for="n in i.sub">
					<div class="siteC font-16">{{n.label}}</div>
					<div class="siteA font-14" >
						<span v-for="m in n.sub">{{m.label}}</span>
					</div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { axiosApi, basePath } from '../../api/api';
	import { rawCitiesData } from '../../city-region.js'
	import { bus } from "../../main";
    import { MessageBox } from 'element-ui';
	
	export	default{
		data(){
			return{
				basePath: basePath,
				provinceList: [],
				cityList: [],
				selProvinceName: '',
				provinceName: '',
				provinceId: '',
				selCityName: '',
				cityId:'',
				site:{province:'', city:''},
				isShowAddSiteDialog:false,
				activeTab:'1',
				siteList: [],
				isShow: false, //显示开通的站点详情 弹框
				title: "", //站点详情弹框 标题
				formArea:{
					site: null,//需要开通的站点
				},
				areas:[], //单个站点 地区
			}
		},
		methods:{
			editSite(row){ //编辑站点 (传递站点ID)
				this.$router.push({name:'addSite',query:{id:row.id,name:row.name}})
			},
			loadSiteList() {//加载列表
				axiosApi("/unlogin/foundation/site/selectAll", null, (res)=>{
					//console.log(res,'站点信息')
					this.siteList = res.data.data;
				});
			},
//			loadDistrictTree() {
//				axiosApi("/foundation/district/displayTree", null, (res)=>{
//					let newTree = res.data.data;
//					for (let i=newTree.length-1; i>=0; --i) {
//						let provinceChildren = newTree[i].sub;
//						for (let j=provinceChildren.length-1; j>=0; --j) {
//							provinceChildren[j].sub = null;
//						}
//					}
//					this.provinceList = newTree;
//					//console.log(this.provinceList)
//				});
//			},
//			selProvinceChanged() {
//				for (let i=this.provinceList.length-1; i>=0; --i) {
//					if (this.provinceList[i].text == this.selProvinceName) {
////						console.log(this.provinceList[i])
//						this.provinceName = this.provinceList[i].text;
//						this.provinceId = this.provinceList[i].id;
//						this.cityList = this.provinceList[i].sub;
//						this.selCityName = this.cityList[0].text;
//						this.cityId = this.cityList[0].id;
//						break;
//					}
//				}
//			},
//			selCityChanged(){
//				for (let i=this.cityList.length-1; i>=0; --i) {
//					if (this.cityList[i].text == this.selCityName) {
////						console.log(this.cityList[i])
//						this.cityId = this.cityList[i].id;
//						break;
//					}
//				}
//			},
//			addSite() {//新增站点
//				console.log(this.cityId)
//				axiosApi("/foundation/site/insert", {name:this.selCityName,cityId:this.cityId,provinceId:this.provinceId,provinceName:this.provinceName}, (res)=>{
//					this.loadSiteList();
//					this.$message({
//						type: 'success',
//						message: '添加成功',
//						duration: 3000
//					});
//				},1,10,(res)=>{
//					this.$message({
//						type: 'info',
//						message: res.data.message,
//						duration: 3000
//					});
//				});
//				
//				this.isShowAddSiteDialog = false;
//			},
			goToAddSite(){
				this.$router.push(`${basePath}/addSite`)
			},
            seeDetails(row){//查看详情 获取站点数据
				this.title = `「${row.name}」站点配置详情`
				axiosApi('/unlogin/foundation/site/selectInfo',{id:row.id},(res)=>{
					console.log(res,'站点详细数据')
					if(res.data.data!=null){
						if(!res.data.data.districts){
	                        MessageBox.alert("没有站点信息", '提示信息', {
	                            confirmButtonText: '确定'
	                        });
							return false;
						}
					}else{
						MessageBox.alert("没有站点信息", '提示信息', {
                            confirmButtonText: '确定'
                        });
						return false;
					}
					
					this.isShow = true
					let districts = JSON.parse(res.data.data.districts)
					this.areas = []
					rawCitiesData.forEach(item => { //省
						districts.forEach((i)=>{
							if(i.id == item.value){ //省相等
								let arr = []
								item.children.forEach(item1 => { //市
									i.sub.forEach((i1)=>{
										if(i1.id == item1.value){
											arr.push({
												"id": item1.value,
												'label':item1.label,
												"sub":(function (item1,i1){
													let arr1 = []
													item1.children.forEach(item2 => {
														i1.sub.forEach((i2)=>{
															if(i2.id == item2.value){
																arr1.push({
																	id:item2.value,
																	label:item2.label
																})
															}
														})
													})
													return arr1
												}(item1,i1))
											})
										}
									})
									
								})
								this.areas.push({
									"id": item.value,
									'label':item.label,
									"sub": arr
								})
							}
						})
					})
				})
			},
		},
		mounted(){
			this.loadSiteList();//默认加载列表
//			this.loadDistrictTree();
		}
	}
</script>

<style lang="less">
	#site{
		.tab .cell{
			text-align: center;
			.siteInfo-btn{
				font-size: 12px;
				width:auto;
				height:auto;
			}
		}
		.el-form-item__label{
			width: 140px;
		}
	}
	/*.add-site-dialog{
		.el-dialog--small{width: 700px;}
		
	}*/
	.site-info-dialog{
		.el-dialog--small{
			width: 700px;
			.el-dialog__body{
				padding:30px 30px 50px 30px;
				height:450px;
				overflow: auto;
			}
			.siteP{padding-bottom: 10px;}
			.site-flex{
				display: flex;
				background: #DDDDDD;
				padding-left:30px;
				align-items: center;
				.siteC{
					width:100px;
					box-sizing: border-box;
				}
				.siteA{
					width: calc(~"100% - 100px");
					margin-top: 10px;
					span{
						display: inline-block;
						margin: 0px 10px 10px 0;
					}
				}
			}
		}
	}
</style>