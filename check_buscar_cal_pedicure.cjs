const https = require('https')

const N8N = 'santiagon8nmejia.dominadoresia.com'
const WF_ID = 'XAoMeVFKqLw7KcFX'

// Try execution history to find the last run of this workflow
const options = {
  hostname: N8N,
  path: `/api/v1/executions?workflowId=${WF_ID}&limit=5`,
  method: 'GET',
  headers: { 'X-N8N-API-KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NjQ4NWQ2ZC01ZWI4LTQ5ZDUtYTI4NC1jNzY0ZTI2YTZjMWUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzQ3NTI0ODYyfQ.TdKfFkX6YZ3FiAQsLyNyGOIhUm4LCZS6YCnzuaY5dQI' }
}

https.get(options, res => {
  let data = ''
  res.on('data', c => data += c)
  res.on('end', () => {
    const resp = JSON.parse(data)
    console.log(JSON.stringify(resp).substring(0, 500))
  })
})
