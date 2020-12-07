import {
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  help,
  home,
  moon,
  person,
  settings,
  storefront,
  trophy,
} from "ionicons/icons";
import React, { useContext } from "react";
import { AppContext } from "./store/State";
const Menu: React.FC = () => {
  const { state } = useContext(AppContext);
  return (
    <IonMenu contentId="main">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ich bin ein Menü</IonTitle>
          <IonButtons collapse hidden slot="end">
            <IonButton>
              <IonIcon icon={moon} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle>Ich bin ein Menü</IonTitle>
            <IonButtons hidden slot="end">
              <IonButton>
                <IonIcon icon={moon} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonList lines={"none"}>
          <IonListHeader>Allgemein</IonListHeader>
          <IonMenuToggle>
            <IonItem routerLink="/home">
              <IonIcon icon={home} slot="start" />
              Home
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem routerLink="/store">
              <IonIcon icon={storefront} slot="start" />
              Store
            </IonItem>
          </IonMenuToggle>
          <IonListHeader>Benutzer</IonListHeader>
          <IonMenuToggle>
            <IonItem routerLink="/leader">
              <IonIcon slot="start" icon={trophy} />
              Highscore
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem routerLink="/profile">
              <IonIcon slot="start" icon={person} />
              Profil
              <IonLabel slot="end">
                <IonBadge color="success" hidden={state.userName !== ""}>
                  TODO
                </IonBadge>
              </IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonListHeader>Weiteres</IonListHeader>
          <IonMenuToggle>
            <IonItem routerLink="/settings">
              <IonIcon slot="start" icon={settings} />
              Einstellungen
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem routerLink="/infos">
              <IonIcon slot="start" icon={help} /> Informationen
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
