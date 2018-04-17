import { array, collection, object } from '../app/util/immutable'

describe('immutable', () => {
  describe('array', () => {
    it('add returns a new array with the added item', () => {
      const arr1 = [1, 2, 3]
      const arr2 = array.add(arr1, 4)
      expect(arr2).toEqual([1, 2, 3, 4])
      expect(arr2).not.toBe(arr1)
    })

    it('add handles undefined array', () => {
      const arr = array.add(undefined, 1)
      expect(arr).toEqual([1])
    })

    it('replace returns a new array with the replaced item', () => {
      const arr1 = [1, 2, 3]
      const arr2 = array.replace(arr1, item => item === 2, 4)
      expect(arr2).toEqual([1, 4, 3])
      expect(arr2).not.toBe(arr1)
    })

    it('replace returns the same array if the item is not found', () => {
      const arr1 = [1, 2, 3]
      const arr2 = array.replace(arr1, item => item === 4, 4)
      expect(arr2).toEqual(arr1)
      expect(arr2).toBe(arr1)
    })

    it('replace returns a new array with the new item added if addIfNotExist is specified', () => {
      const arr1 = [1, 2, 3]
      const arr2 = array.replace(arr1, item => item === 4, 4, true)
      expect(arr2).toEqual([1, 2, 3, 4])
      expect(arr2).not.toBe(arr1)
    })

    it('remove returns a new array with the specified item removed', () => {
      const arr1 = [1, 2, 3]
      const arr2 = array.remove(arr1, item => item === 2)
      expect(arr2).toEqual([1, 3])
      expect(arr2).not.toBe(arr1)
    })

    it('remove returns the same array if the item is not found', () => {
      const arr1 = [1, 2, 3]
      const arr2 = array.remove(arr1, item => item === 4)
      expect(arr2).toEqual(arr1)
      expect(arr2).toBe(arr1)
    })
  })

  describe('collection', () => {
    it('getIn', () => {
      const obj = {
        id: 1,
        name: 'Data #1',
        subObj: {
          subId: 1,
          subName: 'Sub-data #1'
        }
      }
      const value1 = collection.getIn(obj, ['subObj', 'subName'])
      expect(value1).toEqual(obj.subObj.subName)
      const value2 = collection.getIn(obj, ['nonExistant'])
      expect(value2).toEqual(undefined)
    })

    it('setIn returns a new object with the specified key updated at the specified path', () => {
      const obj1 = {
        id: 1,
        name: 'Data #1',
        subObj: {
          subId: 1,
          subName: 'Sub-data #1'
        }
      }
      const obj2 = collection.setIn(obj1, ['subObj', 'subId'], 2)
      expect(obj2).toEqual({
        id: 1,
        name: 'Data #1',
        subObj: {
          subId: 2,
          subName: 'Sub-data #1'
        }
      })
      expect(obj2).not.toBe(obj1)
    })

    it('mergeIn returns a new object with the specified keys replaced at the specified path', () => {
      const obj1 = {
        id: 1,
        name: 'Data #1',
        subObj: {
          subId: 1,
          subName: 'Sub-data #1'
        }
      }
      const obj2 = collection.mergeIn(obj1, ['subObj'], { subId: 2 })
      expect(obj2).toEqual({
        id: 1,
        name: 'Data #1',
        subObj: {
          subId: 2,
          subName: 'Sub-data #1'
        }
      })
      expect(obj2).not.toBe(obj1)
    })

    it('mergeIn returns a new object with the specified keys replaced at the specified path, even if it does not exist', () => {
      const obj1 = {
        id: 1,
        name: 'Data #1',
        subObj: {
          subId: 1,
          subName: 'Sub-data #1'
        }
      }
      const obj2 = collection.mergeIn(obj1, ['newSubObj'], {
        subId: 2,
        subName: 'New sub-data'
      })
      expect(obj2).toEqual({
        id: 1,
        name: 'Data #1',
        subObj: {
          subId: 1,
          subName: 'Sub-data #1'
        },
        newSubObj: {
          subId: 2,
          subName: 'New sub-data'
        }
      })
      expect(obj2).not.toBe(obj1)
    })
  })

  describe('object', () => {
    it('set returns a new object with the specified key updated', () => {
      const obj1 = {
        id: 1,
        name: 'Data #1',
        subObj: {
          subId: 1,
          subName: 'Sub-data #1'
        }
      }
      const obj2 = object.set(obj1, 'id', 2)
      expect(obj2).toEqual({
        id: 2,
        name: 'Data #1',
        subObj: {
          subId: 1,
          subName: 'Sub-data #1'
        }
      })
      expect(obj2).not.toBe(obj1)
    })

    it('merge returns a new object with the specified keys replaced', () => {
      const obj1 = {
        id: 1,
        name: 'Data #1',
        subObj: {
          subId: 1,
          subName: 'Sub-data #1'
        }
      }
      const obj2 = object.merge(obj1, { id: 2 })
      expect(obj2).toEqual({
        id: 2,
        name: 'Data #1',
        subObj: {
          subId: 1,
          subName: 'Sub-data #1'
        }
      })
      expect(obj2).not.toBe(obj1)
    })

    it('remove returns a new object with the specified key removed', () => {
      const obj1 = {
        id: 1,
        name: 'Data #1',
        subObj: {
          subId: 1,
          subName: 'Sub-data #1'
        }
      }
      const obj2 = object.remove(obj1, 'subObj')
      expect(obj2).toEqual({
        id: 1,
        name: 'Data #1'
      })
      expect(obj2).not.toBe(obj1)
    })

    it('remove returns the same object if the key is not found', () => {
      const obj1 = {
        id: 1,
        name: 'Data #1',
        subObj: {
          subId: 1,
          subName: 'Sub-data #1'
        }
      }
      const obj2 = object.remove(obj1, 'nonExistant')
      expect(obj2).toEqual(obj1)
      expect(obj2).toBe(obj1)
    })
  })
})
