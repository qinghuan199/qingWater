<template>
	<view class="min-picker">
		<view class="min-popup" v-if="show" :class="[show ? 'min-show' : 'min-hide']">
			<view class="min-content" :style="{height:heightRpx+'rpx'}">
				<view class="main-top">
					<view class="picer-top">
						<text @click="cacel">取消</text>
						<text @click="sure" class="sure">确定</text>
					</view>
				</view>
				<picker-view :indicator-style="indicatorStyle" :value="value" @change="bindChange"
					style="height:400rpx">
					<picker-view-column>
						<view class="picker item" v-for="(item,index) in years" :key="index">{{item}}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="picker item" v-for="(item,index) in months" :key="index">
							{{isEn?enMonth[index]:item}}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="picker item" v-for="(item,index) in days" :key="index">{{item}}</view>
					</picker-view-column>
				</picker-view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		name: 'MinPicker',
		props: {
			show: {
				type: Boolean,
				default: false
			},
			startTime: {
				type: Array,
				default: () => [2025, 8, 1]
			},
			endTime: {
				type: Number,
				default: 2050
			},
			heightRpx: {
				type: String
			}
		},
		data() {
			return {
				years: [],
				months: [],
				days: [],
				dayLength: 30,
				value: [0, 0, 0],
				visible: false,
				month: '',
				year: '',
				flag: false,
				isEn: uni.getLocale() == 'en' ? true : false,
				indicatorStyle: `height: ${Math.round(uni.getSystemInfoSync().screenWidth / (750 / 100))}rpx;`
			}
		},
		mounted() {
			this.enMonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
				'October', 'November', 'December'
			]
			const time = new Date()
			const year = this.startTime[0]
			const month = this.startTime[1]
			this.month = month
			this.year = year
			this.getDaysInOneMonth(year, month)
			this.getYears()
			this.getMonth()
			this.getDays()
			// 获取初始位置
			this.value = [this.years.indexOf(this.year), this.months.indexOf(this.month), this.days.indexOf(this.startTime[
				2])]
		},
		methods: {
			bindChange: function(e) {
				this.getDaysInOneMonth(this.years[e.target.value[0]], this.months[e.target.value[1]])
				this.flag = true
				const val = e.detail.value
				this.year = this.years[val[0]]
				this.month = this.months[val[1]] < 10 ? '0' + this.months[val[1]] : this.months[val[1]]
				this.day = this.days[val[2]] < 10 ? '0' + this.days[val[2]] : this.days[val[2]]
				this.getDays()
				if (this.year === this.years[0] && this.startTime[1] && this.startTime[2]) {
					this.getMonth(this.startTime[1])
					return this.getDays(this.startTime[2])
				}
				this.getYears()
				this.getMonth()
				this.getDays()
				// })
			},
			// 获得年份
			getYears() {
				this.years = []
				for (let i = this.startTime[0]; i <= this.endTime; i++) {
					// console.log(i)
					this.years.push(i)
				}
			},
			// 获取月份
			getMonth(min) {
				this.months = []
				// const time = new Date()
				for (let i = min ? min : 1; i <= 12; i++) {
					this.months.push(i)
				}
			},
			getDays(min) {
				this.days = []
				for (let i = min ? min : 1; i <= this.dayLength; i++) {
					this.days.push(i)
				}
			},
			// 获取某年某月多少天
			getDaysInOneMonth(year, month) {
				month = parseInt(month, 10)
				var d = new Date(year, month, 0)
				this.dayLength = d.getDate()
				this.getDays()
				return d.getDate()
			},
			// 取消
			cacel() {
				this.$emit('cancel', false)
			},
			// 确认
			sure() {
				if (!this.flag) {
					this.$emit('cancel', false)
					this.$emit('sure', {
						a: this.years[this.value[0]],
						b: this.months[this.value[1]],
						c: this.days[this.value[2]]
					})
					return
				}
				this.$emit('cancel', false)
				this.$emit('sure', {
					a: this.year,
					b: this.month,
					c: this.day
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.main-top {
		padding: 0 30rpx;

		.picer-top {
			width: 100%;
			height: 100rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 30rpx;
			border-bottom: 1rpx solid #eee;

			.sure {
				color: #000;
			}
		}
	}

	.picker {
		text-align: center;
		line-height: 50rpx;
	}

	.min-popup {
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;

		&.min-hide {
			.min-content {
				animation: hide .5s linear forwards;
			}

			.min-content-height {
				animation: hide .5s linear forwards;
			}

		}

		&.min-show {
			.min-content {
				animation: show .5s linear forwards;
			}

			.min-content-height {
				animation: show .5s linear forwards;
			}
		}

		.min-content {
			width: 100%;
			height: 600rpx;
			background: #fff;
			position: absolute;
			left: 0;
			bottom: 0;
			z-index: 9999;
			overflow: hidden;
			border-radius: 20rpx 20rpx 0 0;
		}

		@keyframes hide {
			100% {
				transform: translateY(100%);
			}

			0% {
				transform: translateY(0);
			}
		}

		@keyframes show {
			0% {
				transform: translateY(100%);
			}

			100% {
				transform: translateY(0);
			}
		}
	}
</style>