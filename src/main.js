import Vue from 'vue';
import App from './App.vue';
import store from './store';
import UUID from "vue-uuid";
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faChevronLeft,
  faChevronRight,
  faFileAlt, faPen,
  faTimes, faPlus,
  faTrash, faChevronUp,
  faChevronDown, faCommentAlt,
  faImage, faVideo,
  faVolumeUp, faLock
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VTooltip from 'v-tooltip';
import 'v-tooltip/dist/v-tooltip.css'
import EventBus from "@/eventBusFlowchart.js";

library.add(faChevronLeft,
  faChevronRight, faFileAlt,
  faPen, faTimes, faPlus,
  faTrash, faChevronUp,
  faChevronDown, faCommentAlt,
  faImage, faVolumeUp,
  faVideo, faLock);

Vue.config.productionTip = false
Vue.use(UUID);
Vue.use(VTooltip);
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.prototype.$eventBus = new EventBus();

Vue.filter('str_limit', function (value, size) {
  if (!value) return '';
  value = value.toString();

  if (value.length <= size) {
    return value;
  }
  return value.substr(0, size) + '...';
});

Vue.filter('http_regex', function (value) {
  if (new RegExp(/(https?:\/\/.*\.(?:png|jpg))/i).test(value.trim())) return value;
  else return "";
});

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
