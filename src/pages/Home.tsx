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
  useIonViewDidLeave,
  useIonViewWillEnter,
} from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import { refreshOutline, settingsOutline, storefront } from "ionicons/icons";
import "./Home.css";

import biene from "../res/biene.png";

import { AppContext, saveState } from "../store/State";

import {
  ActionBieneClickIncrease,
  ActionDataLoadedFromMemory,
  ActionSetState,
  ActionStatisticAdd,
} from "../store/Actions";

import { Plugins, Storage, StatusBarStyle, Capacitor } from "@capacitor/core";
import { StoreKeyPrefix } from "../const";
import { useHistory } from "react-router";
import {
  calculateLevel,
  getAdditionalBeePrice,
  getAutorotatePrice,
  getMultiplierPrice,
  renderValue,
  rotateSpeedLevel,
} from "../globals";

import { FirebaseAnalyticsPlugin } from "@capacitor-community/firebase-analytics";
import { v4, validate } from "uuid";
const Firebase = Plugins.FirebaseAnalytics as FirebaseAnalyticsPlugin;

const { SplashScreen, StatusBar, App, PushNotifications } = Plugins;

const Home: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const history = useHistory();
  const [rotation, setRotation] = useState<boolean>(false);
  const [canBuy, setCanBuy] = useState<boolean>(false);
  const [save, refreshSave] = useState<boolean>(false);

  const [openLevels, setOpenLevels] = useState<boolean>(false);

  let saveTimerId: number;

  useIonViewWillEnter(async () => {
    PushNotifications.requestPermission()
      .then((result) => {
        if (result.granted) {
          PushNotifications.register();
        } else {
          const el = document.createElement("ion-toast");
          document.body.appendChild(el);
          el.message =
            "Bitte aktiviere Mitteilungen in den Systemeinstellungen";
          el.duration = 5000;
          el.translucent = true;
          el.present();
        }
      })
      .catch(() => {});
    if (Capacitor.isPluginAvailable("PushNotifications"))
      PushNotifications.addListener("registration", (token) => {
        console.log("Token", token.value);
      });

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

    // Save, that the State is loaded from Memory, so that it can be overwritten
    dispatch(ActionDataLoadedFromMemory());
    await Firebase.setScreenName({ screenName: "home" })
      .then(() => console.log("Set Screen Name to Home"))
      .catch(() => {});

    await Storage.get({ key: "toastbrot.userUUID" }).then((res) => {
      let _uuid: string;
      if (res.value && validate(res.value)) {
        _uuid = res.value;
      } else {
        _uuid = v4();
        Storage.set({ key: "toastbrot.userUUID", value: _uuid });
      }
      Firebase.setUserId({ userId: _uuid }).catch(() => {});
    });

    // Ändert "save" alle 3 Sekunden, das Triggert den Save
    saveTimerId = window.setInterval(() => refreshSave((i) => !i), 3000);
  });

  // Refresh the CanBuy alert everytime the state changes
  useEffect(() => {
    setCanBuy(
      state.biene.clickCounter > getAdditionalBeePrice(state) ||
        state.biene.clickCounter > getMultiplierPrice(state)
    );
  }, [state]);

  // Resettet den Timer für save
  useIonViewDidLeave(() => {
    window.clearInterval(saveTimerId);
  });

  // setInterval von oben refreshed "save" nur alle 3 Sekunden -> Performance!!!
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
            {state.biene.additionalBienen
              .slice(0, state.settingMaxNumberDisplayedBees)
              .map(() => (
                <IonCol size="auto">
                  <div className="ion-text-center">
                    <img
                      onClick={() => {
                        setRotation(true);
                      }}
                      className={
                        rotation
                          ? rotateSpeedLevel.levels[
                              state.biene.rotateSpeedLevel
                            ].class
                          : "biene"
                      }
                      src={biene}
                      alt="biene"
                    />
                  </div>
                </IonCol>
              ))}
            <IonCol
              size="auto"
              hidden={
                state.biene.additionalBienen.length <=
                state.settingMaxNumberDisplayedBees
              }>
              <IonChip color="warning">
                +{" "}
                {state.biene.additionalBienen.length -
                  state.settingMaxNumberDisplayedBees}
              </IonChip>
            </IonCol>
            {state.biene.autoRotatingBees.slice(0, 1).map((a) => (
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
                          ) * state.biene.autoRotatingBees.length
                        )
                      );
                      dispatch(ActionStatisticAdd());
                    }}
                  />
                </div>
              </IonCol>
            ))}
            <IonCol
              size="auto"
              hidden={state.biene.autoRotatingBees.length <= 1}>
              <IonChip color="warning">
                + {state.biene.autoRotatingBees.length - 1}
              </IonChip>
            </IonCol>
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
                Saltos: {renderValue(state.biene.clickCounter)}
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
                    Du hast {renderValue(state.biene.clickCounter)} Saltos
                  </h3>
                  {canBuy ? (
                    <IonChip>Du kannst dir was im Store kaufen</IonChip>
                  ) : (
                    ""
                  )}
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonFab
          hidden={!state.settings.clickButtonForBee}
          vertical="bottom"
          horizontal="center"
          slot="fixed">
          <IonFabButton color="light" onClick={() => setRotation(true)}>
            <IonIcon icon={refreshOutline} />
          </IonFabButton>
        </IonFab>

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
