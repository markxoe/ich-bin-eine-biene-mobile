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

import goldenbiene from "../res/biene.png";
import avatar from "../res/avatar.svg";
import { AppContext } from "../store/State";

const PageLeaderboard: React.FC = () => {
  const showNumber = 30;
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
        goldenBienens: number;
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
        {data
          .sort((a, b) => b.level - a.level)
          .slice(0, showNumber)
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
                <p hidden={!i.user.goldenBienens}>
                  {i.user.goldenBienens} Goldene Biene(n)
                </p>
              </IonLabel>
              {i.user.goldenBienens > 0 ? (
                <img
                  slot="end"
                  alt="Golden"
                  src={goldenbiene}
                  height="25"
                  className="margin-auto"
                />
              ) : (
                ""
              )}
            </IonItem>
          ))}
        <IonItem>Und noch {data.length - showNumber} weitere...</IonItem>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>So wirst du Erster</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            Kaufe dir so viele Bienen wie möglich
            <br />
            Autodreher werden nicht gezählt
            <br />
            Multiplier zählen weniger als eine Biene
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default PageLeaderboard;
