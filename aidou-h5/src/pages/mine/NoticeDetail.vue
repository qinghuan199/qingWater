<template>
  <div class="notice-detail">
    <!-- 顶部导航栏 -->
    <div class="header">
      <van-nav-bar :title="pageTitle" class="nav-bar">
        <template #left>
          <van-icon name="arrow-left" color="#fff" @click="back()" />
        </template>
      </van-nav-bar>
    </div>

    <!-- 内容区域 - 与Notice.vue保持一致的布局 -->
    <div class="content">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <!-- 详情内容 - 使用与Notice.vue相同的listItem结构 -->
        <div v-if="noticeDetail" class="listItem">
          <div class="listTitle">{{ noticeDetail.name || noticeDetail.title }}</div>
          <div class="listContent html">
            <p>{{ noticeDetail.text || noticeDetail.content }}<br></p>
          </div>
          <div class="listTime">
            <div class="listTimeText">{{ noticeDetail.create_time }}</div>
          </div>
        </div>

        <!-- 空状态 -->
        <van-empty v-else-if="!isLoading" description="暂无详情数据" />
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoticeDetail',
  data() {
    return {
      isLoading: true,
      noticeDetail: null,
      noticeId: null,
      pageTitle: '公告详情' // 默认标题
    }
  },
  created() {
    this.noticeId = this.$route.params.id;
    // 获取传递过来的tab标题
    const tabTitle = this.$route.params.tabTitle;
    if (tabTitle) {
      this.pageTitle = tabTitle;
    }
    
    if (this.noticeId) {
      this.getNoticeDetail();
    } else {
      this.isLoading = false;
    }
  },
  methods: {
    // 返回上一页
    back() {
      this.$router.go(-1);
    },

    // 下拉刷新
    onRefresh() {
      this.getNoticeDetail();
    },

    // 获取通知详情
    getNoticeDetail() {
      this.$http({
        method: 'get',
        url: 'sys_get_notice_detail',
        data: { id: this.noticeId }
      }).then(res => {
        console.log('获取通知详情:', res);
        this.noticeDetail = this.decodeData(res.data);
        this.isLoading = false;
      }).catch(err => {
        console.error('获取通知详情失败:', err);
        this.isLoading = false;
        this.$toast('获取详情失败');
      });
    },

    // 解码数据
    decodeData(data) {
      if (typeof data === 'string') {
        try {
          return JSON.parse(atob(data));
        } catch (e) {
          console.error('解码失败:', e);
          return data;
        }
      }
      return data;
    }
  }
}
</script>

<style lang='less' scoped>
@import "../../assets/css/base.css";

::v-deep .van-pull-refresh__track .van-pull-refresh__head * {
  color: #000000;
  font-size: 35px;
}

::v-deep .van-loading__text {
  color: #000000;
  font-size: 35px;
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

.notice-detail {
  min-height: 100vh;
  background-color: #282828;
}

.loading-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.detail-content {
  margin-bottom: 20px;
  padding: 20px 20px 0;
  position: relative;
  color: #000;
  background-color: #fff;
}

.detail-title {
  font-size: 38px;
  font-weight: bold;
  color: #333;
  line-height: 1.4;
  margin-bottom: 12px;
}

.detail-time {
  border-bottom: 2px solid #f2f2f5;
  padding: 5px 0;
  font-size: 25px;
  color: #656566;
  margin-bottom: 16px;
}

.detail-body {
  font-size: 25px;
  line-height: 1.6;
  color: #000;
  padding: 20px 0;
}

.detail-body img {
  max-width: 100%;
  height: auto;
}

.detail-body p {
  margin-bottom: 12px;
}
</style>