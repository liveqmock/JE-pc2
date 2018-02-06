<template>
	<div id="add-license-good">
		<div class="title-top">
			<div class="clearfix">
				<el-breadcrumb class="fl">
					<el-breadcrumb-item>选择授权商品</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</div>
		<div id="body">
			<div class="licensePro">
				<el-form :inline="true" :model="formInlineData" class="clearfix">
					<div style="width:70%" class="fl">
						<el-form-item label="品牌:">
							<el-select v-model="formInlineData.brandId" placeholder="请输入关键词" clearable filterable>
								<el-option :label="item.brandName" :value="item.id" v-for='item in searchBrandName' key='$index'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="分类:">
							<el-select v-model="formInlineData.classifyId">
								<el-option :label="item.classifyName" :value="item.id" v-for='item in searchClassify' key='$index'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="商品名称:">
							<el-input placeholder="请输入商品名称" v-model.trim="formInlineData.spuName"></el-input>
						</el-form-item>
					</div>
					<el-button type="primary" class="supplier-check-btn fl" @click="handSearch">查 询</el-button>
				</el-form>
				<el-table :data="licenseData" class="mt-30" stripe v-loading="listLoading">
					<el-table-column label="商品名称/建议零售价" width="300">
						<template scope="scope">
							<div class="fl mr-10">
								<img v-if="scope.row.defaultPicture" :src="scope.row.defaultPicture" alt="商品图片">
								<img v-else src="../../assets/goods.png" alt="">
							</div>
							<div class="fl w190">
								<p class="color-6">商品编码:{{scope.row.spuNo}}</p>
								<p class="color-9 mt-5">商品名称: {{scope.row.spuName}}</p>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="规格">
						<template scope="scope">
							<div>1*{{scope.row.specInfoNum}}</div>
						</template>
					</el-table-column>
					<el-table-column label="分类" prop="classifyName"></el-table-column>
					<el-table-column label="品牌" prop="brandName"></el-table-column>
					<el-table-column label="建议参考价">
						<template scope='scope'>￥{{scope.row.msrp | fmoney}}</template>
					</el-table-column>
					<el-table-column label="操作">
						<template scope='scope'>
							<el-button type='text' style='width: auto;height: auto;' @click="goPage(scope.row)">授权</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination v-if="total>0" class="tar" :current-page="currentPage" :page-size='10' :total='total' layout="prev , pager, next, jumper" @current-change="handleCurrentChange">
					<!-- 分页组件 -->
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	import { axiosApi, basePath } from '../../api/api'; // 导入API
	export default {
		data() {
			return {
				currentPage: 1,
				formInlineData: {
					spuName: '',
					classifyId: '',
					brandId: ''
				}, //查询
				licenseData: [],
				currentPage: 1,
				total: 0,
				searchBrandName: [], //搜索品牌
				searchClassify: [], //搜索分类
				listLoading:true,
				obj:{}
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.obj = JSON.parse(sessionStorage.getItem("obj"));
				this.loading(1);
				this.loading(2);
				this.loading(3);
			})
		},
		methods: {
			handSearch(){
				if(this.currentPage === 1){
					this.loading(1);
				}else{
					this.currentPage = 1;
				}
			},
			loading(type) {
				if(type == 1) { //列表
					this.listLoading = true;
					const api1 = "/goods/spuInfoList/select";
					const body1 = {
						spuName: this.formInlineData.spuName,
						classifyId: this.formInlineData.classifyId,
						brandId: this.formInlineData.brandId,
						isUnApproved:true,
						sellerId:this.obj.sellerId
					};
					axiosApi(api1, body1, res => {
						this.listLoading = false;
						this.licenseData = res.data.data.elements;
						this.currentPage = res.data.data.pageIndex;
						this.total = res.data.data.totalCount;
					}, this.currentPage, 10);
				}else if(type == 2) { //品牌
					const api2 = "/goods/brandList/select";
					axiosApi(api2, {}, res => {
						this.searchBrandName = res.data.data.elements;
					}, this.currentPage, 10)
				}else if(type == 3) { //分类
					const api3 = "/goods/classifyList/select";
					axiosApi(api3, {}, res => {
						this.searchClassify = res.data.data;
					}, this.currentPage, 10)
				}
			},
			handleCurrentChange(val) {
//				console.log(val)
				this.currentPage = val;
				this.loading(1);
			},
			goPage(item) {
				let obj = Object.assign(JSON.parse(sessionStorage.getItem("obj")), {
					id: item.id,
					brandId: item.brandId,
					classifyId: item.classifyId,
					brandName: item.brandName,
					classifyName: item.classifyName,
					spuName: item.spuName,
					spuNo: item.spuNo
				})
				sessionStorage.setItem("obj", JSON.stringify(obj));
				this.$router.push(basePath + `/merchant/lookAgreement`);
			}
		}
	}
</script>

<style>
	#add-license-good .licensePro {
		/*授权商品上，右，左margin 30px*/
		margin: 30px 30px 0 30px;
	}
	
	#add-license-good .licensePro .el-form--inline .el-form-item__label {
		font-size: 12px;
		width: 75px;
	}
	
	#add-license-good .licensePro .el-form--inline .el-input__inner {
		font-size: 12px;
	}
	
	#add-license-good .agreement {
		margin: 50px 0;
	}
	
	#add-license-good .infoImg {
		width: 120px;
		height: 90px;
	}
	#add-license-good .w190{
		width: 190px;
	}
</style>