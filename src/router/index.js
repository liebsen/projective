import Vue from 'vue'
import moment from 'moment'
import Router from 'vue-router'
import store from '../components/Store'
import Landing from '../components/Landing'
import Login from '../components/Login'
import Register from '../components/Register'
import RegisterSuccess from '../components/RegisterSuccess'
import Validate from '../components/Validate'
import Projects from '../components/Projects'
import Project from '../components/Project'
import ProjectCreate from '../components/ProjectCreate'
import ProjectAssign from '../components/ProjectAssign'
import TaskCreate from '../components/TaskCreate'
import TaskEdit from '../components/TaskEdit'
import TaskAssign from '../components/TaskAssign'
import IssueCreate from '../components/IssueCreate'
import Issue from '../components/Issue'
import Account from '../components/Account'
import Task from '../components/Task'
import Terminos from '../components/Terminos'
import Contacto from '../components/Contacto'
import About from '../components/About'
import NotFound from '../components/NotFound'

Vue.use(Router)

Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY')
  }
})

Vue.filter('formatHour', function(value) {
  if (value) {
    return moment(String(value)).format('HH:mm')
  }
})

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'landing',
      component: Landing
    },
    {
      path: '/register/:code?',
      name: 'register',
      component: Register
    },
    {
      path: '/register-success',
      name: 'register-success',
      component: RegisterSuccess
    },
    {
      path: '/validate/:code',
      name: 'validate',
      component: Validate
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/projects',
      name: 'projects',
      component: Projects,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/projects/create',
      name: 'projects_create',
      component: ProjectCreate,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/projects/:id/assign',
      name: 'projects_assign',
      component: ProjectAssign,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/projects/:id',
      name: 'project',
      component: Project,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/tasks/:project_id/create',
      name: 'tasks_create',
      component: TaskCreate,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/tasks/:project_id/assign',
      name: 'tasks_assign',
      component: TaskAssign,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/tasks/:id/edit',
      name: 'tasks_edit',
      component: TaskEdit,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/tasks/:id',
      name: 'task',
      component: Task,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/issues/:task_id/create',
      name: 'issues_create',
      component: IssueCreate,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/issues/:id',
      name: 'issue',
      component: Issue,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/accounts/:id',
      name: 'account',
      component: Account,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/contacto',
      name: 'contacto',
      component: Contacto
    },
    {
      path: '*',
      name: 'notfound',
      component: NotFound
    }
  ]  
});

document.addEventListener('DOMContentLoaded', () => {
  var tosAgree = function(target){
    localStorage.setItem("tosagree",true)
    document.querySelector('.tosprompt').classList.remove('slideIn')
    document.querySelector('.tosprompt').classList.add('fadeOut')      
    setTimeout(() => {
      document.querySelector('.tosprompt').style.display = 'none';
    },1000)
  }

  document.querySelectorAll(".menu-burger, .menu-items").forEach(function(item) {
    item.addEventListener("click", function() {
      if(document.querySelector('.menu').classList.contains('fs')){
        document.querySelector('.menu').classList.remove('fs')
        document.querySelector('.menu').classList.remove('fs')
        document.querySelector('.menu-burger').classList.remove('cross')
      } else {
        document.querySelector('.menu').classList.add('fs')
        document.querySelector('.menu-burger').classList.add('cross')
      }
    },false)
  })

  document.querySelectorAll('.hidden-loading').forEach((item) => {
    item.classList.remove('hidden-loading')
  })

  if(!localStorage.getItem("tosagree")){
    setTimeout(() => {
      document.querySelector('.tosprompt').classList.add('fadeIn')
    },1000)
  } else {
    document.querySelector('.tosprompt').parentNode.removeChild(document.querySelector('.tosprompt'))
  }


})

/*
window.onerror = function(msg, url, line, col, error) {
   // Note that col & error are new to the HTML 5 spec and may not be 
   // supported in every browser.  It worked for me in Chrome.
   var extra = !col ? '' : '\ncolumn: ' + col
   extra += !error ? '' : '\nerror: ' + error

   // You can view the information in an alert to see things working like this:
   //alert("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra)
   console.log("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra)

   // TODO: Report this error via ajax so you can keep track
   //       of what pages have JS issues

   var suppressErrorAlert = true
   // If you return true, then error alerts (like in older versions of 
   // Internet Explorer) will be suppressed.
   return suppressErrorAlert
}
*/

router.beforeEach((to, from, next) => {
  window.scrollTo(0,0)
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login')
  } else {
    next()
  }
})

router.afterEach(function (to, from, next) {
})

export default router