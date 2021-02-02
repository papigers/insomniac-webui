import { useApiContext } from 'ApiContext';
import Table, { Column } from 'components/Table/Table';
import { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Flow } from 'types';

const columns: Column<Flow>[] = [
  {
    key: 'name',
    name: 'Name',
    render: (value, idx, item) => <Link to={`/flows/${item.id}`}>{value}</Link>,
  },
];

export default function Flows(): ReactElement {
  const { flows, deleteEntity } = useApiContext();
  return (
    <div className="relative flex flex-col flex-1 -ml-tabl -mr-tabr overflow-hidden">
      <div className="flex bg-white pb-4 mb-4 border-b pl-tabl pr-tabr items-center">
        <h1 className="text-2xl flex-1">Flows - WIP</h1>
        <div>
          <Link to="/flows/new">
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
      <div className="-mt-4 flex-1  overflow-y-auto">
        <Table
          name="Flows"
          columns={columns}
          data={flows}
          onDelete={(item) => deleteEntity('flows', item.id)}
        />
      </div>
    </div>
  );
}
