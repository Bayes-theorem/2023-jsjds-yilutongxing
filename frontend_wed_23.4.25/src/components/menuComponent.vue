<template>
  <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      @open="handleOpen"
      @close="handleClose"
      active-text-color="#ffd04b"
      background-color="#2a3f54"
      text-color="#fff"
  >
    <el-menu-item @click="clickMenu((item))"
                  v-for="item in menuList" :key="item.name" :index="item.name">
      <template #title>
        <el-icon v-if="item.label=='主页'" style="color:#70a981"><House /></el-icon>
        <el-icon v-if="item.label=='公告'" style="color:#70a981"><Postcard /></el-icon>
        <el-icon v-if="item.label=='投诉'" style="color:#70a981"><PhoneFilled /></el-icon>
        {{ item.label }}
      </template>
    </el-menu-item>
    <el-sub-menu index="1">
      <template #title>
        <el-icon style="color:#70a981"><BellFilled /></el-icon>
        <span>舆情</span>
      </template>
      <el-menu-item-group v-for="item in subMenuList" :key="item.name">
        <el-menu-item @click="clickMenu(item)"
                      :index="item.name">{{ item.label }}
        </el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
  </el-menu>
</template>

<script>
export default {
  name: "menuComponent",
  data() {
    return {
      isCollapse: false,
      menuList: [
        {
          path: '/home/hospital',
          name: 'hospital',
          label: '主页',
        },
        {
          path: '/home/announcement',
          name: 'announcement',
          label: '公告',
        },
        {
          path: '/home/complain',
          name: 'complain',
          label: '投诉',
        }
      ],
      subMenuList: [
        {
          path: '/home/allPost',
          name: 'allPost',
          label: '概览'
        },
        {
          path: '/home/sensitivePost',
          name: 'sensitivePost',
          label: '敏感预警'
        },
        {
          path: '/home/negativePost',
          name: 'negativePost',
          label: '情感分析'
        },
        {
          path: '/home/sixDimension',
          name: 'sixDimension',
          label: '6D评价图谱'
        },
      ]
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    clickMenu(item) {
      console.log(item)
      this.$router.push(item.path)
    }
  }
}
</script>

<style lang="less" scoped>
.el-menu {
  height: 100vh;
  width: 9.8vw;
  position: fixed;
}

html, body {
  margin: 0;
  padding: 0;
}

</style>