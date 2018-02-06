<template>
    <div class="ys-daterange-box">
        <el-date-picker
            :class="type === 'datetime' ? 'ys_picker ys_picker_datetime' : 'ys_picker'"
            v-model="startTime"
            :picker-options="pickerOptions1"
            :type="type === 'datetime' ? type : 'date'"
            @change="dateChange"
            :disabled="disabled"
            :placeholder="placeholder[0] || ''">
        </el-date-picker>
        <span class="m-partition">-</span>
        <el-date-picker
            :class="type === 'datetime' ? 'ys_picker ys_picker_datetime' : 'ys_picker'"
            v-model="endTime"
            :picker-options="pickerOptions2"
            :type="type === 'datetime' ? type : 'date'"
            @change="dateChange"
            :disabled="disabled"
            :placeholder="placeholder[1] || ''">
        </el-date-picker>
    </div>
</template>

<script>
    export default {
        props : {
            value: {//时间区间数组 v-model
                type: Array,
                default() {
                    return [];
                }
            },
            placeholder : { //时间选择框占位符数组 placeholder
                type : Array,
                default() {
                    return ['开始时间','结束时间'];
                }
            },
            startDisabledDate: [Date, String, Number], //开始时间限制选择的时间 格式:Date类型或日期字符串或时间戳格式
            endDisabledDate: [Date, String, Number], //结束时间限制选择的时间 格式:Date类型或日期字符串或时间戳格式
            type: String, //类型 可选值 datetime , date
            disabled: Boolean //是否禁用
        },
        data() {
            let _this = this;
            function pickerOptions(time, startDisabledDate, endDisabledDate){
                // console.log(time, startDisabledDate, endDisabledDate)
                if(startDisabledDate && endDisabledDate){//限制选择开始日期和结束日期
                    return time < startDisabledDate || time > endDisabledDate;
                }else if(startDisabledDate){//限制选择开始日期
                    return time < startDisabledDate;
                }else if(endDisabledDate){//限制选择结束日期
                    return time > endDisabledDate;
                }
                return false;//不限制
            }
            return {
                startTime : '',
                endTime : '',
                pickerOptions1 : {
                    disabledDate(time) {
                        const startDisabledDate = + new Date(_this.startDisabledDate) || null;
                        let endDisabledDate = + new Date(_this.endDisabledDate) || null;

                        if(_this.endDisabledDate && _this.endTime) {
                            endDisabledDate = _this.endDisabledDate > _this.endTime.getTime() ? _this.endTime.getTime() : _this.endDisabledDate;
                        }else if(_this.endTime){
                            endDisabledDate = _this.endTime.getTime();
                        }
                        return pickerOptions(time.getTime(), startDisabledDate, endDisabledDate)
                    }
                },
                pickerOptions2 : {
                    disabledDate(time) {
                        let startDisabledDate = + new Date(_this.startDisabledDate) || null;
                        const endDisabledDate = + new Date(_this.endDisabledDate) || null;

                        if(_this.startDisabledDate && _this.startTime) {
                            startDisabledDate = _this.startDisabledDate < _this.startTime.getTime() ? _this.startTime.getTime() : _this.startDisabledDate;
                        }else if(_this.startTime){
                            startDisabledDate = _this.startTime.getTime();
                        }
                        return pickerOptions(time.getTime(), startDisabledDate, endDisabledDate)
                    }
                },
            }
        },
        methods : {
            dateChange(){
                this.$emit('input', [this.startTime, this.endTime]);
                this.$emit('change', [this.startTime, this.endTime]);
            }
        }
    }
</script>

<style lang="less">
    .ys-daterange-box{
        display: inline-block;
        .ys_picker{
            width:113px;
            .el-input__icon+.el-input__inner{
                padding-right: 26px!important;
            }
        }
        .ys_picker_datetime{
            width: 175px;
        }
    }
</style>