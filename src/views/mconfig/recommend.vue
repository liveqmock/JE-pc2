<template>
	<div id="recommend">
		<div class="title-menu">
			<div class="clearfix">
				<el-breadcrumb class="fl">
					<el-breadcrumb-item>首页推荐商品</el-breadcrumb-item>
				</el-breadcrumb>
				<el-button v-if='this.selGoodsTypeId==1 && showButton("ADD_PR",100023)' class="edit-btn mr-30" @click.native="handleAdd()">添加商品</el-button>
				<el-button v-if='this.selGoodsTypeId==2 && showButton("ADD_RE",100023)' class="edit-btn mr-30" @click.native="handleAdd()">添加商品</el-button>
				<span class="fr mr-30 font-12 site">
					<template>
						<el-select size="mini" v-model="selSite" placeholder="请选择站点" @change="checkSite">
						    <el-option v-for="item in siteList" key="$index" :label="item.name" :value="item.id">{{item.name}}
						    </el-option>
						</el-select>
					</template>
				</span>
			</div>
			<el-tabs  v-model="selGoodsTypeId" @tab-click="selGoodsTypeChanged()">
				<el-tab-pane label="促销商品" name="1"></el-tab-pane>
				<el-tab-pane label="新品推荐" name="2"></el-tab-pane>
			</el-tabs>
		</div>
		
		<div class="mr-30 ml-30">
			<div class="mt-30 tab">
				<el-table :data="tableData" border style="width: 100%">
					<el-table-column label="缩略图" width="120">
				    	<template scope="scope">
				    		<img v-if='scope.row.skuVO.fileUrl' :src="scope.row.skuVO.fileUrl" />
							<img v-else src='../../assets/goods.png' />
				    	</template>
				    </el-table-column>
				    <el-table-column label="商品名称">
				    	<template scope="scope">
				    		<span>{{scope.row.skuVO.skuName}}</span>
				    	</template>
				    </el-table-column>
				    <el-table-column label="所属店铺" width="150">
				    	<template scope="scope">
				    		<span>{{scope.row.storeName}}</span>
				    	</template>
				    </el-table-column>
				    <el-table-column label="分类" width="150">
				    	<template scope="scope">
				    		<span>{{scope.row.skuVO.classifyName}}</span>
				    	</template>
				    </el-table-column>
				    <el-table-column label="操作" width="150">
				    	<template scope="scope">
			    			<el-button v-if="scope.$index!=0 && showButton('TOP_PR',100023) && scope.row.state==1" type="text" @click.native="handleTop(scope)">置顶</el-button>
				    		<el-button type="text" v-if='showButton("DEL_PR",100023) && scope.row.state==1' @click.native="handleDelete(scope)" >删除</el-button>
			    			<el-button v-if="scope.$index!=0 && showButton('TOP_RE',100023) && scope.row.state==2" type="text" @click.native="handleTop(scope)">置顶</el-button>
				    		<el-button type="text" v-if='showButton("DEL_RE",100023) && scope.row.state==2' @click.native="handleDelete(scope)" >删除</el-button>
				    		<!--<el-dropdown> 
	                            <span class="el-dropdown-link">
	                               	 操作<i class="el-icon-caret-bottom el-icon--right"></i>
	                            </span>
	                            <el-dropdown-menu slot="dropdown" >
	                            	<el-dropdown-item class="son" :disabled="scope.$index==0" @click.native="handleTop(scope)">置顶</el-dropdown-item>
	                                <el-dropdown-item class="son" @click.native="handleDelete(scope)" >删除</el-dropdown-item>
	                            </el-dropdown-menu>
	                        </el-dropdown>-->
				    	</template>
				    </el-table-column>
				</el-table>
				<el-pagination v-if='totalCount>0' class="tar"
	                :current-page = "currentPage"
	                :page-size = '10'
	                :total = 'totalCount'
	                layout = "prev , pager, next, jumper"
	                @current-change='handleCurrentChange'>                
	            </el-pagination>
			</div>
		</div>
		<!--弹出框-->
		<el-dialog title="选择商品" :visible.sync="isShowAddDialog" @close="goBackPage">
			<el-form :inline="true" :model="chooseGoodsForm" label-width="80px" class="clearfix" :style="{width:'850px'}">
				<div class="fl">
					<el-form-item label="店铺名称:">
						<el-select v-model='chooseGoodsForm.storeId' 
									filterable 
									clearable 
									placeholder='请输入关键词' 
									remote
									:remote-method="getStoreList" >
							<el-option v-for="store in storeList"  key='$index' :label='store.storeName' :value='store.id'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="商品名称:">
						<el-input  v-model.trim="chooseGoodsForm.skuName"></el-input>
					</el-form-item>
				</div>
				<el-button type="primary" class="fl ml-50" @click="handleSearch()">查询</el-button>
			</el-form>
			<el-table @selection-change="handleSelectionChange" v-loading='loading' :data="goodsList" border tooltip-effect="dark" class="mt-10 table-default">
				<el-table-column type="selection" width="50">
				</el-table-column>
				<el-table-column label="店铺名称" prop="storeName">
				</el-table-column>
				<el-table-column label="商品名称" prop="skuName"  width="350" show-overflow-tooltip>
				</el-table-column>
				<el-table-column label="单位" prop="units">
				</el-table-column>
				<el-table-column label="分类" prop="classifyName">
				</el-table-column>
				<el-table-column label="价格" >
					<template scope="scope">
						￥{{scope.row.enterShopPrice | fmoney}}
					</template>
				</el-table-column>
			</el-table>
			<el-pagination class="tar" v-if='total>0'
				:current-page="curPage"
				:page-size='10'
				:total='total'
				layout="prev , pager, next, jumper"
				@current-change="handlePageChange">
			</el-pagination>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleSave()">确 定</el-button>
				<el-button @click="goBackPage">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { axiosApi, basePath } from '../../api/api';
	export default{
		data(){
			return{
				siteList: [],
		        selSite: '',
				options: [{value: '1',label: '杭州'}, {value: '2',label: '温州'}, {value: '3',label: '台州'}],
		        value: '',
		        selGoodsTypeId:'1',
		        tableData: [],
		        totalCount:0, 
		        currentPage:1,
		        total: 0,//弹出框分页
              	curPage:1,//弹出框分页
				isShowAddDialog: false,
				
				chooseGoodsForm:{
					storeId: '',    
					skuName: '',      //商品分类
				},
				goodsList:[],//商品列表
				loading:false,     //搜索时
				storeList:[],//店铺列表
				scrList:[],//过滤已有商品Id
				checkedlist:[],//选中商品
				checkIdList:[],//选中商品Id
			}
		},
		methods:{
			loadSiteList() {
				axiosApi("/unlogin/foundation/site/selectAll", null, (res)=>{
					if(res.data.data.length>0){
						this.siteList = res.data.data;
						this.selSite = this.siteList[0].id;
					}else{
						this.siteList = []
					}
				});
			},
			//选择站点
			checkSite(){
				sessionStorage.districtId = this.selSite;
				this.loadTableData(this.currentPage, 10);
			},
			loadTableData(pageIndex, pageSize) {
				let goodsType = parseInt(this.selGoodsTypeId);
				axiosApi("/goods/goodsRecommendPage/select", {"goodsType":goodsType,districtId:this.selSite}, (res)=>{
					this.tableData = res.data.data.elements;
					this.totalCount = res.data.data.totalCount;
					this.tableData.forEach((item)=>{
						this.scrList.push(item.skuVO.id);
						item.state = this.selGoodsTypeId;
					})
				}, pageIndex, pageSize, null);
			},
			//分页
			handleCurrentChange(val){
				this.currentPage = val;
				this.loadTableData(this.currentPage, 10);
			},
			selGoodsTypeChanged(){
				this.handleCurrentChange(1);
				console.log(this.selGoodsTypeId)
			},
			//置顶
			handleTop(scope){
				scope.row.gmtModified = (new Date()).getTime();
				axiosApi("/goods/goodsRecommend/update", scope.row, (res)=>{
					this.$message({
						type: 'success',
						message: '操作成功',
						duration: 3000
					});
					this.loadTableData(this.currentPage, 10);
				});
			},
			//删除
			handleDelete(scope){
				const h = this.$createElement
				this.$msgbox({
					title: '提示信息',
					message: h('p', {style: 'text-align:center'}, '是否确认删除该商品？'),
					showCancelButton: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					beforeClose: (action, instance, done) => {
						if(action === 'confirm') {
							axiosApi("/goods/goodsRecommend/delete", {"id":scope.row.id}, (res)=>{
								this.loadTableData(this.currentPage, 10);
							});
							this.$message({
								type: 'success',
								message: '操作成功',
								duration: 3000
							});
							done()
						} else {
							done()
						}
						delete instance.$slots.default;
					}
				})
			},
			//获取所有店铺列表
			getStoreList(query){
				axiosApi("/trader/findTraderLikeStoreName/page/select", { storeName: query } , (res)=>{
//					console.log(res,'店铺列表')
					this.storeList = res.data.data.elements;
				},1,100);
			},
			//可以添加的商品
			goodsSkuCustomSearch(body) {
				this.loading = true
				axiosApi('/goods/skuInfoPage/select', body, (res) => {
					this.loading = false
					//console.log('可以添加的商品', res)
					if(res.data.data != null) {
						this.goodsList = res.data.data.elements;
						this.total = res.data.data.totalCount
					} else {
						this.dialogTableVisible = false
						let h = this.$createElement;
						this.$msgbox({
							title: '提示信息',
							message: h('p', {
								style: 'text-align:center'
							}, '没有可以添加的商品！'),
							showCancelButton: false,
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							beforeClose: (action, instance, done) => {
								if(action === 'confirm') {
									done()
								} else {
									done()
								}
								delete instance.$slots.default;
							}
						})
					}
				}, this.curPage, 10, (res) => {
					this.loading = false
				})
			},
			//添加商品弹出框呼出
			handleAdd(){
				this.chooseGoodsForm = {
					storeId: '',    
					skuName: ''
				}
				this.isShowAddDialog = true;
				this.getStoreList("");
				this.handleSearch();
			},
			//弹出框搜索
			handleSearch(){
				if(this.curPage == 1){
	        		this.goodsSkuCustomSearch({
						isRecommendGoodsId: true,
						districtId:this.selSite,
						goodsType:this.selGoodsTypeId,
						skuState: 2,
						auditState: 2,
						skuName: this.chooseGoodsForm.skuName,
						sellerId: this.chooseGoodsForm.storeId
					})
	        	}else{
	        		this.curPage = 1
	        	}
			},
			//弹出框分页
			handlePageChange(val){
				this.curPage = val;
				this.goodsSkuCustomSearch({
					isRecommendGoodsId: true,
					districtId:this.selSite,
					goodsType:this.selGoodsTypeId,
					skuState: 2,
					auditState: 2,
					skuName: this.chooseGoodsForm.skuName,
					sellerId: this.chooseGoodsForm.storeId
				})
			},
			//选择商品
			handleSelectionChange(val){
				this.checkedList = val;
				this.checkIdList = [];
				this.checkedList.forEach((item)=>{
					this.checkIdList.push(item.id)
				})
			},
			//保存
			handleSave(){
//				console.log(this.selGoodsTypeId)
//				console.log(this.checkIdList)
				axiosApi("/goods/goodsRecommend/insert", { goodsType:this.selGoodsTypeId,skuIds:this.checkIdList,districtId:this.selSite } , (res)=>{
//					console.log(res,'推荐商品添加')
					this.$message({
						type: 'success',
						message: '操作成功',
						duration: 3000
					});
					this.isShowAddDialog = false;
					this.loadTableData(this.currentPage, 10);
				});
			},
			//取消
			goBackPage(){
				this.isShowAddDialog = false;
				this.handleSearch();
			}
		},
		mounted(){
			this.loadSiteList();
			//this.loadTableData(this.currentPage, 10);
		}
	}
</script>

<style lang="less">
	#recommend{
		/*.el-tabs__header{
			padding-left: 0;
		}*/
		.site{
			 margin: 24px 30px 0 20px;
		}
		.tab{
			.el-button{
				width: auto;
			}
			.cell{
				text-align: center;
			}
			img{
				width: 60px;
				height: 60px;
			}
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
		
	}
</style>