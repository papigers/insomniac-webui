import { FormEvent, ReactElement, useCallback, useEffect, useState } from 'react';
import { useApiContext } from 'ApiContext';
import { useHistory, useRouteMatch } from 'react-router-dom';
import TextInput from 'components/TextInput/TextInput';
import { Device } from 'types';
import Select from 'components/Select/Select';
import * as yup from 'yup';
import { uid } from 'uid';
import Checkbox from 'components/Checkbox/Checkbox';

const schema = yup.object().shape({
  name: yup.string().required().label('Name'),
  androidDeviceId: yup.string().required().label('Android Device ID'),
  old: yup.bool().default(false).label('Old UIAutomator'),
});

export default function EditDevice(): ReactElement {
  const { devices, androidDeviceIds, addEntity, editEntity } = useApiContext();
  const match = useRouteMatch<{ id: string }>('/devices/:id');
  const id = match?.params?.id;
  const device = (id && id !== 'new' ? devices.find((dev) => dev.id === id) : null) || {
    old: false,
    androidDeviceId: androidDeviceIds[0],
  };
  const [state, setState] = useState<Partial<Device>>(device);
  const isNew = !('id' in state);
  const history = useHistory();
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setState((state) => ({
      ...state,
      androidDeviceId: state.androidDeviceId || androidDeviceIds[0],
    }));
  }, [androidDeviceIds]);

  useEffect(() => {
    schema
      .validate(state)
      .then(() => setIsValid(true))
      .catch((err) => {
        setIsValid(false);
        const firstPathMatch = err.path.match(/^([^[.]+)/);
        const path = firstPathMatch ? firstPathMatch[1] : err.path;
        if (state[path as keyof Device] !== undefined) {
          setErrors(err.errors);
        }
      });
  }, [state]);

  const setAttribute = useCallback((event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setState((state) => ({
      ...state,
      [event.target.name]: value,
    }));
  }, []);

  const onSave = useCallback(
    (e?: FormEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      try {
        schema.validate(state);
        if (isNew) {
          addEntity('devices', {
            ...state,
            id: uid(),
          });
        } else {
          const device = state as Device;
          editEntity('devices', device.id, device);
        }
        history.goBack();
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          setErrors(err.errors);
          setIsValid(false);
        }
      }
    },
    [addEntity, editEntity, history, isNew, state],
  );

  return (
    <div className="relative flex flex-col flex-1 -ml-tabl -mr-tabr overflow-hidden">
      <div className="flex bg-white pb-4 mb-4 border-b pl-tabl pr-tabr items-center">
        <div>
          <button onClick={history.goBack} className="py-1 px-2 -ml-12 mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              stroke="currentColor"
              className="-mb-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
        <h1 className="text-2xl flex-1">Devices - {isNew ? 'Add' : 'Edit'} Device</h1>
        <div>
          <button
            className="rounded-md border-green-600 border bg-green-500 text-white px-3 py-1 my-2 shadow-sm focus-within:border-green-600 focus:ring focus-within:ring-green-600 focus-within:ring-opacity-50 focus:outline-none disabled:pointer-events-none disabled:opacity-70 flex items-center"
            disabled={!isValid}
            onClick={onSave}
          >
            Save
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              width="20"
              height="20"
              fill="currentColor"
              className="inline ml-3"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      <form
        className="-mt-4 flex-1  overflow-y-auto pl-tabl pr-tabr py-10 divide-y-2 divide-gray-100"
        onSubmit={onSave}
      >
        {errors.length && !isValid ? (
          <ul className="pb-4 -mt-4 list-disc list-inside">
            {errors.map((err) => (
              <li className="text-red-500">{err}</li>
            ))}
          </ul>
        ) : null}
        <TextInput
          required
          label="Name"
          value={state.name || ''}
          onChange={setAttribute}
          name="name"
          className="py-4"
        />
        <Select
          required
          label="Android Device ID"
          value={state.androidDeviceId || ''}
          onChange={setAttribute}
          name="androidDeviceId"
          options={androidDeviceIds.map((id) => ({ value: id, label: id }))}
          className="py-4"
        />
        <Checkbox
          label="Old UIAutomator"
          checked={state.old || false}
          onChange={setAttribute}
          name="old"
          className="py-4"
        />
      </form>
    </div>
  );
}
