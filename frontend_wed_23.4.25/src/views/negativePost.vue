<template>
  <el-row>
    <el-col :span="16">
      <el-row>
        <el-col :span="12">
          <div class="panel">
            <div class="title">
              <h3>各类帖子数量变化趋势</h3>
            </div>
            <div class="content">
              <div id="myBarChart" style="width: 95%; height: 95%;margin: auto"></div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="panel">
            <div class="title">
              <h3>各类帖子数量占比情况</h3>
            </div>
            <div class="content">
              <div id="myPieChart" style="width: 90%; height: 95%;margin: auto"></div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="panel">
            <div class="title">
              <h3>热词变化趋势</h3>
            </div>
            <div class="content">
              <!--              <div id="myStreamGraph" style="width: 95%; height: 95%;margin: auto"></div>-->
              <div id="myAreaChart" style="width: 95%; height: 95%;margin: auto"></div>
            </div>
          </div>
          <!--          <div class="table-box">-->
          <!--            <el-table :data="keyWordArray" :default-sort="{ prop: 'num', order: 'descending' }"-->
          <!--                      style="height: 300px;width: 100%">-->
          <!--              <el-table-column prop="keyWord" label="关键词" width="80"/>-->
          <!--              <el-table-column prop="emotion" label="情感" width="90">-->
          <!--                <template #default="scope">-->
          <!--                  <div style="display: flex; align-items: center">-->
          <!--                    <el-tag-->
          <!--                        :type="scope.row.emotion === 'Negative' ? 'danger' : 'success'"-->
          <!--                        disable-transitions-->
          <!--                    >{{ scope.row.emotion }}-->
          <!--                    </el-tag>-->
          <!--                  </div>-->
          <!--                </template>-->
          <!--              </el-table-column>-->
          <!--              <el-table-column prop="num" label="数量" sortable/>-->
          <!--              <el-table-column prop="index" label="指数" sortable/>-->
          <!--            </el-table>-->
          <!--          </div>-->
        </el-col>
        <el-col :span="12">
          <div class="grid-content ep-bg-purple-light"/>
          <section class="cloud-bed">
            <div class="cloud-box">
      <span
          v-for="(item, index) in wordArray"
          :key="index"
          @click="getDataInfo(item)"
          :style="{color:item.color,background:item.bgColor,width: 50+k*(item.frequency-50)+'px',height: 50+k*(item.frequency-50)+'px',fontSize: '30px'}"
      >
        {{ item.word }}
      </span>
            </div>
          </section>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="8">
      <div class="posts">
        <div v-if="postType=='未选择'&&words.length==0" class="postType">
          <h4><span><el-icon size="25" style="margin-top: 20px" color="rgba(12, 168, 138, 0.8)"><InfoFilled/></el-icon></span>&nbsp;可点击饼状图或词云图进行筛选
          </h4>
        </div>
        <div v-if="words.length!=0" class="postType">
          <h4>共筛选出<span style="font-size: large;color: rgb(12, 168, 138)">&nbsp;{{ postList.length }}&nbsp;</span>条帖子
          </h4>
        </div>
        <div>
          <div v-for="(item,index) in dateType" :key="item" @click="getDateType(index)"
               :class="dateTypeSelectedIndex==index?'dateTypeSelected':'dateTypeSelect'">
            <span style="font-size: 12px;">{{ item }}</span>
          </div>
        </div>
        <el-tag v-if="postType=='正面'" class="ml-2" @close="closeEmotion" closable type="success">正面</el-tag>
        <el-tag v-if="postType=='负面'" class="ml-2" @close="closeEmotion" closable type="danger">负面</el-tag>
        <el-tag v-if="postType=='中性'" @close="closeEmotion" closable>中性</el-tag>
        <el-tag
            style="color: #494949"
            v-for="item in words"
            :key="item.word"
            :color="item.color"
            class="mx-1"
            closable
            @close="closeWord(item.word)"
        >
          <span v-if="words.length!=0">{{ item.word }}</span>
        </el-tag>
        <el-scrollbar height="90vh">
          <div v-for="item in postList" :key="item">
            <div class="post">
              <div style="float:left;text-align: left;margin:10px 0px 3px 0px;font-size:14px;color:#08758c">{{
                  item.date
                }}
              </div>
              <div style="float:right;text-align: right;margin:10px 15px 3px 20px;font-size:12px;color:#08758c">赞
                {{ item.agree }} 评论 {{ item.comment }}
              </div>
              <div class="post_text">
                <Highlighter class="my-highlight"
                             HighlightStyle="{color:red}"
                             :searchWords="keywords"
                             :autoEscape="true"
                             :textToHighlight="item.detail"/>
              </div>
              <button @click="routeToDetail(item._id)" class="xiangQing">>> 查看详情</button>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </el-col>
  </el-row>
</template>

<script>

import * as echarts from "echarts"
import "echarts-wordcloud"
import axios from "axios";
import Highlighter from 'vue-highlight-words'


export default {
  name: "negativePost",
  components: {
    Highlighter
  },
  computed: {
    keywords() {
      console.log('keywords', this.wordsOnly)
      return this.wordsOnly
    }
  },
  data() {
    return {
      //选择年份
      weekStartDate: "",
      weekEndDate: "",
      monthStartDate: "",
      monthEndDate: "",
      yearStartDate: "",
      yearEndDate: "",
      startDate: "",
      endDate: "",
      dateType: ["近一年", "近一月", "近一周"],
      dateTypeSelectedIndex: 0,
      yearSelected: '2023',
      //所有帖子
      words: [],//tags,包含词语和颜色
      wordsOnly: [],//只包含词语,用于highlighter
      //筛选后的帖子
      postType: "未选择",//情感
      postList: [],
      //柱状图相关数据
      yearList: [],
      positivePostNumList: [],
      negativePostNumList: [],
      neutralPostNumList: [],
      //饼状图相关数据
      positivePostNum: 0,
      negativePostNum: 0,
      neutralPostNum: 0,
      //河流图相关数据
      time_axis: [],
      top_keywords: [],
      streamColor: [],
      streamData: [],
      //堆积折线图
      y_values: [],
      //词云图相关数据开始
      maxFre: 0,
      minFre: 100,
      k: 1,
      timer: 50, // 球体转动速率
      radius: 0, // 词云球体面积大小
      dtr: Math.PI / 180, //鼠标滑过球体转动速度
      active: false, // 默认加载是否开启转动
      lasta: 0, // 上下转动
      lastb: 0.5, // 左右转动
      distr: true,
      tspeed: 0, // 鼠标移动上去时球体转动
      mouseX: 0,
      mouseY: 0,
      tagAttrList: [],
      tagContent: null,
      cloudContent: null,
      sinA: '',
      cosA: '',
      sinB: '',
      cosB: '',
      sinC: '',
      cosC: '',
      wordArray: [],
      //词云图相关数据结束
      //表格
      keyWordArray: []
    }
  },
  created() {
    let that = this

    axios.get('/data/end_date')
        .then(function (response) {
          console.log('response.data', response.data)
          let date = response.data["end_date"]
          //周
          if (date.slice(8, 10) > 7) {
            that.weekStartDate = date.slice(0, 8) + (date.slice(8, 10) - 7)
          } else {
            let now = new Date()
            now.setFullYear(date.slice(0, 4), date.slice(5, 7) - 1, date.slice(8, 10))
            let weekAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000)
            that.weekStartDate = that.getDateString(weekAgo)
          }
          that.weekEndDate = date
          //月
          that.monthStartDate = date.slice(0, 5) + "0" + (date.slice(5, 7) - 1) + date.slice(7)
          that.monthEndDate = date
          //年
          that.yearStartDate = (date.slice(0, 4) - 1) +"-0" +(parseInt(date.slice(5, 7)) + 1) + "-01"
          that.yearEndDate = date.slice(0, 4) + "-0"+(parseInt(date.slice(5, 7)) + 1) + "-01"
          console.log('week', that.weekStartDate, that.weekEndDate)
          console.log('month', that.monthStartDate, that.monthEndDate)
          console.log('year', that.yearStartDate, that.yearEndDate)
          //默认为近一年
          that.startDate = that.yearStartDate
          that.endDate = that.yearEndDate
        })
        .catch(function (error) {
          console.log(error);
        });
    //为给定 ID 的 user 创建请求
    //初始化——获取近一年的帖子
    axios.get('/api/cgi-bin/token?grant_type=client_credential&appid=wx608d64d0acc25f28&secret=feb0adc1b0822221b6cbd6b29d889698')
        .then(function (response) {
          console.log(response.data.access_token);
          that.access_token = response.data.access_token
          axios.post('/api/tcb/databasequery?access_token=' + that.access_token, {
                "env": "cloud-2023-jisai-7ft7ahc87f5c949",
                "query": "db.collection(\"post\").where({date:db.command.gte('" + that.startDate + "').and(db.command.lte('" + that.endDate + "'))}).limit(1000).orderBy('date','desc').get()"
              }
          )
              .then(function (response) {
                console.log("post1", response.data.data);
                for (let k in response.data.data) {
                  that.postList.push(JSON.parse(response.data.data[k]))
                }
                axios.post('/api/tcb/databasequery?access_token=' + that.access_token, {
                      "env": "cloud-2023-jisai-7ft7ahc87f5c949",
                      "query": "db.collection(\"post\").where({date:db.command.gte('" + that.startDate + "').and(db.command.lte('" + that.endDate + "'))}).skip(1000).limit(1000).orderBy('date','desc').get()"
                    }
                )
                    .then(function (response) {
                      console.log("post1", response.data.data);
                      for (let k in response.data.data) {
                        that.postList.push(JSON.parse(response.data.data[k]))
                      }
                    })
                    .catch(function (error) {
                      console.log("post2", error);
                    });
              })
              .catch(function (error) {
                console.log("post2", error);
              });
        })
        .catch(function (error) {
          console.log(error);
        });
  },
  mounted() {
    this.initBarEcharts()
    this.initPieEcharts()
    this.initAreaChart()
    //this.initStreamGraph()
    ////this.initWordCloudEcharts()
    //词云图
    this.$nextTick(() => {
      this.radius = document.querySelector('.cloud-box').offsetWidth / 2
      let that = this
      let url = '/data/chart/bubble/year'
      axios.get(url)
          .then(function (response) {
            let str = response.data.replace(/'/g, '"')
            console.log('str', typeof (str))
            console.log('str:', str)
            that.wordArray = new Array()//[]
            let words = JSON.parse(str)
            let frequency = 0
            let word
            for (let item in words) {
              word = JSON.parse(JSON.stringify(words[item]))
              //console.log('word', word)
              frequency = parseInt(word["frequency"])
              //console.log('frequency',typeof (parseInt(frequency)))
              word["frequency"] = frequency
              if (frequency > that.maxFre) {
                that.maxFre = frequency
              }
              if (frequency < that.minFre) {
                that.minFre = frequency
              }
              //console.log('word', word)
              that.wordArray.push(word)
            }
            console.log('that.wordArray', that.wordArray)
            console.log('that.wordArrayType', typeof (that.wordArray))
          })
          .catch(function (error) {
            console.log(error);
          });
      setTimeout(() => {
        //console.log('that.maxFre',that.maxFre)
        //console.log('that.minFre',that.minFre)
        that.k = 50 / (that.maxFre - that.minFre)
        //console.log('that.k', that.k)
        this.initWordCloud()
      }, 1000)
    })
  },
  beforeUnmount() {
    clearInterval(this.timer)
  },
  methods: {
    filterPost() {
      let that = this
      //年份筛选
      let queryDate = "date:db.command.gte('" + that.startDate + "').and(db.command.lte('" + that.endDate + "')),"
      //情感筛选
      let queryScore = ''
      if (that.postType == "正面") {
        queryScore = "score:db.command.gt(0.6)"
      } else if (that.postType == "负面") {
        queryScore = "score:db.command.lt(0.4)"
      } else if (that.postType == "中性") {
        queryScore = "score:db.command.gte(0.4).and(db.command.lte(0.6))"
      }
      let queryLanguage = "db.collection(\"post\").where({" + queryDate + queryScore + "}).limit(1000).orderBy('date','desc').get()"
      console.log('queryLanguage', queryLanguage)
      axios.post('/api/tcb/databasequery?access_token=' + that.access_token, {
            "env": "cloud-2023-jisai-7ft7ahc87f5c949",
            "query": queryLanguage
          }
      ).then(function (response) {
        that.postList = []
        let flag = true
        for (let k in response.data.data) {
          //词云筛选
          flag = true
          for (let key in that.words) {
            if (JSON.parse(response.data.data[k])['detail'].search(that.words[key]['word']) == -1) {
              flag = false
            }
          }
          if (flag) {
            that.postList.push(JSON.parse(response.data.data[k]))
          }
        }
        console.log('that.postList', that.postList)
      })
          .catch(function (error) {
            console.log("postList2", error);
          });

    },
    routeToDetail(_id) {
      console.log(_id)
      this.$router.push({name: 'postDetailView', params: {postId: _id}});
    },
    //时间
    getDateString(date) {
      //console.log(date)
      if (date === '') {
        return ''
      } else {
        let yy = date.getFullYear()
        let mm = date.getMonth() + 1
        let dd = date.getDate()
        mm = mm > 9 ? mm : '0' + mm
        dd = dd > 9 ? dd : '0' + dd
        return yy + '-' + mm + '-' + dd
      }
    },
    getDateType(index) {
      //console.log('getDateType-index', index)
      let that = this
      that.dateTypeSelectedIndex = index
      that.initBarEcharts()
      that.initPieEcharts()
      that.initAreaChart()
      //that.initStreamGraph()
      //词云图变化
      let url = '/data/chart/'
      switch (that.dateTypeSelectedIndex) {
        case 0:
          url = url + 'bubble/year'
          break
        case 1:
          url = url + 'bubble/month'
          break
        case 2:
          url = url + 'bubble/week'
          break
        default:
          break
      }
      this.$nextTick(() => {
        this.radius = document.querySelector('.cloud-box').offsetWidth / 2
        axios.get(url)
            .then(function (response) {
              let str = response.data.replace(/'/g, '"')
              //console.log('str', typeof (str))
              //console.log('str:', str)
              that.wordArray = new Array()//[]
              let words = JSON.parse(str)
              let frequency = 0
              let maxFre = 0
              let minFre = 100
              let word
              for (let item in words) {
                word = JSON.parse(JSON.stringify(words[item]))
                //console.log('word', word)
                frequency = parseInt(word["frequency"])
                //console.log('frequency',typeof (parseInt(frequency)))
                word["frequency"] = frequency
                if (frequency > maxFre) {
                  maxFre = frequency
                }
                if (frequency < minFre) {
                  minFre = frequency
                }
                //console.log('word', word)
                that.wordArray.push(word)
              }
              that.k = 50 / (maxFre - minFre)
              //console.log('that.k',that.k)
              //console.log('that.wordArray', that.wordArray)
              //console.log('that.wordArrayType', typeof (that.wordArray))
            })
            .catch(function (error) {
              console.log(error);
            });
        setTimeout(() => {
          that.tagAttrList = []
          that.tagContent = null
          that.cloudContent = null
          this.initWordCloud()
        }, 100)
      })
      // //console.log('this.dateTypeSelectedIndex', this.dateTypeSelectedIndex == index)
      // let now = new Date()
      // let yearAgo = new Date()
      // yearAgo.setFullYear(now.getFullYear() - 1)
      // //console.log('yearAgo', yearAgo)
      // let monthAgo = new Date()
      // monthAgo.setMonth(now.getMonth() - 1)
      // //console.log('monthAgo', monthAgo)
      // let weekAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000)
      // //console.log('weekAgo', weekAgo)
      switch (index) {
        case 0:
          that.startDate = that.yearStartDate
          that.endDate = that.yearEndDate
          break
        case 1:
          that.startDate = that.monthStartDate
          that.endDate = that.monthEndDate
          break
        case 2:
          that.startDate = that.weekStartDate
          that.endDate = that.weekEndDate
          break
        default:
          break
      }
      console.log('this.startDate', this.startDate)
      console.log('this.endDate', this.endDate)
      that.filterPost()
    },
    getEmotionalPost(param) {
      console.log('饼状图-index', param)
      let that = this
      if (param.dataIndex == 0) {
        that.postType = "正面"
      } else if (param.dataIndex == 1) {
        that.postType = "负面"
      } else {
        that.postType = "中性"
      }
      this.filterPost()
    },
    initBarEcharts() {
      let that = this
      let url = '/data/chart/'
      switch (that.dateTypeSelectedIndex) {
        case 0:
          url = url + 'curve/year'
          break
        case 1:
          url = url + 'curve/month'
          break
        case 2:
          url = url + 'curve/week'
          break
        default:
          break
      }
      axios.get(url)
          .then(function (response) {
            console.log('response.data', response.data)
            let bar = JSON.parse(response.data.replace(/'/g, '"'))
            console.log('bar.data', bar)
            console.log('bar.data', typeof (bar))
            that.yearList = bar["date"]
            that.positivePostNumList = bar["pos"]
            that.negativePostNumList = bar["neg"]
            that.neutralPostNumList = bar["neu"]
          })
          .catch(function (error) {
            console.log(error);
          });
      setTimeout(() => {
        const colorList = ["#409eff", '#89d066', '#fe9a8b', '#f56c6c', '#9E87FF']
        const barOptions = {
          backgroundColor: '#fff',
          legend: {
            icon: 'circle',
            top: '5%',
            right: '5%',
            itemWidth: 6,
            itemGap: 20,
            textStyle: {
              color: '#556677'
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              label: {
                show: true,
                backgroundColor: '#fff',
                color: '#556677',
                borderColor: 'rgba(0,0,0,0)',
                shadowColor: 'rgba(0,0,0,0)',
                shadowOffsetY: 0
              },
              lineStyle: {
                width: 0
              }
            },
            backgroundColor: '#fff',
            textStyle: {
              color: '#5c6c7c'
            },
            padding: [10, 10],
            extraCssText: 'box-shadow: 1px 0 2px 0 rgba(163,163,163,0.5)'
          },
          grid: {
            top: '15%'
          },
          xAxis: [{
            type: 'category',
            data: that.yearList,//['北京', '上海', '广州', '深圳', '香港', '澳门', '台湾'],
            axisLine: {
              lineStyle: {
                color: '#DCE2E8'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              rotate: "90",
              interval: 0,
              textStyle: {
                color: '#556677'
              },
              // 默认x轴字体大小
              fontSize: 12,
              // margin:文字到x轴的距离
              margin: 15
            },
            axisPointer: {
              label: {
                // padding: [11, 5, 7],
                padding: [0, 0, 10, 0],
                // 这里的margin和axisLabel的margin要一致!
                margin: 15,
                // 移入时的字体大小
                fontSize: 12,
                backgroundColor: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: '#fff' // 0% 处的颜色
                  }, {
                    // offset: 0.9,
                    offset: 0.86,
                    /*0.86 = （文字 + 文字距下边线的距离）/（文字 + 文字距下边线的距离 + 下边线的宽度） */
                    color: '#fff' // 0% 处的颜色
                  }, {
                    offset: 0.86,
                    color: '#33c0cd' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#33c0cd' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false
                }
              }
            },
            boundaryGap: false
          }],
          yAxis: [{
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#DCE2E8'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#556677'
              }
            },
            splitLine: {
              show: false
            }
          }, {
            type: 'value',
            position: 'right',
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#556677'
              },
              formatter: '{value}'
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#DCE2E8'
              }
            },
            splitLine: {
              show: false
            }
          }],
          series: [{
            name: '中性',
            type: 'line',
            data: that.neutralPostNumList,//[10, 10, 30, 12, 15, 3, 7],
            symbolSize: 1,
            symbol: 'circle',
            smooth: true,
            yAxisIndex: 0,
            showSymbol: false,
            lineStyle: {
              width: 5,
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                offset: 0,
                color: 'rgba(64,158,255,0.8)'
              },
                {
                  offset: 1,
                  color: 'rgba(64,158,255,0.5)'
                }
              ]),
              shadowColor: 'rgba(157,201,252,0.5)',
              shadowBlur: 10,
              shadowOffsetY: 20
            },
            itemStyle: {
              normal: {
                label: {show: true, color: colorList[0]},
                color: colorList[0],
                borderColor: colorList[0]
              }
            }
          }, {
            name: '正面',
            type: 'line',
            data: that.positivePostNumList,//[5, 12, 11, 14, 25, 16, 10],
            symbolSize: 1,
            symbol: 'circle',
            smooth: true,
            yAxisIndex: 0,
            showSymbol: false,
            lineStyle: {
              width: 5,
              color: new echarts.graphic.LinearGradient(1, 1, 0, 0, [{
                offset: 0,
                color: 'rgba(137,208,102,0.8)'
              },
                {
                  offset: 1,
                  color: 'rgba(137,208,102,0.5)'
                }
              ]),
              shadowColor: 'rgba(190,224,173,0.5)',
              shadowBlur: 10,
              shadowOffsetY: 20
            },
            itemStyle: {
              normal: {
                label: {show: true, color: colorList[1]},
                color: colorList[1],
                borderColor: colorList[1]
              }
            }
          },
            {
              name: '负面',
              type: 'line',
              data: that.negativePostNumList,//[150, 120, 170, 140, 500, 160, 110],
              symbolSize: 1,
              yAxisIndex: 0,
              symbol: 'circle',
              smooth: true,
              showSymbol: false,
              lineStyle: {
                width: 5,
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                  offset: 0,
                  color: 'rgba(245,108,108,0.8)'
                },
                  {
                    offset: 1,
                    color: 'rgba(245,108,108,0.5)'
                  }
                ]),
                shadowColor: 'rgba(250,193,193,0.5)',
                shadowBlur: 10,
                shadowOffsetY: 20
              },
              itemStyle: {
                normal: {
                  label: {show: true, color: colorList[2]},
                  color: colorList[2],
                  borderColor: colorList[2]
                }
              }
            }
          ]
        };
        const barChart = echarts.init(document.getElementById("myBarChart"))
        barChart.setOption(barOptions)
        window.addEventListener("resize", () => {
          barChart.resize()
        })
      }, 1000)
    },
    initPieEcharts() {
      let that = this
      let url = '/data/chart/'
      switch (that.dateTypeSelectedIndex) {
        case 0:
          url = url + 'pie/year'
          break
        case 1:
          url = url + 'pie/month'
          break
        case 2:
          url = url + 'pie/week'
          break
        default:
          break
      }
      axios.get(url)
          .then(function (response) {
            console.log(response.data)
            let pie = JSON.parse(response.data.replace(/'/g, '"'))
            console.log('类型', typeof (pie))
            console.log('后端-饼图', pie);
            that.positivePostNum = pie["posNum"]
            that.negativePostNum = pie["negNum"]
            that.neutralPostNum = pie["neuNum"]
            //console.log('that.positivePostNum',that.positivePostNum)
          })
          .catch(function (error) {
            console.log(error);
          });
      setTimeout(() => {
        var colorList = ['rgba(137,208,102,0.6)', 'rgba(245,108,108,0.6)', 'rgba(64,158,255,0.6)', "rgba(250,250,250,0.5)"];
        const pieOptions = {
          title: {
            subtext: that.dateType[that.dateTypeSelectedIndex],
            x: 'center',
            y: '42%',
            textStyle: {
              fontSize: 18,
              fontWeight: 'normal',

            },
            subtextStyle: {
              color: '#0e0d0d',
              fontSize: 16
            },
          },
          grid: {
            bottom: 150,
            left: 0,
            right: '10%'
          },
          legend: {
            show: false,
            orient: 'vertical',
            top: "middle",
            right: "5%",
            textStyle: {
              color: '#f2f2f2',
              fontSize: 25,

            },
            icon: 'roundRect'
          },
          series: [
            // 主要展示层的
            {
              radius: ['29%', '59%'],
              center: ['50%', '50%'],
              type: 'pie',
              itemStyle: {
                normal: {
                  color: function (params) {
                    return colorList[params.dataIndex]
                  }
                }
              },
              labelLine: {
                normal: {
                  show: true,
                  length: 35,
                  length2: 70,
                  lineStyle: {
                    color: '#d3d3d3'
                  },
                  align: 'right'
                },
                color: "#000",
                emphasis: {
                  show: true
                }
              },
              label: {
                normal: {
                  formatter: function (params) {
                    var str = '';
                    switch (params.name) {
                      case '正面':
                        str = '正面：' + params.value + '条';
                        break;
                      case '负面':
                        str = '负面：' + params.value + '条';
                        break;
                      case '中性':
                        str = '中性：' + params.value + '条';
                        break;
                    }
                    return str
                  },
                  padding: [0, -90],
                  height: 35,
                  rich: {
                    a: {
                      width: 38,
                      height: 38,
                      lineHeight: 50,

                      align: 'left'
                    },
                    b: {
                      width: 29,
                      height: 45,
                      lineHeight: 50,
                      align: 'left'
                    },
                    c: {
                      width: 34,
                      height: 33,
                      lineHeight: 50,

                      align: 'left'
                    },
                    d: {
                      width: 34,
                      height: 44,
                      lineHeight: 50,
                      align: 'left'
                    },
                    e: {
                      width: 38,
                      height: 30,
                      lineHeight: 50,
                      align: 'left'
                    },
                    nameStyle: {
                      fontSize: 16,
                      color: "#555",
                      align: 'left'
                    },
                    rate: {
                      fontSize: 20,
                      color: "#1ab4b8",
                      align: 'left'
                    }
                  }
                }
              },
              data: [
                {value: that.positivePostNum, name: '正面',},
                {value: that.negativePostNum, name: '负面'},
                {value: that.neutralPostNum, name: '中性'}],
            },
            // 边框的设置
            {
              radius: ['54%', '59%'],
              center: ['50%', '50%'],
              type: 'pie',
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false
                }
              },
              labelLine: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false
                }
              },
              animation: false,
              tooltip: {
                show: false
              },
              itemStyle: {
                normal: {
                  color: 'rgba(250,250,250,0.5)'
                }
              },
              data: [{
                value: 1,
              }],
            }
          ]
        };
        const pieChart = echarts.init(document.getElementById("myPieChart"))
        pieChart.setOption(pieOptions, true)
        window.addEventListener("resize", () => {
          pieChart.resize()
        })
        pieChart.on('click', this.getEmotionalPost)
      }, 500)
    },
    colorbar(s) {
      //let color11 = 'rgb(245,108,108)'//负面 0
      let r11 = 245
      let g11 = 108
      let b11 = 108
      //let color12 = 'rgb(241,195,195)'//负面 0.5
      let r12 = 241
      let g12 = 195
      let b12 = 195
      //let color21 = 'rgb(191,211,181)'//正面 0.5
      let r21 = 191
      let g21 = 211
      let b21 = 181
      //let color22 = 'rgb(137,208,102)'//正面 0.5
      let r22 = 137
      let g22 = 208
      let b22 = 102
      let r = 0
      let g = 0
      let b = 0
      if (s <= 0.5) {
        r = r11 + (r12 - r11) * 2 * s
        g = g11 + (g12 - g11) * 2 * s
        b = b11 + (b12 - b11) * 2 * s
      } else {
        r = r21 + (r22 - r21) * (s - 0.5) * 2
        g = g21 + (g22 - g21) * (s - 0.5) * 2
        b = b21 + (b22 - b21) * (s - 0.5) * 2
      }
      let color = 'rgba(' + r + ',' + g + ',' + b + ',0.9)'
      return color
    },
    // colorbar(s) {
    //   //let color1='rgb(245,108,108)'//正面
    //   let r1 = 245
    //   let g1 = 108
    //   let b1 = 108
    //   //let color2='rgb(137,208,102)'//负面
    //   let r2 = 137
    //   let g2 = 208
    //   let b2 = 102
    //   //let color3='rgb(64,158,255)'//中性
    //   let r = r1 + (r2 - r1) *s
    //   let g = g1 + (g2 - g1) *s
    //   let b = b1 + (b2 - b1) *s
    //   let color = 'rgb(' + r + ',' + g + ',' + b + ')'
    //   return color
    // },
    initAreaChart() {
      //获取数据
      let that = this
      let url = '/data/chart/'
      switch (that.dateTypeSelectedIndex) {
        case 0:
          url = url + 'river/year'
          break
        case 1:
          url = url + 'river/month'
          break
        case 2:
          url = url + 'river/week'
          break
        default:
          break
      }
      axios.get(url)
          .then(function (response) {
            console.log(response.data)
            let river = JSON.parse(response.data.replace(/'/g, '"'))
            console.log('类型', typeof (river))
            console.log('河流图数据', river);
            that.time_axis = river['time_axis']
            that.top_keywords = river['top_keywords']
            for (let i in river['sentiment_index_list']) {
              that.streamColor.push(that.colorbar(river['sentiment_index_list'][i]))
            }
            that.y_values = river['y_values']
            console.log('that.y_values', that.y_values)
            console.log('that.Color', that.streamColor)
            console.log('that.time_axis', that.time_axis)
            console.log('that.top_keywords', that.top_keywords)
          })
          .catch(function (error) {
            console.log(error);
          });
      setTimeout(() => {
        const areaOptions = {
          color: that.streamColor,
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              label: {
                show: true,
                backgroundColor: '#fff',
                color: '#556677',
                borderColor: 'rgba(0,0,0,0)',
                shadowColor: 'rgba(0,0,0,0)',
                shadowOffsetY: 0
              },
              lineStyle: {
                width: 0
              }
            }
          },
          legend: {
            icon: 'circle',
            top: '0%',
            right: '-2%',
            align: 'auto',
            itemWidth: 5,
            itemGap: 10,
            textStyle: {
              color: '#111111',

            },
            data: that.top_keywords
          },
          grid: {
            top: '10%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            tooltip: {
              axisPointer: {
                label: {
                  show: false,
                  fontSize: 20,
                }
              }
            },
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: that.time_axis,//['北京', '上海', '广州', '深圳', '香港', '澳门', '台湾'],
            axisLine: {
              lineStyle: {
                color: '#DCE2E8'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              rotate: "90",
              interval: 0,
              textStyle: {
                color: '#556677'
              },
              // 默认x轴字体大小
              fontSize: 12,
              // margin:文字到x轴的距离
              margin: 15
            },
            axisPointer: {
              label: {
                // padding: [11, 5, 7],
                padding: [0, 0, 10, 0],
                // 这里的margin和axisLabel的margin要一致!
                margin: 15,
                // 移入时的字体大小
                fontSize: 12,
                backgroundColor: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: '#fff' // 0% 处的颜色
                  }, {
                    // offset: 0.9,
                    offset: 0.86,
                    /*0.86 = （文字 + 文字距下边线的距离）/（文字 + 文字距下边线的距离 + 下边线的宽度） */
                    color: '#fff' // 0% 处的颜色
                  }, {
                    offset: 0.86,
                    color: '#33c0cd' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#33c0cd' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false
                }
              }
            },
            boundaryGap: false
          }],
          yAxis: [
            {
              show: true,
              nameTextStyle: {
                fontSize: '17',
                padding: [0, 50, 10, 0]
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#DCE2E8'
                }
              },
              axisLabel: {
                textStyle: {
                  color: '#556677'
                }
              },
              axisTick: {
                show: false,
                alignWithLabel: true
              },
              splitLine: {
                show: false,
              },
              type: 'value'
            }
          ],
          series: [
            {
              name: that.top_keywords[0],
              type: 'line',
              barWidth: '20',
              //stack: '用电类别',
              areaStyle: {},
              smooth: true,
              label: {
                show: false,
                fontSize: 16
              },
              data: that.y_values[0]
            },
            {
              name: that.top_keywords[1],
              type: 'line',
              //stack: '用电类别',
              areaStyle: {},
              smooth: true,
              label: {
                show: false,
                fontSize: 16
              },
              data: that.y_values[1]
            },
            {
              name: that.top_keywords[2],
              type: 'line',
              //stack: '用电类别',
              areaStyle: {},
              smooth: true,
              label: {
                show: false,
                fontSize: 16
              },
              data: that.y_values[2]
            },
            {
              name: that.top_keywords[3],
              type: 'line',
              //stack: '用电类别',
              areaStyle: {},
              smooth: true,
              label: {
                show: false,
                fontSize: 16
              },
              data: that.y_values[3]
            },
            {
              name: that.top_keywords[4],
              type: 'line',
              //stack: '用电类别',
              areaStyle: {},
              smooth: true,
              label: {
                show: false,
                fontSize: 16
              },
              data: that.y_values[4]
            },
            {
              name: that.top_keywords[5],
              type: 'line',
              //stack: '用电类别',
              areaStyle: {},
              smooth: true,
              label: {
                show: false,
                fontSize: 16
              },
              data: that.y_values[5]
            },
          ]
        }
        const areaChart = echarts.init(document.getElementById("myAreaChart"))
        areaChart.setOption(areaOptions)
        window.addEventListener("resize", () => {
          areaChart.resize()
        })
      }, 1000)
    },
    // initStreamGraph(){
    //   //获取数据
    //   let that = this
    //   let url='/data/chart/'
    //   switch (that.dateTypeSelectedIndex) {
    //     case 0:
    //       url = url+'river/year'
    //       break
    //     case 1:
    //       url = url+'river/month'
    //       break
    //     case 2:
    //       url = url+'river/week'
    //       break
    //     default:
    //       break
    //   }
    //   axios.get(url)
    //       .then(function (response) {
    //         console.log(response.data)
    //         let river = JSON.parse(response.data.replace(/'/g, '"'))
    //         console.log('类型', typeof (river))
    //         console.log('河流图数据', river);
    //         that.time_axis=river['time_axis']
    //         that.top_keywords=river['top_keywords']
    //         for(let i in river['sentiment_index_list']){
    //           that.streamColor.push(that.colorbar(river['sentiment_index_list'][i]))
    //         }
    //         that.streamData=[]
    //         let temp=[]
    //         for(let w in river['top_keywords']){
    //           for(let i=0;i<river['time_axis'].length;i++){
    //             temp.push(river['time_axis'][i])
    //             temp.push(river['y_values'][w][i])
    //             temp.push(river['top_keywords'][w])
    //             that.streamData.push(temp)
    //             temp=[]
    //           }
    //         }
    //         console.log('that.streamData',that.streamData)
    //         console.log('that.streamColor',that.streamColor)
    //         console.log('that.time_axis',that.time_axis)
    //         console.log('that.top_keywords',that.top_keywords)
    //       })
    //       .catch(function (error) {
    //         console.log(error);
    //       });
    //   setTimeout(() => {
    //     //const colorList = ["#409eff", '#89d066', '#fe9a8b', '#f56c6c', '#9E87FF']
    //     // const streamOptions = {
    //     //   tooltip: {
    //     //     trigger: 'axis',
    //     //     axisPointer: {
    //     //       type: 'line',
    //     //       lineStyle: {
    //     //         color: 'rgba(0,0,0,0.2)',
    //     //         width: 1,
    //     //         type: 'solid'
    //     //       }
    //     //     }
    //     //   },
    //     //   legend: {
    //     //     data: that.top_keywords
    //     //   },
    //     //
    //     //   singleAxis: {
    //     //
    //     //     // top: '8%',
    //     //
    //     //     axisTick: {},
    //     //
    //     //     axisLabel: {},
    //     //
    //     //     type: 'time',
    //     //
    //     //     // position: 'top',
    //     //
    //     //     splitLine: {
    //     //       show: true,
    //     //       lineStyle: {
    //     //         type: 'dashed',
    //     //         opacity: 0.2
    //     //       }
    //     //     }
    //     //   },
    //     //
    //     //   series: [
    //     //     {
    //     //       type: 'themeRiver',
    //     //       itemStyle: {
    //     //         emphasis: {
    //     //           shadowBlur: 20,
    //     //           shadowColor: 'rgba(0, 0, 0, 0.8)'
    //     //         }
    //     //       },
    //     //       data: that.streamData
    //     //     }
    //     //   ]
    //     // };
    //     const streamOptions = {
    //       color: that.streamColor,
    //       tooltip: {
    //         trigger: 'axis',
    //         axisPointer: {
    //           type: 'line',
    //           lineStyle: {
    //             color: 'rgba(255,255,0,0.8)',
    //             width: 1,
    //             type: 'solid'
    //           }
    //         }
    //       },
    //
    //       legend: {
    //         top: '4%',
    //         textStyle: {
    //           color: '#FE80C8',
    //         },
    //         data: that.top_keywords
    //       },
    //
    //       singleAxis: {
    //         top: 90,
    //         bottom: 90,
    //         left: 100,
    //         right: 100,
    //         axisLine: {
    //           lineStyle: {
    //             color: '#5F4051'
    //           }
    //         },
    //         splitLine: {
    //           show: true,
    //           lineStyle: {
    //             color: '#5F4051',
    //           }
    //         },
    //         type: 'time',
    //         axisPointer: {
    //           animation: true,
    //           label: {
    //             show: true
    //           }
    //         },
    //       },
    //
    //       series: [{
    //         type: 'themeRiver',
    //         label: {
    //           normal: {
    //             show: true,
    //             position: 'left'
    //           }
    //         },
    //         itemStyle: {
    //           emphasis: {
    //             shadowBlur: 20,
    //             shadowColor: 'rgba(0, 0, 0, 0.6)'
    //           }
    //         },
    //         data: that.streamData
    //       }]
    //     };
    //     const streamGraph = echarts.init(document.getElementById("myStreamGraph"))
    //     streamGraph.setOption(streamOptions)
    //     window.addEventListener("resize", () => {
    //       streamGraph.resize()
    //     })
    //   }, 1000)
    // },
    closeWord(word) {
      console.log('closeWord', word)
      this.words = this.words.filter(item => (item.word != word))
      this.wordsOnly = this.wordsOnly.filter(item => (item != word))
      this.filterPost()
    },
    closeEmotion() {
      this.postType = '未选择'
      this.filterPost()
    },
    //词云图开始
    getDataInfo(item) {
      let word = {word: item["word"], color: item['bgColor']}
      for (let i = 0; i < this.words.length; i++) {
        if (this.words[i]['word'] == word['word']) {
          return;
        }
      }
      this.words.push(word)
      this.wordsOnly.push(item['word'])
      this.filterPost()
    },
    initWordCloud() {
      this.cloudContent = document.querySelector('.cloud-box');
      this.tagContent = this.cloudContent.getElementsByTagName('span');
      for (let i = 0; i < this.tagContent.length; i++) {
        let tagObj = {};
        tagObj.offsetWidth = this.tagContent[i].offsetWidth;
        tagObj.offsetHeight = this.tagContent[i].offsetHeight;
        this.tagAttrList.push(tagObj);
      }
      this.sineCosine(0, 0, 0);
      this.positionAll();
      this.cloudContent.onmouseover = () => {
        this.active = true;
      };
      this.cloudContent.onmouseout = () => {
        this.active = false;
      };
      this.cloudContent.onmousemove = (ev) => {
        let oEvent = window.event || ev;
        this.mouseX = oEvent.clientX - (this.cloudContent.offsetLeft + this.cloudContent.offsetWidth / 2);
        this.mouseY = oEvent.clientY - (this.cloudContent.offsetTop + this.cloudContent.offsetHeight / 2);
        this.mouseX /= 5;
        this.mouseY /= 5;
      };
      setInterval(this.update, this.timer);
    },
    positionAll() {
      let phi = 0;
      let theta = 0;
      let max = this.tagAttrList.length;
      let aTmp = [];
      let oFragment = document.createDocumentFragment();
      //随机排序
      for (let i = 0; i < this.tagContent.length; i++) {
        aTmp.push(this.tagContent[i]);
      }
      aTmp.sort(() => {
        return Math.random() < 0.5 ? 1 : -1;
      });
      for (let i = 0; i < aTmp.length; i++) {
        oFragment.appendChild(aTmp[i]);
      }
      this.cloudContent.appendChild(oFragment);
      for (let i = 1; i < max + 1; i++) {
        if (this.distr) {
          phi = Math.acos(-1 + (2 * i - 1) / max);
          theta = Math.sqrt(max * Math.PI) * phi;
        } else {
          phi = Math.random() * (Math.PI);
          theta = Math.random() * (2 * Math.PI);
        }
        //坐标变换
        this.tagAttrList[i - 1].cx = this.radius * Math.cos(theta) * Math.sin(phi);
        this.tagAttrList[i - 1].cy = this.radius * Math.sin(theta) * Math.sin(phi);
        this.tagAttrList[i - 1].cz = this.radius * Math.cos(phi);
        this.tagContent[i - 1].style.left = this.tagAttrList[i - 1].cx + this.cloudContent.offsetWidth / 2 - this.tagAttrList[i - 1].offsetWidth / 2 + 'px';
        this.tagContent[i - 1].style.top = this.tagAttrList[i - 1].cy + this.cloudContent.offsetHeight / 2 - this.tagAttrList[i - 1].offsetHeight / 2 + 'px';
      }
    },
    update() {
      let angleBasicA;
      let angleBasicB;

      if (this.active) {
        angleBasicA = (-Math.min(Math.max(-this.mouseY, -200), 200) / this.radius) * this.tspeed;
        angleBasicB = (Math.min(Math.max(-this.mouseX, -200), 200) / this.radius) * this.tspeed;
      } else {
        angleBasicA = this.lasta * 0.98;
        angleBasicB = this.lastb * 0.98;
      }

      //默认转动是后是否需要停下
      // lasta=a;
      // lastb=b;

      // if(Math.abs(a)<=0.01 && Math.abs(b)<=0.01)
      // {
      // return;
      // }
      this.sineCosine(angleBasicA, angleBasicB, 0);
      for (let j = 0; j < this.tagAttrList.length; j++) {
        let rx1 = this.tagAttrList[j].cx;
        let ry1 = this.tagAttrList[j].cy * this.cosA + this.tagAttrList[j].cz * (-this.sinA);
        let rz1 = this.tagAttrList[j].cy * this.sinA + this.tagAttrList[j].cz * this.cosA;

        let rx2 = rx1 * this.cosB + rz1 * this.sinB;
        let ry2 = ry1;
        let rz2 = rx1 * (-this.sinB) + rz1 * this.cosB;

        let rx3 = rx2 * this.cosC + ry2 * (-this.sinC);
        let ry3 = rx2 * this.sinC + ry2 * this.cosC;
        let rz3 = rz2;
        this.tagAttrList[j].cx = rx3;
        this.tagAttrList[j].cy = ry3;
        this.tagAttrList[j].cz = rz3;

        let per = 350 / (350 + rz3);

        this.tagAttrList[j].x = rx3 * per - 2;
        this.tagAttrList[j].y = ry3 * per;
        this.tagAttrList[j].scale = per;
        this.tagAttrList[j].alpha = per;

        this.tagAttrList[j].alpha = (this.tagAttrList[j].alpha - 0.6) * (10 / 6);
      }
      this.doPosition();
      this.depthSort();
    },
    doPosition() {
      let len = this.cloudContent.offsetWidth / 2;
      let height = this.cloudContent.offsetHeight / 2;
      for (let i = 0; i < this.tagAttrList.length; i++) {
        this.tagContent[i].style.left = this.tagAttrList[i].cx + len - this.tagAttrList[i].offsetWidth / 2 + 'px';
        this.tagContent[i].style.top = this.tagAttrList[i].cy + height - this.tagAttrList[i].offsetHeight / 2 + 'px';
        // this.tagContent[i].style.fontSize = Math.ceil(12 * this.tagAttrList[i].scale/2) + 8 + 'px';
        this.tagContent[i].style.fontSize = Math.ceil(12 * this.tagAttrList[i].scale / 2) + 2 + 'px';
        this.tagContent[i].style.filter = "alpha(opacity=" + 100 * this.tagAttrList[i].alpha + ")";
        this.tagContent[i].style.opacity = this.tagAttrList[i].alpha;
      }
    },
    depthSort() {
      let aTmp = [];
      for (let i = 0; i < this.tagContent.length; i++) {
        aTmp.push(this.tagContent[i]);
      }
      aTmp.sort((item1, item2) => item2.cz - item1.cz);
      for (let i = 0; i < aTmp.length; i++) {
        aTmp[i].style.zIndex = i;
      }
    },
    sineCosine(a, b, c) {
      this.sinA = Math.sin(a * this.dtr);
      this.cosA = Math.cos(a * this.dtr);
      this.sinB = Math.sin(b * this.dtr);
      this.cosB = Math.cos(b * this.dtr);
      this.sinC = Math.sin(c * this.dtr);
      this.cosC = Math.cos(c * this.dtr);
    }
    //词云图结束
  }
}
</script>

<style scoped>

.dateTypeSelect {
  display: inline-block;
  cursor: pointer;
  text-align: center;
  vertical-align: center;
  white-space: nowrap;
  /*border: 1px solid #000000;*/
  margin: 5px 10px;
  padding: 3px 6px;
  border-radius: 10rem;
  color: #ffffff;
  background-color: rgb(12, 168, 138, 0.4);
}

.dateTypeSelect:hover {
  color: #ffffff;
  background-color: rgb(12, 168, 138);
}

.dateTypeSelected {
  display: inline-block;
  cursor: pointer;
  text-align: center;
  vertical-align: center;
  white-space: nowrap;
  /*border: 1px solid #000000;*/
  margin: 5px 10px;
  padding: 3px 6px;
  border-radius: 10rem;
  color: #ffffff;
  background-color: rgb(12, 168, 138);
}

.cloud-bed {
  width: 200px;
  height: 200px;
  margin: auto;
}

.cloud-box {
  position: relative;
  margin: 20px auto 10px;
  width: 100%;
  height: 100%;
  background: #00000000;
}

.cloud-box span {
  position: absolute;
  padding: 3px 6px;
  margin-bottom: 15px;
  top: 0px;
  font-weight: bold;
  text-decoration: none;
  left: 0px;
  background-image: linear-gradient(to bottom, red, #fff);
  background-clip: text;
  color: transparent;
  border-radius: 50%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  /* line-height: 50px;
  overflow:hidden;
  white-space: nowrap;
  text-overflow: ellipsis; */
}

.posts {
  overflow: hidden;
  margin-bottom: 2vh;
  background-image: linear-gradient(#f7faf7, #f0f0f0);
  width: 90%;
  height: 98%;
}

.postType {
  background-image: linear-gradient(#f5f5f5, #fafafa);
  padding: 1px 5px;
  /*color: #505050;*/
  color: rgba(12, 168, 138, 0.5);
  font-family: "Helvetica Neue", Roboto, Arial, "Droid Sans", sans-serif;
  font-size: 13px;
  font-weight: 400;
}

.post {
  float: left;
  text-align: center;
  margin: 0px 20px 0px 20px;
  padding: 2px;
}

.post_text {
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  float: left;
  text-align: left;
  font-size: 13px;
  text-indent: 2em;
  line-height: 17px;
}

.xiangQing {
  position: relative;
  margin-top: 0px;
  background-image: linear-gradient(#f7faf7, #f0f0f0);
  color: #0ca88a;
  border-style: none;
  font-size: 12px;
  margin-right: 13px;
  float: right;
  cursor: pointer;
}

.panel {
  position: relative;
  width: 85%;
  margin-bottom: 10px;
  padding: 10px 17px;
  display: inline-block;
  background: #fff;
  border: 1px solid #E6E9ED;
  opacity: 1;
  -webkit-transition: all .2s ease;
  transition: all .2s ease;
  color: #73879C;
  font-family: "Helvetica Neue", Roboto, Arial, "Droid Sans", sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.471;
}

.content {
  padding: 0 2px;
  position: relative;
  width: 100%;
  float: left;
  clear: both;
  margin-top: 2px;
  height: 45vh;
  align-items: center;
}

.title {
  border-bottom: 2px solid #E6E9ED;
  padding: 1px 5px;
  color: #73879C;
  font-family: "Helvetica Neue", Roboto, Arial, "Droid Sans", sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
}

.grid-content ep-bg-purple-light {
  margin: 2px 15px 2px;
  padding: 5px 2px;
}

.table-box {
  padding: 10px;
  border: 1px solid #E6E9ED;
  mso-border-shadow: yes;
  margin: 10px;
}

.choose {
  display: flex;
  padding: 3px;
  margin: 10px auto;
}

.anNiu1 {
  position: relative;
  float: left;
  padding: 0vh;
  background-color: #19aa8e;
  border: #7aa7b0 0.72vh;
  border-radius: 0.57vh;
  top: 0.29vh;
}

.anNiu1:active {
  background: #81d7c5;
}

.anNiu2 {
  position: relative;
  float: right;
  padding: 0vh;
  background-color: #19aa8e;
  border: #7aa7b0 0.72vh;
  border-radius: 0.57vh;
  top: 0.29vh;
}

.anNiu2:active {
  background: #81d7c5;
}

.zuoJt {
  font-size: 3.32vh;
  position: relative;
  color: white;
  float: left;
  cursor: pointer;
}

.youJt {
  font-size: 3.32vh;
  position: relative;
  color: white;
  float: left;
  cursor: pointer;
}

.time {
  position: relative;
  float: left;
  font-size: 2.02vh;
  padding: 0.43vh 0.52vw 0.43vh 0.52vw;
  background-color: #f6f6f6;
  top: 0.29vh;
}

.anNiu1-un {
  position: relative;
  float: left;
  padding: 0vh;
  border: #7aa7b0 0.72vh;
  border-radius: 0.57vh;
  top: 0.29vh;
}

.anNiu2-un {
  position: relative;
  float: left;
  padding: 0vh;
  border: #7aa7b0 0.72vh;
  border-radius: 0.57vh;
  top: 0.29vh;
}
</style>
