export interface AppState {
    language: string,
    languages: string[]

    isAuthenticated: boolean;
    profile: Keycloak.KeycloakProfile
}

