import {Response, NextFunction} from 'express'

export type MiddlewareFn = (req: any, res: Response, next: NextFunction) => any
