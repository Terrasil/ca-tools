import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'

import 'primeflex/primeflex.css'
import 'primevue/resources/themes/aura-light-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import './assets/main.css'
import './assets/flags.css'
import '@mdi/font/css/materialdesignicons.css'

import AnimateOnScroll from 'primevue/animateonscroll'
import BadgeDirective from 'primevue/badgedirective'
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'
import FocusTrap from 'primevue/focustrap'
import Ripple from 'primevue/ripple'
import StyleClass from 'primevue/styleclass'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'

import { createI18n } from 'vue-i18n'

import en from './i18n/en.json'
import pl from './i18n/pl.json'

const messages = {
  en: en,
  pl: pl
}

const i18n = createI18n({
  locale: 'pl',
  fallbackLocale: 'en',
  allowComposition: true,
  messages
})

const app = createApp(App)

app.use(i18n)
app.use(router)
app.use(PrimeVue, { ripple: true })
app.use(ConfirmationService)
app.use(ToastService)
app.use(DialogService)
app.use(router)

app.directive('tooltip', Tooltip)
app.directive('badge', BadgeDirective)
app.directive('ripple', Ripple)
app.directive('styleclass', StyleClass)
app.directive('focustrap', FocusTrap)
app.directive('animateonscroll', AnimateOnScroll)

app.mount('#app')
