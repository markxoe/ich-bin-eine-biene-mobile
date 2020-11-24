import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import React, { useContext, useEffect, useState } from "react";
import "./Settings.css";

import packagejs from "../../package.json";

import biene from "../res/biene.png";
import { useHistory } from "react-router";
import { AppContext, saveState, initialState } from "../store/State";
import {
  ActionResetState,
  ActionSettingsSetClickButtonForBee,
  ActionSettingsSetNewUI,
} from "../store/Actions";

import { Plugins } from "@capacitor/core";
import { flashOutline } from "ionicons/icons";
const { App } = Plugins;
const PageSettings: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const [deleteAllAlert, showdeleteAllAlert] = useState<boolean>(false);
  const [importexportactivated, setImportexportactivated] = useState<boolean>(
    false
  );
  const deleteAlertRef = React.createRef<HTMLIonAlertElement>();
  const history = useHistory();

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    console.log("Begin async operation");

    setTimeout(() => {
      setImportexportactivated(true);
      event.detail.complete();
    }, 1000);
  }

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Einstellungen</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent
            pullingIcon={flashOutline}
            pullingText="Import / Export aktivieren"
            refreshingSpinner="crescent"
            refreshingText="Import / Export aktivieren"
          />
        </IonRefresher>
        <IonItemDivider>Bedienungshilfen</IonItemDivider>
        <IonItem>
          <IonLabel>Separater Knopf</IonLabel>
          <IonToggle
            checked={state.settings.clickButtonForBee}
            onIonChange={(c) =>
              dispatch(ActionSettingsSetClickButtonForBee(c.detail.checked))
            }
          />
        </IonItem>
        <IonItemDivider>Allgemein</IonItemDivider>

        <IonItem>
          <IonLabel>Neues User Interface</IonLabel>
          <IonToggle
            checked={state.settings.newUI}
            onIonChange={(c) =>
              dispatch(ActionSettingsSetNewUI(c.detail.checked))
            }
          />
        </IonItem>
        <IonItem detail onClick={() => history.push("/intro")}>
          <IonLabel>Intro erneut durchführen</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>Alle Daten Löschen</IonLabel>
          <IonButton onClick={() => showdeleteAllAlert(true)}>Alles</IonButton>
        </IonItem>
        <IonItemDivider>Info</IonItemDivider>
        <IonItem>
          <IonLabel>Entwickler</IonLabel>
          Mark Oude Elberink
        </IonItem>
        <IonItem>
          <IonLabel>Version</IonLabel>
          {packagejs.version}
        </IonItem>
        <IonItem>
          <IonLabel>Kontakt</IonLabel>
          <IonButton slot="end" href="mailto:mark@oude-elberink.de">
            E-Mail
          </IonButton>
        </IonItem>
        <IonItem>
          <IonLabel>Website</IonLabel>
          <IonButton href="https://toastbrot.org/">Web</IonButton>
        </IonItem>

        <IonItemGroup hidden={!importexportactivated}>
          <IonItemDivider>Import / Export</IonItemDivider>
        </IonItemGroup>

        <div className="ion-margin-top ion-text-center">
          <img className="bienemini" src={biene} alt="" />
        </div>
        <IonAlert
          ref={deleteAlertRef}
          isOpen={deleteAllAlert}
          message="Wirklich ALLES löschen?"
          buttons={[
            {
              text: "Ja",
              handler: () => {
                dispatch(ActionResetState());
                saveState(initialState);
                App.exitApp();
                showdeleteAllAlert(false);
              },
            },
            {
              text: "Nein",
              handler: () => {
                showdeleteAllAlert(false);
              },
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default PageSettings;
