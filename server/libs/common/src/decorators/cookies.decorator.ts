import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const Cookie = createParamDecorator((key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return key ? request.cookie[key] : request.cookies
})