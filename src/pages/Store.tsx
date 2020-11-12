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
  IonLabel,
  IonPage,
  IonProgressBar,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { AppContext, saveState } from "../store/State";
import { additionalBeePrice, rotateSpeedLevel } from "../globals";
import {
  ActionBieneAddAdditional,
  ActionBieneClickDecrease,
  ActionBieneClickIncrease,
  ActionRotateSpeedLevelIncrease,
} from "../store/Actions";
import { micOutline } from "ionicons/icons";

const StorePage: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
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
              dispatch(ActionBieneClickDecrease(rotateSpeedLevel.price));
            }}
            disabled={
              !(state.biene.rotateSpeedLevel < rotateSpeedLevel.max) ||
              state.biene.clickCounter < rotateSpeedLevel.price
            }
          >
            Level {state.biene.rotateSpeedLevel + 1} Kaufen
          </IonButton>
        </IonItem>
        <IonItem>
          Drehlevel
          <IonText slot="end">
            {state.biene.rotateSpeedLevel}/{rotateSpeedLevel.max}
          </IonText>
        </IonItem>
        <IonItem>
          <IonText>Preis: {rotateSpeedLevel.price}</IonText>
        </IonItem>
        <IonItem>
          <IonProgressBar
            value={Math.min(
              state.biene.clickCounter / rotateSpeedLevel.price,
              1.0
            )}
            color={
              state.biene.clickCounter < rotateSpeedLevel.price
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
          <br />
        </IonItem>
        <IonItem>
          Weitere Bienen
          <IonText slot="end">{state.biene.additionalBienen.length}/∞</IonText>
        </IonItem>
        <IonItem>Preis: {additionalBeePrice}</IonItem>
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
