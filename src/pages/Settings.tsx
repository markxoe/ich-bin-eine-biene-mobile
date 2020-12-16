import {
  IonAlert,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonMenuButton,
  IonModal,
  IonPage,
  IonRange,
  IonRefresher,
  IonRefresherContent,
  IonText,
  IonTextarea,
  IonTitle,
  IonToggle,
  IonToolbar,
  isPlatform,
  useIonViewDidEnter,
} from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import "./Settings.css";

import packagejs from "../../package.json";

import biene from "../res/biene.png";
import { useHistory } from "react-router";
import { AppContext, saveState, initialState } from "../store/State";
import {
  ActionResetState,
  ActionSetState,
  ActionSettingSetMaxDisplayBiene,
  ActionSettingsSetClickButtonForBee,
  ActionSettingsSetNewUI,
} from "../store/Actions";

import { Plugins, Storage } from "@capacitor/core";
import base from "base-64";
import { flashOutline } from "ionicons/icons";
import { stateType } from "../store/types";
import { FirebaseAnalyticsPlugin } from "@capacitor-community/firebase-analytics";
import { generateToast } from "../globals";
const Firebase = Plugins.FirebaseAnalytics as FirebaseAnalyticsPlugin;
const { Share, Clipboard } = Plugins;

interface importType extends stateType {
  isNew: boolean | undefined;
}

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

  useEffect(() => {
    if (state.dataLoadedFromMemory) saveState(state);
  }, [state]);

  const ImportData = () => {
    let success: string = "false";
    try {
      const _in: importType = JSON.parse(base.decode(ImportInput));
      if (_in.isNew !== true) {
        throw Error("Cheating");
      }
      const _in2: stateType = { ...state, ..._in, userUUID: state.userUUID };
      dispatch(ActionSetState(_in2));
      generateToast("Hat funktioniert");
      setShowImport(false);
      success = "true";
    } catch (err) {
      if (err.message !== "Cheating") {
        generateToast("Fehler!");
      } else generateToast("Illegal");
    }
    Firebase.logEvent({
      name: "SettingsImported",
      params: { success },
    }).catch(() => {});
  };

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Einstellungen</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher
          slot="fixed"
          pullMin={200}
          onIonRefresh={(event) => {
            Firebase.logEvent({
              name: "SettingsAdvancedActivated",
              params: {},
            }).catch(() => {});
            setTimeout(() => {
              setAdvancedSettings(true);
              event.detail.complete();
            }, 5000);
          }}>
          <IonRefresherContent
            pullingIcon={flashOutline}
            pullingText="Erweiterte Einstellungen"
            refreshingSpinner="crescent"
            refreshingText="Erweiterte Einstellungen aktivieren"
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
            slot="end"
            onClick={() => {
              showdeleteAllAlert(true);
            }}>
            Alles
          </IonButton>
        </IonItem>

        <IonItemDivider>Anzahl der maximal angezeigten Bienen</IonItemDivider>
        <IonItem>
          <IonRange
            onIonChange={(e) => {
              dispatch(
                ActionSettingSetMaxDisplayBiene(
                  parseInt(e.detail.value as any) ?? 20
                )
              );
            }}
            value={state.settingMaxNumberDisplayedBees}
            min={10}
            snaps={true}
            step={10}
            // pin={true}
            max={100}>
            <IonText slot="start">10</IonText>
            <IonText slot="end">100</IonText>
          </IonRange>
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
          <IonButton slot="end" href="https://toastbrot.org/">
            Web
          </IonButton>
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
                      text: base.encode(
                        JSON.stringify({ ...state, isNew: true })
                      ),
                      title: "Nicht mit andern Teilen!",
                    })
                  : Clipboard.write({
                      string: base.encode(
                        JSON.stringify({ ...state, isNew: true })
                      ),
                    });
                Firebase.logEvent({
                  name: "SettingsExport",
                  params: {},
                }).catch(() => {});
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
                placeholder="ey..."></IonTextarea>
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
                }).catch(() => {});
                await saveState(initialState);
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
