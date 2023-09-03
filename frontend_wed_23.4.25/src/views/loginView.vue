<template>
  <div ref="vantaRef" style="width: 100%; height: 100vh">
    <div class="container">
      <form action="">
        <h1>Login</h1>
        <div class="form">
          <div class="item">
            <label>用户名：</label>
            <input type="text" name="username" v-model="username" placeholder="请输入用户名">
            <!-- v-model把输入的值传输给name变量 -->
            <br/>
          </div>
          <div class="item">
            <label>密码：</label>
            <input type="password" name="password" v-model="password" placeholder="请输入密码">
            <br/>
          </div>
        </div>
      </form>
      <el-button type="submit" @click.prevent="handlelogin">登录</el-button>
    </div>
  </div>
</template>

<script>

import * as THREE from 'three'//导入样式
import NET from "vanta/src/vanta.net";//导入动态样式逻辑
export default {
  name: "loginView",
  data() {
    return {
      username: "",
      password: "",
    }
  },
  methods: {
    handlelogin() {
      if (this.username === '长海医院' && this.password === '0921') {
        this.$store.commit("setHospitalID","5b049cc861ea50e507a396124a50aeb6")
        this.$router.replace('/home/hospital');
      } else if (this.name === '')//名字为空
      {
        alert('用户名不为空');
      } else if (this.password === '')//密码为空
      {
        alert('密码不为空');
      } else {
        alert('用户名或密码错误');
      }
    }
  },
  mounted() {
    this.vantaEffect = NET({
      el: this.$refs.vantaRef,
      THREE: THREE
    })
    this.vantaEffect.setOptions({
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x66e5b1,
      backgroundColor: 0x8b8b8b
    })
  },
  beforeUnmount() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy()
    }
  },
}
</script>

<style scoped>
.container {
  width: 480px;
  height: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /*background: rgba(32, 201, 151, 0.7);*/
  background-image: url("@/assets/bg_login_box_1.jpg");
  background-size: 100% 100%;
  text-align: center;
  border-radius: 20px;
  margin-top: 10px;
}

.container h1 {
  color: aliceblue;
}

.item {
  color: #4f4e4e;
  margin-left: 15%;
  margin-top: 35px;
  font-size: 20px;
  text-align: left;
}

.item label {
  float: left;
  width: 5em;
  margin-right: 1em;
  text-align: right;
}

input {
  margin-left: -5px;
  padding: 4px;
  border: solid 1px #faf8f8;
  outline: 0;
  font: normal 13px/100% Verdana, Tahoma, sans-serif;
  width: 200px;
  height: 23px;
  background: #f1f1f190;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 8px;
}

button {
  position: relative;
  height: 33px;
  width: 100px;
  background: rgba(32, 201, 151, 0.8);
  border-radius: 10px;
  margin-top: 35px;
  box-shadow: none;
  color: white;
  margin-left: 80px;
  margin-right: 10px;
}

button:hover {
  color: white;
  background: rgba(32, 201, 151, 0.9);
}

</style>