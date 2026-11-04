// Register every short here. New cartoon-3d-short episodes: copy src/videos/bridge/ to src/videos/<slug>/,
// then add one <Composition> per episode next to BridgeShort (see .claude/skills/cartoon-3d-short/SKILL.md step 4).
import React from "react";
import { Composition } from "remotion";
import { BridgeShort, BRIDGE_FRAMES } from "./videos/bridge/Bridge";
import { TunnelShort, TUNNEL_FRAMES } from "./videos/tunnel/Tunnel";
import { SpinShort, SPIN_FRAMES } from "./videos/spin/Spin";
import { IceShort, ICE_FRAMES } from "./videos/ice/Ice";
import { SunShort, SUN_FRAMES } from "./videos/sun/Sun";
import { MoonShort, MOON_FRAMES } from "./videos/moon/Moon";
import { ZanzibarShort, ZANZIBAR_FRAMES } from "./videos/zanzibar/Zanzibar";
import { PisaShort, PISA_FRAMES } from "./videos/pisa/Pisa";

export const Root: React.FC = () => (
  <>
    <Composition id="BridgeShort" component={BridgeShort} durationInFrames={BRIDGE_FRAMES} fps={30} width={1080} height={1920} />
    {/* What If */}
    <Composition id="WhatIf01Tunnel" component={TunnelShort} durationInFrames={TUNNEL_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="WhatIf02Spin" component={SpinShort} durationInFrames={SPIN_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="WhatIf03Ice" component={IceShort} durationInFrames={ICE_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="WhatIf04Sun" component={SunShort} durationInFrames={SUN_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="WhatIf05Moon" component={MoonShort} durationInFrames={MOON_FRAMES} fps={30} width={1080} height={1920} />
    {/* History */}
    <Composition id="History01ShortestWar" component={ZanzibarShort} durationInFrames={ZANZIBAR_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="History02LeaningTower" component={PisaShort} durationInFrames={PISA_FRAMES} fps={30} width={1080} height={1920} />
  </>
);
