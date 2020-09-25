import {OidAuth} from '../types/oid-auth';

// TODO: Should we catch even more the errors or it's ok to display no error and just some stacktrace?

export const loadOidAuth = async (): Promise<OidAuth | undefined> => {
  try {
    // TODO: Do we want to hardcode this? Means we have to spread breaking changes if we move the infrastructue...
    const url: string = `https://europe-west6-project-owlly.cloudfunctions.net/OIDAuthUrl`;

    const response: Response = await fetch(url);

    if (!response || !response.ok) {
      console.error(`Oid authentication response is not valid.`);
      return;
    }

    return response.json();
  } catch (err) {
    console.error(`Oid authentication information cannot be loaded.`);
    return undefined;
  }
};
