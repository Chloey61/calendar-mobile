<template>
    <div @scroll="scrollList" class="timeEvent" id="timeEvent" :style="{ height: `calc(100vh - ${calendarHight + 34}px)` }">
        <div v-for="(i, key) in events" :class="i.class" :key="key" :id="`${i.year}-${i.month}-${i.day}`">
            <div class="title">
                <span></span>
                <span>{{ `${i.month}月${i.day}日 ${week[i.week]}` }}</span>
            </div>
            <div v-show="i.event.length > 0" v-for="(o, index) in i.event" :key="index" class="content">
                <div>
                    {{ o.time }}
                </div>
                <div class="dot" :class="o.class"></div>
                <div>
                    <p>
                        {{ o.title }}
                    </p>
                    <p v-if="o.meetingRoomName">{{ o.meetingRoomName }}</p>
                </div>
            </div>
            <div v-if="i.event.length === 0" class="emty">暂无日程</div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, watch } from 'vue';
import constData from '../utils/const';

export default defineComponent({
    components: {},
    props: {
        allDataArr: {
            // type: Array,
            default: [],
        },
        calendarHight: {
            default: 0,
        },
        selectData: {
            default: {},
        },
    },
    emits: {
        setCurrentDate: null,
    },
    setup(props, context) {
        const data: any = reactive({
            timeEvents: [
                {
                    date: '2021-5-22',
                    time: '09:00',
                    title: '内部沟通会3',
                    eventType: 1,
                    workTime: 22,
                    meetingRoomName: '5楼B区-华盛顿(电视4-6人)',
                },
                {
                    date: '2021-5-17',
                    time: '11:00',
                    title: '修改',
                    eventType: 2,
                    workTime: 2.5,
                    meetingRoomName: null,
                },
                {
                    date: '2021-5-22',
                    time: '09:00',
                    title: '内部沟通会1',
                    eventType: 3,
                    workTime: 22,
                    meetingRoomName: '5楼B区-华盛顿(电视4-6人)',
                },
                {
                    date: '2021-5-12',
                    time: '11:00',
                    title: '修改',
                    eventType: 2,
                    workTime: 2.5,
                    meetingRoomName: null,
                },
            ],
            events: [],
        });
        const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']; // 获取日历当前年月
        const date: any = new Date();
        const year: any = date.getFullYear();
        const month: any = date.getMonth() + 1;
        const day: any = date.getDate();
        const currentDate = `${year}-${month}-${day}`;
        // 判断 是否ios getTime有兼容性问题
        const isiOS = isNaN(new Date('2020-1-1').getTime());
        let prevNUm: any = 0;
        let num: any = 0;
        let scrolldate: any = '';

        setClassName(data.timeEvents);

        function setClassName(timeEvents: any) {
            timeEvents.forEach((e: any) => {
                e.class =
                    constData.EventType.filter((o: any) => {
                        return o.code == e.eventType;
                    })[0].class + 'Dot';
            });
        }
        function sort2(arr: any[]) {
            const len = arr.length;;
            for(let j = 0; j < len - 1; j++) {
                let ind = j;
                let min = arr[j];
                const atime:any = new Date(isiOS?`${min.year}/${min.month}/${min.day}`:min.date);
                for(let i = j + 1; i < len; i++) {
                    const btime:any = new Date(isiOS?`${arr[i].year}/${arr[i].month}/${arr[i].day}`:arr[i].date);
                    if (atime > btime) {
                        min = arr[i];
                        ind = i;
                    }
                }
                arr[ind] = arr[j];
                arr[j] = min;
            }
            return arr;
        }

        watch(
            () => props.allDataArr,
            async (val: any) => {
                console.log(val)
                let arr:any = [...val[0], ...val[1], ...val[2]];
                let obj:any = {};
                arr = arr.reduce((item: any[], next: { date: string|number; }) => {
                    if (!obj[next.date]) {
                        item.push(next);
                        obj[next.date] = true;
                    }
                    return item;
                }, []);
                arr.sort((a: any, b: any) => {
                    const atime:any = new Date(isiOS?`${a.year}/${a.month}/${a.day}`:a.date);
                    const btime:any = new Date(isiOS?`${b.year}/${b.month}/${b.day}`:b.date);
                    return  atime - btime;
                });
                arr.forEach((e: any) => {
                    data.events.push({
                        ...e,
                        class: e.date == currentDate ? '' : new Date(isiOS ? `${e.year}/${e.month}/${e.day}` : e.date) <= date ? 'pastTime' : '',
                        event: data.timeEvents.filter((i: any) => {
                            return i.date == e.date;
                        }),
                    });
                });


                setTimeout(() => {
                    data.events.forEach((i: any, index: any) => {
                        const dom: any = document.getElementById(i.date);
                        const num = dom.offsetTop - 10;
                        i.top = num;
                    });
                });
            },
        );
        watch(
            () => props.selectData,
            async (val: any) => {
                console.log(val)
                const date = val.date || `${val.year}-${val.month}-${val.day}`;
                num++;
                scrollDate(date, 'watch');
            },
        );

        // 日历点击日期
        function scrollDate(date: string, type: any ) {
            console.log('selectData',date)
            const domDate: any = document.getElementById(date);
            if (!domDate) return;
            const num: any = domDate.offsetTop - 10;
            const dom: any = document.querySelector('#timeEvent');
            dom.scrollTo({
                top: num,
                left: prevNUm,
                behavior: type == 'watch' ? 'instant' : 'smooth',
            });
            prevNUm = num;
        }
        // 滑动列表
        function scrollList(e: any) {
            num++;
            const scrollNum = e.srcElement.scrollTop || e.target.scrollTop;
            const dateObj: any = data.events.filter((i: any, index: any) => {
                return scrollNum >= i.top && scrollNum < data.events[index + 1].top;
            });
            console.log(num)
            if (dateObj.length > 0 && scrolldate != dateObj[0].date && num == 1) {
                console.log(props.selectData)
                scrolldate = dateObj[0].date;
                context.emit('setCurrentDate', dateObj[0],'scrollList');
            }

            num = 0;
        }

        onMounted(() => {
            setTimeout(() => {
                const date = new Date();
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const currentDate = `${year}-${month}-${day}`;
                scrollDate(currentDate, 'watch');
            });
        });

        return {
            ...toRefs(data),
            week,
            scrollList,
        };
    },
});
</script>

<style lang="less" scoped>
.timeEvent {
    // overflow-y: auto;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    position: absolute;
    left: 0;
    top: 30px;
    > div:first-of-type {
        padding-top: 20px;
    }
    .emty {
        font-size: 14px;
        height: 25px;
        line-height: 25px;
        padding: 10px 0 10px 15px;
    }
    .title {
        display: grid;
        width: 100vw;
        grid-template-columns: 15px calc(100vw - 15px);
        height: 20px;
        line-height: 20px;
        > span:first-of-type {
            width: 3px;
            height: 20px;
            background: #2e87fb;
            display: inline-block;
            margin-right: 10px;
            border-radius: 1px;
        }
        > span {
            font-size: 17px;
            font-weight: 500;
        }
    }
    .content {
        display: grid;
        width: 100vw;
        grid-template-columns: 46px 34px calc(100vw - 80px - 41px);
        text-align: center;
        font-size: 16px;
        font-weight: 400;
        padding: 0 10px;
        margin: 15px 0;
        overflow: hidden;
        > div:nth-child(3) {
            text-align: left;
            p {
                margin: 0;
            }
            p:nth-child(2) {
                margin-top: 5px;
            }
        }
        .dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-left: 10px;
            margin-top: 5px;
        }
    }
    .pastTime {
        opacity: 0.5;
    }
}
</style>
