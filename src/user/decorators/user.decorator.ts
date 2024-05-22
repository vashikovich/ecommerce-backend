import { createParamDecorator } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

export const CurrentUser = createParamDecorator(
  (data: unknown, input: ExecutionContextHost) =>
    input.getArgByIndex(2).req.user,
);
