import { Express } from 'express'

const setting = 'case sensitive routing'

/**
 * Enable case sensitivity. When enabled, "/Foo" and "/foo" are different
 * routes. When disabled, "/Foo" and "/foo" are treated the same.
 * @param app The Express app to disable the header on.
 */
export const enableCaseSensitiveRouting = (app: Express) => {
  app.enable(setting)
}

/**
 * Disable case sensitivity. When enabled, "/Foo" and "/foo" are different
 * routes. When disabled, "/Foo" and "/foo" are treated the same.
 * @param app The Express app to disable the header on.
 */
export const disableCaseSensitiveRouting = (app: Express) => {
  app.disable(setting)
}
