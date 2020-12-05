import React, { useContext, useEffect, useState } from "react";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonProgressBar,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonTitle,
  IonToast,
  IonToolbar,
  useIonViewDidEnter,
} from "@ionic/react";
import { AppContext, saveState } from "../store/State";
import {
  calculateLevel,
  getAdditionalBeePrice,
  getAutorotatePrice,
  getMultiplierPrice,
  getRotateSpeedLevelPrice,
  renderValue,
  rotateSpeedLevel,
} from "../globals";
import {
  ActionBieneAddAdditional,
  ActionBieneAddAutoRotating,
  ActionBieneClickDecrease,
  ActionMakeMeAPresent,
  ActionMultiplierIncrease,
  ActionRotateSpeedLevelIncrease,
} from "../store/Actions";
import { RefresherEventDetail } from "@ionic/core";
import { flashOutline } from "ionicons/icons";
import { Plugins } from "@capacitor/core";
import { FirebaseAnalyticsPlugin } from "@capacitor-community/firebase-analytics";
import Axios from "axios";
const Firebase = Plugins.FirebaseAnalytics as FirebaseAnalyticsPlugin;

const StorePage: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const [showThx, setShowThx] = useState<boolean>(false);

  const additionalBeePrice = getAdditionalBeePrice(state);
  const rotateSpeedLevelPrice = getRotateSpeedLevelPrice(state);
  const multiplierLevelPrice = getMultiplierPrice(state);

  const autorotatingPrice = getAutorotatePrice(state);

  useIonViewDidEnter(() => {
    Firebase.setScreenName({ screenName: "store" }).catch(() => {});
  });

  useEffect(() => {
    if (state.userUUID && state.dataLoadedFromMemory) {
      const data: {
        userid: string;
        autoRotatingBeeLength: Number;
        additionalBeeLength: Number;
        multiplierLevel: Number;
        userName: string;
        settingNewUI: boolean;
        settingClickingAid: boolean;
      } = {
        userid: state.userUUID,
        autoRotatingBeeLength: state.biene.autoRotatingBees.length,
        additionalBeeLength: state.biene.additionalBienen.length,
        multiplierLevel: state.biene.multiplierLevel,
        userName: state.userName,
        settingClickingAid: state.settings.clickButtonForBee,
        settingNewUI: state.settings.newUI,
      };

      Axios.post(
        (process.env.react_app_apiurl ??
          "https://api.ichbineinebiene.toastbrot.org") +
          "/api/v1/users/update2",
        data,
        { timeout: 500 }
      )
        .then(
          (r) => {},
          (r) => console.error("Error Posting Results")
        )
        .catch(() => {});
    }
  }, [state]);

  useEffect(() => {
    const _values: { name: string; value: string }[] = [
      {
        name: "AdditionalBeeLength",
        value: state.biene.additionalBienen.length.toString(),
      },
      {
        name: "AutoRotatingLength",
        value: state.biene.autoRotatingBees.length.toString(),
      },
      {
        name: "MultiplierLevel",
        value: state.biene.multiplierLevel.toString(),
      },
      {
        name: "RotateSpeedLevel",
        value: state.biene.rotateSpeedLevel.toString(),
      },
      {
        name: "RotationStatistic",
        value: state.statisticsRotations.toString(),
      },
      {
        name: "SettingsNewUI",
        value: state.settings.newUI ? "true" : "false",
      },
      {
        name: "SettingsClickingAid",
        value: state.settings.clickButtonForBee ? "true" : "false",
      },
    ];

    _values.forEach((obj) => {
      Firebase.setUserProperty({
        name: obj.name,
        value: obj.value,
      }).catch((err) => {
        console.error(err);
      });
    });
  }, [state]);

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    console.log("Begin async operation");
    Firebase.logEvent({ name: "StoreGetGift", params: {} }).catch(() => {});
    setTimeout(() => {
      dispatch(ActionMakeMeAPresent());
      event.detail.complete();
    }, 100);
  }

  useEffect(() => {
    console.log("state saved");
    if (state.dataLoadedFromMemory) saveState(state);
  }, [state]);

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Store</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" pullMin={400} onIonRefresh={doRefresh}>
          <IonRefresherContent
            pullingIcon={flashOutline}
            pullingText="Hier könnte deine Werbung sein!"
            refreshingSpinner="crescent"
            refreshingText="Ein kleines Geschenk"
          />
        </IonRefresher>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Kontostand</IonCardTitle>
            <IonCardSubtitle>SALTOS</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <h1>{renderValue(state.biene.clickCounter)}</h1>
            <IonChip color={calculateLevel(state).levelColor}>
              Level: {calculateLevel(state).levelName}
            </IonChip>
          </IonCardContent>
        </IonCard>

        <h1 className="ion-padding">Upgrades</h1>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Drehlevel</IonCardTitle>
            <IonCardSubtitle className="ion-text-uppercase">
              Erhöhen die Drehgeschwindigkeit der Biene
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonButton
                    onClick={() => {
                      dispatch(ActionRotateSpeedLevelIncrease());
                      dispatch(ActionBieneClickDecrease(rotateSpeedLevelPrice));
                      setShowThx(true);
                      Firebase.logEvent({
                        name: "StoreBuyDrehlevel",
                        params: { price: rotateSpeedLevelPrice },
                      }).catch(() => {});
                    }}
                    disabled={
                      !(state.biene.rotateSpeedLevel < rotateSpeedLevel.max) ||
                      state.biene.clickCounter < rotateSpeedLevelPrice
                    }>
                    Level {state.biene.rotateSpeedLevel + 1} Kaufen
                  </IonButton>
                </IonCol>
                <IonCol>
                  <h2>Preis: {renderValue(rotateSpeedLevelPrice)}</h2>
                  <IonProgressBar
                    value={Math.min(
                      state.biene.clickCounter / rotateSpeedLevelPrice,
                      1.0
                    )}
                    color={
                      state.biene.clickCounter < rotateSpeedLevelPrice
                        ? "danger"
                        : "success"
                    }
                  />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <h2>
                    Drehlevel: {state.biene.rotateSpeedLevel}/
                    {rotateSpeedLevel.max}
                  </h2>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Weitere Bienen</IonCardTitle>
            <IonCardSubtitle className="ion-text-uppercase">
              GEBEN dir mehr Saltos
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonButton
                    onClick={() => {
                      dispatch(ActionBieneAddAdditional());
                      dispatch(ActionBieneClickDecrease(additionalBeePrice));
                      setShowThx(true);
                      Firebase.logEvent({
                        name: "StoreBuyAdditionalBee",
                        params: {},
                      }).catch(console.error);
                    }}
                    disabled={state.biene.clickCounter < additionalBeePrice}>
                    Neue Biene kaufen
                  </IonButton>
                </IonCol>
                <IonCol>
                  <h2>Preis: {renderValue(additionalBeePrice)}</h2>
                  <IonProgressBar
                    color={
                      state.biene.clickCounter < additionalBeePrice
                        ? "danger"
                        : "success"
                    }
                    value={Math.min(
                      state.biene.clickCounter / additionalBeePrice,
                      1.0
                    )}
                  />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <h2>Kontostand: {state.biene.additionalBienen.length}/∞</h2>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Multiplier </IonCardTitle>
            <IonCardSubtitle className="ion-text-uppercase">
              Geben dir mehr Saltos pro Klick
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonButton
                    onClick={() => {
                      dispatch(ActionMultiplierIncrease());
                      dispatch(ActionBieneClickDecrease(multiplierLevelPrice));
                      setShowThx(true);
                      Firebase.logEvent({
                        name: "StoreBuyMultiplier",
                        params: {},
                      }).catch(console.error);
                    }}
                    disabled={state.biene.clickCounter < multiplierLevelPrice}>
                    Multiplier kaufen
                  </IonButton>
                </IonCol>
                <IonCol>
                  <h2>Preis: {renderValue(multiplierLevelPrice)}</h2>
                  <IonProgressBar
                    color={
                      state.biene.clickCounter < multiplierLevelPrice
                        ? "danger"
                        : "success"
                    }
                    value={Math.min(
                      state.biene.clickCounter / multiplierLevelPrice,
                      1.0
                    )}
                  />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <h2>Deine Multiplier: {state.biene.multiplierLevel}/∞</h2>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Autodreher </IonCardTitle>
            <IonCardSubtitle className="ion-text-uppercase">
              Drehen sich automatisch
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonButton
                    onClick={() => {
                      dispatch(ActionBieneAddAutoRotating(0));
                      dispatch(ActionBieneClickDecrease(autorotatingPrice));
                      setShowThx(true);
                      Firebase.logEvent({
                        name: "StoreBuyAutorotater",
                        params: { price: autorotatingPrice },
                      }).catch(() => {});
                    }}
                    disabled={state.biene.clickCounter < autorotatingPrice}>
                    Autodreher kaufen
                  </IonButton>
                </IonCol>
                <IonCol>
                  <h2>Preis: {renderValue(autorotatingPrice)}</h2>
                  <IonProgressBar
                    color={
                      state.biene.clickCounter < autorotatingPrice
                        ? "danger"
                        : "success"
                    }
                    value={Math.min(
                      state.biene.clickCounter / autorotatingPrice,
                      1.0
                    )}
                  />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  Deine Autodreher: {state.biene.autoRotatingBees.length}/∞
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        <IonToast
          isOpen={showThx}
          translucent
          message="Danke für den Kauf!"
          buttons={[
            {
              text: "Bitte!",
              role: "cancel",
              handler: () => {
                setShowThx(false);
              },
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default StorePage;
