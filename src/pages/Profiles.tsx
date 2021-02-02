import { useApiContext } from 'ApiContext';
import ProfileSelect from 'components/ProfileSelect/ProfileSelect';
// import ParameterForm from '../components/ParameterForm/ParameterForm';

export default function Profiles() {
  const {
    activeProfile,
    activeProfileIndex,
    editProfile,
    deleteProfile,
    profiles,
  } = useApiContext();

  return (
    <>
      <div className="flex bg-white pb-4 mb-4 border-b -ml-tabl -mr-tabr pr-tabr pl-tabl">
        <ProfileSelect />
        <div className="flex flex-1 items-center justify-end">
          <label>
            Profile Name:
            <input
              type="text"
              onChange={(e) =>
                editProfile(activeProfileIndex, {
                  ...activeProfile,
                  name: e.target.value,
                })
              }
              value={activeProfile.name}
              className="w-60 ml-3 mt-1 rounded-md border-gray-400 shadow-sm focus-within:border-gray-400 focus:ring focus-within:ring-gray-300 focus-within:ring-opacity-50 border overflow-hidden"
            />
          </label>
          <button
            className="rounded-md border-red-700 border bg-red-600 text-white px-3 py-2 shadow-sm focus-within:border-red-700 focus:ring focus-within:ring-red-700 focus-within:ring-opacity-50 focus:outline-none ml-3 disabled:pointer-events-none disabled:opacity-70"
            onClick={() => deleteProfile(activeProfileIndex)}
            disabled={profiles.length <= 1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              width="20"
              height="20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* <ParameterForm key={activeProfileIndex} /> */}
    </>
  );
}
