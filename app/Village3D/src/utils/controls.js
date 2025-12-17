export function setupFPSControls(camera) {
  let keys = {};

  const handleKeyDown = (e) => {
    keys[e.key] = true;
  };

  const handleKeyUp = (e) => {
    keys[e.key] = false;
  };

  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);

  const controlsFPS = () => {
    const speed = 0.15;

    if (keys['w']) camera.position.z -= speed;
    if (keys['s']) camera.position.z += speed;
    if (keys['a']) camera.position.x -= speed;
    if (keys['d']) camera.position.x += speed;
  };

  const cleanup = () => {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
  };

  return { controlsFPS, cleanup };
}
