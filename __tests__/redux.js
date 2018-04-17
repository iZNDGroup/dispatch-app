import { defaultAction, createAction, createReducer, createOptimisticAction, createOptimisticReducer } from '../app/util/redux'

describe('redux', () => {
  describe('createAction', () => {
    it('creates an action object with type, payload and meta', () => {
      const action = createAction('Action')
      const payload = { id: 1, name: 'Data #1' }
      const meta = { key: 'value' }
      expect(action.type).toEqual('Action')
      expect(action.toString()).toEqual('Action')
      expect(action(payload, meta)).toEqual({
        type: 'Action',
        payload: payload,
        meta: meta
      })
    })

    it('creates an action object with error flag when payload is of type Error', () => {
      const action = createAction('Action')
      const error = new Error('Error')
      expect(action(error)).toEqual({
        type: 'Action',
        payload: error,
        error: true
      })
    })

    it('transforms payload when payloadFn is specified', () => {
      const payloadFn = payload => ({ id: payload, name: `Data #${payload}` })
      const action = createAction('Action', payloadFn)
      const payload = 1
      expect(action(payload)).toEqual({
        type: 'Action',
        payload: { id: 1, name: 'Data #1' }
      })
    })

    it('does not transform payload when payload is of type Error, even if payloadFn is specified', () => {
      const payloadFn = jest.fn()
      const action = createAction('Action', payloadFn)
      const error = new Error('Error')
      expect(action(error)).toEqual({
        type: 'Action',
        payload: error,
        error: true
      })
      expect(payloadFn).not.toHaveBeenCalled()
    })

    it('does not add payload if undefined...', () => {
      const action = createAction('Action')
      expect(action()).toEqual({
        type: 'Action'
      })
    })

    it('adds payload for "falsy" values other than undefined', () => {
      const action = createAction('Action')
      const payload = false
      expect(action(payload)).toEqual({
        type: 'Action',
        payload: payload
      })
    })
  })

  describe('createReducer', () => {
    it('handles actions with matching handlers', () => {
      const initialState = false
      const handlers = {
        'handlerTrue': () => true,
        'handlerFalse': () => false
      }
      const reducer = createReducer(initialState, handlers)
      const state1 = reducer(undefined, {})
      expect(state1).toEqual(false)
      const state2 = reducer(state1, { type: 'handlerTrue' })
      expect(state2).toEqual(true)
      const state3 = reducer(state2, {})
      expect(state3).toEqual(true)
      const state4 = reducer(state3, { type: 'handlerFalse' })
      expect(state4).toEqual(false)
      const state5 = reducer(state4, {})
      expect(state5).toEqual(false)
    })

    it('handles all actions if a default handler is specified', () => {
      const initialState = false
      const handlers = {
        'handlerTrue': () => true,
        'handlerFalse': () => false,
        [defaultAction]: () => null
      }
      const reducer = createReducer(initialState, handlers)
      const state1 = reducer(undefined, {})
      expect(state1).toEqual(null)
      const state2 = reducer(state1, { type: 'handlerTrue' })
      expect(state2).toEqual(true)
      const state3 = reducer(state2, {})
      expect(state3).toEqual(null)
      const state4 = reducer(state3, { type: 'handlerFalse' })
      expect(state4).toEqual(false)
      const state5 = reducer(state4, {})
      expect(state5).toEqual(null)
    })
  })

  describe('createOptimisticAction', () => {
    it('creates init, resolve and reject actions', () => {
      const action = createOptimisticAction('Action')
      const payload = [1, 2]
      const meta = { key: 'value' }
      const error = new Error('Error')
      expect(action.init.type).toEqual('Action/init')
      expect(action.resolve.type).toEqual('Action/resolve')
      expect(action.reject.type).toEqual('Action/reject')
      expect(action.init(payload)).toEqual({
        type: 'Action/init',
        payload: payload
      })
      expect(action.resolve(payload, meta)).toEqual({
        type: 'Action/resolve',
        payload: payload,
        meta: meta
      })
      expect(action.reject(error)).toEqual({
        type: 'Action/reject',
        payload: error,
        error: true
      })
    })
  })

  describe('createOptimisticReducer', () => {
    it('ignores "skipOptimistic" actions', () => {
      const initialState = false
      const handlers = {
        'handlerTrue': () => true
      }
      const reducer = createOptimisticReducer(initialState, handlers)
      const state1 = reducer(undefined, {})
      expect(state1).toEqual(false)
      const state2 = reducer(state1, { type: 'handlerTrue', meta: { skipOptimistic: true } })
      expect(state2).toEqual(false)
      const state3 = reducer(state2, {})
      expect(state3).toEqual(false)
      const state4 = reducer(state3, { type: 'handlerTrue' })
      expect(state4).toEqual(true)
      const state5 = reducer(state4, {})
      expect(state5).toEqual(true)
    })
  })
})
