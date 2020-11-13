export const rotateSpeedLevelClasses = [".bienerotate",".bienerotate-level-2",".bienerotate-level-3"];
export const rotateSpeedLevelMax = 3;

export const getRotateSpeedLevelPrice = (level:number) => {
  return (level*200)+100;
}
export const rotateSpeedLevel = {
  max:2,
  levels:[
    {class:"bienerotate"},
    {class:"bienerotate-level-2"},
    {class:"bienerotate-level-3"}
  ]
}

export const BeePrices = {
  speedLevel:20
}

export const getAdditionalBeePrice = (level:number) => {
  return (level*(level*0.2))*100+200;
}