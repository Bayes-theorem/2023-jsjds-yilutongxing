<template>
  <div style="margin:2.5vh 1vw 2.5vh 1vw;background-color: white">
    <div style="border-bottom: 0.29vh solid #E6E9ED;color:#08758c;font-size:3.03vh;text-align: left;padding:2.5vh 1.44vw 1.44vh 1.5vw;">投诉详情</div>
    <div style="margin:1vh 1.44vw 1.44vh 1.4vw;padding:2vh 1vw 2vh 1.4vw;text-align: left">
        <div style="margin:0 0 1.1vh 0">投诉日期：{{complain.date}}</div>
        <div style="margin:0 0 1.1vh 0">投诉人：{{complain.name}}</div>
        <div style="margin:0 0 1.1vh 0">问题：{{complain.problem}}</div>
        <div style="margin:0 0 1.1vh 0">预期解决方式：{{complain.hope}}</div>
        <div style="margin:0 0 1vh 0">联系方式：{{complain.phonenumber}}</div>
    </div>
    <div style="border-bottom: 0.29vh solid #E6E9ED;color:#08758c;font-size:3.03vh;text-align: left;padding:0vh 1.44vw 1.44vh 1.4vw;">处理进度</div>
    <el-row style="height:54.9vh">
      <el-col :span="5" style="padding-left: 1.9vw;">
        <div style="height: 47vh;margin-top: 3vh;margin-left: 2.8vw">
          <el-steps direction="vertical" :active="complain.jindu" finish-status="success" >
            <div v-if="complain.jindu>=1" :key="1" style="position: absolute;top:7vh;font-size: 1.8vh;left:6vw" >{{complain.time1}}</div>
            <el-step title="待查看" />
            <div v-if="complain.jindu>=2" :key="2" style="position: absolute;top:17.7vh;font-size: 1.8vh;left:6vw" >{{complain.time2}}</div>
            <el-step title="联系投诉人" />
            <div v-if="complain.jindu>=3" :key="3" style="position: absolute;top:28.5vh;font-size: 1.8vh;left:6vw">{{complain.time3}}</div>
            <el-step title="移交科室负责人" />
            <div v-if="complain.jindu>=4" :key="4" style="position: absolute;top:39.3vh;font-size: 1.8vh;left:6vw">{{complain.time4}}</div>
            <el-step title="投诉处理中" />
            <el-step title="投诉处理完成" />
          </el-steps>
        </div>
      </el-col>
      <el-col :span="2" style="border-right: 0.15vh solid #E6E9ED">
        <el-button type="success" v-if="complain.jindu==1" style="margin-top: 13vh;margin-left:0vh;" @click="jia1()">已完成</el-button>
        <el-button type="success" v-if="complain.jindu==2" style="margin-top:24.2vh;margin-left:0vh;" @click="jia1()">已完成</el-button>
        <el-button type="success" v-if="complain.jindu==3" style="margin-top: 34.8vh;margin-left:0vh;" @click="dialogFormVisible = true">已完成</el-button>

        <el-dialog v-model="dialogFormVisible" title="投诉处理记录">
          <el-form :model="form" style="margin-left: 1.3vw">
            <el-form-item label="与投诉人达成一致" :label-width="formLabelWidth" >
              <div class="mb-2 flex items-center text-sm" style="position: absolute;top:0vh;padding:0">
                <el-radio-group v-model="radio1" class="ml-4">
                  <el-radio label="1" size="large">是</el-radio>
                  <el-radio label="0" size="large">否</el-radio>
                </el-radio-group>
              </div>
            </el-form-item>
            <el-form-item label="请输入处理情况/未达成一致原因" :label-width="formLabelWidth" style="margin-top: 4vh">
              <el-input
                  v-model="textarea"
                  :rows="3"
                  type="textarea"
                  placeholder="Please input"
              />
            </el-form-item>
          </el-form>
          <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="jilu();dialogFormVisible = false">
          Confirm
        </el-button>
      </span>
          </template>
        </el-dialog>

      </el-col>
      <el-col :span="8" style="float: left;text-align: left;border-right: 0.15vh solid #E6E9ED" >
        <div style="margin:2vh 0 0 1.2vw;color:#08758c">是否与投诉人达成一致：</div>
        <div v-if="complain.result==0&&complain.jindu==4" style="margin-left:2vw;color:#e74c3c;font-size:2.5vh">否</div>
        <div v-if="complain.result==1&&complain.jindu==4" style="margin-left:1.4vw;margin-top:1.5vh;color:#67c23a;font-size:2.5vh">是</div>
        <div style="margin:2vh 0 0 2.5vh;color:#08758c">院方处理情况/未达成一致原因:</div>
        <div v-if="complain.jindu==4" style="margin:2vh 1.4vw 2vh 1.4vw">
          {{ complain.hospitalJilu }}
        </div>
      </el-col>
      <el-col :span="8" style="float: left;text-align: left">
        <div style="margin:2vh 0 0 1.2vw;color:#08758c">投诉人评价：</div>
        <div v-if="complain.jindu==4" class="demo-rate-block">
          <el-rate v-model="complain.pingjiaLevel" :colors="colors" disabled style="margin:2vh 0 0 1.4vw"/>
        </div>
        <div v-if="complain.jindu==4" style="margin:1.5vh 1.4vw 2vh 1.4vw;">
          {{ complain.pingjiaDetail }}
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
import { reactive, ref } from 'vue'
export default {
  name: "complainDetail",
  setup(){
    const dialogFormVisible = ref(false)
    const formLabelWidth = '17.5vh'
    const form = reactive({
      name: '',
      region: '',
      date1: '',
      date2: '',
      delivery: false,
      type: [],
      resource: '',
      desc: '',
    })
    const radio1 = ref('0')
    const textarea = ref('')
    const colors = ref(['#99A9BF', '#ffae00', '#ff7300'])
    return{
      dialogFormVisible,
      formLabelWidth,
      form,
      radio1,
      textarea,
      colors
    }
  },
  data() {
    return {
      complainId: this.$route.params.complainId,
      complain:{}
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
                "query": "db.collection(\"complainbox\").limit(500).get()"
              }
          )
              .then(function (response) {
                console.log(that.complainId)
                console.log("complain1", response.data.data);
                for (var k in response.data.data) {
                  if (JSON.parse(response.data.data[k])['_id'] == that.complainId) {
                    console.log(JSON.parse(response.data.data[k]))
                    that.complain = JSON.parse(response.data.data[k])
                    break
                  }
                }
                //进入页面即修改进度为1
                if(that.complain.jindu==0){
                  console.log("yes")
                  that.complain.jindu=1
                  axios.post('/api/tcb/invokecloudfunction?access_token=' + that.access_token +'&env=cloud-2023-jisai-7ft7ahc87f5c949'+'&name=updatecomplain',{
                        _id:that.complainId,
                        jindu:that.complain.jindu,
                      }
                  )
                      .then(function (response) {
                        console.log("xiugaicomplain", response);
                      })
                      .catch(function (error) {
                        console.log("post2", error);
                      });
                }
              })
              .catch(function (error) {
                console.log("post2", error);
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
  methods:{
    jia1(){
      this.complain.jindu=this.complain.jindu+1
      var that = this

      axios.get('/api/cgi-bin/token?grant_type=client_credential&appid=wx608d64d0acc25f28&secret=feb0adc1b0822221b6cbd6b29d889698')
          .then(function (response) {
            console.log(response.data.access_token);
            that.access_token = response.data.access_token
            console.log("that.complain.jindu",that.complain.jindu)
            axios.post('/api/tcb/invokecloudfunction?access_token=' + that.access_token +'&env=cloud-2023-jisai-7ft7ahc87f5c949'+'&name=updatecomplain',{
              _id:that.complainId,
              jindu:that.complain.jindu,
                }
            )
                .then(function (response) {
                  console.log("xiugaicomplain", response);
                })
                .catch(function (error) {
                  console.log("post2", error);
                });

          })
          .catch(function (error) {
            console.log(error);
          });
      this.$forceUpdate()
    },
    jilu(){
      this.complain.jindu=this.complain.jindu+1
      var that = this
      axios.get('/api/cgi-bin/token?grant_type=client_credential&appid=wx608d64d0acc25f28&secret=feb0adc1b0822221b6cbd6b29d889698')
          .then(function (response) {
            console.log(response.data.access_token);
            that.access_token = response.data.access_token
            console.log("that.complain.jindu",that.complain.jindu)
            axios.post('/api/tcb/invokecloudfunction?access_token=' + that.access_token +'&env=cloud-2023-jisai-7ft7ahc87f5c949'+'&name=jilu',{
                  _id:that.complainId,
                  jindu:that.complain.jindu,
                  result:that.radio1,
                  hospitalJilu:that.textarea
                }
            )
                .then(function (response) {
                  console.log("jilu", response);
                })
                .catch(function (error) {
                  console.log("post2", error);
                });
          })
          .catch(function (error) {
            console.log(error);
          });

      this.$forceUpdate()
    },
  }
}
</script>

<style scoped>

.dialog-footer button:first-child {
  margin-right: 0.65vw;
}

</style>