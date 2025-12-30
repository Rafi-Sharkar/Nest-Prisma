// import { Injectable } from "@nestjs/common";
// import { PassportStrategy } from "@nestjs/passport";
// import { ExtractJwt, Strategy } from "passport-jwt";
// import { ConfigType } from "@nestjs/config";
// import jwtConfig from "../config/jwt.config";
// import { AuthJwtPayload } from "../types/auth-jwtPayload";

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(jwtConfiguration: ConfigType<typeof jwtConfig>) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: jwtConfiguration.secret as string,
//     });
//   }

//   validate(payload: AuthJwtPayload) {
//     return payload;
//   }
// }


