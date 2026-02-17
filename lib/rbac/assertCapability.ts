import { Capabilities, Capability } from "./capabilities";

export function assertCapability(
    capabilities: Capability[],
    required: Capability
) {
    if (!capabilities.includes(required)) {
        throw new Error(`Insufficient capability`);
    }
}