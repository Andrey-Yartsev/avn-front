import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter)

const Index = { template: '<div>Index</div>' }
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

const routes = [
    { path: '/', component: Index },
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
]

export default new VueRouter({
    mode: 'history',
    routes,
});
