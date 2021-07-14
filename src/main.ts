import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { Button, Loading, Calendar, Field, Image, Divider, Sticky, Toast, Icon, IndexBar } from 'vant';
import 'vant/lib/index.css';
import 'lib-flexible';
// import Vconsole from 'vconsole';


// window.console.log(process.env);

// const vConsole = new Vconsole();

createApp(App)
    .use(store)
    .use(router)
    // .use(vConsole as any)
    .use(Button)
    .use(Loading)
    .use(Calendar)
    .use(Field)
    .use(Image)
    .use(Divider)
    .use(Sticky)
    .use(Icon)
    .use(IndexBar)
    .use(Toast)
    .mount('#app');
