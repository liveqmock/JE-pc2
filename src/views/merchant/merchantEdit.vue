<template>
	<div id="merchantEdit" v-loading='allLoading'>
		<div class="title-menu">
			<div class="clearfix">
				<div class="fl" style="padding: 30px 0 19px 15px;">
					<div class="fl font-20 color-3">{{storeName}}</div>
					<div :style="{marginLeft : '30px',clear : 'both',marginTop:'40px'}">
						营业时间：
						<template v-if="exportData.isOpenAllHours">
									24小时全天营业
						</template>
						<template v-else>
							<span>{{exportData.shopTime}}</span>
							--
							<span>{{exportData.closingTime}}</span>
						</template>
						<el-tag v-if="exportData.businessStatus === 0">营业中</el-tag>
						<el-tag v-if="exportData.businessStatus === 1">打烊中</el-tag>
						<el-tag v-if="exportData.businessStatus === 2">关闭中</el-tag>

						<span :style="{marginLeft : '30px'}" class="font-12 lh-26" v-if="exportData.gmtLogin">最近登录时间：{{exportData.gmtLogin | time}}</span>
					</div>
					<div class="fl ml-50 lh-26" v-if="exportData.state=='2'">
						<!--<el-button @click='handleIsDisable' type='text' class='merchantBtn font-12'>{{exportData.isDisable=='0'?'禁用该商家':'启用该商家'}}</el-button>-->
					</div>
				</div>
			</div>
			<el-tabs v-model='activeTab' @tab-click="handleTabClick">
				<el-tab-pane label="基本资料" name="first"></el-tab-pane>
				<el-tab-pane v-if="exportData.traderType=='2'" label="销售资质" name="second"></el-tab-pane>
				<el-tab-pane v-if="exportData.traderType=='2'" label="已授权商品" name="third"></el-tab-pane>
			</el-tabs>
		</div>
		<!--基本资料-->
		<div v-if="activeTab=='first'" class="info mt-30">
			<!--账户信息-->
			<div class="ml-50 font-18 color-6 pb-30">
				<label class="ml-10">账号信息</label>
				<div class="info-box mt-20 pb-40 mr-45">
					<span>
						<img v-if="avater" :src="avater" alt="" align="absmiddle"/>
						<img v-else src="../../assets/header.jpg" alt="" align="absmiddle"/>
					</span>
					<span class="font-14 ml-20">{{telNum}}</span>
					<el-button class="ml-30" @click="isShowInfoDialog = true">编辑信息</el-button>
				</div>
				<div class="mt-30 ml-10"><label>店铺信息</label></div>
			</div>
			<!--账户信息弹出框-->
			<el-dialog title="账号信息" :visible.sync="isShowInfoDialog" @close="goBackPage">
				<div class="info-mian" v-loading="loding">
					<el-form class='ml-100' :model='ruForm' label-width='130px' :rules="gz" ref="ruForm">
						<el-form-item label="用户名:">
							<el-input class='fl' v-model="ruForm.loginName" :disabled="true"></el-input>
						</el-form-item>
						<el-form-item label="当前头像:">
							<span class="fl">
								<el-upload class="avatar-uploader" action="/sunrise-gateway/oss/ossUpload" :show-file-list="false" :on-success="AvatarScucess" :before-upload="beforeUpload">
									<img v-if='ruForm.headportraitUrl' class='icon-90' :src="ruForm.headportraitUrl" >
									<i v-else class="el-icon-plus avatar-uploader-icon icon-90"></i>
								</el-upload>
							</span>
						</el-form-item>
						<el-form-item label="姓名:" prop='employeeName'>
							<el-input class='fl' v-model.trim="ruForm.employeeName"></el-input>
						</el-form-item>
						<el-form-item label="业务联系电话:" prop='businessMobile'>
							<el-input v-model.trim="ruForm.businessMobile"></el-input>
						</el-form-item>
						<el-form-item label="业务联系邮箱:" prop='email'>
							<el-input v-model.trim="ruForm.email"></el-input>
						</el-form-item>
						<el-form-item label="联系地址:">
							<el-cascader clearable :options="areas" :show-all-levels="true" placeholder='请选择地区' v-model='ruForm.businessDistrictPath'></el-cascader>
						</el-form-item>
						<el-form-item label="" prop='businessAddress'>
							<el-input v-model.trim="ruForm.businessAddress"></el-input>
						</el-form-item>
					</el-form>
				</div>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="handleSave()">确 定</el-button>
					<el-button @click="goBackPage">取 消</el-button>
				</div>
			</el-dialog>
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
					<el-upload :class="isDisableLicense?'fileList2':''" action="/sunrise-gateway/oss/ossUpload" :file-list='exportData.licenseImg2' list-type="picture-card" :on-preview="handlePictureCardPreview" :on-success="handleLicensePhotoScucess" :before-upload="beforeAvatarUpload" :on-remove="handleRemoveLicense">
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
					<el-button @click='handleReset'>重置</el-button>
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

		<!--销售资质-->
		<el-form v-show="activeTab=='second'" class='mt-50 cert' :inline='true' label-width='170px'>
			<div v-for='(item,index) in CertRecordArr' key="$index">
				<el-form-item label="商品分类:">
					<el-select palceholder='请选择' v-model='item.classifyId' disabled>
						<el-option v-for='(classItem,classIndex) in classifyList' :label='classItem.classifyName' :value='classItem.id' :key="classIndex">
						</el-option>
					</el-select>
				</el-form-item>
				<!--<el-form-item label="商品品牌:">
					<el-select palceholder='请选择' v-model='item.brandId' disabled>
						<el-option 
							v-for="(brandItem,brandIndex) in brandList2" 
							:label='brandItem.brandName' 
							:value='brandItem.id' 
							:key="brandIndex">
						</el-option>
					</el-select>
				</el-form-item>-->
				<el-form-item label="商品品牌:">
					<!--<el-select v-model="item.brandId" filterable clearable disabled remote placeholder="请输入关键词" :remote-method="remoteMethod" :loading="loading">
						<el-option v-for="item in brandList2" :key="item.id" :label="item.brandName" :value="item.id">
						</el-option>
					</el-select>-->
					<el-input v-model.trim="item.brandName" disabled></el-input>
				</el-form-item>

				<el-form-item label="授权方:">
					<el-input v-model.trim='item.authorizeName' disabled></el-input>
				</el-form-item>
				<div class="showState" ref="c">
					<!--<el-upload class="mt-10 mb-10 ml-170" action="/sunrise-gateway/oss/ossUpload" list-type="picture-card" :on-preview="handlePictureCardPreview" :file-list="item.certRelationVOs" :before-upload="beforeAvatarUpload" :on-success="handleCertScucess">
					</el-upload>
					<el-dialog v-model="dialogVisible" size="tiny">
						<img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>-->
					<el-upload class="mt-10 mb-10 ml-170" action="/sunrise-gateway/oss/ossUpload" :file-list="item.certRelationVOs" list-type="picture-card" :on-preview="handlePictureCardPreview" :before-upload="beforeAvatarUpload" :on-success="handleCertScucess">

					</el-upload>
					<el-dialog v-model="dialogVisible" size="tiny">
						<img width="100%" :src="dialogImageUrl" alt="show-message">
					</el-dialog>
				</div>
			</div>
		</el-form>

		<!--已授权商品-->
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
				<el-table-column label="操作" width="135px" align="center">
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
				licenseImgdialogVisible: false, //营业执照照片放大
				ruleForm: {
					reason: ''
				},
				form: {},
				dialogImageUrl: '',
				dialogVisible: false,
				activeTab: 'first',
				value: '',
				exportData: {
					selectedAddress: [],
					attr: null,
					licenseNum: null,
					licenseImg2: [], //营业执照照片
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
				loading: false, //基本信息loading
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
						message: '请输入商家姓名',
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
						message: '长度在 4 到 50 个字符',
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
					}, {
						min: 1,
						max: 1,
						type: 'array',
						message: '请上传1张营业执照图片'
					}],
					fileList2: [{
						required: true,
						message: '请上传门店图片',
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
				isDisableLicense: false, //营业执照是否显示+好
				isDisable: false, //门店照片是否显示+好
				storeName: null,
				isShowInfoDialog: false, //账号信息弹出框
				avater: "", //头像
				telNum: "", //手机号
				employeeId: "",
				areas: rawCitiesData, //全国各省
				loding: false,
				ruForm: {
					loginName: null,
					employeeName: null,
					businessMobile: null,
					email: null,
					businessDistrictPath: [],
					headportraitUrl: null,
					businessAddress: null,
					id: null,
				},
				subForm: {}, //更改内容
				gz: {
					employeeName: [{
						pattern: /^[\u4e00-\u9fa5a-zA-Z]{2,6}$/,
						message: '只能输入汉字或英文，长度在2-6位'
					}],
					businessMobile: [{
						pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,
						message: '请输入正确的号码'
					}],
					email: [
						//						{ pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入正确的邮箱格式', trigger: 'blur' },
						{
							pattern: /^(?=\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$).{0,20}$/,
							message: '请输入正确的邮箱格式,且长度不能大于20'
						}

					],
					businessAddress: [{
						min: 4,
						max: 30,
						message: '详细地址长度在4-30'
					}]
				},
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.classifyTopList() //查看分类
				this.brandList() //查看所有品牌
				//				this.findTraderCertRecord() //查看销售资质信息调用
				if(this.$route.params.state) {
					this.state = this.$route.params.state
				}
				//				console.log(this.activeTab, "activeTab")
				if(this.activeTab == 'first') {
					this.findStoreInfo()
				}
				if(sessionStorage.activeTab) {
					this.activeTab = sessionStorage.activeTab;
					this.handleTabClick();
					sessionStorage.removeItem("activeTab");
				}
			})
		},
		methods: {
			remoteMethod(query) {
				this.brandList()
			},
			//获取账户信息
			getInfo(id) {
				const api = "/foundation/employee/selectExtJson";
				const body = {
					id: id
				}
				axiosApi(api, body, (res) => {
					//console.log(res,'账户信息')
					this.ruForm = res.data.data;
					this.ruForm.id = id;
					if(this.ruForm.businessDistrictPath != null) {
						this.ruForm.businessDistrictPath = this.ruForm.businessDistrictPath.split(",")
					} else {
						this.ruForm.businessDistrictPath = []
					}
				}, this.currentPage, 10)
			},
			beforeUpload(file) { //上传之前图片的判断
				const isImage = (file.type.indexOf('jpg') != -1 || file.type.indexOf('jpeg') != -1 || file.type.indexOf('png') != -1 || file.type.indexOf('bmp') != -1);
				const isLt4M = file.size / 1024 / 1024 < 4;
				const isLt0M = file.size / 1024 / 1024 > 0;
				if(!isImage) {
					this.$message.error('请上传格式为png或jpg的图片文件!');
				} else if(!isLt4M) {
					this.$message.error('上传图片大小不能超过 4MB!');
				} else if(!isLt0M) {
					this.$message.error('上传图片大小不能是 0MB!');
				}
				if(isLt4M && isLt0M && isImage) {
					this.loding = true;
				}
				return isImage && isLt4M && isLt0M;
			},
			//上传头像
			AvatarScucess(res) {
				this.loding = false;
				this.ruForm.headportraitUrl = res.data[0];
			},
			//关闭弹出框
			goBackPage() {
				this.isShowInfoDialog = false;
			},
			//保存账户信息
			handleSave() {
				this.$refs.ruForm.validate((valid) => {
					if(valid) {
						this.subForm = Object.assign({}, this.ruForm);
						this.subForm.businessDistrictPath = this.subForm.businessDistrictPath.join(',');
						const api = "/foundation/employee/updateExtJson";
						axiosApi(api, this.subForm, (res) => {
							this.$message({
								type: 'success',
								message: '提交成功!',
								duration: 1000
							});
							this.isShowInfoDialog = false;
							this.findStoreInfo();
						}, this.currentPage, 10, (res) => {
							this.$message({
								type: 'info',
								message: res.data.message,
								duration: 3000
							});
						})
					} else {
						this.$confirm('请正确填写信息！', '提示信息', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							showCancelButton: false,
							type: 'warning'
						})
						return false;
					}
				});
			},
			/*上传营业执照函数*/
			handleLicensePhotoScucess(res, file, fileList) {
				this.loading = false
				this.exportData.licenseImg2 = [{
					url: res.data[0]
				}]
				this.isDisableLicense = fileList.length >= 1
				this.$refs.infoForm.validateField("licenseImg2") //部分表单字段验证
			},
			/*删除营业执照处理函数*/
			handleRemoveLicense(file, fileList) {
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
			handleTabClick() {
				if(this.activeTab == 'second') { //切换到销售资质

					this.findTraderCertRecord() //查看销售资质信息调用
				}
				if(this.activeTab == 'third') { //切换到已授权商品
					sessionStorage.setItem("obj", JSON.stringify({
						loginName: this.exportData.loginName,
						storeName: this.exportData.storeName,
						sellerId: this.$route.params.id
					}))
					this.spuAuthorizationListLoading()
				}
			},
			findStoreInfo() { //进货商的店铺信息（回显） 显示商户的基本信息
				const api = '/trader/findStoreInfo/select'
				if(this.$route.params.id) {
					let body = {
						traderId: this.$route.params.id
					}
					axiosApi(api, body, (res) => {
						this.loading = false
						//console.log(res,'店铺信息')
						//账户信息
						this.avater = res.data.data.userAvater;
						this.telNum = res.data.data.tel;
						this.employeeId = res.data.data.employeeId;
						this.getInfo(this.employeeId);
						this.exportData = res.data.data;
						this.exportData.storeName = res.data.data.storeName ? res.data.data.storeName.trim() : '';
						this.deliveryAddressVO = this.exportData.deliveryAddressVO ? this.exportData.deliveryAddressVO : {};
						//级联选择器显示数据
						this.selectedOptions = [this.deliveryAddressVO.provinceId + '', this.deliveryAddressVO.cityId + '', this.deliveryAddressVO.regionId + '']
						//表单验证需要赋值给 form表单下的字段
						this.exportData.selectedAddress = this.selectedOptions
						this.exportData.attr = this.deliveryAddressVO.attr
						this.photos = res.data.data.photos
						/*营业执照改成能删除、放大类型*/
						this.exportData.licenseImg2 = [{
							url: this.exportData.licenseImg
						}]
						this.licenseImg = this.exportData.licenseImg2
						this.isDisableLicense = this.licenseImg.length >= 1
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
							duration: 1000
						})
						this.loading = false
					})
				}

			},
			handleRemove(file, fileList) { //图片删除处理函数
				console.log(file,fileList)
				if(file.id){
					this.deleteImgList.push(file.id) //存储删除图片的信息（id,url）
				}else{
					this.newImgList = this.newImgList.filter(item=> file.response.data[0] != item)
				}
				this.exportData.fileList2 = fileList
				this.$refs.infoForm.validateField("fileList2"); //部分表单字段验证	
				this.isDisable = fileList.length >= 2
			},
			handleAvatarPhotoScucess(res, file, fileList) { //上传图片销售资质（增加）
				this.newImgList.push(res.data[0])
				this.loading = false
				this.exportData.fileList2 = fileList
				this.isDisable = fileList.length >= 2
				this.$refs.infoForm.validateField("fileList2"); //部分表单字段验证
			},
			beforeAvatarUpload(file) { //上传之前图片的判断
				//				////console.log(file)
				const isImage = (file.type.indexOf('jpg') != -1 || file.type.indexOf('jpeg') != -1 || file.type.indexOf('png') != -1 || file.type.indexOf('bmp') != -1);
				const isLt4M = file.size / 1024 / 1024 < 4;
				const isLt0M = file.size / 1024 / 1024 > 0;
				if(!isImage) {
					this.$message.error('请上传格式为png或jpg的图片文件!');
				} else if(!isLt4M) {
					this.$message.error('上传图片大小不能超过 4MB!');
				} else if(!isLt0M) {
					this.$message.error('上传图片大小不能是 0MB!');
				}
				if(isLt4M && isLt0M && isImage) {
					this.loading = true;
				}
				return isImage && isLt4M && isLt0M;
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
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
				//			console.log(traderPhotoRelationParams, 'traderPhotoRelationParams')
				axiosApi(api, body, (res) => {
					////console.log(res)
					this.$message({
						type: 'success',
						message: '保存成功！',
						duration: 1000
					})
					this.loading = false
					this.findStoreInfo()

				}, 1, 10, (res) => {
					this.$message({
						type: 'error',
						message: res.data.message,
						duration: 1000
					})
					this.loading = false
					this.findStoreInfo()
				})
			},
			isDisableTrader(done) { //商家禁用，启用接口
				const api = '/trader/isDisableTrader/select'
				let body = {
					id: this.$route.params.id,
					isDisable: this.exportData.isDisable == '0' ? '1' : '0'
				}
				axiosApi(api, body, (res) => {
					//console.log(res)
					this.$message({
						type: 'info',
						message: '操作成功！',
						duration: 1000
					})
					done()
					this.findStoreInfo()
				}, 1, 10, (res) => {
					this.$message({
						type: 'error',
						message: res.data.message,
						duration: 1000
					})
					done()
				})
			},
			handleIsDisable() { //商家 启用，禁用处理函数
				let h = this.$createElement;
				this.$msgbox({
					title: '提示信息',
					message: h('p', null, [
						h('p', {
							style: 'text-align:center;margin-bottom:20px'
						}, `是否${this.exportData.isDisable==0?'禁用':'启用'}该商家`),
					]),
					showCancelButton: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					beforeClose: (action, instance, done) => {
						if(action === 'confirm') {
							this.isDisableTrader(done)
						} else {
							done()
						}
						delete instance.$slots.default;
					}
				})
			},
			handleCurrentChange(val) { //处理分页 - 改变当前页
				this.currentPage = val;
				this.spuAuthorizationListLoading()

			},
			findTraderCertRecord() { // 编辑销售资质（或查看销售资质记录）
				const api = '/trader/findTraderCertRecord/select'
				axiosApi(api, {
					traderId: this.$route.params.id,
					state: 2
				}, (res) => {
					//				console.log(res, '销售资质--')
					this.CertRecordArr = res.data.data
					if(this.CertRecordArr != null) {
						this.CertRecordArr.forEach((item) => {
							this.brandList2.forEach(brandItem => {
								if(brandItem.id == item.brandId) item.brandName = brandItem.brandName
							})
							item.certRelationVOs = item.certRelationVOs.filter((i) => {
								if(i.state == 2) {
									i.url = i.certImg
									i.brandId = item.brandId
									i.classifyId = item.classifyId
								}
								return i.state == 2
							})
						})
					} else {
						this.CertRecordArr = []
					}
				})
			},
			brandList() { //检索所有的品牌接口 传值为空 查询所有
				const api = '/goods/brandList/select'
				axiosApi(api, {}, (res) => {
					//				console.log(res, '检索所有的品牌接口')
					this.brandList2 = res.data.data.elements
				})
			},
			classifyTopList() { //根据品类，检索关联的一级分类 所有分类
				const api = '/goods/classifyTopList/select'
				let body = {
					classificationId: ''
				}
				axiosApi(api, body, (res) => {
					//				console.log(res)
					this.classifyList = res.data.data
				})
			},
			handleCertScucess(res, file, fileList) { //Upload图片上传成功处理函数
				this.dialogImageUrl = res.data[0]
				//			console.log(res, file.url, fileList)
				let certId = fileList[0].certId
				//			console.log(certId)
				let urlArr = []
				urlArr.push(res.data[0])
				let body = {
					certId: certId,
					certImgs: urlArr
				}
				this.homeAddCertImg(body)
			},
			homeAddCertImg(body) {
				const api = '/trader/homeAddCertImg/update'
				axiosApi(api, body, (res) => {
					//				console.log(res)
					this.$message({
						type: 'info',
						message: '上传成功！'
					})
					this.findTraderCertRecord()
				})
			},
			spuAuthorizationListLoading() { //已授权商品列表
				const api = '/goods/spuAuthorizationList/select';
				const body = {
					sellerId: this.$route.params.id,
					isExpired: this.formInlineData.isExpired,
					spuName:this.formInlineData.spuName,
					classifyId:this.formInlineData.classifyId,
					status:2
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
			goPage() {
				this.$router.push(`${basePath}/merchant/addGood`)
			},
			handleReset() {
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
							this.$refs.infoForm.resetFields()
							this.findStoreInfo()
							done()
						} else {
							done()
						}
						delete instance.$slots.default;
					}
				})
			},
			updateTraderStateAndInfo(state, reason) { //平台：审核（编辑，审核同时修改）
				let addressName = this.$refs.a.$el.innerText.split("/")
				let licenseImg = this.exportData.licenseImg[0].url
				let traderPhotoRelationParams = []
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
					traderPhotoRelationParams: traderPhotoRelationParams,
					state: state,
					reason: reason
				})
				this.loading = true
				//			console.log(body)
				axiosApi('/trader/updateTraderStateAndInfo/update', body, (res) => {
					this.loading = false
					this.$message({
						type: 'success',
						message: '操作成功！',
						duration: 1000
					})
					localStorage.setItem('activeTab', '2')
					this.$router.push(basePath + '/merchant/allMerchantList')
				}, 1, 10, (res) => {
					this.loading = false
					this.$message({
						type: 'info',
						message: res.data.message,
						duration: 1000
					})
				})
			},

			handlePass() { //审核通过处理函数
				this.$refs.infoForm.validate((valid) => {
					if(valid) {
						let that = this
						let h = this.$createElement;
						this.$msgbox({
							title: '提示信息',
							message: h('p', null, [
								h('p', null, '确定审核通过吗？ '),
							]),
							showCancelButton: true,
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning',
							beforeClose: (action, instance, done) => {
								if(action === 'confirm') {
									this.updateTraderStateAndInfo('2', null)
									done()
								} else {
									done();
								}
								delete instance.$slots.default;
							}
						})

					} else {
						return false
					}
				})

			},
			handleFail() { //审核不通过处理函数
				this.$refs.infoForm.validate((valid) => {
					if(valid) {
						this.failDialogVisible = true
					} else {
						return false
					}
				})
			},
			handleCommit(formName) { // 弹出框 审核不通过 处理函数（确定按钮）
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.failDialogVisible = false
						this.updateTraderStateAndInfo('3', this.ruleForm.reason)
					} else {
						return false
					}
				})
			},
			handleReset2(formName) { //再次点击弹出框 清空 内容
				this.failDialogVisible = false
				this.$refs[formName].resetFields();
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
	#merchantEdit .phone,
	#merchantEdit .name {
		position: absolute;
		color: #999;
	}
	
	#merchantEdit .merchantBtn {
		padding: 0;
		width: auto;
		height: auto;
	}
	
	#merchantEdit .title-menu .el-breadcrumb {
		font-size: 12px;
	}
	
	#merchantEdit .phone {
		margin-left: 254px;
	}
	
	#merchantEdit .lh-26 {
		line-height: 26px;
	}
	
	#merchantEdit .ml-170 {
		margin-left: 170px;
	}
	
	#merchantEdit .el-upload-list--picture-card .el-upload-list__item-status-label {
		display: none;
	}
	
	#merchantEdit .cert .el-icon-delete2 {
		display: none;
	}
	
	#merchantEdit .fileList2 .el-upload--picture-card {
		display: none;
	}
	
	#merchantEdit .w110 {
		width: 110px;
	}
	
	#merchantEdit .el-table thead th:first-child .cell:first-child {
		padding-left: 88px;
	}
	
	#merchantEdit {
		.info-box {
			border-bottom: 1px solid #d1dbe5;
			img {
				width: 90px;
				height: 90px;
			}
			.el-button {
				height: 26px;
				color: #20a0ff;
			}
		}
		.el-dialog--small {
			width: 620px;
		}
		.info-mian {
			.avatar-uploader-icon {
				border: 1px solid #ddd;
				width: 90px;
				height: 90px;
				line-height: 90px;
				font-size: 30px;
			}
			.el-upload--picture-card {
				width: 90px;
				height: 90px;
			}
			.el-upload-list--picture-card .el-upload-list__item {
				width: 90px;
				height: 90px;
			}
		}
	}
</style>