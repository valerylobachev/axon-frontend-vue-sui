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
        redirect: '/bpm-config/diagrams',
        children: [
            {
                path: 'diagrams',
                component: () => import(/* webpackChunkName: "bpm-config" */'./bpm/config/BpmDiagrams.vue'),
                name: 'diagrams',
            },
            {
                path: 'diagram/:action/:id',
                component: () => import(/* webpackChunkName: "bpm-config" */'./bpm/config/BpmDiagramForm.vue'),
                name: 'diagram',
            },
        ],
    },
    {
        path: '*',
        redirect: '/bpm/tasks',
    },
]

export default axonRoutes;
