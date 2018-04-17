import moment from 'moment'
import * as indexSelector from '../app/selectors'
import * as uiSelector from '../app/selectors/ui'
import * as userSelector from '../app/selectors/user'
import * as calendarSelector from '../app/selectors/calendar'
import * as jobsSelector from '../app/selectors/jobs'
import * as routesSelector from '../app/selectors/routes'
import * as metadataSelector from '../app/selectors/metadata'

describe('selectors', () => {
  describe('index', () => {
    describe('getIsLoading', () => {
      it('returns false when data is available', () => {
        const date = moment()
        const jobsByDate = {
          [date.format('YYYYMMDD')]: { 1: true, 2: true, 3: true }
        }
        const metadata = {
          [date.format('YYYYMMDD')]: { 1: true, 2: true, 3: true }
        }
        const result = indexSelector._getIsLoading(jobsByDate, metadata, date)
        expect(result).toEqual(false)
      })

      it('returns true when data is different (after metadata add)', () => {
        const date = moment()
        const jobsByDate = {
          [date.format('YYYYMMDD')]: { 1: true, 2: true }
        }
        const metadata = {
          [date.format('YYYYMMDD')]: { 1: true, 2: true, 3: true }
        }
        const result = indexSelector._getIsLoading(jobsByDate, metadata, date)
        expect(result).toEqual(true)
      })

      it('returns true when data is different (after metadata remove)', () => {
        const date = moment()
        const jobsByDate = {
          [date.format('YYYYMMDD')]: { 1: true, 2: true, 3: true }
        }
        const metadata = {
          [date.format('YYYYMMDD')]: { 1: true, 2: true }
        }
        const result = indexSelector._getIsLoading(jobsByDate, metadata, date)
        expect(result).toEqual(true)
      })

      it('returns true when data is different (after metadata change)', () => {
        const date = moment()
        const jobsByDate = {
          [date.format('YYYYMMDD')]: { 1: true, 2: true, 3: true }
        }
        const metadata = {
          [date.format('YYYYMMDD')]: { 1: true, 2: true, 4: true }
        }
        const result = indexSelector._getIsLoading(jobsByDate, metadata, date)
        expect(result).toEqual(true)
      })

      it('returns true when data is not available', () => {
        const date = moment()
        const jobsByDate = {}
        const metadata = {
          [date.format('YYYYMMDD')]: { 1: true, 2: true, 3: true }
        }
        const result = indexSelector._getIsLoading(jobsByDate, metadata, date)
        expect(result).toEqual(true)
      })

      it('returns false when date is empty', () => {
        const result = indexSelector._getIsLoading({}, {}, undefined)
        expect(result).toEqual(false)
      })

      it('returns false when date has no data', () => {
        const today = moment()
        const tomorrow = moment().add(1, 'd')
        const jobsByDate = {
          [today.format('YYYYMMDD')]: { 1: true, 2: true, 3: true }
        }
        const metadata = {
          [today.format('YYYYMMDD')]: { 1: true, 2: true, 3: true }
        }
        const result = indexSelector._getIsLoading(jobsByDate, metadata, tomorrow)
        expect(result).toEqual(false)
      })
    })

    describe('getItems', () => {
      it('returns an array of job or route items, per day, not hidden, in order', () => {
        const { jobs, jobsByDate, routes } = createData()
        const jobsSettings = { hideFinished: false }
        for (let d = -3; d <= 3; d++) {
          const date = moment().add(d, 'd')
          const items = indexSelector._getItems(jobs, jobsByDate, routes, {}, date, jobsSettings)
          items.forEach((item, index, array) => {
            expect(item.type).toMatch(/job|route/)
            let jobs
            switch (item.type) {
              case 'job':
                jobs = [item]
                break
              case 'route':
                jobs = item.jobs
                break
            }
            jobs.forEach((job, jobIndex, jobArray) => {
              expect(job.date.isSame(date, 'day')).toBeTruthy()
              expect(job.hidden).toEqual(false)
              if (jobIndex > 0) {
                expect(job.scheduledTime.isSameOrAfter(jobArray[jobIndex - 1].scheduledTime)).toBeTruthy()
              }
            })
            if (index > 0) {
              expect(item.orderBy.isSameOrAfter(array[index - 1].orderBy)).toBeTruthy()
            }
          })
        }
      })

      it('returns a filtered array of items when hideFinished setting is true', () => {
        const { jobs, jobsByDate, routes } = createData()
        const jobsSettings = { hideFinished: true }
        for (let d = -3; d <= 3; d++) {
          const date = moment().add(d, 'd')
          const items = indexSelector._getItems(jobs, jobsByDate, routes, {}, date, jobsSettings)
          items.forEach((item, index, array) => {
            expect(item.type).toMatch(/job|route/)
            let jobs
            switch (item.type) {
              case 'job':
                jobs = [item]
                break
              case 'route':
                jobs = item.jobs
                break
            }
            jobs.forEach((job, jobIndex, jobArray) => {
              expect(job.date.isSame(date, 'day')).toBeTruthy()
              expect(job.hidden).toEqual(false)
              expect(job.status).not.toEqual(2)
              if (jobIndex > 0) {
                expect(job.scheduledTime.isSameOrAfter(jobArray[jobIndex - 1].scheduledTime)).toBeTruthy()
              }
            })
            if (index > 0) {
              expect(item.orderBy.isSameOrAfter(array[index - 1].orderBy)).toBeTruthy()
            }
          })
        }
      })

      it('handles missing jobs', () => {
        const { jobsByDate, routes } = createData()
        const jobsSettings = { hideFinished: false }
        for (let d = -3; d <= 3; d++) {
          const date = moment().add(d, 'd')
          const items = indexSelector._getItems({}, jobsByDate, routes, {}, date, jobsSettings)
          expect(items.length).toEqual(0)
        }
      })

      it('handles missing routes', () => {
        const { jobs, jobsByDate } = createData()
        const jobsSettings = { hideFinished: false }
        for (let d = -3; d <= 3; d++) {
          const date = moment().add(d, 'd')
          const items = indexSelector._getItems(jobs, jobsByDate, {}, {}, date, jobsSettings)
          expect(items.filter(item => item.type === 'route').length).toEqual(0)
        }
      })

      it('returns an empty array when date is empty', () => {
        const items = indexSelector._getItems({}, {}, {}, {}, undefined, {})
        expect(items).toEqual([])
      })

      it('returns an empty array when date has no data', () => {
        const date = moment()
        const items = indexSelector._getItems({}, {}, {}, {}, date, {})
        expect(items).toEqual([])
      })
    })

    describe('getJobsToday', () => {
      it('returns an array of jobs', () => {
        const today = moment()
        const tomorrow = moment().add(1, 'd')
        const jobs = {
          1: { id: 1, hidden: false },
          2: { id: 2, hidden: true },
          3: { id: 3, hidden: false }
        }
        const jobsByDate = {
          [today.format('YYYYMMDD')]: { 1: true, 2: true },
          [tomorrow.format('YYYYMMDD')]: { 3: true }
        }
        const result = indexSelector._getJobsToday(jobs, jobsByDate, today)
        expect(result).toEqual([jobs[1]])
      })

      it('returns an empty array when date is empty', () => {
        const result = indexSelector._getJobsToday({}, {}, undefined)
        expect(result).toEqual([])
      })

      it('returns an empty array when date has no data', () => {
        const date = moment()
        const result = indexSelector._getJobsToday({}, {}, date)
        expect(result).toEqual([])
      })
    })

    describe('getNewJobIds', () => {
      it('returns an array of only new jobs (IDs)', () => {
        const today = moment()
        const tomorrow = moment().add(1, 'd')
        const jobs = {
          1: { id: 1, new: false },
          2: { id: 2, new: true },
          3: { id: 3, new: true }
        }
        const jobsByDate = {
          [today.format('YYYYMMDD')]: { 1: true, 2: true },
          [tomorrow.format('YYYYMMDD')]: { 3: true }
        }
        const result = indexSelector._getNewJobIds(jobs, jobsByDate, today)
        expect(result).toEqual([jobs[2].id])
      })

      it('handles missing jobs', () => {
        const today = moment()
        const tomorrow = moment().add(1, 'd')
        const jobs = {}
        const jobsByDate = {
          [today.format('YYYYMMDD')]: { 1: true, 2: true },
          [tomorrow.format('YYYYMMDD')]: { 3: true }
        }
        const result = indexSelector._getNewJobIds(jobs, jobsByDate, today)
        expect(result.length).toEqual(0)
      })

      it('returns an empty array when date is empty', () => {
        const result = indexSelector._getNewJobIds({}, {}, undefined)
        expect(result).toEqual([])
      })

      it('returns an empty array when date has no data', () => {
        const date = moment()
        const result = indexSelector._getNewJobIds({}, {}, date)
        expect(result).toEqual([])
      })
    })

    describe('getEventDates', () => {
      const date1 = moment().add(1, 'd')
      const date2 = moment().add(2, 'd')
      const date3 = moment().add(3, 'd')
      const metadata = {
        [date1.format('YYYYMMDD')]: [1],
        [date2.format('YYYYMMDD')]: [2],
        [date3.format('YYYYMMDD')]: [3]
      }
      const result = indexSelector._getEventDates(metadata)
      expect(result).toEqual([
        date1.format('YYYY-MM-DD'),
        date2.format('YYYY-MM-DD'),
        date3.format('YYYY-MM-DD')
      ])
    })
  })

  describe('ui', () => {
    it('getErrors', () => {
      const state = {
        ui: { errors: ['Error 1', 'Error 2'] }
      }
      const result = uiSelector.getErrors(state)
      expect(result).toEqual(state.ui.errors)
    })

    it('getIsLoading', () => {
      const state = {
        ui: { isLoading: true }
      }
      const result = uiSelector.getIsLoading(state)
      expect(result).toEqual(state.ui.isLoading)
    })

    it('getSettings', () => {
      const state = {
        ui: { settings: { hideFinished: false } }
      }
      const result = uiSelector.getSettings(state)
      expect(result).toEqual(state.ui.settings)
    })
  })

  describe('user', () => {
    it('getIsLoading', () => {
      const state = {
        user: { isLoading: false }
      }
      const result = userSelector.getIsLoading(state)
      expect(result).toEqual(state.user.isLoading)
    })

    it('getUserId', () => {
      const state = {
        user: { loginContext: { userId: 1 } }
      }
      const result = userSelector.getUserId(state)
      expect(result).toEqual(state.user.loginContext.userId)
    })

    it('getIsLoggedIn', () => {
      const state = {
        user: { loginContext: { userId: 1 } }
      }
      const result = userSelector.getIsLoggedIn(state)
      expect(result).toEqual(true)
    })

    describe('getIsLoggedIn', () => {
      it('returns true when userId is set', () => {
        const state = {
          user: { loginContext: { userId: 1 } }
        }
        const result = userSelector.getIsLoggedIn(state)
        expect(result).toEqual(true)
      })

      it('returns false when userId is not set', () => {
        const state = {
          user: {}
        }
        const result = userSelector.getIsLoggedIn(state)
        expect(result).toEqual(false)
      })
    })
  })

  describe('calendar', () => {
    it('getToday', () => {
      const state = {
        calendar: { today: moment() }
      }
      const result = calendarSelector.getToday(state)
      expect(result).toEqual(state.calendar.today)
    })

    it('getSelectedDate', () => {
      const state = {
        calendar: { selectedDate: moment() }
      }
      const result = calendarSelector.getSelectedDate(state)
      expect(result).toEqual(state.calendar.selectedDate)
    })
  })

  describe('jobs', () => {
    it('getAll', () => {
      const state = {
        jobs: {
          byId: {
            1: { id: 1 }
          }
        }
      }
      const result = jobsSelector.getAll(state)
      expect(result).toEqual(state.jobs.byId)
    })

    it('getById', () => {
      const state = {
        jobs: {
          byId: {
            1: { id: 1 },
            2: { id: 2 },
            3: { id: 3 }
          }
        }
      }
      const result = jobsSelector.getById(state, 2)
      expect(result).toEqual(state.jobs.byId[2])
    })

    it('getByDate', () => {
      const today = moment()
      const state = {
        jobs: {
          byDate: {
            [today.format('YYYYMMDD')]: [1]
          }
        }
      }
      const result = jobsSelector.getByDate(state)
      expect(result).toEqual(state.jobs.byDate)
    })
  })

  describe('routes', () => {
    it('getAll', () => {
      const state = {
        routes: {
          byId: {
            1: { id: 1 }
          }
        }
      }
      const result = routesSelector.getAll(state)
      expect(result).toEqual(state.routes.byId)
    })
  })

  describe('metadata', () => {
    it('getAll', () => {
      const today = moment()
      const state = {
        metadata: {
          [today.format('YYYYMMDD')]: [1]
        }
      }
      const result = metadataSelector.getAll(state)
      expect(result).toEqual(state.metadata)
    })
  })
})

const createData = () => {
  const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const numJobs = 30
  const numRoutes = 30
  const db = {
    jobs: [],
    routes: []
  }
  let routeId = 0
  let routeIdCounter = 0
  for (let d = -3; d <= 3; d++) {
    for (let i = 1; i <= numJobs; i++) {
      const id = db.jobs.length + 1
      const date = moment().add(d, 'd').hours(random(0, 23)).minutes(random(0, 59)).seconds(0)
      if (routeId !== null && routeIdCounter % 3 === 0) {
        routeId++
        if (routeId > numRoutes) {
          routeId = null
        }
      }
      routeIdCounter++
      db.jobs.push({
        id: id,
        title: `Job #${id}`,
        description: 'Job...',
        scheduledTime: date,
        date: date,
        status: random(0, 2),
        routeId: routeId,
        hidden: random(1, 10) === 1,
        new: false
      })
    }
  }
  for (let i = 1; i <= numRoutes; i++) {
    db.routes.push({
      id: i,
      name: `Route #${i}`,
      note: 'Route...'
    })
  }

  const jobs = db.jobs.reduce((obj, job) => {
    obj[job.id] = Object.assign({}, job, { hidden: false })
    return obj
  }, {})
  const jobsByDate = db.jobs.reduce((obj, job) => {
    const date = job.date.format('YYYYMMDD')
    if (!obj[date]) {
      obj[date] = {}
    }
    obj[date][job.id] = true
    return obj
  }, {})
  const routes = db.routes.reduce((obj, route) => {
    obj[route.id] = route
    return obj
  }, {})

  return {
    jobs,
    jobsByDate,
    routes
  }
}
