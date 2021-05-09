import { actionType, bieneTypes, stateType } from "./types";
import { nameAtHomePositions } from "../globals";

/**
 * Überschreibt den derzeitigen State
 * @param newState Zu setzender State
 */
export const ActionSetState = (newState: stateType): actionType => ({
  type: "setState",
  payload: newState,
});

/**
 * Wenn die Biene geklickt wird
 * @param amount Anzahl der Klicks
 */
export const ActionBieneClickIncrease = (amount: number = 1): actionType => ({
  type: "bieneClickIncrease",
  payload: amount,
});

/**
 * Wenn Daten aus dem Speicher geladen wurden
 */
export const ActionDataLoadedFromMemory = (): actionType => ({
  type: "setDataLoaded",
});

/**
 * Setzt die Einstellung für die Bedienungshilfe des Saltobuttons
 * @param activated der neue Wert
 */
export const ActionSettingsSetClickButtonForBee = (
  activated: boolean
): actionType => ({ type: "setclickButtonForBee", payload: activated });

/**
 * Setzt die Einstellung für das neue UI
 * @param activated der neue Wert
 */
export const ActionSettingsSetNewUI = (activated: boolean): actionType => ({
  type: "setsettingnewui",
  payload: activated,
});

/**
 * Erhöht das Level der Bienen Geschwindigkeit
 */
export const ActionRotateSpeedLevelIncrease = (): actionType => ({
  type: "rotateSpeedLevelIncrease",
});

/**
 * Erniedrigt das Level der Bienenclicks
 * @param levels Anzahl
 */
export const ActionBieneClickDecrease = (levels: number = 1): actionType => ({
  type: "bieneClickDecrease",
  payload: levels,
});

export const ActionBieneAddAdditional = (
  type: number = bieneTypes.bee
): actionType => ({
  type: "bieneAdditionalAdd",
  payload: type,
});

/**
 * Fügt eine Auto-drehende Biene hinzu
 * @param type Typ (Normalerweise 0)
 */
export const ActionBieneAddAutoRotating = (
  type: number = bieneTypes.bee
): actionType => ({
  type: "bieneAutoRotatingAdd",
  payload: type,
});

export const ActionMakeMeAPresent = () => ActionBieneClickIncrease(400);

/**
 * Erhöht den Multiplier um 1
 */
export const ActionMultiplierIncrease = (): actionType => ({
  type: "bieneMultiplierIncrease",
});

/**
 * Resette den State aufs unsprüngliche
 */
export const ActionResetState = (): actionType => ({
  type: "resetState",
});

/**
 * Fügt einen Click für die Statistik zu
 */
export const ActionStatisticAdd = (): actionType => ({
  type: "statisticsAdd",
});

export const ActionSettingSetMaxDisplayBiene = (
  newNumber: number
): actionType => ({
  type: "settingSetMaxDisplayBiene",
  payload: newNumber,
});

export const ActionSettingSetMaxDisplayDragon = (
  newNumber: number
): actionType => ({
  type: "settingSetMaxDisplayDragon",
  payload: newNumber,
});

/**
 * Setzt die Einstellung für die Deaktivierung des Konfettis
 * @param newBool
 */
export const ActionSettingSetStoreConfettiDeactivated = (
  newBool: boolean
): actionType => ({
  type: "setStoreConfetti",
  payload: newBool,
});

export const ActionSettingSetNameAtHomePosition = (
  position: nameAtHomePositions
): actionType => ({
  type: "setNameAtHomePosition",
  payload: position,
});

export const ActionAddGoldenBiene = (): actionType => ({
  type: "addGoldenBiene",
});

export const ActionResetManyThings = (): actionType => ({
  type: "resetManyThings",
});

export const ActionSetMultiplyPrices = (activated: boolean): actionType => ({
  type: "setMultiplyPrices",
  payload: activated,
});

export const ActionAddDragon = (): actionType => ({ type: "addDragon" });
