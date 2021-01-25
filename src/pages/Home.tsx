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
  IonMenuButton,
  IonModal,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  isPlatform,
  useIonViewWillEnter,
} from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import { refreshOutline, storefront, bug } from "ionicons/icons";
import "./Home.css";
import packagejs from "../../package.json";
import releaseNotes from "../other/release-notes.json";

import biene from "../res/biene.png";
import { getGoldenBienenArray } from "../res/advancementBees/getbee";

import { AppContext } from "../store/State";

import {
  ActionBieneClickIncrease,
  ActionDataLoadedFromMemory,
  ActionStatisticAdd,
  ActionAddGoldenBiene,
  ActionResetManyThings,
} from "../store/Actions";

import { Plugins, Storage, StatusBarStyle, Capacitor } from "@capacitor/core";
import { StoreKeyPrefix, MAX_VALUE, MAX_ARRAY_LENGTH } from "../other/const";
import { useHistory } from "react-router";
import {
  calculateLevel,
  getAdditionalBeePrice,
  getAutorotatePrice,
  getMultiplierPrice,
  getRotateSpeedLevelPrice,
  renderValue,
  rotateSpeedLevel,
  nameAtHomePositions,
  uploadEvent,
} from "../globals";

import { FirebaseAnalyticsPlugin } from "@capacitor-community/firebase-analytics";
import { KeepAwakePlugin } from "@capacitor-community/keep-awake";
import { v4, validate } from "uuid";
import axios from "axios";
import { APIgetWarning } from "../functions/api";
const Firebase = Plugins.FirebaseAnalytics as FirebaseAnalyticsPlugin;
const KeepAwake = Plugins.KeepAwake as KeepAwakePlugin;

const { SplashScreen, StatusBar, App, PushNotifications } = Plugins;

const Home: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const history = useHistory();
  const [rotation, setRotation] = useState<boolean>(false);
  const [canBuy, setCanBuy] = useState<boolean>(false);

  const [openLevels, setOpenLevels] = useState<boolean>(false);

  const [disabled, setDisabled] = useState<boolean>(false);

  const [warning, setWarning] = useState<boolean | string>(false);

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
          el.duration = 2000;
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

    KeepAwake.keepAwake().catch(() => {});

    const url = await App.getLaunchUrl().then((url) => url.url);

    console.log(url);
    await Storage.get({ key: StoreKeyPrefix + "introdone" }).then((result) => {
      if (result.value !== "Done" && !(url ?? "").includes("no-intro")) {
        history.push("/intro");
      }
    });
    console.log("Done loading Intro");

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
      dispatch({ type: "setUserUUID", payload: _uuid });

      axios
        .get(
          (process.env.react_app_apiurl ??
            "https://api.ichbineinebiene.toastbrot.org") +
            "/api/v1/users2/ban/" +
            _uuid,
          {}
        )
        .then((r) => {
          const result: {
            status: string;
            result?: { _id: string; reason: string };
          } = r.data;
          if (result.status === "ok" && result.result) {
            // User is banned, show Notification
            const el = document.createElement("ion-alert");
            el.backdropDismiss = false;
            el.message =
              "Du wurdest gebannt!<br/>Grund: " +
              result.result.reason +
              "<br/>Du kannst Ich bin eine Biene ab jetzt nicht mehr nutzen.<br/>Ein Fehler? Tschuldigung sagen? Schicke eine E-Mail an" +
              ' <a href="mailto:ban@ichbineinebiene.org">ban@ichbineinebiene.org</a>';
            el.header = "Gebannt!";
            document.body.appendChild(el);
            el.present();
          }
        })
        .catch(() => {});
      APIgetWarning(state).then((r) => {
        setWarning(r);
      });
    });

    await Storage.get({ key: StoreKeyPrefix + "lastKnownVersion" }).then(
      (res) => {
        if (res.value !== packagejs.version) {
          Storage.set({
            key: StoreKeyPrefix + "lastKnownVersion",
            value: packagejs.version,
          });
          const el = document.createElement("ion-alert");
          document.body.appendChild(el);
          el.header = releaseNotes.header;
          el.subHeader = "Versionshinweise";
          el.message = releaseNotes.message;
          el.buttons = [{ text: "OK", role: "cancel" }];
          el.translucent = true;
          el.present();
        }
      }
    );
  });

  // Refresh the CanBuy alert everytime the state changes
  useEffect(() => {
    setCanBuy(
      state.biene.clickCounter > getAdditionalBeePrice(state) ||
        state.biene.clickCounter > getMultiplierPrice(state) ||
        (state.biene.rotateSpeedLevel < rotateSpeedLevel.max &&
          state.biene.clickCounter > getRotateSpeedLevelPrice(state))
    );
    if (
      state.biene.additionalBienen.length > MAX_ARRAY_LENGTH ||
      state.biene.multiplierLevel > MAX_VALUE ||
      state.biene.clickCounter > MAX_VALUE
    ) {
      setDisabled(true);
    }
  }, [state]);

  const reactivatePopup = () => {
    const el = document.createElement("ion-alert");
    el.header = "Goldene Biene";
    el.subHeader = "Verliere alles und bekomme eine Goldene Bienen";
    el.message =
      "Du hast offiziell die Biene durchgespielt.<br/>" +
      "Denn du hast mehr als " +
      MAX_VALUE +
      "Saltos!<br/>" +
      "So geht's weiter: Du verlierst jetzt ALLE Bienen, alle Multiplier und alle Saltos.<br/>" +
      "<b>ABER du bekommst eine goldene Biene!</b><br/>" +
      "Goldene Bienen haben unterschiedliche Farben!<br/>" +
      "Es gibt sowieso keine Alternative";
    el.buttons = [
      { text: "Erstmal Screenshot machen", role: "cancel" },
      { text: "Let's do it!", handler: () => resetAndGoldenBee() },
    ];
    document.body.appendChild(el);
    el.present();
  };
  const resetAndGoldenBee = () => {
    uploadEvent(state, { type: "GoldenBee" });
    dispatch(ActionResetManyThings());
    dispatch(ActionAddGoldenBiene());
    setDisabled(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons collapse slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Ich bin eine Biene</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle id="no-right-padding" size="large">
              Ich bin eine {window.innerWidth < 340 ? "🐝" : "Biene"}
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonGrid>
          <IonRow
            hidden={
              state.settings.nameathomeposition !== nameAtHomePositions.top
            }
            className="ion-justify-content-center">
            <IonCol size="auto">
              <h2 className="ion-text-center">Willkommen, {state.userName}</h2>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            {/* The following displays the First Beiene */}
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
                    if (!disabled) {
                      dispatch(
                        ActionBieneClickIncrease(
                          (1 + state.biene.additionalBienen.length) *
                            (state.biene.multiplierLevel + 1)
                        )
                      );
                      dispatch(ActionStatisticAdd());
                    }
                  }}
                />
              </div>
            </IonCol>
            {/* The follwing part Displays some additionalBienen */}
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
            {/* This part displays the number of the additionalBienen that is not shown */}
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
            {/* This part dispalys the first autorotater */}
            {state.biene.autoRotatingBees.slice(0, 1).map((a) => (
              <IonCol size="auto">
                <div className="ion-text-center">
                  <img
                    src={biene}
                    alt="biene"
                    className="bieneautorotate"
                    onAnimationIteration={() => {
                      if (!disabled) {
                        dispatch(
                          ActionBieneClickIncrease(
                            Math.round(
                              (1 + state.biene.additionalBienen.length) *
                                (state.biene.multiplierLevel + 1) *
                                0.5
                            ) *
                              Math.min(state.biene.autoRotatingBees.length, 10)
                          )
                        );
                        dispatch(ActionStatisticAdd());
                      }
                    }}
                  />
                </div>
              </IonCol>
            ))}
            {/* This part then displays the rest of the autorotaters as a number */}
            <IonCol
              size="auto"
              hidden={state.biene.autoRotatingBees.length <= 1}>
              <IonChip color="warning">
                + {Math.min(state.biene.autoRotatingBees.length - 1, 9)}
              </IonChip>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            {getGoldenBienenArray(state).map((src) => (
              <IonCol size="auto">
                <img src={src} width="54" alt="Goldene Biene" />
              </IonCol>
            ))}
          </IonRow>
          <IonRow className="ion-justify-content-center">
            {/* This part shows the informations */}
            <IonCol size="auto" class="ion-text-center">
              <IonChip
                hidden={
                  !(
                    state.biene.autoRotatingBees.length !== 0 &&
                    state.settings.newUI
                  )
                }
                color={
                  !(
                    getAutorotatePrice(state) < state.biene.clickCounter &&
                    state.biene.autoRotatingBees.length < 10
                  )
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
          <IonRow className="ion-justify-content-center">
            <IonCol size="auto" hidden={state.userName !== ""}>
              <IonChip>Bitte gib deinen Namen unter Menü/Profil an</IonChip>
            </IonCol>
          </IonRow>
          <IonRow
            hidden={
              state.settings.nameathomeposition !== nameAtHomePositions.bottom
            }
            className="ion-justify-content-center">
            <IonCol size="auto">
              <h2 className="ion-text-center">Willkommen, {state.userName}</h2>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center" hidden={!disabled}>
            <IonCol size="auto" className="ion-text-center">
              <p>
                <b>Du bekommst keine Saltos mehr</b>
              </p>
              <IonButton onClick={() => reactivatePopup()} color="danger">
                Reaktivieren
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonItem color="warning" hidden={warning === false}>
          <p>
            {warning}. Schreibe ggf. eine E-Mail an{" "}
            <a href="mailto:ban@ichbineinebiene.org">ban@ichbineinebiene.org</a>
          </p>
        </IonItem>

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

        <IonFab vertical="bottom" horizontal="start" slot="fixed">
          <IonFabButton
            color="light"
            onClick={() => {
              const el = document.createElement("ion-alert");
              el.message =
                "Du hast einen Bug gefunden oder neue Ideen für die Biene?<br/>Her damit!";
              el.header = "Bug oder Idee?";
              el.buttons = [
                { text: "Nö", role: "cancel" },
                {
                  text: "Gönnung",
                  handler: () =>
                    Plugins.Browser.open({
                      url:
                        "https://github.com/markxoe/ich-bin-eine-biene-mobile/issues",
                    }),
                },
              ];
              el.translucent = true;
              document.body.appendChild(el);
              el.present();
            }}>
            <IonIcon icon={bug} />
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
            <IonItem color="success">
              Figgo{" "}
              <span role="img" aria-labelledby="Hans">
                🤚
              </span>
            </IonItem>
            <IonItem color="danger">Toastbrot</IonItem>
            <IonItem color="warning">
              Truck{" "}
              <span role="img" aria-labelledby="Truck">
                🚘
              </span>
            </IonItem>
            <IonItem color="tertiary">
              Different{" "}
              <span role="img" aria-labelledby="Breeze">
                🥶
              </span>
            </IonItem>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Home;
