// searchbar.component.js

window.setupJobSearchComponent = function ( renderCallback) {
    const form = document.getElementById("jobSearchForm");
    const searchBtn= document.querySelector("[type=submit]");
    alert("hi")
    let payload = null ;
    searchBtn.addEventListener("click", (e) => {
      alert("Onsubmit")
      e.preventDefault();
      const formData = new FormData(form);
      payload  = Object.fromEntries(formData.entries());
      console.warn(renderCallback)
      console.table(payload)
      if (typeof renderCallback === "function") {
        renderCallback(payload); // only when user submits
      }
    }
  );
}
  