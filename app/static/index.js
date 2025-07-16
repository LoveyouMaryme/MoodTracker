const clickToSubmit = (name) => {
  const allElements = document.getElementsByName(name);

  Array.from(allElements).forEach((el) => {
    el.addEventListener("click", async () => {
      const form = el.closest("form");
      if (form) form.submit();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      window.location.href = redirectUrl;
    });
  });
};
const redirection = async () => {
  await new Promise((resolve) => setTimeout(resolve, 250));
  window.location.href = redirectUrl;
};

document.addEventListener("DOMContentLoaded", () => clickToSubmit("pick-mood"));
