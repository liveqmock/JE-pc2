<template>
	<div id="addPeople">
		<div class="title-top">
			<el-breadcrumb separator="  ">
				<el-breadcrumb-item :to="path">员工管理</el-breadcrumb-item>
				<el-breadcrumb-item class="el-icon-arrow-right"></el-breadcrumb-item>
				<el-breadcrumb-item>新增员工</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="main ml-50 mt-50">
			<el-form :model='form' label-width='130px' :rules="rules" ref="form">
				<el-form-item label="登录账号:" prop="loginName">
					<el-input placeholder="" v-model.trim='form.loginName' value='FormData.loginName'></el-input>
				</el-form-item>
				<el-form-item label="姓名:" prop="employeeName">
					<el-input placeholder="" :value='FormData.employeeName' v-model.trim='form.employeeName'></el-input>
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
					<el-input placeholder="请输入职位" :value='FormData.position' v-model.trim='form.position'></el-input>
				</el-form-item>
				<el-form-item label="手机号码:" prop="mobile">
					<el-input placeholder="请输入手机号码" :value='FormData.mobile' v-model.trim='form.mobile'></el-input>
				</el-form-item>
				<el-form-item label="所属区域:">
					<el-checkbox v-model="checked">不限</el-checkbox>
				</el-form-item>
				<el-form-item>
					<el-cascader clearable :options="searchDepartmentList" :props="config" :show-all-levels="true" change-on-select :disabled="checked" placeholder='请选择地区' v-model='form.areas'></el-cascader>
				</el-form-item>
				<el-form-item label="所属部门:" prop="dep">
					<el-cascader clearable :options="data3" :props="config" :show-all-levels="true" placeholder='请选择部门' change-on-select v-model='form.dep' :clearable="true"></el-cascader>
					<span class="ml-20 color-blue cursor" @click='adddep'>添加部门</span>
				</el-form-item>
				<el-form-item label="角色:" prop="role">
					<el-cascader clearable :options="roleLists" :props="config" :show-all-levels="true" placeholder='请选择角色' v-model='form.role' change-on-select @change='getRole'></el-cascader>
					<span class="ml-20 color-blue cursor" @click='addRole'>添加角色</span>
				</el-form-item>
				<el-form-item label="权限:">
					<div class="bd pl-30 mr-100 mt-10 pt-10">
						<el-form class="mb-50 clearfix width-640 " v-for="(item,index1) in list" key="$index">
							<fieldset class="bd">
								<legend class="ml-10 pl-20 pr-20">
									<el-checkbox class='mr-40 mb-10' disabled v-model="item.checkAll">{{item.text}}</el-checkbox>
								</legend>
								<div v-for='(item,index) in item.sub' key="$index">
									<el-checkbox class="color-3 mr-30 fl mb-10 mt-10 ml-15 w-600" v-model="item.checked" :label="item.id" disabled>{{item.text}}</el-checkbox>
									<span class="fl ml-30">
									  <el-checkbox-group v-model="item.checkedAreas"> 
									    <el-checkbox class='width-110 mb-10 hides' :title="item.text" v-for='item in item.sub' key="$index" :label="item.id" disabled>{{item.text}}</el-checkbox>
									  </el-checkbox-group>
								</span>
								</div>
							</fieldset>
						</el-form>
					</div>
				</el-form-item>

				<el-form-item label="">
					<el-button @click.native="addPeople('form')" type="primary">确定</el-button>
					<el-button @click.native="cancel">取消</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import { MessageBox } from 'element-ui';
	import { axiosApi, basePath } from "../../api/api";
	import md5 from "md5"
	export default {
		data() {
			var loginName = (rule, value, callback) => {
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
					//					}
				}, 500);
			};
			return {
				idd: 'XX',
				sign: 1,
				info: '',
				list: [], //权限列表
				data3: [], //部门列表
				roleLists: [], //所有角色
				id: '',
				checked: true,
				disabled: true,
				value: "",
				options: '',
				form: { //修改信息双向数据绑定
					loginName: '',
					mobile: '',
					employeeName: '',
					position: '',
					areas: [],
					dep: [],
					role: [],
					radio1: 0, //设为部门负责人
					radio2: 0, //状态
				}, //修改信息双向数据绑定
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
					role: [{
						required: true,
						type: "array",
						message: '不能为空',
						trigger: 'blur'
					}]
				},
				roleId: null,
				FormData: {}, //单个员工信息初始
				id: '', //获取员工ID
				loginName: '', //登录名
				searchDepartmentList: [], //搜索部门
				config: { //修改默认属性
					label: "text",
					children: "sub",
					value: "id"
				},
				path: { path: basePath + "/people" }
			}
		},
		methods: {
			//跳转到增加部门
			adddep() {
				this.$router.push(basePath + '/dep/addPartment/' + this.idd + '/' + this.sign)
				sessionStorage.setItem('info', JSON.stringify(this.form));
			},
			//跳转到增加角色
			addRole() {
				this.$router.push(basePath + '/addRole/' + this.sign)
				sessionStorage.setItem('info', JSON.stringify(this.form));
			},
			getInfo() {
				if(this.$route.params.sign) {
					this.info = sessionStorage.getItem("info");
					this.form = JSON.parse(this.info);
					this.getRole();
					sessionStorage.removeItem("info");

				} else {
					sessionStorage.removeItem("info");
				}
			},
			getRole() {
				this.roleId = this.form.role[0]
				this.achieveList()
			},
			cancel() {
				history.go(-1)
			},
			//			获取所有权限
			achieveList() {
				const api = "/foundation/resource/displaytree";
				const body = { loginName: sessionStorage.loginName, appId: 1 }
				axiosApi(api, body, this.callback1, this.currentPage, 10)
			},
			callback1(res) {
				this.list = res.data.data;
				this.checked1();
				if(this.roleId != '') {
					this.achieveOneList();
				}
			},
			//			单个角色权限
			achieveOneList() {
				const api = "/foundation/roleresourcerelation/selectList";
				const body = {
					roleId: this.roleId
				}
				axiosApi(api, body, this.callback2, this.currentPage, 10)
			},
			callback2(res) {
				this.onelist = res.data.data;
				this.add();
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
				let _this = this
				this.onelist.forEach(function(item, index) {
					_this.list.forEach(function(item1, index1) {
						if(item.resourceId == item1.id){
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
			},
			checkAll(index1) {
				//判断是否全选
				let num = 0;
				this.list[index1].sub.forEach((item) => {
					if(item.checked) {
						num++;
					}
				})
				if(num == this.list[index1].sub.length) {
					this.list[index1].checkAll = true;
				} else {
					this.list[index1].checkAll = false;
				}
			},
			//查询地区
			searchAreas() {
				const api = "/foundation/district/displayTree";
				const body = {}
				axiosApi(api, body, this.searchAreas1, this.currentPage, 10)
			},
			searchAreas1(res) {
				this.searchDepartmentList = res.data.data ? res.data.data : []
			},
			//			获取角色列表
			achieveRole() {
				const api = "/foundation/role/selectAll";
				const body = {
					isDisplay: 1,
					applicationType: 1
				}
				axiosApi(api, body, this.achieveRole1, this.currentPage, 10)
			},
			achieveRole1(res) {
				this.roleLists = res.data.data ? res.data.data : [];
			},
			//获取所有部门
			getDepList() {
				const api = "/foundation/department/displayTree";
				const body = {
					applicationType: 1
				};
				axiosApi(api, body, this.deplist, this.currentPage, 10)
			},
			deplist(res) {
				this.data3 = res.data.data ? res.data.data : [];
			},
			//增加员工
			addPeople(form) {
				this.$refs[form].validate((valid) => {
					if(valid) {
						let _this = this
						if(this.checked == false) {
							this.areaa = this.form.areas[this.form.areas.length - 1];

						} else {
							this.areaa = 0
						}
						let depp = this.form.dep[this.form.dep.length - 1];
						const api = "/foundation/employee/insert";
						const body = {
							loginPwd: md5('123456'),
							loginName: this.form.loginName,
							employeeName: this.form.employeeName,
							mobile: this.form.mobile,
							position: this.form.position,
							isDepartmentLeader: this.form.radio1,
							isDisable: this.form.radio2,
							departmentId: depp,
							districtId: this.areaa,
							roles: this.form.role,
							appId: 1,
							registerType:1
						}
						axiosApi(api, body, this.addPeople1, this.currentPage, 10, function(res) {
							MessageBox.alert(res.data.message, '提示信息', {
								confirmButtonText: '确定'
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
			addPeople1(res) {
				this.$router.push(basePath + '/people')
				this.$message({
					title: '成功',
					message: '恭喜你，保存成功！',
					type: 'success'
				});
			},
		},
		//进入加载
		mounted() {
			this.$nextTick(function() {
				this.achieveList(),
					this.searchAreas(), //获取所有地区
					this.achieveRole(), //获取所有角色
					this.getDepList(), //获取所有部门
					this.getInfo()
			})
		}
	};
</script>

<style lang="less">
	#addPeople {
		.el-checkbox__input.is-disabled+.el-checkbox__label {
		    color: #333;
		}
		.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
		    background-color: #0ae;
		    border-color: #0ae;
		}
		 .content {
			width: 500px;
			min-height: 800px;
			border: 1px solid #DDDDDD;
		}
		/*开始*/
		.el-tabs__item {
			width: 100px;
			text-align: center;
			/*background: gray;*/
		}
		.el-checkbox {
			margin-left: 0;
		}
		.w-600 {
			width: 600px;
			display: block;
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
		legend label{
			margin-right: 0px !important;
			line-height: initial;
			margin-bottom: 0px !important;
		}
	}
</style>