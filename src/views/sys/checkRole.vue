<template>
	<div id="check">
		<div class="title-top">
			<el-breadcrumb separator=" ">
				<el-breadcrumb-item :to="{ path: '/limits' }">权限管理</el-breadcrumb-item>
				<el-breadcrumb-item class="el-icon-arrow-right"></el-breadcrumb-item>
				<el-breadcrumb-item>权限查看</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="mt-50 ml-50">
			<div class='mb-50 ml-50'>
				<label class="color-3">角色名称：</label>
				<span>
					{{list.name}}
				</span>
			</div>
			<el-form class="mb-50 ml-50 clearfix width-640" v-for="(item,index1) in list.sub" key="$index">
				<fieldset class="bd">
					<legend class="ml-10 pl-20 pr-20">{{item.name}}</legend>
					<div v-for='(item,index) in item.sub' key="$index">
						<el-checkbox class="color-3 mr-30 fl mb-10 mt-10 ml-15" v-model="item.checked" :label="item.id" onclick="return false;">{{item.name}}</el-checkbox>
						<span class="fl ml-30">
						  <el-checkbox-group v-model="item.checkedAreas"> 
						    <el-checkbox class='mr-40 mb-10' v-for='item in item.sub' key="$index" :label="item.id" onclick="return false;">{{item.name}}</el-checkbox>
						  </el-checkbox-group>
					</span>
					</div>

				</fieldset>
			</el-form>
		</div>
	</div>
</template>

<script>
	import { axiosApi,basePath } from '../../api/api';
	const list = {
		name: "项目经理",
		id: "XXX",
		sub: [{
				name: "商品管理",
				id: "1",
				sub: [
					{ id: '001', name: "品牌管理", sub: [{ name: "查看详情", id: '101' }, { name: "查看列表", id: "102" }, { name: "添加商品", id: "103" }, { name: "编辑", id: "104" }, { name: "删除", id: "105" }, { name: "停用", id: "106" }] },
					{ id: '002', name: "品牌管理", sub: [{ name: "查看详情", id: '201' }, { name: "查看列表", id: "202" }, { name: "添加商品", id: "203" }, { name: "编辑", id: "204" }, { name: "删除", id: "205" }, { name: "停用", id: "206" }] }
				]

			},
			{
				name: "权限管理",
				id: "2",
				sub: [
					{ id: '003', name: "品牌管理", sub: [{ name: "查看详情", id: '301' }, { name: "查看列表", id: "302" }, { name: "添加商品", id: "303" }, { name: "编辑", id: "304" }, { name: "删除", id: "305" }, { name: "停用", id: "306" }] },
					{ id: '004', name: "品牌管理", sub: [{ name: "查看详情", id: '401' }, { name: "查看列表", id: "402" }, { name: "添加商品", id: "403" }, { name: "编辑", id: "404" }, { name: "删除", id: "405" }, { name: "停用", id: "406" }] }
				]
			}
		]
	};
	let test = [
	{id: '001',sub:[{ name: "查看详情", id: '101' },{name: "添加商品", id: "103"},{name: "编辑", id: "104"}]},
	{id: '002',sub:[{name: "停用", id: "206"}]},
	{id: '003',sub:[{name: "查看列表", id: "302"}]},
	{id: '004',sub:[{name: "添加商品", id: "403"}]}
	];
	export default {
		data() {
			return {
				id:"",
				list: list,
				dialogAreaVisible: false,
				disabled:true
			}
		},
		mounted() {
			this.$nextTick(function() {
				this.checked();
				this.achieve1();
				this.gethash();
			})
		},
		methods: {
			gethash(){
					var test = window.location.href;
//					console.log(test)
					this.id = test.split('=')[1];	
			},
			achieve1() {
				const api = "/foundation/auth/displayTreeByEmployeeId";
				const body = { id:this.id,loginName:"15855855688",isAdmin:0}
				axiosApi(api, body, this.callback1, this.currentPage, 10)
			},
			callback1(res) {
//				let data = res.data.data.elements;
//				this.tableData = data;
//				console.log('1111')
//				console.log(res)
//				console.log('1111')
			},
			checked() {
				let _this = this;
				this.list.sub.forEach(function(item, index) {
					for(let i = 0; i < item.sub.length; i++) {
						if(typeof item.sub[i].checked == "undefined") {
							_this.$set(item.sub[i], "checked", false)
						}
						if(typeof item.sub[i].checkedAreas == "undefined") {
							_this.$set(item.sub[i], "checkedAreas", [])
						}
					}
				})
//				console.log(this.list)
			},
			add(){
				let _this=this
				test.forEach(function (item,index) {
					_this.list.sub.forEach(function (item1,index1) {
						for(let j = 0; j < _this.list.sub[index1].sub.length; j++){
							if (item.id == _this.list.sub[index1].sub[j].id){
								item.sub.forEach(function (item,index) {
								_this.list.sub[index1].sub[j].checkedAreas.push(item.id)
							})
							}
						}
					})
				})
			}
			
		},
		mounted() {
			this.$nextTick(function() {
				this.achieve1()
			})
		}
	}
</script>

<style>
	#check .el-checkbox{
		margin-left: 0;
	}
	#check .bd{
		border: 1px solid #DDDDDD;
	}
</style>