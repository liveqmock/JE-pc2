<template>
  <div id="imgview" :class="{visible: visible}">
    <el-carousel indicator-position="outside" arrow="always" :initial-index="startindex" :autoplay="false" ref="carousel">
      <el-carousel-item v-for="(item,index) in imgs" :key="index">
        <img :src="item" alt="">
      </el-carousel-item>
    </el-carousel>
    <div class="el-icon-close" @click="close"></div>
  </div>
</template>
<script>
export default {
  props: ['visible', 'imgs', 'startindex'],
  data() {
    return {

    }
  },
  watch: {
    startindex(val) {
      this.setActiveItem(val)
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    setActiveItem(index) {
      this.$refs.carousel.setActiveItem(index);
    }
  },
  mounted() {
    // console.log(3333)
  }
}
</script>
<style lang="less">
  #imgview {
    display: none;
    position: fixed;
    z-index: 999999;
    width: 800px;
    height: 500px;
    background: #9f9f9f;
    left: 50%;
    top: 50%;
    margin-left: -400px;
    margin-top: -250px;
    .el-icon-close {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 30px;
      height: 30px;
      color: #fff;
      z-index: 9999999;
    }
    .el-carousel {
      .el-carousel__container {
        height: 460px;
        margin-top: 20px;
        .el-carousel__item {
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            height: 400px;
          }
        }
      }
    }
    &.visible {
      display: block;
    }
  }
</style>