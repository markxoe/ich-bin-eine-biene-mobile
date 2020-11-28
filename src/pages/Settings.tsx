import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonModal,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTextarea,
  IonTitle,
  IonToggle,
  IonToolbar,
  isPlatform,
  useIonViewDidEnter,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import React, { useContext, useEffect, useState } from "react";
import "./Settings.css";

import packagejs from "../../package.json";

import biene from "../res/biene.png";
import { useHistory } from "react-router";
import { AppContext, saveState, initialState } from "../store/State";
import {
  ActionResetState,
  ActionSetState,
  ActionSettingsSetClickButtonForBee,
  ActionSettingsSetNewUI,
} from "../store/Actions";

import { Plugins, Storage } from "@capacitor/core";
import { flashOutline } from "ionicons/icons";
import { stateType } from "../store/types";
import { FirebaseAnalyticsPlugin } from "@capacitor-community/firebase-analytics";
const Firebase = Plugins.FirebaseAnalytics as FirebaseAnalyticsPlugin;
const { App, Share, Clipboard } = Plugins;
const PageSettings: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const [deleteAllAlert, showdeleteAllAlert] = useState<boolean>(false);
  const [advancedSettings, setAdvancedSettings] = useState<boolean>(false);
  const [showImport, setShowImport] = useState<boolean>(false);
  const [ImportInput, setImportInput] = useState<string>("");
  const [userUUID, setUserUUID] = useState<string>("");
  const deleteAlertRef = React.createRef<HTMLIonAlertElement>();
  const history = useHistory();

  useIonViewDidEnter(async () => {
    Firebase.setScreenName({ screenName: "settings" })
      .then(() => console.log("Set Screen Name to Settings"))
      .catch(() => {});

    await Storage.get({ key: "toastbrot.userUUID" }).then((res) =>
      setUserUUID(res.value ?? "")
    );
  });

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    console.log("Begin async operation");
    Firebase.logEvent({
      name: "SettingsAdvancedActivated",
      params: {},
    }).catch(() => {});

    setTimeout(() => {
      setAdvancedSettings(true);
      event.detail.complete();
    }, 2000);
  }

  useEffect(() => {
    saveState(state);
  }, [state]);

  // useIonViewWillLeave(() => {
  //   const _values: { name: string; value: string }[] = [
  //     {
  //       name: "AdditionalBeeLength",
  //       value: state.biene.additionalBienen.length.toString(),
  //     },
  //     {
  //       name: "AutoRotatingLength",
  //       value: state.biene.autoRotatingBees.length.toString(),
  //     },
  //     {
  //       name: "MultiplierLevel",
  //       value: state.biene.multiplierLevel.toString(),
  //     },
  //     {
  //       name: "RotateSpeedLevel",
  //       value: state.biene.rotateSpeedLevel.toString(),
  //     },
  //     {
  //       name: "RotationStatistic",
  //       value: state.statisticsRotations.toString(),
  //     },
  //     {
  //       name: "SettingsNewUI",
  //       value: state.settings.newUI ? "true" : "false",
  //     },
  //     {
  //       name: "SettingsClickingAid",
  //       value: state.settings.clickButtonForBee ? "true" : "false",
  //     },
  //   ];

  //   _values.forEach((obj) => {
  //     Firebase.setUserProperty({
  //       name: obj.name,
  //       value: obj.value,
  //     }).catch((err) => {
  //       console.error(err);
  //     });
  //   });
  //   console.log("Updated UserPrpoerties");
  // });
  const ImportData = () => {
    Firebase.logEvent({
      name: "SettingsImported",
      params: {},
    }).catch();
    try {
      const _in: stateType = JSON.parse(ImportInput);
      const _in2: stateType = { ...state, ..._in };
      dispatch(ActionSetState(_in2));
      const el = document.createElement("ion-toast");
      document.body.appendChild(el);
      el.message = "Hat funktioniert!";
      el.duration = 1000;
      el.translucent = true;
      el.present();
      setShowImport(false);
    } catch {
      const el = document.createElement("ion-toast");
      document.body.appendChild(el);
      el.message = "Fehler!";
      el.duration = 1000;
      el.translucent = true;
      el.present();
    }
  };

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Einstellungen</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" pullMin={30} onIonRefresh={doRefresh}>
          <IonRefresherContent
            pullingIcon={flashOutline}
            pullingText="Import / Export aktivieren"
            refreshingSpinner="crescent"
            refreshingText="Import / Export aktivieren"
          />
        </IonRefresher>
        <IonItemDivider>Bedienungshilfen</IonItemDivider>
        <IonItem>
          <IonLabel>Separater Knopf</IonLabel>
          <IonToggle
            checked={state.settings.clickButtonForBee}
            onIonChange={(c) => {
              dispatch(ActionSettingsSetClickButtonForBee(c.detail.checked));
              Firebase.logEvent({
                name: "SettingsSeparaterClickButtonChange",
                params: {
                  activated: c.detail.checked ? "true" : "false",
                },
              }).catch((err) => {
                console.error(err);
              });
              Firebase.setUserProperty({
                name: "SettingsClickingAid",
                value: c.detail.checked ? "true" : "false",
              }).catch(() => {});
            }}
          />
        </IonItem>
        <IonItemDivider>Allgemein</IonItemDivider>

        <IonItem>
          <IonLabel>Neues User Interface</IonLabel>
          <IonToggle
            checked={state.settings.newUI}
            onIonChange={(c) => {
              dispatch(ActionSettingsSetNewUI(c.detail.checked));
              Firebase.logEvent({
                name: "SettingsNeueUIChange",
                params: {
                  activated: c.detail.checked ? "true" : "false",
                },
              }).catch(() => {});
              Firebase.setUserProperty({
                name: "SettingsNewUI",
                value: c.detail.checked ? "true" : "false",
              });
            }}
          />
        </IonItem>
        <IonItem detail onClick={() => history.push("/intro")}>
          <IonLabel>Intro erneut durchführen</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>Alle Daten Löschen</IonLabel>
          <IonButton
            onClick={() => {
              showdeleteAllAlert(true);
            }}>
            Alles
          </IonButton>
        </IonItem>
        <IonItemDivider>Info</IonItemDivider>
        <IonItem>
          <IonLabel>Entwickler</IonLabel>
          Mark Oude Elberink
        </IonItem>
        <IonItem>
          <IonLabel>Version</IonLabel>
          {packagejs.version}
        </IonItem>
        <IonItem>
          <IonLabel>Kontakt</IonLabel>
          <IonButton slot="end" href="mailto:mark@oude-elberink.de">
            E-Mail
          </IonButton>
        </IonItem>
        <IonItem>
          <IonLabel>Website</IonLabel>
          <IonButton href="https://toastbrot.org/">Web</IonButton>
        </IonItem>

        <IonItemGroup hidden={!advancedSettings}>
          <IonItemDivider>FirebaseUserID</IonItemDivider>
          <IonItem>{userUUID}</IonItem>
          <IonItemDivider>Import / Export</IonItemDivider>
          <IonItem>
            Backup
            <IonButton
              slot="end"
              onClick={() => {
                isPlatform("capacitor")
                  ? Share.share({
                      dialogTitle: "Daten Exportieren",
                      text: JSON.stringify(state),
                      title: "Nicht mit andern Teilen!",
                    })
                  : Clipboard.write({ string: JSON.stringify(state) });
                Firebase.logEvent({
                  name: "SettingsExport",
                  params: {},
                });
              }}>
              Backup
            </IonButton>
          </IonItem>
          <IonItem>
            Backup laden
            <IonButton slot="end" onClick={() => setShowImport(true)}>
              Import
            </IonButton>
          </IonItem>
        </IonItemGroup>

        <div className="ion-margin-top ion-text-center">
          <img className="bienemini" src={biene} alt="" />
        </div>

        <IonModal
          swipeToClose={true}
          isOpen={showImport}
          onDidDismiss={() => setShowImport(false)}>
          <IonHeader translucent>
            <IonToolbar>
              <IonTitle>Import</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowImport(false)}>
                  Doch nicht
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent fullscreen>
            <IonItem>
              <IonTextarea
                onIonChange={(e) => setImportInput(e.detail.value ?? "")}
                placeholder="{..."></IonTextarea>
            </IonItem>
            <IonItem>
              <IonButton
                onClick={() => ImportData()}
                disabled={ImportInput === ""}>
                Import!
              </IonButton>
            </IonItem>
          </IonContent>
        </IonModal>

        <IonAlert
          ref={deleteAlertRef}
          isOpen={deleteAllAlert}
          message="Wirklich ALLES löschen?"
          buttons={[
            {
              text: "Ja",
              handler: async () => {
                dispatch(ActionResetState());
                await Firebase.logEvent({
                  name: "SettingsDeleteAll",
                  params: {},
                }).catch();
                await saveState(initialState);
                App.exitApp();
                showdeleteAllAlert(false);
              },
            },
            {
              text: "Nein",
              handler: () => {
                showdeleteAllAlert(false);
              },
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default PageSettings;
