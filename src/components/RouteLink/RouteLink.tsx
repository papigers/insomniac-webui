import { Link, useRouteMatch } from 'react-router-dom';

interface Props {
  href: string;
  name: string;
}

export default function RouteLink({ href, name }: Props) {
  const match = useRouteMatch(href);
  return (
    <Link
      to={href}
      className={`flex px-4 py-2 my-4 text-sm font-semibold text-gray-900 bg-gray-${
        match ? 300 : 200
      } rounded-lg  hover:text-gray-900 focus:text-gray-900 hover:bg-gray-300 focus:bg-gray-300 focus:outline-none focus:shadow-outline`}
    >
      {name}
    </Link>
  );
}
