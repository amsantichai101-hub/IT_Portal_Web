export interface GenerateNewRequest {
  initialData: {
      requester : string;
      unitgroup : string;
      typeOfRequests: typeOfRequests[];
      applicationOrigins: applicationOrigins[];
      applicationTypes: applicationTypes[];
    };
}

export interface typeOfRequests {
  typeOfRequestId : string;
  typeOfRequestName : string;
}

export interface applicationOrigins{
  applicationOriginId : string;
  applicationOriginName : string;
}

export interface applicationTypes{
  applicationTypeId : string;
  applicationTypeName : string;
}