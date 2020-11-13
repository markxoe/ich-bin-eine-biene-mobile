import React, { useContext } from "react";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
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
  IonToolbar,
} from "@ionic/react";
import { AppContext } from "../store/State";
import { getAdditionalBeePrice, getRotateSpeedLevelPrice, rotateSpeedLevel } from "../globals";
import {
  ActionBieneAddAdditional,
  ActionBieneClickDecrease,
  ActionMakeMeAPresent,
  ActionRotateSpeedLevelIncrease,
} from "../store/Actions";
import { RefresherEventDetail } from '@ionic/core';
import { chevronDownCircleOutline, flashOutline } from "ionicons/icons"

const StorePage: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const additionalBeePrice = getAdditionalBeePrice(state.biene.additionalBienen.length);
  const rotateSpeedLevelPrice = getRotateSpeedLevelPrice(state.biene.rotateSpeedLevel);

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    console.log('Begin async operation');
  
    setTimeout(() => {
      dispatch(ActionMakeMeAPresent());
      event.detail.complete();
    }, 10000);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Store</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" pullMin={400} onIonRefresh={doRefresh}>
          <IonRefresherContent
            pullingIcon={flashOutline}
            pullingText="Hier könnte deine Werbung sein!"
            refreshingSpinner="crescent"
            refreshingText="Ein kleines Geschenk">
          </IonRefresherContent>
        </IonRefresher>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Kontostand</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              Saltos
              <IonText slot="end">{state.biene.clickCounter}</IonText>
            </IonItem>
            <IonItem>
              Drehlevel
              <IonText slot="end">
                {state.biene.rotateSpeedLevel}/{rotateSpeedLevel.max}
              </IonText>
            </IonItem>
            <IonItem>
              Weitere Bienen
              <IonText slot="end">
                {state.biene.additionalBienen.length}/∞
              </IonText>
            </IonItem>
          </IonCardContent>
        </IonCard>

        <IonItemDivider>Drehlevel</IonItemDivider>
        <IonItem>
          <IonButton
            onClick={() => {
              dispatch(ActionRotateSpeedLevelIncrease());
              dispatch(ActionBieneClickDecrease(rotateSpeedLevelPrice));
            }}
            disabled={
              !(state.biene.rotateSpeedLevel < rotateSpeedLevel.max) ||
              state.biene.clickCounter < rotateSpeedLevelPrice
            }
          >
            Level {state.biene.rotateSpeedLevel + 1} Kaufen
          </IonButton>
          <IonText slot="end">Preis: {rotateSpeedLevelPrice}</IonText>
        </IonItem>
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
            }}
            disabled={state.biene.clickCounter < additionalBeePrice}
          >
            Neue Biene kaufen
          </IonButton>
          <IonText slot="end">Preis: {additionalBeePrice}</IonText>
        </IonItem>
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
      </IonContent>
    </IonPage>
  );
};

export default StorePage;
