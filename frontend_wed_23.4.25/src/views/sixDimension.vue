<template>
  <el-row>
    <el-col :span="16">
      <div id="myTreeChart" style="height: 95vh;width: 100%"></div>
      <el-link
          href="https://kns.cnki.net/kcms2/article/abstract?v=3uoqIhG8C447WN1SO36whLpCgh0R0Z-i4Lc0kcI_HPe7ZYqSOTP4QtYFD2mdh9Kc2KPZvSLc9bGhFyu0AgfWPcOsYTyYhuiJ&uniplatform=NZKPT"
          target="_blank">田常俊. 基于患者体验的医疗服务质量评价研究[D].华中科技大学,2014.
      </el-link>
    </el-col>
    <el-col :span="8">
      <div class="posts">
        <div v-if="postType=='未选择'&&words.length==0" class="postType">
          <h4><span><el-icon size="25" style="margin-top: 20px" color="rgba(12, 168, 138, 0.8)"><InfoFilled/></el-icon></span>&nbsp;可点击树图筛选
          </h4>
        </div>
        <div v-else class="postType">
          <h4>共筛选出<span style="font-size: large;color: rgb(12, 168, 138)">&nbsp;{{
              filterPosts.length
            }}&nbsp;</span>条帖子
          </h4>
        </div>
        <!--        时间选择-->
        <div>
          <div v-for="(item,index) in dateType" :key="item" @click="getDateType(index)"
               :class="dateTypeSelectedIndex==index?'dateTypeSelected':'dateTypeSelect'">
            <span style="font-size: 12px;">{{ item }}</span>
          </div>
        </div>
        <el-tag v-if="postType!='未选择'">{{ postType }}</el-tag>
        <el-tag
            style="color: #494949"
            v-for="item in words"
            :key="item"
            :color="item.color"
            class="mx-1"
            closable
            @close="closeWord(item.word)"
        >
          {{ item.word }}
        </el-tag>
        <el-scrollbar height="70vh">
          <div v-for="item in filterPosts" :key="item">
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
import * as echarts from "echarts";
import {toRaw} from "vue";
import axios from "axios";
import Highlighter from "vue-highlight-words";

export default {
  name: "sixDimension",
  components: {
    Highlighter
  },
  computed: {
    keywords() {
      let wordsOnly = []
      for (let key in this.words) {
        wordsOnly.push(this.words[key]["word"])
      }
      return wordsOnly
    }
  },
  data() {
    this.treeChart = null
    this.youxinChildren = []
    this.kekaoChildren = []
    this.fanyingChildren = []
    this.baozhengChildren = []
    this.guanhuaiChildren = []
    this.lianxvChildren = []
    return {
      //六维帖子
      words1: ['外部建筑', '硬件设施', '环境', '规模', '面积', '大楼', '线路', '建筑', '大厅', '建设', '装修', '规划', '交通', '指示', '指向', '指示牌', '指示路牌', '标示', '硬件', '设施', '硬件设备', '设备', '设施设备', '车位', '停车场', '停车', '排队停车', '科室', '仪器', '卫生', '通风系统', '厕所', '卫生间', '条件', '医疗条件', '输液室', '等候座位', '等位区', '管理', '管理水平', '防护措施', '保护措施', '防控', '防控工作', '安检'],
      words2: ['态度', '服务', '服务态度', '脾气', '医德', '道德', '人品', '素质', '医生', '医师', '护士', '大夫', '服务人员', '工作人员', '医务人员', '抽血人员', '收银员', '检测医师', '脑外科医生', '骨科医生', '保安', '保安大叔', '交流', '说话水平', '说话', '诊疗和服务质量', '床位', '开药', '看病', '看诊', '问诊', '餐食', '价格', '收费', '消费'],
      words3: ['诊疗流程', '服务效率和便捷性', '检验项目', '流程', '过程', '程序', '环节', '安排', '秩序', '安排', '效率', '速度', '排队', '排队时间', '队伍', '挂号', '挂号排队', '挂号处', '挂号窗口', '叫号', '叫号系统', '排号', '叫号速度', '人', '人数', '人员', '病人', '患者', '配药', '取药窗口', '自助机器', '自助挂号机', '体验', '体验感', '登记', '付费', '付款', '支付', '收费处', '结算', '检查', '验血', 'b超', '磁共振', 'Ct', 'ct', '拍片'],
      words4: ['诊疗效果', '医术', '专业性', '技术', '水平', '专业', '专业能力', '医疗水平', '医技水平', '专业度', '医技', '医术水平', '手法', '效果', '疗效', '治疗', '经验', '药', '药品', '手术'],
      words5: ['特殊需求', '隐私保护', '孕妇', '老人', '军人', '军人家属', '军属', '残疾人', '老年人', '尊严', '隐私'],
      words6: ['诊后服务', '出院', '出院后', '术后'],
      posts1: [],
      posts2: [],
      posts3: [],
      posts4: [],
      posts5: [],
      posts6: [],
      lowerLimit: [10, 10, 10, 10, 5, 0],
      words: [],
      sixDimension: ["有形性", "可靠性", "反应性", "保证性", "连续性", "关怀性"],
      postNegNumList: [0, 0, 0, 0, 0, 0],
      yearColorList:['#90ce71','#ef9494','#acc5a0','#9bcc82'
        ,'#ef7f7f','#ecbbbb'],
      monthColorList:['#89d066','#ea9e9e','#a8c49a','#98cb80',
        '#78b7f8','#78b7f8'],
      weekColorList:['#f57d7d','#f1a6a6','#acc79f','#99cc7f',
        '#89d066','#8f8f8f'],
      colorList: ['#90ce71','#ef9494','#acc5a0','#9bcc82'
        ,'#ef7f7f','#ecbbbb'],
      posColor: 'rgba(137,208,102,0.5)',
      negColor: 'rgba(245,108,108,0.5)',
      unknownColor: 'rgba(154,154,154,0.5)',
      postType: "未选择",
      postList: [],
      filterPosts: [],
      dateType: ["近一年", "近一月", "近一周"],
      dateTypeSelectedIndex: 0,
      weekStartDate: "",
      weekEndDate: "",
      monthStartDate: "",
      monthEndDate: "",
      yearStartDate: "",
      yearEndDate: "",
      startDate: "",
      endDate: "",
    }
  },
  created() {
    var that = this
    //为给定 ID 的 user 创建请求
    axios.get('/api/cgi-bin/token?grant_type=client_credential&appid=wx608d64d0acc25f28&secret=feb0adc1b0822221b6cbd6b29d889698')
        .then(function (response) {
          //console.log(response.data.access_token);
          that.access_token = response.data.access_token
        })
        .catch(function (error) {
          console.log(error);
        });
    //获取时间
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
  },
  mounted() {
    this.initTreeEcharts()
  },
  methods: {
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
    routeToDetail(_id) {
      console.log(_id)
      this.$router.push({name: 'postDetailView', params: {postId: _id}});
    },
    closeWord(word) {
      this.words = this.words.filter(item => (item.word != word))
      this.filterPosts = []
      //词语筛选帖子
      for (let k in this.postList) {
        let flag = true
        for (let key in this.words) {
          if (this.postList[k]['detail'].search(this.words[key]["word"]) == -1) {
            flag = false
          }
        }
        if (flag) {
          this.filterPosts.push(this.postList[k])
        }
      }

    },
    getAndHandlePost() {
      let that = this
      that.postList = []
      that.filterPosts = []
      that.posts1 = []
      that.youxinChildren = []
      that.posts2 = []
      that.kekaoChildren = []
      that.posts3 = []
      that.fanyingChildren = []
      that.posts4 = []
      that.baozhengChildren = []
      that.posts5 = []
      that.guanhuaiChildren = []
      that.posts6 = []
      that.lianxvChildren = []
      that.postNegNumList=[0, 0, 0, 0, 0, 0]
      //that.colorList=[]
      axios.get('/api/cgi-bin/token?grant_type=client_credential&appid=wx608d64d0acc25f28&secret=feb0adc1b0822221b6cbd6b29d889698')
          .then(function (response) {
            //console.log(response.data.access_token);
            that.access_token = response.data.access_token
            // 在这里面插入必须在后面执行的代码
            let queryDate = "date:db.command.gte('" + that.startDate + "').and(db.command.lte('" + that.endDate + "'))"
            let queryLanguageCount = "db.collection(\"post\").where({" + queryDate + "}).count()"
            axios.post('/api/tcb/databasequery?access_token=' + that.access_token, {
                  "env": "cloud-2023-jisai-7ft7ahc87f5c949",
                  "query": queryLanguageCount
                }
            ).then(function (response) {
              console.log("queryLanguageCount", response.data.pager.Total)
              //第一次获取
              let queryLanguage = "db.collection(\"post\").where({" + queryDate + "}).limit(1000).orderBy('date','desc').get()"
              axios.post('/api/tcb/databasequery?access_token=' + that.access_token, {
                    "env": "cloud-2023-jisai-7ft7ahc87f5c949",
                    "query": queryLanguage
                  }
              )
                  .then(function (response) {
                    // console.log('queryLanguage',queryLanguage)
                    // console.log("post1", response.data.data);
                    for (let k in response.data.data) {
                      that.postList.push(JSON.parse(response.data.data[k]))
                      that.filterPosts.push(JSON.parse(response.data.data[k]))
                      //console.log('有形性')
                      let flag1 = false
                      if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"] != undefined) {
                        for (let sx1 in JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"])
                          for (let w1 in that.words1) {
                            if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx1]["text"] == that.words1[w1]) {
                              flag1 = true
                              //************************  处理that.youxinChildren
                              let flag = false//实体是否已被记录在youxinChildren中
                              for (let st in that.youxinChildren) {
                                if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx1]["text"] == that.youxinChildren[st]["name"]) {
                                  if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx1]["relations"] != undefined) {
                                    let gdobj11 = new Object()
                                    if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx1]["relations"]["观点词"] != undefined) {
                                      gdobj11.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx1]["relations"]["观点词"][0]["text"]
                                    } else {
                                      gdobj11.name = "无"
                                    }
                                    gdobj11.symbolSize = 20
                                    if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx1]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                      gdobj11.lineStyle = {"color": that.unknownColor}
                                      gdobj11.itemStyle = {"borderColor": that.unknownColor, "color": that.unknownColor}
                                    } else if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx1]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                      gdobj11.lineStyle = {"color": that.posColor}
                                      gdobj11.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                    } else {
                                      gdobj11.lineStyle = {"color": that.negColor}
                                      gdobj11.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                    }
                                    that.youxinChildren[st]["children"].push(gdobj11)
                                  }
                                  flag = true
                                }
                              }
                              //如果之前没被记录，把实体和对应观点词加进来
                              if (flag == false) {
                                let stobj1 = new Object()
                                stobj1.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx1]["text"]
                                stobj1.children = []
                                if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx1]["relations"] != undefined) {
                                  let gdobj12 = new Object()
                                  if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx1]["relations"]["观点词"] != undefined) {
                                    gdobj12.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx1]["relations"]["观点词"][0]["text"]
                                  } else {
                                    gdobj12.name = "无"
                                  }
                                  gdobj12.symbolSize = 20
                                  if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx1]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                    gdobj12.lineStyle = {"color": that.unknownColor}
                                    gdobj12.itemStyle = {"borderColor": that.unknownColor, "color": that.unknownColor}
                                  } else if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx1]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                    gdobj12.lineStyle = {"color": that.posColor}
                                    gdobj12.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                  } else {
                                    gdobj12.lineStyle = {"color": that.negColor}
                                    gdobj12.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                  }
                                  stobj1.children.push(gdobj12)
                                }
                                that.youxinChildren.push(stobj1)
                              }
                            }
                          }
                      }
                      if (flag1 == true) {
                        that.posts1.push(JSON.parse(response.data.data[k]))
                        if (JSON.parse(response.data.data[k])["score"] < 0.4) {
                          that.postNegNumList[0] += 1
                        }
                      }
                      //console.log('youxinChildren', that.youxinChildren)
                      //可靠性
                      //console.log('可靠性')
                      let flag2 = false
                      if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"] != undefined) {
                        for (let sx2 in JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"])
                          for (let w2 in that.words2) {
                            if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx2]["text"] == that.words2[w2]) {
                              flag2 = true
                              //************************that.kekaoChildren
                              let flag = false//实体是否已被记录在kekaoChildren中
                              for (let st in that.kekaoChildren) {
                                if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx2]["text"] == that.kekaoChildren[st]["name"]) {
                                  if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx2]["relations"] != undefined) {
                                    let gdobj21 = new Object()
                                    if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx2]["relations"]["观点词"] != undefined) {
                                      gdobj21.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx2]["relations"]["观点词"][0]["text"]
                                    } else {
                                      gdobj21.name = "无"
                                    }
                                    gdobj21.symbolSize = 20
                                    if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx2]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                      gdobj21.lineStyle = {"color": that.unknownColor}
                                      gdobj21.itemStyle = {"borderColor": that.unknownColor, "color": that.unknownColor}
                                    } else if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx2]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                      gdobj21.lineStyle = {"color": that.posColor}
                                      gdobj21.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                    } else {
                                      gdobj21.lineStyle = {"color": that.negColor}
                                      gdobj21.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                    }
                                    that.kekaoChildren[st]["children"].push(gdobj21)
                                  }
                                  flag = true
                                }
                              }
                              //如果之前没被记录，把实体和对应观点词加进来
                              if (flag == false) {
                                let stobj2 = new Object()
                                stobj2.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx2]["text"]
                                stobj2.children = []
                                if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx2]["relations"] != undefined) {
                                  let gdobj22 = new Object()
                                  if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx2]["relations"]["观点词"] != undefined) {
                                    gdobj22.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx2]["relations"]["观点词"][0]["text"]
                                  } else {
                                    gdobj22.name = "无"
                                  }
                                  gdobj22.symbolSize = 20
                                  if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx2]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                    gdobj22.lineStyle = {"color": that.unknownColor}
                                    gdobj22.itemStyle = {"borderColor": that.unknownColor, "color": that.unknownColor}
                                  } else if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx2]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                    gdobj22.lineStyle = {"color": that.posColor}
                                    gdobj22.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                  } else {
                                    gdobj22.lineStyle = {"color": that.negColor}
                                    gdobj22.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                  }
                                  stobj2.children.push(gdobj22)
                                }
                                that.kekaoChildren.push(stobj2)
                              }
                            }
                          }
                      }
                      if (flag2 == true) {
                        that.posts2.push(JSON.parse(response.data.data[k]))
                        if (JSON.parse(response.data.data[k])["score"] < 0.4) {
                          that.postNegNumList[1] += 1
                        }
                      }
                      //反应性
                      //console.log('反应性')
                      let flag3 = false
                      if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"] != undefined) {
                        for (let sx3 in JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"])
                          for (let w3 in that.words3) {
                            if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx3]["text"] == that.words3[w3]) {
                              flag3 = true
                              let flag = false//实体是否已被记录在fanyingChildren中
                              for (let st in that.fanyingChildren) {
                                if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx3]["text"] == that.fanyingChildren[st]["name"]) {
                                  if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx3]["relations"] != undefined) {
                                    let gdobj31 = new Object()
                                    if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx3]["relations"]["观点词"] != undefined) {
                                      gdobj31.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx3]["relations"]["观点词"][0]["text"]
                                    } else {
                                      gdobj31.name = "无"
                                    }
                                    gdobj31.symbolSize = 20
                                    if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx3]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                      gdobj31.lineStyle = {"color": that.unknownColor}
                                      gdobj31.itemStyle = {"borderColor": that.unknownColor, "color": that.unknownColor}
                                    } else if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx3]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                      gdobj31.lineStyle = {"color": that.posColor}
                                      gdobj31.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                    } else {
                                      gdobj31.lineStyle = {"color": that.negColor}
                                      gdobj31.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                    }
                                    that.fanyingChildren[st]["children"].push(gdobj31)
                                  }
                                  flag = true
                                }
                              }
                              //如果之前没被记录，把实体和对应观点词加进来
                              if (flag == false) {
                                let stobj3 = new Object()
                                stobj3.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx3]["text"]
                                stobj3.children = []
                                //console.log("之前没记录过")
                                //console.log(JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx3])
                                if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx3]["relations"] != undefined) {
                                  let gdobj32 = new Object()
                                  if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx3]["relations"]["观点词"] != undefined) {
                                    gdobj32.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx3]["relations"]["观点词"][0]["text"]
                                  } else {
                                    gdobj32.name = "无"
                                  }
                                  gdobj32.symbolSize = 20
                                  if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx3]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                    gdobj32.lineStyle = {"color": that.unknownColor}
                                    gdobj32.itemStyle = {"borderColor": that.unknownColor, "color": that.unknownColor}
                                  } else if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx3]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                    gdobj32.lineStyle = {"color": that.posColor}
                                    gdobj32.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                  } else {
                                    gdobj32.lineStyle = {"color": that.negColor}
                                    gdobj32.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                  }
                                  stobj3.children.push(gdobj32)
                                }
                                that.fanyingChildren.push(stobj3)
                              }
                            }
                          }
                      }
                      if (flag3 == true) {
                        that.posts3.push(JSON.parse(response.data.data[k]))
                        if (JSON.parse(response.data.data[k])["score"] < 0.4) {
                          that.postNegNumList[2] += 1
                        }
                      }
                      //保证性
                      //console.log('保证性-CHildren-qian',that.baozhengChildren)
                      let flag4 = false
                      if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"] != undefined) {
                        for (let sx4 in JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"])
                          for (let w4 in that.words4) {
                            if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx4]["text"] == that.words4[w4]) {
                              flag4 = true
                              let flag = false//实体是否已被记录在baozhengChildren中
                              for (let st in that.baozhengChildren) {
                                if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx4]["text"] == that.baozhengChildren[st]["name"]) {
                                  if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx4]["relations"] != undefined) {
                                    let gdobj41 = new Object()
                                    if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx4]["relations"]["观点词"] != undefined) {
                                      gdobj41.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx4]["relations"]["观点词"][0]["text"]
                                    } else {
                                      gdobj41.name = "无"
                                    }
                                    gdobj41.symbolSize = 20
                                    if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx4]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                      gdobj41.lineStyle = {"color": that.unknownColor}
                                      gdobj41.itemStyle = {"borderColor": that.unknownColor, "color": that.unknownColor}
                                    } else if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx4]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                      gdobj41.lineStyle = {"color": that.posColor}
                                      gdobj41.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                    } else {
                                      gdobj41.lineStyle = {"color": that.negColor}
                                      gdobj41.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                    }
                                    that.baozhengChildren[st]["children"].push(gdobj41)
                                  }
                                  flag = true
                                }
                              }
                              //如果之前没被记录，把实体和对应观点词加进来
                              if (flag == false) {
                                let stobj4 = new Object()
                                stobj4.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx4]["text"]
                                stobj4.children = []
                                //console.log("之前没记录过")
                                //console.log(JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx4])
                                if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx4]["relations"] != undefined) {
                                  let gdobj42 = new Object()
                                  if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx4]["relations"]["观点词"] != undefined) {
                                    gdobj42.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx4]["relations"]["观点词"][0]["text"]
                                  } else {
                                    gdobj42.name = "无"
                                  }
                                  gdobj42.symbolSize = 20
                                  if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx4]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                    gdobj42.lineStyle = {"color": that.unknownColor}
                                    gdobj42.itemStyle = {"borderColor": that.unknownColor, "color": that.unknownColor}
                                  } else if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx4]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                    gdobj42.lineStyle = {"color": that.posColor}
                                    gdobj42.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                  } else {
                                    gdobj42.lineStyle = {"color": that.negColor}
                                    gdobj42.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                  }
                                  stobj4.children.push(gdobj42)
                                }
                                that.baozhengChildren.push(stobj4)
                              }
                            }
                          }
                      }
                      if (flag4 == true) {
                        // console.log('保证性-CHildren',that.baozhengChildren)
                        // console.log('保证性-帖子',JSON.parse(response.data.data[k]))
                        that.posts4.push(JSON.parse(response.data.data[k]))
                        if (JSON.parse(response.data.data[k])["score"] < 0.4) {
                          that.postNegNumList[3] += 1
                        }
                      }
                      //关怀性
                      //console.log('关怀性')
                      let flag5 = false
                      //[shuxing]字段
                      if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"] != undefined) {
                        for (let sx5 in JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"])
                          for (let w5 in that.words5) {
                            if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx5]["text"] == that.words5[w5]) {
                              flag5 = true
                              let flag = false//实体是否已被记录在guanhuaiChildren中
                              for (let st in that.guanhuaiChildren) {
                                if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx5]["text"] == that.guanhuaiChildren[st]["name"]) {
                                  if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx5]["relations"] != undefined) {
                                    let gdobj51 = new Object()
                                    if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx5]["relations"]["观点词"] != undefined) {
                                      gdobj51.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx5]["relations"]["观点词"][0]["text"]
                                    } else {
                                      gdobj51.name = "无"
                                    }
                                    gdobj51.symbolSize = 20
                                    if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx5]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                      gdobj51.lineStyle = {"color": that.unknownColor}
                                      gdobj51.itemStyle = {"borderColor": that.unknownColor, "color": that.unknownColor}
                                    } else if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx5]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                      gdobj51.lineStyle = {"color": that.posColor}
                                      gdobj51.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                    } else {
                                      gdobj51.lineStyle = {"color": that.negColor}
                                      gdobj51.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                    }
                                    that.guanhuaiChildren[st]["children"].push(gdobj51)
                                  }
                                  flag = true
                                }
                              }
                              //如果之前没被记录，把实体和对应观点词加进来
                              if (flag == false) {
                                let stobj5 = new Object()
                                stobj5.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx5]["text"]
                                stobj5.lineStyle = {"color": '#89d066'}
                                stobj5.itemStyle = {"borderColor": '#1c1e1c', "color": '#89d066'}
                                stobj5.children = []
                                if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx5]["relations"] != undefined) {
                                  let gdobj52 = new Object()
                                  if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx5]["relations"]["观点词"] != undefined) {
                                    gdobj52.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx5]["relations"]["观点词"][0]["text"]
                                  } else {
                                    gdobj52.name = "无"
                                  }
                                  gdobj52.symbolSize = 20
                                  if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx5]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                    gdobj52.lineStyle = {"color": that.unknownColor}
                                    gdobj52.itemStyle = {"borderColor": that.unknownColor, "color": that.unknownColor}
                                  } else if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx5]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                    gdobj52.lineStyle = {"color": that.posColor}
                                    gdobj52.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                  } else {
                                    gdobj52.lineStyle = {"color": that.negColor}
                                    gdobj52.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                  }
                                  stobj5.children.push(gdobj52)
                                }
                                that.guanhuaiChildren.push(stobj5)
                              }
                            }
                          }
                      }
                      //******************************************************[guanhuai]
                      // console.log("guanhuai", k, JSON.parse(JSON.parse(response.data.data[k])['guanhuai'])["评价维度"])
                      // console.log("!!!!!!!!", k, JSON.parse(response.data.data[k]))
                      if (JSON.parse(JSON.parse(response.data.data[k])['guanhuai'])["评价维度"] != undefined) {
                        for (let sx5 in JSON.parse(JSON.parse(response.data.data[k])['guanhuai'])["评价维度"])
                          for (let w5 in that.words5) {
                            if (JSON.parse(JSON.parse(response.data.data[k])['guanhuai'])["评价维度"][sx5]["text"] == that.words5[w5]) {
                              flag5 = true
                              let flag = false//实体是否已被记录在guanhuaiChildren中
                              for (let st in that.guanhuaiChildren) {
                                if (JSON.parse(JSON.parse(response.data.data[k])['guanhuai'])["评价维度"][sx5]["text"] == that.guanhuaiChildren[st]["name"]) {
                                  if (JSON.parse(JSON.parse(response.data.data[k])['guanhuai'])["评价维度"][sx5]["relations"] != undefined) {
                                    let gdobj51 = new Object()
                                    gdobj51.name = "无"
                                    gdobj51.symbolSize = 20
                                    if (JSON.parse(JSON.parse(response.data.data[k])['guanhuai'])["评价维度"][sx5]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                      gdobj51.lineStyle = {"color": that.unknownColor}
                                      gdobj51.itemStyle = {"borderColor": that.unknownColor, "color": that.unknownColor}
                                    } else if (JSON.parse(JSON.parse(response.data.data[k])['guanhuai'])["评价维度"][sx5]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                      gdobj51.lineStyle = {"color": that.posColor}
                                      gdobj51.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                    } else {
                                      gdobj51.lineStyle = {"color": that.negColor}
                                      gdobj51.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                    }
                                    that.guanhuaiChildren[st]["children"].push(gdobj51)
                                  }
                                  flag = true
                                }
                              }
                              //如果之前没被记录，把实体和对应观点词加进来
                              if (flag == false) {
                                let stobj5 = new Object()
                                stobj5.name = JSON.parse(JSON.parse(response.data.data[k])['guanhuai'])["评价维度"][sx5]["text"]
                                stobj5.children = []
                                if (JSON.parse(JSON.parse(response.data.data[k])['guanhuai'])["评价维度"][sx5]["relations"] != undefined) {
                                  let gdobj52 = new Object()
                                  gdobj52.name = "无"
                                  gdobj52.symbolSize = 20
                                  if (JSON.parse(JSON.parse(response.data.data[k])['guanhuai'])["评价维度"][sx5]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                    gdobj52.lineStyle = {"color": that.unknownColor}
                                    gdobj52.itemStyle = {"borderColor": that.unknownColor, "color": that.unknownColor}
                                  } else if (JSON.parse(JSON.parse(response.data.data[k])['guanhuai'])["评价维度"][sx5]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                    gdobj52.lineStyle = {"color": that.posColor}
                                    gdobj52.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                  } else {
                                    gdobj52.lineStyle = {"color": that.negColor}
                                    gdobj52.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                  }
                                  stobj5.children.push(gdobj52)
                                }
                                that.guanhuaiChildren.push(stobj5)
                              }
                            }
                          }
                      }
                      //*******************************************************
                      if (flag5 == true) {
                        that.posts5.push(JSON.parse(response.data.data[k]))
                        if (JSON.parse(response.data.data[k])["score"] < 0.4) {
                          that.postNegNumList[4] += 1
                        }
                      }
                      //连续性
                      //console.log('连续性')
                      let flag6 = false
                      if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"] != undefined) {
                        for (let sx6 in JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"])
                          for (let w6 in that.words6) {
                            if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx6]["text"] == that.words6[w6]) {
                              flag6 = true
                              let flag = false//实体是否已被记录在lianxvChildren中
                              for (let st in that.lianxvChildren) {
                                if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx6]["text"] == that.lianxvChildren[st]["name"]) {
                                  let gdobj61 = new Object()
                                  if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx6]["relations"] != undefined) {
                                    if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx6]["relations"]["观点词"] != undefined) {
                                      gdobj61.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx6]["relations"]["观点词"][0]["text"]
                                    } else {
                                      gdobj61.name = '无'
                                    }
                                    gdobj61.symbolSize = 20
                                    if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx6]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                      gdobj61.lineStyle = {"color": that.unknownColor}
                                      gdobj61.itemStyle = {"borderColor": that.unknownColor, "color": that.unknownColor}
                                    } else if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx6]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                      gdobj61.lineStyle = {"color": that.posColor}
                                      gdobj61.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                    } else {
                                      gdobj61.lineStyle = {"color": that.negColor}
                                      gdobj61.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                    }
                                    that.lianxvChildren[st]["children"].push(gdobj61)
                                  }
                                  flag = true
                                }
                              }
                              //如果之前没被记录，把实体和对应观点词加进来
                              if (flag == false) {
                                let stobj6 = new Object()
                                stobj6.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx6]["text"]
                                stobj6.children = []
                                //console.log("之前没记录过【lianxv字段】")
                                //console.log(JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx6])
                                if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx6]["relations"] != undefined) {
                                  let gdobj62 = new Object()
                                  if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx6]["relations"]["观点词"] != undefined) {
                                    gdobj62.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx6]["relations"]["观点词"][0]["text"]
                                  } else {
                                    gdobj62.name = "无"
                                  }
                                  gdobj62.symbolSize = 20
                                  if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx6]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                    gdobj62.lineStyle = {"color": that.unknownColor}
                                    gdobj62.itemStyle = {"borderColor": that.unknownColor, "color": that.unknownColor}
                                  } else if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx6]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                    gdobj62.lineStyle = {"color": that.posColor}
                                    gdobj62.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                  } else {
                                    gdobj62.lineStyle = {"color": that.negColor}
                                    gdobj62.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                  }
                                  stobj6.children.push(gdobj62)
                                }
                                that.lianxvChildren.push(stobj6)
                              }
                            }
                          }
                      }
                      //******************************************************[lianxv]
                      if (JSON.parse(JSON.parse(response.data.data[k])['lianxu'])["评价维度"] != undefined) {
                        for (let sx6 in JSON.parse(JSON.parse(response.data.data[k])['lianxu'])["评价维度"])
                          for (let w6 in that.words6) {
                            if (JSON.parse(JSON.parse(response.data.data[k])['lianxu'])["评价维度"][sx6]["text"] == that.words6[w6]) {
                              flag6 = true
                              let flag = false//实体是否已被记录在lianxvChildren中
                              for (let st in that.lianxvChildren) {
                                if (JSON.parse(JSON.parse(response.data.data[k])['lianxu'])["评价维度"][sx6]["text"] == that.lianxvChildren[st]["name"]) {
                                  if (JSON.parse(JSON.parse(response.data.data[k])['lianxu'])["评价维度"][sx6]["relations"] != undefined) {
                                    let gdobj61 = new Object()
                                    gdobj61.name = '无'
                                    gdobj61.symbolSize = 20
                                    if (JSON.parse(JSON.parse(response.data.data[k])['lianxu'])["评价维度"][sx6]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                      gdobj61.lineStyle = {"color": that.unknownColor}
                                      gdobj61.itemStyle = {"borderColor": that.unknownColor, "color": that.unknownColor}
                                    } else if (JSON.parse(JSON.parse(response.data.data[k])['lianxu'])["评价维度"][sx6]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                      gdobj61.lineStyle = {"color": that.posColor}
                                      gdobj61.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                    } else {
                                      gdobj61.lineStyle = {"color": that.negColor}
                                      gdobj61.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                    }
                                    that.lianxvChildren[st]["children"].push(gdobj61)
                                  }
                                  flag = true
                                }
                              }
                              //如果之前没被记录，把实体和对应观点词加进来
                              if (flag == false) {
                                let stobj6 = new Object()
                                stobj6.name = JSON.parse(JSON.parse(response.data.data[k])['lianxu'])["评价维度"][sx6]["text"]
                                stobj6.children = []
                                if (JSON.parse(JSON.parse(response.data.data[k])['lianxu'])["评价维度"][sx6]["relations"] != undefined) {
                                  let gdobj62 = new Object()
                                  gdobj62.name = "无"
                                  gdobj62.symbolSize = 20
                                  if (JSON.parse(JSON.parse(response.data.data[k])['lianxu'])["评价维度"][sx6]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                    gdobj62.lineStyle = {"color": that.unknownColor}
                                    gdobj62.itemStyle = {"borderColor": that.unknownColor, "color": that.unknownColor}
                                  } else if (JSON.parse(JSON.parse(response.data.data[k])['lianxu'])["评价维度"][sx6]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                    gdobj62.lineStyle = {"color": that.posColor}
                                    gdobj62.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                  } else {
                                    gdobj62.lineStyle = {"color": that.negColor}
                                    gdobj62.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                  }
                                  stobj6.children.push(gdobj62)
                                }
                                that.lianxvChildren.push(stobj6)
                              }
                            }
                          }
                      }
                      if (flag6 == true) {
                        that.posts6.push(JSON.parse(response.data.data[k]))
                        if (JSON.parse(response.data.data[k])["score"] < 0.4) {
                          that.postNegNumList[5] += 1
                        }
                      }
                    }
                    console.log('that.posts1', that.posts1)
                    console.log('that.posts2', that.posts2)
                    console.log('that.posts3', that.posts3)
                    console.log('that.posts4', that.posts4)
                    console.log('that.posts5', that.posts5)
                    console.log('that.posts6', that.posts6)
                    //第二次获取
                    if (response.data.pager.Total > 1000) {
                      let queryLanguage2 = "db.collection(\"post\").where({" + queryDate + "}).skip(1000).limit(1000).orderBy('date','desc').get()"
                      axios.post('/api/tcb/databasequery?access_token=' + that.access_token, {
                            "env": "cloud-2023-jisai-7ft7ahc87f5c949",
                            "query": queryLanguage2
                          }
                      )
                          .then(function (response) {
                            // console.log('queryLanguage',queryLanguage)
                            // console.log("post1", response.data.data);
                            for (let k in response.data.data) {
                              that.postList.push(JSON.parse(response.data.data[k]))
                              that.filterPosts.push(JSON.parse(response.data.data[k]))
                              //console.log('有形性')
                              let flag1 = false
                              if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"] != undefined) {
                                for (let sx1 in JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"])
                                  for (let w1 in that.words1) {
                                    if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx1]["text"] == that.words1[w1]) {
                                      flag1 = true
                                      //************************  处理that.youxinChildren
                                      let flag = false//实体是否已被记录在youxinChildren中
                                      for (let st in that.youxinChildren) {
                                        if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx1]["text"] == that.youxinChildren[st]["name"]) {
                                          if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx1]["relations"] != undefined) {
                                            let gdobj11 = new Object()
                                            if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx1]["relations"]["观点词"] != undefined) {
                                              gdobj11.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx1]["relations"]["观点词"][0]["text"]
                                            } else {
                                              gdobj11.name = "无"
                                            }
                                            gdobj11.symbolSize = 20
                                            if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx1]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                              gdobj11.lineStyle = {"color": that.unknownColor}
                                              gdobj11.itemStyle = {
                                                "borderColor": that.unknownColor,
                                                "color": that.unknownColor
                                              }
                                            } else if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx1]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                              gdobj11.lineStyle = {"color": that.posColor}
                                              gdobj11.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                            } else {
                                              gdobj11.lineStyle = {"color": that.negColor}
                                              gdobj11.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                            }
                                            that.youxinChildren[st]["children"].push(gdobj11)
                                          }
                                          flag = true
                                        }
                                      }
                                      //如果之前没被记录，把实体和对应观点词加进来
                                      if (flag == false) {
                                        let stobj1 = new Object()
                                        stobj1.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx1]["text"]
                                        stobj1.children = []
                                        if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx1]["relations"] != undefined) {
                                          let gdobj12 = new Object()
                                          if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx1]["relations"]["观点词"] != undefined) {
                                            gdobj12.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx1]["relations"]["观点词"][0]["text"]
                                          } else {
                                            gdobj12.name = "无"
                                          }
                                          gdobj12.symbolSize = 20
                                          if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx1]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                            gdobj12.lineStyle = {"color": that.unknownColor}
                                            gdobj12.itemStyle = {
                                              "borderColor": that.unknownColor,
                                              "color": that.unknownColor
                                            }
                                          } else if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx1]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                            gdobj12.lineStyle = {"color": that.posColor}
                                            gdobj12.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                          } else {
                                            gdobj12.lineStyle = {"color": that.negColor}
                                            gdobj12.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                          }
                                          stobj1.children.push(gdobj12)
                                        }
                                        that.youxinChildren.push(stobj1)
                                      }
                                    }
                                  }
                              }
                              if (flag1 == true) {
                                that.posts1.push(JSON.parse(response.data.data[k]))
                                if (JSON.parse(response.data.data[k])["score"] < 0.4) {
                                  that.postNegNumList[0] += 1
                                }
                              }
                              //console.log('youxinChildren', that.youxinChildren)
                              //可靠性
                              //console.log('可靠性')
                              let flag2 = false
                              if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"] != undefined) {
                                for (let sx2 in JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"])
                                  for (let w2 in that.words2) {
                                    if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx2]["text"] == that.words2[w2]) {
                                      flag2 = true
                                      //************************that.kekaoChildren
                                      let flag = false//实体是否已被记录在kekaoChildren中
                                      for (let st in that.kekaoChildren) {
                                        if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx2]["text"] == that.kekaoChildren[st]["name"]) {
                                          if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx2]["relations"] != undefined) {
                                            let gdobj21 = new Object()
                                            if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx2]["relations"]["观点词"] != undefined) {
                                              gdobj21.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx2]["relations"]["观点词"][0]["text"]
                                            } else {
                                              gdobj21.name = "无"
                                            }
                                            gdobj21.symbolSize = 20
                                            if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx2]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                              gdobj21.lineStyle = {"color": that.unknownColor}
                                              gdobj21.itemStyle = {
                                                "borderColor": that.unknownColor,
                                                "color": that.unknownColor
                                              }
                                            } else if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx2]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                              gdobj21.lineStyle = {"color": that.posColor}
                                              gdobj21.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                            } else {
                                              gdobj21.lineStyle = {"color": that.negColor}
                                              gdobj21.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                            }
                                            that.kekaoChildren[st]["children"].push(gdobj21)
                                          }
                                          flag = true
                                        }
                                      }
                                      //如果之前没被记录，把实体和对应观点词加进来
                                      if (flag == false) {
                                        let stobj2 = new Object()
                                        stobj2.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx2]["text"]
                                        stobj2.children = []
                                        if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx2]["relations"] != undefined) {
                                          let gdobj22 = new Object()
                                          if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx2]["relations"]["观点词"] != undefined) {
                                            gdobj22.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx2]["relations"]["观点词"][0]["text"]
                                          } else {
                                            gdobj22.name = "无"
                                          }
                                          gdobj22.symbolSize = 20
                                          if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx2]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                            gdobj22.lineStyle = {"color": that.unknownColor}
                                            gdobj22.itemStyle = {
                                              "borderColor": that.unknownColor,
                                              "color": that.unknownColor
                                            }
                                          } else if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx2]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                            gdobj22.lineStyle = {"color": that.posColor}
                                            gdobj22.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                          } else {
                                            gdobj22.lineStyle = {"color": that.negColor}
                                            gdobj22.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                          }
                                          stobj2.children.push(gdobj22)
                                        }
                                        that.kekaoChildren.push(stobj2)
                                      }
                                    }
                                  }
                              }
                              if (flag2 == true) {
                                that.posts2.push(JSON.parse(response.data.data[k]))
                                if (JSON.parse(response.data.data[k])["score"] < 0.4) {
                                  that.postNegNumList[1] += 1
                                }
                              }
                              //反应性
                              //console.log('反应性')
                              let flag3 = false
                              if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"] != undefined) {
                                for (let sx3 in JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"])
                                  for (let w3 in that.words3) {
                                    if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx3]["text"] == that.words3[w3]) {
                                      flag3 = true
                                      let flag = false//实体是否已被记录在fanyingChildren中
                                      for (let st in that.fanyingChildren) {
                                        if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx3]["text"] == that.fanyingChildren[st]["name"]) {
                                          if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx3]["relations"] != undefined) {
                                            let gdobj31 = new Object()
                                            if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx3]["relations"]["观点词"] != undefined) {
                                              gdobj31.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx3]["relations"]["观点词"][0]["text"]
                                            } else {
                                              gdobj31.name = "无"
                                            }
                                            gdobj31.symbolSize = 20
                                            if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx3]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                              gdobj31.lineStyle = {"color": that.unknownColor}
                                              gdobj31.itemStyle = {
                                                "borderColor": that.unknownColor,
                                                "color": that.unknownColor
                                              }
                                            } else if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx3]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                              gdobj31.lineStyle = {"color": that.posColor}
                                              gdobj31.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                            } else {
                                              gdobj31.lineStyle = {"color": that.negColor}
                                              gdobj31.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                            }
                                            that.fanyingChildren[st]["children"].push(gdobj31)
                                          }
                                          flag = true
                                        }
                                      }
                                      //如果之前没被记录，把实体和对应观点词加进来
                                      if (flag == false) {
                                        let stobj3 = new Object()
                                        stobj3.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx3]["text"]
                                        stobj3.children = []
                                        //console.log("之前没记录过")
                                        //console.log(JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx3])
                                        if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx3]["relations"] != undefined) {
                                          let gdobj32 = new Object()
                                          if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx3]["relations"]["观点词"] != undefined) {
                                            gdobj32.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx3]["relations"]["观点词"][0]["text"]
                                          } else {
                                            gdobj32.name = "无"
                                          }
                                          gdobj32.symbolSize = 20
                                          if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx3]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                            gdobj32.lineStyle = {"color": that.unknownColor}
                                            gdobj32.itemStyle = {
                                              "borderColor": that.unknownColor,
                                              "color": that.unknownColor
                                            }
                                          } else if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx3]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                            gdobj32.lineStyle = {"color": that.posColor}
                                            gdobj32.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                          } else {
                                            gdobj32.lineStyle = {"color": that.negColor}
                                            gdobj32.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                          }
                                          stobj3.children.push(gdobj32)
                                        }
                                        that.fanyingChildren.push(stobj3)
                                      }
                                    }
                                  }
                              }
                              if (flag3 == true) {
                                that.posts3.push(JSON.parse(response.data.data[k]))
                                if (JSON.parse(response.data.data[k])["score"] < 0.4) {
                                  that.postNegNumList[2] += 1
                                }
                              }
                              //保证性
                              //console.log('保证性')
                              let flag4 = false
                              if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"] != undefined) {
                                for (let sx4 in JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"])
                                  for (let w4 in that.words4) {
                                    if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx4]["text"] == that.words4[w4]) {
                                      flag4 = true
                                      let flag = false//实体是否已被记录在baozhengChildren中
                                      for (let st in that.baozhengChildren) {
                                        if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx4]["text"] == that.baozhengChildren[st]["name"]) {
                                          if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx4]["relations"] != undefined) {
                                            let gdobj41 = new Object()
                                            if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx4]["relations"]["观点词"] != undefined) {
                                              gdobj41.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx4]["relations"]["观点词"][0]["text"]
                                            } else {
                                              gdobj41.name = "无"
                                            }
                                            gdobj41.symbolSize = 20
                                            if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx4]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                              gdobj41.lineStyle = {"color": that.unknownColor}
                                              gdobj41.itemStyle = {
                                                "borderColor": that.unknownColor,
                                                "color": that.unknownColor
                                              }
                                            } else if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx4]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                              gdobj41.lineStyle = {"color": that.posColor}
                                              gdobj41.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                            } else {
                                              gdobj41.lineStyle = {"color": that.negColor}
                                              gdobj41.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                            }
                                            that.baozhengChildren[st]["children"].push(gdobj41)
                                          }
                                          flag = true
                                        }
                                      }
                                      //如果之前没被记录，把实体和对应观点词加进来
                                      if (flag == false) {
                                        let stobj4 = new Object()
                                        stobj4.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx4]["text"]
                                        stobj4.children = []
                                        //console.log("之前没记录过")
                                        //console.log(JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx4])
                                        if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx4]["relations"] != undefined) {
                                          let gdobj42 = new Object()
                                          if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx4]["relations"]["观点词"] != undefined) {
                                            gdobj42.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx4]["relations"]["观点词"][0]["text"]
                                          } else {
                                            gdobj42.name = "无"
                                          }
                                          gdobj42.symbolSize = 20
                                          if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx4]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                            gdobj42.lineStyle = {"color": that.unknownColor}
                                            gdobj42.itemStyle = {
                                              "borderColor": that.unknownColor,
                                              "color": that.unknownColor
                                            }
                                          } else if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx4]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                            gdobj42.lineStyle = {"color": that.posColor}
                                            gdobj42.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                          } else {
                                            gdobj42.lineStyle = {"color": that.negColor}
                                            gdobj42.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                          }
                                          stobj4.children.push(gdobj42)
                                        }
                                        that.baozhengChildren.push(stobj4)
                                      }
                                    }
                                  }
                              }
                              if (flag4 == true) {
                                that.posts4.push(JSON.parse(response.data.data[k]))
                                if (JSON.parse(response.data.data[k])["score"] < 0.4) {
                                  that.postNegNumList[3] += 1
                                }
                              }
                              //关怀性
                              //console.log('关怀性')
                              let flag5 = false
                              //[shuxing]字段
                              if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"] != undefined) {
                                for (let sx5 in JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"])
                                  for (let w5 in that.words5) {
                                    if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx5]["text"] == that.words5[w5]) {
                                      flag5 = true
                                      let flag = false//实体是否已被记录在guanhuaiChildren中
                                      for (let st in that.guanhuaiChildren) {
                                        if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx5]["text"] == that.guanhuaiChildren[st]["name"]) {
                                          if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx5]["relations"] != undefined) {
                                            let gdobj51 = new Object()
                                            if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx5]["relations"]["观点词"] != undefined) {
                                              gdobj51.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx5]["relations"]["观点词"][0]["text"]
                                            } else {
                                              gdobj51.name = "无"
                                            }
                                            gdobj51.symbolSize = 20
                                            if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx5]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                              gdobj51.lineStyle = {"color": that.unknownColor}
                                              gdobj51.itemStyle = {
                                                "borderColor": that.unknownColor,
                                                "color": that.unknownColor
                                              }
                                            } else if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx5]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                              gdobj51.lineStyle = {"color": that.posColor}
                                              gdobj51.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                            } else {
                                              gdobj51.lineStyle = {"color": that.negColor}
                                              gdobj51.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                            }
                                            that.guanhuaiChildren[st]["children"].push(gdobj51)
                                          }
                                          flag = true
                                        }
                                      }
                                      //如果之前没被记录，把实体和对应观点词加进来
                                      if (flag == false) {
                                        let stobj5 = new Object()
                                        stobj5.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx5]["text"]
                                        stobj5.lineStyle = {"color": '#89d066'}
                                        stobj5.itemStyle = {"borderColor": '#1c1e1c', "color": '#89d066'}
                                        stobj5.children = []
                                        if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx5]["relations"] != undefined) {
                                          let gdobj52 = new Object()
                                          if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx5]["relations"]["观点词"] != undefined) {
                                            gdobj52.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx5]["relations"]["观点词"][0]["text"]
                                          } else {
                                            gdobj52.name = "无"
                                          }
                                          gdobj52.symbolSize = 20
                                          if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx5]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                            gdobj52.lineStyle = {"color": that.unknownColor}
                                            gdobj52.itemStyle = {
                                              "borderColor": that.unknownColor,
                                              "color": that.unknownColor
                                            }
                                          } else if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx5]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                            gdobj52.lineStyle = {"color": that.posColor}
                                            gdobj52.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                          } else {
                                            gdobj52.lineStyle = {"color": that.negColor}
                                            gdobj52.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                          }
                                          stobj5.children.push(gdobj52)
                                        }
                                        that.guanhuaiChildren.push(stobj5)
                                      }
                                    }
                                  }
                              }
                              //******************************************************[guanhuai]
                              // console.log("guanhuai", k, JSON.parse(JSON.parse(response.data.data[k])['guanhuai'])["评价维度"])
                              // console.log("!!!!!!!!", k, JSON.parse(response.data.data[k]))
                              if (JSON.parse(JSON.parse(response.data.data[k])['guanhuai'])["评价维度"] != undefined) {
                                for (let sx5 in JSON.parse(JSON.parse(response.data.data[k])['guanhuai'])["评价维度"])
                                  for (let w5 in that.words5) {
                                    if (JSON.parse(JSON.parse(response.data.data[k])['guanhuai'])["评价维度"][sx5]["text"] == that.words5[w5]) {
                                      flag5 = true
                                      let flag = false//实体是否已被记录在guanhuaiChildren中
                                      for (let st in that.guanhuaiChildren) {
                                        if (JSON.parse(JSON.parse(response.data.data[k])['guanhuai'])["评价维度"][sx5]["text"] == that.guanhuaiChildren[st]["name"]) {
                                          if (JSON.parse(JSON.parse(response.data.data[k])['guanhuai'])["评价维度"][sx5]["relations"] != undefined) {
                                            let gdobj51 = new Object()
                                            gdobj51.name = "无"
                                            gdobj51.symbolSize = 20
                                            if (JSON.parse(JSON.parse(response.data.data[k])['guanhuai'])["评价维度"][sx5]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                              gdobj51.lineStyle = {"color": that.unknownColor}
                                              gdobj51.itemStyle = {
                                                "borderColor": that.unknownColor,
                                                "color": that.unknownColor
                                              }
                                            } else if (JSON.parse(JSON.parse(response.data.data[k])['guanhuai'])["评价维度"][sx5]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                              gdobj51.lineStyle = {"color": that.posColor}
                                              gdobj51.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                            } else {
                                              gdobj51.lineStyle = {"color": that.negColor}
                                              gdobj51.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                            }
                                            that.guanhuaiChildren[st]["children"].push(gdobj51)
                                          }
                                          flag = true
                                        }
                                      }
                                      //如果之前没被记录，把实体和对应观点词加进来
                                      if (flag == false) {
                                        let stobj5 = new Object()
                                        stobj5.name = JSON.parse(JSON.parse(response.data.data[k])['guanhuai'])["评价维度"][sx5]["text"]
                                        stobj5.children = []
                                        if (JSON.parse(JSON.parse(response.data.data[k])['guanhuai'])["评价维度"][sx5]["relations"] != undefined) {
                                          let gdobj52 = new Object()
                                          gdobj52.name = "无"
                                          gdobj52.symbolSize = 20
                                          if (JSON.parse(JSON.parse(response.data.data[k])['guanhuai'])["评价维度"][sx5]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                            gdobj52.lineStyle = {"color": that.unknownColor}
                                            gdobj52.itemStyle = {
                                              "borderColor": that.unknownColor,
                                              "color": that.unknownColor
                                            }
                                          } else if (JSON.parse(JSON.parse(response.data.data[k])['guanhuai'])["评价维度"][sx5]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                            gdobj52.lineStyle = {"color": that.posColor}
                                            gdobj52.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                          } else {
                                            gdobj52.lineStyle = {"color": that.negColor}
                                            gdobj52.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                          }
                                          stobj5.children.push(gdobj52)
                                        }
                                        that.guanhuaiChildren.push(stobj5)
                                      }
                                    }
                                  }
                              }
                              //*******************************************************
                              if (flag5 == true) {
                                that.posts5.push(JSON.parse(response.data.data[k]))
                                if (JSON.parse(response.data.data[k])["score"] < 0.4) {
                                  that.postNegNumList[4] += 1
                                }
                              }
                              //连续性
                              //console.log('连续性')
                              let flag6 = false
                              if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"] != undefined) {
                                for (let sx6 in JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"])
                                  for (let w6 in that.words6) {
                                    if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx6]["text"] == that.words6[w6]) {
                                      flag6 = true
                                      let flag = false//实体是否已被记录在lianxvChildren中
                                      for (let st in that.lianxvChildren) {
                                        if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx6]["text"] == that.lianxvChildren[st]["name"]) {
                                          let gdobj61 = new Object()
                                          if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx6]["relations"] != undefined) {
                                            if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx6]["relations"]["观点词"] != undefined) {
                                              gdobj61.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx6]["relations"]["观点词"][0]["text"]
                                            } else {
                                              gdobj61.name = '无'
                                            }
                                            gdobj61.symbolSize = 20
                                            if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx6]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                              gdobj61.lineStyle = {"color": that.unknownColor}
                                              gdobj61.itemStyle = {
                                                "borderColor": that.unknownColor,
                                                "color": that.unknownColor
                                              }
                                            } else if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx6]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                              gdobj61.lineStyle = {"color": that.posColor}
                                              gdobj61.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                            } else {
                                              gdobj61.lineStyle = {"color": that.negColor}
                                              gdobj61.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                            }
                                            that.lianxvChildren[st]["children"].push(gdobj61)
                                          }
                                          flag = true
                                        }
                                      }
                                      //如果之前没被记录，把实体和对应观点词加进来
                                      if (flag == false) {
                                        let stobj6 = new Object()
                                        stobj6.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx6]["text"]
                                        stobj6.children = []
                                        //console.log("之前没记录过【lianxv字段】")
                                        //console.log(JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx6])
                                        if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx6]["relations"] != undefined) {
                                          let gdobj62 = new Object()
                                          if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx6]["relations"]["观点词"] != undefined) {
                                            gdobj62.name = JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx6]["relations"]["观点词"][0]["text"]
                                          } else {
                                            gdobj62.name = "无"
                                          }
                                          gdobj62.symbolSize = 20
                                          if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx6]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                            gdobj62.lineStyle = {"color": that.unknownColor}
                                            gdobj62.itemStyle = {
                                              "borderColor": that.unknownColor,
                                              "color": that.unknownColor
                                            }
                                          } else if (JSON.parse(JSON.parse(response.data.data[k])['shuxing'])["评价维度"][sx6]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                            gdobj62.lineStyle = {"color": that.posColor}
                                            gdobj62.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                          } else {
                                            gdobj62.lineStyle = {"color": that.negColor}
                                            gdobj62.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                          }
                                          stobj6.children.push(gdobj62)
                                        }
                                        that.lianxvChildren.push(stobj6)
                                      }
                                    }
                                  }
                              }
                              //******************************************************[lianxv]
                              if (JSON.parse(JSON.parse(response.data.data[k])['lianxu'])["评价维度"] != undefined) {
                                for (let sx6 in JSON.parse(JSON.parse(response.data.data[k])['lianxu'])["评价维度"])
                                  for (let w6 in that.words6) {
                                    if (JSON.parse(JSON.parse(response.data.data[k])['lianxu'])["评价维度"][sx6]["text"] == that.words6[w6]) {
                                      flag6 = true
                                      let flag = false//实体是否已被记录在lianxvChildren中
                                      for (let st in that.lianxvChildren) {
                                        if (JSON.parse(JSON.parse(response.data.data[k])['lianxu'])["评价维度"][sx6]["text"] == that.lianxvChildren[st]["name"]) {
                                          if (JSON.parse(JSON.parse(response.data.data[k])['lianxu'])["评价维度"][sx6]["relations"] != undefined) {
                                            let gdobj61 = new Object()
                                            gdobj61.name = '无'
                                            gdobj61.symbolSize = 20
                                            if (JSON.parse(JSON.parse(response.data.data[k])['lianxu'])["评价维度"][sx6]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                              gdobj61.lineStyle = {"color": that.unknownColor}
                                              gdobj61.itemStyle = {
                                                "borderColor": that.unknownColor,
                                                "color": that.unknownColor
                                              }
                                            } else if (JSON.parse(JSON.parse(response.data.data[k])['lianxu'])["评价维度"][sx6]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                              gdobj61.lineStyle = {"color": that.posColor}
                                              gdobj61.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                            } else {
                                              gdobj61.lineStyle = {"color": that.negColor}
                                              gdobj61.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                            }
                                            that.lianxvChildren[st]["children"].push(gdobj61)
                                          }
                                          flag = true
                                        }
                                      }
                                      //如果之前没被记录，把实体和对应观点词加进来
                                      if (flag == false) {
                                        let stobj6 = new Object()
                                        stobj6.name = JSON.parse(JSON.parse(response.data.data[k])['lianxu'])["评价维度"][sx6]["text"]
                                        stobj6.children = []
                                        if (JSON.parse(JSON.parse(response.data.data[k])['lianxu'])["评价维度"][sx6]["relations"] != undefined) {
                                          let gdobj62 = new Object()
                                          gdobj62.name = "无"
                                          gdobj62.symbolSize = 20
                                          if (JSON.parse(JSON.parse(response.data.data[k])['lianxu'])["评价维度"][sx6]["relations"]["情感倾向[正向,负向]"] == undefined) {
                                            gdobj62.lineStyle = {"color": that.unknownColor}
                                            gdobj62.itemStyle = {
                                              "borderColor": that.unknownColor,
                                              "color": that.unknownColor
                                            }
                                          } else if (JSON.parse(JSON.parse(response.data.data[k])['lianxu'])["评价维度"][sx6]["relations"]["情感倾向[正向,负向]"][0]["text"] == "正向") {
                                            gdobj62.lineStyle = {"color": that.posColor}
                                            gdobj62.itemStyle = {"borderColor": that.posColor, "color": that.posColor}
                                          } else {
                                            gdobj62.lineStyle = {"color": that.negColor}
                                            gdobj62.itemStyle = {"borderColor": that.negColor, "color": that.negColor}
                                          }
                                          stobj6.children.push(gdobj62)
                                        }
                                        that.lianxvChildren.push(stobj6)
                                      }
                                    }
                                  }
                              }
                              if (flag6 == true) {
                                that.posts6.push(JSON.parse(response.data.data[k]))
                                if (JSON.parse(response.data.data[k])["score"] < 0.4) {
                                  that.postNegNumList[5] += 1
                                }
                              }
                            }
                            console.log('that.posts1', that.posts1)
                            console.log('that.posts2', that.posts2)
                            console.log('that.posts3', that.posts3)
                            console.log('that.posts4', that.posts4)
                            console.log('that.posts5', that.posts5)
                            console.log('that.posts6', that.posts6)
                          })
                          .catch(function (error) {
                            console.log("post2", error);
                          });
                    }
                  })
                  .catch(function (error) {
                    console.log("post2", error);
                  });
            }).catch(function (error) {
              console.log("queryLanguageCount-error", error);
            })
          })
          .catch(function (error) {
            console.log(error);
          });
    },
    // newcolorbar(ScoreList){
    //   console.log('ScoreList',ScoreList)
    //   //let posColorList=['#89d066','#89d066','#89d066','#89d066','#89d066']
    // },
    colorbar(s) {
      if(isNaN(s)){
        return '#949393'
      }
      //let color11 = 'rgb(245,108,108)'//负面 0
      let r11 = 245
      let g11 = 108
      let b11 = 108
      //let color12 = 'rgb(239,202,202)'//负面 0.5
      let r12 = 239
      let g12 = 202
      let b12 = 202
      //let color21 = 'rgb(171,206,154)'//正面 0.5
      let r21 = 171
      let g21 = 206
      let b21 = 154
      //let color22 = 'rgb(137,208,102)'//正面 0.5
      let r22 = 137
      let g22 = 208
      let b22 = 102
      let r = 0
      let g = 0
      let b = 0
      if (s <= 0.5) {
        r = r11 + (r12 - r11) * 2 * s**20//**10
        g = g11 + (g12 - g11) * 2 * s**20//**10
        b = b11 + (b12 - b11) * 2 * s**20//**10
      } else {
        r = r21 + (r22 - r21) * (s - 0.5) **5* 2
        g = g21 + (g22 - g21) * (s - 0.5) **5* 2
        b = b21 + (b22 - b21) * (s - 0.5) **5* 2
      }
      let color = 'rgba(' + r + ',' + g + ',' + b + ')'
      return color
    },
    getDateType(index) {
      let that = this
      that.words = []
      that.postType = "未选择"
      that.dateTypeSelectedIndex = index
      switch (index) {
        case 0:
          that.startDate = that.yearStartDate
          that.endDate = that.yearEndDate
          that.lowerLimit = [10, 10, 10, 10, 5, 0]
          that.colorList=that.yearColorList
          break
        case 1:
          that.startDate = that.monthStartDate
          that.endDate = that.monthEndDate
          that.lowerLimit = [2,2 ,2, 2, 1, 0]
          that.colorList=that.monthColorList
          break
        case 2:
          that.startDate = that.weekStartDate
          that.endDate = that.weekEndDate
          that.lowerLimit = [0, 0, 0, 0, 0, 0]
          that.colorList=that.weekColorList
          break
        default:
          break
      }
      that.initTreeEcharts()
    },
    handleTreeClik(params) {
      //有形性、、、连续性等6个节点
      switch (params["name"]) {
        case "有形性":
          this.postType = "有形性"
          this.words = []
          this.postList = this.posts1
          this.filterPosts = this.posts1
          break
        case "可靠性":
          this.postType = "可靠性"
          this.words = []
          this.postList = this.posts2
          this.filterPosts = this.posts2
          break
        case "反应性":
          this.postType = "反应性"
          this.words = []
          this.postList = this.posts3
          this.filterPosts = this.posts3
          break
        case "保证性":
          this.postType = "保证性"
          this.words = []
          this.postList = this.posts4
          this.filterPosts = this.posts4
          break
        case "关怀性":
          this.postType = "关怀性"
          this.words = []
          this.postList = this.posts5
          this.filterPosts = this.posts5
          break
        case "连续性":
          this.postType = "连续性"
          this.words = []
          this.postList = this.posts6
          this.filterPosts = this.posts6
          break
      }
      if (params["treeAncestors"].length < 4) {
        return
      } else if (params["name"] != "无" && !this.keywords.includes(params["name"])) {
        this.words.push({word: params["name"], color: params["color"]})
        this.filterPosts = []
        for (let k in this.postList) {
          let flag = true
          for (let key in this.words) {
            if (this.postList[k]['detail'].search(this.words[key]["word"]) == -1) {
              flag = false
            }
          }
          if (flag) {
            this.filterPosts.push(this.postList[k])
          }
        }
      }
    },
    initTreeEcharts() {
      this.getAndHandlePost()
      setTimeout(() => {
        //获取颜色列表
        let that = this
        console.log(that.postNegNumList[0] / that.posts1.length,that.postNegNumList[1] / that.posts2.length,that.postNegNumList[2] / that.posts3.length)
        console.log(that.postNegNumList[3] / that.posts4.length,that.postNegNumList[4] / that.posts5.length,that.postNegNumList[5] / that.posts6.length)
        // let ScoreList=[]
        // ScoreList.push(that.postNegNumList[0] / that.posts1.length)
        // ScoreList.push(that.postNegNumList[1] / that.posts2.length)
        // ScoreList.push(that.postNegNumList[2] / that.posts3.length)
        // ScoreList.push(that.postNegNumList[3] / that.posts4.length)
        // ScoreList.push(that.postNegNumList[4] / that.posts5.length)
        // ScoreList.push(that.postNegNumList[5] / that.posts6.length)
        // that.newcolorbar(ScoreList)
        // that.colorList.push(that.colorbar(that.postNegNumList[0] / that.posts1.length))
        // that.colorList.push(that.colorbar(that.postNegNumList[1] / that.posts2.length))
        // that.colorList.push(that.colorbar(that.postNegNumList[2] / that.posts3.length))
        // that.colorList.push(that.colorbar(that.postNegNumList[3] / that.posts4.length))
        // that.colorList.push(that.colorbar(that.postNegNumList[4] / that.posts5.length))
        // that.colorList.push(that.colorbar(that.postNegNumList[5] / that.posts6.length))
        that.youxinChildren = that.youxinChildren.filter(item => item["children"].length > that.lowerLimit[0])
        for (let st in that.youxinChildren) {
          //console.log('that.youxinChildren[st]', that.youxinChildren[st])
          that.youxinChildren[st]["value"] = that.youxinChildren[st]["children"].length
          that.youxinChildren[st]["symbolSize"] = 50
          that.youxinChildren[st]["lineStyle"] = {"color": that.colorList[0]}
          that.youxinChildren[st]["itemStyle"] = {"borderColor": that.colorList[0], "color": that.colorList[0]}
          //将相同元素合并
          for (let i = 0; i < that.youxinChildren[st]["children"].length; i++) {
            that.youxinChildren[st]["children"][i]["value"] = 1
            for (let j = i + 1; j < that.youxinChildren[st]["children"].length; j++) {
              // console.log("i", i, that.youxinChildren[st]["children"][i])
              // console.log("j", j, that.youxinChildren[st]["children"][j])
              //console.log("==",JSON.stringify(that.youxinChildren[st]["children"][i])==JSON.stringify(that.youxinChildren[st]["children"][j]))
              if (that.youxinChildren[st]["children"][i]["name"] == that.youxinChildren[st]["children"][j]["name"] && that.youxinChildren[st]["children"][i]["color"] == that.youxinChildren[st]["children"][j]["color"]) {
                that.youxinChildren[st]["children"][i]["value"] += 1
                //that.youxinChildren[st]["children"][i]["symbolSize"] = that.youxinChildren[st]["children"][i]["symbolSize"] + 2
                that.youxinChildren[st]["children"].splice(j, 1)
                j = j - 1
              }

            }
          }
        }
        that.kekaoChildren = that.kekaoChildren.filter(item => item["children"].length > that.lowerLimit[1])
        for (let st in that.kekaoChildren) {
          that.kekaoChildren[st]["value"] = that.kekaoChildren[st]["children"].length
          that.kekaoChildren[st]["symbolSize"] = 50
          that.kekaoChildren[st]["lineStyle"] = {"color": that.colorList[1]}
          that.kekaoChildren[st]["itemStyle"] = {"borderColor": that.colorList[1], "color": that.colorList[1]}
          //将相同元素合并
          for (let i = 0; i < that.kekaoChildren[st]["children"].length; i++) {
            that.kekaoChildren[st]["children"][i]["value"] = 1
            for (let j = i + 1; j < that.kekaoChildren[st]["children"].length; j++) {
              // console.log("i", i, that.kekaoChildren[st]["children"][i])
              // console.log("j", j, that.kekaoChildren[st]["children"][j])
              //console.log("==",JSON.stringify(that.kekaoChildren[st]["children"][i])==JSON.stringify(that.kekaoChildren[st]["children"][j]))
              if (that.kekaoChildren[st]["children"][i]["name"] == that.kekaoChildren[st]["children"][j]["name"] && that.kekaoChildren[st]["children"][i]["color"] == that.kekaoChildren[st]["children"][j]["color"]) {
                that.kekaoChildren[st]["children"][i]["value"] += 1
                //that.kekaoChildren[st]["children"][i]["symbolSize"] = that.kekaoChildren[st]["children"][i]["symbolSize"] + 5
                that.kekaoChildren[st]["children"].splice(j, 1)
                j = j - 1
              }

            }
          }
        }
        that.fanyingChildren = that.fanyingChildren.filter(item => item["children"].length > that.lowerLimit[2])
        for (let st in that.fanyingChildren) {
          that.fanyingChildren[st]["value"] = that.fanyingChildren[st]["children"].length
          that.fanyingChildren[st]["symbolSize"] = 50
          that.fanyingChildren[st]["lineStyle"] = {"color": that.colorList[2]}
          that.fanyingChildren[st]["itemStyle"] = {"borderColor": that.colorList[2], "color": that.colorList[2]}
          //将相同元素合并
          for (let i = 0; i < that.fanyingChildren[st]["children"].length; i++) {
            that.fanyingChildren[st]["children"][i]["value"] = 1
            for (let j = i + 1; j < that.fanyingChildren[st]["children"].length; j++) {
              // console.log("i", i, that.fanyingChildren[st]["children"][i])
              // console.log("j", j, that.fanyingChildren[st]["children"][j])
              //console.log("==",JSON.stringify(that.fanyingChildren[st]["children"][i])==JSON.stringify(that.fanyingChildren[st]["children"][j]))
              if (that.fanyingChildren[st]["children"][i]["name"] == that.fanyingChildren[st]["children"][j]["name"] && that.fanyingChildren[st]["children"][i]["color"] == that.fanyingChildren[st]["children"][j]["color"]) {
                that.fanyingChildren[st]["children"][i]["value"] += 1
                //that.fanyingChildren[st]["children"][i]["symbolSize"] = that.fanyingChildren[st]["children"][i]["symbolSize"] + 5
                that.fanyingChildren[st]["children"].splice(j, 1)
                j = j - 1
              }

            }
          }
        }
        that.baozhengChildren = that.baozhengChildren.filter(item => item["children"].length > that.lowerLimit[3])
        for (let st in that.baozhengChildren) {
          that.baozhengChildren[st]["value"] = that.baozhengChildren[st]["children"].length
          that.baozhengChildren[st]["symbolSize"] = 50
          that.baozhengChildren[st]["lineStyle"] = {"color": that.colorList[3]}
          that.baozhengChildren[st]["itemStyle"] = {"borderColor": that.colorList[3], "color": that.colorList[3]}
          //将相同元素合并
          for (let i = 0; i < that.baozhengChildren[st]["children"].length; i++) {
            that.baozhengChildren[st]["children"][i]["value"] = 1
            for (let j = i + 1; j < that.baozhengChildren[st]["children"].length; j++) {
              // console.log("i", i, that.baozhengChildren[st]["children"][i])
              // console.log("j", j, that.baozhengChildren[st]["children"][j])
              //console.log("==",JSON.stringify(that.baozhengChildren[st]["children"][i])==JSON.stringify(that.baozhengChildren[st]["children"][j]))
              if (that.baozhengChildren[st]["children"][i]["name"] == that.baozhengChildren[st]["children"][j]["name"] && that.baozhengChildren[st]["children"][i]["color"] == that.baozhengChildren[st]["children"][j]["color"]) {
                that.baozhengChildren[st]["children"][i]["value"] += 1
                //that.baozhengChildren[st]["children"][i]["symbolSize"] = that.baozhengChildren[st]["children"][i]["symbolSize"] + 5
                that.baozhengChildren[st]["children"].splice(j, 1)
                j = j - 1
              }

            }
          }
        }
        that.guanhuaiChildren = that.guanhuaiChildren.filter(item => item["children"].length > that.lowerLimit[4])
        for (let st in that.guanhuaiChildren) {
          that.guanhuaiChildren[st]["value"] = that.guanhuaiChildren[st]["children"].length
          that.guanhuaiChildren[st]["symbolSize"] = 50
          that.guanhuaiChildren[st]["lineStyle"] = {"color": that.colorList[4]}
          that.guanhuaiChildren[st]["itemStyle"] = {"borderColor": that.colorList[4], "color": that.colorList[4]}
          //将相同元素合并
          for (let i = 0; i < that.guanhuaiChildren[st]["children"].length; i++) {
            that.guanhuaiChildren[st]["children"][i]["value"] = 1
            for (let j = i + 1; j < that.guanhuaiChildren[st]["children"].length; j++) {
              // console.log("i", i, that.guanhuaiChildren[st]["children"][i])
              // console.log("j", j, that.guanhuaiChildren[st]["children"][j])
              //console.log("==",JSON.stringify(that.guanhuaiChildren[st]["children"][i])==JSON.stringify(that.guanhuaiChildren[st]["children"][j]))
              if (that.guanhuaiChildren[st]["children"][i]["name"] == that.guanhuaiChildren[st]["children"][j]["name"] && that.guanhuaiChildren[st]["children"][i]["color"] == that.guanhuaiChildren[st]["children"][j]["color"]) {
                that.guanhuaiChildren[st]["children"][i]["value"] += 1
                //that.guanhuaiChildren[st]["children"][i]["symbolSize"] = that.guanhuaiChildren[st]["children"][i]["symbolSize"] + 5
                that.guanhuaiChildren[st]["children"].splice(j, 1)
                j = j - 1
              }

            }
          }
        }
        that.lianxvChildren = that.lianxvChildren.filter(item => item["children"].length > that.lowerLimit[5])
        for (let st in that.lianxvChildren) {
          that.lianxvChildren[st]["value"] = that.lianxvChildren[st]["children"].length
          that.lianxvChildren[st]["symbolSize"] = 50
          that.lianxvChildren[st]["lineStyle"] = {"color": that.colorList[5]}
          that.lianxvChildren[st]["itemStyle"] = {"borderColor": that.colorList[5], "color": that.colorList[5]}
          //将相同元素合并
          for (let i = 0; i < that.lianxvChildren[st]["children"].length; i++) {
            that.lianxvChildren[st]["children"][i]["value"] = 1
            for (let j = i + 1; j < that.lianxvChildren[st]["children"].length; j++) {
              // console.log("i", i, that.lianxvChildren[st]["children"][i])
              // console.log("j", j, that.lianxvChildren[st]["children"][j])
              //console.log("==",JSON.stringify(that.lianxvChildren[st]["children"][i])==JSON.stringify(that.lianxvChildren[st]["children"][j]))
              if (that.lianxvChildren[st]["children"][i]["name"] == that.lianxvChildren[st]["children"][j]["name"] && that.lianxvChildren[st]["children"][i]["color"] == that.lianxvChildren[st]["children"][j]["color"]) {
                that.lianxvChildren[st]["children"][i]["value"] += 1
                //that.lianxvChildren[st]["children"][i]["symbolSize"] = that.lianxvChildren[st]["children"][i]["symbolSize"] + 5
                that.lianxvChildren[st]["children"].splice(j, 1)
                j = j - 1
              }

            }
          }
        }
        let newdata = [
          {
            "name": "长海医院",
            "label": {"position": "inside"},
            "symbolSize": 50,
            "lineStyle": {"color": 'rgba(12,168,138,0.5)'},
            "itemStyle": {"borderColor": 'rgba(12,168,138,0.5)', "color": 'rgb(12,168,138)'},
            "children": [
              {
                "name": "有形性",
                "value": that.posts1.length,
                "children": that.youxinChildren,
                "label": {"position": "inside"},
                "symbolSize": 100,
                "lineStyle": {"color": that.colorList[0]},
                "itemStyle": {"borderColor": that.colorList[0], "color": that.colorList[0]}
              },
              {
                "name": "可靠性",
                "value": that.posts2.length,
                "children": that.kekaoChildren,
                "label": {"position": "inside"},
                "symbolSize": 100,
                "lineStyle": {"color": that.colorList[1]},
                "itemStyle": {"borderColor": that.colorList[1], "color": that.colorList[1]}
              },
              {
                "name": "反应性",
                "value": that.posts3.length,
                "children": this.fanyingChildren,
                "label": {"position": "inside"},
                "symbolSize": 100,
                "lineStyle": {"color": that.colorList[2]},
                "itemStyle": {"borderColor": that.colorList[2], "color": that.colorList[2]}
              },
              {
                "name": "保证性",
                "value": that.posts4.length,
                "children": this.baozhengChildren,
                "label": {"position": "inside"},
                "symbolSize": 100,
                "lineStyle": {"color": that.colorList[3]},
                "itemStyle": {"borderColor": that.colorList[3], "color": that.colorList[3]}
              },
              {
                "name": "关怀性",
                "value": that.posts5.length,
                "children": this.guanhuaiChildren,
                "label": {"position": "inside"},
                "symbolSize": 100,
                "lineStyle": {"color": that.colorList[4]},
                "itemStyle": {"borderColor": that.colorList[4], "color": that.colorList[4]}
              },
              {
                "name": "连续性",
                "value": that.posts6.length,
                "children": that.lianxvChildren,
                "label": {"position": "inside"},
                "symbolSize": 100,
                "lineStyle": {"color": that.colorList[5]},
                "itemStyle": {"borderColor": that.colorList[5], "color": that.colorList[5]}
              },
            ],
          }]
        console.log('newdata', newdata)
        const treeOptions = {
          type: "tree",
          //backgroundColor: "rgb(234,234,234)",
          toolbox: { //工具栏
            show: true,
            iconStyle: {
              borderColor: '#adb6a5',
            },
            feature: {
              restore: {}
            }
          },
          tooltip: {//提示框
            show: true,
            // formatter:function (param) {
            //   console.log('tooltip-param',param)
            // },
            trigger: "item",
            triggerOn: "mousemove",
            backgroundColor: "rgba(12,168,138,0.2)",
            borderColor: "#0ca88a",
            borderWidth: 0.5,
            textStyle: {
              fontSize: 10,
              color: '#fff'
            }
          },
          series: [
            {
              type: "tree",
              hoverAnimation: true, //hover样式
              data: newdata,
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              layout: "radial",
              symbol: "circle",
              symbolSize: 10,
              nodePadding: 20,
              animationDurationUpdate: 750,
              expandAndCollapse: true, //子树折叠和展开的交互，默认打开
              initialTreeDepth: 2,
              roam: true, //是否开启鼠标缩放和平移漫游。scale/move/true
              focusNodeAdjacency: true,
              itemStyle: {
                borderWidth: 1,
              },
              label: { //标签样式
                color: "#fff",
                fontSize: 10,
                fontFamily: "SourceHanSansCN",
                position: "inside",
                rotate: 0,
              },
              lineStyle: {
                width: 1,
                curveness: 0.5,
              }
            }
          ]
        };
        this.treeChart = echarts.init(document.getElementById("myTreeChart"))
        toRaw(this.treeChart).setOption(treeOptions, true)
        window.addEventListener("resize", () => {
          this.treeChart.resize()
        })
        this.treeChart.on('click', function (params) {
          console.log("tree-echart点击事件参数", params)
          that.handleTreeClik(params)
        })
      }, 3000)
    },
  }
}
</script>

<style scoped>
.posts {
  overflow: hidden;
  background-image: linear-gradient(#f7faf7, #f0f0f0);
  width: 90%;
  height: 100vh;
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

.postType {
  background-image: linear-gradient(#f5f5f5, #fafafa);
  padding: 1px 5px;
  /*color: #505050;*/
  color: rgba(12, 168, 138, 0.5);
  font-family: "Helvetica Neue", Roboto, Arial, "Droid Sans", sans-serif;
  font-size: 13px;
  font-weight: 400;
}

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

.postType {
  background-image: linear-gradient(#f5f5f5, #fafafa);
  padding: 1px 5px;
  /*color: #505050;*/
  color: rgba(12, 168, 138, 0.5);
  font-family: "Helvetica Neue", Roboto, Arial, "Droid Sans", sans-serif;
  font-size: 13px;
  font-weight: 400;
}

</style>