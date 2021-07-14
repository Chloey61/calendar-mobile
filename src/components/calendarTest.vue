<template>
    <div class="calendar">
        <section class="header">
            <span>{{ selectData.year }}年{{ selectData.month }}月</span>
        </section>
        <ul class="week-area">
            <li class="week-item" v-for="(item, index) in weekArr" :key="index">
                <span class="week-font calendar-item">{{ item }}</span>
            </li>
        </ul>
        <section
            ref="calendar"
            class="data-container"
            :style="{
                transition: '.3s',
                height: isWeekView ? `${itemHeight + touchAreaHeight}px` : `${lineNum * itemHeight + touchAreaHeight}px`,
                transitionDuration: `${needHeightAnimation ? transitionDuration : 0}s`,
            }"
            @touchstart="touchStart"
            @touchmove.stop.prevent="touchMove"
            @touchend="touchEnd"
        >
            <section
                class="month-area"
                :style="{
                    transition: '.3s',
                    transform: `translateX(${-(translateIndex + 1) * 100}%)`,
                    transitionDuration: `${needAnimation ? transitionDuration : 0}s`,
                }"
            >
                <div
                    class="banner-area"
                    :style="{
                        transition: '.3s',
                        transform: `translateY(${offsetY}px)`,
                        transitionDuration: `${needHeightAnimation ? transitionDuration : 0}s`,
                    }"
                >
                    <ul
                        v-for="(monthItem, monthIndex) in allDataArr"
                        :key="monthIndex"
                        class="data-area"
                        :style="{
                            transform: `translateX(${(translateIndex + isTouching ? touch.x : 0) * 100}%)`,
                            transitionDuration: `${isTouching ? 0 : transitionDuration}s`,
                        }"
                    >
                        <li v-for="(date, index) in monthItem" :key="index" :class="['data-item', { weekDate: date.week == 0 || date.week == 6 }, { dateNow: dateNow.date == date.date }, { selected: date.isSelected }, { 'other-item': date.type !== 'normal' && !isWeekView }]" :style="`height: ${itemHeight}px`" @click="checkoutDate(date)">
                            <div class="data-font calendar-item">
                                <div>
                                    <div>
                                        <p class="date">
                                            {{ date.day }}
                                            <span v-if="date.other.length > 0" :style="{ color: date.other[0].dateType == 1 ? '#FF8214' : '#1EC832' }">{{ date.other[0].dateType == 1 ? '班' : '休' }}</span>
                                        </p>
                                        <p>{{ (date.lunar.solarTerm || date.lunar.lunarDayCn) == '初一' ? date.lunar.lunarMonthCn : date.lunar.solarTerm || date.lunar.lunarDayCn }}</p>
                                    </div>
                                    <span v-if="date.event && date.event.length > 0" class="dot"></span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>
            <section class="touch-area" :style="`height: ${touchAreaHeight}px; padding-top: ${touchAreaPadding}px;`">
                <div class="touch-container" :style="`height: ${touchAreaHeight - touchAreaPadding}px`">
                    <!-- <div class="touch-item"></div> -->
                    <i class="iconfont iconzhankaishouqi" :class="isWeekView ? 'transformFont' : ''" @click="changeIcon"></i>
                </div>
            </section>
        </section>
    </div>
</template>

<script>
import { defineComponent, reactive, toRefs, watch } from 'vue';
import calendarLunar from '../utils/lunar';

export default defineComponent({
    name: 'calender',
    props: {
        toDay: {
            default: 0,
            type: Number,
        },
        setCurrentDate: {
            default: {},
        },
        setCurrentDateStr: {
            default: '',
        },
    },
    setup() {
        const data = reactive({
            weekArr: ['日', '一', '二', '三', '四', '五', '六'], // 星期数组
            eventArr: ['2021-5-12', '2021-5-17', '2021-5-22'], // 事件日程
            datesArr: [
                {
                    date: '2021-4-25',
                    dateType: 1,
                },
                {
                    date: '2021-5-1',
                    dateType: 2,
                },
                {
                    date: '2021-5-2',
                    dateType: 2,
                },
                {
                    date: '2021-5-3',
                    dateType: 2,
                },
                {
                    date: '2021-5-4',
                    dateType: 2,
                },
                {
                    date: '2021-5-5',
                    dateType: 2,
                },
                {
                    date: '2021-5-8',
                    dateType: 1,
                },
            ], // 班、休
            dateNow: [], // 今天
            dataArr: [], // 当前可视区域数据
            allDataArr: [], // 轮播数组
            selectData: {}, // 选中日期信息 -> year, month, day
            selectDataStr: {}, // 选中日期信息 -> year-month-day
            isiOS: '',
            isSelectedCurrentDate: false, // 是否点选当前月份信息 (配合月视图减少点击切换时的数组更新)
            translateIndex: 0, // 轮播所在位置
            transitionDuration: 0.3, // 动画持续时间
            needAnimation: true, // 左右滑动是否需要动画
            isTouching: false, // 是否为touch状态
            touchStartPositionX: null, // 初始滑动 X的值
            touchStartPositionY: null, // 初始滑动 Y的值
            touch: {
                // 本次touch事件，横向，纵向滑动的距离
                x: 0,
                y: 0,
            },
            isWeekView: false, // 周视图还是月视图
            itemHeight: 62, // 子元素行高
            needHeightAnimation: false, // 高度变化是否需要动画
            offsetY: 0, // 周视图 Y轴偏移量
            lineNum: 0, // 当前视图总行数
            lastWeek: [], // 周视图 前一周数据
            nextWeek: [], // 周视图 后一周数据
            isDelay: true, // 是否延迟 (动画结束在处理数据)
            touchAreaHeight: 20, // 底部区域高度
            touchAreaPadding: 0, // 底部区域padding
            isClicked: false, // 点选元素 (去除周视图切换月份时的动画延迟)
            markDateColorObj: {}, // 所有被标记的日期所对应的颜色
            markDateTypeObj: {}, // 所有被标记的日期所对应的标记类型
            prevNUm: 0, // 滑动距离
        });

        return {
            ...toRefs(data),
        };
    },
    created() {
        this.checkoutCurrentDate();
    },
    watch: {
        dataArr: {
            handler(val) {
                this.changeAllData(val);
            },
            deep: true,
        },
        isWeekView(val) {
            if (!val) {
                this.isSelectedCurrentDate = false;
                this.changeAllData(this.dataArr);
            }
            this.$emit('isWeekView', val);
        },
        selectDataStr(val) {
            console.log('selectDataStr', val);
            this.$emit('selectData', this.selectData);
            // this.$emit('clickDate', this.selectData);
        },
        toDay() {
            this.checkoutCurrentDate();
        },
        setCurrentDateStr() {
            if (this.setCurrentDate.date) {
                this.checkoutDate(this.setCurrentDate, 'watch');
            }
        },
    },
    methods: {
        // 更新轮播数组
        changeAllData(val) {
            if (this.isSelectedCurrentDate && !this.isWeekView) return;

            const preDate = this.getPreMonth();
            const preDataArr = this.getMonthData(preDate, true);
            const nextDate = this.getNextMonth();
            const nextDataArr = this.getMonthData(nextDate, true);

            if (this.isWeekView) {
                const sliceStart = this.dealWeekViewSliceStart();
                preDataArr.splice(sliceStart, 7, ...this.lastWeek);
                nextDataArr.splice(sliceStart, 7, ...this.nextWeek);
            }

            const delayHandle = (isDelay) => {
                this.allDataArr = [preDataArr, val, nextDataArr];
                this.needAnimation = false;
                this.translateIndex = 0;
                if (isDelay) this.isDelay = false;
                this.$emit('getAllDataArr', this.allDataArr);
            };

            if (this.isDelay) {
                delayHandle(this.isDelay);
                return;
            }

            setTimeout(
                () => {
                    delayHandle();
                },
                this.isClicked && this.isWeekView ? 0 : this.transitionDuration * 1000,
            );
        },
        // 小于10，在前面补0
        fillNumber(val) {
            return val > 9 ? val : '0' + val;
        },
        // 当前日期是否需要标记
        markDateColor(date, type) {
            let dateString = `${date.year}/${this.fillNumber(date.month + 1)}/${this.fillNumber(date.day)}`;
            let markDateTypeString = this.markDateTypeObj[dateString] || '';

            if (markDateTypeString.indexOf(type) === -1) return;

            return this.markDateColorObj[dateString];
        },
        // 获取当前日期
        getCurrentDate(str) {
            // 判断 是否ios getTime有兼容性问题
            this.isiOS = isNaN(new Date('2020-1-1').getTime());
            const date = str ? new Date(str) : new Date();
            this.selectData = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate(),
                week: date.getDay(),
            };
            this.selectDataStr = `${this.selectData.year}-${this.selectData.month}-${this.selectData.day}`;

            this.dateNow = {
                ...this.selectData,
            };
        },
        // 获取指定月份数据
        getMonthData(date, unSelected = false) {
            const { year, month, day } = date;
            let dataArr = [];
            let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
                daysInMonth[1] = 29;
            }

            const monthStartWeekDay = new Date(year, month - 1, 1).getDay();
            const monthEndWeekDay = new Date(year, month, 1).getDay() || 7;

            const preInfo = this.getPreMonth(date);
            const nextInfo = this.getNextMonth();
            for (let i = 0; i < monthStartWeekDay; i++) {
                const day = daysInMonth[preInfo.month - 1] - (monthStartWeekDay - i - 1);
                const date = `${preInfo.year}-${preInfo.month}-${day}`;
                const dateIos = `${preInfo.year}/${preInfo.month}/${day}`;
                let preObj = {
                    type: 'pre',
                    day: day,
                    month: preInfo.month,
                    year: preInfo.year,
                    date: date,
                    week: new Date(this.isiOS ? dateIos : date).getDay(),
                    event: this.eventArr.filter((e) => {
                        return date == e;
                    }),
                    lunar: calendarLunar(this.isiOS ? dateIos : date),
                    other: this.datesArr.filter((e) => {
                        return date == e.date;
                    }),
                };

                dataArr.push(preObj);
            }
            for (let i = 0; i < daysInMonth[month - 1]; i++) {
                const date = `${year}-${month}-${i + 1}`;
                const dateIos = `${year}/${month}/${i + 1}`;
                let itemObj = {
                    type: 'normal',
                    day: i + 1,
                    month,
                    year,
                    isSelected: day === i + 1 && !unSelected,
                    date,
                    week: new Date(this.isiOS ? dateIos : date).getDay(),
                    event: this.eventArr.filter((e) => {
                        return date == e;
                    }),
                    lunar: calendarLunar(this.isiOS ? dateIos : date),
                    other: this.datesArr.filter((e) => {
                        return date == e.date;
                    }),
                };
                dataArr.push(itemObj);
            }

            for (let i = 0; i < 7 - monthEndWeekDay; i++) {
                const date = `${nextInfo.year}-${nextInfo.month}-${i + 1}`;
                const dateIos = `${nextInfo.year}/${nextInfo.month}/${i + 1}`;
                let nextObj = {
                    type: 'next',
                    day: i + 1,
                    month: nextInfo.month,
                    year: nextInfo.year,
                    date: date,
                    week: new Date(this.isiOS ? dateIos : date).getDay(),
                    event: this.eventArr.filter((e) => {
                        return date == e;
                    }),
                    lunar: calendarLunar(this.isiOS ? dateIos : date),
                    other: this.datesArr.filter((e) => {
                        return date == e.date;
                    }),
                };
                dataArr.push(nextObj);
            }
            return dataArr;
        },
        // 点选切换日期
        checkoutDate(selectData) {
            this.isSelectedCurrentDate = true;
            this.isClicked = true;

            if (this.isWeekView && selectData.type !== 'normal') {
                this.needAnimation = false;
                this.needHeightAnimation = false;
            }

            if (selectData.type === 'next') {
                this.translateIndex += 1;
                this.dealMonthData('NEXT_MONTH', selectData.day);
                return;
            }

            if (selectData.type === 'pre') {
                this.translateIndex -= 1;
                this.dealMonthData('PRE_MONTH', selectData.day);
                return;
            }

            this.selectData.day = selectData.day;
            const oldSelectIndex = this.dataArr.findIndex((item) => item.isSelected && item.type === 'normal');
            const newSelectIndex = this.dataArr.findIndex((item) => item.day === selectData.day && item.type === 'normal');

            if (this.dataArr[oldSelectIndex]) this.dataArr[oldSelectIndex].isSelected = false;
            if (this.dataArr[newSelectIndex]) this.dataArr[newSelectIndex].isSelected = true;

            this.selectDataStr = `${this.selectData.year}-${this.selectData.month}-${this.selectData.day}`;
        },
        // 获取前(后)一个月的年月日信息
        getPreMonth(date, appointDay = 1) {
            let { year, month } = date || this.selectData;
            if (month === 1) {
                year -= 1;
                month = 12;
            } else {
                month -= 1;
            }
            const i = this.isiOS ? '/' : '-';
            const week = new Date(`${year + i + month + i + appointDay}`).getDay();

            return { year, month, day: appointDay, week };
        },
        getNextMonth(appointDay = 1) {
            let { year, month } = this.selectData;
            if (month === 12) {
                year += 1;
                month = 1;
            } else {
                month += 1;
            }
            const i = this.isiOS ? '/' : '-';
            const week = new Date(`${year + i + month + i + appointDay}`).getDay();

            return { year, month, day: appointDay, week };
        },
        // 切换上(下)一月
        handlePreMonth() {
            this.dealMonthData('PRE_MONTH');
        },
        handleNextMonth() {
            this.dealMonthData('NEXT_MONTH');
        },
        // 处理月数据
        dealMonthData(type, appointDay = 1) {
            this.isSelectedCurrentDate = false;

            switch (type) {
                case 'PRE_MONTH':
                    this.selectData = this.getPreMonth('', appointDay);
                    this.selectDataStr = `${this.selectData.year}-${this.selectData.month}-${this.selectData.day}`;
                    break;
                case 'NEXT_MONTH':
                    this.selectData = this.getNextMonth(appointDay);
                    this.selectDataStr = `${this.selectData.year}-${this.selectData.month}-${this.selectData.day}`;
                    break;
                default:
                    break;
            }

            this.dataArr = this.getMonthData(this.selectData);
            this.lineNum = Math.ceil(this.dataArr.length / 7);
        },
        // 今日
        checkoutCurrentDate() {
            this.isDelay = true;
            this.getCurrentDate();
            this.dealMonthData();
        },
        // touch事件
        touchStart(event) {
            this.isTouching = true;
            this.needAnimation = true;
            this.isClicked = false;

            this.touchStartPositionX = event.touches[0].clientX;
            this.touchStartPositionY = event.touches[0].clientY;
            this.touch = {
                x: 0,
            };
        },
        touchMove(event) {
            const moveX = event.touches[0].clientX - this.touchStartPositionX;
            const moveY = event.touches[0].clientY - this.touchStartPositionY;

            if (Math.abs(moveX) > Math.abs(moveY)) {
                // 左右
                this.needHeightAnimation = false;
                this.touch = {
                    x: moveX / this.$refs.calendar.offsetWidth,
                    y: 0,
                };
            } else {
                // 上下
                this.needHeightAnimation = true;
                this.touch = {
                    x: 0,
                    y: moveY / this.$refs.calendar.offsetHeight,
                };
            }
        },
        touchEnd() {
            this.isTouching = false;
            const { x, y } = this.touch;

            // 月视图
            if (Math.abs(x) > Math.abs(y) && Math.abs(x) > 0.3) {
                if (x > 0) {
                    // 左
                    this.translateIndex -= 1;
                    this.isWeekView ? this.handlePreWeek() : this.handlePreMonth();
                } else if (x < 0) {
                    // 右
                    this.translateIndex += 1;
                    this.isWeekView ? this.handleNextWeek() : this.handleNextMonth();
                }
            }

            // 周视图
            if (Math.abs(y) > Math.abs(x) && Math.abs(y * this.$refs.calendar.offsetHeight) > 50) {
                if (y > 0) {
                    // 下
                    this.isWeekView = false;
                    this.offsetY = 0;
                } else if (y < 0) {
                    // 上
                    this.isWeekView = true;
                    this.dealWeekViewData();
                }
            }

            this.touch = {
                x: 0,
                y: 0,
            };
        },
        // icon展开收起
        changeIcon() {
            if (this.isWeekView) {
                // 下
                this.isWeekView = false;
                this.offsetY = 0;
            } else {
                // 上
                this.isWeekView = true;
                this.dealWeekViewData();
            }
        },
        // 周视图的位置信息
        getInfoOfWeekView(selectedIndex, length) {
            const indexOfLine = Math.ceil((selectedIndex + 1) / 7);
            const totalLine = Math.ceil(length / 7);
            const sliceStart = (indexOfLine - 1) * 7;
            const sliceEnd = sliceStart + 7;

            return { indexOfLine, totalLine, sliceStart, sliceEnd };
        },
        // 生成前(后)一周数据
        dealWeekViewSliceStart() {
            const selectedIndex = this.dataArr.findIndex((item) => item.isSelected);
            const { indexOfLine, totalLine, sliceStart, sliceEnd } = this.getInfoOfWeekView(selectedIndex, this.dataArr.length);

            this.offsetY = -((indexOfLine - 1) * this.itemHeight);

            // 前一周数据
            if (indexOfLine === 1) {
                const preInfo = this.getPreMonth();
                const preDataArr = this.getMonthData(preInfo, true);
                const preDay = this.dataArr[0].day - 1 || preDataArr[preDataArr.length - 1].day;
                const preIndex = preDataArr.findIndex((item) => item.day === preDay && item.type === 'normal');
                const { sliceStart: preSliceStart, sliceEnd: preSliceEnd } = this.getInfoOfWeekView(preIndex, preDataArr.length);
                this.lastWeek = preDataArr.slice(preSliceStart, preSliceEnd);
            } else {
                this.lastWeek = this.dataArr.slice(sliceStart - 7, sliceEnd - 7);
            }

            // 后一周数据
            if (indexOfLine >= totalLine) {
                const nextInfo = this.getNextMonth();
                const nextDataArr = this.getMonthData(nextInfo, true);
                const nextDay = this.dataArr[this.dataArr.length - 1].type === 'normal' ? 1 : this.dataArr[this.dataArr.length - 1].day + 1;
                const nextIndex = nextDataArr.findIndex((item) => item.day === nextDay);
                const { sliceStart: nextSliceStart, sliceEnd: nextSliceEnd } = this.getInfoOfWeekView(nextIndex, nextDataArr.length);
                this.nextWeek = nextDataArr.slice(nextSliceStart, nextSliceEnd);
            } else {
                this.nextWeek = this.dataArr.slice(sliceStart + 7, sliceEnd + 7);
            }

            return sliceStart;
        },
        // 切换上(下)一周
        handlePreWeek() {
            this.dealWeekData('PRE_WEEK');
        },
        handleNextWeek() {
            this.dealWeekData('NEXT_WEEK');
        },
        // 处理周数据
        dealWeekData(type) {
            const { year, month, day, week } = type === 'PRE_WEEK' ? this.lastWeek.find((item) => item.type === 'normal') : this.nextWeek[0];
            this.selectData = { year, month, day, week };
            this.selectDataStr = `${year}-${month}-${day}`;
            this.dataArr = this.getMonthData(this.selectData);
            this.lineNum = Math.ceil(this.dataArr.length / 7);
            this.offsetY -= this.itemHeight;
            this.dealWeekViewData();
        },
        // 处理上(下)一周数据
        dealWeekViewData() {
            const sliceStart = this.dealWeekViewSliceStart();
            this.allDataArr[0].splice(sliceStart, 7, ...this.lastWeek);
            this.allDataArr[2].splice(sliceStart, 7, ...this.nextWeek);
        },
        // 该日期是否为今天
        isToday(date) {
            return this.yearOfToday === date.year && this.monthOfToday === date.month && this.dayOfToday === date.day;
        },
        // 该日期是否为选中的日期
        isCheckedDay(date) {
            return this.checkedDate.year === date.year && this.checkedDate.month === date.month && this.checkedDate.day === date.day;
        },
    },
});
</script>

<style lang="less" scoped>
.calendar {
    overflow-x: hidden;
    background: #fff;
    margin: 0 16px 12px 16px;
}
.header {
    padding: 0 5px;
    font-size: 20px;
    // font-weight: 500;
    color: #2b4450;
    line-height: 44px;
    margin: 0;
    border-bottom: 1px solid #ebedf0;
}
.week-font.calendar-item {
    height: 30px;
    line-height: 40px;
}
.calendar-item {
    display: block;
    width: 40px;
    height: 50px;
    text-align: center;
    .dot {
        background: rgba(46, 135, 251, 0.5);
    }
    > span {
        > span:nth-child(2) {
            font-size: 10px;
            color: #999;
        }
    }
}
.selected .calendar-item {
    > div {
        > div {
            background: #2e87fb !important;
            border-radius: 50%;
            color: #fff !important;
            > p {
                color: #fff !important;
            }
        }
    }
}
.dateNow .calendar-item {
    color: #333;
    > div {
        > div {
            background: #eaf3fe;
            border-radius: 50%;
        }
    }
    .dot {
        background: rgba(46, 135, 251, 0.5);
    }
}
.week-area {
    width: 100%;
    display: flex;
}
.week-item {
    height: 30px;
    flex: 0 0 14.285%;
    display: flex;
    align-items: center;
    justify-content: center;
    align-content: center;
}
.week-font {
    font-size: 14px;
    color: #999;
}
.data-container {
    overflow: hidden;
    position: relative;
}
.banner-area {
    width: 300%;
    display: flex;
}
.data-area {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: row wrap;
}
.data-item {
    flex: 0 0 14.285%;
    display: flex;
    align-items: center;
    justify-content: center;
    // align-content: center;
}
.data-font {
    color: #333;
    font-size: 14px;
    font-weight: 400;
    margin: 0 !important;
    position: relative;
    // letter-spacing: -1px;
    // line-height: 44px;
    > div {
        position: relative;
        display: grid;
        grid-template-rows: 45px 11px;
        justify-items: center;
        align-items: end;
        > div {
            text-align: center;
            width: 38px;
            display: grid;
            grid-template-rows: 24px 14px;
            // justify-items: center;
            align-items: end;
            > p {
                margin: 0;
                display: grid;
            }
            > p:nth-child(1) {
                justify-items: center;
                font-weight: 500;
                font-size: 16px;
                position: relative;
                > span {
                    position: absolute;
                    top: -9px;
                    right: -6px;
                    font-size: 9px;
                    font-weight: 400 !important;
                }
            }
            > p:nth-child(2) {
                color: #ccc;
                font-size: 9px;
                line-height: 20px;
            }
        }
    }
}
.other-item .data-font {
    color: #999;
    p:nth-child(1) {
        font-weight: 400;
    }
}
.touch-area {
    width: 100%;
    box-sizing: border-box;
    background-color: #fff;
    position: absolute;
    left: 0;
    bottom: 0;
}
.touch-container {
    width: 100%;
    box-sizing: border-box;
    // border-top: 0.5px solid #eee;
    display: flex;
    align-items: center;
    justify-content: center;
}
.iconzhankaishouqi {
    font-size: 28px;
    color: #979797;
}
.dot {
    width: 4px;
    height: 4px;
    border-radius: 51%;
    display: inline-block;
    position: absolute;
    bottom: 3px;
    background: #fff;
    left: 50%;
    margin-left: -2px;
}
.weekDate {
    div {
        color: #999;
        p:nth-child(1) {
            font-weight: 400 !important;
        }
    }
}
.transformFont {
    transform: rotate(180deg);
    -ms-transform: rotate(180deg); /* IE 9 */
    -moz-transform: rotate(180deg); /* Firefox */
    -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
    -o-transform: rotate(180deg);
}
</style>
