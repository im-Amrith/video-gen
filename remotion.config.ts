import { Config } from "@remotion/cli/config";
// Cloud containers have no GPU: let Chrome render WebGL in software (slow but works).
Config.setChromiumOpenGlRenderer("swangle");
Config.setVideoImageFormat("jpeg");
