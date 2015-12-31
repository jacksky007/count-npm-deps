'use strict'

let exec = require('child_process').exec
;(new Promise((resolve, reject) =>
  // find all subdirs named "node_modules"
  exec(`find ${process.argv[2] || '.'} -name node_modules -type d`, (err, stdout, stderr) =>
    resolve(stdout.split('\n'))
  )
)).then(nodeModulesDirs => {
  // ignore empty result
  return Promise.all(nodeModulesDirs.filter(dirs => !!dirs.length).map(dir =>
    new Promise((resolve, reject) => {
      // list one-level subdirs except hidden ones
      const cmd = `find ${dir} -depth 1 -type d ! -iname ".*"`
      exec(cmd, (err, stdout, stderr) => {
        // remove trailing empty new line first
        let pathsStr = stdout.replace(/\n\s*$/, '')
        resolve(pathsStr.split('\n'))
        console.log(pathsStr)
      })
    })
  )).then(depsList => {
    console.log('-'.repeat(30))
    let deps = depsList.reduce(
      (result, deps) => {
        result.push(...deps)
        return result
      },
      []
    )
    let totalDepsCount = deps.length
    console.log(`total deps count: ${totalDepsCount}`)

    let topDeps = deps.filter(
      dep => !/(node_modules).+\1/.test(dep)
    )
    let topDepsCount = topDeps.length
    console.log(`top deps count: ${topDepsCount}`)
  })
})
