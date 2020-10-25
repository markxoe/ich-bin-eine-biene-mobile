import { actionType, stateType } from "./types";

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
