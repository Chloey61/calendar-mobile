<template>
    <!-- <div class="home">
        <img alt="Vue logo" src="../assets/logo.png" />
    </div>
    <div style="overflow-y: hidden">{{ loginUser }}</div>
    <van-button type="primary" size="large">大号按钮</van-button>
    <van-button type="primary" size="normal">普通按钮</van-button>
    <van-button type="primary" size="small">小型按钮</van-button>
    <van-button type="primary" size="mini">迷你按钮</van-button>
    <van-field v-model="value" label="文本" placeholder="请输入用户名" />
    <van-calendar title="日历" :poppable="false" :show-confirm="false" :style="{ height: '500px' }" /> -->
    <div>
        <van-calendar :poppable="false" :show-confirm="false" :formatter="formatter" />
    </div>
</template>

<script lang="ts">
import { ref } from 'vue';

export default {
    components: {},
    setup() {
        const loginUser = localStorage.loginUser;
        const value = ref('');

        const formatter = (day:any) => {
            const month = day.date.getMonth() + 1;
            const date = day.date.getDate();

            day.bottomInfo = '61';
            day.className = 'testClass';

            if (month === 5) {
                if (date === 1) {
                    day.topInfo = '劳动节';
                } else if (date === 4) {
                    day.topInfo = '青年节';
                } else if (date === 11) {
                    day.text = '今天';
                }
            }

            return day;
        };

        return {
            loginUser,
            value,
            formatter,
        };
    },
};
</script>

<style lang="less">
.testClass ::after{
        display: inline-block;
        border-radius: 50%;
        width: 3px;
        height: 3px;
        background-color: #000;
}
</style>
