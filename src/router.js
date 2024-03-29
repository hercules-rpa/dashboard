import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/p',
      component: () => import('@/views/dashboard/NormalIndex'),
      children: [
        {
          name: 'UserProfileRecommendation',
          path: '/p/profilerecommendation/:token',
          component: () => import('@/views/dashboard/pages/ProfileRecommendation'),
        },
        {
          name: 'ProfileReport',
          path: '/p/profileReport/',
          component: () => import('@/views/dashboard/pages/ProfileReport'),
        },
        {
          name: 'FeedbackResearcher',
          path: '/p/feedback/:token/:idconvocatoria/:util',
          component: () => import('@/views/dashboard/pages/FeedbackReaction'),
        },
        {
          name: 'FeedbackReactionResearcher',
          path: '/p/feedbackreaction/:token/:idconvocatoria/:util',
          component: () => import('@/views/dashboard/pages/FeedbackReaction'),
        },
      ],
    },
    {
      name: 'Login',
      path: '',
      component: () => import('@/views/dashboard/pages/Login'),
    },
    {
      path: '/',
      component: () => import('@/views/dashboard/Index'),
      children: [
        // Dashboard
        {
          name: 'Dashboard',
          path: 'dashboard',
          component: () => import('@/views/dashboard/Dashboard'),
        },
        // NewProcess
        {
          name: 'NewProcess',
          path: 'pages/newprocess',
          component: () => import('@/views/dashboard/pages/NewProcess'),
        },
        // Form
        {
          name: 'Form',
          path: 'pages/newprocess/:idProcess/form',
          component: () => import('@/views/dashboard/pages/Form'),
        },
        // ProcessSettings
        {
          name: 'ProcessSettings',
          path: 'pages/settings/:configPath',
          component: () => import('@/views/dashboard/pages/ProcessSettings'),
        },
        {
          name: 'Settings',
          path: 'pages/settings',
          component: () => import('@/views/dashboard/pages/Settings'),
        },
        {
          name: 'GlobalSettings',
          path: 'pages/globalsettings/:settingsType',
          component: () => import('@/views/dashboard/pages/GlobalSettings'),
        },
        // Robots
        {
          name: 'Robots',
          path: 'pages/robots',
          component: () => import('@/views/dashboard/pages/Robots'),
        },
        // Robot
        {
          name: 'Robot',
          path: 'pages/robots/:idRobot',
          component: () => import('@/views/dashboard/pages/Robot'),
        },
          // RobotExecutions
        {
          name: 'RobotExecutions',
          path: 'pages/robots/:idRobot/executions',
          component: () => import('@/views/dashboard/pages/RobotExecutions'),
        },
        // Log
        {
          name: 'Log',
          path: 'pages/logs/:idLog',
          component: () => import('@/views/dashboard/pages/Log'),
        },
        // Executions
        {
          name: 'Executions',
          path: 'pages/executions',
          component: () => import('@/views/dashboard/pages/Executions'),
        },
        // Execution
        {
          name: 'Execution',
          path: 'pages/executions/:idSchedule',
          component: () => import('@/views/dashboard/pages/Execution'),
        },
        // Schedules
        {
          name: 'Schedules',
          path: 'pages/schedules',
          component: () => import('@/views/dashboard/pages/SchedulesActive'),
        },
        {
          name: 'EditSchedule',
          path: 'pages/schedules/:idSchedule/edit',
          component: () => import('@/views/dashboard/pages/EditSchedule'),
        },
        // Problems
        {
          name: 'Problems',
          path: 'pages/problems',
          component: () => import('@/views/dashboard/pages/Problems'),
        },
        // Accesibilidad
        {
          name: 'Accessibility',
          path: 'pages/accessibility',
          component: () => import('@/views/dashboard/pages/Accessibility'),
        },
        {
          name: 'Notifications',
          path: 'components/notifications',
          component: () => import('@/views/dashboard/component/Notifications'),
        },
        {
          name: 'Icons',
          path: 'components/icons',
          component: () => import('@/views/dashboard/component/Icons'),
        },
        {
          name: 'Typography',
          path: 'components/typography',
          component: () => import('@/views/dashboard/component/Typography'),
        },
        // Tables
        {
          name: 'Regular Tables',
          path: 'tables/regular-tables',
          component: () => import('@/views/dashboard/tables/RegularTables'),
        },
      ],
    },
  ],
})
