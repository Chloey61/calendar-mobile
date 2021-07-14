<template>
    <div id="app">
        <router-view />
    </div>
</template>

<style lang="less">
@import url('./style/index.less');
html,
body,
#app {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    background-color: #fff;
    font-family: 'Avenir', Helvetica, Arial, sans-serif, 'Microsoft YaHei', 'PingFang SC';
    -webkit-font-smoothing: antialiased;
    -webkit-overflow-scrolling: touch;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}
</style>
