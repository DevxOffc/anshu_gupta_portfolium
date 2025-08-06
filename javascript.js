let menu = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");

menu.onclick = () => {
  menu.classList.toggle("bx-x");
  navbar.classList.toggle("active");
};

window.onscroll = () => {
  menu.classList.remove("bx-x");
  navbar.classList.remove("active");
};

const typed = new Typed(".multiple-text", {
  strings: [
    "Photographer",
    "Writer",
    "Filmmaker",
    "Social Expert",
    "Researcher",
    "Visual Artist",
    "Poet",
  ],
  typeSpeed: 50,
  backSpeed: 50,
  backDelay: 1000,
  loop: true,
  showCursor: true,
  cursorChar: "|",
  smartBackspace: true,
});

