import { Roles } from "./roles";
import { Capabilities, Capability } from "./capabilities";

export function resolveCapabilities(role: string) {
    switch (role) {
        case Roles.ADMIN:
            return Object.values(Capabilities);
        case Roles.CREATOR:
            return [
                Capabilities.LEARN,
                Capabilities.SIMULATE,
                Capabilities.CREATE_CONTENT,
            ];
        default:
            return [
                Capabilities.LEARN,
                Capabilities.SIMULATE,
            ];
    }
}