const clickToSubmit = (classname) => {
  const allElements = document.getElementsByClassName(classname);

  Array.from(allElements).forEach((el) => {
    el.addEventListener("click", redirection);
  });
};

const redirection = () => {
  window.location.href = redirectUrl;
};

document.addEventListener("DOMContentLoaded", () =>
  clickToSubmit("mood-option")
);
console.log(redirectUrl);
