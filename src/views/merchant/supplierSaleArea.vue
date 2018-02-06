<template>
	<div class="supplier-sale-area">
		<div class="title-top">
			设置销售资质的有效时间以及有效区域
		</div>
		<div class="mt-50 ml-50">
			<ul>
				<li class="mb-50 clearfix"><span class="fl lh-32">资质有效时间:</span>
					<span class="ml-30">
					    <!-- <el-date-picker
					      v-model="dateTimevalue"
					      type="daterange"
					      placeholder="选择日期范围"
					      @change="timeChange">
					    </el-date-picker> -->
						<ysDaterangePicker class="fl ml-30" v-model="dateTimevalue" @change="timeChange"/>
                	</span>
				</li>
				<li class="clearfix">
					<div class="fl lh-32">
						<span>资质有效区域:</span>
					</div>
					<div class="ml-30 fl bd">
						<el-checkbox class="ml-20 mt-20 p-5" v-model="isCountrywide" :indeterminate="isIndeterminate" @change="iscountry">全国</el-checkbox>
						<div class="mt-20  clearfix" v-for="(item1,index1) in areas" key="$index">
							<div class="fl w100 pl-20">
								<el-checkbox class="p-5" v-model="item1.checkAll" :indeterminate="item1.isIndeterminate" @change="provincechange(item1)">{{item1.label}}</el-checkbox>
							</div>
							<div class="fl w670"> 
								<div class="dib w165 mb-10 clearfix" v-for="(item2,index2) in item1.children" key="$index">
									<el-checkbox v-model="item2.checked" :indeterminate="item2.isIndeterminate" @change="citychange(item2,item1)" :class="{bgc:item2.display}" class="p-5">
										<span :title="item2.label" class="text-overflow w85 top dib">{{item2.label}}</span>
										<span class="color-danger font-12" v-if="item2.checkedAreas.length>0">({{item2.checkedAreas.length}})</span>
									</el-checkbox>
									<i class="cursor color-danger" :class="{'el-icon-caret-bottom':!item2.display,'el-icon-caret-top':item2.display}" @click="cityclick(item2,$event)"></i>
									<el-checkbox-group class="region" v-model="item2.checkedAreas" @change="regionchange(item2,item1)" v-if="item2.display" :class="{zindex:item2.zindex}">
										<el-checkbox v-for="item3 in item2.children" :label="item3.value" key="$index"><span :title="item3.label" class="text-overflow dib w110 top">{{item3.label}}</span></el-checkbox>
									</el-checkbox-group>
								</div>
							</div>
						</div>
					</div>
				</li>
				<li class="mt-30 ml-118">
					<el-button type="primary" @click="handleSave">保存</el-button>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import { axiosApi, basePath } from '../../api/api'; // 导入API
	import { rawCitiesData } from '../../city-region.js'
	import { timeStamp } from '../../main.js' //导入时间戳转化函数
	import { MessageBox } from 'element-ui';
	export default {
		data() {
			return {
				areas: (() => { //添加属性
					rawCitiesData.forEach((item1, index1) => {
						this.$set(item1, "checkAll", false) //省 是否 选中
						this.$set(item1, "isIndeterminate", false) //省 是否  部分选中
						item1.children.forEach((item, index) => {
							this.$set(item, "display", false) //区 是否显示
							this.$set(item, "display", false) //区 是否显示
							this.$set(item, "zindex", false) //控制最后显示的区  在最上层
							this.$set(item, "checked", false) //市 是否 选中
							this.$set(item, "checkedAreas", []) //存储 选中区 对应的id
							this.$set(item, "isIndeterminate", false) //市  是否 部分选中
						})
					})
					return rawCitiesData
				})(), //全国各省
				isCountrywide: false, //全国是否全选
				isIndeterminate: false, //全国是否部分选中
				dateTimevalue: [], //时间范围
				authorizationRegion: [], //
				authorizationStartDay: '', //开始时间
				authorizationEndDay: '', //结束时间
				obj: {}, //本地存储数据
			}
		},
		mounted() {
			this.$nextTick(function() {
				if(this.$route.params.path == "merchantEdit") {
					this.spuAuthorizationDetail();
				}
			})
		},
		methods: {
			//点击城市，区展开或关闭
			cityclick(item, e) {
				item.display = !item.display
				item.zindex = !item.zindex
				this.areas.forEach(item1 => {
					item1.children.forEach(item2 => {
						if(item != item2) {
							item2.zindex = false
						}
					})
				})
				console.log(e)
			},
			//区选择
			regionchange(item, item1) {
				item.checked = item.checkedAreas.length == item.children.length
				this.isCheckAll(item1, item)
			},
			//市选择
			citychange(item, item1) {
				if(item.checked) {
					item.checkedAreas = item.children.map(item2 => {
						return item2.value
					})
				} else {
					item.checkedAreas = []
				}
				this.isCheckAll(item1, item)
			},
			//省选择
			provincechange(item) {
				if(item.checkAll) {
					item.children.forEach(item1 => {
						item1.checked = true
						this.citychange(item1, item)
					})
				} else {
					item.children.forEach(item1 => {
						item1.checked = false
						this.citychange(item1, item)
					})
				}
				this.iscountryall(item)
			},
			//判断全省是否全选
			isCheckAll(item, item1) {
				let arr = item.children.filter(item1 => {
					return item1.checked
				})
				item.checkAll = arr.length == item.children.length;
				this.iscountryall(item, item1)
			},
			//全国选择
			iscountry() {
				if(this.isCountrywide) {
					this.areas.forEach(item1 => {
						item1.checkAll = true
						this.provincechange(item1)
					})
				} else {
					this.areas.forEach(item1 => {
						item1.checkAll = false
						this.provincechange(item1)
					})
				}
			},
			//判断全国是否全选
			iscountryall(item, item1) {
				let arr = this.areas.filter(item2 => {
					return item2.checkAll
				})
				this.isCountrywide = this.areas.length == arr.length
				//市 是否 部分选中
				if(item1) { //对于省的操作需要判断一下
					item1.isIndeterminate = item1.checkedAreas.length > 0 && item1.checkedAreas.length < item1.children.length
				}
				let a = item.children.filter(item3 => {
					return item3.checked
				})
				let c = item.children.filter(item3 => {
					return item3.isIndeterminate
				})
				//省 是否 部分选中
				item.isIndeterminate = (a.length > 0 || c.length > 0) && a.length < item.children.length
				//全国是否部分选中
				let b = this.areas.filter(item3 => {
					return item3.isIndeterminate
				})
				this.isIndeterminate = (b.length > 0 || arr.length > 0) && arr.length < this.areas.length
			},
			spuAuthorizationList() { //添加授权页面跳过来
				axiosApi("/goods/spuAuthorizationList/insert", {
					authorizationList: [{
						sellerId: this.obj.sellerId,
						brandId: this.obj.brandId,
						classifyId: this.obj.classifyId,
						spuNo: this.obj.spuNo
					}],
					authorizationStartDay: this.authorizationStartDay,
					authorizationEndDay: this.authorizationEndDay,
					authorizationRegion: this.authorizationRegion,
					contractImages: this.obj.contractImages,
					customerContractId: this.obj.certId,
					storeName: this.obj.storeName,
					loginName: this.obj.loginName,
					spuName: this.obj.spuName,
					isCountrywide: this.isCountrywide
				}, (res) => {
					this.$router.push(basePath + "/merchant/addGood");
					this.$message({
						type: 'success',
						message: '操作成功！',
						duration: 1000
					})
				}, 1, 10, (res) => {
					MessageBox.alert(res.data.message, '提示信息', {
						confirmButtonText: '确定'
					});
				})
			},
			spuAuthorizationBatchApproved() { //保存接口，除了上面的接口
				const api = '/goods/spuAuthorizationBatchApproved/update'
				let body = {
					ids: [this.$route.params.id],
					authorizationStartDay: this.authorizationStartDay,
					authorizationEndDay: this.authorizationEndDay,
					authorizationRegion: this.authorizationRegion,
					isCountrywide: this.isCountrywide
				}
				axiosApi(api, body, (res) => {
					this.$message({
						type: 'success',
						message: "操作成功",
						duration: 1000
					})
					if(this.$route.params.path == "merchantEdit") {
						sessionStorage.activeTab = "third";
						this.$router.push(basePath + "/merchant/merchantEdit/" + JSON.parse(sessionStorage.getItem("obj")).sellerId)
					} else if(this.$route.params.path == "supplierDetail") {
						this.$router.push(`${basePath}/merchant/supplierApply`)
					}
				}, 1, 10, res => {
					MessageBox.alert(res.data.message, '提示信息', {
						confirmButtonText: '确定'
					});
				})
			},
			//更新时间区域    默认加载 接口
			spuAuthorizationDetail() {
				const api = '/goods/spuAuthorizationDetail/select'
				let body = {
					id: this.$route.params.id
				}
				axiosApi(api, body, (res) => {
					//时间赋值
					this.dateTimevalue = [res.data.data.authorizationStartDay, res.data.data.authorizationEndDay];
					//区域赋值
					this.isCountrywide = res.data.data.isCountrywide
					this.authorizationRegion = res.data.data.authorizationRegion
					if(this.isCountrywide) {
						this.iscountry() //全国选中
					} else {
						console.log("come", res.data.data.authorizationRegion)
						JSON.parse(res.data.data.authorizationRegion).forEach(item1 => { //返回数据的省
							this.areas.forEach(item2 => { //总数据的省
								console.log(item2)
								if(item1.id == item2.value) { //省相等
									item1.sub.forEach(item3 => { //返回数据的市
										item2.children.forEach(item4 => { //总数据的市
											if(item3.id == item4.value) { //市相等
												console.log(item4, "4")
												item4.checkedAreas = item3.sub.map(item5 => {
													return item5.id.toString()
												})
												item4.checked = item4.checkedAreas.length == item4.children.length
												item4.isIndeterminate = item4.checkedAreas.length > 0 && item4.checkedAreas.length < item4.children.length
												let arr = item2.children.filter(item6 => {
													return item6.checked
												})
												item2.checkAll = arr.length == item2.children.length
												let b = item2.children.filter(item6 => {
													return item6.isIndeterminate
												})
												item2.isIndeterminate = (arr.length > 0 || b.length > 0) && arr.length < item2.children.length
												let c = this.areas.filter(item6 => {
													return item6.isIndeterminate
												})
												let d = this.areas.filter(item6 => {
													return item6.checkAll
												})
												this.isIndeterminate = (c.length > 0 || d.length > 0) && d.length < this.areas.length

											}
										})
									})
								}
							})
						})
					}
				}, 1, 10, (res) => {
					this.$message({
						type: 'info',
						message: res.data.message,
						duration: 1000
					})
				})
			},
			//保存按钮事件
			handleSave() {
				if(!(this.authorizationStartDay > 0 && this.authorizationEndDay > 0)) {
					MessageBox.alert("请选择资质有效时间！", '提示信息', {
						confirmButtonText: '确定'
					});
					return false;
				}
				if(this.authorizationStartDay == this.authorizationEndDay) {
					MessageBox.alert("资质有效开始时间应小于结束时间！", '提示信息', {
						confirmButtonText: '确定'
					});
					return false;
				}
				//取 区域数据  传给后台的值
				this.authorizationRegion = []
				this.areas.forEach(item => { //省
					if(item.isIndeterminate || item.checkAll) {
						let arr = []
						item.children.forEach(item1 => { //市
							if(item1.checkedAreas.length > 0) {
								arr.push({
									"id": item1.value,
									"sub": item1.checkedAreas.map(item2 => {
										return {
											id: item2
										}
									})
								})
							}
						})
						this.authorizationRegion.push({
							"id": item.value,
							"sub": arr
						})
					}
				})
				if(!this.isCountrywide) {
					if(this.authorizationRegion.length == 0) {
						MessageBox.alert("请选择资质有效区域", '提示信息', {
							confirmButtonText: '确定'
						});
						return false;
					}
				}
				if(this.$route.params.path == "lookAgreement") {
					this.obj = JSON.parse(sessionStorage.getItem("obj")) //获取本地存储数据
					this.spuAuthorizationList()
				} else {
					this.spuAuthorizationBatchApproved();
				}
			},
			//时间控件input值改变
			timeChange(value) {
				this.authorizationStartDay = + new Date(value[0]) || 0;
				this.authorizationEndDay = + new Date(value[1]) || 0;
			}
		}
	}
</script>

<style lang="less">
	.supplier-sale-area {
		.region {
			position: absolute;
			z-index: 10;
			width: 160px;
			padding-top: 10px;
			top: 30px;
			left: 0;
			background: #ffffc3;
			.el-checkbox {
				margin: 5px;
			}
		}
		.zindex {
			z-index: 20;
		}
		.bgc {
			background-color: #ffffc3;
		}
		.w85 {
			max-width: 85px;
		}
		.w100 {
			width: 100px;
		}
		.w110 {
			max-width: 110px;
		}
		.w165 {
			width: 165px;
			position: relative;
		}
		.w670 {
			width: 670px;
		}
		.ml-118 {
			margin-left: 118px;
		}
	}
</style>