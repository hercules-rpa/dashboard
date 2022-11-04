import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import JwtService from '@/common/jwt.service'
import { SALI_URL } from './config'

const ApiService = {
  init () {
    Vue.use(VueAxios, axios)
    Vue.axios.defaults.baseURL = SALI_URL
    this.setHeader()
  },

  setHeader () {
    Vue.axios.defaults.headers.common.AccessControlAllowOrigin = '*'
    Vue.axios.defaults.headers.common.Authorization = `Bearer ${JwtService.getToken()}`
  },

  query (resource, params) {
    return Vue.axios.get(resource, params).catch(error => {
      throw new Error(`[UMUROBOTS] ApiService ${error}`)
    })
  },

  get (resource, slug = '') {
    return Vue.axios.get(`${resource}/${slug}`).catch(error => {
      throw new Error(`[UMUROBOTS] ApiService ${error}`)
    })
  },

  post (resource, params) {
    return Vue.axios.post(`${resource}`, params)
  },

  patch (resource, params) {
    return Vue.axios.patch(`${resource}`, params)
  },

  update (resource, slug, params) {
    return Vue.axios.put(`${resource}/${slug}`, params)
  },

  put (resource, params) {
    return Vue.axios.put(`${resource}`, params)
  },

  delete (resource, slug = '') {
    return Vue.axios.delete(`${resource}/${slug}`).catch(error => {
      throw new Error(`[UMUROBOTS] ApiService ${error}`)
    })
  },

  deleteOld (resource) {
    return Vue.axios.delete(resource).catch(error => {
      throw new Error(`[UMUROBOTS] ApiService ${error}`)
    })
  },
}

export default ApiService

export const RobotsService = {
    query () {
        return ApiService.query('robots')
    },
    get (slug) {
        return ApiService.get('robots', slug)
    },
    /*
    execute (slug, params) {
      return ApiService.post('robots/' + slug + '/execute', params)
    },
    */
    getRobotLogs (slug) {
      return ApiService.get('robots/' + slug + '/logs')
    },
  }

  export const SchedulesService = {
    query (params) {
        return ApiService.query('schedules', params)
    },
    get (slug) {
        return ApiService.get('schedules', slug)
    },
    delete (slug) {
        return ApiService.delete('schedules', slug)
    },
    execute (params) {
      return ApiService.post('schedules/execute', params)
    },
    modify (slug, params) {
      return ApiService.patch('schedules/' + slug, params)
    },
  }
  export const OrchestratorService = {
    execute (params) {
        return ApiService.post('schedules/execute', params)
    },
  }

  export const ExecutionsService = {
    query () {
        return ApiService.query('executions')
    },
    get (slug) {
        return ApiService.get('executions', slug)
    },
  }

export const LogsService = {
    query () {
        return ApiService.query('logs')
    },
    get (slug) {
        return ApiService.get('logs', slug)
    },
}
export const ProblemsService = {
  query () {
      return ApiService.query('robots/problems')
  },
  get (slug) {
    return ApiService.get('robots/problems', slug)
  },
  getRobotProblems (slug) {
      return ApiService.get('robots/' + slug + '/problems')
  },
}
export const ProcessService = {
    query () {
        return ApiService.query('process')
    },
    get (slug) {
        return ApiService.get('process', slug)
    },
    getForm (slug) {
        return ApiService.get('process/', slug + '/form')
    },

}

export const ProcessSettingsService = {
  query () {
      return ApiService.get('register/config')
  },
  editConfig (path, params) {
      return ApiService.patch('register/config?path=' + path, params)
  },
  getConfig (path) {
      console.log(path)
      return ApiService.query('register/config?path=' + path)
  },
  resetConfig (path) {
    return ApiService.post('register/config?path=' + path)
  },
}

export const SettingsService = {
  getGlobalSettings () {
      return ApiService.get('global_settings')
  },
  editGlobalSettings (params) {
      return ApiService.patch('global_settings', params)
  },
  getPSettings () {
      return ApiService.get('process_settings')
  },
  editPSettings (params) {
      return ApiService.patch('process_settings', params)
  },
    getAMQPSettings () {
      return ApiService.get('amqp_settings')
  },
  editAMQPSettings (params) {
      return ApiService.patch('amqp_settings', params)
  },
    getDBProcessSettings () {
      return ApiService.get('dbprocess_settings')
  },
  editDBProcessSettings (params) {
      return ApiService.patch('dbprocess_settings', params)
  },
    getDBPersistenceSettings () {
      return ApiService.get('dbpersistence_settings')
  },
  editDBPersistenceSettings (params) {
      return ApiService.patch('dbpersistence_settings', params)
  },
    getDBBISettings () {
      return ApiService.get('dbbi_settings')
  },
  editDBBISettings (params) {
      return ApiService.patch('dbbi_settings', params)
  },
    getOrchestratorSettings () {
      return ApiService.get('orchestrator_settings')
  },
  editOrchestratorSettings (params) {
      return ApiService.patch('orchestrator_settings', params)
  },
}
export const StatisticsService = {
  query () {
      return ApiService.query('statistics/maindashboard')
  },
}
export const FilesService = {
  get (slug) {
    return ApiService.get('files', slug)
  },
  post (blob) {
    return ApiService.post('files', blob)
  },
}

export const ArticlesService = {
    query (type, params) {
      return ApiService.query('articles' + (type === 'feed' ? '/feed' : ''), {
        params: params,
      })
    },
    get (slug) {
      return ApiService.get('articles', slug)
    },
    create (params) {
      return ApiService.post('articles', { article: params })
    },
    update (slug, params) {
      return ApiService.update('articles', slug, { article: params })
    },
    destroy (slug) {
      return ApiService.delete(`articles/${slug}`)
    },
  }

  export const ProfileRecommendationService = {
    query (params) {
        Vue.axios.defaults.headers.common.Authorization = `Bearer ${params}`
        return ApiService.query('register/profile')
    },
    get (slug) {
        return ApiService.get('schedules', slug)
    },
    register (token, areasList) {
      Vue.axios.defaults.headers.common.Authorization = `Bearer ${token}`
      return ApiService.post('register/calificacion/area', areasList)
    },
    borrarDatosEntrenamiento (token, perfilBase) {
      Vue.axios.defaults.headers.common.Authorization = `Bearer ${token}`
      return ApiService.delete('register/calificacion/area/reset', perfilBase)
    },
    getAllProfiles () {
      return ApiService.query('register/profile/investigadores')
    },
  }

  export const FeedbackService = {
    query (params, slug) {
        Vue.axios.defaults.headers.common.Authorization = `Bearer ${params}`
        return ApiService.post('register/feedback/' + slug)
    },
}

export const LoginService = {
  login (user, password) {
      return ApiService.post('login', { username: user, password: password })
    },
}
