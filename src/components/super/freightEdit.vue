<template>
	<div id="freightEdit">
		<el-dialog title="编辑" v-model="visible" @close="goPage">
			<el-form :model="formInfo" :rules="rules" ref="aForm" label-width="185px">
				<el-form-item label="快递公司:">
					<el-select v-model="formInfo.shipperId" placeholder="请选择" disabled>
						<el-option v-for="i in expressCompanyList" :label="i.companyName" :value="i.id" :key="i.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="始发城市:">
					<el-input v-model="formInfo.fromCity" placeholder="请输入始发城市" disabled></el-input>
				</el-form-item>
				<el-form-item label="目的城市:">
					<el-input v-model="formInfo.toCity" placeholder="请输入目的城市" disabled></el-input>
				</el-form-item>
				<el-form-item label="首重（元/kg）:" prop="firstWeight">
					<el-input v-model="formInfo.firstWeight" placeholder="请输入首重" :maxlength="7"></el-input>
				</el-form-item>
				<el-form-item label="续重（元/kg）:" prop="addWeight">
					<el-input v-model="formInfo.addWeight" placeholder="请输入续重" :maxlength="7"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="sure">确定</el-button>
				<el-button @click="goPage">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { axiosApi, basePath } from '../../api/api'
	import { rawCitiesData } from '../../city-region.js'
	export default {
		props: ["close", "info", "expressCompanyList"],
		data() {
			return {
				isDefault: false,
				visible: false,
				areas: rawCitiesData,
				rules: {
					firstWeight: [{
						required: true,
						message: '请输入首重',
					}, {
						pattern: /^[0-9]+\.{0,1}[0-9]{0,2}$/,
						message: '只能输入数字和小数点'
					}],
					addWeight: [{
						required: true,
						message: '请输入续重',
					}, {
						pattern: /^[0-9]+\.{0,1}[0-9]{0,2}$/,
						message: '只能输入数字和小数点'
					}],
				},
				formInfo: {}
			}
		},
		watch: {
			close(val) {
				this.visible = val
				val && (this.formInfo = Object.assign({}, this.formInfo, this.info))
			},
			info: {
				handler: function(val) {
					this.formInfo = Object.assign({}, this.formInfo, val)
				},
				deep: true
			}
		},
		methods: {
			goPage() {
				this.$emit("update:close", false)
			},
			sure() {
				this.$refs.aForm.validate(valid => {
					if(valid) {
						axiosApi("/foundation/freightPrice/edit", {
							id: this.formInfo.id,
							firstWeight: this.formInfo.firstWeight,
							addWeight: this.formInfo.addWeight
						}, res => {
							this.$emit("change")
							this.goPage()
							this.$message({
								type: 'success',
								message: '操作成功!',
								duration: 1000
							});
						})
					}
				})
			}
		}
	}
</script>

<style lang="less">
	#freightEdit {}
</style>