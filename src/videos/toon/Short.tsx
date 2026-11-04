// Toon engine composition: the bridge short's post chain (ink -> lens blur pre + main -> bloom -> NEUTRAL tone map ->
// grade, MSAA 4) around any Episode. Place changes crossfade by stacking a second canvas; white flashes at ep.flashAt.
// Every pixel-sized post parameter is specified at 1080x1920 and scales with the output size.
import React, { useEffect, useMemo } from "react";
import * as THREE from "three";
import { AbsoluteFill, getInputProps, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { BlendFunction, BloomEffect, ToneMappingEffect, ToneMappingMode } from "postprocessing";
import { World } from "./world";
import { InkPass, noInkFallback } from "./ink";
import { LensBlur } from "./lensblur";
import { GradeEffect, GRADES, GRADE_STRENGTH, gradeFor } from "./grade";
import { Episode, layersAt, dofFrom, flashAlpha } from "./core";

type PostToggles = { ink: boolean; lens: boolean; pre: boolean; bloom: boolean; grade: boolean };
const toggles = (): PostToggles => ({ ink: true, lens: true, pre: true, bloom: true, grade: true, ...((getInputProps() as { post?: Partial<PostToggles> }).post ?? {}) });

const makeBloom = () => {
  const b = new BloomEffect({ blendFunction: BlendFunction.ADD, intensity: 0.6, luminanceThreshold: 1.0, luminanceSmoothing: 0.2, mipmapBlur: true, levels: 6, radius: 0.65 });
  const mip = b.mipmapBlurPass;
  const setSize = mip.setSize.bind(mip);
  mip.setSize = (w: number, h: number) => setSize(Math.round((1920 * w) / Math.max(h, 1)), 1920);
  return b;
};
const fwd = new THREE.Vector3(), fpt = new THREE.Vector3();

const Inner: React.FC<{ ep: Episode; id: number }> = ({ ep, id }) => {
  const f = useCurrentFrame();
  const { camera, scene } = useThree();
  const world = useMemo(() => new World(ep), [ep]);
  const target = useMemo(() => new THREE.Vector3(), []);
  const on = useMemo(toggles, []);
  const fx = useMemo(() => ({
    ink: new InkPass(scene, camera as THREE.PerspectiveCamera),
    lens: new LensBlur({ maxCoC: 24, nearScale: 1.2 }),
    bloom: makeBloom(),
    tone: new ToneMappingEffect({ mode: ToneMappingMode.NEUTRAL }),
    grade: new GradeEffect(GRADES.day, GRADE_STRENGTH.day),
  }), [camera, scene]);
  useEffect(() => () => fx.ink.dispose(), [fx]);
  const post = useMemo(() => {
    const list: THREE.Object3D[] | object[] = [];
    const eff = [on.ink && fx.ink, on.lens && on.pre && fx.lens.pre, on.lens && fx.lens.main, on.bloom && fx.bloom, fx.tone, on.grade && fx.grade].filter(Boolean) as object[];
    void list;
    return <EffectComposer multisampling={4}>{eff.map((o, i) => <primitive key={i} object={o} dispose={null} />)}</EffectComposer>;
  }, [fx, on]);
  const cam = camera as THREE.PerspectiveCamera;
  target.copy(world.update(id, f, cam, scene));
  noInkFallback(world.root);
  const d = dofFrom(ep.dof, f);
  cam.getWorldDirection(fwd);
  if (d.focus) fpt.set(...d.focus(f)); else fpt.copy(target);
  fx.lens.focus = Math.max(0.3, fpt.sub(cam.position).dot(fwd));
  fx.lens.cInf = d.cInf;
  gradeFor(fx.grade, ep.shots[id - 1].light);
  return (
    <>
      <primitive object={world.root} dispose={null} />
      {post}
    </>
  );
};

const dprOverride = () => (getInputProps() as { post?: { dpr?: number } }).post?.dpr;
const ShotView: React.FC<{ ep: Episode; id: number; alpha: number }> = ({ ep, id, alpha }) => (
  <AbsoluteFill style={{ opacity: alpha }}>
    <ThreeCanvas width={1080} height={1920} {...(dprOverride() ? { dpr: dprOverride() } : {})} shadows gl={{ antialias: false, stencil: false, powerPreference: "high-performance", toneMappingExposure: 1.0 }}
      camera={{ fov: 40, near: 0.1, far: 3000 }}>
      <Inner ep={ep} id={id} />
    </ThreeCanvas>
  </AbsoluteFill>
);

/** the Remotion component for an episode */
export const makeShort = (ep: Episode): React.FC => {
  const C: React.FC = () => {
    const f = useCurrentFrame();
    const flash = flashAlpha(ep, f);
    return (
      <AbsoluteFill style={{ background: "#0b0d18" }}>
        {layersAt(ep, f).map((l, i) => <ShotView key={i ? "over" : "base"} ep={ep} id={l.id} alpha={l.alpha} />)}
        {flash > 0 && <AbsoluteFill style={{ background: "#ffffff", opacity: flash }} />}
      </AbsoluteFill>
    );
  };
  return C;
};
