import Profiles from '../../pages/Profiles';
import { Switch, Route, Redirect } from 'react-router-dom';
import Page2 from 'pages/Page2';
import RouteLink from 'components/RouteLink/RouteLink';

const tabs = [
  {
    name: 'Page 1',
    href: '/page1',
  },
  {
    name: 'Page 2',
    href: '/page2',
  },
];

export default function Main() {
  return (
    <div className="container w-full p-5 m-5 mx-auto bg-white flex flex-1">
      <nav className="w-80 md:block pb-5 -ml-25 px-5 pl-24 -mt-10 pt-5 border-r md:overflow-y-auto h-full fixed bg-gray-50">
        {tabs.map((tab, idx) => (
          <RouteLink {...tab} key={idx} />
        ))}
      </nav>
      <main className="flex-grow ml-72">
        <Switch>
          <Route exact path="/page1">
            <Profiles />
          </Route>
          <Route exact path="/page2">
            <Page2 />
          </Route>
          <Redirect exact from="/" to="/page1" />
        </Switch>
      </main>
    </div>
  );
}
