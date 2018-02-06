<template>
	<div class="archived">
		<div class="title-top">
			APP版本控制
		</div>
		<div class="p30">
			<el-form :inline="true" :model="searchForm" class="search clearfix">
				<div class="fl">
					<el-form-item label="平台:">
						<el-select v-model="searchForm.productSerial" placeholder="请选择" clearable>
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
					</el-form-item>
				</div>
				<el-button @click='handleSearch' type="info" class="fl ml-30">搜索</el-button>
			</el-form>
			<el-table class="mt-30" :data="tableData" stripe border  @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
				<el-table-column label="平台"  align="center"  show-overflow-tooltip prop="productSerial">
          <template scope="scope">
            <span v-if="scope.row.productSerial === '100000'">云销App</span>
            <span v-if="scope.row.productSerial === 'cloud_app'">云商App</span>
            <span v-if="scope.row.productSerial === 'superc_app'">久集App</span>
          </template>
        </el-table-column>
				<el-table-column label="类型" show-overflow-tooltip align="center">
          <template scope="scope">
            <span v-if="scope.row.platform === 1">Android</span>
            <span v-if="scope.row.platform === 2">iOS</span>
          </template>
        </el-table-column>
				<el-table-column label="版本" show-overflow-tooltip align="center" prop="versionNumber"></el-table-column>
				<el-table-column label="控制强制更新" align="center">
          <template scope="scope">
            <span>{{scope.row.tips === 1?'是':'否'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="下载url" align="center" prop="downloadUrl" show-overflow-tooltip></el-table-column>
        <el-table-column label="兼容最低" align="center" prop="updateLowestVersion"></el-table-column>
        <el-table-column label="操作" align="center">
            <template scope="scope">
                <el-button type="text" @click="set(scope.row)">设置</el-button>
                <el-button class="btn" type="text" :data-clipboard-text="scope.row.downloadUrl">复制下载URL</el-button>
            </template>
        </el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
import { axiosApi, basePath } from "~/api/api";
import { MessageBox } from "element-ui";
import Clipboard from 'clipboard';

export default {
  data() {
    return {
      searchForm: {
        productSerial:null, // app客户端号
      },
      tableData: [],
      options: [{
        label:'云商App',value:'cloud_app'
      },{label:'久集App',value:'superc_app'},{label:"云销App",value:"100000"}]
    };
  },
  mounted() {
    this.init(this.searchForm);
    this.$nextTick(()=>{
        let clipboard = new Clipboard('.btn');
        //复制成功执行的回调
        // let that = this
        clipboard.on('success', (e)=> {
            this.$message({
              type:'success',
              message:'复制成功！',
              duration:1000
            })  
        });
        //复制失败执行的回调
        clipboard.on('error', (e)=> {
            this.$message({
              type:'error',
              message:'复制失败，请重试！',
              duration:1000
            }) 
        });
    })
  },
  methods: {
    set(row) {
      let q = JSON.stringify(row)
      this.$router.push({path:'VSet',query:{q:q}})
    },
    init(body) {
      axiosApi('/unlogin/foundation/appProductNewest/list',body,(res)=>{
          this.tableData = res.data.data
      },1,10,(err)=>{})
    },
    // 搜索条件
    handleSearch() {
      if(this.searchForm.productSerial === ''){
        this.searchForm.productSerial = null
      }
      this.init(this.searchForm);
    },
    // 全选
    handleSelectionChange() {}
  }
};
</script>

<style lang="less">
.el-date-range-picker__editor.el-input.el-input--small {
  width: 148px;
}
.archived {
  .search {
    .el-form-item__label {
      width: 65px;
      text-align: left;
    }
    .el-date-editor.el-input {
      width: 240px;
    }
  }
  .el-table {
    .el-button {
      width: auto;
      height: 18px;
      font-size: 12px;
    }
  }
}
</style>