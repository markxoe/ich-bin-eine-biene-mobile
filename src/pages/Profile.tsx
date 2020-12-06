import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useContext, useEffect } from "react";
import { AppContext, saveState } from "../store/State";

const PageProfile: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  useEffect(() => {
    if (state.dataLoadedFromMemory) saveState(state);
  }, [state]);
  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Dein Profil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonLabel position="stacked">Benutzername</IonLabel>
          <IonInput
            placeholder="Ich bin ein Name"
            value={state.userName}
            onIonChange={(e) => {
              dispatch({
                type: "setUserName",
                payload: e.detail.value ?? "",
              });
            }}
          />
        </IonItem>
        <IonItemDivider>Erweitere Infos</IonItemDivider>
        <IonItem>Deine ID: {state.userUUID}</IonItem>
      </IonContent>
    </IonPage>
  );
};

export default PageProfile;
