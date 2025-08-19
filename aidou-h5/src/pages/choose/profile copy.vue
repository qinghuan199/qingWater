<template>
	<div class="page">
		<van-nav-bar title="选妃" class="nav-bar">
			<template #left>
				<van-icon name="arrow-left" color="#fff" @click="back()" />
			</template>
		</van-nav-bar>
		<div class="box">
			<p class="name">{{ this.xuanfeidata.xuanfei_name }}</p>
			<p class="title">{{ this.xuanfeidata.vo_title }}</p>
			<van-image width="98%" fit="contain" height="100%" v-for="(v, k) in xuanfeidata.img_url" :key="k" :src="v" />
			<van-button round="true" @click="yuyue" class="button" color="linear-gradient(to right, #7f5778 , #e5c2a0)">预约</van-button>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			xuanfeidata: []
		};
	},
	methods: {
		back() {
			this.$router.push({ path: 'list?id=' + this.$route.query.adsid + '&name=' + this.$route.query.name });
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

<style>
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
}
.title {
	font-size: 0.625rem;
}
.button {
	width: 10rem;
	height: 2.5rem;
	font-size: 0.9375rem;
	margin-top: 0.625rem;
}
</style>
