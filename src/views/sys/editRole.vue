<template>
	<div id="editRole">
		<div class="title-top">
			<el-breadcrumb separator=" ">
				<el-breadcrumb-item :to="path">角色管理</el-breadcrumb-item>
				<el-breadcrumb-item class="el-icon-arrow-right"></el-breadcrumb-item>
				<el-breadcrumb-item>编辑角色</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="mt-50 ml-50">
			<div class='mb-30 ml-50 clearfix'>
				<label class="color-3 fl mt-5">角色名称：</label>
				<div class="fl c">
					<el-input v-model.trim='roleName' @change="change()"></el-input>
					<p class='color-danger font-12 cc d width-230' :class={dd:disabled}>请输入1-16位角色名称！</p>
				</div>
				<el-button class='ml-20 radius e-100 fl' @click='updateRole()' :disabled="disabled">修改角色名称</el-button>
				<!--<span class="ml-10 color-blue cursor fl mt-5" @click='first'>{{this.text}}</span>-->
			</div>
			<el-form class="mb-50 ml-50 clearfix width-640" v-for="(item,index1) in list" key="$index">
				<fieldset class="bd">
					<legend class="ml-10 pl-20 pr-20">
						<el-checkbox class='mr-40 mb-10' v-model="item.checkAll" @change="all(item)">{{item.text}}</el-checkbox>
						<!--{{item.text}}-->
					</legend>
					<div v-for='(item,index) in item.sub' key="$index">
						<el-checkbox class="color-3 mr-30 fl mb-10 mt-10 ml-15 w-600" v-model="item.checked" :label="item.id" @change="handleCheckAllChange(index1,index,0)">{{item.text}}</el-checkbox>
						<span class="fl ml-30">
						  <el-checkbox-group v-model="item.checkedAreas"> 
						    <el-checkbox class='width-110 mb-10 hides' :title="item.text" v-for='item in item.sub' key="$index" :label="item.id" @change="handleCheckedCitiesChange(index1,index)">{{item.text}}</el-checkbox>
						  </el-checkbox-group>
					</span>
					</div>

				</fieldset>
			</el-form>
			<div class="bt mt-50 ml-50">
				<el-button type="primary" @click.native='resourceBind()'>修改权限</el-button>
				<el-button @click.native='goPage()'>取消</el-button>
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
				text: '禁用此角色',
				txt: '',
				checkedAreas: [],
				id: "",
				list: [],
				dialogAreaVisible: false,
				disabled: true,
				disab: false,
				onelist: [],
				roleName: '',
				resources: [], //资源绑定
				isdisplay: 1,
				bool: false,
				flag: 0,
				flag1: 0,
				arr: [],
				path: { path: basePath + "/limits" }
			}
		},
		methods: {
			//页面跳转
			goPage() {
				history.go(-1)
			},
			//判断按钮是否禁用
			change() {
				if(this.roleName.length > 0 && this.roleName.length < 17) {
					this.bool = true;
				} else {
					this.bool = false;
				}
				if(this.bool) {
					this.disabled = false;
				} else {
					this.disabled = true;
				}
			},
			//新增
			all(item) {
				if(item.checkAll && item.sub) {
					let allAreas = [];
					item.sub.forEach((item1) => {
						item1.checked = true;
						allAreas.push(item1.id)
						if(item1.sub) {
							let checkedAreas = [];
							item1.sub.forEach((item2) => {
								checkedAreas.push(item2.id)
							})
							item1.checkedAreas = checkedAreas;
						}
					})
					item.allAreas = allAreas;
				} else {
					item.allAreas = [];
					if(item.sub) {
						item.sub.forEach((item1) => {
							item1.checked = false;

							if(item1.sub) {
								item1.checkedAreas = [];
							}
						})
					}
				}
			},
			//			获取所有权限
			achieveList() {
				this.roleName = this.$route.params.text //获取初始角色名
				const api = "/foundation/resource/alldisplaytree";
				const body = { appId: 1 }
				axiosApi(api, body, this.callback1, this.currentPage, 10)
			},
			callback1(res) {
				this.list = res.data.data;
				this.checked();
				this.achieveOneList();
			},
			//			修改角色名称
			updateRole() {
				let _this = this
				const api = "/foundation/role/update";
				const body = {
					id: this.$route.params.id,
					roleName: this.roleName,
					applicationType: 1
				}
				axiosApi(api, body, this.updateRole1, this.currentPage, 10, function(res) {
					_this.$message({
						type: 'warning',
						message: res.data.message,
						duration: 1000
					});
				})
			},
			updateRole1(res) {
				this.$message({
					title: '成功',
					message: '恭喜你，修改成功！',
					type: 'success'
				});
			},
			firstPush() {
				if(this.$route.params.isDisplay == 0) {
					this.flag = 0
					this.flag1 = 0
					this.text = '启用此角色'
					this.txt = '启用'
				} else {
					this.flag = 1
					this.flag1 = 1
					this.text = '禁用此角色'
					this.txt = '禁用'
				}

			},
			secondPush() {

				if(this.flag == 0) {
					this.text = '禁用此角色'
					this.txt = '禁用'
					this.flag++
				} else {
					this.text = '启用此角色'
					this.txt = '启用'
					this.flag = 0
				}
			},
			//			判断isDisplay值
			first() {
				if(this.flag1 == 0) {
					this.isdisplay = 1
					this.flag1++
				} else {
					this.isdisplay = 0
					this.flag1 = 0
				}
				this.Isdisplay()

			},
			Isdisplay() {
				this.$confirm('是否' + this.txt + '角色「' + this.$route.params.text + '」？', '提示信息', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					const api = "/foundation/role/update";
					const body = {
						id: this.$route.params.id,
						isDisplay: this.isdisplay
					};
					axiosApi(api, body, (res) => {
						this.$message({
							type: 'success',
							message: '修改成功!',
							duration: 1000
						});
						this.secondPush()
					}, this.currentPage, 10, (res) => {
						this.$notify({
							title: '警告',
							message: res.data.message,
							type: 'warning'
						});
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消修改'
					});
				})
			},
			//			单个角色权限
			achieveOneList() {
				const api = "/foundation/roleresourcerelation/selectList";
				const body = {
					roleId: this.$route.params.id
				}
				axiosApi(api, body, this.callback2, this.currentPage, 10)
			},
			callback2(res) {
				this.onelist = res.data.data;
				this.add();
			},
			//进入注册属性
			checked() {
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
			//进入渲染
			add() {
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
											item1.sub[i].checked = item1.sub[i].checkedAreas.length === item1.sub[i].sub.length;
										}
									}
								} else {
									if(item.resourceId == item1.sub[i].id) {
										_this.resources.push(item.resourceId)
										item1.sub[i].checked = true
									}

								}
								_this.checkAll(index1)
							}

						}

					})
				})
			},
			//父全选
			handleCheckAllChange(index1, index, type) {
				let allAreas = [];
				if(type == 1) { //最后的按钮确定事件添加子id
					this.resources = []
					this.list.forEach((item3, index4) => {
						item3.allAreas.forEach((item11) => {
							this.resources.push(item11);

						})
						if(item3.sub) {
							item3.sub.forEach((item4, index4) => {
								item4.checkedAreas.forEach((item5) => {
									this.resources.push(item5);
								})
							})
						}
					})
					this.getAll()
				} else {
					let _this = this;
					if(this.list[index1].sub[index].checked) { //父选中
						allAreas.push(this.list[index1].sub[index].id)
						this.list[index1].allAreas = this.list[index1].allAreas.concat(allAreas)
						let checkedAreas = [];
						if(this.list[index1].sub[index].sub) {
							this.list[index1].sub[index].sub.forEach(function(item, index) {
								checkedAreas.push(item.id)
							})
							this.list[index1].sub[index].checkedAreas = this.list[index1].sub[index].checkedAreas.concat(checkedAreas)
						}
					} else { //父未选中
						this.list[index1].allAreas.forEach((item2, index2) => { //去父id
							if(item2 == this.list[index1].sub[index].id) {
								this.list[index1].allAreas.splice(index2, 1);
							}
						})
						this.list[index1].sub[index].checkedAreas.forEach((item6) => { //去子id
							this.resources.forEach((item7, index7) => {
								if(item6 == item7) {
									this.resources.splice(index7, 1)
								}
							})
						})
						this.list[index1].sub[index].checkedAreas = [];
					}
					this.checkAll(index1);
				}
			},
			//一级菜单勾选传id
			getAll() {
				let _this = this
				this.list.forEach(function(item, index) {
					if(item.checkAll) {
						_this.resources.push(item.id)
					}
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
			//			子全选
			handleCheckedCitiesChange(index1, index) {
				this.list[index1].sub[index].checked = this.list[index1].sub[index].checkedAreas.length === this.list[index1].sub[index].sub.length;
				if(this.list[index1].sub[index].checked) {
					let allAreas = []
					allAreas.push(this.list[index1].sub[index].id)
					this.list[index1].allAreas = this.list[index1].allAreas.concat(allAreas)
				} else {
					this.list[index1].allAreas.forEach((item8, index8) => { //去父id
						if(item8 == this.list[index1].sub[index].id) {
							this.list[index1].allAreas.splice(index8, 1);
						}
					})
				}
				this.checkAll(index1);
			},
			wipeMore() {
				let _this = this
				this.list.forEach((item) => {
					if(item.checkAll) {
						this.arr.push(item.id)
					}
					if(item.sub) {
						item.sub.forEach((item1) => {
							if(item1.checked) {
								this.arr.push(item1.id)
							}
							if(item1.checkedAreas) {
								item1.checkedAreas.forEach((item3) => {
									this.arr.push(item3)
								})
							}
						})
					}
				})
			},
			//			资源绑定
			resourceBind() {
				this.handleCheckAllChange(null, null, 1)
				// this.resources = Array.from(new Set(this.resources))
				this.wipeMore()
				const api = "/foundation/roleresourcerelation/bind";
				const body = {
					roleId: this.$route.params.id,
					resources: this.arr,
					tradeId: 0
				}
				axiosApi(api, body, this.resourceBind1, this.currentPage, 10)
			},
			resourceBind1() {
				this.$message({
					title: '成功',
					message: '恭喜你，修改成功！',
					type: 'success'
				});
				this.$router.push(basePath + '/limits')
			},

		},
		mounted() {
			this.$nextTick(function() {
				this.achieveList();
				this.change();
				this.firstPush()
			})
		}
	}
</script>

<style lang="less">
	#editRole {
		.el-checkbox {
			margin-left: 0;
		}
		.w-600 {
			width: 600px;
			display: block;
		}
		.radius {
			border-radius: 2px;
			width: 80px;
		}
		.e-100 {
			width: 100px;
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
		legend label {
			margin-right: 0px !important;
			line-height: initial;
			margin-bottom: 0px !important;
		}
		.c{
			position: relative;
		}
		.cc{
			position: absolute;
			left: 0;
			top:110%
		}
		.d{
			display: none;
		}
		.dd{
			display: inline-block;
		}
	}
</style>