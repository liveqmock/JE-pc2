<template>
	<div id="merchantDetail">
		<div class="title-menu">
			<div class="clearfix">
				<div class="fl" style="padding: 30px 0 19px 15px;">
					<div class="fl font-20 color-3">{{exportData.storeName}}</div>
				</div>
			</div>
			<el-tabs v-model='activeTab' @tab-click="handleTabClick">
				<el-tab-pane label="基本资料" name="first"></el-tab-pane>
				<el-tab-pane label="销售资质" name="second"></el-tab-pane>
				<el-tab-pane label="已授权商品" name="third"></el-tab-pane>
			</el-tabs>
		</div>
		<!-- 详情 基本资料-->
		<div class="info" v-loading='loading' v-if="activeTab=='first'">
			<div v-if='exportData.reason' class="mb-20 color-danger"><span class="labelInfo2 tar">审核未通过理由:</span><span class="ml-30">{{exportData.reason}}</span></div>
			<div class="mb-20"><span class="labelInfo2 tar">商家编号:</span><span class="ml-30">{{exportData.traderNumber}}</span></div>
			<div class="mb-20"><span class="labelInfo2 tar">用户名:</span><span class="ml-30">{{exportData.loginName}}</span></div>
			<div class="mb-20">
				<span class="labelInfo2 tar">商家名称:</span><span class="ml-30">{{exportData.storeName}}</span>
			</div>
			<div class="mb-20">
				<span class="labelInfo2 tar">商户地址:</span>
				<span class="ml-30">
					<span class="mr-20">{{deliveryAddressVO.provinceName}}</span>
				<span class="mr-20">{{deliveryAddressVO.cityName}}</span>
				<span class="mr-20">{{deliveryAddressVO.regionName}}</span>
				</span>
			</div>
			<div class="mb-20">
				<span class="labelInfo2 tar">详细地址:</span><span class="ml-30">{{deliveryAddressVO.attr}}</span>
			</div>
			<div class="mt-20"><span class="labelInfo2 tar">营业执照编码:</span><span class="ml-30">{{exportData.licenseNum}}</span></div>
			<div class="mt-20 clearfix"><span class="labelInfo2 tar fl">营业执照照片:</span>
				<div class="width-640 ml-30 fl">
					<img class="infoImg" :src="exportData.licenseImg" />
				</div>
			</div>
			<div class="mt-20 clearfix"><span class="labelInfo2 tar fl">门头照片:</span>
				<div class="width-640 ml-30 fl">
					<img v-for='item in photos' class="infoImg mr-20" :src="item.photoUrl" />
				</div>
			</div>
			<div class="mb-20 mt-20">
				<span class="labelInfo2 tar">联系人姓名:</span><span class="ml-30">{{exportData.linkname}}</span>
			</div>
			<div class="mb-20">
				<span class="labelInfo2 tar">职位:</span><span class="ml-30">{{exportData.jobOffer}}</span>
			</div>
			<div class="mb-20">
				<span class="labelInfo2 tar">手机号:</span><span class="ml-30">{{exportData.tel}}</span>
			</div>
			<div class="mb-20">
				<span class="labelInfo2 tar">Email:</span><span class="ml-30">{{exportData.email}}</span>
			</div>
			<div class="mb-20">
				<span class="labelInfo2 tar">推荐人号码:</span><span class="ml-30">{{exportData.distManagerMobile}}</span>
			</div>
			<div class="mb-20">
				<span class="labelInfo2 tar">商家来源:</span>
				<span class="ml-30">{{exportData.accountSource == 1 ?'注册' : '录入'}}</span>
			</div>
			<div class="mb-20">
				<span class="labelInfo2 tar">{{exportData.accountSource == 1 ?'注册' : '录入'}}时间:</span>
				<span class="ml-30">{{exportData.gmtCreate | time}}</span>
			</div>
			<div class="mt-40" v-if="exportData.state=='1'">
				<span class="labelInfo2 tar"></span>
				<span class="ml-30">
                    <el-button type="primary" @click='handlePass'>审核通过</el-button>
                    <el-button class='ml-20' @click='handleFail'>审核驳回</el-button>
                </span>
				<el-dialog title='填写理由' v-model='failDialogVisible' @close="handleReset('ruleForm')">
					<el-form class='ml-30 mr-30' :model='ruleForm' label-position='top' :rules='rules' ref='ruleForm'>
						<el-form-item label='审核不通过理由:' prop='reason'>
							<el-input type="textarea" :autosize="{ minRows: 4}" v-model.trim="ruleForm.reason"></el-input>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button type="primary" @click="handleCommit('ruleForm')">确 定</el-button>
						<el-button @click="handleReset('ruleForm')">取 消</el-button>
					</div>
				</el-dialog>
			</div>
		</div>

		<!--详情 销售资质-->
		<el-form v-loading='certLoading' v-if="activeTab=='second'" class='mt-50 cert' :inline='true' label-width='170px'>
			<div v-if='exportData.reason' class="mb-20 ml-100 color-danger"><span class="labelInfo2 tar">审核未通过理由:</span><span class="ml-30">{{exportData.reason}}</span></div>
			<div>
				<el-form-item label="商品分类:" prop="phone">
					<el-select v-model='classifyId' disabled palceholder='请选择'>
						<el-option v-for='item in classifyList' :label='item.classifyName' :value='item.id' key='$index'>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="商品品牌:">
					<el-select v-model='brandId' disabled palceholder='请选择'>
						<el-option v-for="item in brandList2" :label='item.brandName' :value='item.id' key='$index'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="授权方:">
					<el-input v-model='certList.authorizeName' disabled></el-input>
				</el-form-item>
				<div class="showState" ref='c'>
					<el-upload class="mt-10 mb-10 ml-170" action="/sunrise-gateway/oss/ossUpload" list-type="picture-card" :file-list='fileList' :on-preview="handlePictureCardPreview">
					</el-upload>
					<el-dialog v-model="dialogVisible" size="tiny">
						<img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
				</div>
			</div>
			<div class="ml-170" v-if='false'>
				<span class="color-blue cursor"><img class="sub mr-5" src="../../assets/add.png"/>继续添加</span>
			</div>
		</el-form>
		<!--详情 已授权商品-->
		<div v-if="activeTab=='third'" v-loading="spuLoading" class="author-good mt-30 ml-30 mr-30">
			<el-form :inline="true" :model="formInlineData" class="clearfix search">
				<div style="width:70%" class="fl">
					<el-form-item label="商品名称:">
						<el-input placeholder="请输入商品名称" v-model.trim="formInlineData.spuName"></el-input>
					</el-form-item>
					<el-form-item label="分类:">
						<el-select v-model="formInlineData.classifyId" clearable>
							<el-option v-for='(classItem,classIndex) in classifyList' :label='classItem.classifyName' :value='classItem.id' :key="classIndex">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="状态:">
						<el-select v-model="formInlineData.isExpired" clearable>
							<el-option label="全部" value=""></el-option>
							<el-option label="生效中" value="0"></el-option>
							<el-option label="已失效" value="1"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<el-button type="primary" class="supplier-check-btn fl" @click="handleSearch">查询</el-button>
			</el-form>
			<div class="mb-20 mt-20 clearfix">
				<div class="fl">已授权商品 {{total}} 个</div>
				<div class="fr">
					<el-button type='text' @click="goPage">添加授权商品</el-button>
				</div>
			</div>
			<el-table :data="goodsInfo" style="width: 100%" stripe>
				<!--<el-table-column type='selection'></el-table-column>-->
				<el-table-column label="商品名称" width="220px">
					<template scope="scope">
						<div class="fl mr-5">
							<img v-if="scope.row.defaultPicture" :src="scope.row.defaultPicture" alt="商品图片">
							<img v-else src="../../assets/goods.png" alt="">
						</div>
						<div class="fl w110">
							<p class="color-6">商品编码:{{scope.row.spuNo}}</p>
							<p class="color-9">{{scope.row.spuName}}</p>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="规格" width="90">
					<template scope='scope'>
						<div v-if="scope.row.specInfoNum">1*{{scope.row.specInfoNum}}</div>
						<div v-else>暂无</div>
					</template>
				</el-table-column>
				<el-table-column label="分类" width="90">
					<template scope='scope'>
						<div>{{scope.row.classifyName}}</div>
					</template>
				</el-table-column>
				<el-table-column label="品牌" width="90">
					<template scope='scope'>
						{{scope.row.brandName}}
					</template>
				</el-table-column>
				<el-table-column label="有效时间" align="center">
					<template scope='scope'>
						<span v-if="scope.row.authorizationStartDay || scope.row.authorizationEndDay">
							{{scope.row.authorizationStartDay | time}} <span class="ml-5 mr-5">至</span>{{scope.row.authorizationEndDay | time}}
						</span>
						<span v-else>
							-
						</span>
					</template>
				</el-table-column>
				<el-table-column label="状态" width="100">
					<template scope='scope'>
						{{scope.row.isExpired?"已失效":"生效中"}}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="130px" align="center">
					<template scope='scope'>
						<div v-if="scope.row.isExpired">
							<el-button type="text" @click="updataCert(scope.row)">更新销售资质</el-button>
						</div>
						<div v-else class="w110">
							<el-button type="text" @click="updataCert(scope.row)" class="width-auto">设置</el-button>
							<el-button type="text" @click="cancel(scope.row)" class="width-auto">解除授权</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination v-if="total>0" class="tar" :current-page="currentPage" :page-size='10' :total='total' layout="prev , pager, next, jumper" @current-change="handleCurrentChange">
				<!-- 分页组件 -->
			</el-pagination>
		</div>
		<!--<div v-if="exportData.reason && activeTab=='third'" class="minh-500 bg-f pt-30 pl-50">shl修改
			<div  class="mb-20 color-danger"><span class="labelInfo2 tar">审核未通过理由:</span><span class="ml-30">{{exportData.reason}}</span></div>
		</div>-->
	</div>
</template>

<script>
	import { axiosApi, basePath } from '../../api/api'; // 导入API
	export default {
		data() {
			return {
				formInlineData: {
					spuName: '',
					classifyId: '',
					isExpired: ""
				}, //已授权商品  查询
				spuLoading: false,
				goodsInfo: [],
				activeTab: 'first',
				exportData: {}, //  商户的基本信息
				deliveryAddressVO: {}, //营业地址信息
				photos: [], //门头照片信息
				failDialogVisible: false, //审核不通过弹出框
				reason: '', //审核不通过理由
				rules: {
					reason: [{
							required: true,
							message: '请输入理由',
						},
						{
							min: 1,
							max: 30,
							message: '长度在 1 到 30 个字符',
						}
					],
				},
				ruleForm: {
					reason: ''
				},
				currentPage: 1,
				total: 0,
				classifyId: '', //分类id
				brandId: '', //品牌id,
				classifyList: '', //分类列表	
				certList: {}, //销售资质对象
				fileList: [], //图片列表
				brandList2: [], //品牌数组
				dialogVisible: false, //图片弹出框
				dialogImageUrl: '',
				loading: false, //基本信息加载
				certLoading: false, //销售资质加载
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.findUnapproveBrandingBusiness()
				if(sessionStorage.activeTab) {
					this.activeTab = sessionStorage.activeTab;
					this.handleTabClick();
					sessionStorage.removeItem("activeTab");
				}
			})
		},
		methods: {
			handleTabClick(tab) { //标签页切换函数
				//				console.log(tab.name)
				if(this.activeTab == 'first') { //基本资料

				}
				if(this.activeTab == 'second') { //销售资质
					this.classifyTopList() //查看分类
					this.brandList() //查看所有品牌
					this.selectTraderCertImgByState() //查看销售资质
				}
				if(this.activeTab == 'third') { //已授权商品
					sessionStorage.setItem("obj", JSON.stringify({
						loginName: this.exportData.loginName,
						storeName: this.exportData.storeName,
						sellerId: this.$route.params.id
					}))
					this.spuAuthorizationListLoading()
				}
			},

			brandList() { //检索所有的品牌接口 传值为空 查询所有
				const api = '/goods/brandList/select'
				axiosApi(api, {}, (res) => {
					//					console.log(res,'检索所有的品牌接口')
					this.brandList2 = res.data.data.elements
				})
			},
			findUnapproveBrandingBusiness() { //平台：未通过的品牌商详情接口
				const api = '/trader/findUnapproveBrandingBusiness/select'
				let body = {
					traderId: this.$route.params.id,
					certId: this.$route.params.certId
				}
				this.loading = true
				axiosApi(api, body, (res) => {
					//					console.log(res,'aaaa')
					this.exportData = res.data.data
					this.deliveryAddressVO = this.exportData.deliveryAddressVO
					this.photos = this.exportData.photos
					this.loading = false
				}, 1, 10, (res) => {
					this.loading = false
					this.$message({
						type: 'error',
						message: res.data.message,
						duration: 1000
					})
				})
			},
			selectTraderCertImgByState() { //品牌商:销售资质详情查看（根据certId查找）接口
				const api = '/trader/selectTraderCertImgByState/select'
				let body = {
					certId: this.$route.params.certId
				}
				this.certLoading = true
				axiosApi(api, body, (res) => {
					//					console.log(res,'bbbbb')
					this.classifyId = res.data.data.classifyId
					this.brandId = res.data.data.brandId
					this.certList = res.data.data
					this.fileList = []
					this.certList.certRelationVOs.forEach((item) => {
						let photo = {
							url: item.certImg,
							state: item.state
						}
						//						console.log(item.state)
						if(item.state == 3) { //销售资质不通过页面
							this.fileList.push(photo)
						}
					})
					setTimeout(() => {
						this.fileList.forEach((item, index) => {
							//								console.log(item)
							//								if(item.state == 1) {
							//									this.$refs.c.childNodes[0].childNodes[0].childNodes[index].className = "el-upload-list__item is-success credentials"
							//								}
							if(item.state == 3) {
								this.$refs.c.childNodes[0].childNodes[0].childNodes[index].className = "el-upload-list__item is-success credentials2"
							}
						})
					}, 0)
					this.certLoading = false
				})
			},

			classifyTopList() { //根据品类，检索关联的一级分类 所有分类
				const api = '/goods/classifyTopList/select'
				let body = {
					classificationId: ''
				}
				axiosApi(api, body, (res) => {
					//					console.log(res)
					this.classifyList = res.data.data
				})
			},

			updateTraderState(state, reason) { //平台：商家审核
				const api = '/trader/updateTraderState/select'
				let body = {
					id: this.$route.params.id,
					state: state,
					reason: reason
				}
				axiosApi(api, body, (res) => {
					//					console.log(res)
					this.$message({
						type: 'success',
						message: '操作成功',
						duration: 1000
					})
				})
			},
			handlePass() { //审核通过处理函数
				this.updateTraderState('2', '')
				localStorage.setItem('activeTab', '2')
				this.$router.push(basePath + '/merchant/allMerchantList')
			},
			handleFail() { //审核不通过处理函数
				this.failDialogVisible = true
			},
			handleCommit(formName) { // 弹出框 审核不通过 处理函数（确定按钮）
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.updateTraderState('3', this.ruleForm.reason)
						this.failDialogVisible = false
						localStorage.setItem('activeTab', '2')
						this.$router.push(basePath + '/merchant/allMerchantList')
					} else {
						return false
					}
				})
			},
			handleReset(formName) { //再次点击弹出框 清空 内容
				this.failDialogVisible = false
				this.$refs[formName].resetFields();
			},
			handlePictureCardPreview(file) {
				//				console.log(file.url)
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			spuAuthorizationListLoading() { //已授权商品列表
				const api = '/goods/spuAuthorizationList/select';
				const body = {
					sellerId: this.$route.params.id,
					isExpired: this.formInlineData.isExpired,
					spuName:this.formInlineData.spuName,
					classifyId:this.formInlineData.classifyId
				};
				this.spuLoading = true;
				axiosApi(api, body, this.spuAuthorizationListCallback, this.currentPage, 10);
			},
			spuAuthorizationListCallback(res) {
				//			console.log(res, "aaa")
				this.goodsInfo = res.data.data.elements;
				this.currentPage = res.data.data.pageIndex;
				this.total = res.data.data.totalCount;
				this.spuLoading = false;

			},
			handleCurrentChange(val) { //处理分页 - 改变当前页
				this.currentPage = val;
				this.spuAuthorizationListLoading()
			},
			cancel(item) {
				this.$confirm('你确定要执行该操作？', '提示信息', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					//取消授权
					axiosApi("/goods/spuAuthorizationBatchCancle/update", {
						ids: [item.id],
						isCountrywide: item.isCountrywide
					}, (res) => {
						this.spuAuthorizationListLoading(); //加载已授权列表  
						this.$message({
							type: 'success',
							message: '操作成功！',
							duration: 1000
						})
					})
				}, this.currentPage, 10).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消',
						duration: 1000
					});
				})
			},
			updataCert(item) {
				this.$router.push(`${basePath}/merchant/supplierSaleArea/merchantEdit/${item.id}/${item.isExpired}`)
			},
			goPage() {
				this.$router.push(basePath + "/merchant/addGood")
			},
			handleSearch() {
				if(this.currentPage === 1){
					this.spuAuthorizationListLoading();
				}else{
					this.currentPage = 1;
				}
			}
		}
	}
</script>

<style lang="less">
	#merchantDetail {
		/*详情页面id*/
	}
	
	#merchantDetail .info {
		margin: 50px 0 0 150px;
		font-size: 14px;
	}
	
	#merchantDetail .info .labelInfo2 {
		width: 102px;
		display: inline-block;
	}
	
	#merchantDetail .info .labelInfo2 {
		width: 102px;
		display: inline-block;
	}
	
	#merchantDetail .infoImg {
		width: 240px;
		height: 180px;
	}
	
	#merchantDetail .ml-170 {
		margin-left: 170px;
	}
	
	.minh-500 {
		min-height: 500px;
	}
	
	#merchantDetail .cert .el-upload--picture-card {
		display: none;
	}
	
	#merchantDetail .cert .el-upload-list--picture-card .el-upload-list__item-status-label {
		display: none;
	}
	
	#merchantDetail .cert .el-icon-delete2 {
		display: none;
	}
	#merchantDetail .w110{
		width: 110px;
	}
	.showState .credentials2 {
		position: relative;
		&::before {
			display: block;
			content: '未通过';
			position: absolute;
			width: 50px;
			height: 38px;
			right: 0;
			line-height: 38px;
			color: #fff;
			background: rgba(0, 0, 0, 0.5);
			text-align: center;
		}
	}
</style>