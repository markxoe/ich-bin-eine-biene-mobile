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
  IonItem,
  IonToggle,
  IonLabel,
} from "@ionic/react";
import { AppContext } from "../store/State";
import {
  calculateLevel,
  getAdditionalBeePrice,
  getAutorotatePrice,
  getMultiplierPrice,
  getRotateSpeedLevelPrice,
  renderValue,
  rotateSpeedLevel,
  uploadData,
  uploadEvent,
  getDragonPrice,
} from "../globals";
import {
  ActionBieneAddAdditional,
  ActionBieneAddAutoRotating,
  ActionBieneClickDecrease,
  ActionMakeMeAPresent,
  ActionMultiplierIncrease,
  ActionRotateSpeedLevelIncrease,
  ActionSetState,
  ActionSetMultiplyPrices,
  ActionAddDragon,
} from "../store/Actions";
import { RefresherEventDetail } from "@ionic/core";
import { flashOutline } from "ionicons/icons";
import { Plugins } from "@capacitor/core";
import Confetti from "react-confetti";
import { FirebaseAnalyticsPlugin } from "@capacitor-community/firebase-analytics";
import { generateName } from "../functions/namegenerator";
import { MAX_VALUE } from "../other/const";
import { useLocation } from "react-router";
const Firebase = Plugins.FirebaseAnalytics as FirebaseAnalyticsPlugin;

const StorePage: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const [showThx, setShowThx] = useState<boolean>(false);
  const location = useLocation();

  const additionalBeePrice = getAdditionalBeePrice(state);
  const rotateSpeedLevelPrice = getRotateSpeedLevelPrice(state);
  const multiplierLevelPrice = getMultiplierPrice(state);

  const autorotatingPrice = getAutorotatePrice(state);

  const dragonPrice = getDragonPrice(state);

  const [confettiChilds, setConfettiChilds] = useState<JSX.Element[]>([]);

  useIonViewDidEnter(() => {
    Firebase.setScreenName({ screenName: "store" }).catch(() => {});
  });

  useEffect(() => {
    if (state.dataLoadedFromMemory && location.pathname.includes("store"))
      uploadData(state);
    // Generate Random Name, if User has no Name
    if (!state.userName && state.dataLoadedFromMemory)
      dispatch({
        type: "setUserName",
        payload: generateName(),
      });
  }, [state, dispatch, location.pathname]);

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
    }, 10000);
  }

  useEffect(() => {
    if (state.biene.autoRotatingBees.length > 10) {
      dispatch(
        ActionSetState({
          ...state,
          biene: { ...state.biene, autoRotatingBees: Array(10).fill(0) },
        })
      );
    }
  }, [state, dispatch]);

  const onBuy = () => {
    if (!state.settings.deactivateStoreConfetti) {
      const newconfetti = (
        <Confetti
          recycle={false}
          gravity={0.8}
          initialVelocityX={{ min: -10, max: 10 }}
          initialVelocityY={{ min: -15, max: 0 }}
          confettiSource={{
            h: 50,
            w: 50,
            x: window.innerWidth / 2 - 25,
            y: window.innerHeight / 2 - 25,
          }}
          friction={0.999}
          numberOfPieces={50}
          tweenDuration={500}
        />
      );
      setConfettiChilds((i) => i.concat(newconfetti));
    }
  };

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Ich bin ein Store</IonTitle>
        </IonToolbar>
      </IonHeader>
      {confettiChilds}
      <IonContent fullscreen>
        {/* {confettiChilds} */}
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
                      onBuy();
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
                      if (state.biene.clickCounter > additionalBeePrice) {
                        dispatch(ActionBieneAddAdditional());
                        dispatch(ActionBieneClickDecrease(additionalBeePrice));
                        setShowThx(true);
                        onBuy();
                        Firebase.logEvent({
                          name: "StoreBuyAdditionalBee",
                          params: {},
                        }).catch(console.error);
                      }
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
                  <h2>
                    Deine weiteren Bienen: {state.biene.additionalBienen.length}
                    /∞
                  </h2>
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
                      if (state.biene.clickCounter > multiplierLevelPrice) {
                        dispatch(ActionMultiplierIncrease());
                        dispatch(
                          ActionBieneClickDecrease(multiplierLevelPrice)
                        );
                        setShowThx(true);
                        onBuy();
                        Firebase.logEvent({
                          name: "StoreBuyMultiplier",
                          params: {},
                        }).catch(console.error);
                      }
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
                  <h2>
                    Dein Multiplier: x {state.biene.multiplierLevel + 1}/∞
                  </h2>
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
                      if (state.biene.clickCounter >= autorotatingPrice) {
                        dispatch(ActionBieneAddAutoRotating(0));
                        dispatch(ActionBieneClickDecrease(autorotatingPrice));
                        setShowThx(true);
                        onBuy();
                        Firebase.logEvent({
                          name: "StoreBuyAutorotater",
                          params: { price: autorotatingPrice },
                        }).catch(() => {});
                        uploadEvent(state, { type: "BoughtAutorotater" });
                      }
                    }}
                    disabled={
                      state.biene.clickCounter < autorotatingPrice ||
                      state.biene.autoRotatingBees.length >= 10
                    }>
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
                  Deine Autodreher: {state.biene.autoRotatingBees.length}/10
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Drache</IonCardTitle>
            <IonCardSubtitle className="ion-text-uppercase">
              Macht garnix
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonButton
                    onClick={() => {
                      if (state.biene.clickCounter >= dragonPrice) {
                        dispatch(ActionAddDragon());
                        dispatch(ActionBieneClickDecrease(dragonPrice));
                        setShowThx(true);
                        onBuy();
                        Firebase.logEvent({
                          name: "StoreBuyDragon",
                          params: { price: dragonPrice },
                        }).catch(() => {});
                        uploadEvent(state, { type: "BoughtDragon" });
                      }
                    }}
                    disabled={state.biene.clickCounter < dragonPrice}>
                    Drachen kaufen
                  </IonButton>
                </IonCol>
                <IonCol>
                  <h2>Preis: {renderValue(dragonPrice)}</h2>
                  <IonProgressBar
                    color={
                      state.biene.clickCounter < dragonPrice
                        ? "danger"
                        : "success"
                    }
                    value={Math.min(
                      state.biene.clickCounter / dragonPrice,
                      1.0
                    )}
                  />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>Deine Drachen: {state.biene.dragons}/∞</IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Goldene Biene</IonCardTitle>
            <IonCardSubtitle className="ion-text-uppercase">
              Wann bekommst du sie?
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonProgressBar
              value={Math.min(state.biene.clickCounter / MAX_VALUE, 1.0)}
              color="primary"
            />
            <p>
              {state.biene.clickCounter} / {MAX_VALUE} (
              {(
                Math.min(state.biene.clickCounter / MAX_VALUE, 1.0) * 100
              ).toFixed(4)}
              %)
            </p>
          </IonCardContent>
        </IonCard>

        <IonItem>
          <IonLabel>Höhere Preise</IonLabel>
          <IonToggle
            checked={state.settings.multiplyPrices}
            onIonChange={(e) => {
              dispatch(ActionSetMultiplyPrices(e.detail.checked));
            }}
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
