<template>
  <div style="position: absolute;top:1.9vh;left:10.1vw;bottom:1.9vh;right:0.8vw;">
    <el-scrollbar height="95vh">
      <el-row v-for="(item) in complains" :key="item._id" style="margin:1.44vh 0.9vw 1.44vh 1.3vw;padding:2.5vh 0vw 1.8vh 0.85vw;background-color: white;">
        <el-col :span="1">
          <i class="iconfont icon-send-sms" style="font-size: 3.55vh;margin-right:0.8vw;position:relative;top:0.35vh;color: #35ab7f;"></i>
        </el-col>
        <el-col :span="16" style="text-align: left;border-right:2px solid #E6E9ED;" >
          <div style="margin:0 0 0.72vh 0">投诉日期：{{item.date}}</div>
          <div style="margin:0 0 0.72vh 0">投诉人：{{item.name}}</div>
          <div style="margin:0 0 0.72vh 0">问题：{{item.problem}}</div>
          <div style="margin:0 0 0.72vh 0">预期解决方式：{{item.hope}}</div>
          <div style="margin:0 0 0.72vh 0">联系方式：{{item.phonenumber}}</div>
        </el-col>
<!--        <el-col :span="7" style="border-right:2px solid #E6E9ED;">-->
<!--            <el-steps  :active="item.jindu" finish-status="success" style="width:24vw;margin-top: 1.5vh" align-center>-->
<!--              <el-step title="" style="font-size: 1vh"/>-->
<!--              <el-step title="" style="font-size: 1vh;"/>-->
<!--              <el-step title="" />-->
<!--              <el-step title="" />-->
<!--              <el-step title="" />-->
<!--            </el-steps>-->
<!--          <div  style="position: absolute;left:45.7vw;top:8.5vh;text-align: left;writing-mode:tb-rl;letter-spacing: 0.2vh;font-size:2.1vh;color: v-bind()" >-->
<!--            待处理-->
<!--          </div>-->
<!--          <div  style="position: absolute;left:50.55vw;top:8.5vh;text-align: left;writing-mode:tb-rl;letter-spacing: 0.2vh;font-size:2.1vh">-->
<!--            联系投诉人-->
<!--          </div>-->
<!--          <div  style="position: absolute;left:54.9vw;top:8.5vh;text-align: left;writing-mode:tb-rl;letter-spacing: 0.2vh;font-size:2.1vh">-->
<!--            移交科室-->
<!--          </div>-->
<!--          <div  style="position: absolute;left:56.05vw;top:8.5vh;text-align: left;writing-mode:tb-rl;letter-spacing: 0.2vh;font-size:2.1vh">-->
<!--            负责人-->
<!--          </div>-->
<!--          <div  style="position: absolute;left:60.2vw;top:8.5vh;text-align: left;writing-mode:tb-rl;letter-spacing: 0.2vh;font-size:2.1vh">-->
<!--            投诉处理中-->
<!--          </div>-->
<!--          <div style="position: absolute;left:1.85vw;top:8.5vh;text-align: left;writing-mode:tb-rl;letter-spacing: 0.2vh;font-size:2.1vh">-->
<!--            投诉处理完成-->
<!--          </div>-->
<!--        </el-col>-->
        <el-col :span="7" >
          <el-steps  :active="item.jindu" finish-status="success" style="width:24vw;margin-top: 2vh" align-center>
            <el-step title="" style="font-size: 1vh"/>
            <el-step title="" style="font-size: 1vh;"/>
            <el-step title="" />
            <el-step title="" />
            <el-step title="" />
          </el-steps>
          <div v-if="item.jindu==0" style="position:relative;top:5vh;font-size: 2.74vh;color:#08758c;">处理进度：待处理</div>
          <div v-if="item.jindu==1" style="position:relative;top:5vh;font-size: 2.74vh;color:#08758c;">处理进度：联系投诉人</div>
          <div v-if="item.jindu==2" style="position:relative;top:5vh;font-size: 2.74vh;color:#08758c;">处理进度：移交投诉科室负责人</div>
          <div v-if="item.jindu==3" style="position:relative;top:5vh;font-size: 2.74vh;color:#08758c;">处理进度：投诉处理中</div>
          <div v-if="item.jindu==4" style="position:relative;top:5vh;font-size: 2.74vh;color:#08758c;">处理进度：投诉处理完成</div>
          <br><br><br><br>
          <div style="position: relative;bottom:1.4vh"><button @click = "xiangQing(item._id)" style="background-color: white;border-style:none;color: #0ca88a;font-size: 14px;cursor: pointer">>> 查看详情</button></div>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "complainView",
  data() {
    return {
      complains:[]
    }
  },
  //设置页面背景颜色
  mounted() {
    document.querySelector('body').setAttribute('style', 'background-color:#f7f7f7')
  },
  beforeUnmount() {
    document.querySelector('body').removeAttribute('style')
  },
  created() {
    var that = this
    //为给定 ID 的 user 创建请求
    axios.get('/api/cgi-bin/token?grant_type=client_credential&appid=wx608d64d0acc25f28&secret=feb0adc1b0822221b6cbd6b29d889698')
        .then(function (response) {
          console.log(response.data.access_token);
          that.access_token = response.data.access_token

          axios.post('/api/tcb/databasequery?access_token=' + that.access_token, {
                "env": "cloud-2023-jisai-7ft7ahc87f5c949",
                "query": "db.collection(\"complainbox\").limit(500).get()"
              }
          )
              //计算yData1、yData2
              .then(function (response) {
                console.log("complain1", response.data.data);
                for (var k in response.data.data) {
                  that.complains.push(JSON.parse(response.data.data[k]))
                }
              })
              .catch(function (error) {
                console.log("complain2", error);
              });
        })
        .catch(function (error) {
          console.log(error);
        });
  },
  methods:{
    xiangQing(_id){
      console.log(_id)
      this.$router.push({name: 'complainDetail', params: {complainId:_id}});
    }
  }
}
</script>

<style scoped>

</style>