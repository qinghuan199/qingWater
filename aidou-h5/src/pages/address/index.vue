<template>
    <div class="address-page">
        <div class="header">
            <van-nav-bar title="地区选择" class="nav-bar">
                <template #left>
                    <van-icon name="arrow-left" color="#fff" @click="back()" />
                </template>
            </van-nav-bar>
        </div>
        <div class="address-grid">
            <div class="address-row" v-for="(row, rowIndex) in addressList" :key="rowIndex">
                <van-button
                    class="address-button"
                    v-for="(item, itemIndex) in row"
                    :key="itemIndex"
                    @click="selectAddress(item.id, item.name)"
                    :style="{ backgroundColor: '#eacc9a' }"
                >
                    {{ item.name }}
                </van-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            addressList: []
        };
    },
    created() {
        this.getAddressList();
    },
    methods: {
        getAddressList() {
            this.$http({
                method: 'get',
                url: 'address_list'
            }).then(res => {
                const decodedData = this.decodeData(res.data);
                this.addressList = decodedData;
            });
        },
        decodeData(encoded) {
            try {
                if (typeof encoded === 'object') {
                    return encoded;
                }
                if (encoded.startsWith("{") || encoded.startsWith("[")) {
                    return JSON.parse(encoded);
                }
                let str = encoded.replace(/-/g, '+').replace(/_/g, '/');
                while (str.length % 4 !== 0) {
                    str += '=';
                }
                const decoded = atob(str);
                const json = JSON.parse(decoded);
                const result = {};
                for (let key in json) {
                    result[key] = json[key].replace(/\\u([\dA-F]{4})/gi, (_, grp) =>
                        String.fromCharCode(parseInt(grp, 16))
                    );
                }

                return result;
            } catch (e) {
                console.error("解码失败:", e, encoded);
                // Fallback to simple atob and JSON.parse if the complex one fails
                try {
                    return JSON.parse(atob(encoded));
                } catch (e2) {
                    console.error("Simple decoding also failed:", e2, encoded);
                    return []; // return empty array on failure
                }
            }
        },
        back() {
            return window.history.back();
        },
        selectAddress(id, name) {
            this.$router.push({ path: '/Home', query: { addressId: id, addressName: name } });
        }
    }
};
</script>

<style lang="less" scoped>
.address-page {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #282828;
}

.address-grid {
    display: flex;
    flex-direction: column;
    padding: 10px;
    margin-top: 20px;
}

.address-row {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 15px;
}

.address-button {
    width: 23%;
    height: 60px;
    margin: 0 1%;
    font-size: 24px;
    font-weight: bold;
    border-radius: 8px;
    color: #000;
    border: none;
}

.nav-bar {
    background: linear-gradient(90deg, #7e5678, #e6c3a1);
    height: 100px;
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
</style>