<template>
    <div class="myCalendar">
        <calendar
            :toDay="iconNum"
            :setCurrentDateStr="currentDateStr"
            :setCurrentDate="currentDate"
            @getAllDataArr="
                (e) => {
                    allDataArr = e;
                }
            "
            @clickDate="clickDate"
            @selectData="
                (val) => {
                    selectData = { ...val };
                }
            "
            @isWeekView="(val) => (isWeekView = val)"
            ref="myCalendar"
        ></calendar>
        <section class="eventListWarp">
            <header>
                <i class="iconfont iconjintian" @click="iconNum++"></i>
                <span>
                    {{ `${selectData.month}月${selectData.day}日 ${weekText || week[selectData.week]}` }}
                </span>
            </header>
            <timeEvent @setCurrentDate="getCurrentDate" :selectData="selectData" :allDataArr="allDataArr" :calendarHight="getCalendarHight"></timeEvent>
        </section>
    </div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent } from 'vue';
import calendar from '../components/calendarTest.vue';
import timeEvent from '../components/timeEvent.vue';

export default defineComponent({
    components: { calendar, timeEvent },
    setup() {
        const data = reactive({
            selectData: {},
            currentDateStr: '',
            currentDate: {},
            getCalendarHight: '0px',
            isWeekView: false,
            weekText: '',
            iconNum: 0,
            allDataArr: [],
        });
        const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

        return {
            week,
            ...toRefs(data),
        };
    },
    watch: {
        isWeekView() {
            setTimeout(() => {
                this.getHeight();
            }, 290);
        },
    },
    mounted() {
        this.getHeight();
    },
    methods: {
        getHeight() {
            const calendar: any = this.$refs.myCalendar;
            this.getCalendarHight = calendar.$el.offsetHeight;
        },
        clickDate(val: any) {
            this.selectData = val;
            this.weekText = this.week[val.week];
        },
        getCurrentDate(e: any, str: any) {
            this.currentDate = {
                ...e,
                scrollList: str,
            };
            this.currentDateStr = e.date;
        },
    },
});
</script>

<style lang="less" scoped>
.myCalendar {
    background: #fff;
    height: 100vh;
    overflow: hidden;
    position: relative;
    .eventListWarp {
        box-shadow: 0 -6px 36px 0 rgba(0, 0, 0, 0.1);
        border-radius: 20px 20px 0 0;
        height: 100%;
        width: 100vw;
        position: relative;
        > header {
            height: 30px;
            font-size: 16px;
            line-height: 31px;
            text-align: center;
            position: relative;
            border-bottom: 1px solid #ebedf0;
            margin: 0 16px;
            > i {
                position: absolute;
                left: 0;
                top: 0;
                color: #ccc;
                font-size: 22px;
            }
            > span:nth-child(2) {
                color: #333;
            }
        }
    }
}
</style>
