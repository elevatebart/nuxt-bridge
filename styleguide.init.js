import Vue from 'vue'
import Vuetify from 'vuetify'
import options from './client/vuetify.options'

Vue.use(Vuetify, options)

const vuetify = new Vuetify(options)
export default (previewComponent) => {
    // https://vuejs.org/v2/guide/render-function.html
    return {
        vuetify,
        render(h) {
            previewComponent.template = '<v-container fluid>' + previewComponent.template + '</v-container>'
            return h('v-app', [h(previewComponent)])
        },
    }
}
