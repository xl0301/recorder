export const updateCropConfig = (dom) => {
  if (!dom) {
    return null;
  }
  const { left, top, width, height } = dom.getBoundingClientRect();
  const navHeight = window.outerHeight - window.innerHeight;
  const config = { startX: left, startY: top + navHeight, width, height };
  console.log("update crop config", config);
  return config;
};
