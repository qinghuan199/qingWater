<template>
    <div class="page">
        <van-nav-bar class="nav-bar">
            <template #left>
                <van-icon name="arrow-left" color="#be9f80" @click="$router.back()" />
            </template>
            <template #title>
                <div style="display: flex;align-items: center;">
                    <span style="color: #be9f80;">同城数据</span>
                    <van-icon name="arrow-down" color="#be9f80" />
                </div>
            </template>
        </van-nav-bar>

        <div style="flex: 1;">
            <van-cell-group>
                <van-cell title="2021111111111" style="color: #be9f80;">
                    <template #right-icon>
                        <div style="display: flex;flex-direction: column;align-items: flex-end;">
                            <span style="font-size: 4vw;">2021111111111</span>
                            <span style="font-size: 4vw; color: white;">2222222222</span>
                        </div>
                    </template>

                </van-cell>
                <van-cell>
                    <template #title>
                        <span>烟花1</span>
                        <span style="margin-left: 20px;">单件</span>
                    </template>
                    <template #right-icon>
                        <van-icon name="arrow-down" />
                    </template>
                </van-cell>
            </van-cell-group>

            <van-grid :column-num="2" :border="false">
                <van-grid-item>
                    <p class="liwu">爱心</p>
                </van-grid-item>
                <van-grid-item>
                    <p class="liwu">烟花</p>
                </van-grid-item>
                <van-grid-item>
                    <p class="liwu">单件</p>
                </van-grid-item>
                <van-grid-item>
                    <p class="liwu">双件</p>
                </van-grid-item>
            </van-grid>

            <van-image src="">
                <template v-slot:loading>
                    <van-loading type="circular" />
                </template>
            </van-image>

        </div>

        <div class="tabbar-tips">
            <p>3个30000总积分</p>
            <p>账户余额：1111111积分</p>
        </div>

        <div class="tabber-box">
            <van-button type="danger" round color="#000000" style="flex: none;" @click="value = ''">重置</van-button>
            <van-field v-model="value" />
            <p style="flex: none;">点击投票</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            time: '',
            value: 111
        };
    },
    methods: {

    },
    created() {
        const now = new Date();
        const hours = ('0' + now.getHours()).slice(-2);
        const minutes = ('0' + now.getMinutes()).slice(-2);
        this.time = hours + ":" + minutes;
    }
};
</script>
<style scoped lang="less">
@color: #be9f80;

.tabber-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;

    ::v-deep .van-field__control {
        background-color: @color;
        text-align: center;
        color: white;
        border-radius: 30px;
    }

    &>p {
        background-color: @color;
        color: white;
        border-radius: 50px;
        padding: 10px 20px;
        margin: 0;
    }
}

.van-cell::after {
    border: 0;
}

.tabbar-tips {
    display: flex;
    background-color: @color;
    padding: 0 30px;
    justify-content: space-between;

    &>p {
        color: white;
        font-size: 3vw;
    }
}

.liwu {
    background-color: #000000;
    padding: 10px 40px;
    border-radius: 12px;
    border: 1px solid @color;
}

.nav-bar {
    background: linear-gradient(120deg, #212121, #313131);
}

.page {
    background: linear-gradient(120deg, #212121, #313131);
    color: @color;
    bottom: 0;
    display: flex;
    flex-direction: column;
}

.van-cell-group {
    background-color: transparent;
}

.van-cell {
    font-size: 4.867vw;
    line-height: 4.867vw;
    background-color: transparent;
    color: @color;
}

.van-cell__title {
    display: flex;
    align-items: center;
}

::v-deep .van-grid-item__content {
    background-color: transparent;
}

::v-deep .van-grid-item__content {
    padding: 0;
}</style>
