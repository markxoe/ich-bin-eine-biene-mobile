import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonPage,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import React, { useState } from "react";
import { generateToast } from "../globals";

const InfosPage: React.FC = () => {
  const [data, setData] = useState<{ title: string; id: string }[]>();
  
  useIonViewWillEnter(() => {
    fetch(
      (process.env.react_app_apiurl ??
        "https://api.ichbineinebiene.toastbrot.org") + "/api/v1/infos/get"
    )
      .then((res) => res.json())
      .then(
        (res: {
          status: string;
          result?: { _id: string; title: string; content: string }[];
        }) => {
          if (res.result !== undefined && res.status === "ok") {
            setData(res.result.map((i) => ({ id: i._id, title: i.title })));
          } else throw Error();
        }
      )
      .catch(() => {
        setData([]);
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
          <IonTitle>Infos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {data ? (
            data
              .sort()
              .map((e) => <ListItem id={e.id} key={e.id} title={e.title} />)
          ) : (
            <>
              <IonItem>
                <IonSkeletonText animated />
              </IonItem>
              <IonItem>
                <IonSkeletonText animated />
              </IonItem>
              <IonItem>
                <IonSkeletonText animated />
              </IonItem>
              <IonItem>
                <IonSkeletonText animated />
              </IonItem>
              <IonItem>
                <IonSkeletonText animated />
              </IonItem>
              <IonItem>
                <IonSkeletonText animated />
              </IonItem>
              <IonItem>
                <IonSkeletonText animated />
              </IonItem>
              <IonItem>
                <IonSkeletonText animated />
              </IonItem>
            </>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

const ListItem: React.FC<{ title: string; id?: string }> = ({
  title,
  id = "",
}) => (
  <IonItem detail button routerLink={"info/" + id}>
    {title}
  </IonItem>
);

export default InfosPage;
