<template>
	<van-tabbar v-if="show" v-model="active" active-color="#be9f80" :border="true" inactive-color="#979799">
		<van-tabbar-item v-for="(k, key) in item" replace :to="k.router" :key="key">
			<span>{{ k.title }}</span>
			<template #icon="props">
				<img :src="props.active ? k.icon.active : k.icon.noactive" :alt="k.title" v-show="key !== 2" />
				<img :src="props.active ? k.icon.active : k.icon.noactive" :alt="k.title" class="tui" style="height: 4rem;" v-show="key === 2" />
			</template>
		</van-tabbar-item>
	</van-tabbar>
</template>

<script>
export default {
	data() {
		return {
			show: false,
			active: 0,
			item: [
				{
					router: '/Home',
					title: '首页',
					icon: {
						active: '/img/footer/homes.jpg',
						noactive: '/img/footer/home.jpg'
					}
				},
				{
					router: '/Game',
					title: '直播间',
					icon: {
						active: '/img/footer/yuyues.jpg',
						noactive: '/img/footer/yuyue.jpg'
					}
				},
				{
					router: '/Choose',
					title: '',
					icon: {
						active: '/img/footer/beauty.52660ad1.png',
						noactive: '/img/footer/beauty.52660ad1.png'
					}
				},
				{
					router: '/Video',
					title: '视频',
					icon: {
						active: '/img/footer/videos.jpg',
						noactive: '/img/footer/video.jpg'
					}
				},
				{
					router: '/Mine',
					title: '我的',
					icon: {
						active: '/img/footer/mys.jpg',
						noactive: '/img/footer/my.jpg'
					}
				}
			]
		};
	},
	methods: {},
	watch: {
		$route(to) {
			if (to.name == 'home') {
				this.active = 0;
				this.show = true;
			} else if (to.name == 'game') {
				this.active = 1;
				this.show = true;
			} else if (to.name == 'choose') {
				this.active = 2;
				this.show = true;
			} else if (to.name == 'video') {
				this.active = 3;
				this.show = true;
			} else if (to.name == 'mine') {
				this.active = 4;
				this.show = true;
			} else {
				this.show = false;
			}
		}
	},
	created() {
		if (this.$route.name == 'home') {
			this.active = 0;
			this.show = true;
		} else if (this.$route.name == 'game') {
			this.active = 1;
			this.show = true;
		} else if (this.$route.name == 'choose') {
			this.active = 2;
			this.show = true;
		} else if (this.$route.name == 'video') {
			this.active = 3;
			this.show = true;
		} else if (this.$route.name == 'mine') {
			this.active = 4;
			this.show = true;
		} else {
			this.show = false;
		}
	}
};
</script>

<style lang="less" scoped>
@tabbar-height: 110px;
@tabbar-img: 75px;
.van-tabbar {
	height: @tabbar-height;
	bottom: -2px;
}
.van-tabbar-item__icon img {
	height: @tabbar-img;
}
.van-tabbar-item {
	font-size: 26px;
}
.tui {
	width: 4rem;
	margin-top: -10.333vw;
	background-color: white;
	border-radius: 50%;
	border: 10px solid white;
	z-index: 10;
}
[class*='van-hairline']::after {
	border: none !important;
}
</style>
