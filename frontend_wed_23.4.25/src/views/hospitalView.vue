<template>
  <el-row>
    <el-col :span="24">
      <el-header>
        <div class="header">
          <div class="logo"><img src="../assets/logo-文字.png"></div>
          <div class="cooperation"><img src="../assets/乘号.png"></div>
          <div class="logoCH"><img src="../assets/logo-长海医院.png"></div>
        </div>
      </el-header>
    </el-col>
  </el-row>

  <el-row>
    <el-col :span="16">
      <el-carousel :interval="4000" type="card" height="80vh" style="margin: 50px auto;">
        <el-carousel-item v-for="item in imgArr" :key="item">
          <img style="height: 100%;width:100%;justify-content: center" :src="item.url" alt="暂无图片">
        </el-carousel-item>
      </el-carousel>
    </el-col>
    <el-col :span="8">
      <div v-for="item in hospital" :key="item" style="margin: 50px auto;width: 100%;height: 80vh;">
        <div class="section_inner">
          <h1 class="profile__tit">
            <span class="profile__name">{{ item.name }}</span>
          </h1>
          <div class="profile__cover">
            <img :src="item.imgSrc" alt="头像">
          </div>
          <div style="float: right;margin: auto;font-family: Arial, sans-serif;">&nbsp;&nbsp; {{ item.detail }}</div>
        </div>
      </div>
    </el-col>
  </el-row>


  <el-row class="footer_box">
    <el-col :span="24">
      <div class="infoCH">
        <div style="text-align: right">
          <el-icon>
            <MapLocation/>
          </el-icon>&nbsp;医院地址：上海市杨浦区长海路168号
        </div>
        <div style="text-align: right">
          <el-icon>
            <Avatar/>
          </el-icon>&nbsp;联系电话：021-31166666
        </div>
      </div>
      <hr/>
      <div class="infoYLYN">
        <div class="titleClass">
          <h2 style="font-family: FontAwesome;font-size: 16px">医路有你</h2>
          <div>————基于NLP的医疗诊后评价与监管平台</div>
        </div>
        <div style="height: 30px;width: 40%;display: flex;margin: 0 auto">
          <div style="height: 30px;margin: auto;float: left;justify-content: center;align-items: center;padding: 5px">
            <img style="height: 13px;" src="../assets/个人.png" alt="暂无图片">
            <span style="font-family: FontAwesome;font-size: 14px;padding: 10px;margin-bottom: 20px">刘祖帆</span>
          </div>
          <div style="height: 30px;margin: auto;float: left;justify-content: center;align-items: center;padding: 5px">
            <img style="height: 13px;" src="../assets/个人.png" alt="暂无图片">
            <span style="font-family: FontAwesome;font-size: 14px;padding: 10px;margin-bottom: 20px">许珮瑶</span>
          </div>
          <div style="height: 30px;margin: auto;float: left;justify-content: center;align-items: center;padding: 5px">
            <img style="height: 13px;" src="../assets/个人.png" alt="暂无图片">
            <span style="font-family: FontAwesome;font-size: 14px;padding: 10px;margin-bottom: 20px">陈嘉豪</span>
          </div>
        </div>
        <div class="titleClass">
          <div>上海财经大学</div>
          <div>2023中国大学生计算机设计大赛</div>
        </div>
        <!--        <div class="demo-collapse">-->
        <!--          <el-collapse style="background-color: #00b386">-->
        <!--            <el-collapse-item title="建设目标" name="1">-->
        <!--              <p>-->
        <!--                <b>患者：</b>打通投诉渠道，完善诊后服务；情绪疏解，减少网络情绪发泄和负面舆情发酵-->
        <!--              </p>-->
        <!--              <p>-->
        <!--                <b>医院：</b>投诉处理透明化、可追溯；舆情监控便捷化、实时性；患者满意度调查智能化、高效化-->
        <!--              </p>-->
        <!--              <p>-->
        <!--                <b>政府机构：</b>丰富医院绩效考核体系；监督医院投诉处理规范性-->
        <!--              </p>-->
        <!--            </el-collapse-item>-->
        <!--            <el-collapse-item title="项目设计" name="2">-->
        <!--              <div style="height: 200px">-->
        <!--                <img style="height: 100%;width: 50%" src="../assets/项目设计_医院端.png">-->
        <!--                <img style="height: 100%;width: 50%" src="../assets/项目设计_患者端.png">-->
        <!--              </div>-->
        <!--            </el-collapse-item>-->
        <!--            <el-collapse-item title="项目架构" name="3">-->
        <!--              <div style="height: 200px">-->
        <!--                <img style="height: 200px" src="../assets/项目架构.png">-->
        <!--              </div>-->
        <!--            </el-collapse-item>-->
        <!--            <el-collapse-item title="关键模型" name="4">-->
        <!--              <div>-->
        <!--                基于BERT的情感强度回归模型-->
        <!--              </div>-->
        <!--              <div>-->
        <!--                基于通用信息抽取模型UIE的情感分析方案-->
        <!--              </div>-->
        <!--            </el-collapse-item>-->
        <!--          </el-collapse>-->
        <!--        </div>-->


      </div>
    </el-col>
  </el-row>
</template>

<script>
import axios from "axios";


export default {
  name: "hospitalView",
  data() {
    return {
      access_token: "",
      hospital: [],

      currentIndex: 0,//当前所在图片下标
      timer: null,//定时轮询
      imgArr: [
        {
          id: 0,
          url: require("../assets/长海医院轮播图1.jpeg"),
        }, {
          id: 1,
          url: require("../assets/长海医院轮播图2.jpeg"),
        }, {
          id: 2,
          url: require("../assets/长海医院轮播图3.png"),
        }, {
          id: 3,
          url: require("../assets/长海医院轮播图4.jpg"),
        },
        {
          id: 4,
          url: require("../assets/长海医院轮播图5.jpg"),
        },
      ],
    }
  },
  computed: {
    hospitalID() {
      return this.$store.state.hospitalID;
    }
  },
  created() {
    var that = this
    console.log('that.hospitalID', that.hospitalID)
    axios.get('/api/cgi-bin/token?grant_type=client_credential&appid=wx608d64d0acc25f28&secret=feb0adc1b0822221b6cbd6b29d889698')
        .then(function (response) {
          console.log(response.data.access_token);
          that.access_token = response.data.access_token
          axios.post('/api/tcb/databasequery?access_token=' + that.access_token, {
                "env": "cloud-2023-jisai-7ft7ahc87f5c949",
                "query": "db.collection(\"hospital\").doc('" + that.hospitalID + "').get()"
              }
          )
              .then(function (response) {
                console.log("hospital1", response.data.data);
                for (let k in response.data.data) {
                  that.hospital.push(JSON.parse(response.data.data[k]))
                }
              })
              .catch(function (error) {
                console.log("hospital2", error);
              });
        })
        .catch(function (error) {
          console.log(error);
        });
  },
  methods: {
    //开启定时器
    startInterval() {
      // 事件里定时器应该先清除在设置，防止多次点击直接生成多个定时器
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.currentIndex++;
        if (this.currentIndex > this.imgArr.length - 1) {
          this.currentIndex = 0
        }
      }, 3000)
    },
    // 点击左右箭头
    clickIcon(val) {
      if (val === 'down') {
        this.currentIndex++;
        if (this.currentIndex === this.imgArr.length) {
          this.currentIndex = 0;
        }
      } else {
        if (this.currentIndex === 0) {
          this.currentIndex = this.imgArr.length;
        }
        this.currentIndex--;
      }
    },
    // 点击控制圆点
    changeImg(index) {
      this.currentIndex = index
    },
    //鼠标移入移出控制
    changeInterval(val) {
      if (val) {
        clearInterval(this.timer)
      } else {
        this.startInterval()
      }
    }
  },
  //进入页面后启动定时轮询
  mounted() {
    this.startInterval()
  }
}
</script>


<style scoped>
* {
  padding: 0;
  margin: 0;
}

.footer_box {
  color: #5d5d5d;
  background-image: url("@/assets/bg_hospital5.jpg");
  backdrop-filter: blur(5px);
  background-size: 100% 100%;
  margin-right: 60px;
  bottom: 0;
  overflow: hidden
}

hr {
  width: 100%;
  margin: 10px auto;
  height: 1px;
  background-image: linear-gradient(
      to right,
      rgba(255, 255, 255, 0),
      #5d5d5d,
rgba(0, 0, 0, 0));
}

.infoYLYN {
  padding: 10px;
  width: 90%;
  margin: auto;
  font-family: FontAwesome;
}

.titleClass div {
  margin: 5px auto;
  font-family: FontAwesome;
  font-size: 12px;
}

.demo-collapse {
  width: 80%;
  margin: auto;
}

footer {
  background-color: rgba(12, 168, 138, 0.8);
}

.infoCH {
  width: 90%;
  margin: auto;
  padding: 10px;
  font-family: FontAwesome;
  font-size: 12px;
}

.infoCH div {
  margin: 5px;
  font-family: FontAwesome;
  height: 40px;
}

.titleClass {
  height: 60px;
  margin: 5px;
}


.header {
  display: flex;
  /*padding: 5px 5px;*/
  margin: 5px 0;
  justify-content: flex-start;
  flex-grow: 0;
}

.logo {
  float: left;
  /*height: 80px;*/
  width: 100px;
}

.cooperation {
  float: left;
  /*height: 80px;*/
  width: 30px;
  margin: auto 5px;
}

.logoCH {
  margin: auto 5px;
  float: left;
  background-color: rgb(2, 65, 125);
  height: 50px;
  padding: 2px 5px;
  /*width: 100px;*/
}

.logoCH img {
  width: 100%;
  height: 100%;
}

.cooperation img {
  width: 100%;
  height: 100%;
}

.logo img {
  width: 100%;
  height: 100%;
}

li {
  list-style-type: none;
}

.showImg {
  position: relative;
  width: 100%;
  height: 80vh;
  margin: 50px auto;
  overflow: hidden;
}

/* 轮播图片 */
.showImg img {
  width: 100%;
  height: 100%;
}

/* 箭头图标 */
.iconDiv {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 15px;
  height: 15px;
  border: 1px solid #666;
  border-radius: 15px;
  background-color: rgba(125, 125, 125, .2);
  line-height: 10px;
  text-align: center;
  font-size: 25px;
  cursor: pointer;
}

.iconDiv:hover {
  background-color: rgba(255, 255, 255, 0.5);
}

.icon-left {
  left: 10px;
}

.icon-right {
  right: 10px;
}

/* 控制圆点 */
.banner-circle {
  position: absolute;
  bottom: 10px;
  width: 100%;
  height: 10px;
}

.banner-circle ul {
  margin: 0 50px;
  height: 100%;
  text-align: right;
}

.banner-circle ul li {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin: 0 5px;
  border-radius: 7px;
  background-color: rgba(229, 229, 229, 0.8);
  cursor: pointer;
}

.active {
  background-color: #666 !important;
}


.section_inner {
  margin: auto;
  padding: 0 15px;
  height: 100%;
  width: 60%;
  z-index: 1;
  background-image: radial-gradient(rgba(32, 201, 151, 0.5), #ffffff);
  border: 1px solid #f8f9fa;
  text-align: center;
  align-items: center;
}

.profile__cover {
  margin: 25px auto;
  width: 200px;
  height: 200px;
  border-radius: 0;
}

.profile__cover img {
  margin: auto;
  width: 100%;
  height: 100%;
  border-radius: 0;
}

.profile__tit {
  margin: 15px 5px;
  background: rgba(12, 168, 138, 0.5);
  font-size: 0;
}

.profile__tit:hover {
  margin: 15px 5px;
  background: rgba(12, 168, 138, 0.8);
  font-size: 0;
}

.profile__name {
  font-size: 30px;
  font-weight: 400;
  line-height: 64px;
}

.bottom-box {
  width: 90.2vw;
  position: absolute;
  bottom: 0;
  height: 30vh;
  left: 9.8vw;
  background-image: linear-gradient(#cce1e5, #ffffff);

}

.item_box {
  position: absolute;
  left: 5vw;
  bottom: 6vh;
  height: 90px;
  width: 90px;
  border: 1px solid #1d2124;
  background: rgba(166, 240, 252, 0.6);
  border-radius: 5%;
  box-shadow: 20px 20px 60px #e1efe9;
  color: rgb(155, 159, 154);
}

</style>