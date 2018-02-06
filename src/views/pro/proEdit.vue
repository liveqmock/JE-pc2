<template>
	<div id="proEdit">
		<div class="title-top">
			<el-breadcrumb separator="  ">
				<el-breadcrumb-item :to="{ path: '/proManagement' }">商品库管理</el-breadcrumb-item>
				<el-breadcrumb-item class="el-icon-arrow-right"></el-breadcrumb-item>
				<el-breadcrumb-item>商品详情</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="main mt-50 ml-100">
			<div class="ml-15 mb-50">
				<label class="mr-30">商品名称:</label>
				<span>
					<el-input class='mr-10' placeholder="百加得冰锐限量版"></el-input>
					<span class="color-9"><el-input class='input-size mr-10' placeholder="请输入建议零售价"></el-input>元</span>
				</span>
				<div class="mt-20">
					<el-upload
					  action="//jsonplaceholder.typicode.com/posts/"
					  list-type="picture-card"
					  :on-preview="handlePictureCardPreview"
					  :on-remove="handleRemove">
					</el-upload>
					<el-dialog v-model="dialogVisible" size="tiny">
					  <img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
				</div>
			</div>
			<div class="pro-informations">
				<div class='norms clearfix mb-30'>
					<div class="mb-20 ml-15" >规格信息:</div>
					<div class="mb-20 ml-40 clearfix" v-for='(list1,index) in normsLists.child' key="$index">
						<label class="font-14 color-3 mr-30 fl">{{list1.sTitle}}</label>
						<span class="list-content fl">
							  <el-checkbox-group v-model="checkList" >
							    <el-checkbox class='width-100 mr-50' v-for='list2 in list1.sChild' key="$index"  :label="list2.name + index">{{list2.name}}</el-checkbox>
							  </el-checkbox-group>
						</span>
					</div>
				</div>
				<div class="basic ml-15">
					<div class="mb-20">基本信息:</div>
					<ul class="info ml-5">
						<li class="fl mb-20"><label class="listInfo">规规格：</label>
							<span class="ml-30">
								<el-select v-model="value" placeholder="请输入规格">
									<el-option v-for="item in options" key="$index" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</span>
						</li>
						<li class="fl mb-20 ml-50"><label class="listInfo">色泽：</label>
							<span class="ml-30">
								<el-select v-model="value" placeholder="请输入色泽">
									<el-option v-for="item in options" key="$index" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</span>
						</li>
						<li class="fl mb-20"><label class="listInfo">分类：</label>
							<span class="ml-30">
								<el-select v-model="value" placeholder="请输入分类">
									<el-option v-for="item in options" key="$index" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</span>
						</li>
						<li class="fl mb-20 ml-50"><label class="listInfo">香型号：</label>
							<span class="ml-30">
								<el-input placeholder="型号"></el-input>
							</span>
						</li>
						<li class="fl mb-20"><label class="listInfo">品牌：</label>
							<span class="ml-30">
								<el-input placeholder="品牌"></el-input>
							</span>
						</li>
						<li class="fl mb-20 ml-50"><label class="listInfo">包装：</label>
							<span class="ml-30">
								<el-input class='mr-10' placeholder="包装"></el-input>元
							</span>
						</li>
					</ul>
					<div class="mt-30 fl ml-05 ">
						<p class="mb-20 clearfix"><label class="fl">使用方法:</label>
							<span class="ml-30 fl">
								<el-input type="textarea" :rows="rows" placeholder="请输入内容" v-model.trim="textarea"></el-input>
							</span>
						</p>
						<p class=" mt-20 clearfix"><label class="fl">储藏方法:</label>
							<span class="ml-30 fl">
								<el-input type="textarea" :rows="rows" placeholder="请输入内容" v-model.trim="textarea"></el-input>
							</span>
						</p>
					</div>
				</div>
			</div>
			<div class="width-640 fl mt-50 ml-100">
				<el-button type="primary">保存</el-button>
			</div>

		</div>
	</div>
</template>

<script>
	import { axiosApi,basePath } from '../../api/api'
  export default {
    data() {
      return {
      	value:'',
      	options:'',
      	textarea:'',
      	checkList:[],
        dialogImageUrl: '',
        dialogVisible: false,
        rows:2,
        normsLists: {
					child: [{ sTitle: "容量:", sChild: [{ name: "50ml", id: '11' }, { name: "100ml", id: "12" }, { name: "500ml", id: "13" }, { name: "1000ml", id: "14" }] },
							{ sTitle: "体积:", sChild: [{ name: "50kg", id: '11' }, { name: "100kg", id: "12" }, { name: "500kg", id: "13" }, { name: "1000kg", id: "14" }] }
					]
				}
      };
    },
    methods: {
      handleRemove(file, fileList) {
//      console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
    }
  }
</script>

<style>
	#proEdit .input-size{
		width: 150px;
	}
	#proEdit ul {
		width: 800px;
	}
	#proEdit li{
		width: 360px;
	}
	#proEdit .listInfo {
		width: 60px;
		display: inline-block;
		text-align: right;
	}
	#proEdit .ml-90{
		margin-left: 90px;
	}
	#proEdit textarea{
		width:500px;
		height: 100px;
		resize: none;
	}
	
	#proEdit .el-upload--picture-card{
		width: 90px;height: 90px;
		line-height: 90px;
		background-size:50px 50px ;
	}
	#proEdit .el-upload-list__item{
		width: 90px;
		height: 90px;
	}
</style>