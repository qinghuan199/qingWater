<template>
	<div class="container page">
		<van-nav-bar :title="this.vod_name" class="nav-bar">
			<template #left>
				<van-icon name="arrow-left" color="#fff" @click="back()" />
			</template>
		</van-nav-bar>
		<div class="right">
			<van-pull-refresh border="false" class="list-wrapper" v-model="isLoading" @refresh="onRefresh">
				<van-grid :column-num="2" :gutter="10">
					<van-grid-item @click="profile(v.id)" v-for="(v, k) in datalist" :key="k">
						<van-image class="game_item_img" :src="v.img_url">
							<template v-slot:loading>
								<van-loading type="circular" />
							</template>
						</van-image>
						<span class="rig-name">{{ v.xuanfei_name }}</span>
					</van-grid-item>
				</van-grid>
			</van-pull-refresh>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			vod_name: '北京',
			isLoading: false,
			datalist: [
				// {
				// 	xuanfei_name: '北京 健身达人',
				// 	img_url: 'https://kk.betman2.co/storage/41/62fe1bd26d01c_image_2022-08-18_190032731.png'
				// },
				// {
				// 	xuanfei_name: '北京 学生妹',
				// 	img_url: 'https://kk.betman2.co/storage/344/630869b4bd2d6_1.jpg'
				// }
			]
		};
	},
	methods: {
		back() {
			this.$router.push({ path: 'Choose' });
		},
		onRefresh() {
			setTimeout(() => {
				this.$toast("刷新成功！");
				this.isLoading = false;
			}, 500);
		},
		profile(id) {
			this.$router.push({ path: '/profile?id=' + id + '&name=' + this.vod_name + '&adsid=' + this.$route.query.id });
		},
		getxuanfeilist() {
			this.$http({
				method: 'get',
				url: 'xuanfeilist',
				data: { id: this.$route.query.id }
			}).then(res => {
				this.datalist = res.data;
			});
		}
	},
	created() {
		this.vod_name = this.$route.query.name;
		this.getxuanfeilist();
	}
};
</script>

<style scoped>
.right {
	margin-top: 10px;
}
::v-deep .van-grid-item__content--center {
	border-radius: 15px;
	padding: 0;
	height: auto;
}
::v-deep .van-image__img {
	border-radius: 10px;
	padding: 15px;
}
.rig-name {
	width: 100%;
	height: 60px;
	line-height: 60px;
	margin-top: 10px;
	background-color: #f7f7f7;
	border-radius: 0 0 15px 15px;
	font-size: 15px;
	padding-left: 10px;
}
</style>
