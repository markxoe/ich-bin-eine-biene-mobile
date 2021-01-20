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
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCardSubtitle,
} from "@ionic/react";
import React, { useContext, useState } from "react";
import "./Settings.css";

import packagejs from "../../package.json";

import biene from "../res/biene.png";
import { useHistory } from "react-router";
import { AppContext } from "../store/State";
import {
  ActionSetState,
  ActionSettingSetMaxDisplayBiene,
  ActionSettingSetStoreConfettiDeactivated,
  ActionSettingsSetClickButtonForBee,
  ActionSettingsSetNewUI,
  ActionSettingSetNameAtHomePosition,
} from "../store/Actions";

import { Plugins, Storage } from "@capacitor/core";
import base from "base-64";
import { flashOutline } from "ionicons/icons";
import { stateType } from "../store/types";
import { FirebaseAnalyticsPlugin } from "@capacitor-community/firebase-analytics";
import { generateToast, nameAtHomePositions, uploadEvent } from "../globals";

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
    uploadEvent(state, {
      type: "Import",
      content: success ? "Success" : "Fail",
    });
  };

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Ich bin eine Einstellung</IonTitle>
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
            uploadEvent(state, { type: "AdvancedActivated" });
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
              uploadEvent(state, {
                type: "ChangedNewUI",
                content: c.detail.checked ? "New" : "Old",
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
        <IonItem>
          <IonLabel>Store Konfetti</IonLabel>
          <IonToggle
            checked={!state.settings.deactivateStoreConfetti}
            onIonChange={(e) =>
              dispatch(
                ActionSettingSetStoreConfettiDeactivated(!e.detail.checked)
              )
            }
          />
        </IonItem>
        <IonItem>
          <IonLabel>Namensposition</IonLabel>
          <IonSelect
            value={state.settings.nameathomeposition}
            onIonChange={(e) =>
              dispatch(
                ActionSettingSetNameAtHomePosition(
                  e.detail.value ?? nameAtHomePositions.top
                )
              )
            }
            okText="OK"
            cancelText="Ne, lass">
            <IonSelectOption value={nameAtHomePositions.top}>
              Oben
            </IonSelectOption>
            <IonSelectOption value={nameAtHomePositions.bottom}>
              Unten
            </IonSelectOption>
            <IonSelectOption value={nameAtHomePositions.deactivated}>
              Deaktiviert
            </IonSelectOption>
          </IonSelect>
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
            min={5}
            snaps={true}
            step={5}
            pin={true}
            max={100}>
            <IonText slot="start">5</IonText>
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
                        JSON.stringify({ ...state, isNew: true, userImage: "" })
                      ),
                      title: "Nicht mit andern Teilen!",
                    })
                  : Clipboard.write({
                      string: base.encode(
                        JSON.stringify({ ...state, isNew: true, userImage: "" })
                      ),
                    });
                Firebase.logEvent({
                  name: "SettingsExport",
                  params: {},
                }).catch(() => {});
                uploadEvent(state, { type: "Export" });
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

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Special People</IonCardTitle>
            <IonCardSubtitle>Thanks going to</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <p><a className="no-decoration" href="https://my.makesmart.net/user/cooper">Cooper</a></p>
            <p><a className="no-decoration" href="https://moritz-lerch.de">Moritz</a></p>
            <p>Mia</p>
            <p>Laurin</p>
          </IonCardContent>
        </IonCard>

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
                uploadEvent(state, { type: "DeleteAll" });
                Storage.clear();
                Plugins.App.exitApp();
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
