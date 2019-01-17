import enServerMessages from '@/axon/lang/enServer';

export default {
    axon: {
        title: 'Annette Axon',
        menu: {
            tasks: 'Tasks',
            processes: 'Processes',
            orgStructure: 'Org. Structure',
            projects: 'Projects',

            config: {
                title: 'CONFIG',
                bpm: {
                    title: 'BPM',
                    schemas: 'Schemas',
                    processes: 'Processes',
                },
                orgStructure: 'Org. Structure',
                forms: 'Forms',
                knowledge: 'Knowledge',
                projects: 'Projects',
            },
            admin: 'Admin',
        },
        bpm: {
            md: {
                schema: {
                    id: 'Id',
                    name: 'Name',
                    description: 'Description',
                    notation: 'Notation',
                    processDefinitions: 'Process Defs',
                    xml: 'XML',
                    delete: 'Are you sure to delete schema {name}?',
                },
            },
            form: {
                schemas: {
                    title: 'Schemas',
                    actions: 'Actions',
                    createBPMN: 'Create BPMN',
                    createDMN: 'Create DMN',
                    createCMMN: 'Create CMMN',
                    filter: 'Filter',
                    notFound: 'No schema has been found.',
                },
            },

        },
        shared: {
            delete: 'Delete',
            cancel: 'Cancel',
            error: 'Error',
        },
    },

    ...enServerMessages,
};
