import { createRouter, createWebHashHistory } from 'vue-router'
import { h, resolveComponent } from 'vue'

import DefaultLayout from '@/layouts/DefaultLayout'
import { Role } from '../config/role'
import UserLayout from '@/layouts/UserLayout'

const routes = [
  {
    component: DefaultLayout,

    children: [
      {
        path: '/admin/list-accounts',
        name: 'Account',
        component: () => import('@/views/admin/ListAccount.vue'),
        meta: {
          requiresAuth: true,
          authorize: [Role.Admin],
        },
      },
      {
        path: '/admin/groups',
        name: 'Groups',
        component: () => import('@/views/admin/Groups.vue'),
        meta: {
          requiresAuth: true,
          authorize: [Role.Admin, Role.Staff],
        },
      },
      {
        path: '/admin/groups/detail',
        name: 'Group Detail',
        component: () => import('@/views/admin/GroupDetail.vue'),
        meta: {
          requiresAuth: true,
          authorize: [Role.Admin, Role.Staff],
        },
      },
      {
        path: '/admin/list-projects',
        name: 'Projects',
        component: () => import('@/views/admin/ListProjects.vue'),
        meta: {
          requiresAuth: true,
          authorize: [Role.Admin, Role.Staff],
        },
      },
      {
        path: '/admin/reports',
        name: 'Schedule Reports',
        component: () => import('@/views/admin/ManageReport.vue'),
        meta: {
          requiresAuth: true,
          authorize: [Role.Admin, Role.Staff],
        },
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/user/Profile.vue'),
        meta: { requiresVisitor: true },
      },
    ],
  },
  {
    path: '/',
    name: 'Home',
    component: UserLayout,
    meta: {
      requiresAuth: true,
      authorize: [Role.Student],
    },
    redirect: '/user/home',
    children: [
      {
        path: '/user/home',
        name: 'Home',
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ '@/views/user/StudentHome.vue'
          ),
      },
      {
        path: '/user/project',
        name: 'Project',
        component: () => import('@/views/user/Submission.vue'),
      },
      {
        path: '/user/scoreview',
        name: 'ScoresView',
        component: () => import('@/views/user/ScoreView.vue'),
      },
    ],
  },
  {
    path: '/',
    redirect: '/teacher',
    name: 'Teacher',
    component: UserLayout,
    meta: {
      requiresAuth: true,
      authorize: [Role.Teacher],
    },
    children: [
      {
        path: '/teacher/teacher-home',
        name: 'Teacher Home',
        component: () => import('@/views/admin/TeacherHome.vue'),
      },

      {
        path: '/teacher/scores',
        name: 'Scores',
        component: () => import('@/views/admin/ScoreReport.vue'),
      },
      {
        path: '/teacher/submit',
        name: 'Submission',
        component: () => import('@/views/user/SubmitDetail.vue'),
      },
    ],
  },

  {
    path: '/pages',
    redirect: '/404',
    name: 'Page',
    meta: { requiresVisitor: true },
    component: {
      render() {
        return h(resolveComponent('router-view'))
      },
    },
    children: [
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/pages/Login.vue'),
      },
    ],
  },

  // {
  //   path: '/404',
  //   meta: { requiresFail: true },
  //   component: () =>
  //     import(/* webpackChunkName: "demo" */ '@/views/pages/Page404.vue'),
  // },
  // { path: '/:pathMatch(.*)*', redirect: '/404' },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

router.beforeEach(async (to, from, next) => {
  console.log('URL:', to)
  const { authorize } = to.meta
  const currentUser = localStorage.getItem('USER')
  const user = JSON.parse(currentUser)
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (currentUser === null) {
      next('/login')
    } else {
      if (authorize.length && !authorize.includes(user.account.roleName)) {
        alert('You dont have access permission')
        return next({
          path: '/login',
        })
      } else {
        next()
      }
    }
  }
  next()
})

export default router
