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
import { AppContext } from "../store/State";
import { CameraResultType, Plugins } from "@capacitor/core";
import avatar from "../res/avatar.svg";
import { camera, close, trashBin } from "ionicons/icons";
import { generateName } from "../functions/namegenerator";

const PageProfile: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  useEffect(() => {
    uploadData(state);
    // Generate Random Name, if no name given
    if (!state.userName && state.dataLoadedFromMemory)
      dispatch({
        type: "setUserName",
        payload: generateName(),
      });
  }, [state, dispatch]);

  const actionSheesh = () => {
    const el = document.createElement("ion-action-sheet");
    el.buttons = [
      {
        text: "Abbruch",
        role: "cancel",
        icon: close,
      },
      {
        text: "Neues Bild aufnehmen",
        icon: camera,
        handler: () => {
          takePicture();
        },
      },
      {
        text: "Bild löschen",
        role: "destructive",
        icon: trashBin,
        handler: () => {
          dispatch({ type: "setUserImage", payload: "" });
        },
      },
    ];
    document.body.appendChild(el);
    el.present();
  };

  const takePicture = () => {
    Plugins.Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      quality: 40,
      width: 125,
      height: 125,
      preserveAspectRatio: true,
    }).then((r) => {
      console.log(r);
      dispatch({ type: "setUserImage", payload: r.dataUrl });
    });
  };

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Ich bin ein Profil</IonTitle>
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
        <IonItem>
          <IonLabel>Automatischer Benutzername</IonLabel>
          <IonButton
            onClick={() =>
              dispatch({
                type: "setUserName",
                payload: generateName(),
              })
            }
            slot="end">
            Generieren
          </IonButton>
        </IonItem>
        <IonItem>
          Dein Profilbild:
          <IonAvatar onClick={actionSheesh} slot="end">
            <img
              src={state.userImage !== "" ? state.userImage : avatar}
              alt="Profile"
            />
          </IonAvatar>
        </IonItem>
        <IonItem>
          Profilbild ändern
          <IonButton slot="end" onClick={() => actionSheesh()}>
            Ändern
          </IonButton>
        </IonItem>
        <IonItemDivider>Erweitere Infos</IonItemDivider>
        <IonItem>Deine ID: {state.userUUID}</IonItem>
      </IonContent>
    </IonPage>
  );
};

export default PageProfile;
