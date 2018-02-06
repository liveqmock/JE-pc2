<template>
	<div class="v-set">
		<div class="title-top">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/platform/vControl' }">APP版本控制</el-breadcrumb-item>
                <el-breadcrumb-item>设置</el-breadcrumb-item>
            </el-breadcrumb>
		</div>
		<div class="p30">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
                <el-form-item label="平台" >
                    <el-select v-model="ruleForm.productSerial" placeholder="请选择" disabled>
                        <el-option label="云销App" value="100000"></el-option>
                        <el-option label="云商App" value="cloud_app"></el-option>
                        <el-option label="久集App" value="superc_app"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="平台类型" >
                    <el-radio-group v-model="ruleForm.platform" disabled>
                        <el-radio :label="1">Android</el-radio>
                        <el-radio :label="2">iOS</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="版本号" prop="versionNumber" required>
                    <el-input v-model.trim="ruleForm.versionNumber"></el-input>
                </el-form-item>
                <el-form-item label="上次最新版本" >
                    <el-input v-model="lastVersion" disabled></el-input>
                </el-form-item>
                <el-form-item label="是否强制更新" prop="tips">
                    <el-radio-group v-model="ruleForm.tips">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="兼容最低版本" prop="updateLowestVersion" v-if="ruleForm.tips === 0" required>
                    <el-select v-model="ruleForm.updateLowestVersion" placeholder="请选择">
                        <el-option v-for="(item,index) in appVersionList" :value="item" :key="item" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上传APK" prop="apk">
                    <el-upload ref="uploadApk"
                        :disabled = "btnLoading"
                        class="upload-apk"
                        action="/"
                        :on-remove="handleRemove"
                        :file-list="fileList"
                        :before-upload="handleBeforeUpload"
                        :http-request="customUpload"
                        :multiple="false"
                        accept=".apk">
                        <el-button size="small" :loading="btnLoading" type="primary" :disabled="ruleForm.platform === 2">点击上传apk文件</el-button>
                    </el-upload>
                    <el-progress :percentage="progress" :class="progress==100||progress==0?'hidden':''"></el-progress>
                </el-form-item>
                <el-form-item label="下载url" prop="downloadUrl" required>
                    <el-input v-model.trim="ruleForm.downloadUrl" :disabled="ruleForm.platform === 1"></el-input>
                </el-form-item>
                <el-form-item label="更新说明" prop="updateDescription" required>
                    <el-input type="textarea" :autosize="{ minRows: 4}" v-model.trim="ruleForm.updateDescription"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="commit-btn" type="primary" :loading="subBtnLoading" @click="submitForm()">提交</el-button>
                </el-form-item>
            </el-form>
		</div>
	</div>
</template>

<script>
import { axiosApi, basePath } from "~/api/api";
import { MessageBox } from "element-ui";
import co from 'co'
import "babel-polyfill"
import OSS from '~/js/aliyun-oss-sdk-4.4.4.min.js'

export default {
  data() {
    return {
        ruleForm:{
            productSerial: null, //平台
            platform:1, //平台类型
            versionNumber:null, //版本号
            tips:0, //是否强制更新
            updateLowestVersion:null, //可向下兼容版本
            downloadUrl:null, //下载url
            updateDescription:null,  //更新说明
        },
        rules:{
            versionNumber:[{
                required:true,
                message: '请输入版本号'
            }],
            downloadUrl:[{
                required:true,
                message: '通过上传apk获取或者请输入下载链接'
            }],
            updateDescription:[{
                required:true,
                message: '请输入更新说明'
            }]
        },
        fileList:[],
        appVersion:{}, //APP版本对象
        appVersionList:[], //App可向下兼容的版本列表
        lastVersion: null, //上一次版本号
        client:null, //ali client
        progress:0,
        btnLoading:false,
        subBtnLoading:false
    }
  },
  mounted() {
      this.appVersion = this.$route.query.q
      let appVersion = JSON.parse(this.appVersion);
      ({'productSerial':this.ruleForm.productSerial
        ,'platform':this.ruleForm.platform
        ,'tips':this.ruleForm.tips} = appVersion);
        this.lastVersion = appVersion.versionNumber
      this.compatibleVersions({
          'platform':this.ruleForm.platform,
          'productSerial':this.ruleForm.productSerial
      })
  },
  methods: {
      submitForm(){ // app版本提交
        this.$refs.ruleForm.validate((valid)=>{
            if(valid){
                this.subBtnLoading = true
                axiosApi('/unlogin/foundation/appVersionUpgrade/insert',this.ruleForm,(res)=>{
                    this.$message({type:'success',message:"操作成功！"})
                    this.subBtnLoading = false
                    this.$router.push(basePath + '/vControl')
                },null,null,(err)=>{this.subBtnLoading = false})
            }
        })
      },
      compatibleVersions(body){ //App可向下兼容的版本列表
          axiosApi('/unlogin/foundation/compatibleVersions/list',body,(res)=>{
              this.appVersionList = res.data.data
          })
      },
      customUpload(file){// 自定义上传
         var client = new OSS({
            region: 'oss-cn-shanghai',//oss服务节点
            accessKeyId: 'LTAIejUyL6mXPwjo', //as
            accessKeySecret: 'TAIUFJNP04T80IHQL6BKKEKWYH7Z20', //ak
            bucket:'sunrise-app',
            secure: true
        })
        let that = this
        co(function* () {
            that.progress = 0.01;
            // console.log('file111', file)
            var result = yield client.multipartUpload('apk/'+ file.file.name, file.file,{
                progress: function* (p) {
                    // console.log(p)
                    that.progress = Math.floor(p * 100)
                }
            });
            that.ruleForm.downloadUrl = result.res.requestUrls[0].split('?')[0]
            that.$refs.uploadApk.uploadFiles = []
            that.$refs.uploadApk.uploadFiles[0] = {
                name:result.name,
                url: result.res.requestUrls[0].split('?')[0],
                status: 'ready' 
            }
            that.$message({type:'success',message:'上传成功！'})
            that.btnLoading = false
        }).catch(function (err) {
            // console.log(err);
            that.$message({type:'error',message:'上传失败，请重试！'})
        });
      },
      handleRemove (file,fileList) { // 移除上传文件
        this.ruleForm.downloadUrl = null
      },
      handleBeforeUpload(file){ //上传文件之前
        this.$refs.uploadApk.uploadFiles = []
        const isAPK = (file.name.indexOf('.apk') != -1 );
        if(!isAPK) {
            this.$message.error('请上传APK文件!');
        }else{
            this.btnLoading = true
        }
        return isAPK
      }

  }
}
</script>

<style lang="less">
    .v-set{
        .el-upload-list__item-status-label{display: inline-block}
        .hidden{
            display: none;
        }
        .el-breadcrumb__separator{
            display: inline;
        }
        .ruleForm{
            .el-form-item__label{
                width: 120px !important;
                padding-right: 20px;
            }
            .el-form-item__content{
                margin-left: 120px !important;
            }
            .el-textarea{width: 240px;}
        }
        .upload-apk{
            .el-button{
                width: 120px;
            }
            .el-upload-list{
                width: 240px;
            }
        }
        .commit-btn{width: 120px;}
        .el-progress-bar{
            width: 240px;
        }
        .el-upload-list__item:hover {
            .el-upload-list__item-status-label{
                display: none;
            }
        }
    }
</style>