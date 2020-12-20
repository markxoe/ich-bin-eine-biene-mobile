import {
  IonAvatar,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import Axios from "axios";
import React, { useContext, useState } from "react";
import { generateToast } from "../globals";

import avatar from "../res/avatar.svg";
import { AppContext } from "../store/State";

const PageLeaderboard: React.FC = () => {
  const [data, setData] = useState<
    {
      level: number;
      user: {
        _id: string;
        autoRotatingBeeLength: number;
        additionalBeeLength: number;
        multiplierLevel: number;
        userName: string;
        settingNewUI: boolean;
        settingClickingAid: boolean;
        userImage: string;
      };
    }[]
  >([]);

  const { state } = useContext(AppContext);

  useIonViewWillEnter(() => {
    Axios.get(
      (process.env.react_app_apiurl ??
        "https://api.ichbineinebiene.toastbrot.org") + "/api/v1/users2/leader"
    )
      .then((e) => {
        setData(e.data);
      })
      .catch(() => {
        generateToast("Es ist ein Fehler aufgetreten");
      });
  });

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Ich bin ein High Score</IonTitle>
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
          .sort((a, b) => b.level - a.level)
          .map((i) => (
            <IonItem color={i.user._id === state.userUUID ? "light" : ""}>
              <IonAvatar slot="start">
                <img
                  src={
                    (i.user.userImage ?? "") !== "" ? i.user.userImage : avatar
                  }
                  alt="avatar"
                />
              </IonAvatar>
              <IonLabel>
                <h2>
                  {i.user.userName !== ""
                    ? i.user.userName
                    : i.user._id.slice(0, 6) + "..."}{" "}
                  ({i.level})
                </h2>
                <p>{i.user.additionalBeeLength + 1} Bienen</p>
                <p>{i.user.autoRotatingBeeLength} Autodreher</p>
                <p>{i.user.multiplierLevel + 1}x Multiplier</p>
              </IonLabel>
            </IonItem>
          ))}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>So wirst du Erster</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              Kaufe dir so viele Bienen wie möglich<br/>
              Autodreher werden nicht gezählt
              Multiplier zählen weniger als eine Biene
            </IonCardContent>
          </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default PageLeaderboard;
