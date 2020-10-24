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

const PageIntro: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <IonSlides
          pager={true}
          options={{
            autoHeight: true,
            breakpoints: {
              800: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
            },
          }}
          className="height-full"
        >
          <IonSlide>
            <div>
              <h1>Willkommen...</h1>
              <img src={Biene} className="introBiene" />
            </div>
          </IonSlide>
          <IonSlide>
            <div>
              <h1 style={{}}>Willkommen</h1>
              <h2>Bei der sinnlosesten App der Welt...</h2>
            </div>
          </IonSlide>
          <IonSlide>
            <h1>Denn...</h1>
          </IonSlide>
          <IonSlide>
            <div>
              <h1>Ich bin eine Biene</h1>
              <IonButton color="tertiary">Prost!</IonButton>
            </div>
          </IonSlide>
        </IonSlides>
      </IonContent>
    </IonPage>
  );
};
export default PageIntro;
