interface Calendar {
    gregorianYear: number; //公历年
    gregorianMonth: string; //公历月
    gregorianDay: string; //公历日
    weekday: string; //星期
    hours: string;
    minutes: string;
    seconds: string;

    lunarYear: number; //农历年
    lunarMonth: number; //农历月
    lunarDay: number; //农历日

    lunarYearCn: string; //农历天干地支纪年
    lunarMonthCn: string; //农历中文月
    lunarDayCn: string; //农历中文日
    zodiacYear: string; //农历生肖年

    solarTerm: string; //节气
    gregorianFestival: string; //公历节日
    lunarFestival: string; //农历节日
}

const lunarInfo = [
    0x04bd8,
    0x04ae0,
    0x0a570,
    0x054d5,
    0x0d260,
    0x0d950,
    0x16554,
    0x056a0,
    0x09ad0,
    0x055d2,
    0x04ae0,
    0x0a5b6,
    0x0a4d0,
    0x0d250,
    0x1d255,
    0x0b540,
    0x0d6a0,
    0x0ada2,
    0x095b0,
    0x14977,
    0x04970,
    0x0a4b0,
    0x0b4b5,
    0x06a50,
    0x06d40,
    0x1ab54,
    0x02b60,
    0x09570,
    0x052f2,
    0x04970,
    0x06566,
    0x0d4a0,
    0x0ea50,
    0x06e95,
    0x05ad0,
    0x02b60,
    0x186e3,
    0x092e0,
    0x1c8d7,
    0x0c950,
    0x0d4a0,
    0x1d8a6,
    0x0b550,
    0x056a0,
    0x1a5b4,
    0x025d0,
    0x092d0,
    0x0d2b2,
    0x0a950,
    0x0b557,
    0x06ca0,
    0x0b550,
    0x15355,
    0x04da0,
    0x0a5d0,
    0x14573,
    0x052d0,
    0x0a9a8,
    0x0e950,
    0x06aa0,
    0x0aea6,
    0x0ab50,
    0x04b60,
    0x0aae4,
    0x0a570,
    0x05260,
    0x0f263,
    0x0d950,
    0x05b57,
    0x056a0,
    0x096d0,
    0x04dd5,
    0x04ad0,
    0x0a4d0,
    0x0d4d4,
    0x0d250,
    0x0d558,
    0x0b540,
    0x0b5a0,
    0x195a6,
    0x095b0,
    0x049b0,
    0x0a974,
    0x0a4b0,
    0x0b27a,
    0x06a50,
    0x06d40,
    0x0af46,
    0x0ab60,
    0x09570,
    0x04af5,
    0x04970,
    0x064b0,
    0x074a3,
    0x0ea50,
    0x06b58,
    0x055c0,
    0x0ab60,
    0x096d5,
    0x092e0,
    0x0c960,
    0x0d954,
    0x0d4a0,
    0x0da50,
    0x07552,
    0x056a0,
    0x0abb7,
    0x025d0,
    0x092d0,
    0x0cab5,
    0x0a950,
    0x0b4a0,
    0x0baa4,
    0x0ad50,
    0x055d9,
    0x04ba0,
    0x0a5b0,
    0x15176,
    0x052b0,
    0x0a930,
    0x07954,
    0x06aa0,
    0x0ad50,
    0x05b52,
    0x04b60,
    0x0a6e6,
    0x0a4e0,
    0x0d260,
    0x0ea65,
    0x0d530,
    0x05aa0,
    0x076a3,
    0x096d0,
    0x04bd7,
    0x04ad0,
    0x0a4d0,
    0x1d0b6,
    0x0d250,
    0x0d520,
    0x0dd45,
    0x0b5a0,
    0x056d0,
    0x055b2,
    0x049b0,
    0x0a577,
    0x0a4b0,
    0x0aa50,
    0x1b255,
    0x06d20,
    0x0ada0,
];

const zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
const Gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const Zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const weekday = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
//公历节日
const sFtv = new Array(
    "0101 元旦",
    "0214 情人节",
    "0308 妇女节",
    "0312 植树节",
    "0315 消费者权益日",
    "0401 愚人节",
    "0501 劳动节",
    "0504 青年节",
    "0512 护士节",
    "0601 儿童节",
    "0701 建党节",
    "0801 建军节",
    "0910 教师节",
    "0928 孔子诞辰",
    "1001 国庆节",
    "1006 老人节",
    "1024 联合国日",
    "1224 平安夜",
    "1225 圣诞节"
)
//农历节日
const lFtv = new Array(
    "0101 春节",
    "0115 元宵节",
    "0505 端午节",
    "0707 七夕情人节",
    "0715 中元节",
    "0815 中秋节",
    "0909 重阳节",
    "1208 腊八节"
)
//==== 传入 offset 传回干支, 0=甲子
function cyclical(num: number) {
    return Gan[num % 10] + Zhi[num % 12];
}

//==== 传回农历 year年的总天数
function lYearDays(year: number) {
    let i,
        sum = 348;
    for (i = 0x8000; i > 0x8; i >>= 1) {
        sum += lunarInfo[year - 1900] & i ? 1 : 0;
    }
    return sum + leapDays(year);
}

//==== 传回农历 year年闰月的天数
function leapDays(year: number) {
    if (leapMonth(year)) {
        return lunarInfo[year - 1900] & 0x10000 ? 30 : 29;
    } else {
        return 0;
    }
}

//==== 传回农历 year年闰哪个月 1-12 , 没闰传回 0
function leapMonth(year: number) {
    return lunarInfo[year - 1900] & 0xf;
}

//==== 传回农历 year年month月的总天数
function monthDays(year: number, month: number) {
    return lunarInfo[year - 1900] & (0x10000 >> month) ? 30 : 29;
}

//==== 算出农历, 传入日期对象, 传回农历日期对象
//     该对象属性有 农历年year 农历月month 农历日day 是否闰年isLeap yearCyl dayCyl monCyl
function Lunar(GY:any,GM:any,GD:any,str:any) {
    let objDate = new Date(GY, GM, GD);
    let i,
        temp = 0;
    let baseDate = new Date(1900, 0, 31);
    let offset = Math.floor((objDate.getTime() - baseDate.getTime()) / 86400000);
    if (!offset) {
        // .replace(/-/g, '/');
        objDate = new Date(str.replace(/-/g, '/'));
        baseDate = new Date('1900/0/31');
        offset = Math.floor((objDate.getTime() - baseDate.getTime()) / 86400000);
    }
    const dayCyl = offset + 40;
    let monCyl = 14;

    for (i = 1900; i < 2050 && offset > 0; i++) {
        temp = lYearDays(i);
        offset -= temp;
        monCyl += 12;
    }
    if (offset < 0) {
        offset += temp;
        i--;
        monCyl -= 12;
    }
    //农历年
    const year = i;
    const yearCyl = i - 1864;

    const leap = leapMonth(i); //闰哪个月
    let isLeap = false; //是否闰年

    for (i = 1; i < 13 && offset > 0; i++) {
        //闰月
        if (leap > 0 && i === leap + 1 && isLeap === false) {
            --i;
            isLeap = true;
            temp = leapDays(year);
        } else {
            temp = monthDays(year, i);
        }

        //解除闰月
        if (isLeap === true && i === leap + 1) {
            isLeap = false;
        }

        offset -= temp;
        if (isLeap === false) {
            monCyl++;
        }
    }

    if (offset === 0 && leap > 0 && i === leap + 1)
        if (isLeap) {
            isLeap = false;
        } else {
            isLeap = true;
            --i;
            --monCyl;
        }

    if (offset < 0) {
        offset += temp;
        --i;
        --monCyl;
    }
    //农历月
    const month = i;
    //农历日
    const day = offset + 1;

    return {
        year: year,
        month: month,
        day: day,
        isLeap: isLeap,
        leap: leap,
        yearCyl: yearCyl,
        dayCyl: dayCyl,
        monCyl: monCyl,
    };
}

//==== 中文日期 m为传入月份，d为传入日期
function cDay(m: number, d: number) {
    const nStr1 = ['日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    const nStr2 = ['初', '十', '廿', '卅', ''];
    //农历中文月
    let lunarMonthCn;
    //农历中文日
    let lunarDayCn;
    if (m > 10) {
        lunarMonthCn = '十' + nStr1[m - 10];
    } else {
        lunarMonthCn = nStr1[m];
    }
    lunarMonthCn += '月';

    switch (d) {
        case 10:
            lunarDayCn = '初十';
            break;
        case 20:
            lunarDayCn = '二十';
            break;
        case 30:
            lunarDayCn = '三十';
            break;
        default:
            lunarDayCn = nStr2[Math.floor(d / 10)] + nStr1[d % 10];
    }
    return {
        lunarMonthCn: lunarMonthCn,
        lunarDayCn: lunarDayCn,
    };
}

//节气
function getSolarTerm(GY:any,GM:any,GD:any) {
    const sTermInfo = [0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758];
    const solarTerm = ['小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满', '芒种', '夏至', '小暑', '大暑', '立秋', '处暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'];

    let solarTerms = '';
    let tmp1 = new Date(31556925974.7 * (GY - 1900) + sTermInfo[GM * 2 + 1] * 60000 + Date.UTC(1900, 0, 6, 2, 5));
    let tmp2 = tmp1.getUTCDate();
    if (tmp2 === GD) solarTerms = solarTerm[GM * 2 + 1];
    tmp1 = new Date(31556925974.7 * (GY - 1900) + sTermInfo[GM * 2] * 60000 + Date.UTC(1900, 0, 6, 2, 5));
    tmp2 = tmp1.getUTCDate();
    if (tmp2 === GD) solarTerms = solarTerm[GM * 2];

    return solarTerms;
}

function lunar (str:any) {
    const now = new Date(str);

    //用于计算农历年月日的数据
    const GY = now.getFullYear();
    const GM = now.getMonth();
    const GD = now.getDate();

    const year = now.getFullYear();
    const _month = now.getMonth() + 1;
    const _date = now.getDate();
    const _hours = now.getHours();
    const _minutes = now.getMinutes();
    const _seconds = now.getSeconds();
    const month = _month.toString().padStart(2, '0');
    const date = _date.toString().padStart(2, '0');
    const hours = _hours.toString().padStart(2, '0');
    const minutes = _minutes.toString().padStart(2, '0');
    const seconds = _seconds.toString().padStart(2, '0');
    const calendar: any = {};

    //公历年月日、星期、时分秒
    calendar.gregorianYear = year;
    calendar.gregorianMonth = month;
    calendar.gregorianDay = date;
    calendar.weekday = weekday[now.getDay()];
    calendar.hours = hours;
    calendar.minutes = minutes;
    calendar.seconds = seconds;

    //去掉时分秒的日期
    const lDObj = Lunar(GY, GM, GD,str);

    //农历年月日、生肖年
    calendar.lunarYear = lDObj.year;
    calendar.lunarMonth = lDObj.month;
    calendar.lunarDay = lDObj.day;
    calendar.zodiacYear = zodiacs[(GY - 4) % 12];

    //农历中文年月日
    calendar.lunarYearCn = cyclical(GY - 1900 + 36);
    calendar.lunarMonthCn = cDay(lDObj.month, lDObj.day).lunarMonthCn;
    calendar.lunarDayCn = cDay(lDObj.month, lDObj.day).lunarDayCn;

    //节气
    calendar.solarTerm = getSolarTerm(GY,GM,GD);

    return calendar;
}

export default lunar;