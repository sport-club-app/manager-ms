type credentials = {
    type: string
    value: any
    temporary: boolean
}

export interface User {
    username: string
    emailVerified: boolean
    firstName: string
    lastName: string
    enabled: boolean
    realmRoles: string[]
    credentials: credentials[]
    groups: string[]
}
