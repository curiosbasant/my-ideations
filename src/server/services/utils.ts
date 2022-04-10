import { auth } from "@/server/firebase"
import type { DecodedIdToken } from "firebase-admin/auth"
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next"

export function withAuth<T = any>(
  callback: (
    request: NextApiRequest,
    response: NextApiResponse<T>,
    userRef: DecodedIdToken
  ) => void,
  strict?: boolean
): NextApiHandler
export function withAuth<T = any>(
  callback: (request: NextApiRequest, response: NextApiResponse<T>, userRef: null) => void,
  strict: false
): NextApiHandler

export function withAuth(callback, strict = true): NextApiHandler {
  return async (request, response) => {
    try {
      const user = await auth.verifyIdToken(request.cookies.token)
      return callback(request, response, user)
    } catch (error: any) {
      if (strict) {
        response.status(401).json({ error: error.message })
        return
      } else {
        return callback(request, response, null)
      }
    }
  }
}
