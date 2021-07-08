import Vue from 'vue';
import VueTouch from 'vue-touch';
import ELF from '@hb/elf';
import FastClick from 'fastclick';
import TIANQI_UBT from '@/utils/tianqiUBT';
import ubtPlugin from '@/plugin/ubt';
import App from './App';
import router from './router';
import authStore from './store/auth';
import { setConst } from './const/app.const';
import './styles/reset-mint-ui.less';
import './utils/crow';

Vue.config.productionTip = false;

// 初始化基础状态
authStore.init();

/* eslint-disable no-new */
/* eslint-disable */

FastClick.attach(document.body);
// 解决高版本iOS输入框多次点击才能聚焦问题，原因是与fastClick聚焦冲突，但是启用后iOS输入框第一次点击不会自动滚动到键盘上方的问题会暴露
FastClick.prototype.focus = function (targetElement) {
  let length;
  if (targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
    length = targetElement.value.length;
    targetElement.focus();
    targetElement.setSelectionRange(length, length);
  } else {
    targetElement.focus();
  }
};

// 初始化环境切换
if (process.env.VUE_APP_ENV !== 'pro') {
  const __elf_env = String(window.localStorage.getItem('__elf_env')).replace(/\"/g,"");
  if (__elf_env) {
    setConst(__elf_env);
  }
  new ELF({
    envConfig: ['dev', 'fat', 'fat_2', 'fat:tag=fat', 'uat', 'gray', 'pre', 'pro'],
  }).on('envChanged', (e) => {
    setConst(e.data);
    TIANQI_UBT.initConfig();
    if (e.data !== __elf_env) {
      window.location.reload();
    }
  });

  // 加载vconsole
  const scriptElement = document.createElement('script');
  scriptElement.setAttribute('src','https://m.hellobike.com/resource/h5/hitch/js/vconsole.min.js');
  document.head.appendChild(scriptElement);
  scriptElement.onload = () => { new VConsole(); };
}

TIANQI_UBT.initConfig();
// 手势库，包装了hammerjs的指令，参考 https://github.com/vuejs/vue-touch/tree/next
Vue.use(VueTouch, {name: 'v-touch'});

// 天启埋点插件，包含自动化pv/pvout 和 挂载全局埋点方法
Vue.use(ubtPlugin);

export default new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
