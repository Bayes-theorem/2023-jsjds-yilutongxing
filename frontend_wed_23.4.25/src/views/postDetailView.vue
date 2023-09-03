<template>
  <div class="post" >
      <div style="position:relative">
        <img :src="post.user_profile" style="width:2.4vw;border-radius: 50%;float:left;margin:3.6vh 0 0 2.3vw">
        <div style="position:absolute;left:5.3vw;top:5.34vh;font-size:2.6vh">{{post.user_name}}</div>
        <div style="">
          <div style="color:#e74c3c;position:absolute;right:2.75vw;top:5.05vh;font-size:2.45vh">情感得分：{{post.score}}</div>
        </div>
      </div>
      <div style="float: left;font-size:2.3vh;margin:1.73vh 2.3vw 0px 2.3vw;text-indent: 2em;text-align: left">{{post.detail}}</div>
      <div style="float:left;font-size:2.16vh;color:#08758c;margin:1.3vh 0 0 0vw;position: relative;left:2.3vw">{{post.date}}</div>
      <div style="position:relative;margin:1.5vh 2.7vw 0 0;">
        <i class="iconfont icon-dianzan" style="float: left;font-size: 2.74vh;position:relative;left:28vw;color:#e7693c;top:0.6vh"></i>
        <div style="font-size: 2.02vh;float: left;position:relative;left:28.3vw;top:1.2vh">{{post.agree}}</div>
        <i class="iconfont icon-pinglun" style="float: left;font-size: 2.6vh;position:relative;left:29.6vw;color:#00b386;top:0.9vh"></i>
        <div style="font-size: 2vh;float: left;position:relative;left:29.8vw;top:1.2vh">{{post.comment}}</div>
      </div>


    <div class="comments">
      <el-scrollbar height="55vh">
      <div v-for="item in allComment" :key="item._id" class="comment">
        <div style="position:relative">
          <img :src="item.user_profile" style="width:1.75vw;border-radius: 50%;">
          <div style="position:absolute;left:2.35vw;bottom:0.8vh;font-size: 1.87vh">{{item.user_name}}</div>
          <div style="position:absolute;right:2.35vw;bottom:1.15vh;font-size: 1.87vh">情感得分：{{item.score}}</div>
        </div>
        <div style="font-size: 2.02vh;text-align: left;margin:0.57vh 0px 0px 1.35vw;text-indent: 2em;width:35vw">{{item.content}}</div>
        <div style="padding:1.59vh 0px 0.43vh 3.3vw;float:left; border-bottom: 0.14vh #f6f6f6 solid;font-size:1.73vh;color:#767676">{{item.date}}</div>
      </div>
      </el-scrollbar>
    </div>
  </div>

<div class="charts1">
  <div style="border-bottom: 0.29vh solid #E6E9ED;color:#7aa7b0;font-size:3.03vh;text-align: left;margin:2.16vh 0 0 0;padding-left: 1.4vw;padding-bottom: 1.44vh">热度变化</div>
  <div class="echart" id="myChart1" style="position:absolute;top:8.67vh;float:left;width:25vw;height:29vh;margin:1.44vh 0 1.44vh 1.35vw"></div>
</div>
  <div class="charts2">
    <div style="border-bottom: 0.29vh solid #E6E9ED;color:#51a18f;font-size:3.03vh;text-align: left;margin:2.16vh 0 0 0;padding-left: 1.4vw;padding-bottom: 1.44vh">评论情感变化</div>
    <div class="echart" id="myChart2" style="position:absolute;top:8.67vh;float:left;width:25vw;height:29vh;margin:1.44vh 0 1.2vh 1.35vw"></div>
  </div>
  <div class="charts3">
    <div style="border-bottom: 0.29vh solid #E6E9ED;color:#ed7669;font-size:3.03vh;text-align: left;margin:2.16vh 0 0 0;padding-left: 1.4vw;padding-bottom: 1.44vh">评论情感占比</div>
    <div class="echart" id="myChart3" style="position:absolute;top:8.67vh;float:left;width:25vw;height:29vh;margin:1.44vh 0px 1vh 1.35vw"></div>
  </div>
  <div class="shuXing">
    <el-col :span="25" style="margin:2.89vh 1.35vw 0 1.8vw">
      <div class="grid-content ep-bg-purple-light" style="align-items: center"/>
      <el-table :data="keyWordArray" style="width: 100%">
        <el-table-column prop="weidu" label="评价维度" width="155"/>
        <el-table-column prop="guandian" label="观点词" width="155"/>
        <el-table-column prop="emotion" label="情感倾向" width="155">
        <template #default="scope">
          <div style="display: flex">
            <el-tag
                :type="scope.row.emotion === '负向' ? '' : 'success'"
                disable-transitions
            >{{ scope.row.emotion }}
            </el-tag>
          </div>
        </template>
        </el-table-column>
      </el-table>
    </el-col>
  </div>
</template>

<script>
import axios from "axios";
import * as echarts from "echarts";
export default {
  name: "postDetailView",
  data(){
    return{
      postId:this.$route.params.postId,
      post:{},
      allComment:[],
      myChart1: {},
      myChart2: {},
      myChart3: {},
      reDuChange:{},
      senChange:{},
      x:[],
      reDuY:[],
      senY:[],
      negComNum:0,
      posComNum:0,
      neuComNum:0,
      keyWordArray: new Array()
        // {keyWord: "药品", emotion: "negative", num: 40, index: 0.4},
        // {keyWord: "流程", emotion: "positive", num: 30, index: 0.3},
        // {keyWord: "环境", emotion: "negative", num: 20, index: 0.2},
        // {keyWord: "服务", emotion: "positive", num: 10, index: 0.1}
    }
  },
  created() {
    var that=this
    //为给定 ID 的 user 创建请求
    axios.get('/api/cgi-bin/token?grant_type=client_credential&appid=wx608d64d0acc25f28&secret=feb0adc1b0822221b6cbd6b29d889698')
        .then(function (response) {
          console.log(response.data.access_token);
          that.access_token=response.data.access_token

          axios.post('/api/tcb/databasequery?access_token='+that.access_token,{
                "env": "cloud-2023-jisai-7ft7ahc87f5c949",
                "query": "db.collection(\"post\").where({_id:\""+ that.postId +"\"}).limit(500).get()"
              }
          )
              .then(function (response) {
                console.log(that.postId)
                console.log("post1",response.data.data);
                for(var k in response.data.data){
                  if(JSON.parse(response.data.data[k])['_id']==that.postId){
                    console.log(JSON.parse(response.data.data[k]))
                    that.post=JSON.parse(response.data.data[k])
                    that.post['score']=that.post['score'].toFixed(2)
                    break
                  }
                }
                console.log(JSON.parse(that.post['shuxing']))
                that.keyWordArray=new Array()
                console.log("1",that.keyWordArray)
                var allweidu=[]
                var index=0
                for(k in JSON.parse(that.post['shuxing'])['评价维度']){
                  var item=JSON.parse(that.post['shuxing'])['评价维度'][k]
                  var weidu=item['text']
                  if(allweidu.indexOf(weidu)==-1){
                    allweidu.push(weidu)
                    for(var j in item['relations']['观点词']){
                      var row={}
                      var guandian=item['relations']['观点词'][j]['text']
                      var emotion=item['relations']['情感倾向[正向,负向]'][0]['text']
                      row['weidu']=weidu
                      row['guandian']=guandian
                      row['emotion']=emotion
                      that.keyWordArray[index]=row
                      console.log(row)
                      console.log("2",that.keyWordArray[index])
                      index=index+1
                    }
                  }
                }
                console.log(that.keyWordArray)
              })
              .catch(function (error) {
                console.log("post2",error);
              });
          axios.post('/api/tcb/databasequery?access_token='+that.access_token,{
                "env": "cloud-2023-jisai-7ft7ahc87f5c949",
                "query": "db.collection(\"comment\").limit(500).get()"
              }
          )
              .then(function (response) {
                console.log(that.postId)
                console.log("comment1",response.data.data);
                for(var k in response.data.data){
                  if(JSON.parse(response.data.data[k])['post_id']==that.postId){
                    that.allComment.push(JSON.parse(response.data.data[k]))
                    if(JSON.parse(response.data.data[k])['date'] in that.reDuChange){
                      that.reDuChange[JSON.parse(response.data.data[k])['date']]=that.reDuChange[JSON.parse(response.data.data[k])['date']]+1
                    }
                    else{
                      that.reDuChange[JSON.parse(response.data.data[k])['date']]=1
                    }
                    if(JSON.parse(response.data.data[k])['date'] in that.senChange){
                      that.senChange[JSON.parse(response.data.data[k])['date']]=that.senChange[JSON.parse(response.data.data[k])['date']]+JSON.parse(response.data.data[k])['score']
                    }
                    else{
                      that.senChange[JSON.parse(response.data.data[k])['date']]=JSON.parse(response.data.data[k])['score']
                    }
                  }
                }
                for(k in that.reDuChange){
                  that.reDuY.push(that.reDuChange[k])
                  that.x.push(k)
                }
                for(k in that.senChange){
                  that.senY.push(that.senChange[k]/that.reDuChange[k])
                }
                for(k in that.allComment){
                  if(that.allComment[k]['score']>0.6){
                    that.posComNum=that.posComNum+1
                  }
                  if(that.allComment[k]['score']<0.4){
                    that.negComNum=that.negComNum+1
                  }
                  if(that.allComment[k]['score']>=0.4 && that.allComment[k]['score']<=0.6){
                    that.neuComNum=that.neuComNum+1
                  }
                }
              })
              .catch(function (error) {
                console.log("comment2",error);
              });
        })
        .catch(function (error) {
          console.log(error);
        });
    setTimeout(() => {
    this.initEcharts1();
    this.initEcharts2();
    this.initPieEcharts();
    }, 1000) // 2秒后执行代码
  },
  //设置页面背景颜色
  mounted() {
    document.querySelector('body').setAttribute('style', 'background-color:#f7f7f7')
  },
  beforeUnmount() {
    document.querySelector('body').removeAttribute('style')
  },
  methods:{
    initEcharts1() {
      console.log("画图")
      const option = {
        xAxis: {
          data: this.x
        },
        yAxis: {},
        series: [
          {
            name: "所有帖数量",
            data: this.reDuY,
            type: "line",// 类型设置为折线图
            // smooth: true,
            itemStyle: {
              color: '#7aa7b0'
            },
            areaStyle: { // 区域填充样式
              color: { // 填充的颜色 // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#9abcc3', // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#9abcc3' // 100% 处的颜色
                  }
                ],
                global: false, // 缺省为 false
              }
            },
          },

        ],
        grid: {
          left: '3%', //默认10%
          right: '4%', //默认10%
          bottom: '3%', //默认60
          top: "10%",
          containLabel: true
          //grid区域是否包含坐标轴的刻度标签
        },
      };

      this.myChart1 = echarts.init(document.getElementById("myChart1"));
      console.log(option)
      this.myChart1.setOption(option);
    },
    initEcharts2() {
      console.log("画图")
      const option = {
        xAxis: {
          data: this.x
        },
        yAxis: {},
        series: [
          {
            name:"敏感帖数量",
            data: this.senY,
            type: "line" ,// 类型设置为折线图
            smooth: true,
            itemStyle: {
              color: '#81d7c5'
            },
            areaStyle: { // 区域填充样式
              color: { // 填充的颜色 // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#a8e3d7', // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#a8e3d7' // 100% 处的颜色
                  }
                ],
                global: false, // 缺省为 false
              }
            },
          }
        ],
        grid: {
          left: '3%', //默认10%
          right: '4%', //默认10%
          bottom: '3%', //默认60
          top: "10%",
          containLabel: true
          //grid区域是否包含坐标轴的刻度标签
        },
      };

      this.myChart2 = echarts.init(document.getElementById("myChart2"));
      console.log(option)
      this.myChart2.setOption(option);

    },
    initPieEcharts() {
      const pieOptions = {
        center: ['10%', '50%'],
        legend: {
          top: "5%",
          left:"0%",
          orient: "vertical",
          textStyle: {color: "#343a40",fontSize: 11},
          itemWidth: 18,//图例颜色块的宽度和高度
          itemHeight: 11,
        },
        series: {
          center: ['50%', '46%'],
          type: "pie",
          //radius: [50, 100],
          //center: [280, 140],
          left: "right",
          width: "100%",
          height: "100%",
          label: {
            alignTo: "none",
            rich: {
              time: {
                fontSize: 15,
                color: "#343a40"
              }
            }
          },
          labelLine: {
            lineStyle: {
              color: "#0a6880"
            },
            smooth: 0.2,
            normal: {
              legend: 30
            }
          },
          data: [
            {
              name: "正面", value: this.posComNum, itemStyle: {
                color: "rgba(137,208,102,0.6)",
                opacity: 1
              }
            },
            {
              name: "负面", value: this.negComNum, itemStyle: {
                color: "rgba(245,108,108,0.6)",
                opacity: 1
              }
            },
            {
              name: "中性", value: this.neuComNum, itemStyle: {
                color: "rgba(64,158,255,0.6)",
                opacity: 1
              }
            }
          ],
          selectedMode: "multiple",
          selectedOffSet: 30
        },
        grid: {
          left: '0%', //默认10%
          right: '4%', //默认10%
          bottom: '4%', //默认60
          top: "10%",
          containLabel: true
          //grid区域是否包含坐标轴的刻度标签
        },
      }
      this.myChart3 = echarts.init(document.getElementById("myChart3"))
      this.myChart3.setOption(pieOptions)
      window.addEventListener("resize", () => {
        this.myChart3.resize()
      })
      this.myChart3.on('click', function (param) {
        console.log(param)
      })
    },
  },
}
</script>

<style scoped>

.post{
  background-color: white;
  width:41.3vw;
  padding:2vh 0 0vh 0.8vw;
  height:97.7vh;
}
.comments{
  float: left;
  text-align: left;
  position: relative;
  margin-top: 5vh;
  margin-left: 2.35vw;
  width:37.6vw
}
.comment{
  padding:0 0 5.2vh 0;
  height:100%;
  position:relative;
}
.charts1{
  background-color: white;
  position: absolute;
  top:5.5vh;
  width:27.6vw;
  left:43vw;
  bottom:52vh;
  border: 0.14vh solid #e2e2e2;
}
.charts2{
  background-color: white;
  position: absolute;
  top:5.5vh;
  right:0.8vw;
  width:27.6vw;
  bottom:52vh;
  border: 0.14vh solid #e2e2e2;
}
.charts3{
  background-color: white;
  position: absolute;
  top:51vh;
  width:23vw;
  left:43vw;
  bottom:5.78vh;
  border: 0.14vh solid #e2e2e2;
}
.shuXing{
  background-color: white;
  position: absolute;
  top:51vh;
  right:0.8vw;
  left:66.9vw;
  bottom:5.78vh;
  border: 0.14vh solid #e2e2e2;
}
</style>