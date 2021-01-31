import { useApiContext } from 'ApiContext';
import { useState, useCallback, useMemo } from 'react';
import Parameter, { ParamValue } from '../Parameter/Parameter';
import Terminal from '../Terminal/Terminal';
import parameters, { categories } from './parameters';

const tabs = categories;

export default function ParameterForm() {
  // const [params, setParams] = useState<Params>({});
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const { activeProfileIndex, activeProfile, editProfile } = useApiContext();

  const params = useMemo(() => activeProfile.params || {}, [activeProfile.params]);

  const onChange = useCallback(
    (name, value) => {
      const newParams = {
        ...params,
        [name]: value,
      } as Record<string, ParamValue>;
      if (!value) {
        delete newParams[name];
      }
      editProfile(activeProfileIndex, {
        ...activeProfile,
        params: newParams,
      });
    },
    [activeProfile, activeProfileIndex, editProfile, params],
  );

  const paramsString = useMemo(() => {
    const strings = Object.keys(params)
      .filter((key) => params[key])
      .map((key) => {
        let val = params[key];
        if (typeof val === 'boolean') {
          return `--${key}`;
        }
        val = `${val}`;
        if (/\s+/g.test(val)) {
          val = `"${val}"`;
        }
        return `--${key} ${val}`;
      });
    return strings.join(' ');
  }, [params]);

  return (
    <>
      <div className="flex border-b border-gray-200 mb-4 bg-white -ml-tabl -mr-tabr pr-tabr pl-tabl">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-6 py-3 border-gray-400 hover:bg-gray-100 outline-none ring-0 focus:ring-0 focus:outline-none border-0 ${
              tab === activeTab ? 'border-b-2 ' : ''
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="-mt-4 flex flex-col flex-1 -ml-tabl -mr-tabr">
        <div className="flex-1 overflow-auto pl-tabl pr-tabr divide-y-2 divide-gray-100">
          {parameters
            .filter((param) => param.category === activeTab)
            .map((param) => (
              <Parameter
                key={param.name}
                {...param}
                onChange={onChange}
                value={params[param.name]}
              />
            ))}
        </div>
        <div className=" bg-white py-6 flex-shrink flex-grow-0 pl-tabl pr-tabr">
          <div className="relative">
            <Terminal terminalClassName="pr-16">{`python insomniac.py ${paramsString}`}</Terminal>
            <div className="absolute inset-y-0 right-4 flex items-center">
              <button className="mt-4 bg-white text-green-500 hover:text-green-600 active:text-green-700 h-10 w-10 rounded-3xl border-0 outline-none ring-0 focus:ring-0 focus:outline-none disabled:opacity-50 disabled:pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
