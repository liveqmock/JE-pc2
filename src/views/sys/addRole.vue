<template>
	<div id="check">
		<div class="title-top">
			<el-breadcrumb separator=" ">
				<el-breadcrumb-item :to="path">角色管理</el-breadcrumb-item>
				<el-breadcrumb-item class="el-icon-arrow-right"></el-breadcrumb-item>
				<el-breadcrumb-item>新增角色</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="mt-50 ml-50">
			<div class='mb-50 ml-50'>
				<div class="ml-15 clearfix">
					<label class="color-3 fl">角色名称：</label>
					<div class="c fl">
						<el-input value='' v-model.trim='roleName' @change="change()"></el-input>
						<p class='color-danger font-12 cc d width-230' :class={dd:disabled}>请输入1-16位角色名称！</p>
					</div>
				</div>
			</div>
			<el-form class="mb-50 ml-50 clearfix width-640" v-for="(item,index1) in list" key="$index">
				<fieldset class="bd">
					<legend class="ml-10 pl-20 pr-20">
						<el-checkbox class='mr-40 mb-10' v-model="item.checkAll" @change="all(item)">{{item.text}}</el-checkbox>
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
				<el-button type="primary" @click='addRole' :disabled="bool">确定</el-button>
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
				sign: '',
				checkedAreas: [],
				id: "",
				list: [],
				dialogAreaVisible: false,
				disabled: false,
				test: [],
				topRole: [], //上一级角色
				onelist: [], //获取已有资源
				roleName: '', //角色名称
				resources: [], //资源绑定
				bool: true, //input输入是否为空判断
				roleLists: [], //所有角色
				path: { path: basePath + "/limits" },
				config: { //修改默认属性
					label: "text",
					children: "sub",
					value: "id"
				},
				arr:[]
			}
		},
		methods: {
			//页面跳转
			goPage() {
				//				this.$router.push(basePath + '/limits');
				history.go(-1)
			},
			//input输入是否为空判断
			change() {
				if (this.roleName.length > 0 && this.roleName.length < 17) {
					this.disabled = false;
					this.bool = false
				} else {
					this.disabled = true;
					this.bool = true
				}
			},
			gethash() {
				var test = window.location.href;
				this.id = test.split('=')[1];
			},
			//			获取角色列表
			achieveRole() {
				const api = "/foundation/role/selectAll";
				const body = {}
				axiosApi(api, body, this.achieveRole1, this.currentPage, 10)
			},
			achieveRole1(res) {
				this.roleLists = res.data.data;
			},
			//			获取所有权限
			achieveList() {
				const api = "/foundation/resource/alldisplaytree";
				const body = { appId: 1 }
				axiosApi(api, body, this.callback1, this.currentPage, 10)
			},
			callback1(res) {
				this.list = res.data.data;
				this.checked();
			},
			checked() {
				let _this = this;
				this.list.forEach(function (item, index) {
					if (typeof item.checkAll == "undefined") {
						_this.$set(item, "checkAll", false)
					}
					if (typeof item.allAreas == "undefined") {
						_this.$set(item, "allAreas", [])
					}
					if (item.sub) {
						for (let i = 0; i < item.sub.length; i++) {
							if (typeof item.sub[i].checked == "undefined") {
								_this.$set(item.sub[i], "checked", false)
							}
							if (typeof item.sub[i].checkedAreas == "undefined") {
								_this.$set(item.sub[i], "checkedAreas", [])
							}

						}
					}
				})

			},
			checkAll(index1) {
				//判断是否全选
				let num = 0;
				this.list[index1].sub.forEach((item) => {
					if (item.checked) {
						num++;
					}
				})
				if (num == this.list[index1].sub.length) {
					this.list[index1].checkAll = true;
				} else {
					this.list[index1].checkAll = false;
				}
			},
			//			父全选
			handleCheckAllChange(index1, index, type) {
				let allAreas = [];
				if (type == 1) { //最后的按钮确定事件添加子id
					this.resources = []
					this.list.forEach((item3, index4) => {
						item3.allAreas.forEach((item11) => {
							this.resources.push(item11);

						})
						if (item3.sub) {
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
					if (this.list[index1].sub[index].checked) { //父选中
						allAreas.push(this.list[index1].sub[index].id)
						this.list[index1].allAreas = this.list[index1].allAreas.concat(allAreas)
						let checkedAreas = [];
						if (this.list[index1].sub[index].sub) {
							this.list[index1].sub[index].sub.forEach(function (item, index) {
								checkedAreas.push(item.id)
							})
							this.list[index1].sub[index].checkedAreas = this.list[index1].sub[index].checkedAreas.concat(checkedAreas)
						}
					} else { //父未选中
						this.list[index1].allAreas.forEach((item2, index2) => { //去父id
							if (item2 == this.list[index1].sub[index].id) {
								this.list[index1].allAreas.splice(index2, 1);
							}
						})
						this.list[index1].sub[index].checkedAreas.forEach((item6) => { //去子id
							this.resources.forEach((item7, index7) => {
								if (item6 == item7) {
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
				this.list.forEach(function (item, index) {
					if (item.checkAll) {
						_this.resources.push(item.id)
					}
				})
			},
			//			子全选
			handleCheckedCitiesChange(index1, index) {
				this.list[index1].sub[index].checked = this.list[index1].sub[index].checkedAreas.length === this.list[index1].sub[index].sub.length;
				if (this.list[index1].sub[index].checked) {
					let allAreas = []
					allAreas.push(this.list[index1].sub[index].id)
					this.list[index1].allAreas = this.list[index1].allAreas.concat(allAreas)
				} else {
					this.list[index1].allAreas.forEach((item8, index8) => { //去父id
						if (item8 == this.list[index1].sub[index].id) {
							this.list[index1].allAreas.splice(index8, 1);
						}
					})
				}
				this.checkAll(index1);
			},
			//新增
			all(item) {
				if (item.checkAll && item.sub) {
					let allAreas = [];
					item.sub.forEach((item1) => {
						item1.checked = true;
						allAreas.push(item1.id)
						if (item1.sub) {
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
					if (item.sub) {
						item.sub.forEach((item1) => {
							item1.checked = false;
							if (item1.sub) {
								item1.checkedAreas = [];
							}
						})
					}
				}
			},
			getArea() {
				let _this = this;
				this.list.forEach(function (item, index) {
					if (item.sub) {
						for (let i = 0; i < item.sub.length; i++) {
							_this.resources = _this.resources.concat(item.sub[i].checkedAreas)
						}
					}
				})
				this.addRole()
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
			//			增加角色
			addRole() {
				let _this = this
				this.handleCheckAllChange(null, null, 1)
				// this.resources = Array.from(new Set(this.resources))
				this.wipeMore()
				const api = "/foundation/role/insert";
				const body = {
					id: '',
					roleName: this.roleName,
					resources: this.arr,
					applicationType: 1

				}
				axiosApi(api, body, this.addRole1, this.currentPage, 10, function (res) {
					_this.$message({
						type: 'warning',
						message: res.data.message,
						duration: 1000
					});
				})
			},
			addRole1(res) {
				this.$message({
					title: '成功',
					message: '恭喜你，添加成功！',
					type: 'success'
				});

				if (this.$route.params.sign == 1) {
					this.sign = this.$route.params.sign
					this.$router.push(basePath + '/addPeople/' + this.sign)
				} else if (this.$route.params.sign == 2) {
					this.sign = this.$route.params.sign
					this.$router.push(basePath + '/editPeople/' + this.sign)
				} else {
					this.$router.push(basePath + '/limits')
				}
			},
		},
		mounted() {
			this.$nextTick(function () {
				this.achieveList(),
//					this.change(),
					this.achieveRole()

			})
		}
	}
</script>

<style lang='less'>
	#check {
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