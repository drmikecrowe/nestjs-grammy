import debug from 'debug'
const log = debug('nestjs-grammy:response-time.interceptor')

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class ResponseTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now()
    return next.handle().pipe(tap(() => log(`Response time: ${Date.now() - start}ms`)))
  }
}
