<template>
	<div class="convention-hall page">
		<van-nav-bar class="nav-bar" title="选妃" />
		<div class="convention-item">
			<div class="sm">
				<div>
					<div class="left">
						<p>{{ tip.title }}</p>
						<span>{{ tip.subtitle }}</span>
					</div>
					<div class="right">
						<p>
							{{ tip.illustrate }}
						</p>
					</div>
				</div>
				<span>{{ tip.initiate }}</span>
			</div>
		</div>

		<van-pull-refresh border="false" class="list-wrapper" v-model="isLoading" @refresh="onRefresh">
			<van-grid :column-num="2" :gutter="10">
				<van-grid-item @click="addgo(item.id)" v-for="(item, index) in datalist" :key="index">
					<van-image class="game_item_img" :src="item.img_url" radius="10">
						<template v-slot:loading>
							<van-loading type="circular" />
						</template>
					</van-image>
					<span class="rig-name"> {{ item.title }} </span>
				</van-grid-item>
			</van-grid>
		</van-pull-refresh>

		<Float></Float>
	</div>
</template>

<script>
import Float from "../../common/Float.vue";
export default {
	components: {
		Float
	},
	data() {
		return {
			isLoading: false,
			datalist: [],
			tip: {
				'title': '爱豆世纪传媒传媒',
				'subtitle': '华人第一福利品牌',
				'illustrate': '为了会员权益，网站只展示1%资源并且不定期更新只为展示实力，如需查询预约更多资源请联系上级接待',
				'initiate': '本平台所有资源真实丶安全点丶可靠，全国空降丶同城约炮选取你心仪的她，与您零距离邂逅，快加入我们吧'
			}
		};
	},
	methods: {
		onRefresh() {
			setTimeout(() => {
				this.$toast("刷新成功！");
				this.isLoading = false;
			}, 500);
		},
		addgo(id) {
			if (!localStorage.getItem('token')) {
				this.$router.push({ path: '/Login' });
			} else {
				this.$router.push({ path: `/profile?id=${id}` });
			}
		},
		getxuanfeilist() {
			this.$http({
				method: 'get',
				url: 'xuanfeilist',
				data: { id: this.$route.query.id || 1 }
			}).then(res => {
				this.datalist = res.data;
			});
		},
		gettip() {
			this.$http({
				method: 'get',
				url: 'sys_tip',
			}).then(res => {
				this.tip = res.data;
			});
		},
	},
	created() {
		this.getxuanfeilist();
		this.gettip();
	}
};
</script>

<style lang="less" scoped>
::v-deep .game_item_img {
	display: block;
	width: 100%;
	height: 60vw;
}
.van-pull-refresh {
	overflow: inherit !important;
}
::v-deep .van-grid-item__content--surround::after {
	border-width: 0px !important;
}
.van-grid-item__content::after {
	z-index: 1;
	border-width: 0px !important;
}
::v-deep .van-grid-item__content--center{
	padding: 0;
}
.rig-name {
	background: linear-gradient(#fde3ca, #e7b486);
	color: #525252;
	width: 94%;
	margin: 1vw;
	flex: 1;
	border-radius: 0.667vw;
	text-align: center;
	font-size: 3vw;
	padding: 1vw;
}

.sm {
	width: 100%;
	min-height: 1rem;
	border-radius: 1.333vw;
	border: 1px solid #766350;
	margin: 1.333vw 0;
	background: linear-gradient(120deg, #212121, #313131);
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 1.333vw;
	position: relative;
	overflow: hidden;

	&:after,
	&:before {
		content: "";
		position: absolute;
		width: 137.4vw;
		height: 19.2vw;
		background: linear-gradient(0deg, rgba(74, 70, 70, .29), transparent);
		transform: rotate(139deg);
	}

	&:after {
		left: -35%;
		z-index: 0;
	}

	&:before {
		left: -4%;
	}

	&>div {
		position: relative;
		z-index: 99;
		display: flex;

		.left {
			width: 32%;
			position: relative;
			z-index: 99;

			&::after {
				content: "";
				position: absolute;
				width: 0.02rem;
				height: 100%;
				background: #f6d5a1;
				right: 0;
				top: 0;
			}

			p,
			span {
				color: #ddb285;
				font-size: 3vw;
				padding-top: 1.333vw;
				text-align: center;
			}

			p {
				font-weight: 1000;
				background-image: -webkit-linear-gradient(top, #f8dbae, #edbd71);
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				font-size: 4.267vw;
				text-align: center;
				margin-top: 3vw;
			}

			span {
				line-height: 3.2vw;
			}
		}

		.right {
			flex: 1;
			padding-left: 1.333vw;

			p {
				color: #dadada;
				font-size: 3vw;
				line-height: 6.4vw;
			}
		}
	}

	&>span {
		color: #ddb285;
		font-size: 3vw;
		padding-top: 1.333vw;
		text-align: center;
		line-height: 5.067vw;
	}
}



.page {
	position: absolute !important;
	top: 0;
	left: 0;
	right: 0;
	background-color: #f2f2f5;
}

.nav-bar {
	background: linear-gradient(90deg, #7e5678, #e6c3a1);
	height: 100px;
}

.van-nav-bar {
	line-height: 50px;
}

::v-deep .van-nav-bar__title {
	max-width: 60%;
	margin: 0 auto;
	color: #ffffff;
	font-size: 35px;
}

::v-deep .van-nav-bar__content {
	height: 100px;
}

.van-sidebar {
	width: 180px;
}

.convention-hall {
	display: flex;
	flex-direction: column;
	padding-bottom: 21vw;
	background: #f2f2f5;
	height: 100%;

	.convention-item {
		padding: 15px;
	}
}

::v-deep .van-tab {
	font-size: 30px;
	line-height: 100px;
	font-weight: bold;
}

::v-deep .van-tabs__line {
	background-color: #7e5678;
}

::v-deep .van-tabs--line .van-tabs__wrap {
	height: 100px;
}

::v-deep .van-tabs__wrap--scrollable .van-tab {
	padding: 0 23px;
}

.card {
	background-color: #8a637d;
	padding: 0.625rem;
	width: 95%;
	color: white;
	font-size: 0.8125rem;
	margin: 0.625rem auto;
	border-radius: 0.375rem;
}

::v-deep .van-row--flex {
	height: 80px;
	line-height: 80px;
}

.rig-box {
	width: 95%;
	margin: 0.625rem auto;
}

.rig-title {
	color: #0bdab0;
	font-size: 1.125rem;
}

.rig-content {
	font-size: 20px;
	// margin-top: 10px;
}

.address {
	width: 90%;
	margin: 0 auto;
}

::v-deep .van-grid-item__content {
	background-color: black !important;
}
</style>
