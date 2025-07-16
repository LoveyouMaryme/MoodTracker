const clickToSubmit = (name) => {
  const allElements = document.getElementsByName(name);

  Array.from(allElements).forEach((el) => {
    el.addEventListener("animationend", async () => {
      const form = el.closest("form");
      if (form) form.submit();
      redirection();
    });
  });
};
const redirection = () => {
  window.location.href = redirectUrl;
};

document.addEventListener("DOMContentLoaded", () => clickToSubmit("pick-mood"));
