import deepFreeze from 'deep-freeze'
import moment from 'moment'
import * as actions from '../app/actions'
import rootReducer from '../app/reducers'
import offlineQueueReducer from '../app/reducers/offlineQueue'
import uiReducer from '../app/reducers/ui'
import userReducer from '../app/reducers/user'
import calendarReducer from '../app/reducers/calendar'
import jobsReducer from '../app/reducers/jobs'
import routesReducer from '../app/reducers/routes'
import metadataReducer from '../app/reducers/metadata'
import { JobStateMap } from '../app/services/constants'

describe('reducers', () => {
  describe('root', () => {
    it('resets state on logout', () => {
      const state = { dummy: 'dummy' }
      const action = actions.logout.resolve()
      const newState = rootReducer(state, action)
      const initialState = rootReducer(undefined, {})
      expect(newState).toEqual(initialState)
      expect(newState).not.toBe(initialState)
    })
  })

  describe('offlineQueue', () => {
    it('initial state', () => {
      expect(offlineQueueReducer(undefined, {})).toEqual([])
    })

    it('queue', () => {
      const queueItem1 = 'queueItem1'
      const queueItem2 = 'queueItem2'
      const action1 = actions.queue(queueItem1)
      const action2 = actions.queue(queueItem2)

      const state1 = offlineQueueReducer(undefined, action1)
      deepFreeze(state1)
      expect(state1).toEqual([queueItem1])
      const state2 = offlineQueueReducer(state1, action2)
      deepFreeze(state2)
      expect(state2).toEqual([queueItem1, queueItem2])
    })

    it('resetQueue', () => {
      const action = actions.resetQueue()
      expect(offlineQueueReducer(['one', 'two', 'three'], action)).toEqual([])
    })
  })

  describe('ui', () => {
    describe('errors', () => {
      it('initial state', () => {
        expect(uiReducer(undefined, {}).errors).toEqual([])
      })

      it('adds an error if action payload is an error', () => {
        const message = 'An error occurred'
        const action = actions.login.reject(new Error(message))
        expect(uiReducer(undefined, action).errors).toEqual([message])
      })

      it('clears all errors on clearErrors action', () => {
        const action = actions.clearErrors()
        expect(uiReducer({ errors: ['An error occurred'] }, action).errors).toEqual([])
      })
    })

    describe('isLoading', () => {
      it('initial state', () => {
        expect(uiReducer(undefined, {}).isLoading).toEqual(true)
      })

      it('updates state on setIsLoading action', () => {
        let payload = false
        let action = actions.setIsLoading(payload)
        expect(uiReducer({ isLoading: true }, action).isLoading).toEqual(payload)

        payload = true
        action = actions.setIsLoading(payload)
        expect(uiReducer({ isLoading: false }, action).isLoading).toEqual(payload)
      })

      it('resets state on batchAddJobs action', () => {
        let action = actions.batchAddJobs()
        expect(uiReducer({ isLoading: true }, action).isLoading).toEqual(false)
      })
    })

    describe('netInfo', () => {
      it('initial state', () => {
        expect(uiReducer(undefined, {}).netInfo).toEqual({ isConnected: false, statusText: null })
      })

      it('online and offline', () => {
        const state1 = uiReducer(undefined, actions.online())
        deepFreeze(state1)
        expect(state1.netInfo).toMatchObject({ isConnected: true })
        const state2 = uiReducer(state1, actions.offline())
        deepFreeze(state2)
        expect(state2.netInfo).toMatchObject({ isConnected: false })
      })
    })

    describe('settings', () => {
      it('sets hideFinished flag on showAll action', () => {
        const action = actions.showAll()
        expect(uiReducer({ settings: { hideFinished: true } }, action)).toMatchObject({
          settings: { hideFinished: false }
        })
      })

      it('unsets hideFinished flag on showPending action', () => {
        const action = actions.showPending()
        expect(uiReducer({ settings: { hideFinished: false } }, action)).toMatchObject({
          settings: { hideFinished: true }
        })
      })
    })
  })

  describe('user', () => {
    it('initial state', () => {
      expect(userReducer(undefined, {})).toEqual({})
    })

    it('sets isLoading flag on login init action', () => {
      const action = actions.login.init()
      expect(userReducer(undefined, action)).toEqual({ isLoading: true })
    })

    it('unsets isLoading flag on login reject action', () => {
      const action = actions.login.reject()
      expect(userReducer(undefined, action)).toEqual({ isLoading: false })
    })

    it('updates state on login resolve action', () => {
      const payload = { userId: 2, applicationId: 3 }
      const action = actions.login.resolve(payload)
      expect(userReducer(undefined, action)).toEqual(Object.assign({}, { isLoading: false, loginContext: payload }))
    })

    it('resets state on logout resolve action', () => {
      const action = actions.logout.resolve()
      expect(userReducer(undefined, action)).toEqual({})
    })
  })

  describe('calendar', () => {
    it('initial state', () => {
      expect(calendarReducer(undefined, {})).toEqual({
        today: null,
        selectedDate: null
      })
    })

    it('sets today on updateToday action', () => {
      const today = moment().startOf('day')
      const action = actions.updateToday()

      const state1 = calendarReducer(undefined, action)
      deepFreeze(state1)
      expect(state1).toEqual({
        today: today,
        selectedDate: null
      })

      const state2 = calendarReducer(state1, action)
      deepFreeze(state2)
      expect(state2).toEqual(state1)
      expect(state2).toBe(state1)
    })

    it('sets selectedDate on selectDate action', () => {
      const tomorrow = moment().startOf('day').add(1, 'd')
      const theDayAfterTomorrow = moment().startOf('day').add(2, 'd')
      const theDayAfterTomorrowAgain = moment().startOf('day').add(2, 'd')
      const action1 = actions.selectDate(tomorrow)
      const action2 = actions.selectDate(theDayAfterTomorrow)
      const action3 = actions.selectDate(theDayAfterTomorrowAgain)

      const state1 = calendarReducer(undefined, action1)
      deepFreeze(state1)
      expect(state1).toEqual({
        today: null,
        selectedDate: tomorrow
      })

      const state2 = calendarReducer(state1, action2)
      deepFreeze(state2)
      expect(state2).toEqual({
        today: null,
        selectedDate: theDayAfterTomorrow
      })

      const state3 = calendarReducer(state2, action3)
      deepFreeze(state3)
      expect(state3).toEqual(state2)
      expect(state3).toBe(state2)
    })
  })

  describe('jobs', () => {
    const transformJob = clientJob => {
      const serverJob = {}
      if (clientJob.id) serverJob.id = clientJob.id
      if (clientJob.title) serverJob.description = clientJob.title
      if (clientJob.description) serverJob.comment = clientJob.description
      if (clientJob.location) serverJob.startLocation = { position: { latitude: clientJob.location.lat, longitude: clientJob.location.lng }, address: clientJob.location.address }
      if (clientJob.date) serverJob.scheduledTime = clientJob.date
      let jobState = -1
      for (let key in JobStateMap) {
        if (JobStateMap[key] === clientJob.status) {
          jobState = JobStateMap[key]
          break
        }
      }
      if (jobState !== -1) serverJob.jobState = jobState
      return serverJob
    }

    it('initial state', () => {
      expect(jobsReducer(undefined, {})).toEqual({
        byId: {},
        byDate: {},
        isLoading: {}
      })
    })

    it('updates byId and byDate on batchAddJobs action', () => {
      const today = moment().startOf('day')
      const job1 = { id: 1, title: 'Job #1', location: { lat: 0, lng: 0, address: 'Address' }, date: today }
      const job2 = { id: 2, title: 'Job #2', date: today }
      const action1 = actions.batchAddJobs([transformJob(job1), transformJob(job2)])

      const state1 = jobsReducer(undefined, action1)
      deepFreeze(state1)
      expect(state1).toMatchObject({
        byId: {
          [job1.id]: Object.assign({}, job1, { hidden: false, new: false }),
          [job2.id]: Object.assign({}, job2, { hidden: false, new: false })
        },
        byDate: {
          [today.format('YYYYMMDD')]: {
            [job1.id]: true,
            [job2.id]: true
          }
        }
      })

      const tomorrow = moment().startOf('day').add(1, 'd')
      const job3 = { id: 3, title: 'Job #3', date: tomorrow }
      const action2 = actions.batchAddJobs([transformJob(job3)])

      const state2 = jobsReducer(state1, action2)
      deepFreeze(state2)
      expect(state2).toMatchObject(Object.assign({}, state1, {
        byId: {
          [job3.id]: Object.assign({}, job3, { hidden: false, new: false })
        },
        byDate: {
          [tomorrow.format('YYYYMMDD')]: {
            [job3.id]: true
          }
        }
      }))
    })

    it('unsets hidden flag on showNewJobs action', () => {
      const today = moment().startOf('day')
      const job1 = { id: 1, title: 'Job #1', date: today, hidden: true, new: true }
      const job2 = { id: 2, title: 'Job #2', date: today, hidden: false, new: false }
      const job3 = { id: 3, title: 'Job #3', date: today, hidden: true, new: true }
      const action = actions.showNewJobs([job1.id, job3.id])

      const state = jobsReducer({
        byId: {
          [job1.id]: job1,
          [job2.id]: job2,
          [job3.id]: job3
        }
      }, action)
      expect(state).toMatchObject({
        byId: {
          [job1.id]: Object.assign({}, job1, { hidden: false }),
          [job2.id]: job2,
          [job3.id]: Object.assign({}, job3, { hidden: false })
        }
      })
    })

    it('unsets new flag on clearNewJobs action', () => {
      const today = moment().startOf('day')
      const job1 = { id: 1, title: 'Job #1', date: today, hidden: false, new: true }
      const job2 = { id: 2, title: 'Job #2', date: today, hidden: false, new: false }
      const job3 = { id: 3, title: 'Job #3', date: today, hidden: false, new: true }
      const action = actions.clearNewJobs([job1.id, job3.id])

      const state = jobsReducer({
        byId: {
          [job1.id]: job1,
          [job2.id]: job2,
          [job3.id]: job3
        }
      }, action)
      expect(state).toMatchObject({
        byId: {
          [job1.id]: Object.assign({}, job1, { new: false }),
          [job2.id]: job2,
          [job3.id]: Object.assign({}, job3, { new: false })
        }
      })
    })

    it('startJob, pauseJob, finishJob, hideJob', () => {
      const today = moment().startOf('day')
      const job1 = { id: 1, title: 'Job #1', description: 'First job', date: today, status: 0, hidden: false }
      const job2 = { id: 2, title: 'Job #2', description: 'Second job', date: today, status: 0, hidden: false }
      const initialState = {
        byId: {
          [job1.id]: job1,
          [job2.id]: job2
        },
        byDate: {
          [today.format('YYYYMMDD')]: [job1.id, job2.id]
        }
      }
      deepFreeze(initialState)
      const action1 = actions.startJob.init(job1.id)
      const action2 = actions.pauseJob.init(job1.id)
      const action3 = actions.finishJob.init({ id: job1.id, description: 'Finished job' })
      const action4 = actions.hideJob(job1.id)

      const state1 = jobsReducer(initialState, action1)
      deepFreeze(state1)
      expect(state1).toMatchObject({
        byId: {
          [job1.id]: Object.assign({}, job1, { status: 1 })
        }
      })

      const state2 = jobsReducer(state1, action2)
      deepFreeze(state2)
      expect(state2).toMatchObject({
        byId: {
          [job1.id]: Object.assign({}, job1, { status: 0 })
        }
      })

      const state3 = jobsReducer(state2, action3)
      deepFreeze(state3)
      expect(state3).toMatchObject({
        byId: {
          [job1.id]: Object.assign({}, job1, { status: 2, description: 'Finished job' })
        }
      })

      const state4 = jobsReducer(state3, action4)
      deepFreeze(state4)
      expect(state4).toMatchObject({
        byId: {
          [job1.id]: Object.assign({}, job1, { status: 2, description: 'Finished job', hidden: true })
        }
      })
    })

    it('does not reset hidden flag on batchAddJobs action', () => {
      const today = moment().startOf('day')
      const job1 = { id: 1, date: today, hidden: true }
      const job2 = { id: 2, date: today, hidden: false }
      const action = actions.batchAddJobs([transformJob(job1), transformJob(job2)])

      const state = jobsReducer({
        byId: {
          [job1.id]: job1,
          [job2.id]: job2
        }
      }, action)
      expect(state).toMatchObject({
        byId: {
          [job1.id]: job1,
          [job2.id]: job2
        }
      })
    })
  })

  describe('routes', () => {
    it('initial state', () => {
      expect(routesReducer(undefined, {})).toEqual({
        byId: {},
        isLoading: {}
      })
    })

    it('updates state on batchAddRoutes action', () => {
      const route1 = { id: 1, name: 'Route #1' }
      const route2 = { id: 2, name: 'Route #2' }
      const action = actions.batchAddRoutes([route1, route2])

      const state = routesReducer(undefined, action)
      expect(state).toMatchObject({
        byId: {
          [route1.id]: route1,
          [route2.id]: route2
        }
      })
    })
  })

  describe('metadata', () => {
    it('initial state', () => {
      expect(metadataReducer(undefined, {})).toEqual({})
    })

    it('adds metadata on batchAddMetadata action', () => {
      const today = moment().startOf('day')
      const metadata1 = { id: '1', dateTime: today }
      const metadata2 = { id: '2', dateTime: today }
      const action = actions.batchAddMetadata([metadata1, metadata2])

      const state = metadataReducer(undefined, action)
      expect(state).toEqual({
        [today.format('YYYYMMDD')]: {
          '1': true,
          '2': true
        }
      })
    })

    it('removes metadata on batchRemoveMetadata action', () => {
      const today = moment().startOf('day')
      const metadata1 = { id: '1', dateTime: today }
      const action = actions.batchRemoveMetadata([metadata1])

      const state = metadataReducer({
        [today.format('YYYYMMDD')]: {
          '1': true,
          '2': true
        }
      }, action)
      expect(state).toEqual({
        [today.format('YYYYMMDD')]: {
          '2': true
        }
      })
    })
  })
})
