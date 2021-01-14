import { useApiContext } from 'ApiContext';
import { useCallback } from 'react';

export default function ProfileSelect() {
  const { profiles, activeProfileIndex, setActiveProfile, editProfile } = useApiContext();

  const onChange = useCallback(
    (e) => {
      let value = e.target.value;
      if (value === 'new') {
        const newIndex = profiles.length;
        editProfile(newIndex, {
          name: 'New Profile',
          params: {},
        });
        value = newIndex;
      }
      setActiveProfile(+value);
    },
    [editProfile, profiles.length, setActiveProfile],
  );

  return (
    <div className="relative">
      Select Profile:
      <select
        className="flex-1 w-60 ml-3 mt-1 rounded-md border-gray-400 shadow-sm focus-within:border-gray-400 focus:ring focus-within:ring-gray-300 focus-within:ring-opacity-50 border overflow-hidden"
        value={`${activeProfileIndex}`}
        onChange={onChange}
      >
        {profiles.map((profile, idx) => (
          <option key={idx} value={idx} selected={activeProfileIndex === idx}>
            {profile.name}
          </option>
        ))}
        <option value="new">New Profile +</option>
      </select>
    </div>
  );
}
