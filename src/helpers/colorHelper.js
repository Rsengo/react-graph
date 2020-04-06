import { interpolateRainbow, randomUniform } from "d3";

const _randomGenearator = randomUniform();

const generateRainbowColor = () => interpolateRainbow(_randomGenearator());

export { generateRainbowColor };
