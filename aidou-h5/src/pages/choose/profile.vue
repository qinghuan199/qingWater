<template>
	<div class="page">
		<van-nav-bar title="主播" class="nav-bar">
			<template #left>
				<van-icon name="arrow-left" color="#fff" @click="back()"/>
			</template>
		</van-nav-bar>
		<div class="tableLine"><span class="midText"></span></div>
		<div class="box">
			<p class="timibbs_title">{{ this.xuanfeidata.title }}</p>
			<p class="name">{{ this.xuanfeidata.xuanfei_name }}</p>
			<p class="title">{{ this.xuanfeidata.vo_title }}</p>
			<van-image width="98%" fit="contain" height="100%" v-for="(v, k) in xuanfeidata.img_url" :key="k" :src="v" />
			<van-button round @click="show = !show" class="button"
				>立即打榜</van-button>
		</div>

		<van-popup v-model="show">
			<div style="display: flex; flex-direction: column;align-items: center;padding: 10px 30px;">
				<h4 style="margin: 10px 0;">投票打赏</h4>
				<van-field v-model="value" placeholder="请输入主播编号" />
				<van-button round class="button"	@click="$router.push({ path: '/Lottery?key=game2&id=12' })">确定</van-button>
			</div>
		</van-popup>
	</div>
</template>

<script>
export default {
	data() {
		return {
			xuanfeidata: {
				xuanfei_name: '',
				vo_title: '',
				img_url: []
			},
			show: false,
			value: ""
		};
	},
	methods: {
		back() {
			this.$router.back();
		},
		getxuanfeidata() {
			this.$http({
				method: 'get',
				url: 'xuanfeidata',
				data: { id: this.$route.query.id }
			}).then(res => {
				this.xuanfeidata = res.data;
			});
		},
		yuyue() {
			this.$toast('请联系顾问或接待员');
		}
	},
	created() {
		this.getxuanfeidata();
	}
};
</script>
<style >
.tableLine {
	position: relative;
	margin: 0 auto;
	height: 1px;
	background-color: #766350;
  }
.midText {
	position: absolute;
	left: 50%;
	background-color: #ffffff;
	padding: 0 15px;
	transform: translateX(-50%) translateY(-50%);
  }
body {
    background: #282828;
}
.van-cell {
	font-size: 3.867vw;
}

.container {
	display: inline-block;
}

.box {
	width: 95%;
	margin: 0 auto;
	text-align: center;
	padding-bottom: 6.25rem;
}

.name {
	font-size: 1.125rem;
	color: #ddb285;
}
.timibbs_title{
    font-size: 1.125rem;
    color: #ddb285;
    border-radius: 6px;
    background: #585049;
    width: 60%;
    display: inline-block;
    padding: 6px;
    font-weight: 600;
}
.title {
	font-size: 0.625rem;
}

.button {
	width: 10rem;
	height: 2.5rem;
	font-size: 0.9375rem;
	background: linear-gradient(#fde3ca,#e7b486) !important;
	margin: 2vw;
	border-radius: 24px;
	text-align: center;
}
</style>
