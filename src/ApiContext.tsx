import { ParamValue } from 'components/Parameter/Parameter';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Profile = {
  name: string;
  params: Record<string, ParamValue>;
};

interface ApiState {
  profiles: Profile[];
  activeProfileIndex: number;
}

interface ApiContextValue extends ApiState {
  activeProfile: Profile;
  loaded: boolean;
  setActiveProfile: (idx: number) => void;
  deleteProfile: (idx: number) => void;
  editProfile: (idx: number, profile: Profile) => void;
}

const defaultProfile = {
  name: 'Default Profile',
  params: {},
};
const defaultState: ApiState = {
  profiles: [defaultProfile],
  activeProfileIndex: 0,
};

const noop = (...args: any[]) => {};

const defaultValue = {
  ...defaultState,
  loaded: false,
  activeProfile: defaultProfile,
  setActiveProfile: noop,
  deleteProfile: noop,
  editProfile: noop,
};

// const mockState: Partial<ApiState> = {
//   profiles: [
//     {
//       name: 'Profile 1',
//     },
//     {
//       name: 'Profile 2',
//     },
//   ],
// };

const Context = createContext<ApiContextValue>(defaultValue);

export function useApiContext() {
  return useContext(Context);
}

export default function ApiContext({ children }: { children: JSX.Element }) {
  const [state, setState] = useState<ApiState>(defaultState);
  const [loaded, setLoaded] = useState(false);

  const setPartialState = useCallback(
    (partial) =>
      setState((state) => ({
        ...state,
        ...partial,
      })),
    [],
  );

  console.log(state);

  // load data from python on mount
  useEffect(() => {
    // mocking delay
    new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
      // reading from local storage for now
      const profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
      const activeProfileIndex = +(localStorage.getItem('activeProfileIndex') || '0');
      setPartialState({
        profiles: profiles && profiles.length ? profiles : defaultState.profiles,
        activeProfileIndex: activeProfileIndex || defaultState.activeProfileIndex,
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
    }
  }, [state, loaded]);

  const contextValue = useMemo(
    () => ({
      ...state,
      activeProfile: state.profiles[state.activeProfileIndex] || defaultProfile,
      loaded,
      setActiveProfile: (idx: number) => setPartialState({ activeProfileIndex: idx }),
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
    [setPartialState, state, loaded],
  );

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}
