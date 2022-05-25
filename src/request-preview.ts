import fetch from 'node-fetch'

function getBaseUrl(): string {
  let url = process.env.BASE_URL
  if (!url)
    throw ReferenceError('There is no url defined in the environment variables')
  if (url.endsWith('/')) url = url.slice(0, -1)
  return url
}

function getAuthToken(): string {
  const token = process.env.AUTH_TOKEN
  if (!token)
    throw ReferenceError(
      'There is no token defined in the environment variables'
    )
  return token
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getErrorMsg(obj: any): string {
  return obj.detail || JSON.stringify(obj, null, 2)
}

// eslint-disable-next-line @typescript-eslint/promise-function-async
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function checkPreviewStatus(
  application: string,
  branch: string,
  releaseNameLength: string
): Promise<{
  endpoint: string
  context: string
}> {
  const res = await fetch(
    `${getBaseUrl()}/api/v1/applications/${application}/preview/status/?${new URLSearchParams(
      {
        branch,
        release_name_length: releaseNameLength
      }
    )}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${getAuthToken()}`
      }
    }
  )

  if (res.status === 202) {
    await sleep(1000)
    return await checkPreviewStatus(application, branch, releaseNameLength)
  } else if (res.status !== 200) throw Error(getErrorMsg(await res.json()))

  const resJson = await res.json()
  return {
    endpoint: resJson?.endpoint || '',
    context: JSON.stringify(resJson?.context, null, 2) || ''
  }
}

export async function requestPreview(
  application: string,
  branch: string,
  releaseNameLength: string,
  body: {
    pr_title: string
    pr_url: string
    pr_assignee?: string
    profile: string
    image_tag: string
    base_domain: string
    destination: string
    ingress_host_key?: string
    override_values?: object
  },
  retry_cnt = 0
): Promise<{
  endpoint: string
  context: string
}> {
  if (retry_cnt > 30) throw Error('max retry attempts over!')

  const res = await fetch(
    `${getBaseUrl()}/api/v1/applications/${application}/preview/?${new URLSearchParams(
      {
        branch,
        release_name_length: releaseNameLength
      }
    )}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${getAuthToken()}`
      },
      body: JSON.stringify(body)
    }
  )

  if (res.status !== 200) throw Error(getErrorMsg(await res.json()))

  return checkPreviewStatus(application, branch, releaseNameLength)
}
