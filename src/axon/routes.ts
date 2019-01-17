import HomeLayout from '@/axon/utils/HomeLayout.vue';

const axonRoutes =  [
    {
        path: '',
        name: 'home',
        redirect: '/bpm/tasks',
    },
    {
        path: '/bpm',
        name: 'bpm',
        component: HomeLayout,
        redirect: '/bpm/tasks',
        children: [
            {
                path: 'tasks',
                component: () => import(/* webpackChunkName: "bpm" */'./bpm/main/Tasks.vue'),
                name: 'tasks',
            },
            {
                path: 'processes',
                component: () => import(/* webpackChunkName: "bpm" */'./bpm/main/Processes.vue'),
                name: 'processes',
            },
        ],
    },
    {
        path: '/bpm-config',
        name: 'bpm-config',
        component: HomeLayout,
        redirect: '/bpm-config/schemas',
        children: [
            {
                path: 'schemas',
                component: () => import(/* webpackChunkName: "bpm-config" */'./bpm/config/Schemas.vue'),
                name: 'schemas',
            },
            {
                path: 'schema',
                component: () => import(/* webpackChunkName: "bpm-config" */'./bpm/config/Schema.vue'),
                name: 'schema',
            },
        ],
    },
    {
        path: '*',
        redirect: '/bpm/tasks',
    },
]

export default axonRoutes;
