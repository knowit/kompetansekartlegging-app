import { Request } from 'express'
import { ParsedQs } from 'qs'
import { Roles } from '../middlewares/roles'

// Denne tar ikke hensyn til norsk tid.
// Kan evt. gjøre new Date(Date.now() + 60 * 60 * 1000).toISO....
export const createTimestampNow = () =>
  new Date()
    .toISOString()
    .replace('T', ' ')
    .replace(/\..+/, '')

/**
 * Returns an object containing the user's sub (userid) and username based on the request object provided.
 * @param {import('express').Request} req - The express request object.
 * @returns {{sub: string | undefined, username: string | undefined}} - An object containing the user's sub and username, both of which are optional.
 */
export const getUserOnRequest = (
  req: any
): { sub: string | undefined; username: string | undefined } => {
  const sub = req.apiGateway.event.requestContext.authorizer?.claims['sub']
  const username =
    req.apiGateway.event.requestContext.authorizer?.claims['username']

  return { sub, username }
}

/**
 * Returns an array of roles for the user based on the request object provided.
 * @param {import('express').Request} req - The express request object.
 * @returns {string[]} - An array of roles for the user, or undefined if the user has no roles.
 */
export const getRoles = (req: Request): string[] =>
  req.apiGateway.event.requestContext.authorizer?.claims['cognito:groups']
    .split(',')
    .map((r: string) => {
      const role = r.split('0')
      if (role.length > 1) {
        return role[1].toLocaleLowerCase()
      } else if (r === 'admin') {
        return Roles.SUPER_ADMIN
      }
    })
    .filter((r: string | undefined) => r !== undefined)

/**
 * Returns the organization for the user based on the request object provided.
 * @param {import('express').Request} req - The express request object.
 * @returns {string} - A string of the organization for the user, or undefined if the user has no organization.
 */
export const getOrganization = <TBody>(
  req: Request<unknown, unknown, TBody, ParsedQs>
): string => {
  const organizations: string[] = []
  req.apiGateway.event.requestContext.authorizer.claims['cognito:groups']
    .split(',')
    .map((o: string) => {
      if (o.includes('0')) {
        const org = o.split('0')
        organizations.push(org[0])
      } else if (o !== 'admin') {
        organizations.push(o)
      }
    })
  return organizations[0]
}
