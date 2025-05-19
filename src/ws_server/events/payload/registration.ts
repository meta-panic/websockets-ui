export interface RegistrationReq {
  name: string;
  password: string;
}

export interface RegistrationRes {
  name: string,
  index: number | string,
  error: boolean,
  errorText?: string,
}

export function isRegistrationReq(data: unknown): data is RegistrationReq {
  if (typeof data !== "object" || data === null) {
    return false;
  }
  const potentialReq = data;

  if ("name" in potentialReq && "password" in potentialReq) {
    return typeof potentialReq.name === "string" &&
      typeof potentialReq?.password === "string";
  }

  return false;
}
