const clickToSubmit = (name) => {
  const allElements = document.getElementsByName(name);

  Array.from(allElements).forEach((el) => {
    console.log(el)

    el.addEventListener("animationend", () => {
      const form = el.closest("form");
      form.submit();

    });
  });
};


document.addEventListener("DOMContentLoaded", () => clickToSubmit("pick-mood"));

