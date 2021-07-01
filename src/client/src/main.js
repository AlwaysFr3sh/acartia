import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import vuexPersistedState from 'vuex-persistedstate'
import Router from 'vue-router'
import Login from './components/Pages/LoginPage'
import Dashboard from './components/Pages/DashboardPage'
import ManageData from './components/Pages/DataPage'
import Register from './components/Pages/RegisterPage'
import ManageUsers from './components/Pages/ApprovalsPage'
import Visualiser from './components/Pages/VisualiserPage'
import Heatmap from './components/Pages/HeatmapPage'
import About from './components/Pages/AboutPage'
import Home from './components/Pages/HomePage'
import axios from 'axios'
import Clipboard from 'v-clipboard'
import 'bootstrap-css-only/css/bootstrap.min.css'
import 'mdbvue/lib/css/mdb.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import IPFS from 'ipfs'
import OrbitDB from 'orbit-db'

Vue.config.productionTip = false

Vue.use(Clipboard)

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      // Reroutes to login by default upon render
      path: '/',
      meta: {
        title: 'SSEMMI Client',
        metaTags: [
          {
            name: 'SSEMMI Client',
            content: 'SSEMMI Client'
          }
        ]
      },
      redirect: {
        name: 'Home'
      }
    },
    {
      // Login page
      path: '/home',
      name: 'Home',
      meta: {
        title: 'SSEMMI Client',
        metaTags: [
          {
            name: 'SSEMMI Client',
            content: 'SSEMMI Client'
          }
        ]
      },
      component: Home
    },
    {
      // Login page
      path: '/login',
      name: 'Login',
      meta: {
        title: 'SSEMMI Client',
        metaTags: [
          {
            name: 'SSEMMI Client',
            content: 'SSEMMI Client'
          }
        ]
      },
      component: Login,
      beforeEnter: (to, from, next) => {
        let hasToken = sessionStorage.getItem('userToken')
        let isAuthenticated = store.state.isAuthenticated === true
        let isLegitUser = store.state.token != null

        if(isAuthenticated && isLegitUser && hasToken) {
          next('/data-explorer')
        } else {
          next()
        }
      }
    },
    {
      // Dashboard page for users to claim tokens
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      beforeEnter: (to, from, next) => {
        let hasToken = sessionStorage.getItem('userToken')
        let isRestricted = store.state.isAuthenticated === false
        let isLegitUser = store.state.token != null

        if(isRestricted && !isLegitUser && !hasToken) {
          next('/login')
        } else {
          next()
        }
      }
    },
    {
      // Register page to create new users - admin only
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      // Register page to create new users - admin only
      path: '/about',
      name: 'About',
      component: About
    },
    {
      // Manage Users page to confirm user registration
      path: '/manage-users',
      name: 'ManageUsers',
      component: ManageUsers,
      beforeEnter: (to, from, next) => {
        let hasToken = sessionStorage.getItem('userToken')
        let isRestricted = store.state.isAuthenticated === false
        let isLegitUser = store.state.token != null
        let isAdmin = store.state.isAdmin === true
        if(isRestricted && !isLegitUser && !hasToken) {
          next('/login')
        }
        else if(!isAdmin) {
          next('/data-explorer')
        }
        else {
          next()
        }
      }
    },
    {
      // Visualiser page to view data visualisations
      path: '/data-explorer',
      name: 'DataExplorer',
      component: Visualiser
    },
    {
      // Visualiser page to view data visualisations
      path: '/historical',
      name: 'Historical',
      component: Heatmap
    },
    {
      // Data import and export page
      path: '/manage-data',
      name: 'ManageData',
      component: ManageData
    }
  ]
})


// Setup store with vuex
Vue.use(Vuex)
export const store = new Vuex.Store(
  {
    state: {
      isAuthenticated: false,
      token: null,
      userDetails: [],
      isAdmin: false,
      userRequestList: [],
      sightings: []
    },
    mutations: {
      setAuthentication(state, status) {
        state.isAuthenticated = status
      },
      setUserToken(state, token) {
        state.token = token
      },
      setUserDetails(state, userData) {
        state.userDetails = userData
      },
      setIsAdmin(state, status) {
        state.isAdmin = status
      },
      setUserRequestList(state, list) {
        state.userRequestList = list
      },
      setUserList(state, list) {
        state.userList = list
      },
      setTokenList(state, list) {
        state.tokenList = list
      },
      setProfile(state, profile) {
        state.profile = profile
      },
      setSightings(state, sightings) {
        state.sightings = sightings
      }
    },
    getters: {
      getUserToken: state => {
        return state.token
      },
      getProfile: state => {
        return state.profile
      },
      getUserDetails: state => {
        return state.userDetails.user
      },
      getUserRequestList: state => {
        return state.userRequestList
      },
      getSightings: state => {
        return state.sightings
      }
    },
    actions: {
      // Check session data upon creation or refresh
      init_store({commit}) {
        const userToken = sessionStorage.getItem('userToken')
        if (userToken) {
          commit('setAuthentication', true)
          commit('setUserToken', userToken)
        }
      },
      // Login request
      auth_request({commit}, data) {
        return new Promise ((resolve, reject) => {
          const requestOpts = {
            'access_token': process.env.VUE_APP_MASTER_KEY
          }
          console.log(process.env.VUE_APP_WEB_SERVER_URL)
          //Header post method to authenticate login by passing login details
          axios.post(`${process.env.VUE_APP_WEB_SERVER_URL}/v1/auth/`, requestOpts, {
            auth: {
              username: data.email,
              password: data.password
            }
          })
          // Retreive token and redirect to requested page
          .then( user => {
            // Route protection to the next page
            commit('setAuthentication', true)
            // Save retreived token to state and session storage
            commit('setUserToken', user.data.token)
            // Set user data
            commit('setUserDetails', user.data)
            // Check role
            if(user.data.user.role != 'admin') {
              commit('setIsAdmin', false)
            } else {
              commit('setIsAdmin', true)
            }
            sessionStorage.setItem('userToken', user.data.token)
            // Login success
            console.log(`Login successful, Hello ${user.data.user.name}`)

            resolve("Login successful!")
          })
          // Check for request errors
          .catch(err => {
            // Initialise error message if server is having problems
            let errMsg = "Something went wrong! Please try again shortly."

            // Clear authentication
            commit('setUserToken', null)
            commit('setAuthentication', false)

            // Clear token
            sessionStorage.removeItem('userToken')

            // Check network and set error message if network is inactive
            if (!err.response) {
              errMsg = "There is a network error, Please try again shortly."
            } else {
              // Set error message if user details do not match
              if (err.response.status == 400) {
                errMsg = "Your username or password did not match, please try again."
              }
            }

            reject(errMsg)
          })
        })
      },
      // Logout method
      auth_logout({commit}) {
        return new Promise( (resolve) => {
          if (sessionStorage.getItem('userToken') != null) {
            commit('setUserToken', null)
            commit('setAuthentication', false)
            sessionStorage.clear()
          }
          resolve('Logged out')
        })
      },
      get_user_requests({commit}) { //DEPRECATED
        return new Promise( (resolve,reject) => {
          // Check if user has admin priviledges
          if (store.state.isAdmin) {
            // Format the admin level header for requesting user requests
            const requestAuth = {
              headers: {
                'Authorization': 'Bearer ' + store.state.userDetails.token,
                'Content-Type': 'application/json'
              }
            }

            // Pass headers of admin to retreive user requests
            axios.get(`${process.env.VUE_APP_WEB_SERVER_URL}/v1/users/requests`, requestAuth)
            // Add list of users into the store of user requests
            .then( users => {
              // console.log(users.data)
              commit('setUserRequestList', users.data)
              resolve(users)
            })
            .catch(err => {
              console.error(err)
              reject()
            })
          } else {
            // Show error if access to it fails
            const errMsg = 'Sorry you are not authorised to fetch the data'
            alert(errMsg)
            throw console.error(errMsg)
          }
        })
      },
      get_users({commit}) {
        return new Promise( (resolve,reject) => {
          // Check if user has admin priviledges
          if (store.state.isAdmin) {
            // Format the admin level header for requesting user requests
            const requestAuth = {
              headers: {
                'Authorization': 'Bearer ' + store.state.userDetails.token,
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }

            // Pass headers of admin to rtrieve users
            axios.get(`${process.env.VUE_APP_WEB_SERVER_URL}/v1/users`, requestAuth)
              // Add list of users into the store of users
              .then( users => {
                // console.log(users.data)
                commit('setUserList', users.data)
                resolve(users)
              })
              .catch(err => {
                console.error(err)
                reject()
              })
          } else {
            // Show error if access to it fails
            const errMsg = 'Sorry you are not authorised to fetch the data'
            alert(errMsg)
            throw console.error(errMsg)
          }
        })
      },
      get_user_tokens({commit}) {
        return new Promise( (resolve,reject) => {

            // Format the admin level header for requesting user requests
            const requestAuth = {
              headers: {
                'Authorization': 'Bearer ' + store.state.userDetails.token,
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }

            // Pass headers of admin to rtrieve users
            axios.get(`${process.env.VUE_APP_WEB_SERVER_URL}/v1/users/${store.state.userDetails.user.id}/tokens`, requestAuth)
              // Add list of users into the store of users
              .then( tokens => {
                // console.log(users.data)
                commit('setTokenList', tokens.data)
                resolve(tokens)
              })
              .catch(err => {
                console.error(err)
                reject()
              })
        })
      },
      // eslint-disable-next-line no-unused-vars
      create_token({ commit }, tokenName) {
        return new Promise ((resolve, reject) => {
          const requestAuth = {
            headers: {
              'Authorization': 'Bearer ' + store.state.userDetails.token,
              //'Content-Type': 'application/x-www-form-urlencoded'
            }
          }

          console.log(tokenName)
          //Header post method to authenticate login by passing login details
          axios.post(`${process.env.VUE_APP_WEB_SERVER_URL}/v1/users/${store.state.userDetails.user.id}/tokens`,
            {
              name: tokenName
            },
            requestAuth
          )
            .then( token => {
              resolve(token)
            })
            // Check for request errors
            .catch(err => {
              // Initialise error message if server is having problems
              let errMsg = "Something went wrong! Please try again shortly."

              // Check network and set error message if network is inactive
              if (!err.response) {
                errMsg = "There is a network error, Please try again shortly."
              }
              reject(errMsg)
            })
        })
      },
      // eslint-disable-next-line no-unused-vars
      update_profile({ commit }, formData) {
        return new Promise ((resolve, reject) => {
          const requestAuth = {
            headers: {
              'Authorization': 'Bearer ' + store.state.userDetails.token,
              //'Content-Type': 'application/x-www-form-urlencoded'
            }
          }

          console.log(formData)
          //Header post method to authenticate login by passing login details
          axios.post(`${process.env.VUE_APP_WEB_SERVER_URL}/v1/users/${store.state.userDetails.user.id}/profile`,
            formData,
            requestAuth
          )
            .then( profile => {
              commit('setProfile', profile.data)
              resolve(profile)
            })
            // Check for request errors
            .catch(err => {
              // Initialise error message if server is having problems
              let errMsg = "Something went wrong! Please try again shortly."

              // Check network and set error message if network is inactive
              if (!err.response) {
                errMsg = "There is a network error, Please try again shortly."
              }
              reject(errMsg)
            })
        })
      },
      async get_ipfs_sightings({commit}) {
        try {
            // optional settings for the ipfs instance
            const ipfsOptions = {
              repo: './ipfs',
              EXPERIMENTAL: { pubsub: true },
              preload: { enabled: false },
              config: {
                Addresses: {
                  Swarm: [
                    '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
                    '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
                    '/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/',
                    '/dns4/libp2p-rdv.vps.revolunet.com/tcp/443/wss/p2p-webrtc-star/'
                  ]
                }
              }
            }

            // Create IPFS instance with optional config
            const ipfs = await IPFS.create(ipfsOptions)
            console.log(ipfs)

            // Create OrbitDB instance
            const orbitdb = await OrbitDB.createInstance(ipfs)
            console.log(orbitdb)

            // Connect to the peer id of the backend orbitdb database (NOTE: this will be an env variable)
            await orbitdb._ipfs.swarm.connect('/ip4/127.0.0.1/tcp/4003/ws/p2p/QmWdwcHK2ih8VzP9jacLPKGBdmxzZf1F3Nvo9pqj5Q4QcN')

            // create database
            const db2 = await orbitdb.docs('/orbitdb/zdpuB2kQmxqdBZvCZDxU5SmzxLt9xnDvyjPQnMSuqrrLuYVrQ/ssemmi-api-ingestor')

            // Emit log message when db has synced with another peer
            db2.events.on('replicated', (address) => {
              console.log(`Replicated ${address}`)
              const getData = db2.get('')
              // console.log(getData)
              // Set data from synchronisation into store
              commit('setSightings', getData)
            })

             // Emit a log message upon synchronisation with another peer
             db2.events.on('write', (address, entry) => {
              console.log(`
                ${address} Database to write. \n
                Entry: ${entry}.
              `)
            })

            // Emit a error message upon error handling if something happens during the creation of the IPFS node.
            db2.events.on('error', (error) => {
              console.log(`Database creation error: \n ${error}.`)
            })

            //Load locally persisted db state from memory
            await db2.load()

            console.info(`The location of the database is ${db2.address.toString()}`)

            // Log message upon successful db setup
            console.log("Database setup successful! \n")

        } catch (e) {
            console.log(e)
        }
      },
      get_sightings({commit}) {
        return new Promise( (resolve,reject) => {
          let requestAuth = {}
          let endpoint
          // Check if user has access token
          if (store.state.userDetails.token) {
            endpoint = '/v1/sightings'
            // Format the token into header for requesting sightings requests
            requestAuth.headers = {
              'Authorization': 'Bearer ' + process.env.VUE_APP_MASTER_KEY,
              'Content-Type': 'application/x-www-form-urlencoded'
              }
            } else {
            endpoint = '/v1/sightings/current'
            requestAuth.headers = {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
            }

            // Pass headers of admin to retreive user requests
            axios.get(`${process.env.VUE_APP_WEB_SERVER_URL}${endpoint}`, requestAuth)
            // Add list of users into the store of user requests
            .then( sightings => {
              resolve(sightings.data)
              commit('setSightings', sightings.data)
            })
            .catch(err => {
              console.error(err)
              reject()
            })
        })
      },
    get_data_export() {
      return new Promise( (resolve,reject) => {
        let options = {}
        const endpoint = '/v1/sightings/export'
        // Format the token into header for requesting sightings requests
        options.headers = {
          'Authorization': 'Bearer ' + process.env.VUE_APP_MASTER_KEY,
          'Content-Type': 'application/x-www-form-urlencoded'
        }

        options.responseType = 'blob'

        axios.get(`${process.env.VUE_APP_WEB_SERVER_URL}${endpoint}`, options)
          .then( res => {
            resolve(res)
          })
          .catch(err => {
            console.error(err)
            reject()
          })
      })
    }
    },
    plugins: [vuexPersistedState({
      storage:window.sessionStorage
    })]
  }
)

new Vue({
  render: h => h(App),
  store: store,
  router: router,
  beforeEnter() { this.store.commit('init_store')}
}).$mount('#app')
