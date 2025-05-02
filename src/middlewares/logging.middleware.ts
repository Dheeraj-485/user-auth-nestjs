//

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class loggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(loggingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const start = Date.now();

    res.on('finish', () => {
      const statusCode = res.statusCode;
      const duration = Date.now() - start;
      this.logger.log(
        `${method} ${originalUrl} - Status: ${statusCode} - ${duration}ms`,
      );
    });

    next();
  }
}
