export type FetchErrorTypeName = 'network' | 'unknown' | 'access' | 'aborted'
export type FetchErrorDetails = { message?: string }

export interface FetchErrorPayload {
    type: FetchErrorTypeName
    details?: FetchErrorDetails
    message: string
}

export class FetchError extends Error implements FetchErrorPayload {
    public type: FetchErrorTypeName
    public details: FetchErrorDetails

    public constructor({ message, type, details = {} }: FetchErrorPayload) {
        super(message)
        this.type = type
        this.details = details
    }
}
