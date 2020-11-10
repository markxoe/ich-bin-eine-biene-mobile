import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import { settingsOutline } from "ionicons/icons";
import "./Home.css";

import biene from "../res/biene.png";

import { AppContext, saveState } from "../store/State";

import {
  ActionBieneClickIncrease,
  ActionDataLoadedFromMemory,
  ActionSetState,
} from "../store/Actions";

import { Plugins, Storage } from "@capacitor/core";
import { StoreKeyPrefix } from "../const";
import { useHistory } from "react-router";

const { SplashScreen } = Plugins;

const Home: React.FC = () => {
  const [rotation, setRotation] = useState<boolean>(false);
  const { state, dispatch } = useContext(AppContext);
  const history = useHistory();

  useIonViewWillEnter(async () => {
    await Storage.get({ key: StoreKeyPrefix + "introdone" }).then((result) => {
      if (result.value !== "Done") {
        history.push("/intro");
      }
    });
    console.log("Done loading Intro");

    await Storage.get({ key: StoreKeyPrefix + "state" }).then((result) => {
      if (result && result.value) {
        const res = JSON.parse(result.value);
        dispatch(ActionSetState(res));
      } else {
        console.log("No State in Memory");
      }
    });
    console.log("Done loading State");

    await SplashScreen.hide();
    console.log("Done hiding Splash screen");

    // Save, that the State is loaded from Memory, so that it can be overwritten
    dispatch(ActionDataLoadedFromMemory());
  });

  // Save current State everytime the state changes
  useEffect(() => {
    if (state.dataLoadedFromMemory) saveState(state);
  }, [state]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ich bin eine Biene</IonTitle>
          <IonButtons collapse slot="end">
            <IonButton routerLink="/settings" color="primary">
              <IonIcon icon={settingsOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Ich bin eine Biene</IonTitle>
            <IonButtons slot="end">
              <IonButton color="primary">
                <IonIcon icon={settingsOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonGrid className="ion-margin-top">
          <IonRow className="ion-justify-content-center">
            <IonCol size="auto">
              <div className="ion-text-center">
                <img
                  onClick={() => {
                    setRotation(true);
                  }}
                  className={rotation ? "bienerotate" : "biene"}
                  src={biene}
                  alt=""
                  onAnimationEnd={() => {
                    setRotation(false);
                    dispatch(ActionBieneClickIncrease());
                  }}
                />
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Statistiken</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <h3>
                    Deine Biene hat schon {state.biene.clickCounter} Saltos
                    gemacht
                  </h3>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol
              size="12"
              sizeSm="auto"
              hidden={!state.settings.clickButtonForBee}
            >
              <IonCard>
                <IonCardContent>
                  <IonButton onClick={() => setRotation(true)}>
                    Salto!
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
