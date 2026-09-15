import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, PerspectiveCamera, Vector2, Vector3 } from 'three';
import type { SceneProps } from '../types';

/** Scroll owns the base position. Pointer offset is added, never written into it. */
export function CameraRig({ animation, mobile, reducedMotion }: SceneProps) {
  const { camera, size } = useThree();
  const pointer = useMemo(() => new Vector2(), []);
  const offset = useMemo(() => new Vector2(), []);
  const target = useMemo(() => new Vector3(), []);
  useEffect(() => {
    pointer.set(0, 0);
    offset.set(0, 0);
    if (mobile || reducedMotion) return;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      pointer.set(
        MathUtils.clamp((event.clientX / window.innerWidth - 0.5) * 2, -1, 1) * 0.15,
        MathUtils.clamp((0.5 - event.clientY / window.innerHeight) * 2, -1, 1) * 0.10,
      );
    };
    const reset = () => pointer.set(0, 0);
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', reset);
    window.addEventListener('blur', reset);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', reset);
      window.removeEventListener('blur', reset);
    };
  }, [mobile, reducedMotion, pointer, offset]);
  useEffect(() => {
    if (camera instanceof PerspectiveCamera) {
      camera.fov = mobile ? 43 : 37;
      camera.updateProjectionMatrix();
    }
  }, [camera, mobile]);
  useFrame(({ clock }, delta) => {
    const state = animation.current;
    offset.lerp(pointer, 1 - Math.exp(-Math.min(delta, 0.05) * 4));
    const drift = mobile || reducedMotion ? 0 : 0.012;
    const aspect = size.width / Math.max(1, size.height);
    const fit = Math.max(1, (mobile ? 1.0 : 1.12) / aspect);
    camera.position.set(
      state.cameraX + offset.x + Math.sin(clock.elapsedTime * 0.14) * drift,
      state.cameraY + offset.y + Math.cos(clock.elapsedTime * 0.18) * drift * 0.5,
      state.cameraZ * fit,
    );
    target.set(0, state.lookY, 0);
    camera.lookAt(target);
  }, -1);
  return null;
}
