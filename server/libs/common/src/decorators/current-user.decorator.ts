import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { jwtPayload } from "src/services/auth/interfaces/jwt-payload.interface";

export const CurrentUser = createParamDecorator((key: keyof jwtPayload, ctx: ExecutionContext): jwtPayload | Partial<jwtPayload> => {
    const request = ctx.switchToHttp().getRequest()
    console.log(request.user);

    return key ? request.user[key] : request.user;
}) 