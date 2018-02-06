<template>
	<div id="addPartment">
		<div class="title-top">{{title}}</div>
		<div class="ml-100 mt-50">
			<el-form :model="formDep" label-width='140px' :rules="rules" ref="formDep">
				<el-form-item label="部门名称:" prop="departmentName">
					<el-input v-model.trim="formDep.departmentName" :value="formDep.departmentName" placeholder="请输入部门名称"></el-input>
				</el-form-item>
				<el-form-item label="上级部门:" prop="parentId">
					<el-cascader :props="config" :options="depList" clearable :change-on-select="true" v-model="parentIdOptions" @change="handleChange"></el-cascader>
				</el-form-item>
				<el-form-item label="部门负责人:">
					<el-select v-model="formDep.departmentLeaderId" clearable filterable placeholder="请选择部门负责人" >
						<el-option v-for="emp in emplist" :key="emp.employeeName" :label="emp.employeeName" :value="emp.id" key="$index">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="部门人员:">
					<el-button @click="add = true">
						<span v-if="hide" class="color-blue">添加</span>
						<span v-else class="color-blue">管理</span>
					</el-button>
				</el-form-item>
				<el-form-item>
					<div class="showBox">
						<p class="color-9" v-if="depEmplist.length<1">暂无员工</p>
						<ul>
							<li class="ml-10 fl" v-for="emp in depEmplist">{{emp.employeeName}} {{emp.mobile}};</li>
						</ul>
					</div>
				</el-form-item>
				<el-form-item label="">
					<el-button @click="saveDep('formDep')" type="primary">确定</el-button>
					<el-button @click="handleCancle">取消</el-button>
				</el-form-item>
			</el-form>
		</div>
		<!--弹出添加员工-->
		<el-dialog title="管理员工" v-model="add">
			<div class="box">
				<el-transfer filterable filter-placeholder="请输入员工姓名" :titles="['全部员工', '已选员工']" :button-texts="['移 除', '移至已选']" :data="emp1" v-model="emps">
				</el-transfer>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleSave">确 定</el-button>
				<el-button @click.native="handleCancle">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import { axiosApi, basePath } from '../../api/api';
	export default {
		data() {
			var checkParent = (rule, value, callback) => {
				if(!value) {
					return callback(new Error('上级部门不能为空'));
				}else if(value === this.formDep.id){
					return callback(new Error('不能选择自己为上级'));
				}else if(this.parentIdOptions.length === 6){
					return callback(new Error('不能选择六级部门作为上级部门'));
				}else{
					return callback();
				}
			};
			return {
				title: "",
				hide: false,
				add: false,
				depList: [],
				config: {
					label: "text",
					children: "sub",
					value: "id"
				},
				parentIdOptions: [],
				emplist: [], //全部员工列表
				depEmplist: [], //当前部门全部员工
				formDep: {
					id: '', //部门Id
					departmentName: '', //部门名称
					parentId: '', //上级部门
					departmentLeaderId:'', //部门负责人Id
					employees: [],
					applicationType: 1
				},
				rules: {
					departmentName: [
						{required: true,message: '请输入部门名称',trigger: 'blur'},
						{min: 3,max: 10,message: '长度在 3 到 10 个字符',trigger: 'blur'}
					],
					parentId: [{required: true,validator: checkParent,trigger: 'change'}]
				},
				emp1: [],
				emps: []
			}
		},
		methods: {
			//部门列表查询
			getDepList() {
				const api = "/foundation/department/displayTree";
				const body = {applicationType: 1};
				axiosApi(api, body, (res)=>{ this.depList = res.data.data ? res.data.data : []; }, this.currentPage, 10)
			},
			//查询部门信息
			getDepinfo() {
				const api = "/foundation/department/selectOne";
				const body = {id: this.$route.params.id == 'XX' ? '' : this.$route.params.id};
				axiosApi(api, body, this.depinfo, this.currentPage, 10)
			},
			depinfo(res) {
				//console.log('查询部门信息',res)
				this.formDep = res.data.data;
				if(this.formDep.departmentLeaderId == undefined){
					this.$set(this.formDep, "departmentLeaderId", '')
				}
				this.parentIdOptions = this.formDep.departmentPath.split(",").map((item) => {return parseInt(item);}); //把字符串转化为字符串数组并转化为数字数组
				this.parentIdOptions.pop()
			},
			//查询员工列表
			getEmpList() {
				axiosApi("/foundation/employee/selectAll", {appId: 1,needPage: 0}, (res) => {
					this.emplist = res.data.data.elements;
					this.emplist.forEach((emp, index) => {
						const employeeName = this.emplist[index].employeeName;
						const id = this.emplist[index].id;
						const mobile = this.emplist[index].mobile
						this.emp1.push({
							label: employeeName + ' ' + mobile,
							key: id
						});
					});
				}, 1, 1000);
				if(this.$route.params.id == 'XX' ? false : true) {
					axiosApi("/foundation/employee/selectAll", {applicationType: 1,departmentId: this.$route.params.id}, (res) => {
						this.depEmplist = res.data.data.elements;
						this.depEmplist.forEach((depEmp, index) => {
							this.emps.push(this.depEmplist[index].id);
						})
					});
				}
			},
			//选择上级部门处理	      
			handleChange(val) {
				this.formDep.parentId = val[val.length - 1];
			},
			//添加/管理员工
			handleSave() {
				this.add = false;
				this.formDep.employees = this.emps;
				this.depEmplist = [];
				this.emps.forEach((item1) => {
					this.emplist.forEach((item2) => {
						if(item1 == item2.id) {
							this.depEmplist.push(item2)
						}
					})
				})
			},
			//添加/编辑部门
			saveDep(formDep) {
				this.formDep.employees = this.emps;
				this.$refs[formDep].validate((valid) => {
					if(valid) {
//						console.log("验证成功");
						if(this.$route.params.id == 'XX' ? false : true) {
							this.api = "/foundation/department/update";
						} else {
							this.api = "/foundation/department/insert";
						}
						const api = this.api;
						const body = this.formDep;
						axiosApi(api, body, this.addcallback, this.currentPage, 10, (res)=>{
							this.$message({
								type: 'info',
								message: res.data.message,
								duration: 1000
							});
						})
					} else {
//						console.log('error submit!!');
						return false;
					}
				});
			},
			addcallback(res) {
				this.$message({
					title: '成功',
					message: '恭喜你，添加成功！',
					type: 'success'
				});
				if(this.$route.params.sign == 1) {
					this.$router.push(basePath + '/addPeople/' + this.$route.params.sign)
				} else if(this.$route.params.sign == 2) {
					this.$router.push(basePath + '/editPeople/' + this.$route.params.sign)
				} else {
					this.$router.push(basePath + '/department')
				}
			},
			//取消
			handleCancle() {
				if(this.$route.params.sign == 1) {
					this.$router.push(basePath + '/addPeople/' + this.$route.params.sign)
				} else if(this.$route.params.sign == 2) {
					this.$router.push(basePath + '/editPeople/' + this.$route.params.sign)
				} else {
					this.$router.push(basePath + '/department')
				}
			}
		},
		mounted() {
			this.$nextTick(function() {
				this.getDepList();
				this.getEmpList();
				if(this.$route.params.id == 'XX' ? false : true) {
					this.hide = false;
					this.title = "编辑部门";
					this.getDepinfo();
				} else {
					this.hide = true;
					this.title = "新增部门"
				}

			})
		}
	}
</script>
<style lang="less">
	#addPartment {
		.showBox {
			width: 600px;
			height: 200px;
			padding: 20px;
			overflow-y: auto;
			border: 1px solid #DDDDDD;
			p {
				text-align: center;
				line-height: 200px;
			}
		}
		.box {
			margin: 25px 75px;
		}
		.el-dialog--small {
			width: 700px;
			height: 700px;
		}
		.el-transfer-panel {
			width: 220px;
		}
		.el-transfer-panel__body {
			height: 340px;
		}
		.el-transfer-panel__list.is-filterable {
			height: 330px;
		}
	}
</style>