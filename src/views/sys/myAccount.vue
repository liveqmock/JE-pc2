<template>
	<div id="myAccount">
		<div class="title-top">
			<div class="clearfix">
				<el-breadcrumb class="fl">
					<el-breadcrumb-item>我的账户</el-breadcrumb-item>
				</el-breadcrumb>
				<el-button class="edit-btn" @click='goPage'>返回</el-button>
				<el-button class="edit-btn mr-0" @click="boomTrue('form2')">修改密码</el-button>
			</div>
		</div>
		<div class="main">
			<div class='info clearfix'>
				<el-form :model="form" class='mb-50' :rules="rules" ref="form">
					<el-form-item class='fl' label="登录账号">
						<el-input class='fl ml-20' v-model.trim='form.loginName' disabled></el-input>
					</el-form-item>
					<el-form-item class='fl' label="所属地区">
						<el-cascader class='ml-20' :options="searchDepartmentList" :props="config" v-model='form.districtPath' show-all-levels disabled placeholder='全国' change-on-select></el-cascader>
					</el-form-item>
					<el-form-item class='fl' label="姓名">
						<el-input class='fl ml-20' v-model.trim='form.employeeName' disabled></el-input>
					</el-form-item>
					<el-form-item class='fl' label="所属部门">
						<el-cascader class='ml-20' :options="data3" :props="config" show-all-levels v-model='form.departmentPath' disabled change-on-select></el-cascader>
						<span v-if='form.isDepartmentLeader == 1' class='ml-10 font-12 color-blue'>(部门负责人)</span>
					</el-form-item>
					<el-form-item class='fl' label="手机号" prop='mobile'>
						<el-input class='fl ml-20' :disabled='disMobile' v-model.trim='form.mobile'></el-input>
						<span class='ml-10  color-blue cursor' @click="EditPeople('form')">{{this.text}}</span>
					</el-form-item>
					<el-form-item class='fl' label="职位">
						<el-input class='fl ml-20' v-model.trim='form.position' disabled></el-input>
					</el-form-item>
				</el-form>
			</div>
			<div class='limits mt-30 pl-20'>
				<p class="font-14 ml-100 mb-20">我的权限</p>
				<div class='ml-100 mr-100 bd'>
					<el-form class="mb-50 clearfix mt-30 " v-for="(item,index1) in lists" key="$index">
						<fieldset class="bd ml-50 mr-50">
							<legend class="ml-10 pl-20 pr-20">
								<el-checkbox class='mr-40 mb-10' v-model="checked" onclick="return false;">{{item.name}}</el-checkbox>
							</legend>
							<div v-for='(item,index) in item.sub' key="$index">
								<el-checkbox class="color-3 mr-30 fl mb-10 mt-10 ml-15 width-640" v-model="checked" :label="item.id" onclick="return false;" @change="handleCheckAllChange(index1,index,0)">{{item.name}}</el-checkbox>
								<span class="fl ml-30">
									  <el-checkbox-group v-model="checked"> 
									    <el-checkbox class='width-110 mb-10 hides' :title="item.text" v-for='item in item.sub' key="$index" :label="item.id" onclick="return false;" @change="handleCheckedCitiesChange(index1,index)">{{item.name}}</el-checkbox>
									  </el-checkbox-group>
								</span>
							</div>
						</fieldset>
					</el-form>
				</div>
			</div>
			<!--修改密码弹窗-->
			<el-dialog title="修改密码" v-model="boom">
				<el-form :inline="true" :model="form2" class="clearfix form2" :rules="rules" ref="form2">
					<el-form-item class='mb-50' label="原密码:" prop='loginPwd'>
						<el-input type='password' v-model="form2.loginPwd"></el-input> 
					</el-form-item>
					<el-form-item label="新密码:" prop='pass'>
						<el-input type='password' v-model="form2.pass"></el-input>
					</el-form-item>
					<el-form-item label="确认新密码:" prop='checkPass'>
						<el-input type='password' v-model="form2.checkPass"></el-input>
					</el-form-item>

				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click='changePassword("form2")'>确 定</el-button>
					<el-button @click="boom=false">取 消</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import { axiosApi, basePath } from '../../api/api'
	import md5 from "md5"
	export default {
		data() {
			var validatePass = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入密码'));
				} else {
					if(this.form2.checkPass !== '') {
						this.$refs.form2.validateField('checkPass');
					}
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请再次输入密码'));
				} else if(value !== this.form2.pass && value !== '') {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				subForm: {},
				text: "修改",
				form: {
					loginName: null,
					employeeName: null,
					mobile: null,
					position: null,
					departmentPath: [],
					districtPath: [],
					litm: null
				},
				form2: {
					loginPwd: '',
					pass: '',
					checkPass: ''
				},
				num:0,
				boom: false, //修改密码弹窗是否弹出
				searchDepartmentList: [], //所有地区
				data3: [], //部门列表
				disMobile: true, //修改手机号
				list: [], //获取所有权限
				roleList: [], //角色对应的权限
				lists: [], //层级关系的权限列表
				checked: true, //默认都选中
				config: {
					label: "text",
					children: "sub",
					value: "id"
				},
				//手机号验证
				rules: {
					mobile: [{
						pattern: /^1\d{10}$/,
						message: '请输入正确的手机号码',
						trigger: 'blur'
					}],
					loginPwd: [{
						required: true,
						message: '请输入原密码',
					}, {
						min: 6,
						max: 16,
						message: '请输入6-16位字符',
					}],
					pass: [{
						required: true,
						validator: validatePass,
						trigger: 'blur'
					}, {
						min: 6,
						max: 16,
						message: '请输入6-16位字符'
					}],
					checkPass: [{
						required: true,
						validator: validatePass2,
						trigger: 'change' 
					}],
				},
			};

		},
		methods: {
			//			获取账户信息
			achieve() {
				const api = "/foundation/employee/selectOneByLoginName";
				axiosApi(api, {
					loginName: sessionStorage.loginName,
					appId: 1
				}, this.callback, this.currentPage, 10)
			},
			callback(res) {
				this.form = res.data.data;
				if(this.form.roles.length > 0) this.roleList = this.form.roles[0].resourcesList //获取权限列表
				this.changeArr(); //地区/部门转化
			},
			//			获取地区/部门转化
			changeArr() {
				if(this.form.departmentPath) {
					if(this.form.departmentPath.indexOf(",") != -1) {
						this.form.departmentPath = this.form.departmentPath.split(",").map((item) => {
							return parseInt(item);
						});
					} else {
						let arr = []
						arr.push(parseInt(this.dep))
						this.form.departmentPath = arr
					}
				}
				if(this.form.districtPath == null) {
					this.form.districtPath = []
				} else {
					this.form.districtPath = this.form.districtPath.split(",").map((item) => {
						return parseInt(item);
					});
				}
			},
			//查询地区
			searchAreas() {
				const api = "/foundation/district/displayTree";
				axiosApi(api, {}, this.searchAreas1, this.currentPage, 10)
			},
			searchAreas1(res) {
				this.searchDepartmentList = res.data.data
			},
			//获取所有部门
			getDepList() {
				const api = "/foundation/department/displayTree";
				axiosApi(api, {
					applicationType: 1
				}, (res) => {
					this.data3 = res.data.data ? res.data.data : [];
				}, this.currentPage, 10)
			},
			//修改手机号
			EditPeople(form) {
				if(this.text == '修改') {
					this.disMobile = false
					this.text = '保存'
				} else {
					let _this = this
					this.subForm = Object.assign({}, this.form);
					this.subForm.departmentPath = this.subForm.departmentPath.join(',')
					if(this.subForm.districtPath.length == 0) {
						this.subForm.districtPath = null
					} else {
						this.subForm.districtPath = this.subForm.districtPath.join(',')
					}
					this.$refs[form].validate((valid) => {
						if(valid) {
							let that = this;
							this.$confirm('您确定要修改手机号？', '提示信息', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
							}).then(() => {
								const api = "/foundation/employee/update";
								const body = {
									id: this.subForm.id,
									loginName: this.subForm.loginName,
									mobile: this.subForm.mobile,
									appId: 1,
								};
								axiosApi(api, body, (res) => {
									this.$message({
										type: 'success',
										message: '修改成功!',
										duration: 1000
									});
									this.disMobile = true,
										this.text = '修改'

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
									message: '已取消提交'
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
				}
			},
			callback6(res) {
				this.$message({
					type: 'success',
					message: '保存成功!',
					duration: 1000
				});
				this.disMobile = true
				this.text = '修改'
			},
			//			获取所有权限
			achieveList() {
				const api = "/foundation/resource/displaytree";
				axiosApi(api, {
					loginName: sessionStorage.loginName,
					appId: 1
				}, (res) => {
					if(!!res.data.data) this.list = res.data.data;
					this.getOwn()
				}, this.currentPage, 10)
			},
			//			获取具有层级关系 我的权限
			getOwn() {
				let _this = this;
				if(this.list.length > 0) this.list.forEach(function(item, index) {
					_this.roleList.forEach(function(item1, index1) {
						if(item.id == item1.id) {
							let obj = {}
							obj.name = item.text
							obj.sub = []
							if(item.sub) {
								item.sub.forEach(function(item3, index3) {
									_this.roleList.forEach(function(item4, index4) {
										if(item3.id == item4.id) {
											let obj1 = {}
											obj1.name = item3.text
											obj.sub.push(obj1)
											obj1.sub = []
											if(item3.sub) {
												item3.sub.forEach(function(item5, index5) {
													_this.roleList.forEach(function(item6, index6) {
														if(item5.id == item6.id) {
															let obj2 = {}
															obj2.name = item5.text
															obj1.sub.push(obj2)

														}
													})
												})
											}
										}

									})

								})
								_this.lists.push(obj)
							}
						}

					})

				})
			},
			//修改密码弹框
			boomTrue(form2) {
				this.boom = true
				this.form2.loginPwd = ''
				this.form2.pass = ''
				this.form2.checkPass = ''
				this.num++ 
				if(this.num > 1){
					this.$refs[form2].resetFields()
				}
			},
			//			密码修改
			changePassword(form2) {
				this.$refs[form2].validate((valid) => {
					if(valid) {
						let that = this;
						this.$confirm('您确定要修改密码？', '提示信息', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							const api = "/foundation/employee/modifyPwd";
							const body = {
								appId: 1,
								loginName: this.form.loginName,
								loginPwd: md5(this.form2.loginPwd),
								newLoginPwd: md5(this.form2.pass),
							};
							axiosApi(api, body, (res) => {
								this.$message({
									type: 'success',
									message: '修改成功!',
									duration: 1000
								});
								this.boom = false
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
								message: '已取消提交'
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
			//点击返回
			goPage() {
				history.go(-1)
			}
		},
		//进入加载
		mounted() {
			this.$nextTick(() => {
				this.achieve();
				this.searchAreas(); //获取所有地区
				this.getDepList(); //获取所有部门
				this.achieveList(); //获取所有权限
			})
		}
	}
</script>

<style lang="less">
	#myAccount {
		.el-form-item {
			width: 530px;
		}
		.el-form-item__error {
			margin-left: 205px;
		}
		.limits {
			width: 1050px;
		}
		.el-checkbox__input.is-checked .el-checkbox__inner {
			background-color: #9E9E9E;
			border-color: #9E9E9E
		}
		.form2 .el-form-item__error {
			margin-left: 0px;
		}
		.form2 .el-form-item__label {
			width: 160px;
		}
		.hides {
			overflow: hidden;
			/*自动隐藏文字*/
			text-overflow: ellipsis;
			/*文字隐藏后添加省略号*/
			white-space: nowrap;
		}
		.width-110 {
			width: 110px;
		}
		.el-checkbox {
			margin-left: 0;
		}
		legend label {
			margin-right: 0px !important;
			line-height: initial;
			margin-bottom: 0px !important;
		}
	}
</style>