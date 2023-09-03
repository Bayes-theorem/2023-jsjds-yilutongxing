<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="150px">
        <menu-component></menu-component>
      </el-aside>
      <el-container>
        <!--<el-header><header-component></header-component></el-header>-->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import menuComponent from "@/components/menuComponent.vue";
//import {re} from "@babel/core/lib/vendor/import-meta-resolve";
//import {h} from "@vue/runtime-core";
//import headerComponent from "@/components/headerComponent.vue";
export default {
  name: "homeView",
  methods: {},
  components:{
    menuComponent,
    //headerComponent
  },


}
</script>

<style lang="less" scoped>
el-container{
  width: 100%;
  height: 100%;
}
.el-header{
  padding: 0;
}
.el-main{
  padding: 0;
}
</style>