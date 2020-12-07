import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useContext, useEffect } from "react";
import { uploadData } from "../globals";
import { AppContext, saveState } from "../store/State";
import { CameraResultType, Plugins } from "@capacitor/core";
import avatar from "../res/avatar.svg";

const PageProfile: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  useEffect(() => {
    if (state.dataLoadedFromMemory) saveState(state);
    uploadData(state);
  }, [state]);
  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Dein Profil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonAvatar slot="start">
            <img src={state.userImage !== "" ? state.userImage : avatar} />
          </IonAvatar>
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
        <IonButton
          onClick={() =>
            Plugins.Camera.getPhoto({
              resultType: CameraResultType.DataUrl,
              quality: 10,
            }).then((r) => {
              console.log(r);
              dispatch({ type: "setUserImage", payload: r.dataUrl });
            })
          }>
          Take
        </IonButton>
        <IonButton
          onClick={() => dispatch({ type: "setUserImage", payload: "" })}>
          Foto Löschen
        </IonButton>
        <IonAvatar>
          <img src={state.userImage !== "" ? state.userImage : avatar} />
        </IonAvatar>
      </IonContent>
    </IonPage>
  );
};

export default PageProfile;
