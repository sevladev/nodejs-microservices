export interface ILocationProps {
  country: string;
  zip_code: string;
  state: string;
  city: string;
  neighbourhood: string;
}

export interface IResponseLocationProps {
  r: boolean;
  result: ILocationProps;
}
