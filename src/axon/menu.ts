import {MenuModel} from '@/annette/layout/menu.model';

export const MENU: MenuModel[] = [

  {state: '/bpm/tasks', name: 'axon.menu.tasks', type: 'link', icon: 'tasks'},
  {state: '/bpm/processes', name: 'axon.menu.processes', type: 'link', icon: 'list'},
  {state: '/org-structure', name: 'axon.menu.orgStructure', type: 'link', icon: 'sitemap'},
  {state: '/projects', name: 'axon.menu.projects', type: 'link', icon: 'cubes'},
  {name: 'axon.menu.config.title', type: 'header'},
  {
    state: '/bpm-config/', name: 'axon.menu.config.bpm.title', type: 'sub', icon: 'tasks',
    children: [
      {state: '/bpm-config/schemas', name: 'axon.menu.config.bpm.schemas', type: 'link', icon: 'object group outline'},
      {state: '/bpm-config/processes', name: 'axon.menu.config.bpm.processes', type: 'link', icon: 'list'},
    ],
  },
  {state: '/config/', name: 'axon.menu.config.orgStructure', type: 'link', icon: 'sitemap'},
  {state: '/config/', name: 'axon.menu.config.forms', type: 'link', icon: 'id card'},
  {state: '/config/', name: 'axon.menu.config.knowledge', type: 'link', icon: 'database'},
  {state: '/config/', name: 'axon.menu.config.projects', type: 'link', icon: 'cubes'},


  {state: '/admin', name: 'axon.menu.admin', type: 'link', icon: 'university'},

];

