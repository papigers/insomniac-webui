import { ParamValue } from 'components/Parameter/Parameter';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { BotConfig, Device, Entity, Flow, InstagramProfile } from 'types';

type Profile = {
  name: string;
  params: Record<string, ParamValue>;
};

type EntityKey = 'devices' | 'instagramProfiles' | 'botConfigs' | 'flows';
type EntitiesState = Record<EntityKey, Entity[]>;

interface ApiState extends EntitiesState {
  profiles: Profile[];
  activeProfileIndex: number;
  devices: Device[];
  androidDeviceIds: string[];
  instagramProfiles: InstagramProfile[];
  botConfigs: BotConfig[];
  flows: Flow[];
}

// type EntityAdd<T extends Entity> = (key: EntityKey, payload: T) => void;
// type EntityEdit<T extends Entity> = (key: EntityKey, id: string, payload: T) => void;
// type EntityDelete = (key: EntityKey, id: string) => void;

interface ApiContextValue extends ApiState {
  activeProfile: Profile;
  loaded: boolean;
  setActiveProfile: (idx: number) => void;
  deleteProfile: (idx: number) => void;
  editProfile: (idx: number, profile: Profile) => void;
  addEntity: (key: EntityKey, payload: Entity, index?: number) => void;
  editEntity: (key: EntityKey, id: string, payload: Entity) => void;
  deleteEntity: (key: EntityKey, id: string) => void;
}

const defaultProfile = {
  name: 'Default Profile',
  params: {},
};
const defaultState: ApiState = {
  profiles: [defaultProfile],
  activeProfileIndex: 0,
  devices: [],
  androidDeviceIds: [],
  instagramProfiles: [],
  botConfigs: [],
  flows: [],
};

const noop = (...args: any[]) => {};

const defaultValue = {
  ...defaultState,
  loaded: false,
  activeProfile: defaultProfile,
  setActiveProfile: noop,
  deleteProfile: noop,
  editProfile: noop,
  editEntity: noop,
  addEntity: noop,
  deleteEntity: noop,
};

const Context = createContext<ApiContextValue>(defaultValue);

export function useApiContext() {
  return useContext(Context);
}

export default function ApiContext({ children }: { children: JSX.Element }) {
  const [state, setState] = useState<ApiState>(defaultState);
  const [loaded, setLoaded] = useState(false);

  const enrichedState = useMemo(
    () => ({
      ...state,
      instagramProfiles: state.instagramProfiles.map((igp) => ({
        ...igp,
        deviceName: (state.devices.find((dev) => dev.id === igp.deviceId) || {}).name,
      })),
      botConfigs: state.botConfigs.map((cfg) => {
        const instagramProfile = state.instagramProfiles.find(
          (prf) => prf.id === cfg.instagramProfileId,
        );
        const device = state.devices.find((dev) => dev.id === instagramProfile?.deviceId);
        return {
          ...cfg,
          instagramProfileName: instagramProfile
            ? `${instagramProfile.username} (${instagramProfile.appId})`
            : undefined,
          deviceId: device ? device.id : undefined,
          deviceName: device?.name,
        };
      }),
      flows: state.flows.map((flow) => ({
        ...flow,
        deviceName: (state.devices.find((dev) => dev.id === flow.deviceId) || {}).name,
        configs: flow.configs.map((config) => ({
          ...config,
          configName: (state.botConfigs.find((cfg) => cfg.id === config.configId) || {}).name,
        })),
      })),
    }),
    [state],
  );

  const setPartialState = useCallback(
    (partial) =>
      setState((state) => ({
        ...state,
        ...partial,
      })),
    [],
  );

  // load data from python on mount
  useEffect(() => {
    // mocking delay
    new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
      // reading from local storage for now
      const profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
      const activeProfileIndex = +(localStorage.getItem('activeProfileIndex') || '0');
      const devices = JSON.parse(localStorage.getItem('devices') || '[]');
      const instagramProfiles = JSON.parse(localStorage.getItem('instagramProfiles') || '[]');
      const botConfigs = JSON.parse(localStorage.getItem('botConfigs') || '[]');
      const flows = JSON.parse(localStorage.getItem('flows') || '[]');
      const androidDeviceIds = ['android1', 'android2'];
      setPartialState({
        profiles: profiles && profiles.length ? profiles : defaultState.profiles,
        activeProfileIndex: activeProfileIndex || defaultState.activeProfileIndex,
        devices,
        instagramProfiles,
        androidDeviceIds,
        botConfigs,
        flows,
      });
      setLoaded(true);
    });
  }, [setPartialState]);

  // send updated state to python
  useEffect(() => {
    // do something with pywebview api - for now write to local storage
    if (loaded) {
      localStorage.setItem('profiles', JSON.stringify(state.profiles));
      localStorage.setItem('activeProfileIndex', JSON.stringify(state.activeProfileIndex));
      localStorage.setItem('devices', JSON.stringify(state.devices));
      localStorage.setItem('instagramProfiles', JSON.stringify(state.instagramProfiles));
      localStorage.setItem('botConfigs', JSON.stringify(state.botConfigs));
      localStorage.setItem('flows', JSON.stringify(state.flows));
    }
  }, [state, loaded]);

  const contextValue: ApiContextValue = useMemo(
    () => ({
      ...enrichedState,
      activeProfile: state.profiles[state.activeProfileIndex] || defaultProfile,
      loaded,
      setActiveProfile: (idx: number) => setPartialState({ activeProfileIndex: idx }),
      deleteEntity: (key, id) =>
        setPartialState({
          [key]: (state[key] as Entity[]).filter((entity) => entity.id !== id),
        }),
      editEntity: (key, id, payload) =>
        setPartialState({
          [key]: (state[key] as Entity[]).map((entity) => (entity.id === id ? payload : entity)),
        }),
      addEntity: (key, payload, index?: number) => {
        setPartialState({
          [key]:
            index !== undefined
              ? [...state[key].slice(0, index), payload, ...state[key].slice(index)]
              : [...state[key], payload],
        });
      },
      deleteProfile: (idx: number) =>
        setState((state) => ({
          ...state,
          profiles: [...state.profiles.slice(0, idx), ...state.profiles.slice(idx + 1)],
        })),
      editProfile: (idx: number, profile: Profile) =>
        setState((state) => ({
          ...state,
          profiles: [...state.profiles.slice(0, idx), profile, ...state.profiles.slice(idx + 1)],
        })),
    }),
    [enrichedState, state, loaded, setPartialState],
  );

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}
