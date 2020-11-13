import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonPage,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import "./Settings.css";

import packagejs from "../../package.json";

import biene from "../res/biene.png";
import { useHistory } from "react-router";
import { AppContext, saveState } from "../store/State";
import { ActionResetState, ActionSettingsSetClickButtonForBee } from "../store/Actions";

const PageSettings: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const [deleteAllAlert, showdeleteAllAlert] = useState<boolean>(false);
  const deleteAlertRef = React.createRef<HTMLIonAlertElement>();
  const history = useHistory();

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
              role: "cancel",
              handler: () => {
                dispatch(ActionResetState());
                showdeleteAllAlert(false);
              },
            },
            {
              text: "Nein",
              role: "cancel",
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
