import { isUrl, cleanUrl } from '../app/util/url'

describe('url', () => {
  it('isUrl', () => {
    expect(isUrl('http://192.168.1.1')).toBeTruthy()
    expect(isUrl('https://192.168.1.1')).toBeTruthy()
    expect(isUrl('https://192.168.1.1/')).toBeTruthy()
    expect(isUrl('http://www.gpsgate.com')).toBeTruthy()
    expect(isUrl('http://gpsgate.com')).toBeTruthy()
    expect(isUrl('https://gpsgate.com')).toBeTruthy()
    expect(isUrl('https://gpsgate.com/')).toBeTruthy()

    expect(isUrl('https://192.168.1.1/gpsgateserver')).toBeTruthy()
    expect(isUrl('https://192.168.1.1/gpsgateserver/')).toBeTruthy()
    expect(isUrl('https://gpsgate.com/gpsgateserver')).toBeTruthy()
    expect(isUrl('https://gpsgate.com/gpsgateserver/')).toBeTruthy()

    expect(isUrl('https://192.168.1.1/ggs')).toBeTruthy()
    expect(isUrl('https://192.168.1.1/ggs/')).toBeTruthy()
    expect(isUrl('https://gpsgate.com/ggs')).toBeTruthy()
    expect(isUrl('https://gpsgate.com/ggs/')).toBeTruthy()

    expect(isUrl('192.168.1.1')).toBeFalsy()
    expect(isUrl('192.168.1.1/')).toBeFalsy()
    expect(isUrl('www.gpsgate.com')).toBeFalsy()
    expect(isUrl('gpsgate.com')).toBeFalsy()
    expect(isUrl('gpsgate.com/')).toBeFalsy()

    expect(isUrl('192.168.1.1/gpsgateserver')).toBeFalsy()
    expect(isUrl('192.168.1.1/gpsgateserver/')).toBeFalsy()
    expect(isUrl('gpsgate.com/gpsgateserver')).toBeFalsy()
    expect(isUrl('gpsgate.com/gpsgateserver/')).toBeFalsy()

    expect(isUrl('192.168.1.1/ggs')).toBeFalsy()
    expect(isUrl('192.168.1.1/ggs/')).toBeFalsy()
    expect(isUrl('gpsgate.com/ggs')).toBeFalsy()
    expect(isUrl('gpsgate.com/ggs/')).toBeFalsy()

    expect(isUrl('https://gpsgate.com/GpsGateServer/')).toBeTruthy()
    expect(isUrl('https://gpsgate.com/GGS/')).toBeTruthy()
  })

  it('cleanUrl', () => {
    expect(cleanUrl('http://192.168.1.1')).toEqual('http://192.168.1.1')
    expect(cleanUrl('https://192.168.1.1')).toEqual('https://192.168.1.1')
    expect(cleanUrl('https://192.168.1.1/')).toEqual('https://192.168.1.1/')
    expect(cleanUrl('http://www.gpsgate.com')).toEqual('http://www.gpsgate.com')
    expect(cleanUrl('http://gpsgate.com')).toEqual('http://gpsgate.com')
    expect(cleanUrl('https://gpsgate.com')).toEqual('https://gpsgate.com')
    expect(cleanUrl('https://gpsgate.com/')).toEqual('https://gpsgate.com/')

    expect(cleanUrl('https://192.168.1.1/gpsgateserver')).toEqual('https://192.168.1.1')
    expect(cleanUrl('https://192.168.1.1/gpsgateserver/')).toEqual('https://192.168.1.1')
    expect(cleanUrl('https://gpsgate.com/gpsgateserver')).toEqual('https://gpsgate.com')
    expect(cleanUrl('https://gpsgate.com/gpsgateserver/')).toEqual('https://gpsgate.com')

    expect(cleanUrl('https://192.168.1.1/ggs')).toEqual('https://192.168.1.1')
    expect(cleanUrl('https://192.168.1.1/ggs/')).toEqual('https://192.168.1.1')
    expect(cleanUrl('https://gpsgate.com/ggs')).toEqual('https://gpsgate.com')
    expect(cleanUrl('https://gpsgate.com/ggs/')).toEqual('https://gpsgate.com')

    expect(cleanUrl('https://gpsgate.com/GpsGateServer/')).toEqual('https://gpsgate.com')
    expect(cleanUrl('https://gpsgate.com/GGS/')).toEqual('https://gpsgate.com')
  })
})
