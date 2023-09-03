<template>
  <div style="left:11vw;top:2.89vh;bottom:2.89vh;width:46vw;background-color: white;position: absolute">
  <el-scrollbar height="93vh">
    <div v-for="(item,index) in announcements" :key="item._id" style="margin:2.89vh 1.3vw 0px 1.3vw">
      <div style="border-bottom: 1px solid #E6E9ED;height:3.47vh;">
        <div style="float:left;text-align: left;margin:0px 0px 0px 0.65vw;font-size:2.3vh;color:#08758c">{{item.date}}</div>
        <div style="float:right;text-align: right;margin:0px 0.975vw 0px 1.3vw;font-size:1.88vh;color:#08758c">赞 {{item.agree}} 踩 {{item.disagree}}</div>
      </div>
      <div>
        <i class="iconfont icon-gonggao" style="font-size: 3.18vh;color:#3bb689;top: 0.87vh;position: relative"></i>
        <div style="margin: 1.17vh 0px 0.72vh 0;text-align: center;font-size: 2.45vh">{{item.title}}</div>
      </div>
      <div style="text-align: left;margin: 2.6vh 0px 0px 1.3vw;font-size: 2.17vh;color:#5c5c5c">问题描述：{{item.problem}}</div>
      <div style="text-align: left;margin: 1.4vh 0px 0px 1.3vw;font-size: 2.17vh;color:#5c5c5c">解决措施：{{item.measures}}</div>
      <button @click = "zhanKai(index)" v-if="ifZhanKai[index]==0" style="float: right;background-color: white;border-style:none;color: #0ca88a;margin:0 20px 0px 0;font-size: 13px;cursor: pointer;">>> 展开反馈</button>
      <div v-else style="margin-top: 1.4vh;border-top: 1px solid #E6E9ED;padding-top:1.4vh">
        <div v-for="item2 in disagreeReason" :key="item2._id">
          <el-row v-if="item2.announcement_id==item._id" >
            <el-col :span=3>
              <div style="float: left;position: relative;left:1.3vw;font-size:1.88vh;color:#5c5c5c;margin-top: 0.29vh">{{item2.date}}</div>
            </el-col>
            <el-col :span=21>
              <div style="float: left;position: relative;font-size:2.02vh;color:#5c5c5c">{{item2.disagreereason}}</div>
            </el-col>
          </el-row>
        </div>
        <button @click = "shouQi(index)" style="float: right;background-color: white;border-style:none;color: #0ca88a;margin:0 1.3vw 0px 0;font-size: 1.88vh;cursor: pointer;">>> 收起反馈</button>
      </div>
      <br>
    </div>
  </el-scrollbar>
  </div>

  <div style="position: absolute;top:2.89vh;width:41.5vw;right:1.5vw;bottom:2.89vh;background-color: white;border-left:1px solid rgba(230,234,237,0.78)">
    <div style="margin:4.33vh 1.3vw 0 1.3vw;padding-bottom:2.17vh;text-align: center;font-size:3.18vh;color:#3ba690;border-bottom: 1px solid #E6E9ED;">发布新公示</div>
    <div style="float: left;margin:3vh 0 2.17vh 1.5vw ">请输入公示标题（如关于XXX问题的处理公示）：</div>
    <div style="margin:0 1.5vw 0 1.5vw"><el-input v-model="title" placeholder="Please input" :rows="1" type="textarea" style="position: relative"/></div>
    <div style="float: left;margin:3.61vh 0 2.17vh 1.5vw ">请描述存在的问题：</div>
    <div style="margin:0 1.5vw 0 1.5vw"><el-input
        v-model="problem"
        :rows="2"
        type="textarea"
        placeholder="Please input"
    /></div>
    <div style="float: left;margin:3.61vh 0 2.17vh 1.5vw ">请描述处理方式和结果：</div>
    <div style="margin:0 1.5vw 0 1.5vw"><el-input
        v-model="measures"
        :rows="3"
        type="textarea"
        placeholder="Please input"
    /></div>
    <el-button type="primary" @click="faBu()" style="margin-top: 6vh">确认发布</el-button>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from "axios";

export default {
  name: "announcementView",
  data() {
    return {
      announcements: [],
      ifZhanKai: [],
      disagreeReason: [],
      title: ref(''),
      problem: ref(''),
      measures: ref('')
    }
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
                "query": "db.collection(\"announcement\").limit(500).get()"
              }
          )
              //计算yData1、yData2
              .then(function (response) {
                console.log("announcement1", response.data.data);
                for (var k in response.data.data) {
                  that.announcements.push(JSON.parse(response.data.data[k]))
                  that.ifZhanKai.push(0)
                }
                console.log(that.ifZhanKai)
              })
              .catch(function (error) {
                console.log("announcement2", error);
              });

          axios.post('/api/tcb/databasequery?access_token=' + that.access_token, {
                "env": "cloud-2023-jisai-7ft7ahc87f5c949",
                "query": "db.collection(\"disagreereason\").limit(500).get()"
              }
          )
              //计算yData1、yData2
              .then(function (response) {
                console.log("disagreereason1", response.data.data);
                for (var k in response.data.data) {
                  that.disagreeReason.push(JSON.parse(response.data.data[k]))
                }
              })
              .catch(function (error) {
                console.log("disagreereason2", error);
              });

        })
        .catch(function (error) {
          console.log(error);
        });
  },
  //设置页面背景颜色
  mounted() {
    document.querySelector('body').setAttribute('style', 'background-color:#f7f7f7')
  },
  beforeUnmount() {
    document.querySelector('body').removeAttribute('style')
  },
  methods: {
    zhanKai(index) {
      this.ifZhanKai[index] = 1
    },
    shouQi(index) {
      this.ifZhanKai[index] = 0
    },
    faBu() {
      console.log("fabu")
      var that = this
      //为给定 ID 的 user 创建请求
      axios.get('/api/cgi-bin/token?grant_type=client_credential&appid=wx608d64d0acc25f28&secret=feb0adc1b0822221b6cbd6b29d889698')
          .then(function (response) {
            console.log(response.data.access_token);
            that.access_token = response.data.access_token

            axios.post('/api/tcb/invokecloudfunction?access_token=' + that.access_token +'&env=cloud-2023-jisai-7ft7ahc87f5c949'+'&name=newAnnouncement',{
                  title:that.title,
                  problem:that.problem,
                  measures:that.measures
                }
            )
                .then(function (response) {
                  console.log("fabu", response);
                  that.title=""
                  that.problem=""
                  that.measures=""
                  that.$forceUpdate()
                  window.location.reload()
                })
                .catch(function (error) {
                  console.log("post2", error);
                });

          })
          .catch(function (error) {
            console.log(error);
          });

    }
  }
}

</script>

<style scoped>

</style>