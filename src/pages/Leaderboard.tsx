import {
  IonAvatar,
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import Axios from "axios";
import React, { useContext, useEffect, useState } from "react";

import avatar from "../res/avatar.svg";
import { AppContext } from "../store/State";

const PageLeaderboard: React.FC = () => {
  const [data, setData] = useState<
    {
      _id: string;
      autoRotatingBeeLength: number;
      additionalBeeLength: number;
      multiplierLevel: number;
      userName: string;
      settingNewUI: boolean;
      settingClickingAid: boolean;
    }[]
  >([]);

  const { state, dispatch } = useContext(AppContext);

  useIonViewWillEnter(() => {
    Axios.get(
      (process.env.react_app_apiurl ??
        "https://api.ichbineinebiene.toastbrot.org") + "/api/v1/users/get"
    ).then((e) => {
      //setData(JSON.parse(e.data.result));
      setData(e.data.result);
    });
  });
  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>High Score</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard hidden>
          <IonCardHeader>
            <IonAvatar>
              <img src={avatar} alt="avatar" />
            </IonAvatar>
            <IonCardTitle>Ha</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonAvatar>
              <img src={avatar} alt="avatar" />
            </IonAvatar>
          </IonCardContent>
        </IonCard>
        {/* 
        <IonItem>
          <IonAvatar slot="start">
            <img src={avatar} alt="avatar" />
          </IonAvatar>
          <IonLabel>
            <h2>Torsten Schröder</h2>
            <p>25 Bienen</p>
            <p>12 Autodreher</p>
            <p>34 Multiplier</p>
          </IonLabel>
        </IonItem>

        <IonItem>
          <IonAvatar slot="start">
            <img src={avatar} alt="avatar" />
          </IonAvatar>
          <IonLabel>
            <h2>Torsten Schröder</h2>
            <p>25 Bienen</p>
            <p>12 Autodreher</p>
            <p>34 Multiplier</p>
          </IonLabel>
        </IonItem>

        <IonItem>
          <IonAvatar slot="start">
            <img src={avatar} alt="avatar" />
          </IonAvatar>
          <IonLabel>
            <h2>Torsten Schröder</h2>
            <p>25 Bienen</p>
            <p>12 Autodreher</p>
            <p>34 Multiplier</p>
          </IonLabel>
        </IonItem> */}

        {data
          .sort((a, b) => b.additionalBeeLength - a.additionalBeeLength)
          .map((i) => (
            <IonItem color={i._id === state.userUUID ? "light" : ""}>
              <IonAvatar slot="start">
                <img src={avatar} alt="avatar" />
              </IonAvatar>
              <IonLabel>
                <h2>{i.userName}</h2>
                <p>{i.additionalBeeLength + 1} Bienen</p>
                <p>{i.autoRotatingBeeLength} Autodreher</p>
                <p>{i.multiplierLevel + 1}x Multiplier</p>
              </IonLabel>
            </IonItem>
          ))}
      </IonContent>
    </IonPage>
  );
};

export default PageLeaderboard;
