<template>
    <div class="followed">
        <div class="item">
            <div class="title">
                关注审核<span v-if="followState !== '待审核'">（{{ followState }}）</span>
            </div>
            <van-divider class="divider" />
            <div class="content">
                <div class="info">
                    <van-image class="image" round fit="cover" :src="userInfo.UserIcon" />
                    <div class="name">{{ userInfo.UserName }}</div>
                </div>
                <div class="text">希望在日历中关注您，是否同意？</div>
            </div>
        </div>
        <van-sticky :offset-bottom="0" position="bottom">
            <div class="foot" v-if="followState === '待审核'">
                <van-button class="btn jj" type="default" round size="large" @click="click(0)">拒 绝</van-button>
                <van-button class="btn" type="primary" round size="large" @click="click(1)">同 意</van-button>
            </div>
        </van-sticky>
    </div>
</template>

<script lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

export default {
    setup() {
        const store = useStore();
        const follow = store.state.follow;
        const loginUser = JSON.parse(localStorage.loginUser);
        const UserGUID = loginUser.UserGUID;
        const router = useRoute();
        const AnotherUserGUID = router.params.UserGUID;

        onMounted(() => {
            store.dispatch('follow/GET_FOLLOWED_USER_INFO', { UserGUID, AnotherUserGUID });
        });

        const loading = computed(() => follow.loadingUserInfo);
        const userInfo = computed(() => follow.followUserInfo);
        const followState = computed(() => follow.followState);

        const click = (type: number) => {
            const action = type === 1 ? 'follow/AGREE_FOLLOWED' : 'follow/REFUSE_FOLLOWED';
            store.dispatch(action, { UserGUID, AnotherUserGUID });
        };

        return {
            loading,
            userInfo,
            click,
            followState,
        };
    },
};
</script>

<style lang="less" scoped>
.followed {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .item {
        padding: 0 16px 16px 16px;
        background: #ffffff;
        .title {
            height: 48px;
            font-size: 18px;
            font-weight: 500;
            color: #333;
            line-height: 48px;
        }
        .divider {
            margin: 0;
            height: 1px;
            font-weight: 500;
            background: #ebedf0;
        }
        .content {
            font-size: 16px;
            font-weight: 400;
            .info {
                display: flex;
                padding: 12px 0;
                .image {
                    width: 40px;
                    height: 40px;
                }
                .name {
                    color: #333;
                    line-height: 40px;
                    margin-left: 8px;
                }
            }
            .text {
                color: #666;
            }
        }
    }
}
.foot {
    display: flex;
    justify-content: space-between;
    padding: 16px;
    .btn {
        width: 166px;
        height: 44px;
    }
    .btn.jj {
        color: #ff7875;
    }
}
</style>
