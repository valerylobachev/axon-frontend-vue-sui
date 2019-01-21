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
                schemaForm: {
                    createTitle: 'Create schema',
                    viewTitle: 'View schema',
                    editTitle: 'Edit schema',
                    nameRequired: 'Name required',
                    xmlRequired: 'XML required',
                    infoTab: 'Info',
                    designerTab: 'Designer',
                    xmlTab: 'XML',
                },
            },

        },
        shared: {
            delete: 'Delete',
            cancel: 'Cancel',
            error: 'Error',
            save: 'Save',
            edit: 'Edit',
            view: 'View',
            saved: 'Saved',
            changed: 'Changed',
        },
    },

    ...enServerMessages,
};
