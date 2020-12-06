import React from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import Home from "./pages/Home";
import PageSettings from "./pages/Settings";
import PageIntro from "./pages/Intro";
import StorePage from "./pages/Store";
import InfosPage from "./pages/Infos";
import InfoPage from "./pages/Info";
import PageProfile from "./pages/Profile";

import Menu from "./Menu";

import { AppContextProvider } from "./store/State";
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import PageLeaderboard from "./pages/Leaderboard";

const App: React.FC = () => (
  <AppContextProvider>
    <IonApp>
      <IonReactRouter>
        <Menu />
        <IonRouterOutlet id="main">
          <Route exact path="/" render={() => <Redirect to="/home" />} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/settings" component={PageSettings} />
          <Route exact path="/intro" component={PageIntro} />
          <Route exact path="/store" component={StorePage} />

          <Route exact path="/infos" component={InfosPage} />
          <Route exact path="/info/:id" component={InfoPage} />
          <Route exact path="/leader" component={PageLeaderboard} />
          <Route exact path="/profile" component={PageProfile} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </AppContextProvider>
);

export default App;
