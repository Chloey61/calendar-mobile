import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { Button, Loading, Calendar, Field, Image, Divider, Sticky, Toast, Icon, IndexBar } from 'vant';
import 'vant/lib/index.css';
import 'lib-flexible';
import moment from 'moment'; //导入文件

const app = createApp(App);
app.config.globalProperties.$moment = moment; //赋值使用
app.use(store).use(router).use(Button).use(Loading).use(Calendar).use(Field).use(Image).use(Divider).use(Sticky).use(Icon).use(IndexBar).use(Toast).mount('#app');
