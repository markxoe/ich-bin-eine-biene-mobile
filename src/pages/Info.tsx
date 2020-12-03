import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import React, { useState } from "react";
import { RouteComponentProps } from "react-router";
import { generateToast } from "../globals";

interface InfoProps
  extends RouteComponentProps<{
    id: string;
  }> {}

const InfoPage: React.FC<InfoProps> = ({ match }) => {
  const [data, setData] = useState<{
    title: string;
    id: string;
    content: string;
  }>();

  useIonViewWillEnter(() => {
    fetch(
      (process.env.react_app_apiurl ??
        "https://api.ichbineinebiene.toastbrot.org") +
        "/api/v1/infos/get/" +
        match.params.id
    )
      .then((res) => {
        if (res.status !== 200) {
          throw Error("Hi");
        } else {
          return res;
        }
      })
      .then((res) => res.json())
      .then(
        (res: {
          status: string;
          result?: { _id: string; title: string; content: string };
        }) => {
          if (res.status === "ok" && res.result) {
            setData({
              id: res.result._id,
              title: res.result.title,
              content: res.result.content,
            });
          } else throw Error();
        }
      )
      .catch(() => {
        setData(undefined);
        generateToast("Fehler beim Laden der Daten");
      });
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Info</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="ion-padding">
          <PageContent
            title={data ? data.title : <IonSkeletonText animated />}
            content={data ? data.content : <IonSkeletonText />}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

const PageContent: React.FC<{ title: any; content: any }> = ({
  title,
  content,
}) => (
  // <div className="ion-padding">
  //   <h1>{title}</h1>
  //   <p>{content}</p>
  // </div>
  <IonCard>
    <IonCardHeader>
      <IonCardTitle>{title}</IonCardTitle>
    </IonCardHeader>
    <IonCardContent>{content}</IonCardContent>
  </IonCard>
);

export default InfoPage;
