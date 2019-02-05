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
                component: () => import(/* webpackChunkName: "bpm-config" */'./bpm/config/BpmDiagramList.vue'),
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
        path: '/knowledge-config',
        name: 'knowledge-config',
        component: HomeLayout,
        redirect: '/knowledge-config/schemas',
        children: [
            {
                path: 'schemas',
                component: () =>
                    import(/* webpackChunkName: "knowledge-config" */'./knowledge/config/DataSchemaList.vue'),
                name: 'schemas',
            },
            {
                path: 'schema/:action/:key',
                component: () =>
                    import(/* webpackChunkName: "knowledge-config" */'./knowledge/config/DataSchemaForm.vue'),
                name: 'schema',
            },
        ],
    },
    {
        path: '*',
        redirect: '/bpm/tasks',
    },
];

export default axonRoutes;
