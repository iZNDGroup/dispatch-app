// import 'rxjs'

const JSTimers = require('react-native/Libraries/Core/Timers/JSTimers')
global.cancelAnimationFrame = JSTimers.cancelAnimationFrame
global.requestAnimationFrame = JSTimers.requestAnimationFrame
