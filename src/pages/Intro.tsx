import React from "react";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonPage,
  IonSlide,
  IonSlides,
} from "@ionic/react";

import Biene from "../res/biene.png";
import "./Intro.css";
import { useHistory } from "react-router";
import { Storage } from "@capacitor/core";
import { StoreKeyPrefix } from "../other/const";
import { arrowForward } from "ionicons/icons";

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
              <h1>
                Wische nach <IonIcon icon={arrowForward} />
              </h1>
            </div>
          </IonSlide>
          <IonSlide className="ion-padding">
            <div>
              <h1>Willkommen</h1>
              <h2>Bei der sinnlosesten App der Welt</h2>
            </div>
          </IonSlide>
          <IonSlide className="ion-padding">
            <div>
              <h1>
                Klicke auf die{" "}
                <span role="img" aria-labelledby="Biene">
                  🐝
                </span>{" "}
                um Saltos zu bekommen
              </h1>
              <h1>Mit Saltos bekommst du Upgrades</h1>
              <h1>Und mit Upgrades bekommst du Saltos</h1>
            </div>
          </IonSlide>
          <IonSlide className="ion-padding">
            <div>
              <h1>Dein Ziel:</h1>
              <h1>
                Bekomme so viele{" "}
                <span role="img" aria-labelledby="Biene">
                  🐝
                </span>{" "}
                wie möglich und werde der Beste!
              </h1>
            </div>
          </IonSlide>
          <IonSlide className="ion-padding">
            <div>
              <h1>Ganz einfach</h1>
            </div>
          </IonSlide>
          <IonSlide className="ion-padding">
            <div>
              <h1>Ich bin eine Biene</h1>
              <IonButton color="tertiary" onClick={() => doneIntro()}>
                Ich auch!
              </IonButton>
            </div>
          </IonSlide>
        </IonSlides>
      </IonContent>
    </IonPage>
  );
};
export default PageIntro;
