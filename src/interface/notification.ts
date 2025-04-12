export interface Response {
  success: boolean;
  message: string;
}

export interface SubscriberHMACHHashDataItem {
  subscriberHash: string;
}

export interface SubscriberHMACHashResponse extends Response {
  data: SubscriberHMACHHashDataItem;
}
