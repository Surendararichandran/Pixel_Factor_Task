// regsiter.js

/**
 * Handles form submission.
 * @param {SubmitEvent} event
 */
function formOnSubmit(event) {
    event.preventDefault();

    /** @type {HTMLFormElement} */
    const target = event.target;

    // Ensure the target is a form
    if (!(target instanceof HTMLFormElement)) {
        console.error("Event target is not a form element.");
        return;
    }
    
    // Create a FormData object from the form
    const formData = new FormData(target);

    // Log form data for debugging
    formData.forEach((value, key) => {
        console.warn(value, key);
    });

    // Find the submit button within the form
    const submitBtn = target.querySelector("#submit");

    if (!submitBtn) {
        console.error("Submit button not found in the form.");
        return;
    }

    // Disable the submit button to prevent multiple submissions
    submitBtn.disabled = true;
    
    // Validate the form using the form element
    const isGoodToProceed = formValidation(target); // Pass the form element here

    if (!isGoodToProceed) {
        submitBtn.disabled = false;
        return;
    }
    // Submit the form data
    console.table([...formData.entries()]);
    const payload = Object.fromEntries(formData.entries())
    fetcher("POST", urlBuilder(`/register`), payload)
        .catch(() => {
            submitBtn.disabled = false;
        }).then(()=>{
            reDirectTo("/login")
        });
}


document.addEventListener("DOMContentLoaded",()=>{
    const form = document.querySelector("form");
    if(!form) return
    initializeDynamicErrorRemoval(form)
})