import {
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
import React, { useContext } from "react";
import "./Settings.css";

import packagejs from "../../package.json";

import biene from "../res/biene.png";
import { useHistory } from "react-router";
import { ActionSettingsSetClickButtonForBee, AppContext } from "../store/State";

const PageSettings: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);

  const history = useHistory();
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
      </IonContent>
    </IonPage>
  );
};

export default PageSettings;
