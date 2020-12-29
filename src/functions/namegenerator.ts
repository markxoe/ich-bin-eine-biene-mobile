interface Nomen {
  name: string;
  adjektivPrefix?: string;
}
const nomen: Nomen[] = [
  { name: "Bratwurst" },
  { name: "Hühnchen", adjektivPrefix: "s" },
  { name: "Baum", adjektivPrefix: "r" },
  { name: "Biene" },
  { name: "Molch", adjektivPrefix: "r" },
  { name: "Toastbrot", adjektivPrefix: "s" },
  { name: "Einhorn", adjektivPrefix: "s" },
  { name: "Brötchen", adjektivPrefix: "s" },
  { name: "Söckchen", adjektivPrefix: "s" },
  { name: "Meerschweinchen", adjektivPrefix: "s" },
];

const adjektive = [
  "Lustige",
  "Bratwürstige",
  "Langweilige",
  "Gesunde",
  "Geschichtliche",
  "Geröstete",
  "Gebräunte",
  "Dreckige",
  "Vergilbte",
  "Gebleichte",
  "Gedehnte",
  "Gebratene",
];

export const generateName = () => {
  let out: string = "";
  out += adjektive[Math.round(Math.random() * (adjektive.length - 1))];
  const dasNomen: Nomen = nomen[Math.round(Math.random() * (nomen.length - 1))];
  if (dasNomen.adjektivPrefix) out += dasNomen.adjektivPrefix;
  out += " ";
  out += dasNomen.name;

  return out;
};
