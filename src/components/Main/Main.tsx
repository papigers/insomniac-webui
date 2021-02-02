import { Switch, Route, Redirect } from 'react-router-dom';
import RouteLink from 'components/RouteLink/RouteLink';
import Devices from 'pages/devices/Devices';
import EditDevice from 'pages/devices/EditDevice';
import Spinner from 'components/Spinner/Spinner';
import { useApiContext } from 'ApiContext';
import InstagreamProfiles from 'pages/instagramProfiles/InstagramProfiles';
import EditInstagramProfile from 'pages/instagramProfiles/EditInstagramProfile';
import BotConfigs from 'pages/botConfigs/BotConfigs';
import EditBotConfig from 'pages/botConfigs/EditBotConfig';
import Flows from 'pages/flows/Flows';
import EditFlow from 'pages/flows/EditFlow';

const tabs = [
  {
    name: 'Devices',
    href: '/devices',
    component: Devices,
    singleComponent: EditDevice,
  },
  {
    name: 'Instagram Profiles',
    href: '/instagram-profiles',
    component: InstagreamProfiles,
    singleComponent: EditInstagramProfile,
  },
  {
    name: 'Bot Configs',
    href: '/bot-configs',
    component: BotConfigs,
    singleComponent: EditBotConfig,
  },
  {
    name: 'Flows',
    href: '/flows',
    component: Flows,
    singleComponent: EditFlow,
  },
];

export default function Main() {
  const { loaded } = useApiContext();
  return (
    <div className="w-full bg-white flex flex-1 overflow-hidden">
      <nav className="container w-80 md:block px-5 pl-24 pt-5 border-r md:overflow-y-auto h-full bg-gray-50 flex-shrink-0">
        {tabs.map((tab, idx) => (
          <RouteLink {...tab} key={idx} />
        ))}
      </nav>
      <main className="flex-grow flex flex-col pr-tabr pl-tabl pt-10">
        {loaded ? (
          <Switch>
            {tabs.map((tab, idx) => (
              <Route exact path={tab.href} key={tab.href} component={tab.component} />
            ))}
            {tabs
              .filter((tab) => tab.singleComponent)
              .map((tab, idx) => (
                <Route
                  exact
                  path={`${tab.href}/new`}
                  key={`${tab.href}/new`}
                  component={tab.singleComponent}
                />
              ))}
            {tabs
              .filter((tab) => tab.singleComponent)
              .map((tab, idx) => (
                <Route
                  exact
                  path={`${tab.href}/:id`}
                  key={`${tab.href}/:id`}
                  component={tab.singleComponent}
                />
              ))}
            <Redirect exact from="/" to="/devices" />
          </Switch>
        ) : (
          <div className="flex flex-1 justify-center h-full items-center">
            <Spinner size={32} />
          </div>
        )}
      </main>
    </div>
  );
}
