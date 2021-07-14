<template>
    <div class="layout">
        <router-view />
    </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { onBeforeMount } from '@vue/runtime-core';
import { defineComponent } from 'vue';

export default defineComponent({
    components: {},
    setup() {
        // 获取vuex对象
        const store = useStore();

        onBeforeMount(() => {
            // 获取用户信息
            store.dispatch('user/USER_INFO');

            // 获取用户设置
            const userGUID = store.state.user.userInfo.UserGUID;
            const paramsUserSettings = {
                userId: userGUID,
            };
            store.dispatch('user/USER_SETTINGS', paramsUserSettings);
        });
    },
});
</script>

<style scoped lang="less">
.layout {
    overflow-x: auto;
}
</style>
