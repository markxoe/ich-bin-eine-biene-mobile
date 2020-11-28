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
  IonContent,
  IonHeader,
  IonItem,
  IonItemDivider,
  IonPage,
  IonProgressBar,
  IonRefresher,
  IonRefresherContent,
  IonText,
  IonTitle,
  IonToast,
  IonToolbar,
  useIonViewDidEnter,
  useIonViewWillEnter,
} from "@ionic/react";
import { AppContext, saveState } from "../store/State";
import {
  calculateLevel,
  getAdditionalBeePrice,
  getAutorotatePrice,
  getMultiplierPrice,
  getRotateSpeedLevelPrice,
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
const Firebase = Plugins.FirebaseAnalytics as FirebaseAnalyticsPlugin;

const StorePage: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const [showThx, setShowThx] = useState<boolean>(false);

  const additionalBeePrice = getAdditionalBeePrice(state);
  const rotateSpeedLevelPrice = getRotateSpeedLevelPrice(state);
  const multiplierLevelPrice = getMultiplierPrice(state);

  const autorotatingPrice = getAutorotatePrice(state);

  useIonViewDidEnter(() => {
    Firebase.setScreenName({ screenName: "store" }).catch();
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
    ];

    _values.forEach((obj) => {
      Firebase.setUserProperty({
        name: obj.name,
        value: obj.value,
      }).catch((err) => {
        console.error(err);
      });
    });
  });

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    console.log("Begin async operation");
    Firebase.logEvent({ name: "StoreGetGift", params: {} }).catch();
    setTimeout(() => {
      dispatch(ActionMakeMeAPresent());
      event.detail.complete();
    }, 100);
  }

  useEffect(() => {
    console.log("state saved");
    saveState(state);
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
            <h1>{state.biene.clickCounter}</h1>
            <IonChip color={calculateLevel(state).levelColor}>
              Level: {calculateLevel(state).levelName}
            </IonChip>
          </IonCardContent>
        </IonCard>

        <IonItemDivider>Drehlevel</IonItemDivider>
        <IonItem>
          <IonButton
            onClick={() => {
              dispatch(ActionRotateSpeedLevelIncrease());
              dispatch(ActionBieneClickDecrease(rotateSpeedLevelPrice));
              setShowThx(true);
              Firebase.logEvent({
                name: "StoreBuyDrehlevel",
                params: { price: rotateSpeedLevelPrice },
              }).catch();
            }}
            disabled={
              !(state.biene.rotateSpeedLevel < rotateSpeedLevel.max) ||
              state.biene.clickCounter < rotateSpeedLevelPrice
            }>
            Level {state.biene.rotateSpeedLevel + 1} Kaufen
          </IonButton>
          <IonText slot="end">Preis: {rotateSpeedLevelPrice}</IonText>
        </IonItem>
        <IonItem>Erhöhen die Drehgeschwindigkeit der Biene</IonItem>
        <IonItem>
          Drehlevel
          <IonText slot="end">
            {state.biene.rotateSpeedLevel}/{rotateSpeedLevel.max}
          </IonText>
        </IonItem>
        <IonItem>
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
        </IonItem>

        <IonItemDivider>Weitere Bienen</IonItemDivider>
        <IonItem>
          <IonButton
            onClick={() => {
              dispatch(ActionBieneAddAdditional());
              dispatch(ActionBieneClickDecrease(additionalBeePrice));
              setShowThx(true);
              Firebase.logEvent({
                name: "StoreBuyAdditionalBee",
                params: { price: additionalBeePrice },
              }).catch();
            }}
            disabled={state.biene.clickCounter < additionalBeePrice}>
            Neue Biene kaufen
          </IonButton>
          <IonText slot="end">Preis: {additionalBeePrice}</IonText>
        </IonItem>
        <IonItem>Geben dir mehr Saltos pro klick</IonItem>
        <IonItem>
          Weitere Bienen
          <IonText slot="end">{state.biene.additionalBienen.length}/∞</IonText>
        </IonItem>

        <IonItem>
          <IonProgressBar
            color={
              state.biene.clickCounter < additionalBeePrice
                ? "danger"
                : "success"
            }
            value={Math.min(state.biene.clickCounter / additionalBeePrice, 1.0)}
          />
        </IonItem>

        <IonItemDivider>Multiplier</IonItemDivider>
        <IonItem>
          <IonButton
            onClick={() => {
              dispatch(ActionMultiplierIncrease());
              dispatch(ActionBieneClickDecrease(multiplierLevelPrice));
              setShowThx(true);
              Firebase.logEvent({
                name: "StoreBuyMultiplier",
                params: { price: multiplierLevelPrice },
              }).catch();
            }}
            disabled={state.biene.clickCounter < multiplierLevelPrice}>
            Multiplier kaufen
          </IonButton>
          <IonText slot="end">Preis: {multiplierLevelPrice}</IonText>
        </IonItem>
        <IonItem>Geben dir mehr Saltos pro Klick</IonItem>
        <IonItem>
          Dein Multiplier
          <IonText slot="end">{state.biene.multiplierLevel}/∞</IonText>
        </IonItem>
        <IonItem>
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
        </IonItem>

        <IonItemDivider>Autodreher</IonItemDivider>
        <IonItem>
          <IonButton
            onClick={() => {
              dispatch(ActionBieneAddAutoRotating(0));
              dispatch(ActionBieneClickDecrease(autorotatingPrice));
              setShowThx(true);
              Firebase.logEvent({
                name: "StoreBuyAutorotater",
                params: { price: autorotatingPrice },
              }).catch();
            }}
            disabled={state.biene.clickCounter < autorotatingPrice}>
            Autodreher kaufen
          </IonButton>
          <IonText slot="end">Preis: {autorotatingPrice}</IonText>
        </IonItem>
        <IonItem>Drehen sich automatisch</IonItem>
        <IonItem>
          Deine Autodreher
          <IonText slot="end">{state.biene.autoRotatingBees.length}/∞</IonText>
        </IonItem>
        <IonItem>
          <IonProgressBar
            color={
              state.biene.clickCounter < autorotatingPrice
                ? "danger"
                : "success"
            }
            value={Math.min(state.biene.clickCounter / autorotatingPrice, 1.0)}
          />
        </IonItem>

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
