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
                    bpmDiagrams: 'Diagrams',
                    processes: 'Processes',
                },
                orgStructure: 'Org. Structure',
                forms: 'Forms',
                knowledge: {
                    title: 'Knowledge',
                    dataSchemas: 'Data Schemas',
                    processes: 'Processes',
                },
            },
            admin: 'Admin',
        },
        bpm: {
            md: {
                bpmDiagram: {
                    key: 'Id',
                    name: 'Name',
                    description: 'Description',
                    notation: 'Notation',
                    processDefinitions: 'Process Defs',
                    xml: 'XML',
                    delete: 'Are you sure to delete diagram {name}?',
                },
            },
            form: {
                bpmDiagrams: {
                    title: 'BPM Diagrams',
                    actions: 'Actions',
                    createBPMN: 'Create BPMN',
                    createDMN: 'Create DMN',
                    createCMMN: 'Create CMMN',
                    filter: 'Filter',
                    notFound: 'No diagram has been found.',
                },
                bpmDiagramForm: {
                    createTitle: 'Create BPM diagram',
                    viewTitle: 'View BPM diagram',
                    editTitle: 'Edit BPM diagram',
                    nameRequired: 'Name required',
                    xmlRequired: 'XML required',
                    infoTab: 'Info',
                    designerTab: 'Designer',
                    xmlTab: 'XML',
                },
            },

        },
        knowledge: {
            md: {
                dataSchema: {
                    key: 'Key',
                    name: 'Name',
                    description: 'Description',
                    baseSchemas: 'Base records',
                    fields: 'Fields',
                    delete: 'Are you sure to delete data schema {name}?',
                },
                dataSchemaField: {
                    key: 'Key',
                    name: 'Name',
                    caption: 'Caption',
                    datatype: 'Data type',
                    value: 'Default value',
                    elementDatatype: 'Element data type',
                    delete: 'Are you sure to delete field {key} - {name}?',
                },
            },
            form: {
                dataSchemaList: {
                    title: 'Data Schemas',
                    actions: 'Actions',
                    create: 'Create',
                    filter: 'Filter',
                    notFound: 'No data schema has been found.',
                },
                dataSchemaForm: {
                    createTitle: 'Create data schema',
                    viewTitle: 'View data schema',
                    editTitle: 'Edit data schema',
                    nameRequired: 'Name required',
                    keyRequired: 'Key required',
                    infoTab: 'Info',
                    baseSchemasTab: 'Base schemas',
                    fieldsTab: 'Fields',
                },
                dataSchemaModalSelector: {
                    title: 'Select data schema',
                },
            },

        },
        shared: {
            create: 'Create',
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
