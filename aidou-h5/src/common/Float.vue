<template>
    <div>
        <div class="float" @click="show = !show">
            <span>投票打赏</span>
        </div>

        <van-popup v-model="show">
            <div style="display: flex; flex-direction: column;align-items: center;padding: 10px 30px;">
                <h4 style="margin: 10px 0;">投票打赏</h4>
                <van-field v-model="value" placeholder="请输入主播编号" />
                <van-button round="true" class="button" 
                    @click="$router.push({ path: '/Lottery?key=game2&id=12' })">确定</van-button>
            </div>
        </van-popup>
    </div>
</template>

<script>
export default {
    data() {
        return {
            show: false,

        };
    },
    methods: {},
};
</script>

<style lang="less" scoped>
.float {
    position: fixed;
    top: calc(50vh - 3em);
    width: 2em;
    right: 0;
    background: linear-gradient(#fde3ca,#e7b486)!important;
    // box-shadow: 0 0 10px #c75050;
    padding: 30px 10px;
    text-align: center;
    z-index: 10;
    color: white;
    border-radius: 30px;

    &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        // border-style: solid;
        // background: linear-gradient(#fde3ca,#e7b486)!important;
        // z-index: -1;
        // border-radius: 30px;
        // border-color: black;
        
    }
}
</style>
