<template>
  <div class="container page">
    <div class="header">
      <van-nav-bar title="系统公告" class="nav-bar">
        <template #left>
          <van-icon name="arrow-left" color="#fff" @click="back()"/>
        </template>
      </van-nav-bar>
    </div>
    
    <!-- 添加tab切换栏 -->
    <div class="tab-container">
      <van-tabs v-model="activeTab" @click="onTabClick" color="#ddb285" title-active-color="#ddb285">
        <van-tab v-for="(title, key) in noticeTypes" :key="key" :title="title" :name="key"></van-tab>
      </van-tabs>
    </div>
    
    <div class="content">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <div class="listItem" v-for="(v,key) in notice" :key="key" @click="goToDetail(v.id)">
            <div class="listTitle">{{ v.name }}</div>
            <div class="listContent html"><p>{{ v.text }}<br></p></div>
            <div class="listTime">
              <div class="listTimeText">{{ v.create_time }}</div>
              <van-icon name="arrow" class="arrow-icon" />
            </div>
          </div>
      </van-pull-refresh>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
      notice:{},
      loading: false,
      finished: false,
      activeTab: '1', // 默认选中第一个tab
      noticeTypes: {
        '1': '会员站内信息',
        '2': '系统信息', 
        '3': '网站公告'
      },
      type:1
    };
  },
  methods: {
    back(){
      return window.history.back();
    },
    onTabClick(name) {
      this.activeTab = name;
      this.getNoticeList(name);
    },
    getNoticeList(type){
      this.$http({
        method: 'get',
        url: 'sys_get_notice_list',
        data: { type: type }
      }).then(res=>{
        console.log('获取公告列表:', res);
        this.notice = this.decodeData(res.data);
      })
    },
    getNoticeType(){
      this.$http({
        method: 'get',
        url: 'sys_get_notice_type'
      }).then(res => {
        console.log('获取公告类型:', this.decodeData(res.data));
        const decodedTypes = this.decodeData(res.data);
        if (typeof decodedTypes === 'object') {
          this.noticeTypes = decodedTypes;
        }
        // 获取类型后，加载默认的公告列表
        this.getNoticeList(this.activeTab);
      })
    },
    onRefresh() {
      setTimeout(() => {
        this.$toast("刷新成功");
        this.isLoading = false;
        this.getNoticeList(this.activeTab);
      }, 500);
    },
    decodeData(encoded) {
      try {
        // 如果已经是对象，直接返回
        if (typeof encoded === 'object') {
          return encoded;
        }

        // 如果是 JSON 字符串
        if (encoded.startsWith("{") || encoded.startsWith("[")) {
          return JSON.parse(encoded);
        }

        // 如果是 Base64，先修正 URL 安全字符
        let str = encoded.replace(/-/g, '+').replace(/_/g, '/');

        // 补齐 Base64 padding
        while (str.length % 4 !== 0) {
          str += '=';
        }

        // Base64 解码
        const decoded = atob(str);

        // 转成对象
        const json = JSON.parse(decoded);

        // 转中文
        const result = {};
        for (let key in json) {
          result[key] = json[key].replace(/\\u([\dA-F]{4})/gi, (_, grp) =>
            String.fromCharCode(parseInt(grp, 16))
          );
        }

        return result;
      } catch (e) {
        console.error("解码失败:", e, encoded);
        return encoded; // 出错时原样返回，避免页面挂掉
      }
    },
    
    // 跳转到通知详情页
    goToDetail(noticeId) {
      if (noticeId) {
        this.$router.push({
          name: 'NoticeDetail',
          params: { 
            id: noticeId,
            tabTitle: this.noticeTypes[this.activeTab] // 传递当前tab的标题
          }
        });
      } else {
        this.$toast('通知ID不存在');
      }
    }
  },
  created() {
    this.getNoticeType();
  }
};
</script>

<style lang='less' scoped>
@import "../../assets/css/base.css";
::v-deep .van-pull-refresh__track .van-pull-refresh__head *{
  color: #000000;
  font-size: 35px;
}

::v-deep .van-loading__text {
  color: #000000;
  font-size: 35px;
}

.tab-container {
  background: #fff;
  padding: 10px 20px;
}

::v-deep .van-tabs__wrap {
  height: 100px;
}

::v-deep .van-tab {
  font-size: 30px;
  color: #666;
   line-height: 100px;
}

::v-deep .van-tab--active {
  color: #ddb285;
  font-weight: bold;
}

::v-deep .van-tabs__line {
  height: 6px;
  border-radius: 3px;
}

.container .content {
  height: calc(100% - 108px); /* 减去tab的高度 */
  overflow: auto;
}
.container .content .listItem{
  margin-bottom: 20px;
  padding: 20px 20px 0;
  position: relative;
  color: #000;
  background-color: #fff;
}
.container .content .listItem .listTitle{
  font-size: 38px;
}
.container .content .listItem .listContent{
  border-bottom: 2px solid #f2f2f5;
  padding: 5px 0;
  font-size: 25px;
}
.container .content .listItem .listTime{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  height: 70px;
}
.container .content .listItem .listTime .listTimeText {
  color: #656566;
  font-size: 30px;
}
.listItem {
  background: #fff;
  margin: 20px;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.listItem:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.listTime {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.arrow-icon {
  color: #999;
  font-size: 16px;
}
</style>
