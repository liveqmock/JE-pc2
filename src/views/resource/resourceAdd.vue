<template>
	<div id="resourceAdd">
		<div class="title-top">
			<el-breadcrumb class="fl">
				<el-breadcrumb-item>菜单 / 资源配置</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="title-menu">

		</div>
		<div class="info mt-50">
			<el-form :model="form" :rules="rules" ref="form" label-width='238px'>
				<el-form-item label="所属系统:">
					<el-select v-model="form.appId" @change="applicationTypeChange">
						<el-option v-for="item in applicationTypeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label='类型:'>
					<el-select v-model="form.menuType">
						<el-option v-for="item in menuTypeOptions" :label="item.label" :value="item.value" key="$index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label='父级菜单:'>
					<!--props：修改默认的props属性名-->
					<el-cascader :props="config" :options="menuList" :change-on-select="true" v-model="parentIdOptions" clearable @change="handleMenuChange"></el-cascader>
				</el-form-item>
				<el-form-item label="菜单/资源名称:" prop="title">
					<el-input class="mr-10" placeholder="请输入菜单/资源名称" @change="titleChange" v-model="form.title"></el-input>
				</el-form-item>
				<el-form-item v-if='form.menuType == 2' label="code:" prop="code">
					<el-input class="mr-10" placeholder="请输入code码" v-model="form.code"></el-input>
				</el-form-item>
				<el-form-item label='图标:' v-if='form.menuType == 1'>
					<el-select v-model="form.icon" placeholder="请选择">
						<el-option v-for="item in icons" :label="item.label" :value="item.value" key="$index">
							<span class="fl">{{ item.label }}</span>
							<i class="fr iconfont" :class="item.value"></i>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item v-if='form.menuType == 1' label="排序值:" prop="sort">
					<el-input class="mr-10" placeholder="请输入排序值" @change="sortChange" v-model.trim="form.sort"></el-input>
				</el-form-item>
				<el-form-item v-if='form.menuType == 1' label="URL:" prop="url">
					<el-input class="mr-10" :maxlength="100" placeholder="请输入菜单/资源URL" v-model.trim="form.url"></el-input>
				</el-form-item>
				<el-form-item label="前置资源:">
					<span class="checkResource" @click="addStaff = true">选择前置资源</span>
				</el-form-item>
				<el-dialog title="选择前置资源" v-model="addStaff" @open="open" @close="handleclose">
					<el-checkbox-group v-model="checkList" class="pl-20 pr-40 pb-30 checkList">
						<el-checkbox class="ml-20 mb-20" v-for="item in resourcesList" :label="item.id" key="$index">{{ item.title }}</el-checkbox>
					</el-checkbox-group>
					<div slot="footer" class="dialog-footer">
						<el-button type="primary" @click="checkSure">确 定</el-button>
						<el-button @click="addStaff = false">取 消</el-button>
					</div>
				</el-dialog>
				<el-form-item class='mt-50'>
					<el-button type='primary' :disabled="disabled" :loading="loginLoad" @click="resourceAddSuer">保 存</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>

</template>

<script>
	import { axiosApi, basePath } from '../../api/api';
	import { MessageBox } from 'element-ui';
	import { bus } from "../../main";
	export default {
		data() {
			return {
				applicationTypeList: [{
					label: "商源平台系统",
					value: 1
				}, {
					label: "商源客户系统",
					value: 2
				}, {
					label: "商源云销系统",
					value: 3
				}],
				applicationType: 1,
				form: {
					appId: 1,
					menuType: 1,
					parentId: null,
					title: '',
					sort: 0,
					url: null,
					icon: null,
					permissionsIds: [],
					path: '',
					parentId: null,
					code:null
				},
				rules: {
					title: [
						{ required: true, message: '长度最大20位',max: 20, trigger: 'change' }
					],
					code: [
						{ message: '长度最大20位',max: 20, trigger: 'change' }
					],
					sort: [
						{ message: '请输入小于三位的整数', pattern: /^-?\d{0,3}$/, trigger: 'change' }
					],
					url: [{ pattern: /^\/[\w-/]+$/,message: '只能输入字母、数字、下划线、中划线、斜线'},{ min: 0,max: 100,message: '最大长度只能输100个字符'}]
				},
				addSystem: false,
				addStaff: false,
				menuTypeOptions: [{
					value: 1,
					label: '菜单'
				}, {
					value: 2,
					label: '按钮'
				}],
				checkList: [],
				icons: [
					{
						value: 'icon-mall',
						label: '商城'
					},{
						value: 'icon-wine',
						label: '商品'
					}, {
						value: 'icon-merchant',
						label: '商户'
					}, {
						value: 'icon-supplier-manage',
						label: '供应商'
					}, {
						value: 'icon-indent',
						label: '订单'
					},{
						value: 'icon-menu',
						label: '资源管理'
					}, {
						value: 'icon-org-struct',
						label: '组织结构'
					}, {
						value: 'icon-set',
						label: '设置'
					}
				],
				config: {
					label: "text",
					value: "id",
					children: "sub"
				},
				menuList: [],
				parentIdOptions: [],
				resourcesList: [],
				loginLoad: false,
				disabled: true,
				api: '/foundation/resource/update'
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.loading(this.applicationType);
				this.updateId = this.$route.params.id; //获取菜单/资源id
			})
		},
		methods: {
			open() {
				this.checkList = this.form.permissionsIds ? this.form.permissionsIds : [];
			},
			handleclose() {
				this.checkList = [];
			},
			checkSure() {
				this.form.permissionsIds = this.checkList;
				this.addStaff = false;
			},
			sortChange(val) {
				//				if(val.indexOf("-") > -1){
				//					this.disabled = true;
				//				}else{
				//					this.disabled = false;
				//				}
			},
			resourceAddSuer() {//添加或修改资源/菜单
				this.$refs['form'].validate((valid) => {
		        	if (!valid) return false;
					this.loginLoad = true;
					if(this.$route.params.id){
						this.api = '/foundation/resource/update';//修改
					}else{
						this.api = '/foundation/resource/insert';//添加
					}
					axiosApi(this.api, this.form, (res) => {
						this.loginLoad = false;
						//					console.log(this.form.menuType)
						if(this.form.menuType == 1) {
							axiosApi("/foundation/resource/displaytree", {
								"loginName": sessionStorage.loginName,
								'appId': 1
							}, (res) => {
								bus.$emit('naveTree', res.data.data);
							}, 1, 10);
						}
						this.$message({
							message: '操作成功！',
							type: 'success',
							duration: 1000
						});
						setTimeout(() => {
							this.$router.push(basePath + "/resource");
						}, 1000);
					}, 1, 10, (res) => {
						//					console.log(res.data)
						this.loginLoad = false;
						MessageBox.alert(res.data.message, '提示信息', {
							confirmButtonText: '确定'
						});
						return false;
					}, () => {
						this.loginLoad = false;
					});
				});
			},
			loading() {
				this.loadingApplication();
				if(this.$route.params.id) {//修改：读取修改信息
					axiosApi('/foundation/resource/selectinfo', {
						'id': this.$route.params.id
					}, (res) => {
						this.disabled = this.form.title.length > 0;
						this.form = res.data.data;
						if(this.form.path) this.parentIdOptions = this.form.path.split(",").map((item) => {
							return parseInt(item);
						}); //把字符串转化为字符串数组并转化为数字数组
						this.parentIdOptions.splice(-1);
						this.form.parentId = this.parentIdOptions[this.parentIdOptions.length - 1];
						this.checkList = this.form.permissionsIds;
					}, 1, 10);
				}
			},
			loadingApplication() {//获取菜单列表和前置资源列表
				axiosApi('/foundation/resource/initdata', {
					menuType: 1,
					appid: this.applicationType
				}, (res) => {
					this.menuList = res.data.data.resources ? res.data.data.resources : [];
					this.resourcesList = res.data.data.permissions ? res.data.data.permissions : [];
				});
			},
			applicationTypeChange(val) {
				//			console.log(val)
				this.applicationType = val;
				this.loadingApplication(val);
			},
			handleMenuChange(val) {
				//				this.form.path = val[val.length-1];
				//				this.form.parentId = this.form.path.split(',')[val.length-1];
				this.form.parentId = val[val.length - 1];
				this.form.path = val.join(",");
				//				console.log(this.form.parentId,"aaa",this.form.path);

			},
			titleChange(val) {
				if(val.length > 0) {
					this.disabled = false;
				} else {
					this.disabled = true;
				}
			}
		}
	}
</script>

<style scoped>
	.el-select-dropdown__item .iconfont {
		line-height: 16px;
	}
	
	.selected .iconfont {
		color: #fff;
	}
	
	.checkResource {
		color: #00AAEE;
		cursor: pointer;
	}
	
	.checkList {
		height: 250px;
		overflow-y: scroll;
	}
</style>