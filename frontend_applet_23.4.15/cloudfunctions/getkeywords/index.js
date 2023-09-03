// 云函数入口文件
const cloud = require('../getOpenID/node_modules/wx-server-sdk')

// 导入tencentcloud-sdk-nodejs模块
const tencentcloud = require("tencentcloud-sdk-nodejs")

cloud.init()
// 云函数入口函数
exports.main = async (event, context) => {
  // 调用getResult返回情感分析结果
  return await getResult(event.val)
}
// 创建获取情感分析结果的请求函数
function getResult(post) {
  const NlpClient = tencentcloud.nlp.v20190408.Client;
const clientConfig = {
  credential: {
    secretId: "AKIDNYUAZgX6OO7amhLjpeCUWGjuqUrxmKaY",
    secretKey: "kDOIuGL8etrXw4vVoqc6JEtHNCk10i8I",
  },
  region: "ap-guangzhou",
  profile: {
    httpProfile: {
      endpoint: "nlp.tencentcloudapi.com",
    },
  },
};

const client = new NlpClient(clientConfig);
  return new Promise((resolve,reject)=>{
    client.KeywordsExtraction(
    {
      "Text":post
    },
    function(errMsg,response){
      if(errMsg){
        console.log(errMsg)
        reject(errMsg)
      }
      console.log(response)
      resolve(response)
    }
    )
  })
}