export interface Entity extends Record<string, any> {
  id: string;
}

export type Device = {
  id: string;
  name: string;
  androidDeviceId: string;
};

export type InstagramProfile = {
  id: string;
  name: string;
  deviceId: string;
  appId: string;
  deviceName?: string;
};

export type BotConfig = {
  id: string;
  name: string;
  instagramProfileId: string;
  parentConfigId: string | null;
  config: any;
};

export type Flow = {
  id: string;
  name: string;
  deviceId: string;
  configIds: string[];
};
