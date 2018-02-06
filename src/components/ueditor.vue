<template>
    <div ref="editor" id="editor"></div>
</template>
<script>
    import '../../platform/static/ueditor/ueditor.config.js'
    import '../../platform/static/ueditor/ueditor.all.js'
    import '../../platform/static/ueditor/lang/zh-cn/zh-cn.js'
    // import { generateRandonInteger } from '../../../vuex/utils';
    export default{
        props: {
            value: {
                type: String
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return{
              edtior: null,
              myvalue:'',
              isOne: false
            }
        },
        watch: {
           value(val){
                if(this.isOne) return 
                this.myvalue = val;
                this.setContent();
                //只监听一次
                this.isOne = true;
            },
            disabled(val){
                if (val) {
                    this.setDisabled();
                }
            }
        },
        mounted() {
            this.$nextTick(()=>{
                this.editor = UE.getEditor(this.$refs.editor.id);//初始化富文本
                if (this.disabled) {
                    this.setDisabled();
                }
            })
        },
        beforeDestroy() {
            if(this.editor) {
                this.editor.removeListener('ready');
                this.editor.destroy();
            }
        },
        methods: {
            setContent(){
                this.editor.ready(() => {
                    this.editor.execCommand('cleardoc');
                    this.editor.execCommand('insertHtml', this.value);//插入HTML文本
               });
            },
            getContent(){
                console.log(this.editor.getContent().toString())
                return this.editor.getContent().toString()
            },
            setDisabled(){
                this.editor.ready(() => {
                    //除了全屏功能全部禁用
                    this.editor.setDisabled('fullscreen');
                });
            }
        }
    }
</script>
<style>
    #editor{
      clear: both;
      width: 600px;
      display: inline-block;
    }
    #edui1_iframeholder{
      height: 120px;
    }
</style>