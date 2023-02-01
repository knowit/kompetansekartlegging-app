import { API, Auth } from 'aws-amplify'

// https://docs.amplify.aws/lib/restapi/getting-started/q/platform/js/

const API_NAME = 'ExpressLambda'

interface ApiResponse<T> {
  message: string
  data: T
}

async function createMyInit() {
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${(await Auth.currentSession())
        .getAccessToken()
        .getJwtToken()}`,
    },
  }
}

type QSParameters = Record<string, string>
type Body = Record<string, any>

export const apiGET = async <T>(
  path: string,
  params?: { queryStringParameters?: QSParameters }
): Promise<ApiResponse<T>> => {
  try {
    const init = await createMyInit()
    return await API.get(API_NAME, `/api${path}`, {
      ...init,
      ...params,
    })
  } catch (error) {
    console.error('error', error)
    throw error
  }
}

export const apiPOST = async <T>(
  path: string,
  params: { body: Body }
): Promise<ApiResponse<T>> => {
  try {
    const init = await createMyInit()
    return await API.post(API_NAME, `/api${path}`, {
      ...init,
      ...params,
    })
  } catch (error) {
    console.error('error', error)
    throw error
  }
}

// TODO: Denne får en CORS-feil
export const apiDELETE = async <T>(
  path: string,
  params: { queryStringParameters: QSParameters }
): Promise<ApiResponse<T>> => {
  try {
    const init = await createMyInit()
    return await API.del(API_NAME, `/api${path}`, {
      ...init,
      ...params,
    })
  } catch (error) {
    console.error('error', error)
    throw error
  }
}

export const apiPATCH = async <T>(
  path: string,
  params?: { body?: Body; queryStringParameters: QSParameters }
): Promise<ApiResponse<T>> => {
  try {
    const init = await createMyInit()
    return await API.patch(API_NAME, `/api${path}`, {
      ...init,
      ...params,
    })
  } catch (error) {
    console.error('error', error)
    throw error
  }
}
