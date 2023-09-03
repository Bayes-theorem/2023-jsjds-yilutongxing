const commonWordsList = [
  '我想查询一下处理进度',
  '请问处理结果预计什么时候出来',
  '我有一个问题',
  '谢谢',
  
];

// eslint-disable-next-line no-undef
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    display: {
      type: Boolean,
      value: '',
      observer(newVal) {
        this.setData({
          displayTag: newVal,
        });
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    displayTag: true,
    words: '',
    commonWordsMatch: commonWordsList,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleClose() {
      this.triggerEvent('close', {
        key: '0',
      });
    },
    wordsInput(e) {
      this.data.commonWordsMatch = [],
      commonWordsList.forEach((item) => {
        if (item.indexOf(e.detail.value) > -1) {
          this.data.commonWordsMatch.push(item);
        }
      });
      this.setData({
        words: e.detail.value,
        commonWordsMatch: this.data.commonWordsMatch,
      });
    },
    sendMessage(e) {
      this.triggerEvent('sendMessage', {
        message: e.currentTarget.dataset.words,
      });
    },

  },
});
