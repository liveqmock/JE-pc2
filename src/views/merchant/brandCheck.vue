<template>
	<div id="brandCheck">
		<div class="title-menu">
			<div class="clearfix">
				<div class="fl" style="padding: 30px 0 19px 15px;">
					<div class="fl font-20 color-3">{{storeName}}</div>
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
			<el-form label-width='238px' v-loading='loading' :model="exportData" :rules="infoRules" ref="infoForm">
				<el-form-item label='商家编码:'>
					{{exportData.traderNumber}}
				</el-form-item>
				<el-form-item label="用户名:" class="proName">
					{{exportData.loginName}}
				</el-form-item>
				<el-form-item label="商家名称:" class="proName" prop="storeName">
					<el-input v-model.trim="exportData.storeName"></el-input>
				</el-form-item>
				<el-form-item label='所在地址:' prop="selectedAddress">
					<el-cascader ref='a' class='mr-10 fl' clearable :options="options" v-model="selectedOptions" @change="handleAddress">
					</el-cascader>
				</el-form-item>
				<el-form-item label="详细地址:" class="proName" prop="attr">
					<el-input v-model.trim="exportData.attr"></el-input>
				</el-form-item>
				<el-form-item label="营业执照编码:" class="proName" prop="licenseNum">
					<el-input v-model.trim="exportData.licenseNum"></el-input>
				</el-form-item>
				<!--===================-->
				<el-form-item label="营业执照照片:" prop="licenseImg2">
					<!--<el-upload class="avatar-uploader" action="/sunrise-gateway/oss/ossUpload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
						<img v-if="exportData.licenseImg" :src="exportData.licenseImg" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>-->
					<el-upload  :class="isDisableLicense?'fileList2':''"
						action="/sunrise-gateway/oss/ossUpload" 
						:file-list='exportData.licenseImg2' 
						list-type="picture-card" 
						:on-preview="handlePictureCardPreview" 
						:on-success="handleLicensePhotoScucess" 
						:before-upload="beforeAvatarUpload" 
						:on-remove="handleRemoveLicense">
					</el-upload>
					<el-dialog v-model="licenseImgdialogVisible" size="tiny">
						<img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
				</el-form-item>

				<el-form-item label="门店照片:" prop="fileList2">
					<input type="hidden" v-model="exportData.fileList2" />
					<el-upload :class="isDisable?'fileList2':''" action="/sunrise-gateway/oss/ossUpload" :file-list='fileList2' list-type="picture-card" :on-preview="handlePictureCardPreview" :on-success="handleAvatarPhotoScucess" :before-upload="beforeAvatarUpload" :on-remove="handleRemove">
					</el-upload>
					<el-dialog v-model="dialogVisible" size="tiny">
						<img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
				</el-form-item>
				<el-form-item label="联系人姓名:" class="proName" prop="linkname">
					<el-input v-model.trim="exportData.linkname"></el-input>
				</el-form-item>
				<el-form-item label="职位:" class="proName" prop="jobOffer">
					<el-input v-model.trim="exportData.jobOffer"></el-input>
				</el-form-item>
				<el-form-item label="手机号:" class="proName" prop="tel">
					<el-input v-model.trim="exportData.tel"></el-input>
				</el-form-item>
				<el-form-item label="Email:" class="proName" prop="email">
					<el-input v-model.trim="exportData.email"></el-input>
				</el-form-item>
				<el-form-item label="推荐人手机号:" class="proName" prop="distManagerMobile">
					<el-input v-model.trim="exportData.distManagerMobile" disabled></el-input>
				</el-form-item>
				<el-form-item label="商家来源:" class="proName">
					{{ exportData.accountSource == 1 ? '注册' : '录入' }}
				</el-form-item>
				<el-form-item :label="exportData.accountSource == 1 ?'注册时间:' : '录入时间:'" class="proName">
					{{exportData.gmtCreate | time}}
				</el-form-item>
				<el-form-item class='mt-50' v-if="state">
					<el-button type='primary' @click='handlePass'>审核通过</el-button>
					<el-button @click='handleFail'>审核不通过</el-button>
				</el-form-item>
				<el-form-item class='mt-50' v-else>
					<el-button type='primary' @click='handleUpdate'>保存</el-button>
					<el-button @click='handleResetInfo'>重置</el-button>
				</el-form-item>
				<el-dialog title='填写理由' v-model='failDialogVisible' @close="handleReset2('ruleForm')">
					<el-form class='ml-30 mr-30' :model='ruleForm' label-position='top' :rules='rules' ref='ruleForm'>
						<el-form-item label='审核不通过理由:' prop='reason'>
							<el-input type="textarea" :autosize="{ minRows: 4}" v-model.trim="ruleForm.reason"></el-input>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button type="primary" @click="handleCommit('ruleForm')">确 定</el-button>
						<el-button @click="handleReset2('ruleForm')">取 消</el-button>
					</div>
				</el-dialog>
			</el-form>
		</div>

		<!--详情 销售资质-->
		<el-form v-loading='certLoading' v-show="activeTab=='second'" class='mt-50 cert' :inline='true' label-width='170px'>
			<div v-if='false' class="mb-20 ml-100 color-danger"><span class="labelInfo2 tar">审核未通过理由:</span><span class="ml-30">{{exportData.reason}}</span></div>
			<div>
				<div class="tar mr-75 mb-20">
					<el-button type="text" @click='handleHistory'>查看记录</el-button>
				</div>
				<el-form-item label="商品分类:" prop="phone">
					<el-select v-model='classifyId'>
						<el-option v-for='item in classifyList' :label='item.classifyName' :value='item.id' key='$index'>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="商品品牌:">
					<el-select v-model='brandId' palceholder='请输入关键词' filterable>
						<el-option v-for="item in brandList2" :label='item.brandName' :value='item.id' key='$index'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="授权方:">
					<el-select v-model="authorizeId" filterable clearable remote placeholder="请输入关键词" :remote-method="remoteMethod" :loading="selectLoading">
						<el-option v-for="item in sellerList" :key="item.value" :label="item.storeName" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<div ref="c" class="mt-10 mb-10 ml-170 showState">
					<!--<el-upload class="mt-10 mb-10 ml-170" action="/sunrise-gateway/oss/ossUpload" list-type="picture-card" :file-list='fileList' :on-preview="handlePictureCardPreview" :on-remove="handlePhotoRemove" :on-success="handleCertScucess">
					</el-upload>
					<el-dialog v-model="dialogVisible" size="tiny">
						<img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>-->
					<el-upload action="/sunrise-gateway/oss/ossUpload" :file-list="fileList" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handlePhotoRemove" :on-success="handleCertScucess">

					</el-upload>
					<el-dialog v-model="dialogVisible" size="tiny">
						<img width="100%" :src="dialogImageUrl" alt="show-message">
					</el-dialog>
				</div>
				<div class="ml-170">
					<el-button type="primary" @click='handlePass'>审核通过</el-button>
					<el-button class='ml-20' @click='handleFail'>审核驳回</el-button>
				</div>
				<el-dialog title='填写理由' v-model='failDialogVisible' @close="handleReset('ruleForm')">
					<el-form class='ml-30 mr-30' :model='ruleForm' label-position='top' :rules='rules' ref='ruleForm'>
						<el-form-item label='审核不通过理由:' prop='reason'>
							<div style='width: 440px;display: block;'>
								<el-input type="textarea" :autosize="{ minRows: 4}" v-model.trim="ruleForm.reason"></el-input>
							</div>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button type="primary" @click="handleCommit2('ruleForm')">确 定</el-button>
						<el-button @click="handleReset('ruleForm')">取 消</el-button>
					</div>
				</el-dialog>
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
			<div class="mb-20 color-danger"><span class="labelInfo2 tar">审核未通过理由:</span><span class="ml-30">{{exportData.reason}}</span></div>
		</div>-->
	</div>
</template>

<script>
	import { axiosApi, basePath } from '../../api/api'; // 导入API
	import { rawCitiesData } from '../../city-region.js'
	export default {
		data() {
			var checkAddress = (rule, value, callback) => {
//				console.log(value)
				if(value.length <= 0) {
					return callback(new Error('地址不能为空'));
				} else {
					callback()
				}
			}
			return {
				formInlineData: {
					spuName: '',
					classifyId: '',
					isExpired: ""
				}, //已授权商品  查询
				sellerList: [], //模糊搜索列表
				authorizeId: '', //
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
				dialogVisible: false, //图片弹出框
				dialogImageUrl: '',
				loading: false, //基本信息加载
				certLoading: false, //销售资质加载
				spuLoading: false,
				goodsInfo: [],

				ruleForm: {
					reason: ''
				},
				form: {},
				dialogImageUrl: '',
				dialogVisible: false,
				activeTab: 'first',
				value: '',
				activeTab: 'first',
				exportData: {
					selectedAddress: [],
					attr: null,
					licenseNum: null,
					licenseImg2: [] , //营业执照照片
					fileList2: [],
					linkname: null,
					jobOffer: null,
					tel: null,
					email: null,
					distManagerMobile: null
				}, //  商户的基本信息
				deliveryAddressVO: {}, //营业地址信息
				photos: [], //门头照片信息
				options: rawCitiesData,
				selectedOptions: [],
				fileList2: [], //门店照片Url
				licenseImg: '',
				allLoading: false, //全部页面loading 
				brandList2: [], ////品牌数组
				CertRecordArr: [], //销售资质数组
				classifyId: '',
				classifyList: [],
				certId: '',
				spuLoading: false,
				currentPage: 1,
				total: 0,
				goodsInfo: [],
				deleteImgList: [], //删除门店图片信息存储
				newImgList: [], //新增门店图片图片存储
				path: "merchantEdit",
				state: null,
				failDialogVisible: false,
				reason: '', //审核不通过理由
				rules: {
					reason: [{
							required: true,
							message: '请输入理由'
						},
						{
							min: 1,
							max: 30,
							message: '长度在 1 到 30 个字符'
						}
					],
				},
				infoRules: {
					storeName: [{
						required: true,
						message: '请输入商家姓名'
					}, {
						min: 3,
						max: 20,
						message: '长度在 3 到 20 个字符'
					}],
					selectedAddress: [{
						required: true,
						validator: checkAddress,
						type: 'array',
						trigger: 'change'
					}],
					attr: [{
						required: true,
						message: '请输入商家详细地址'
					}, {
						min: 4,
						max: 50,
						message: '长度在 4 到 50 个字符'
					}],
					licenseNum: [{
						required: true,
						pattern: /^[0-9a-zA-Z]{4,20}$/,
						message: '营业执照编码数字或字母少于20个字符'
					}],
					licenseImg2: [{
						required: true,
						message: '请上传营业执照图片',
						type: 'array'
					},{
						min:1,
						max:1,
						type:'array',
						message:'请上传1张营业执照图片'
					}],
					fileList2: [{
						required: true,
						message: '请上传1-2张门店照片',
						type: 'array'
					}, {
						min: 1,
						max: 2,
						type: "array",
						message: "请上传1-2张门店照片"
					}],
					linkname: [{
						required: true,
						pattern: /^[0-9a-zA-Z\u4e00-\u9fa5]{2,6}$/,
						message: '2—6字（汉字，字母）'
					}],
					jobOffer: [{
						min: 2,
						max: 10,
						message: '2—10字符'
					}],
					tel: [{
						required: true,
						pattern: /^1\d{10}$/,
						message: '11位手机号'
					}],
					email: [{
						pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
						message: '请输入正确的Email'
					}],
					distManagerMobile: [{
						pattern: /^1\d{10}$/,
						message: '11位手机号'
					}]

				},
				isDisableLicense:false, //营业执照是否显示+好
				licenseImgdialogVisible:false, //营业执照照片放大
				isDisable: false,
				storeName: null,
				selectLoading:false

			}
		},
		mounted() {
			this.$nextTick(() => {
				this.classifyTopList() //查看分类
				this.brandList() //查看所有品牌
				this.findStoreInfo()
			})
		},
		methods: {
//			remoteMethod2(query){
//				
//			},
			/*上传营业执照函数*/
			handleLicensePhotoScucess(res, file, fileList){
				this.loading = false
				this.exportData.licenseImg2 = [{url: res.data[0]}]
				this.isDisableLicense = fileList.length >= 1
				this.$refs.infoForm.validateField("licenseImg2")  //部分表单字段验证
			},
			/*删除营业执照处理函数*/
			handleRemoveLicense(file, fileList){
				this.exportData.licenseImg2 = fileList
				this.$refs.infoForm.validateField("licenseImg2")
				this.isDisableLicense = fileList.length >= 1
			},
			
			handleAddress(val) {
				this.exportData.selectedAddress = val
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
							duration: 3000
						})
					})
				}, this.currentPage, 10).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消',
						duration: 3000
					});
				})
			},
			updataCert(item) {
				this.$router.push(`${basePath}/merchant/supplierSaleArea/merchantEdit/${item.id}/${item.isExpired}`)
			},
			findStoreInfo() { //进货商的店铺信息（回显） 显示商户的基本信息
				const api = '/trader/findStoreInfo/select'
				if(this.$route.params.id) {
					let body = {
						traderId: this.$route.params.id
					}
					//					this.loading = true
					axiosApi(api, body, (res) => {
						this.loading = false
//						console.log(res)
						this.exportData = res.data.data
						this.deliveryAddressVO = this.exportData.deliveryAddressVO
						//级联选择器显示数据
						this.selectedOptions = [this.deliveryAddressVO.provinceId + '', this.deliveryAddressVO.cityId + '', this.deliveryAddressVO.regionId + '']
						//表单验证需要赋值给 form表单下的字段
						this.exportData.selectedAddress = this.selectedOptions
						this.exportData.attr = this.deliveryAddressVO.attr
						this.photos = res.data.data.photos

						/*营业执照改成能删除、放大类型*/
						this.exportData.licenseImg2 = [{url:this.exportData.licenseImg}]  
						this.licenseImg = this.exportData.licenseImg2
						this.isDisableLicense = this.licenseImg.length>=1
						if(this.photos) {
							this.fileList2 = []
							for(let i = 0; i < this.photos.length; i++) { //遍历显示图片
								let photo = {
									url: this.photos[i].photoUrl,
									id: this.photos[i].id
								}
								this.fileList2.push(photo)
							}
						}
						this.exportData.fileList2 = this.fileList2
						this.isDisable = this.fileList2.length >= 2
						this.storeName = this.exportData.storeName
					}, (res) => {
						this.$message({
							type: 'error',
							message: res.data.message,
							duration: 3000
						})
						this.loading = false
					})
				}
			},
			handleRemove(file, fileList) { //图片删除处理函数
				if(file.id)
					this.deleteImgList.push(file.id) //存储删除图片的信息（id,url）
				this.exportData.fileList2 = fileList
				this.$refs.infoForm.validateField("fileList2"); //部分表单字段验证
				if(fileList.length >= 2) {
					this.isDisable = true
				} else {
					this.isDisable = false
				}
			},
			handleAvatarPhotoScucess(res, file, fileList) { //上传图片销售资质（增加）
				this.newImgList.push(res.data[0])
				this.loading = false
				this.exportData.fileList2 = fileList
				if(fileList.length >= 2) {
					this.isDisable = true
				} else {
					this.isDisable = false
				}
				this.$refs.infoForm.validateField("fileList2"); //部分表单字段验证
			},

			beforeAvatarUpload(file) { //上传之前图片的判断
				//				////console.log(file)
				this.loading = true
				const isImage = (file.type.indexOf('png') != -1 || file.type.indexOf('jpeg') != -1);
				const isLt4M = file.size / 1024 / 1024 < 4;
				if(!isImage) {
					this.$message.error('请上传格式为png或jpg的图片文件!');
				} else if(!isLt4M) {
					this.$message.error('上传图片大小不能超过 4MB!');
				}
				return isImage && isLt4M;
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			handleAvatarSuccess(res, file) { //上传图片（替换）营业执照
				this.exportData.licenseImg = res.data[0]
				this.loading = false
			},
			handleResetInfo() { //重置基本信息
				let h = this.$createElement;
				this.$msgbox({
					title: '提示信息',
					message: h('p', null, [
						h('p', {
							style: 'text-align:center;margin-bottom:20px'
						}, '是否确认重置信息？ '),
						h('p', {
							style: 'text-align:center;color:#999'
						}, '信息重置后，您未保存的信息将被覆盖')
					]),
					showCancelButton: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					beforeClose: (action, instance, done) => {
						if(action === 'confirm') {
							this.findStoreInfo()
							done()
						} else {
							done()
						}
						delete instance.$slots.default;
					}
				})
			},
			handleUpdate() {
				this.$refs.infoForm.validate((valid) => {
					if(valid) {
						let h = this.$createElement;
						this.$msgbox({
							title: '提示信息',
							message: h('p', null, [
								h('p', {
									style: 'text-align:center'
								}, '是否确认保存您的修改？ '),
							]),
							showCancelButton: true,
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							beforeClose: (action, instance, done) => {
								if(action === 'confirm') {
									this.reapply()
									done()
								} else {
									done()
								}
								delete instance.$slots.default;
							}
						})
					} else {
						return false
					}
				})

			},
			reapply() { //普通商家编辑接口（重新申请（审核未通过））
				const api = '/trader/updateTraderInfo/update'
				let addressName = this.$refs.a.$el.innerText.split("/")
				let licenseImg = this.exportData.licenseImg2[0].url
				let traderPhotoRelationParams = []
//				console.log(traderPhotoRelationParams, '============================')
				traderPhotoRelationParams.push({ //添加最新门店图片
					traderId: this.$route.params.id,
					type: '1',
					photoUrl: this.newImgList
				})
				this.newImgList = [] //在一次添加后重置数组
				if(this.deleteImgList.length > 0) {
					this.deleteImgList.forEach((item) => {
						traderPhotoRelationParams.push({
							traderId: this.$route.params.id,
							photoId: item,
							type: '2'
						})
					})
					this.deleteImgList = [] //在一次添加后重置数组
				}
				let body = Object.assign(this.exportData, {
					traderId: this.$route.params.id, //交易对象id
					licenseImg: licenseImg,
					deliveryAddressParam: {
						provinceId: this.selectedOptions[0],
						cityId: this.selectedOptions[1],
						regionId: this.selectedOptions[2],
						provinceName: addressName[0],
						cityName: addressName[1],
						regionName: addressName[2],
						attr: this.exportData.attr
					},
					traderPhotoRelationParams: traderPhotoRelationParams
				})
				this.loading = true
//				console.log(traderPhotoRelationParams, 'traderPhotoRelationParams')
				axiosApi(api, body, (res) => {
					////console.log(res)
					this.$message({
						type: 'success',
						message: '保存成功！',
						duration: 3000
					})
					this.loading = false
					this.findStoreInfo()

				}, 1, 10, (res) => {
					this.$message({
						type: 'error',
						message: res.data.message,
						duration: 3000
					})
					this.loading = false
				})
			},

			remoteMethod(query) { // 授权方模糊搜索
				this.selectLoading = true;
				const api = '/trader/authorize/select'
				axiosApi(api, {
					storeName: query
				}, (res) => {
//					console.log(res)
					this.sellerList = res.data.data;
					this.selectLoading = false;
				},1,100,()=>{
					this.selectLoading = false;
				})
			},
			handleTabClick(tab) { //标签页切换函数
//				console.log(tab.name)
				if(tab.name == 'first') { //基本资料

				}
				if(tab.name == 'second') { //销售资质
					this.selectTraderCertImgByState() //查看销售资质
				}
				if(tab.name == 'third') { //切换到已授权商品
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
//					console.log(res, '检索所有的品牌接口')
					this.brandList2 = res.data.data.elements
				})
			},
			selectTraderCertImgByState() { //品牌商:销售资质详情查看（根据certId查找）接口
				const api = '/trader/selectTraderCertImgByState/select'
				let body = {
					certId: this.$route.params.certId
				}
				this.certLoading = true
				axiosApi(api, body, (res) => {
//					console.log(res, 'bbbbb')
					if(res.data.data) {
						this.classifyId = res.data.data.classifyId
						this.brandId = res.data.data.brandId
						this.certList = res.data.data
						this.fileList = []
						this.certList.certRelationVOs.forEach((item) => {
							let photo = {
								url: item.certImg,
								certId: item.certId,
								id: item.id,
								state: item.state
							}
							this.fileList.push(photo)
						})
						setTimeout(() => {
							this.fileList.forEach((item, index) => {
//								console.log(item)
								if(item.state == 1) {
									this.$refs.c.childNodes[0].childNodes[0].childNodes[index].className = "el-upload-list__item is-success credentials"
								}
								if(item.state == 3) {
									this.$refs.c.childNodes[0].childNodes[0].childNodes[index].className = "el-upload-list__item is-success credentials2"
								}
							})
						}, 0)
					}

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

			updateTraderCertState(body) { //销售资质审核接口
				const api = '/trader/updateTraderCertState/update'
				axiosApi(api, body, (res) => {
//					console.log(res, '销售资质审核接口')
					this.$message({
						type: 'success',
						message: '操作成功！',
						duration: 3000
					})
					localStorage.setItem('activeTab', '2')
					this.$router.push(basePath + '/merchant/branderList')
				}, 1, 10, (res) => {
					this.$message({
						type: 'error',
						message: res.data.message,
						duration: 3000
					})
				})
			},
			handlePass() { //销售资质  审核通过处理函数
				let h = this.$createElement;
				this.$msgbox({
					title: '提示信息',
					message: h('p', null, [
						h('p', {
							style: 'text-align:center'
						}, '确定审核通过吗？ ')
					]),
					showCancelButton: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					beforeClose: (action, instance, done) => {
						if(action === 'confirm') {
							let body = {
								state: '2',
								certId: this.$route.params.certId,
								traderId: this.$route.params.id,
								authorizeId: this.authorizeId,
								classifyId: this.classifyId,
								brandId: this.brandId
							}
							this.updateTraderCertState(body)
							done()
						} else {
							done()
						}
						delete instance.$slots.default;
					}
				})
			},
			handleFail() { //销售资质 审核不通过处理函数
				this.failDialogVisible = true
			},
			handleReset(formName) { //再次点击弹出框 清空 内容
				this.failDialogVisible = false
				this.$refs[formName].resetFields();
			},
			handleCommit2(formName) { // 弹出框 审核不通过 处理函数（确定按钮）
				this.$refs[formName].validate((valid) => {
					if(valid) {
						let body = {
							state: '3',
							certId: this.$route.params.certId,
							traderId: this.$route.params.id,
							authorizeId: this.authorizeId,
							classifyId: this.classifyId,
							reason: this.ruleForm.reason,
							brandId: this.brandId
						}
						this.updateTraderCertState(body)
						this.failDialogVisible = false
					} else {
						return false
					}
				})
			},
			handlePictureCardPreview(file) {
//				console.log(file.url)
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			handleCurrentChange(val) { //处理分页 - 改变当前页
				this.currentPage = val;
				this.spuAuthorizationListLoading()
			},
			handlePhotoRemove(file, fileList) { //处理图片删除
//				console.log(file, fileList, 'remove')
				let body = {
					id: file.id,
					certId: file.certId
				}
				this.deleteTraderCertImg(body, fileList)

			},
			deleteTraderCertImg(body, fileList) { //删除销售资质（图片）
				const api = '/trader/deleteTraderCertImg/delete'
				axiosApi(api, body, (res) => {
//					console.log(res)
					this.$message({
						type: 'success',
						message: '操作成功！',
						duration: 3000
					})
					if(fileList.length <= 0) {
						let h = this.$createElement
						this.$msgbox({
							title: '提示信息',
							message: h('p', {
								style: 'text-align:center'
							}, '删除最后一张图片，不能审核销售资质,返回销售资质审核列表！'),
							showCancelButton: false,
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							beforeClose: (action, instance, done) => {
								if(action === 'confirm') {
									localStorage.setItem('activeTab', '2')
									this.$router.push(basePath + '/merchant/branderList')
									done()
								} else {
									localStorage.setItem('activeTab', '2')
									this.$router.push(basePath + '/merchant/branderList')
									done()
								}
								delete instance.$slots.default;
							}
						})
					}
					this.selectTraderCertImgByState()
				}, 1, 10, (res) => {
					this.$message({
						type: 'error',
						message: res.data.message,
						duration: 3000
					})
					this.selectTraderCertImgByState()
				})
			},

			addTraderCert(body) { //上传销售资质接口
				const api = '/trader/addTraderCert/insert'
				axiosApi(api, body, (res) => {
//					console.log(res, '上传销售资质')
					this.$message({
						type: 'success',
						message: '操作成功！',
						duration: 3000
					})
					this.selectTraderCertImgByState()
				}, 1, 10, (res) => {
//					console.log(res, '上传销售资质')
					this.$message({
						type: 'error',
						message: res.data.message,
						duration: 3000
					})
					this.selectTraderCertImgByState()
				})
			},
			handleCertScucess(res, file, fileList) { //经销图片上传成功回调
				this.dialogImageUrl = res.data[0]
//				console.log(res, file.url, fileList)
				let urlArr = []
				urlArr.push(res.data[0])
				let body = {
					classifyId: this.classifyId,
					brandId: this.brandId,
					traderId: this.$route.params.id,
					certImgs: urlArr
				}
				this.addTraderCert(body)
			},
			handleHistory() {
				let id = this.$route.params.id
				let certId = this.$route.params.certId
				this.$router.push(`${basePath}/merchant/certHistory/${id}/${certId}`)
			},
			spuAuthorizationListLoading() { //已授权商品列表
				const api = '/goods/spuAuthorizationList/select';
				const body = {
					sellerId: this.$route.params.id,
					isExpired: this.formInlineData.isExpired,
					spuName:this.formInlineData.spuName,
					classifyId:this.formInlineData.classifyId,
					status: 2
				};
				this.spuLoading = true;
				axiosApi(api, body, this.spuAuthorizationListCallback, this.currentPage, 10);
			},
			spuAuthorizationListCallback(res) {
//				console.log(res, "shl")
				this.goodsInfo = res.data.data.elements;
				this.currentPage = res.data.data.pageIndex;
				this.total = res.data.data.totalCount;
				this.spuLoading = false;

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
			},
		}
	}
</script>

<style lang="less">
	#brandCheck {
		/*详情页面id*/
		.w110 {
			width: 110px;
		}
		.el-table thead th:first-child .cell:first-child {
			padding-left: 88px;
		}
	}
	
	#brandCheck .info {
		margin: 50px 0 0 0px;
		font-size: 14px;
	}
	
	#brandCheck .info .labelInfo2 {
		width: 102px;
		display: inline-block;
	}
	
	#brandCheck .info .labelInfo2 {
		width: 102px;
		display: inline-block;
	}
	
	#brandCheck .infoImg {
		width: 240px;
		height: 180px;
	}
	
	#brandCheck .ml-170 {
		margin-left: 170px;
	}
	
	.minh-500 {
		min-height: 500px;
	}
	
	#brandCheck .cert .el-upload-list--picture-card .el-upload-list__item-status-label {
		display: none;
	}
	
	.mr-75 {
		margin-right: 75px;
	}
	
	#brandCheck .fileList2 .el-upload--picture-card {
		display: none;
	}
	
	#brandCheck .el-upload-list--picture-card .el-upload-list__item-status-label {
		display: none;
	}
	
	.showState .credentials {
		position: relative;
		&::before {
			display: block;
			content: '待审核';
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