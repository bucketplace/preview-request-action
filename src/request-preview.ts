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

// eslint-disable-next-line @typescript-eslint/promise-function-async
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function checkPreviewStatus(
  application: string,
  branch: string
): Promise<string> {
  const res = await fetch(
    `${getBaseUrl()}/applications/${application}/preview/status?${new URLSearchParams(
      {
        branch
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
    return await checkPreviewStatus(application, branch)
  } else if (res.status !== 200) throw Error((await res.json())?.message)

  return (await res.json())?.endpoint || ''
}

export async function requestPreview(
  application: string,
  branch: string,
  body: {
    pr_title: string
    pr_url: string
    pr_assignee?: string
    profile: string
    manifest_path: string
    manifest_repo?: string
    image_tag: string
    image_repo?: string
    base_domain: string
    destination: string
    ingress_prefix?: string
    domain_prefix?: string
  },
  retry_cnt = 0
): Promise<string> {
  if (retry_cnt > 30) throw Error('max retry attempts over!')

  const res = await fetch(
    `${getBaseUrl()}/applications/${application}/preview?${new URLSearchParams({
      branch
    })}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${getAuthToken()}`
      },
      body: JSON.stringify(body)
    }
  )

  if (res.status !== 200) throw Error((await res.json())?.message)

  return checkPreviewStatus(application, branch)
}
