import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.token
  return config
})

export const loginApi = params => {
  return axios.post('login', params)
}

export const homeMenuListApi = () => {
  return axios.get('menus')
}

export const userListApi = (params) => {
  return axios.get('users', { params })
}

export const changeUserStateApi = (params) => {
  return axios.put(`users/${params.id}/state/${params.mg_state}`)
}

export const addUserApi = (params) => {
  return axios.post('users', params)
}

export const delUserApi = (params) => {
  return axios.delete(`users/${params}`)
}

export const findUserApi = (params) => {
  return axios.get(`users/${params}`)
}

export const editUserApi = (params) => {
  return axios.put(`users/${params.id}`, { email: params.email, mobile: params.mobile })
}

export const rightListApi = (params) => {
  return axios.get(`rights/${params}`)
}

export const roleListApi = () => {
  return axios.get('roles')
}
