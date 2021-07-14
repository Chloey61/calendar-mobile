export default {
    /**
     * 日历日程任务类型
     */
    EventType: [
        {
            code: 1,
            type: '日程任务',
            class: 'scheduleEvents',
        },
        {
            code: 2,
            type: '会议',
            class: 'meetingEvents',
        },
        {
            code: 3,
            type: '交付任务',
            class: 'projectEvents',
        },
        {
            code: 4,
            type: '售前任务',
            class: 'preSaleEvent',
        },
        {
            code: 5,
            type: '休假',
            class: 'vacationEvents',
        },
        {
            code: 6,
            type: '第三方系统导入',
            // class: 'vacationEvents'
        },
        {
            code: 7,
            type: '销售任务',
            class: 'saleEvents',
        },
        {
            code: 8,
            type: '市场任务',
            class: 'marketEvents',
        },
        {
            code: 9,
            type: '服务任务',
            class: 'serviceEvents',
        },
        {
            code: 66,
            type: '生日祝福',
            class: 'birthdayEvents',
        },
        {
            code: 99,
            type: '入职祝福',
            class: 'anniversaryEvents',
        },
    ],
};
