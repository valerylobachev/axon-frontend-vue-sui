import Keycloak from 'keycloak-js';

console.log('Keycloak creating...');

const keycloak: Keycloak.KeycloakInstance = Keycloak('/web-api/keycloak');

console.log('Keycloak created');


export default keycloak;
