0<template>
	<div id="proManagement">
			<div class="title-menu">
				<div class="clearfix">
					<el-breadcrumb class="fl">
						<el-breadcrumb-item>商品库管理</el-breadcrumb-item>
					</el-breadcrumb>
					<el-button v-if='showButton("ADD",100001)' class="edit-btn mb-10" @click="dialogFormVisible = true">添加商品</el-button>
				</div>
				<el-tabs v-model="activeTab" class='clearfix' @tab-click="handleTabClick">
					<el-tab-pane v-for="item in tabsData" key='$index' :label="item.val" :name="item.id">
					</el-tab-pane>
				</el-tabs>
			</div>
			<!--添加商品-->
			<el-dialog title="设置分类" v-model="dialogFormVisible">
				<p class="mb-20">请选择您要添加的商品分类</p>
				<el-select placeholder="选择所属分类" v-model='form1.classifyId'>
					<el-option v-for='item in searchClassify' key='$index' :label="item.classifyName" :value="item.id"></el-option>
				</el-select>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="addProduct">去添加</el-button>
				</div>
			</el-dialog>
			<!--JDE-->
			<el-dialog title="更新商品信息" v-model="jde">
				<el-form :inline="true" :model="form2" class="clearfix boom" :rules="rules" ref="form2">
					<el-form-item label="商品名称:">
						<el-input v-model.trim="goodsName" disabled></el-input>
					</el-form-item>
					<el-form-item label="jde商品编码:">
						<el-input v-model.trim="jdeGoodsNo" disabled></el-input>
					</el-form-item>
					<el-form-item label="分布场所:" prop='enterport'>
						<el-input placeholder="填写更新仓库" v-model.trim="form2.enterport"></el-input>
					</el-form-item>

				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click='updateEntreport("form2")'>确 定</el-button>
					<el-button @click="jde=false">取 消</el-button>
				</div>
			</el-dialog>
			
		<!--插入页面-->
		<div id="supplier-content-div" class='clearfix mt-30 mr-30 ml-30'>
			<el-form :inline="true" :model="formInlineData" class="clearfix search">
				<div class="fl width-70">
					<el-form-item label="商品编码:">
						<el-input placeholder="请输入商品编码" v-model.trim="formInlineData.spuNo"></el-input>
					</el-form-item>
					<el-form-item label="商品名称:">
						<el-input placeholder="请输入商品名称" v-model.trim="formInlineData.spuName"></el-input>
					</el-form-item>
					<el-form-item label="商品品牌:">
						<el-select v-model="formInlineData.brandId" placeholder="请选择品牌" filterable>
							<el-option :label="item.brandName" :value="item.id" v-for='item in searchBrandName' key='$index'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="商品分类:">
						<el-select v-model="formInlineData.classifyId" filterable placeholder="请输入分类">
							<el-option :label="item.classifyName" :value="item.id" v-for='item in searchClassify' key='$index'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="状态:" clearable>
						<el-select v-model="formInlineData.isDisable" placeholder="请选择状态" @change="handleIsDisableSearch">
							<el-option label="启用" value=false></el-option>
							<el-option label="停用" value=true></el-option>
						</el-select>
					</el-form-item>
				</div>
				<el-button type="info" class="ml-40 fl" @click='handleSearch'>查询</el-button>

			</el-form>
			<div class="supplier-table-div mt-10">
				<el-table :data="productTableData" v-loading="Loading" stripe>
					<!-- 商品列表-->
					<!--<el-table-column type="selection"></el-table-column>-->
					<el-table-column label="商品名称" width="340px">
						<template scope="scope">
							<div class="fl">
								<img v-if='scope.row.defaultPicture' :src="scope.row.defaultPicture" />
								<img v-else src='../../assets/goods.png' />
							</div>
							<div class="fl">
								<div class="lh-12">商品编码:{{scope.row.spuNo}}</div>
								<div class="width-230" show-overflow-tooltip>{{scope.row.spuName}}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="规格" width="80px">
						<template scope="scope">
							<div>1*{{scope.row.specInfoNum}}</div>
						</template>
					</el-table-column>
					<el-table-column label="分类" width="95px">
						<template scope="scope">
							<div>{{scope.row.classifyName}}</div>
						</template>
					</el-table-column>
					<el-table-column label="品牌" width="95px">
						<template scope="scope">
							<div>{{scope.row.brandName}}</div>
						</template>
					</el-table-column>
					<el-table-column label="建议零售价" width="120px">
						<template scope="scope">
							<div>￥{{scope.row.msrp}}</div>
						</template>
					</el-table-column>
					<el-table-column label="状态">
						<template scope="scope">
							<span v-if="scope.row.isDisable == true">停用</span>
							<span v-if="scope.row.isDisable == false">启用</span>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="126px" align="center">
						<template scope='scope'>
							<el-button v-if='showButton("SYCN",100001) || showButton("UPD_JDE",100001)' class=' tal' size="small" type='text' @click.native="startHacking(scope.$index, productTableData)">{{scope.row.jdeGoodsNo==null?'同步至JDE':'更新JDE'}}</el-button>
							<router-link v-if='showButton("EDIT",100001)' :to="`${basePath}/proDetails?id=${scope.row.spuNo}`">
								<el-button  class='ml-0 tal' size="small" type='text'>编辑</el-button>
							</router-link>
							<router-link v-if='showButton("EDIT",100001)' :to="{ path: 'proDetails', query: { id: scope.row.spuNo, iscopy: 1 }}">
								<el-button  class='ml-0 tal' size="small" type='text'>复制并新增</el-button>
							</router-link>
							<el-button v-if='showButton("DISA",100001)' class='ml-0 tal' size="small" type='text' @click.native='handleIsDisable(scope.$index,productTableData)'>{{scope.row.isDisable==false?'停用':'启用'}}</el-button>
							<el-button v-if='showButton("DEL",100001)' class='ml-0 tal' size="small" type='text' @click.native="deleteRow(scope.$index, productTableData)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination class="tar" v-if="total>0" :current-page="currentPage" :page-size='10' :total='total' layout="prev , pager, next, jumper" @current-change="handleCurrentChange">
					<!-- 分页组件 -->
				</el-pagination>
			</div>
		</div>

	</div>
</template>
<script>
	import { MessageBox } from 'element-ui';
	import { axiosApi, basePath } from "../../api/api";
	export default {
		data() {
			return {
				tabsData: [{
					id: '2',
					val: '商品库'
				}],
				title: '',
				activeTab: '2',
				dialogFormVisible: false,
				jde: false,
				//				选项form
				form1: {
					classifyName: null,
					classifyId: null
				},
				classificationList: [], //添加商品-品类
				classificationListSon: [], //添加商品-品类-选择
				formLabelWidth: '85px',
				activeName: 'second',
				formInlineData: {
					spuName: null,
					state: null,
					classifyName: null,
					classifyId: null,
					brandName: null,
					brandId: null,
					isDisable: null,
					spuNo: null,
					id: null
				}, //查询
				formclassificationList: {},
				productTableData: [], //商品列表
				searchBrandName: [], //搜索品牌
				searchClassify: [], //搜索分类
				//				分页
				currentPage: 1,
				total: 0,
				isPagination: true,
				Loading: true,
				api: null,
				body: null,
				goodsName: null,
				goodsNo: null,
				jdeGoodsNo: null,
				form2: {
					enterport: null
				},
				rules: {
					enterport: [{
							pattern: /^[0-9,]+$/,
							message: '请输入正确的仓库编码，多个可用逗号隔开',
							trigger: 'blur'
						},
						{
							required: true,
							message: '仓库编码不能为空',
							trigger: 'blur'
						}
					]
				}

			}
		},
		methods: {
			handleSearch(){ //查询操作
				if(this.currentPage !== 1){
					this.currentPage = 1
					return false
				}
				this.achieve()
			},
			achieve() {//商品列表接口
				const api = "/goods/spuInfoList/select";
				const body = {
					isAll: true,
					spuName: this.formInlineData.spuName,
					classifyId: this.formInlineData.classifyId,
					brandId: this.formInlineData.brandId,
					spuNo: this.formInlineData.spuNo,
					isDisable: this.formInlineData.isDisable
				}
				axiosApi(api, body, this.callback, this.currentPage, 10)
			},
			callback(res) {
				this.productTableData = res.data.data.elements ? res.data.data.elements : [];
				this.total = res.data.data.totalCount ? res.data.data.totalCount : '';
				this.Loading = false;
			},
			//			搜索条件  启用，停用的改变
			handleIsDisableSearch(val) {
				if(val == "") {
					this.formInlineData.state = ""
				} else {
					this.formInlineData.state = '2'
				}
			},
			//			启用/停用改变
			handleIsDisable(index, rows) {
				let _this = this;
				if(this.productTableData[index].isDisable == true) {
					this.title = '启用';
					this.api = "/goods/spuInfoEnable/update";
					this.body = {
						id: this.productTableData[index].id,
						spuNo: this.productTableData[index].spuNo
					};
				} else {
					this.title = '停用';
					this.api = "/goods/spuInfoDisable/update";
					this.body = {
						id: this.productTableData[index].id,
						spuNo: this.productTableData[index].spuNo
					};
				}
				this.$confirm('您是否要「' + this.title + '」？', '提示信息', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					const api = this.api;
					const body = this.body;
					axiosApi(api, body, (res) => {
						this.$message({
							type: 'success',
							message: '修改成功！'
						});
						this.achieve()
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消操作！'
					});
				})

			},
			//			删除商品
			deleteRow(index, rows) {
				let that = this;
				this.$confirm('您确定要删除这条商品信息？', '提示信息', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					const api = "/goods/spuInfoDelete/update";
					const body = {
						id: this.productTableData[index].id,
						spuNo: this.productTableData[index].spuNo
					};
					axiosApi(api, body, (res) => {
						this.$message({
							type: 'success',
							message: '删除成功!',
							duration: 1000
						});
						that.achieve(); //再次刷新商品列表
					}, this.currentPage, 10, (res) => {
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
			//			分页
			handleCurrentChange(val) {
				this.currentPage = val
				this.achieve()
			},
			handleTabClick(tab, event) {
				if(tab.name == '2') {
					this.formInlineData.state = '';
				} else {
					this.formInlineData.state = tab.name;
				}
				this.currentPage = 1;
				this.achieve() //状态切换再次调用列表接口
			},
			//jde
			startHacking(index, rows) {
				if(this.productTableData[index].jdeGoodsNo == null) {
					if(this.productTableData[index].citm == null) {
						this.productTableData[index].citm = ' '
					} else {
						this.productTableData[index].citm = this.productTableData[index].citm
					}
					this.$router.push(basePath + '/proJde/' + this.productTableData[index].spuName + '/' + this.productTableData[index].spuNo + '/' + this.productTableData[index].citm + '/' + this.productTableData[index].specInfoNum)
				} else {
//					this.jde = true //弹窗弹出
//					this.form2.enterport = null
//					this.goodsName = this.productTableData[index].spuName
//					this.goodsNo = this.productTableData[index].spuNo
//					this.jdeGoodsNo = this.productTableData[index].jdeGoodsNo
					this.$router.push(basePath + '/proJde/' + this.productTableData[index].spuName + '/' + this.productTableData[index].spuNo + '/' + this.productTableData[index].citm + '/' + this.productTableData[index].specInfoNum + '/'+ this.productTableData[index].jdeGoodsNo)
				}

			},
			//jde商品与仓库号绑定
			updateEntreport(form2) {
				this.$refs[form2].validate((valid) => {
					if(valid) {
						let that = this;
						this.$confirm('您确定要更新「' + this.goodsName + '」的仓库？', '提示信息', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							const api = "/goods/addProductMcu/insert";
							const body = {
								mcu: this.form2.enterport,
								spuNo: this.goodsNo
							};
							axiosApi(api, body, (res) => {
								this.$message({
									type: 'success',
									message: '更新成功!',
									duration: 1000
								});
								that.achieve();
								that.jde = false
							}, this.currentPage, 10, (res) => {
								this.$message({
									type: 'info',
									message: res.data.message,
									duration: 3000
								});
							});
						}).catch(() => {
							this.jde = false
							this.$message({
								type: 'info',
								message: '已取消更新'
							});
						})
					} else {
						setTimeout(() => {
							this.$confirm('请正确填写信息！', '提示信息', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								showCancelButton: false,
								type: 'warning'
							})
						}, 100)

						return false;
					}
				});
			},
			//查询品牌
			brandSearch() {
				const api = "/goods/brandList/select";
				const body = {}
				axiosApi(api, body, this.brandsearch)
			},
			brandsearch(res) {
				let data = res.data.data.elements;
				this.searchBrandName = data;
			},
			//查询分类
			classSearch() {
				const api = "/goods/classifyTopList/select";
				const body = {
					classificationId: null
				}
				axiosApi(api, body, this.classsearch)
			},
			classsearch(res) {
				let data = res.data.data;
				this.searchClassify = data;
				this.form1.classifyId = this.searchClassify[0].id
			},
			//由分类id获取分类名
			getOne() {
				let _this = this
				this.searchClassify.forEach(function(item, index) {
					if(_this.form1.classifyId == item.id) {
						_this.form1.classifyName = _this.searchClassify[index].classifyName
					}
				})
			},
			//新增商品
			addProduct() {
				this.getOne()
				this.dialogFormVisible = false
				this.$router.push(basePath + '/proDetails/' + this.form1.classifyId + '/' + this.form1.classifyName)
			},
		},
		//进入加载
		activated() {
			this.$nextTick(function() {
				this.achieve();
				this.brandSearch();
				this.classSearch();
			})
		}
	}
</script>

<style lang="less">
	#proManagement {
		.width-70 {
			width: 70%;
		}
		.el-form-item__label {
			width: 75px;
			font-size: 12px;
		}
		.el-dialog__body {
			padding-left: 120px;
		}
		.el-dialog--small {
			min-height: 350px;
		}
		.boom .el-form-item__label {
			width: 80px;
		}
	}
</style>