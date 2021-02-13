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
  IonText,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCardSubtitle,
} from "@ionic/react";
import Axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { generateToast } from "../globals";

import goldenbiene from "../res/biene.png";
import avatar from "../res/avatar.svg";
import { AppContext } from "../store/State";

const PageLeaderboard: React.FC = () => {
  const [showNumber, setShowNumber] = useState<number>(30);
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

  const [me, setMe] = useState<{
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
  } | null>(null);

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

  useEffect(() => {
    data.forEach((i) => {
      if (i.user._id === state.userUUID) {
        setMe(i);
      }
    });
  }, [data, state]);

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Ich bin die Hall of Fame</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardContent>
            <h2>
              Dein Ranking:{" "}
              <b>
                <IonText color="warning">
                  {me
                    ? data.sort((a, b) => b.level - a.level).indexOf(me) + 1
                    : "..."}
                </IonText>{" "}
                von {data.length}
              </b>
            </h2>
            <h2>
              Deine Punktzahl:{" "}
              <b>
                <IonText color="warning">{me?.level}</IonText>
              </b>
            </h2>
          </IonCardContent>
        </IonCard>
        {/* <IonItem>
          Dein Ranking:{" "}
          {me ? data.sort((a, b) => b.level - a.level).indexOf(me) : "..."}
        </IonItem>
        <IonItem>Deine Punktzahl: {me?.level}</IonItem> */}
        <IonGrid>
          <IonRow>
            {data.length > 0 ? (
              <LeaderThing
                cardColor="success"
                user={data[0].user}
                place={"1ter"}
              />
            ) : (
              ""
            )}
            {data.length > 1 ? (
              <LeaderThing
                cardColor="success"
                user={data[1].user}
                place={"2ter"}
              />
            ) : (
              ""
            )}
            {data.length > 2 ? (
              <LeaderThing
                cardColor="success"
                user={data[2].user}
                place={"3ter"}
              />
            ) : (
              ""
            )}
          </IonRow>
        </IonGrid>
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

        <IonItem hidden={data.length < showNumber}>
          Und noch {data.length - showNumber} weitere...
        </IonItem>
        <IonItem hidden={data.length < showNumber}>
          <IonButton onClick={() => setShowNumber((i) => i + 20)}>
            20 mehr anzeigen
          </IonButton>
        </IonItem>

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
            <br />
            Goldene Bienen bringen 100000 Punkte
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

const LeaderThing: React.FC<{
  user: { userName: string; userImage: string };
  place: string;
  cardColor?: string;
}> = ({ user, place, cardColor = "" }) => {
  return (
    <IonCol>
      <IonCard color={cardColor}>
        <IonCardHeader>
          <IonCardTitle>{place}</IonCardTitle>
          <IonCardSubtitle>{user.userName}</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <IonAvatar slot="start">
            <img
              src={(user.userImage ?? "") !== "" ? user.userImage : avatar}
              alt="avatar"
            />
          </IonAvatar>
        </IonCardContent>
      </IonCard>
    </IonCol>
  );
};

export default PageLeaderboard;
