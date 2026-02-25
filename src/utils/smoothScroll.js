export const scrollToSection = (event, sectionId) => {
  event.preventDefault();
  const targetSection = document.querySelector(sectionId);

  if (targetSection) {
    targetSection.scrollIntoView({ behavior: "smooth" });
  }
};
