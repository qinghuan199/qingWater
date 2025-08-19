<template>
	<div class="convention-hall page">
		<van-nav-bar class="nav-bar" title="选妃" />
		<div class="convention-item">
			<van-tabs animated sticky line-width="100px" :swipeable="true">
				<van-tab title="城市大全">
					<div class="card">本平台全网最真实外围+商务伴游+同城激情，为保证每个用户的个人隐私，客户仅限通过联系接待员或平台资深会员实名推荐才可加入。</div>
					<div class="address">
						<van-row type="flex" justify="" gutter="65" v-for="(val, key) in addlist" :key="key">
							<van-col span="" offset="" @click="addgo(v)" v-for="(v, k) in val" :key="k">{{ v.name }}</van-col>
						</van-row>
					</div>
				</van-tab>
				<van-tab title="流程价格">
					<div class="card">本平台全网最真实外围+商务伴游+同城激情，为保证每个用户的个人隐私，客户仅限通过联系接待员或平台资深会员实名推荐才可加入。</div>
					<div class="rig-box">
						<p class="rig-title">有哪些资源?</p>
						<p class="rig-content">网红、模特、空姐、嫩模、大学生，只有您想不到，没有本平台办不到</p>
						<p class="rig-title">服务范围?</p>
						<p class="rig-content">同城免费约炮，任意地点全国空降，国内一二线城市当地均有，三线城市也可通过联系接待员预约安排。</p>
						<p class="rig-content">本平台全网最真实外围+商务伴游+同城激情，为保证每个用户的个人隐私，客户仅限通过联系接待员或平台资深会员实名推荐才可加入。</p>
					</div>
				</van-tab>
			</van-tabs>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			addlist: [
				{
					0: '北京',
					1: '上海',
					2: '广州',
					3: '深圳'
				},
				{
					0: '南京',
					1: '长沙',
					2: '重庆',
					3: '西安'
				}
			]
		};
	},
	methods: {
		addgo(data) {
			if (!localStorage.getItem('token')) {
				this.$router.push({ path: '/Login' });
			} else {
				this.$router.push({ path: '/list?id=' + data.id + '&name=' + data.name });
			}
		},
		getAddress() {
			this.$http({
				method: 'get',
				url: 'address_list'
			}).then(res => {
				this.addlist = res.data;
			});
		}
	},
	created() {
		this.getAddress();
	}
};
</script>

<style lang="less" scoped>
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
	bottom: 20px;
	background: #f2f2f5;
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
</style>
