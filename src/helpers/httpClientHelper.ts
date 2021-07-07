import https from 'https'

const post = <ResponseType>(
  url: string,
  data: Record<string, unknown>,
  headers?: Record<string, unknown>,
): Promise<ResponseType> => {
  const urlObject = new URL(url)
  const options = {
    hostname: urlObject.hostname,
    path: urlObject.pathname,
    method: 'POST',
    port: 443,
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let rawData = ''
      res.on('data', chunk => { rawData += chunk })
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData)
          resolve(parsedData)
        } catch (e) {
          reject(e)
        }
      })
    })

    req.on('error', e => reject(e))
    req.write(JSON.stringify(data))
    req.end()
  })
}

const get = <ResponseType>(
  url: string,
  headers?: Record<string, unknown>,
): Promise<ResponseType> => {
  const urlObject = new URL(url)
  const options = {
    hostname: urlObject.hostname,
    path: urlObject.search
      ? `${urlObject.pathname}${urlObject.search}`
      : urlObject.pathname,
    method: 'GET',
    port: 443,
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
      ...headers,
    },
    searchParams: urlObject.searchParams,
  }

  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let rawData = ''
      res.on('data', chunk => { rawData += chunk })
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData)
          resolve(parsedData)
        } catch (e) {
          reject(e)
        }
      })
    })

    req.on('error', e => reject(e))
    req.end()
  })
}

export {
  get,
  post,
}
