import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonPage,
  IonSearchbar,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import { search } from "ionicons/icons";
import React, { useState } from "react";
import { generateToast } from "../globals";

const InfosPage: React.FC = () => {
  const [data, setData] = useState<{ title: string; id: string }[]>();

  const [searchbar, setSearchbar] = useState<boolean>(false);
  const [searchquery, setSearchquery] = useState<string>("");

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
          <IonButtons slot="end">
            <IonButton onClick={() => setSearchbar((i) => !i)}>
              <IonIcon icon={search} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar hidden={!searchbar}>
          <IonSearchbar
            showCancelButton={"focus"}
            onIonCancel={() => setSearchbar(false)}
            onIonChange={(e) => setSearchquery(e.detail.value ?? "")}
            cancelButtonText="Abbrechen"
          />
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {data ? (
            data
              .sort()
              .filter(
                (e) =>
                  e.title.toLowerCase().includes(searchquery.toLowerCase()) ||
                  !searchbar
              )
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
