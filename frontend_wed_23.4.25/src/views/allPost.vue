<template>
  <el-row>
    <!--左边-->
    <el-col :span="18">
      <div>
        <div style="display: flex;justify-content: space-between;padding: 0 5%">
          <div class="statistic-card">
            <el-statistic :value="numberOfUser">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  用户总数
                  <el-tooltip effect="dark"
                              content="使用过“医路由你”小程序的用户总数"
                              placement="top"
                  >
                    <el-icon style="margin-left: 4px" :size="12">
                      <Warning/>
                    </el-icon>
                  </el-tooltip>
                </div>
              </template>
            </el-statistic>
            <div class="statistic-footer">
              <div class="footer-item">
                <span>较去年&nbsp;</span>
                <span v-if="percentageOfUser>0" class="green">
                  {{ percentageOfUser }}%
                <el-icon>
                  <CaretTop/>
                </el-icon>
                </span>
                <span v-else class="red">
                  {{ -percentageOfUser }}%
                  <el-icon>
                <CaretBottom/>
              </el-icon>
                </span>
              </div>
            </div>
          </div>
          <div class="statistic-card">
            <el-statistic :value="numberOfPost">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  帖子总数
                  <el-tooltip effect="dark"
                              content="用户发布的帖子总数"
                              placement="top"
                  >
                    <el-icon style="margin-left: 4px" :size="12">
                      <Warning/>
                    </el-icon>
                  </el-tooltip>
                </div>
              </template>
            </el-statistic>
            <div class="statistic-footer">
              <div class="footer-item">
                <span>较去年&nbsp;</span>
                <span v-if="percentageOfPost>0" class="green">
                  {{ percentageOfPost }}%
                <el-icon>
                  <CaretTop/>
                </el-icon>
                </span>
                <span v-else class="red">
                  {{ -percentageOfPost }}%
                  <el-icon>
                <CaretBottom/>
              </el-icon>
                </span>
              </div>
            </div>
          </div>
          <div class="statistic-card">
            <el-statistic :value="numberOfComment">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  评论总数
                  <el-tooltip effect="dark"
                              content="用户对帖子发表过的评论总数"
                              placement="top"
                  >
                    <el-icon style="margin-left: 4px" :size="12">
                      <Warning/>
                    </el-icon>
                  </el-tooltip>
                </div>
              </template>
            </el-statistic>
            <div class="statistic-footer">
              <div class="footer-item">
                <span>较去年&nbsp;</span>
                <span v-if="percentageOfComment>0" class="green">
                  {{ percentageOfComment }}%
                <el-icon>
                  <CaretTop/>
                </el-icon>
                </span>
                <span v-else class="red">
                  {{ -percentageOfComment }}%
                  <el-icon>
                <CaretBottom/>
              </el-icon>
                </span>
              </div>
            </div>
          </div>
        </div>
        <el-scrollbar height="1000px">
          <div class="posts">
            <div v-for="item in postList" :key="item">
              <div class="post">
                <div style="width: 100%;">
                  <div style="float:left;text-align: left;margin:10px 0px 3px 0px;font-size:14px;color:#08758c">{{
                      item.date
                    }}
                  </div>
                  <div style="float:right;text-align: right;margin:10px 15px 3px 20px;font-size:12px;color:#08758c">赞
                    {{ item.agree }} 评论 {{ item.comment }}
                  </div>
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
          </div>
        </el-scrollbar>
      </div>
      <!--右边-->
    </el-col>
    <el-col :span="6">
      <div style="height: 100%;">
        <div class="monitor-search-box">
          <div class="monitor-search">
            <input type="text" @change="filterPost()" class="form-control" v-model.lazy="searchKeyWord"
                   placeholder="输入搜索内容">
            <el-button color="#20c997" @click="filterPost" :icon="Search()" size="large"/>
          </div>
        </div>
        <div class="card-title filter-title">时间范围</div>
        <div style="margin-top: 5px;border: 1px solid #20c997;margin-left: 20px;padding: 10px;border-radius: 5px">
          <el-date-picker style="margin-top: 5px" v-model="startDate" type="date"
                          placeholder="开始日期"></el-date-picker>
          <el-date-picker style="margin-top: 5px" v-model="endDate" type="date" placeholder="结束日期"></el-date-picker>
          <br>
          <el-button style="margin: 10px" color="#20c997" @click="filterPost" type="success">确定</el-button>
        </div>
        <div class="demo-button-style" style="margin-top: 15px">
          <el-checkbox-group v-model="checkedModes" size="small">
            <el-checkbox-button @change="filterPost" v-for="mode in modes" :key="mode"
                                :label="mode">
              <span>{{ mode }}</span>
            </el-checkbox-button>
          </el-checkbox-group>
        </div>
        <div class="card-title filter-title">科室</div>
        <el-tree-select
            placeholder="选择您想查看的科室"
            @change="filterPost"
            v-model="checkedDepartments"
            :data="departments"
            multiple
            :render-after-expand="false"
            show-checkbox
        />
        <!--        <el-checkbox-group @change="filterPost" v-model="checkedDepartments">-->

        <!--          <el-checkbox v-for="department in departments" :key="department" :label="department">-->
        <!--            <div>{{ department }}</div>-->
        <!--          </el-checkbox>-->

        <!--        </el-checkbox-group>-->
      </div>
    </el-col>
  </el-row>
</template>

<script>
import axios from 'axios'
import {Search} from "@element-plus/icons-vue";
import Highlighter from 'vue-highlight-words'


export default {
  name: "allPost",
  components: {
    Highlighter
  },
  computed: {
    keywords() {
      console.log('keywords', this.words)
      return this.words
    }
  },
  data() {
    return {
      //统计卡片
      numberOfUser: 23,
      percentageOfUser: -10,
      numberOfPost: 416,
      percentageOfPost: 20,
      numberOfComment: 940,
      percentageOfComment: -15,
      //树形选择器
      departments: [
        {
          value: '内科',
          label: '内科',
          children: [
            {
              value: '心血管内科',
              label: '心血管内科',
            },
            {
              value: '血液内科',
              label: '血液内科',
            },
            {
              value: '呼吸内科',
              label: '呼吸内科',
            },
            {
              value: '消化内科',
              label: '消化内科',
            },
            {
              value: '神经内科',
              label: '神经内科',
            },
            {
              value: '内分泌科',
              label: '内分泌科',
            },
            {
              value: '肾内科',
              label: '肾内科',
            },
            {
              value: '风湿免疫科',
              label: '风湿免疫科',
            },
            {
              value: '肿瘤科',
              label: '肿瘤科',
            },
            {
              value: '感染科',
              label: '感染科',
            },
            {
              value: '皮肤科',
              label: '皮肤科',
            },
            {
              value: '儿科',
              label: '儿科',
            },
            {
              value: '康复医学科',
              label: '全科医学科',
            },
          ],
        },
        {
          value: '外科',
          label: '外科',
          children: [
            {
              value: '普通外科',
              label: '普通外科',
            },
            {
              value: '胃肠外科',
              label: '胃肠外科',
            },
            {
              value: '肛肠外科',
              label: '肛肠外科',
            },
            {
              value: '肝胆胰脾外科',
              label: '肝胆胰脾外科',
            },
            {
              value: '甲乳外科',
              label: '甲乳外科',
            },
            {
              value: '血管外科',
              label: '血管外科',
            },
            {
              value: '脊柱外科',
              label: '脊柱外科',
            },
            {
              value: '关节骨病外科',
              label: '关节骨病外科',
            },
            {
              value: '创伤骨科',
              label: '创伤骨科',
            },
            {
              value: '泌尿外科',
              label: '泌尿外科',
            },
            {
              value: '胸心外科',
              label: '胸心外科',
            },
            {
              value: '胸外科',
              label: '胸外科',
            },
            {
              value: '心血管外科',
              label: '心血管外科',
            },
            {
              value: '神经外科',
              label: '神经外科',
            },
            {
              value: '脑血管病中心',
              label: '脑血管病中心',
            },
            {
              value: '整形外科',
              label: '整形外科',
            },
            {
              value: '烧伤科',
              label: '烧伤科',
            },
            {
              value: '器官移植科',
              label: '器官移植科',
            },
            {
              value: '眼科',
              label: '眼科',
            },
            {
              value: '眼屈光中心',
              label: '眼屈光中心',
            },
            {
              value: '耳鼻咽喉',
              label: '耳鼻咽喉',
            },
            {
              value: '口腔科',
              label: '口腔科',
            },
            {
              value: '妇科',
              label: '妇科',
            },
            {
              value: '产科',
              label: '产科',
            },
          ],
        },
        {
          value: '中医',
          label: '中医',
          children: [
            {
              value: '中医内科',
              label: '中医内科',
            },
            {
              value: '中医外科',
              label: '中医外科',
            },
            {
              value: '中医妇科',
              label: '中医妇科',
            },
            {
              value: '中医肿瘤科',
              label: '中医肿瘤科',
            },
            {
              value: '中医针灸',
              label: '中医针灸',
            },
            {
              value: '中医推拿',
              label: '中医推拿',
            },
          ],
        },
        {
          value: '其他',
          label: '其他',
          children: [
            {
              value: '便民门诊',
              label: '便民门诊',
            },
            {
              value: '多学科联合门诊',
              label: '多学科联合门诊',
            },
            {
              value: '介入治疗科',
              label: '介入治疗科',
            },
            {
              value: '影像诊断门诊',
              label: '影像诊断门诊',
            },
            {
              value: '放射治疗科',
              label: '放射治疗科',
            },
            {
              value: '核医学科',
              label: '核医学科',
            },
            {
              value: '高压氧科',
              label: '高压氧科',
            },
            {
              value: '生殖医学中心',
              label: '生殖医学中心',
            },
            {
              value: '病理科',
              label: '病理科',
            },
            {
              value: '输血科',
              label: '输血科',
            },
            {
              value: '营养科',
              label: '营养科',
            },
            {
              value: '疼痛治疗科',
              label: '疼痛治疗科',
            },
            {
              value: '麻醉评估',
              label: '麻醉评估',
            },
            {
              value: '用药指导门诊',
              label: '用药指导门诊',
            },
            {
              value: '输液护理门诊',
              label: '输液护理门诊',
            },
            {
              value: '输血评估门诊',
              label: '输血评估门诊',
            },
          ],
        },
      ],
      checkedDepartments: "",
      words: [],
      searchKeyWord: "",
      startDate: '',
      endDate: '',
      modes: ['门诊', '住院', '急诊'],
      checkedModes: [],
      postList: [],
      access_token: ""
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
                "query": "db.collection(\"post\").count()"
              }
          )
              .then(function (response) {
                //获取符号条件的记录总数量
                console.log("db.collection(\"post\").count()", response.data.pager.Total);
                that.numberOfPost = response.data.pager.Total
                //1625条记录,获取两次
                //获取帖子
                axios.post('/api/tcb/databasequery?access_token=' + that.access_token, {
                      "env": "cloud-2023-jisai-7ft7ahc87f5c949",
                      "query": "db.collection(\"post\").limit(1000).orderBy('date','desc').get()"
                    }
                )
                    .then(function (response) {
                      console.log("post1", response.data.data);
                      for (let k in response.data.data) {
                        that.postList.push(JSON.parse(response.data.data[k]))
                      }
                      axios.post('/api/tcb/databasequery?access_token=' + that.access_token, {
                            "env": "cloud-2023-jisai-7ft7ahc87f5c949",
                            "query": "db.collection(\"post\").skip(1000).limit(1000).orderBy('date','desc').get()"
                          }
                      )
                          .then(function (response) {
                            console.log("post1-skip(1000)", response.data.data);
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
                //************************************************************
                // let num_queries = Math.ceil(that.numberOfPost / 1000)
                // let i = 0
                // let queryLanguageList = []
                // while (i < num_queries) {
                //   console.log("循环i=", i, num_queries)
                //   let offset = i * 1000
                //   let queryLanguage = "db.collection(\"post\").skip({" + offset + "}).limit(1000).orderBy('date','desc').get()"
                //   setTimeout(() => {
                //     axios.post('/api/tcb/databasequery?access_token=' + that.access_token, {
                //           "env": "cloud-2023-jisai-7ft7ahc87f5c949",
                //           "query": queryLanguage
                //         }
                //     )
                //         .then(function (response) {
                //           console.log("post",i, response.data.data);
                //           for (let k in response.data.data) {
                //             that.postList.push(JSON.parse(response.data.data[k]))
                //           }
                //           console.log("post",i, that.postList);
                //         })
                //         .catch(function (error) {
                //           console.log("post2", error);
                //         });
                //   }, 1500)
                //   console.log('queryLanguage', i, queryLanguage)
                //   queryLanguageList.push(queryLanguage)
                //   i = i + 1
                // }
                // console.log('queryLanguageList', queryLanguageList)
              })
              .catch(function (error) {
                console.log("db.collection(\"post\").count()-error", error);
              });
        })
        .catch(function (error) {
          console.log(error);
        });
  },
  methods: {
    routeToDetail(_id) {
      this.$router.push({name: 'postDetailView', params: {postId: _id}});
    },
    Search() {
      return Search
    },
    filterPost() {
      this.words = []
      this.words.push(this.searchKeyWord)
      for (let key in this.checkedModes) {
        this.words.push(this.checkedModes[key])
      }
      for (let key in this.checkedDepartments) {
        this.words.push(this.checkedDepartments[key])
      }
      //console.log(this.searchKeyWord)
      //console.log(this.radioTime)
      //console.log('this.checkedModes',this.checkedModes)
      //console.log('this.checkedDepartments',this.checkedDepartments)
      //console.log(this.checkedLabels)
      //console.log('this.words', this.words)
      let that = this
      //为给定 ID 的 user 创建请求
      //搜索
      let querySearch = ''
      if (this.searchKeyWord != '') {
        querySearch = "detail: {$regex: '.*" + this.searchKeyWord + ".*',$options: '1'},"
      }
      //let queryLanguage = "db.collection(\"post\").where({detail: {$regex: '.*"+this.searchKeyWord+".*',$options: '1'},}).get()"
      //console.log((queryLanguage))
      //日期筛选
      let queryDate = ''
      if (this.startDate !== '' && this.endDate !== '') {
        let startDateString = this.getDateString(this.startDate)
        let endDateString = this.getDateString(this.endDate)
        //console.log(startDateString)
        //console.log(endDateString)
        queryDate = "date:db.command.gte('" + startDateString + "').and(db.command.lte('" + endDateString + "'))"
      }
      /*
      let startDateString = this.getDateString(this.startDate)
      let endDateString = this.getDateString(this.endDate)
      console.log(startDateString)
      console.log(endDateString)*/
      //let queryLanguage = "db.collection(\"post\").where({date:db.command.gte('" + startDateString + "').and(db.command.lte('" + endDateString + "'))}).get()"//日期条件
      let queryLanguage = "db.collection(\"post\").where({" + querySearch + queryDate + "}).limit(1000).orderBy('date','desc').get()"
      console.log('queryLanguage', queryLanguage)
      axios.get('/api/cgi-bin/token?grant_type=client_credential&appid=wx608d64d0acc25f28&secret=feb0adc1b0822221b6cbd6b29d889698')
          .then(function (response) {
            console.log(response.data.access_token);
            that.access_token = response.data.access_token
          })
          .catch(function (error) {
            console.log(error);
          });
      axios.post('/api/tcb/databasequery?access_token=' + that.access_token, {
            "env": "cloud-2023-jisai-7ft7ahc87f5c949",
            "query": queryLanguage
          }
      ).then(function (response) {
        let filterPost = []
        that.postList = []
        for (let k in response.data.data) {
          filterPost.push(JSON.parse(response.data.data[k]))
        }
        console.log("filterPost", filterPost);
        let flag = true
        for (let k in filterPost) {
          flag = false//true
          for (let key in that.checkedModes) {
            if (filterPost[k]['detail'].search(that.checkedModes[key]) != -1) {
              console.log('mode', that.checkedModes[key])
              flag = true//false
            }
          }
          for (let key in that.checkedDepartments) {
            if (filterPost[k]['detail'].search(that.checkedDepartments[key]) != -1) {
              console.log('department', that.checkedDepartments[key])
              flag = true//false
            }
          }
          if (flag || (that.checkedModes.length == 0 && that.checkedDepartments.length == 0)) {
            that.postList.push(JSON.parse(response.data.data[k]))
          }
        }
        console.log('that.postList', that.postList)
        console.log('that.postList', typeof (that.postList))
      })
          .catch(function (error) {
            console.log("filterpost2", error);
          });
    },
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
    }
  }
}
</script>

<style scoped>

body::-webkit-scrollbar {
  display: none;
}

html {
  overflow-y: scroll;
}

.monitor-right {
  width: 100%;
}

hr {
  margin-top: 20px;
  margin-bottom: 20px;
  border: 0;
  border-top: 1px solid #eeeeee;
}

.monitor-content-con {
  width: 100%;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-height: 24px;
}

.font-13 {
  font-size: 13px;
  color: #747f88;
}

.monitor-search-box {
  padding: 15px 15px;
  font-family: FontAwesome;
  width: 80%;
  margin: 8px;
}

.monitor-search {
  display: flex;
  justify-content: space-between;
  height: auto;
  width: auto;
}

.form-control {
  border: 2px solid #20c997;
  border-radius: 5px;
  height: 30px;
  padding: 4px 15px;
  margin: auto;
}

.filter-title {
  font-size: 14px;
  font-weight: 600;
  padding: 15px 0;
  margin: 0 !important;
}

.el-input_wrapper .is-focus {
  box-shadow: 0 0 0 1px #0ca88a inset !important;
}

.el-checkbox-button {
  --el-checkbox-button-checked-bg-color: #20c997;
  --el-checkbox-button-checked-text-color: var(--el-color-white);
  --el-checkbox-button-checked-border-color: #20c997;
}

.el-checkbox-button.is-checked .el-checkbox-button__inner {
  color: var(--el-checkbox-button-checked-text-color);
  background-color: var(--el-checkbox-button-checked-bg-color);
  border-color: var(--el-checkbox-button-checked-border-color);
  box-shadow: -1px 0 0 0 #000000;
}

.el-checkbox {
  --el-checkbox-font-size: 14px;
  --el-checkbox-font-weight: var(--el-font-weight-primary);
  --el-checkbox-text-color: var(--el-text-color-regular);
  --el-checkbox-input-height: 14px;
  --el-checkbox-input-width: 14px;
  --el-checkbox-border-radius: var(--el-border-radius-small);
  --el-checkbox-bg-color: var(--el-fill-color-blank);
  --el-checkbox-input-border: var(--el-border);
  --el-checkbox-disabled-border-color: var(--el-border-color);
  --el-checkbox-disabled-input-fill: var(--el-fill-color-light);
  --el-checkbox-disabled-icon-color: var(--el-text-color-placeholder);
  --el-checkbox-disabled-checked-input-fill: var(--el-border-color-extra-light);
  --el-checkbox-disabled-checked-input-border-color: var(--el-border-color);
  --el-checkbox-disabled-checked-icon-color: var(--el-text-color-placeholder);
  --el-checkbox-checked-text-color: #20c997;
  --el-checkbox-checked-input-border-color: #20c997;
  --el-checkbox-checked-bg-color: #20c997;
  --el-checkbox-checked-icon-color: var(--el-color-white);
  --el-checkbox-input-border-color-hover: #20c997;
}

.el-checkbox__input.is-checked .el-checkbox__inner {
  /* background-color: var(--el-checkbox-checked-bg-color); */
  border-color: #20c997;
}

.posts {
  background-color: white;
}

.post {
  margin: 15px;
  padding: 15px;
  border: 1px solid #a8d3a7;
  overflow: auto;
  display: block;
  border-radius: 12px;
  transition: all 1s ease;
  box-shadow: 20px 20px 60px #e1efe9;
}

.post_text {
  width: 99%;
  -webkit-line-clamp: 3;
  overflow: hidden;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  display: -webkit-box;
  float: left;
  text-align: left;
  font-size: 13px;
  text-indent: 2em;
  line-height: 17px;
  margin: auto;
}

.xiangQing {
  cursor: pointer;
  margin-top: 0px;
  background-color: white;
  color: #0ca88a;
  border-style: none;
  font-size: 12px;
  margin-right: 13px;
  float: right;
  cursor: pointer;
}

/*统计卡片*/
:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
}

.green {
  color: var(--el-color-success);
}

.red {
  color: var(--el-color-error);
}

/*树形选择*/
.el-select {
  --el-select-border-color-hover: var(--el-border-color-hover);
  --el-select-disabled-border: var(--el-disabled-border-color);
  --el-select-font-size: var(--el-font-size-base);
  --el-select-close-hover-color: var(--el-text-color-secondary);
  --el-select-input-color: var(--el-text-color-placeholder);
  --el-select-multiple-input-color: var(--el-text-color-regular);
  --el-select-input-focus-border-color: #0ca88a;
  --el-select-input-font-size: 14px;
}

.el-tag.el-tag--info {
  --el-tag-bg-color: var(--el-color-info-light-9);
  --el-tag-border-color: var(--el-color-info-light-8);
  --el-tag-hover-color: var(--el-color-info);
}

:deep(.el-select-dropdown__item.selected) {
  color: #0ca88a !important;
}

.el-checkbox__inner::after {
  color: #0ca88a !important;
  box-sizing: content-box;
  content: "";
  border: 1px solid var(--el-checkbox-checked-icon-color);
  border-left: 0;
  border-top: 0;
  height: 7px;
  left: 4px;
  position: absolute;
  top: 1px;
  transform: rotate(45deg) scaleY(0);
  width: 3px;
  transition: transform .15s ease-in 50ms;
  transform-origin: center;
}
</style>