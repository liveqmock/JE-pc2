<template>
	<div id="editPeople">
		<div class="title-top">
			<el-breadcrumb separator="  ">
				<el-breadcrumb-item :to="path">员工管理</el-breadcrumb-item>
				<el-breadcrumb-item class="el-icon-arrow-right"></el-breadcrumb-item>
				<el-breadcrumb-item>编辑员工</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="main ml-50 mt-50">
			<el-form :model='form' label-width='130px' :rules="rules" ref="form">
				<el-form-item label="登录账号:" prop="loginName">
					<el-input v-model.trim='form.loginName'></el-input>
				</el-form-item>
				<el-form-item label="姓名:" prop="employeeName">
					<el-input placeholder="" v-model.trim="form.employeeName"></el-input>
				</el-form-item>
				<el-form-item label="设为部门负责人:">
					<el-radio class="radio" v-model="form.radio1" :label="1">是&nbsp;&nbsp;&nbsp; </el-radio>
					<el-radio class="radio" v-model="form.radio1" :label="0">否</el-radio>
				</el-form-item>
				<el-form-item label="状态:">
					<el-radio class="radio" v-model="form.radio2" :label="0">正常</el-radio>
					<el-radio class="radio" v-model="form.radio2" :label="1">禁用</el-radio>
				</el-form-item>
				<el-form-item label="职位:" prop="position">
					<el-input placeholder="请输入职位" v-model.trim='form.position'></el-input>
				</el-form-item>
				<el-form-item label="手机号码:" prop="mobile">
					<el-input placeholder="请输入手机号码" v-model.trim='form.mobile'></el-input>
				</el-form-item>
				<el-form-item label="所属区域:">
					<el-checkbox v-model="checked">不限</el-checkbox>
				</el-form-item>
				<el-form-item>
					<el-cascader clearable :options="searchDepartmentList" :props="config" show-all-levels :disabled='checked' placeholder='请选择地区' v-model='form.areas' change-on-select></el-cascader>
				</el-form-item>
				<el-form-item label="所属部门:" prop="dep">
					<el-cascader clearable :options="data3" :props="config" show-all-levels v-model='form.dep' placeholder='请选择部门' change-on-select></el-cascader>
					<span class="ml-20 color-blue cursor" @click='goPage("addPartment")'>添加部门</span>
				</el-form-item>
				<el-form-item label="角色:" prop="roleId">
					<el-cascader clearable :options="roleLists" :props="config" :disabled="isAdmin" show-all-levels v-model='form.roleId' placeholder='请选择角色' @change='getRole' change-on-select></el-cascader>
					<span class="ml-20 color-blue cursor" @click='goPage("addRole")'>添加角色</span>
				</el-form-item>
				<el-form-item label="权限:">
					<div class="bd pl-30 mr-100 mt-10 pt-10">
						<el-form class="mb-50 clearfix width-640 " v-for="(item,index1) in list" key="$index">
							<fieldset class="bd">
								<legend class="ml-10 pl-20 pr-20">
									<el-checkbox class='mr-40 mb-10' disabled v-model="item.checkAll">{{item.text}}</el-checkbox>
								</legend>
								<div v-for='(item,index) in item.sub' key="$index">
									<el-checkbox class="color-3 mr-30 fl mb-10 mt-10 ml-15 w-600" disabled v-model="item.checked" :label="item.id">{{item.text}}</el-checkbox>
									<span class="fl ml-30">
									  <el-checkbox-group v-model="item.checkedAreas"> 
									    <el-checkbox class='width-110 mb-10 hides' disabled :title="item.text" v-for='item in item.sub' key="$index" :label="item.id">{{item.text}}</el-checkbox>
									  </el-checkbox-group>
								</span>
								</div>
							</fieldset>
						</el-form>
					</div>
				</el-form-item>
				<el-form-item label="">
					<el-button @click.native="EditPeople('form')" type="primary">保存</el-button>
					<el-button @click='goPage("cancel")'>取消</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import { MessageBox } from 'element-ui';
	import { axiosApi, basePath } from "../../api/api";
	export default {
		data() {
			//正则判断
			var loginName = (rule, value, callback) => {
				//				let reg = /^1\d{10}$/;
				let reg = /^1\d{10}$/;

				if(!value) {
					return callback(new Error('请输入手机号'));
				}
				setTimeout(() => {
					if(!reg.test(value)) {
						callback(new Error('请输入正确的11位手机号'));
					} else {
						callback();
					}
				}, 500);
			};

			return {
				idd: 'XX',
				sign: 2,
				areas: [],
				bool: false,
				disabled: true,
				list: [], //权限列表
				data3: [], //部门列表
				roleLists: [], //所有角色
				id: '',
				roleName: '', //角色名
				roleId: '', //角色Id
				departmentId: '', //部门id
				checked: true,
				options: [],
				dep: '', //接收字符串部门id
				area: '', //接收字符串地区id
				areaa: [],
				info: {},
				form: { //修改信息双向数据绑定
					id: '',
					loginName: '',
					mobile: '',
					employeeName: '',
					position: '',
					areas: [],
					role: [],
					radio1: null, //设为部门负责人
					radio2: null, //状态
					dep: [], //部门双向绑定
					roleId: [],
					isAdmin: 1
				}, //修改信息双向数据绑定
				FormData: {}, //单个员工信息初始
				id: '', //获取员工ID
				loginName: '',
				searchDepartmentList: [], //搜索部门
				config: {
					label: "text",
					children: "sub",
					value: "id"
				},
				rules: {
					loginName: [{
						required: true,
						validator: loginName,
						trigger: 'blur'
					}],
					mobile: [{
						required: true,
						validator: loginName,
						trigger: 'blur'
					}],
					employeeName: [{
						required: true,
						message: '不能为空',
						trigger: 'blur'
					}],
					position: [{
						required: true,
						message: '不能为空',
						trigger: 'blur'
					}],
					dep: [{
						required: true,
						type: "array",
						message: '不能为空',
						trigger: 'blur'
					}],
					roleId: [{
						required: true,
						type: "array",
						message: '不能为空',
						trigger: 'blur'
					}]
				},
				path: { path: basePath + "/people" },
				isAdmin: false
			}
		},
		methods: {
			goPage: function(path) {
				if(path == 'addRole') {
					sessionStorage.setItem('info', JSON.stringify(this.form));
					this.$router.push(basePath + '/addRole/' + this.sign);
				}
				if(path == 'addPartment') {
					sessionStorage.setItem('info', JSON.stringify(this.form));
					this.$router.push(basePath + '/dep/addPartment/' + this.idd + '/' + this.sign);
				}
				if(path == 'cancel') {
					//					this.$router.push(basePath + '/people');
					history.go(-1)
				}
			},
			getInfo() {
				if(this.$route.params.sign) {
					this.info = sessionStorage.getItem("info");
					this.form = JSON.parse(this.info);
					this.getRole()
					this.isAdmin = this.form.isAdmin == 1 ? true : false; //是否是管理员
					if(this.isAdmin) {
						this.form.roleId = [0];
					}
					setTimeout(()=>{
						this.achieveRole()
					},0)
					sessionStorage.removeItem("info");
				}
			},
			//			获取loginName
			gethash() {
				var test = window.location.href;
				this.loginName = test.split('=')[1];
			},
			achieveAll() {
				if(this.$route.params.sign) {
					this.getInfo()
				} else {
					this.achieve()
				}
			},
			//			获取单个员工信息
			achieve(index, rows) {
				const api = "/foundation/employee/selectOneByLoginName";
				axiosApi(api, { loginName: this.loginName, appId: 1 }, this.callback1, this.currentPage, 10)
			},
			callback1(res) {
				this.FormData = res.data.data;
				let _this = this
				this.form.id = this.FormData.id;
				this.form.loginName = this.FormData.loginName;
				this.form.mobile = this.FormData.mobile;
				this.form.employeeName = this.FormData.employeeName;
				this.form.position = this.FormData.position;
				this.form.radio1 = this.FormData.isDepartmentLeader;
				this.form.isAdmin = this.FormData.isAdmin;
				this.form.radio2 = this.FormData.isDisable;
				this.dep = this.FormData.departmentPath;
				this.area = this.FormData.districtPath ? this.FormData.districtPath : null;
				this.FormData.roles.forEach(function(item, index) {
					_this.roleId = item.id,
						_this.form.roleId.push(_this.roleId)
				})
				this.isAdmin = this.form.isAdmin == 1 ? true : false; //是否是管理员
				if(this.isAdmin) {
					this.form.roleId = [0];
				}
				setTimeout(() => {
					this.achieveRole(); //获取所有角色
					if(this.area) {
						this.checked = false
					} else {
						this.checked = true
					}
					this.changeArr()
					this.achieveList()
				}, 0)
			},
			changeArr() {
				if(this.dep) {
					if(this.dep.indexOf(",") != -1) {
						this.form.dep = this.dep.split(",").map((item) => { return parseInt(item); }); //把字符串转化为字符串数组并转化为数字数组
					} else {
						let arr = []
						arr.push(parseInt(this.dep))
						this.form.dep = arr
					}
				}
				if(!this.checked) {
					this.form.areas = this.area.split(",").map((item) => { return parseInt(item); }); //把字符串转化为字符串数组并转化为数字数组
				} else {
					this.form.areas = [0] //这个需要数组 
				}
				//				
			},
			//查询地区
			searchAreas() {
				const api = "/foundation/district/displayTree";
				axiosApi(api, {}, this.searchAreas1, this.currentPage, 10)
			},
			searchAreas1(res) {
				this.searchDepartmentList = res.data.data
			},
			//			编辑员工
			EditPeople(form) {
				let _this = this
				this.$refs[form].validate((valid) => {
					if(valid) {
						let _this = this
						if(this.checked == false) {
							this.areaa = this.form.areas[this.form.areas.length - 1];

						} else {
							this.areaa = 0
						}
						let depp = this.form.dep[this.form.dep.length - 1];
						const api = "/foundation/employee/update";

						const body = {
							id: this.form.id,
							loginName: this.form.loginName,
							mobile: this.form.mobile,
							employeeName: this.form.employeeName,
							position: this.form.position,
							isDepartmentLeader: this.form.radio1,
							isDisable: this.form.radio2.toString(),
							roles: this.isAdmin ? 'null' : this.form.roleId,
							departmentId: depp,
							districtId: this.areaa,
							appId: 1
						}
						axiosApi(api, body, this.callback6, this.currentPage, 10, function(res) {
							_this.$message({
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
			callback6(res) {
				this.$message({
					type: 'success',
					message: '保存成功!',
					duration: 1000
				});
				this.$router.push(basePath + 　"/people")
			},
			//			获取角色列表
			achieveRole() {
				const api = "/foundation/role/selectAll";
				axiosApi(api, { isDisplay: 1, applicationType: 1 }, this.achieveRole1, this.currentPage, 10)
			},
			achieveRole1(res) {
				this.roleLists = res.data.data ? res.data.data : [];
				if(this.isAdmin) this.roleLists.push({ id: 0, text: '系统管理员' })
			},
			getRole() {
				this.roleId = this.form.roleId[0]
				this.achieveList()
			},
			//			获取所有权限
			achieveList() {
				const api = "/foundation/resource/displaytree";
				axiosApi(api, { loginName: sessionStorage.loginName, appId: 1 }, (res) => {
					this.list = res.data.data;
					this.checked1()
					//					if(this.roleId != '') {
					this.achieveOneList();
					//					}
				}, this.currentPage, 10)
			},
			//			单个角色权限
			achieveOneList() {
				if(this.isAdmin) {
					this.roleId = 0
				}
				const api = "/foundation/roleresourcerelation/selectList";
				axiosApi(api, { roleId: this.roleId }, (res => {
					this.onelist = res.data.data;
					this.add();
				}), this.currentPage, 10)
			},
			checked1() {
				let _this = this;
				this.list.forEach(function(item, index) {
					if(typeof item.checkAll == "undefined") {
						_this.$set(item, "checkAll", false)
					}
					if(typeof item.allAreas == "undefined") {
						_this.$set(item, "allAreas", [])
					}
					if(item.sub) {
						for(let i = 0; i < item.sub.length; i++) {
							if(typeof item.sub[i].checked == "undefined") {
								_this.$set(item.sub[i], "checked", false)
							}
							if(typeof item.sub[i].checkedAreas == "undefined") {
								_this.$set(item.sub[i], "checkedAreas", [])
							}
						}
					}
				})
			},
			add() {
				if(this.isAdmin) {
					let _this = this
					_this.list.forEach(function(item) {
						item.checkAll = true
						if(item.sub) {
							for(let i = 0; i < item.sub.length; i++) {
								item.sub[i].checked = true
								if(item.sub[i].sub) {
									for(let j = 0; j < item.sub[i].sub.length; j++) {
										let checkedAreas = [];
										checkedAreas.push(item.sub[i].sub[j].id)
										item.sub[i].checkedAreas = item.sub[i].checkedAreas.concat(checkedAreas);
									}
								}
							}
						}
					})
				} else {
					let _this = this
					this.onelist.forEach(function(item, index) {
						_this.list.forEach(function(item1, index1) {

							if(item.resourceId == item1.id) {
								item1.checkAll = true
							}
							if(item1.sub) {
								for(let i = 0; i < item1.sub.length; i++) {
									if(item.resourceId == item1.sub[i].id) {
										let allAreas = [];
										allAreas.push(item.resourceId)
										item1.allAreas = item1.allAreas.concat(allAreas);
										item1.checkAll = item1.allAreas.length === item1.sub.length;
									}
									if(item1.sub[i].sub) {
										for(let j = 0; j < item1.sub[i].sub.length; j++) {
											if(item.resourceId == item1.sub[i].sub[j].id) {
												let checkedAreas = [];
												checkedAreas.push(item.resourceId)
												item1.sub[i].checkedAreas = item1.sub[i].checkedAreas.concat(checkedAreas);
												item1.sub[i].checked = item1.sub[i].checkedAreas.length >= item1.sub[i].sub.length;
											}
										}
									} else {
										if(item.resourceId == item1.sub[i].id) {
											item1.sub[i].checked = true
										}

									}
									_this.checkAll(index1)
								}
							}
						})
					})
				}
			},
			checkAll(index1) {
				//判断是否全选
				let num = 0;
				this.list[index1].sub.forEach((item) => {
					if(item.checked) {
						num++;
					}
				})
				if(num == this.list[index1].sub.length || this.isAdmin) {
					this.list[index1].checkAll = true;
				} else {
					this.list[index1].checkAll = false;
				}
			},
			//获取所有部门
			getDepList() {
				const api = "/foundation/department/displayTree";
				axiosApi(api, { applicationType: 1 }, (res) => {
					this.data3 = res.data.data ? res.data.data : [];
				}, this.currentPage, 10)
			},

		},
		//进入加载
		mounted() {
			this.$nextTick(() => {
				this.gethash();
				this.achieveAll(); //进入页面加载判断
				this.searchAreas(); //获取所有地区
//				this.achieveRole(); //获取所有角色
				this.achieveList(); //获取所有权限
				this.getDepList(); //获取所有部门
			})
		}
	};
</script>

<style lang="less">
	#editPeople {
		.el-checkbox__input.is-disabled+.el-checkbox__label {
			color: #333;
		}
		.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
			background-color: #0ae;
			border-color: #0ae;
		}
		.content {
			width: 700px;
			min-height: 800px;
			border: 1px solid #DDDDDD;
		}
		/*开始*/
		.el-tabs__item {
			width: 100px;
			text-align: center;
			/*background: gray;*/
		}
		.w-600 {
			width: 600px;
			display: block;
		}
		.el-cascader-menu {
			min-width: 240px !important;
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