import { JSDOM } from 'jsdom'
import fs from 'fs'

const dom = new JSDOM('<!DOCTYPE html><div id="root"></div>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
  runScripts: 'dangerously',
})

const { window } = dom
global.window = window
global.document = window.document
global.self = window

window.requestAnimationFrame = (cb) => setTimeout(cb, 16)
window.cancelAnimationFrame = (id) => clearTimeout(id)
window.matchMedia = window.matchMedia || (() => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }))

const origError = window.console.error.bind(window.console)
const origWarn = window.console.warn.bind(window.console)
const origLog = window.console.log.bind(window.console)
window.console.error = (...args) => { origError(...args); process.stdout.write('CONSOLE.ERROR: ' + args.map(String).join(' ') + '\n') }
window.console.warn = (...args) => { origWarn(...args); process.stdout.write('CONSOLE.WARN: ' + args.map(String).join(' ') + '\n') }
window.console.log = (...args) => { origLog(...args); process.stdout.write('CONSOLE.LOG: ' + args.map(String).join(' ') + '\n') }

window.onerror = (msg, src, line, col, err) => {
  console.log('WINDOW ONERROR:', msg, err && err.stack)
}
window.addEventListener('error', (e) => {
  console.log('ERROR EVENT:', e.error ? e.error.stack : e.message)
})
window.addEventListener('unhandledrejection', (e) => {
  console.log('UNHANDLED REJECTION:', e.reason && e.reason.stack ? e.reason.stack : e.reason)
})

const script = fs.readFileSync('dist/_expo/static/js/web/index-233d7825ba1a8e7536c06030604a793a.js', 'utf8')
try {
  window.eval(script)
} catch (e) {
  console.log('SYNC THROW:', e.stack)
}

setTimeout(() => {
  console.log('ROOT INNER HTML LENGTH:', document.getElementById('root').innerHTML.length)
  console.log(document.getElementById('root').innerHTML.slice(0, 1000))
  process.exit(0)
}, 4000)
