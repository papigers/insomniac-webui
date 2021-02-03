import { useApiContext } from 'ApiContext';
import Table, { Column } from 'components/Table/Table';
import { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { BotConfig } from 'types';
import _capitalize from 'lodash/capitalize';
import { uid } from 'uid';

const columns: Column<BotConfig>[] = [
  {
    key: 'name',
    name: 'Name',
    render: (value, idx, item) => <Link to={`/bot-configs/${item.id}`}>{value}</Link>,
  },
  {
    key: 'actionType',
    name: 'Action',
    render: (value) => _capitalize(value as string),
  },
  {
    key: 'instagramProfileId',
    name: 'Instagram Profile',
    render: (value, idx, item) => (
      <Link to={`/instgram-profiles/${value}`}>{item?.instagramProfileName ?? value}</Link>
    ),
  },
  {
    key: 'deviceId',
    name: 'Device',
    render: (value, idx, item) => <Link to={`/devices/${value}`}>{item?.deviceName ?? 'N/A'}</Link>,
  },
];

export default function BotConfigs(): ReactElement {
  const { botConfigs, deleteEntity, addEntity } = useApiContext();
  return (
    <div className="relative flex flex-col flex-1 -ml-tabl -mr-tabr overflow-hidden">
      <div className="flex bg-white pb-4 mb-4 border-b pl-tabl pr-tabr items-center">
        <h1 className="text-2xl flex-1">Bot Configs</h1>
        <div>
          <Link to="/bot-configs/new">
            <button className="rounded-md border-blue-600 border bg-blue-500 text-white px-3 py-1 my-2 shadow-sm focus-within:border-blue-600 focus:ring focus-within:ring-blue-600 focus-within:ring-opacity-50 focus:outline-none disabled:pointer-events-none disabled:opacity-70 flex items-center">
              Add
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                stroke="currentColor"
                className="inline ml-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          </Link>
        </div>
      </div>
      <div className="-mt-4 flex-1 overflow-y-auto">
        <Table
          name="Bot Configs"
          columns={columns}
          data={botConfigs}
          onDelete={(item) => deleteEntity('botConfigs', item.id)}
          extraActions={[
            {
              color: 'gray',
              onClick: (item, index) =>
                addEntity(
                  'botConfigs',
                  {
                    ...item,
                    id: uid(),
                    name: `${item.name} Copy`,
                  },
                  index + 1,
                ),
              children: (
                <>
                  Copy
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="inline ml-1"
                    width="16"
                    height="16"
                  >
                    <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                    <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                  </svg>
                </>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
