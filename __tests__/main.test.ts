import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_PROFILE'] = 'stage'
  process.env['INPUT_MANIFEST-PATH'] = 'commerce/search'
  process.env['INPUT_IMAGE-TAG'] = 'test'
  process.env['INPUT_VERSION'] = 'zezaetest'
  process.env['AUTH_TOKEN'] = ''
  process.env['BASE_URL'] = 'http://127.0.0.1:5000'

  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})
