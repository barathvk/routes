const verbs = [
  'GET',
  'POST',
  'PUT',
  'DELETE'
]
class Parser {
  parse(url, data) {
    if (!url) throw new Error('An input is required in the form {METHOD} {URL}')
    const p = {
      query: {}
    }
    const regex = new RegExp(`^(${verbs.join('|')}) ((.*?)(\\?(.*))?)$`, 'gi') // Input must be of the pattern {VERB} {PATH}[(optional)?{QUERY}]
    const matches = regex.exec(url, 'gi')
    if (!matches) {
      const methodRegex = new RegExp(`^${verbs.join('|')}`, 'gi')
      const rmatches = methodRegex.exec(url)
      const error = rmatches ? 'The input URL is invalid' : 'A valid HTTP method is expected before the URL'
      throw new Error(error)
    }
    p.method = matches[1].toUpperCase() //HTTP verb
    p.url = matches[2] //Full URL
    p.path = matches[3] //Full path
    p.qs = matches[5] //Full query string
    p.params = p.path.split('/').filter(pp => pp !== '') //Path params
    if (p.qs)
      p.qs.split('&').map(q => {
        p.query[q.split('=')[0]] = q.split('=')[1] //Build query params
      })
    if (data && p.method !== 'GET') {// Data only makes sense if the HTTP verb is not GET
      if (typeof data === 'string') // Check if data needs to be parsed
        try {
          const d = JSON.parse(data) // Check if the data passed in is JSON
          p.data = d
          p.contentType = 'application/json'
        } catch (ex) { //If data is not JSON, it is plain text
          p.data = data
          p.contentType = 'text/plain'
        }
      else if (typeof data === 'object') {// Set the data as the passed in object if it is already an object
        p.data = data
        p.contentType = 'application/json'
      }
    } else if (data && p.method === 'GET')
      throw new Error('GET method does not allow data to be passed')
    return p
  }
}
module.exports = Parser
