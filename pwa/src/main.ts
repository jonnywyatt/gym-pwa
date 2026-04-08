import { createApp } from 'vue';
import './styles/main.css';
import App from './App.vue';
import router from './router';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}

const app = createApp(App);
app.use(router);
app.mount('#app');
