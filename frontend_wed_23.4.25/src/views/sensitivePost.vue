<template>

    <div class="row">
      <div class="col_md_12">
        <div class="dashboard">
          <div class="dashboard_title">
            <div class="dashboard_title_text">
              敏感词监控
            </div>
          </div>
          <div class="dashboard_graph">
              <div class="echart" id="myChart1" :style="myChartStyle"></div>
          </div>
        </div>

<!--        <div class="choose">-->
<!--          <button v-if="this.time>=2019" class="anNiu1" @click="minus1" >-->
<!--            <i class="iconfont icon-jiantou_yemian_xiangzuo_o zuoJt" ></i>-->
<!--          </button>-->
<!--          <button v-if="this.time<2019" class="anNiu1-un" >-->
<!--            <i class="iconfont icon-jiantou_yemian_xiangzuo_o zuoJt" ></i>-->
<!--          </button>-->
<!--          <div class="time"> {{time}}年 </div>-->
<!--          <button v-if="this.time<2022" class="anNiu2" @click="add1">-->
<!--            <i class="iconfont icon-jiantou_yemian_xiangyou_o youJt" ></i>-->
<!--          </button>-->
<!--          <button v-if="this.time>=2022" class="anNiu2-un" >-->
<!--            <i class="iconfont icon-jiantou_yemian_xiangyou_o youJt" ></i>-->
<!--          </button>-->
<!--        </div>-->
        <div class="mb-2 flex items-center text-sm">
          <el-radio-group v-model="radio1" class="ml-4" >
            <el-radio label="0" size="large" style="position:absolute;float:left;left:44vw;margin:2.2vh 0 0 0" >近一年</el-radio>
            <el-radio label="1" size="large" style="position:absolute;float:left;left:49vw;margin:2.2vh 0 0 0">近一月</el-radio>
            <el-radio label="2" size="large" style="position:absolute;float:left;left:54vw;margin:2.2vh 0 0 0">近一周</el-radio>
          </el-radio-group>
        </div>
          <div style="font-size:2.6vh;position:absolute;float:left;left:64vw;top:12.5vh">总计</div>
            <div style="color:#e74c3c;position:absolute;text-align: center;font-size: 4vh;left:66.6vw;top:12.1vh;width:2vw">{{allsenNum}}</div>
          <div style="font-size:2.6vh;position:absolute;float:left;left:68.8vw;top:12.5vh">条敏感帖</div>

        <br>
        <div class="senWords">
          <div v-for="(item,index) in sensitiveWords1" :key="item" class="senWord">
              <div style="float:left;margin-top:0vh;margin-left: 1.5vw;width:4.7vw;text-align: left;font-size: 2vh;color:#73879c">{{ item }}</div>
              <div v-bind:style="{width: 16+ 'vw'}" class="progress">
                <div v-if="senNum[index]>0" v-bind:style="{width: senNum[index]/allsenNum*16+ 'vw'}" class="progressZuo" ></div>
                <div v-bind:style="{marginLeft: senNum[index]/allsenNum*16+0.28+ 'vw'}" style="position:relative;color:#73879c">{{senNum[index]}}</div>
              </div>

          </div>
        </div>

        <div class="senWords2">
          <div v-for="(item,index) in sensitiveWords2" :key="item" class="senWord">
            <div style="float:left;margin-top:0vh;width:4.7vw;text-align: left;font-size: 2vh;color:#73879c">{{ item }}</div>
            <div v-bind:style="{width: 16+ 'vw'}" class="progress">
              <div v-if="senNum[index+6]>0" v-bind:style="{width: senNum[index+6]/allsenNum*16+ 'vw'}" class="progressZuo" ></div>
              <div v-bind:style="{marginLeft: senNum[index+6]/allsenNum*16+0.28+ 'vw'}" style="position:relative;color:#73879c">{{senNum[index+6]}}</div>
            </div>

          </div>
      </div>
      </div>
  </div>

  <div class="senPosts">
    <el-scrollbar height="45.6vh">
    <div v-for="item in senPosts" :key="item" >
      <div class="senPost">
      <div style="float:left;text-align: left;margin:1.44vh 0vh 0.43vh 0vh;font-size:2vh;color:#08758c">{{item.date}}</div>
      <div style="float:right;text-align: right;margin:1.44vh 1vw 0.43vh 1.4vw;font-size:1.73vh;color:#08758c">赞 {{item.agree}} 评论 {{item.comment}}</div>
        <div class="senPost_text" >
          <Highlighter class="my-highlight"
                       HighlightStyle="{color:red}"
                       :searchWords="keywords"
                       :autoEscape="true"
                       :textToHighlight="item.detail"/>
        </div>
          <button @click = "routeToDetail(item._id)" class="xiangQing">>> 查看详情</button>
      </div>
    </div>
    </el-scrollbar>
  </div>

  <div class="sudPosts">
    <div style="color:#e74c3c;border-bottom:0.29vh solid #fdf3f2;font-size:3.32vh;text-align:left;padding:2.17vh 0 1.59vh 2.1vw">高热度极端事件监控</div>
    <el-scrollbar height="34.7vh">
    <div v-for="item in sort" :key="item" >
      <div class="senPost">
        <div style="float:left;text-align: left;margin:1.44vh 0vh 0.43vh 0vh;font-size:2vh;color:#08758c">{{item.date}}</div>
        <div style="float:left;margin:1.25vh 0.2vw 0.43vh 1vw;">
          <i class="iconfont icon-huore" style="color:#e74c3c;font-size:2.55vh "></i>
        </div>
        <div style="float:left;margin:1.55vh 0.2vw 0.43vh 0vh;font-size:2vh;color:#08758c;font-size:1.9vh;color:#e74c3c;">
          {{2*item.agree+5*item.comment}}
        </div>
        <div style="float:right;text-align: right;position:relative;margin:1.44vh 1vw 0.43vh 1vw;font-size:1.73vh;color:#08758c">赞 {{item.agree}} 评论 {{item.comment}}</div>

        <div class="senPost_text" >
          <Highlighter class="my-highlight"
                       HighlightStyle="{color:red}"
                       :searchWords="keywords"
                       :autoEscape="true"
                       :textToHighlight="item.detail"/>
        </div>
        <button @click = "routeToDetail(item._id)" class="xiangQing">>> 查看详情</button>
      </div>
    </div>
    </el-scrollbar>
  </div>

</template>

<script >
import * as echarts from "echarts";
import axios from "axios";
import Highlighter from 'vue-highlight-words'
import { ref } from 'vue'

export default {
  name: "sensitivePost",
  components: {
    Highlighter
  },
  setup(){
    const radio1 = ref("1")
    return{
      radio1,
    }
  },
  computed: {
    keywords() {
      return this.words.split(' ')
    },
    sort:function(){
      return this.sortSud(this.sudPosts);
    }
  },
  watch: {
    radio1() {
      var that=this
      var date=new Date()
      axios.get('/data/end_date')
          .then(function (response) {
            console.log("enddatesuc", response.data)
            date = new Date(response.data['end_date'])
          })
          .catch(function (error) {
            console.log("enddatefail",error)
          });

      //计算不同类别敏感帖的数量
      that.senNum=[0,0,0,0,0,0,0,0,0,0,0,0]
      that.senPosts=[]
      // var year = date.getFullYear();
      // var month = date.getMonth() + 1;
      // var day = date.getDate();
      if(that.radio1=="0") {
        for(var k in that.postList){
          var postDate=new Date(that.postList[k]['date']);
          if((postDate <= date) && (postDate >= new Date(date-365*1000*24*60*60))) {
            for (var index in that.sensitiveWords) {
              if (that.postList[k]['detail'].search(that.sensitiveWords[index]) != -1) {
                that.senNum[index] = that.senNum[index] + 1
                that.senPosts.push(that.postList[k])
                break
              }
            }
          }
        }
        that.sudPosts=[]
        for(k in that.postList){
          postDate=new Date(that.postList[k]['date']);
          if((postDate <= date) && (postDate >= new Date(date-365*1000*24*60*60))) {
            if ((that.postList[k]['agree'] * 2 + that.postList[k]['comment'] * 5 >= 30) && (that.postList[k]['score'] < 0.2)) {
              that.sudPosts.push(that.postList[k])
            }
          }
        }
        axios.get('/data/chart/sensitive/year')
            //计算yData1、yData2
            .then(function (response) {
              console.log("ydatasuc", JSON.parse(response.data.replace(/'/g, '"')))
              that.xData=JSON.parse(response.data.replace(/'/g, '"'))['date']
              that.yData2=JSON.parse(response.data.replace(/'/g, '"'))['sensitiveList']
              that.yData1=JSON.parse(response.data.replace(/'/g, '"'))['postNumList']
              console.log(that.yData2)
              for(k in that.yData1){
                that.yData1[k]=Math.log(that.yData1[k]+1)
              }
              for(k in that.yData2){
                that.yData2[k]=Math.log(that.yData2[k]+1)
              }
              that.initEcharts();
            })
            .catch(function (error) {
              console.log("ydata2fail",error)
            });
      }
      if(that.radio1=="1"){
        for(k in that.postList){
          postDate=new Date(that.postList[k]['date']);
          if((postDate <= date) && (postDate >= new Date(date-30*1000*24*60*60))){
            for(index in that.sensitiveWords){
              if(that.postList[k]['detail'].search(that.sensitiveWords[index]) != -1){
                console.log(postDate)
                that.senNum[index]=that.senNum[index]+1
                that.senPosts.push(that.postList[k])
                break
              }
            }
          }
        }
        that.sudPosts=[]
        for(k in that.postList){
          postDate=new Date(that.postList[k]['date']);
          if((postDate <= date) && (postDate >= new Date(date-30*1000*24*60*60))){
            if((that.postList[k]['agree']*2+that.postList[k]['comment']*5>=30) && (that.postList[k]['score']<0.2)){
              that.sudPosts.push(that.postList[k])
            }
          }
        }

        axios.get('/data/chart/sensitive/month')
            //计算yData1、yData2
            .then(function (response) {
              console.log("ydatasuc", JSON.parse(response.data.replace(/'/g, '"')))
              that.xData=JSON.parse(response.data.replace(/'/g, '"'))['date']
              that.yData2=JSON.parse(response.data.replace(/'/g, '"'))['sensitiveList']
              that.yData1=JSON.parse(response.data.replace(/'/g, '"'))['postNumList']
              console.log(that.yData2)
              for(k in that.yData1){
                that.yData1[k]=Math.log(that.yData1[k]+1)
              }
              for(k in that.yData2){
                that.yData2[k]=Math.log(that.yData2[k]+1)
              }
              that.initEcharts();
            })
            .catch(function (error) {
              console.log("ydata2fail",error)
            });
      }
      if(that.radio1=="2"){
        for(k in that.postList){
          postDate=new Date(that.postList[k]['date']);
          if((postDate <= date) && (postDate >= new Date(date-7*1000*24*60*60))){
            for(index in that.sensitiveWords){
              if(that.postList[k]['detail'].search(that.sensitiveWords[index]) != -1){
                that.senNum[index]=that.senNum[index]+1
                that.senPosts.push(that.postList[k])
                break
              }
            }
          }
        }
        that.sudPosts=[]
        for(k in that.postList){
          postDate=new Date(that.postList[k]['date']);
          if((postDate <= date) && (postDate >= new Date(date-7*1000*24*60*60))){
            if((that.postList[k]['agree']*2+that.postList[k]['comment']*5>=30) && (that.postList[k]['score']<0.2)){
              that.sudPosts.push(that.postList[k])
            }
          }
        }

        axios.get('/data/chart/sensitive/week')
            //计算yData1、yData2
            .then(function (response) {
              console.log("ydatasuc", JSON.parse(response.data.replace(/'/g, '"')))
              that.xData=JSON.parse(response.data.replace(/'/g, '"'))['date']
              that.yData2=JSON.parse(response.data.replace(/'/g, '"'))['sensitiveList']
              that.yData1=JSON.parse(response.data.replace(/'/g, '"'))['postNumList']
              console.log(that.yData2)
              for(k in that.yData1){
                that.yData1[k]=Math.log(that.yData1[k]+1)
              }
              for(k in that.yData2){
                that.yData2[k]=Math.log(that.yData2[k]+1)
              }
              that.initEcharts();
            })
            .catch(function (error) {
              console.log("ydata2fail",error)
            });
      }

      //计算敏感帖总数
      var sum=0
      for(k in that.senNum){
        sum=sum+that.senNum[k]
      }
      that.allsenNum=sum
    }
  },
  data(){
    return{
      myChart: {},
      xData: [], //横坐标
      yData1: [], //所有帖子
      yData2: [], //敏感帖
      myChartStyle: { float: "left", width: "34vw", height: "37.6vh"}, //图表样式
      postList:[],
      sensitiveWords1:["黑心","收红包","贿赂","乱收费","医疗事故","回扣"],
      sensitiveWords2:["关系户","利益","无良医生","失责","假药","隐私"],
      sensitiveWords:["黑心","收红包","贿赂","乱收费","医疗事故","回扣","关系户","利益","无良医生","失责","假药","隐私"],
      time:2018,
      senNum:[0,0,0,0,0,0,0,0,0,0,0,0],
      allsenNum:0,
      senPosts:[],
      words: "黑心 收红包 贿赂 乱收费 医疗事故 回扣 关系户 踢皮球 无良医生 失责 假药 隐私",
      sudPosts:[],
    }
  },
  created(){
    var that=this
    var date=new Date()
    axios.get('/data/end_date')
        .then(function (response) {
          console.log("enddatesuc", response.data)
          date = new Date(response.data['end_date'])
        })
        .catch(function (error) {
          console.log("enddatefail",error)
        });

    //为给定 ID 的 user 创建请求
    axios.get('/api/cgi-bin/token?grant_type=client_credential&appid=wx608d64d0acc25f28&secret=feb0adc1b0822221b6cbd6b29d889698')
        .then(function (response) {
          console.log(response.data.access_token);
          var access_token=response.data.access_token
          //获取帖子
          axios.post('/api/tcb/databasequery?access_token='+access_token,{
                "env": "cloud-2023-jisai-7ft7ahc87f5c949",
                "query": "db.collection(\"post\").limit(1000).get()"
              }
          ).then(function (response) {
            console.log("post1suc",response.data.data);
            for(var k in response.data.data){
              that.postList.push(JSON.parse(response.data.data[k]))
            }
            axios.post('/api/tcb/databasequery?access_token='+access_token,{
              "env": "cloud-2023-jisai-7ft7ahc87f5c949",
              "query": "db.collection(\"post\").skip(1000).limit(1000).get()"
            }).then(function (response) {
              console.log("post2suc", response.data)
              for(var k in response.data.data){
                that.postList.push(JSON.parse(response.data.data[k]))
              }

              //计算不同类别敏感帖的数量
              that.senNum=[0,0,0,0,0,0,0,0,0,0,0,0]
              that.senPosts=[]
              // var year = date.getFullYear();
              // var month = date.getMonth() + 1;
              // var day = date.getDate();
              if(that.radio1=="0") {
                for(k in that.postList){
                  var postDate=new Date(that.postList[k]['date']);
                  if((postDate <= date) && (postDate >= new Date(date-365*1000*24*60*60))){
                    for(var index in that.sensitiveWords){
                      if(that.postList[k]['detail'].search(that.sensitiveWords[index]) != -1){
                        that.senNum[index]=that.senNum[index]+1
                        that.senPosts.push(that.postList[k])
                        break
                      }
                    }
                  }
                }
                that.sudPosts=[]
                for(k in that.postList){
                  postDate=new Date(that.postList[k]['date']);
                  if((postDate <= date) && (postDate >= new Date(date-365*1000*24*60*60))) {
                    if ((that.postList[k]['agree'] * 2 + that.postList[k]['comment'] * 5 >= 30) && (that.postList[k]['score'] < 0.2)) {
                      that.sudPosts.push(that.postList[k])
                    }
                  }
                }
                axios.get('/data/chart/sensitive/year')
                    //计算yData1、yData2
                    .then(function (response) {
                      console.log("ydatasuc", JSON.parse(response.data.replace(/'/g, '"')))
                      that.xData=JSON.parse(response.data.replace(/'/g, '"'))['date']
                      that.yData2=JSON.parse(response.data.replace(/'/g, '"'))['sensitiveList']
                      that.yData1=JSON.parse(response.data.replace(/'/g, '"'))['postNumList']
                      console.log(that.yData2)
                      for(k in that.yData1){
                        that.yData1[k]=Math.log(that.yData1[k]+1)
                      }
                      for(k in that.yData2){
                        that.yData2[k]=Math.log(that.yData2[k]+1)
                      }
                      that.initEcharts();
                    })
                    .catch(function (error) {
                      console.log("ydata2fail",error)
                    });
              }
              if(that.radio1=="1"){
                for(k in that.postList){
                  postDate=new Date(that.postList[k]['date']);
                  if((postDate <= date) && (postDate >= new Date(date-30*1000*24*60*60))){
                    for(index in that.sensitiveWords){
                      if(that.postList[k]['detail'].search(that.sensitiveWords[index]) != -1){

                        that.senNum[index]=that.senNum[index]+1
                        that.senPosts.push(that.postList[k])
                        break
                      }
                    }
                  }
                }
                that.sudPosts=[]
                for(k in that.postList){
                  postDate=new Date(that.postList[k]['date']);
                  if((postDate <= date) && (postDate >= new Date(date-30*1000*24*60*60))){
                    if((that.postList[k]['agree']*2+that.postList[k]['comment']*5>=30) && (that.postList[k]['score']<0.2)){
                      that.sudPosts.push(that.postList[k])
                    }
                  }
                }

                axios.get('/data/chart/sensitive/month')
                    //计算yData1、yData2
                    .then(function (response) {
                      console.log("ydatasuc", JSON.parse(response.data.replace(/'/g, '"')))
                      that.xData=JSON.parse(response.data.replace(/'/g, '"'))['date']
                      that.yData2=JSON.parse(response.data.replace(/'/g, '"'))['sensitiveList']
                      that.yData1=JSON.parse(response.data.replace(/'/g, '"'))['postNumList']
                      console.log(that.yData2)
                      for(k in that.yData1){
                        that.yData1[k]=Math.log(that.yData1[k]+1)
                      }
                      for(k in that.yData2){
                        that.yData2[k]=Math.log(that.yData2[k]+1)
                      }
                      that.initEcharts();
                    })
                    .catch(function (error) {
                      console.log("ydata2fail",error)
                    });
                // axios.get('/data/post/sensitivePost')
                //     .then(function (response) {
                //
                //       for(k in response.data){
                //         response.data[k]['date']=new Date(response.data[k]['date'])
                //       }
                //       console.log(response.data)
                //     })
                //     .catch(function (error) {
                //       console.log("ydata2fail",error)
                //     });

              }
              if(that.radio1=="2"){
                for(k in that.postList){
                  postDate=new Date(that.postList[k]['date']);
                  if((postDate <= date) && (postDate >= new Date(date-7*1000*24*60*60))){
                    for(index in that.sensitiveWords){
                      if(that.postList[k]['detail'].search(that.sensitiveWords[index]) != -1){
                        that.senNum[index]=that.senNum[index]+1
                        that.senPosts.push(that.postList[k])
                        break
                      }
                    }
                  }
                }
                that.sudPosts=[]
                for(k in that.postList){
                  postDate=new Date(that.postList[k]['date']);
                  if((postDate <= date) && (postDate >= new Date(date-7*1000*24*60*60))){
                    if((that.postList[k]['agree']*2+that.postList[k]['comment']*5>=30) && (that.postList[k]['score']<0.2)){
                      that.sudPosts.push(that.postList[k])
                    }
                  }
                }

                axios.get('/data/chart/sensitive/week')
                    //计算yData1、yData2
                    .then(function (response) {
                      console.log("ydatasuc", JSON.parse(response.data.replace(/'/g, '"')))
                      that.xData=JSON.parse(response.data.replace(/'/g, '"'))['date']
                      that.yData2=JSON.parse(response.data.replace(/'/g, '"'))['sensitiveList']
                      that.yData1=JSON.parse(response.data.replace(/'/g, '"'))['postNumList']
                      console.log(that.yData2)
                      for(k in that.yData1){
                        that.yData1[k]=Math.log(that.yData1[k]+1)
                      }
                      for(k in that.yData2){
                        that.yData2[k]=Math.log(that.yData2[k]+1)
                      }
                      that.initEcharts();
                    })
                    .catch(function (error) {
                      console.log("ydata2fail",error)
                    });
              }

              //计算敏感帖总数
              var sum=0
              for(k in that.senNum){
                sum=sum+that.senNum[k]
              }
              that.allsenNum=sum

            }).catch(function (error) {
              console.log("post2fail",error)
            })

          }).catch(function (error) {
            console.log(error);
          });
        })
        .catch(function (error) {
          console.log("post1fail",error);
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
    routeToDetail(_id) {
      console.log(_id)
      this.$router.push({name: 'postDetailView', params: {postId: _id}});
    },
    sortSud(array) {
      return array.sort(function (a, b) {
        var x = a['agree'] * 2 + a['comment'] * 5;
        var y = b['agree'] * 2 + b['comment'] * 5;
        return x > y ? -1 : x < y ? 1 : 0;
      });
    },
    initEcharts() {
      console.log("画图")
      const option = {
        xAxis: {
          data: this.xData
        },
        yAxis: {},
        series: [
          {
            name:"log(所有帖数量+1)",
            data: this.yData1,
            type: "line" ,// 类型设置为折线图
            smooth: true,
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
          {
            name:"log(敏感帖数量+1)",
            data: this.yData2,
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
                    color: '#93efdd', // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#93efdd' // 100% 处的颜色
                  }
                ],
                global: false, // 缺省为 false
              }
            },
          }
        ],
        grid: {
          left: '4%', //默认10%
          right: '4%', //默认10%
          bottom: '4%', //默认60
          top: "10%",
          containLabel: true
          //grid区域是否包含坐标轴的刻度标签
        },
        legend:{
          show: true,
          icon: 'circle',
          itemWidth: 8,//图标宽
          itemHeight: 5,//图标高
          orient: 'vertical',
          left: '10%',
          top: '2.45%',
          textStyle: {
            fontSize: 11,
            color: '#666'
          },
          selectedMode: false, //取消图例上的点击事件
        },
      };

      this.myChart = echarts.init(document.getElementById("myChart1"));
      console.log(option)
      this.myChart.setOption(option);
      //
      // // 随着屏幕大小调节图表（不知道为什么图表会出一点问题，所以先删掉了）
      // window.addEventListener("resize", () => {
      //   this.myChart.resize();
      // });
    },
    // minus1(){
    //   this.time=this.time-1
    //   this.senNum=[0,0,0,0,0,0,0,0,0,0,0,0]
    //   this.senPosts=[]
    //   for(var k in this.postList){
    //     if(this.postList[k]['date'].slice(0,4) == this.time){
    //       for(var index in this.sensitiveWords){
    //         if(this.postList[k]['detail'].search(this.sensitiveWords[index]) != -1){
    //           this.senNum[index]=this.senNum[index]+1
    //           this.senPosts.push(this.postList[k])
    //           break
    //         }
    //       }
    //     }
    //   }
    //   var sum=0
    //   for(k in this.senNum){
    //     sum=sum+this.senNum[k]
    //   }
    //   this.allsenNum=sum
    //   console.log("sennum",this.senNum)
    //
    //   this.sudPosts=[]
    //   for(k in this.postList){
    //     if(this.postList[k]['date'].slice(0,4) == this.time){
    //       if(this.postList[k]['agree']*2+this.postList[k]['comment']*5>=40){
    //         this.sudPosts.push(this.postList[k])
    //       }
    //     }
    //   }
    // },
    // add1(){
    //   this.time=this.time+1
    //   this.senNum=[0,0,0,0,0,0,0,0,0,0,0,0]
    //   this.senPosts=[]
    //   for(var k in this.postList){
    //     if(this.postList[k]['date'].slice(0,4) == this.time){
    //       for(var index in this.sensitiveWords){
    //         if(this.postList[k]['detail'].search(this.sensitiveWords[index]) != -1){
    //           this.senNum[index]=this.senNum[index]+1
    //           this.senPosts.push(this.postList[k])
    //           break
    //         }
    //       }
    //     }
    //   }
    //   var sum=0
    //   for(k in this.senNum){
    //     sum=sum+this.senNum[k]
    //   }
    //   this.allsenNum=sum
    //
    //   this.sudPosts=[]
    //   for(k in this.postList){
    //     if(this.postList[k]['date'].slice(0,4) == this.time){
    //       if(this.postList[k]['agree']*2+this.postList[k]['comment']*5>=40){
    //         this.sudPosts.push(this.postList[k])
    //       }
    //     }
    //   }
    // },
  }

}
</script>

<style scoped>
.dashboard_graph{
  padding: 0;
  position: relative;
  float: left;
  max-width: 60%;
  box-sizing: border-box;
  height: 39.7vh;
}
.row{
  position:absolute;
  top:2.5vh;
  left:10.9vw;
  right:1.2vw;
  box-sizing: border-box;

}
.col_md_12{
  position: relative;
  min-height: 0.14vh;
  float: left;
  padding-right: 0vh;
  padding-left: 0vh;
  flex: 0 0 100%;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
}
.dashboard{
  padding: 1vh 0vh 0vh 0vh;
  box-sizing: border-box;
}
.dashboard_title{
  border-bottom: 0.29vh solid #E6E9ED;
  padding: 1.44vh 0.34vw 2.17vh 0.7vw;
  margin-bottom: 1.44vh;
  margin-right: 0vh;
  margin-left: 0vh;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
}
.dashboard_title_text{
  position: relative;
  min-height: 0.14vh;
  float: left;
  padding-right: 0.7vw;
  padding-left: 2.6vw;
  color:#73879c;
  font-size:3.6vh;
}
.choose{
  position:relative;
  margin-left:52.2vw;
  margin-top:1.87vh;
  margin-right:1.4vw;
}
.anNiu1{
  position: relative;
  float: left;
  padding:0vh;
  background-color:#19aa8e;
  border: #7aa7b0 0.72vh ;
  border-radius:0.57vh;
  top:0.29vh;
}
.anNiu1-un{
  position: relative;
  float: left;
  padding:0vh;
  border: #7aa7b0 0.72vh ;
  border-radius:0.57vh;
  top:0.29vh;
}
.anNiu1:active{
  background:#81d7c5;
}
.anNiu2{
  position: relative;
  float: left;
  padding:0vh;
  background-color:#19aa8e;
  border: #7aa7b0 0.72vh ;
  border-radius:0.57vh;
  top:0.29vh;
}
.anNiu2-un{
  position: relative;
  float: left;
  padding:0vh;
  border: #7aa7b0 0.72vh ;
  border-radius:0.57vh;
  top:0.29vh;
}
.anNiu2:active{
  background:#81d7c5;
}
.zuoJt{
  font-size: 3.32vh;
  position: relative;
  color:white;
  float: left;
  cursor: pointer;
}
.youJt{
  font-size: 3.32vh;
  position: relative;
  color:white;
  float: left;
  cursor: pointer;
}
.time{
  position: relative;
  float: left;
  font-size: 2.02vh;
  padding:0.43vh 0.52vw 0.43vh 0.52vw;
  background-color: #f6f6f6;
  top:0.29vh;
}
.senWords{
  margin-top:3vh;
  margin-left: 37vw;
  margin-right:24vw;
}
.senWord{
  position: relative;
  display:block;
  height:4.76vh;
}
.progress{
  top:0.43vh;
  border-radius: 0;
  margin-bottom: 0vh;
  height: 1.73vh !important;
  position: relative;
  overflow: hidden;
  background-color: #f5f5f5;
  box-shadow: inset 0 0.14vh 0.29vh rgba(0,0,0,.1);
  display: flex;
  font-size: .75rem;
  box-sizing: border-box;
}
.progressZuo{
  height:2.17vh;
  position:absolute;
  overflow: hidden;
  line-weight:2.89vh;
  background:#1ABB9C !important;
  color:#fff;
  border:0.14vh solid #1ABB9C !important;
  float:left;
  font-size: 1.59vh;
  text-align: center;
  box-shadow: inset 0 -0.14vh 0 rgba(0,0,0,.15);
  transition:width .6s ease;
}
.senWords2{
  position:absolute;
  top:17.5vh;
  margin-top:1.44vh;
  left:62vw
}
.senPosts{
  background-color: white;
  position:absolute;
  left:10.9vw;
  width:40.9vw;
  /*right:102.55vh;*/
  top:53vh;
}
.senPost{
  float:left;
  text-align: left;
  margin:0vh 1.35vw 0vh 1.35vw;
}
.senPost_text{
  -webkit-line-clamp:2;
  overflow:hidden;
  text-overflow:ellipsis;
  display: -webkit-box;
  -webkit-box-orient:vertical;
  float:left;
  text-align: left;
  font-size:1.88vh;
  text-indent: 2em;
  line-height: 2.45vh;
}
.sudPosts{
  position:absolute;
  top:55.3vh;
  left:52.5vw;
  right:1.2vw;
  background-color: white;
  border: 0.14vh #ececec solid;
}
.xiangQing{
  position:relative;
  margin-top:0vh;
  background-color: white;
  color: #0ca88a;
  border-style:none;
  font-size:1.73vh;
  margin-right:0.8vw;
  float:right;
  cursor: pointer;
}
</style>