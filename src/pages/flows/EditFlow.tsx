import { FormEvent, ReactElement, useCallback, useEffect, useState } from 'react';
import { useApiContext } from 'ApiContext';
import { useHistory, useRouteMatch } from 'react-router-dom';
import TextInput from 'components/TextInput/TextInput';
import { Flow } from 'types';
import * as yup from 'yup';
import { uid } from 'uid';

const schema = yup.object().shape({
  name: yup.string().required().label('Name'),
});

export default function EditFlow(): ReactElement {
  const { flows, editEntity, addEntity } = useApiContext();
  const match = useRouteMatch<{ id: string }>('/flows/:id');
  const id = match?.params?.id;
  const flow = (id && id !== 'new' ? flows.find((flow) => flow.id === id) : null) || {};
  const [state, setState] = useState<Partial<Flow>>(flow);
  const isNew = !('id' in state);
  const history = useHistory();
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // useEffect(() => {
  //   setState((state) => ({
  //     ...state,
  //   }));
  // }, [androidDeviceIds]);

  useEffect(() => {
    schema
      .validate(state)
      .then(() => setIsValid(true))
      .catch((err) => {
        setIsValid(false);
        if (state[err.path as keyof Flow] !== undefined) {
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
          addEntity('flows', {
            ...state,
            id: uid(),
          });
        } else {
          const flow = state as Flow;
          editEntity('flows', flow.id, flow);
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
        <h1 className="text-2xl flex-1">Flows - {isNew ? 'Add' : 'Edit'} Flow</h1>
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
        {errors.length ? (
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
      </form>
    </div>
  );
}
