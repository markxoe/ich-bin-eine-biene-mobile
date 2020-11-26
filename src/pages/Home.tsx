import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonModal,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  isPlatform,
  useIonViewWillEnter,
} from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import { settingsOutline, storefront } from "ionicons/icons";
import "./Home.css";

import biene from "../res/biene.png";

import { AppContext, saveState } from "../store/State";

import {
  ActionBieneClickIncrease,
  ActionDataLoadedFromMemory,
  ActionSetState,
  ActionStatisticAdd,
} from "../store/Actions";

import { Plugins, Storage, StatusBarStyle } from "@capacitor/core";
import { StoreKeyPrefix } from "../const";
import { useHistory } from "react-router";
import {
  calculateLevel,
  getAdditionalBeePrice,
  getAutorotatePrice,
  getMultiplierPrice,
  rotateSpeedLevel,
} from "../globals";

const { SplashScreen, StatusBar, App } = Plugins;

const Home: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const history = useHistory();
  const [rotation, setRotation] = useState<boolean>(false);
  const [canBuy, setCanBuy] = useState<boolean>(false);
  const [save, refreshSave] = useState<boolean>(false);

  const [openLevels, setOpenLevels] = useState<boolean>(false);

  useIonViewWillEnter(async () => {
    if (isPlatform("capacitor"))
      StatusBar.setStyle({ style: StatusBarStyle.Dark });

    const url = await App.getLaunchUrl().then((url) => url.url);

    console.log(url);
    await Storage.get({ key: StoreKeyPrefix + "introdone" }).then((result) => {
      if (result.value !== "Done" && !(url ?? "").includes("no-intro")) {
        history.push("/intro");
      }
    });
    console.log("Done loading Intro");

    await Storage.get({ key: StoreKeyPrefix + "state" }).then((result) => {
      if (result && result.value) {
        const res = JSON.parse(result.value);
        dispatch(ActionSetState(res));
        console.log(res);
      } else {
        console.log("No State in Memory");
      }
    });
    console.log("Done loading State");

    await SplashScreen.hide();
    console.log("Done hiding Splash screen");

    if (state.biene.clickCounter > state.statisticsRotations) {
      dispatch(
        ActionSetState({
          ...state,
          statisticsRotations: state.biene.clickCounter,
        })
      );
      console.log("Done Updating Statistics");
    }

    // Save, that the State is loaded from Memory, so that it can be overwritten
    dispatch(ActionDataLoadedFromMemory());
  });

  // Refresh the CanBuy alert everytime the state changes
  useEffect(() => {
    setCanBuy(
      state.biene.clickCounter > getAdditionalBeePrice(state) ||
        state.biene.clickCounter > getMultiplierPrice(state)
    );
  }, [state]);

  // Here comes the saving Part:
  // useEfect 1: Refreshes the State "save" every 3 seconds
  useEffect(() => {
    const timer = window.setInterval(() => {
      refreshSave((i) => !i);
    }, 3000);
    return () => {
      window.clearInterval(timer);
    };
  }, []);

  // useEffect 2 refreshes everytime "save" gets refreshed, so that it gets saved only every 3 seconds -> Performance!!!
  useEffect(() => {
    if (state.dataLoadedFromMemory) saveState(state);
  }, [save]);

  return (
    <IonPage>
      <IonHeader translucent>
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
              <IonButton routerLink="/settings" color="primary">
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
                  className={
                    rotation
                      ? rotateSpeedLevel.levels[state.biene.rotateSpeedLevel]
                          .class
                      : "biene"
                  }
                  src={biene}
                  alt="biene"
                  onAnimationEnd={() => {
                    setRotation(false);
                    dispatch(
                      ActionBieneClickIncrease(
                        (1 + state.biene.additionalBienen.length) *
                          (state.biene.multiplierLevel + 1)
                      )
                    );
                    dispatch(ActionStatisticAdd());
                  }}
                />
              </div>
            </IonCol>
            {state.biene.additionalBienen.map(() => (
              <IonCol size="auto">
                <div className="ion-text-center">
                  <img
                    onClick={() => {
                      setRotation(true);
                    }}
                    className={
                      rotation
                        ? rotateSpeedLevel.levels[state.biene.rotateSpeedLevel]
                            .class
                        : "biene"
                    }
                    src={biene}
                    alt="biene"
                  />
                </div>
              </IonCol>
            ))}
            {state.biene.autoRotatingBees.map((a) => (
              <IonCol size="auto">
                <div className="ion-text-center">
                  <img
                    src={biene}
                    alt="biene"
                    className="bieneautorotate"
                    onAnimationIteration={() => {
                      dispatch(
                        ActionBieneClickIncrease(
                          Math.round(
                            (1 + state.biene.additionalBienen.length) *
                              (state.biene.multiplierLevel + 1) *
                              0.5
                          )
                        )
                      );
                      dispatch(ActionStatisticAdd());
                    }}
                  />
                </div>
              </IonCol>
            ))}
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonCol size="auto" class="ion-text-center">
              <IonChip
                hidden={
                  !(
                    state.biene.autoRotatingBees.length !== 0 &&
                    state.settings.newUI
                  )
                }
                color={
                  getAutorotatePrice(state) > state.biene.clickCounter
                    ? "warning"
                    : "success"
                }>
                Autodreher: {state.biene.autoRotatingBees.length}
              </IonChip>
              <IonChip
                hidden={state.biene.multiplierLevel === 0}
                color={
                  getMultiplierPrice(state) > state.biene.clickCounter
                    ? "warning"
                    : "success"
                }>
                Multiplier: x {state.biene.multiplierLevel + 1}
              </IonChip>
              <IonChip
                hidden={
                  !(
                    state.biene.additionalBienen.length !== 0 &&
                    state.settings.newUI
                  )
                }
                color={
                  getAdditionalBeePrice(state) > state.biene.clickCounter
                    ? "warning"
                    : "success"
                }>
                Weitere Bienen: {state.biene.additionalBienen.length}
              </IonChip>
              <IonChip hidden={!state.settings.newUI} color="warning">
                Saltos: {state.biene.clickCounter}
              </IonChip>
              <IonChip
                onClick={() => setOpenLevels(true)}
                color={calculateLevel(state).levelColor}>
                Level: {calculateLevel(state).levelName}
              </IonChip>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol hidden={state.settings.newUI}>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Statistiken</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <h3>
                    Deine Biene hat schon {state.biene.clickCounter} Saltos
                    gemacht
                  </h3>
                  {canBuy ? (
                    <IonChip>Du kannst dir was im Store kaufen</IonChip>
                  ) : (
                    ""
                  )}
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol
              size="12"
              sizeSm="auto"
              hidden={!state.settings.clickButtonForBee}>
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
        {JSON.stringify(state)}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton
            color={canBuy ? "success" : "primary"}
            routerLink="/store">
            <IonIcon icon={storefront} />
          </IonFabButton>
        </IonFab>

        <IonModal
          onDidDismiss={() => setOpenLevels(false)}
          swipeToClose
          isOpen={openLevels}>
          <IonHeader translucent>
            <IonToolbar>
              <IonTitle>Levels</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setOpenLevels(false)}>OK</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
            <IonItem color="primary">Einsteiger</IonItem>
            <IonItem color="secondary">Biene</IonItem>
            <IonItem color="success">Brathahn</IonItem>
            <IonItem color="warning">Bienenmutter</IonItem>
            <IonItem color="danger">Krass</IonItem>
            <IonItem color="darkpink">Krank</IonItem>
            <IonItem color="tertiary">
              Different <span role="img">🥶</span>
            </IonItem>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Home;
