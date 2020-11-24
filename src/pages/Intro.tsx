import React from "react";
import {
  IonButton,
  IonContent,
  IonPage,
  IonSlide,
  IonSlides,
} from "@ionic/react";

import Biene from "../res/biene.png";
import "./Intro.css";
import { useHistory } from "react-router";
import { Storage } from "@capacitor/core";
import { StoreKeyPrefix } from "../const";

const PageIntro: React.FC = () => {
  const history = useHistory();
  const doneIntro = () => {
    Storage.set({ key: StoreKeyPrefix + "introdone", value: "Done" }).then(() =>
      history.push("/home")
    );
  };
  return (
    <IonPage>
      <IonContent>
        <IonSlides
          pager={true}
          options={{
            autoHeight: true,
            breakpoints: {
              800: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
            },
          }}
          className="height-full">
          <IonSlide className="ion-padding">
            <div>
              <h1>Willkommen...</h1>
              <img alt="biene" src={Biene} className="introBiene" />
            </div>
          </IonSlide>
          <IonSlide className="ion-padding">
            <div>
              <h1>Willkommen</h1>
              <h2>Bei der sinnlosesten App der Welt...</h2>
            </div>
          </IonSlide>
          <IonSlide className="ion-padding">
            <h1>Denn...</h1>
          </IonSlide>
          <IonSlide className="ion-padding">
            <div>
              <h1>Ich bin eine Biene</h1>
              <IonButton color="tertiary" onClick={() => doneIntro()}>
                Prost!
              </IonButton>
            </div>
          </IonSlide>
        </IonSlides>
      </IonContent>
    </IonPage>
  );
};
export default PageIntro;
