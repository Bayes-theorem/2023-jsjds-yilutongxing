<template>

  <div class="header-container">
    <div class="left">
      <el-button><el-icon><Menu /></el-icon></el-button>
      <span class="text">首页</span>
    </div>
    <div class="right"></div>
  </div>
</template>

<script>

export default {
  name: "headerComponent"
}
</script>

<style lang="less" scoped>
.header-container{
  padding: 0;
  background-color: #333;
  height: 60px;
  display: flex;
  align-items: center;
  .text{
    color: #fff;
    font-size: 15px;
    margin-left: 10px;
  }
}
</style>