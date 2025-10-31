// Highlight active page link with gradient + glowing underline animation
const currentPage = location.pathname.split("/").pop();
document.querySelectorAll(".nav a").forEach(link => {
  if (link.getAttribute("href") === currentPage) {
    link.style.pointerEvents = "none";
    link.style.position = "relative";
    link.style.color = "white";
    link.style.background = "linear-gradient(135deg, var(--blue-4), var(--blue-5))";
    link.style.boxShadow = "0 0 10px rgba(0, 150, 255, 0.6)";
    link.style.overflow = "hidden";

    const underline = document.createElement("span");
    underline.style.position = "absolute";
    underline.style.bottom = "4px";
    underline.style.left = "20%";
    underline.style.width = "60%";
    underline.style.height = "3px";
    underline.style.borderRadius = "2px";
    underline.style.backgroundColor = "white";
    underline.style.boxShadow = "0 0 6px rgba(255, 255, 255, 0.8)";
    underline.style.transform = "scaleX(0)";
    underline.style.transformOrigin = "center";
    underline.style.transition = "transform 0.4s ease-out";
    link.appendChild(underline);

    // Trigger animation after append
    requestAnimationFrame(() => {
      underline.style.transform = "scaleX(1)";
    });
  }
});
// Highlight active page link with gradient + glowing underline animation
const currentPage = location.pathname.split("/").pop();
document.querySelectorAll(".nav a").forEach(link => {
  if (link.getAttribute("href") === currentPage) {
    link.style.pointerEvents = "none";
    link.style.position = "relative";
    link.style.color = "white";
    link.style.background = "linear-gradient(135deg, var(--blue-4), var(--blue-5))";
    link.style.boxShadow = "0 0 10px rgba(0, 150, 255, 0.6)";
    link.style.overflow = "hidden";

    const underline = document.createElement("span");
    underline.style.position = "absolute";
    underline.style.bottom = "4px";
    underline.style.left = "20%";
    underline.style.width = "60%";
    underline.style.height = "3px";
    underline.style.borderRadius = "2px";
    underline.style.backgroundColor = "white";
    underline.style.boxShadow = "0 0 6px rgba(255, 255, 255, 0.8)";
    underline.style.transform = "scaleX(0)";
    underline.style.transformOrigin = "center";
    underline.style.transition = "transform 0.4s ease-out";
    link.appendChild(underline);

    // Trigger animation after append
    requestAnimationFrame(() => {
      underline.style.transform = "scaleX(1)";
    });
  }
});
