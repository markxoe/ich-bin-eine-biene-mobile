import { actionType, bieneTypes, stateType } from "./types";

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
 */
export const ActionBieneClickIncrease = (): actionType => ({
  type: "bieneClickIncrease",
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
 * Erhöht das Level der Bienen Geschwindigkeit
 */
export const ActionRotateSpeedLevelIncrease = (): actionType => ({type:"rotateSpeedLevelIncrease"});

/**
 * Erniedrigt das Level der Bienenclicks
 * @param levels Anzahl
 */
export const ActionBieneClickDecrease = (levels:number = 1):actionType => ({
  type: "bieneClickDecrease",
  payload:levels
})

export const ActionBieneAddAdditional = (type:number = bieneTypes.bee):actionType => ({
  type:"bieneAdditionalAdd",
  payload:type
})