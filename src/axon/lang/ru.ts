import ruServerMessages from '@/axon/lang/ruServer';

export default {
    axon: {
        title: 'Annette Axon',
        menu: {
            tasks: 'Задачи',
            processes: 'Процессы',
            orgStructure: 'Огр. структура',
            projects: 'Проекты',

            config: {
                title: 'КОНФИГУРАЦИЯ',
                bpm: {
                    title: 'Бизнес процессы',
                    schemas: 'Схемы',
                    processes: 'Процессы',
                },
                orgStructure: 'Орг. структура',
                forms: 'Формы',
                knowledge: 'Данные',
                projects: 'Проекты',
            },
            admin: 'Администрирование',
        },
        bpm: {
            md: {
                schema: {
                    id: 'Ид',
                    name: 'Наименование',
                    description: 'Описания',
                    notation: 'Нотация',
                    processDefinitions: 'Определения процессов',
                    xml: 'XML',
                    delete: 'Удалить схему {name}?',
                },
            },
            form: {
                schemas: {
                    title: 'Схемы',
                    actions: 'Действия',
                    createBPMN: 'Создать BPMN',
                    createDMN: 'Создать DMN',
                    createCMMN: 'Создать CMMN',
                    filter: 'Фильтр',
                    notFound: 'Схемы не найдены',
                },
            },

        },
        shared: {
            delete: 'Удалить',
            cancel: 'Отмена',
            error: 'Ошибка',
        },
    },

    ...ruServerMessages,
}
