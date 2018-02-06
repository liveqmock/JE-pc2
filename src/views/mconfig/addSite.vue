<template>
	<div class="supplier-sale-area">
		<div class="title-top" > {{isEdit?'编辑站点':'新增站点'}}</div>
		<div class="mt-50 ml-50">
			<ul>
				<li class="mb-50 clearfix">
					<span class="fl lh-32 mr-30">
						{{isEdit?'请配置需要编辑的站点:':'请配置需要开通的站点:'}}
					</span>
					<el-input v-model.trim="siteName" :maxlength="10" placeholder="请输入站点名称"></el-input>
				</li>
				<li class="clearfix">
					<div class="fl lh-32"><span>站点有效区域:</span></div>
					<div class="ml-30 fl bd">
						<!--<el-checkbox class="ml-20 mt-20 p-5" v-model="isCountrywide" :indeterminate="isIndeterminate" @change="iscountry">全国</el-checkbox>-->
						<div class="mt-20  clearfix" v-for="(item1,index1) in areas" key="$index">
							<div class="fl w100 pl-20">
								<el-checkbox class="p-5" v-model="item1.checkAll" :indeterminate="item1.isIndeterminate" :disabled="item1.disable" @change="provincechange(item1)">{{item1.label}}</el-checkbox>
							</div>
							<div class="fl w670">
								<div class="dib w165 mb-10 clearfix" v-for="(item2,index2) in item1.children" key="$index">
									<el-checkbox v-model="item2.checked" :indeterminate="item2.isIndeterminate" :disabled="item2.disable" @change="citychange(item2,item1)" :class="{bgc:item2.display}" class="p-5">
										<span :title="item2.label" class="text-overflow w85 top dib">{{item2.label}}</span>
										<span class="color-danger font-12" v-if="item2.checkedAreas.length>0">({{item2.checkedAreas.length}})</span>
									</el-checkbox>
									<i class="cursor color-danger" :class="{'el-icon-caret-bottom':!item2.display,'el-icon-caret-top':item2.display}" @click="cityclick(item2,$event)"></i>
									<el-checkbox-group class="region" v-model="item2.checkedAreas" @change="regionchange(item2,item1)" v-if="item2.display" :class="{zindex:item2.zindex}">
										<el-checkbox v-for="item3 in item2.children" :label="item3.value" key="$index" :disabled="item3.disable"><span :title="item3.label" class="text-overflow dib w110 top">{{item3.label}}</span></el-checkbox>
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
	import { MessageBox } from 'element-ui';
	export default {
		data() {
			return {
				areas: (() => { //添加属性
					rawCitiesData.forEach((item1, index1) => {
						this.$set(item1, "disable", false) //省 是否 禁用
						this.$set(item1, "checkAll", false) //省 是否 选中
						this.$set(item1, "isIndeterminate", false) //省 是否  部分选中
						item1.children.forEach((item, index) => {
							this.$set(item, "disable", false) //区 是否禁用
							this.$set(item, "display", false) //区 是否显示
							this.$set(item, "zindex", false) //控制最后显示的区  在最上层
							this.$set(item, "checked", false) //市 是否 选中
							this.$set(item, "checkedAreas", []) //存储 选中区 对应的id
							this.$set(item, "isIndeterminate", false) //市  是否 部分选中
							item.children.forEach((i)=>{  //区
								this.$set(i, "disable", false) //区 是否禁用
							})
						})
					})
					return rawCitiesData
				})(), //全国各省
				isCountrywide: false, //全国是否全选
				isIndeterminate: false, //全国是否部分选中
				authorizationRegion: [], //
				obj: {}, //本地存储数据
				siteName: null,//站点名称
				isEdit: false  //站点编辑
			}
		},
		mounted() {
			this.$nextTick(function() {
				let body = {}
				if (this.$route.query.id) {
					body.id = this.$route.query.id
					this.isEdit = true
				}
				if (this.$route.query.name) {
					this.siteName = this.$route.query.name
				}
				this.siteInit(body);
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
				//console.log(e)
			},
			//区选择
			regionchange(item, item1) {
				let index = 0
				item.children.forEach((i)=>{
					if (i.disable) {
						index++
					}
				})
				item.checked = item.checkedAreas.length == item.children.length - index
				this.isCheckAll(item1, item)
			},
			//市选择
			citychange(item, item1) {
//				console.log(item,'市')
				if(item.checked) {
					item.checkedAreas = item.children.filter(item2 => {
						return !item2.disable
					})
					item.checkedAreas = item.checkedAreas.map((i)=>{
						return i.value
					})
					//console.log(item.checkedAreas)
				} else {
					item.checkedAreas = []
				}
				this.isCheckAll(item1, item)
			},
			//省选择
			provincechange(item) {
				if(item.checkAll) {
					item.children.forEach(item1 => {
						if (!item1.disable) {
							item1.checked = true
							this.citychange(item1, item)
						}
					})
				} else {
					item.children.forEach(item1 => {
						if(!item1.disable){
							item1.checked = false
							this.citychange(item1, item)
						}
					})
				}
				this.iscountryall(item)
			},
			//判断全省是否全选
			isCheckAll(item, item1) {
				let arr = item.children.filter(item1 => {
					return item1.checked
				})
				let index = 0;
				item.children.forEach((i)=>{
					if (i.disable) {
						index++
					}
				})
				item.checkAll = arr.length == item.children.length - index;
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
				if(item1) {
					let index1 = 0; //计算 禁用区的数量
					item1.children.forEach((i)=>{
						if (i.disable) {
							index1++
						}
					})
					item1.isIndeterminate = item1.checkedAreas.length > 0 && item1.checkedAreas.length < item1.children.length - index1
				}
				let a = item.children.filter(item3 => {  //选中状态的市
					return item3.checked
				})
				let c = item.children.filter(item3 => {  //部分选中状态的市
					return item3.isIndeterminate
				})
				let index2 = 0; //计算 禁用市的数量
				item.children.forEach((i)=>{
					if (i.disable) {
						index2++
					}
				})
				//省 是否 部分选中
				item.isIndeterminate = (a.length > 0 || c.length > 0) && a.length < item.children.length - index2
				//全国是否部分选中
				let b = this.areas.filter(item3 => {
					return item3.isIndeterminate
				})
				this.isIndeterminate = (b.length > 0 || arr.length > 0) && arr.length < this.areas.length
			},
			//保存按钮事件
			handleSave() {
				if(!(this.siteName)) {
					MessageBox.alert("请输入站点名称！", '提示信息', {
						confirmButtonText: '确定'
					});
					return false;
				}
				let reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{3,10}$/
				if (!reg.test(this.siteName)) {
					MessageBox.alert("请输入正确的站点名称！", '提示信息', {
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
						MessageBox.alert("请选择站点区域", '提示信息', {
							confirmButtonText: '确定'
						});
						return false;
					}
				}
				//console.log(this.authorizationRegion,'111111');
				let body = {
					name: this.siteName,
					districts: this.authorizationRegion
				}
				let msgContent = ''
				if (this.isEdit) {  //编辑
					body.id = this.$route.query.id
					msgContent = '是否确认修改站点['+ this.siteName +']？'
				}else{
					msgContent = '是否确认开通站点['+ this.siteName +']？'
				}
				const h = this.$createElement
				this.$msgbox({
					title: '提示信息',
					message: h('p', {
						style: 'text-align:center'
					}, msgContent),
					showCancelButton: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					beforeClose: (action, instance, done) => {
						if(action === 'confirm') {
							this.siteInsert(body) //新增，保存站点接口
							done()
						} else {
							done()
						}
						delete instance.$slots.default;
					}
				})
			},
			siteInsert(body) { //保存接口，除了上面的接口
				const api = this.isEdit?'/base/foundation/site/multiDistrictEdit':'/base/foundation/site/multiDistrictInsert'
				axiosApi(api, body, (res) => {
					this.$message({
						type: 'success',
						message: "操作成功",
						duration: 1000
					})
					this.$router.push(`${basePath}/site`)
				}, 1, 10, res => {
					MessageBox.alert(res.data.message, '提示信息', {
						confirmButtonText: '确定'
					});
				})
			},
			siteInit(body) {  // 初始化不能选中的区域 ， （其他站点已经勾选 的地区）
				axiosApi('/foundation/site/init', body , (res) => {
					//初始化禁用站点
					if (res.data.data.disableSites) {
						JSON.parse(res.data.data.disableSites).forEach(item1 => { //返回数据的省
							this.areas.forEach(item2 => { //总数据的省
								if(item1.id == item2.value) { //省相等
									item1.sub.forEach(item3 => { //返回数据的市
										item2.children.forEach(item4 => { //总数据的市
											if(item3.id == item4.value) { //市相等
												item4.children.forEach((areaCh)=>{  //循环   == 区
													item3.sub.forEach((areaSub)=>{
														if (areaSub.id == areaCh.value) { //区 相等
															areaCh.disable = true
														}
													})
												})
												item4.disable = item3.sub.length == item4.children.length  //市禁选
												//item4.isIndeterminate = item4.checkedAreas.length > 0 && item4.checkedAreas.length < item4.children.length
												let arr = item2.children.filter(item6 => {  //禁选市的返回 
													return item6.disable
												})
												item2.disable = arr.length == item2.children.length  //省禁选
											}
										})
									})
								}
							})
						})
					}
					//初始化选中站点
					if(res.data.data.selectsite){
						JSON.parse(res.data.data.selectsite).forEach(item1 => { //返回数据的省
							this.areas.forEach(item2 => { //总数据的省
								//console.log(item2)
								if(item1.id == item2.value) { //省相等
									item1.sub.forEach(item3 => { //返回数据的市
										item2.children.forEach(item4 => { //总数据的市
											if(item3.id == item4.value) { //市相等
												item4.checkedAreas = item3.sub.map(item5 => {
													return item5.id.toString()
												})
												let cityIndex = 0; //计算 禁用市的数量
												item4.children.forEach((i)=>{
													if (i.disable) {
														cityIndex++
													}
												})
												item4.checked = item4.checkedAreas.length == item4.children.length - cityIndex
												item4.isIndeterminate = item4.checkedAreas.length > 0 && item4.checkedAreas.length < item4.children.length - cityIndex
												let arr = item2.children.filter(item6 => {
													return item6.checked
												})
												let cityIndex2 = 0; //计算 禁用市的数量
												item2.children.forEach((i)=>{
													if (i.disable) {
														cityIndex2++
													}
												})
												item2.checkAll = arr.length == item2.children.length - cityIndex2
												let b = item2.children.filter(item6 => {
													return item6.isIndeterminate
												})
												item2.isIndeterminate = (arr.length > 0 || b.length > 0) && arr.length < item2.children.length - cityIndex2
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
				}, null, null, (res) => {
					this.$message({
						type: 'info',
						message: res.data.message,
						duration: 1000
					})
				})
			},
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