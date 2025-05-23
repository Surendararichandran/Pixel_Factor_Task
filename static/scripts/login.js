// login.js


/**
 * 
 * @param {SubmitEvent} event 
 */
function loginHandler(event){
    event.preventDefault()
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
        console.warn(key, value);
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
    fetcher("POST", urlBuilder(`/api/login`), payload,false,true)
        .catch(() => {
            submitBtn.disabled = false;
        }).then( (response)=>{
            let res =response.body ;
            let headers = response.headers;
            let status = res.status
            if (!res || !headers) {
                console.error("No headers found in response.");
                submitBtn.disabled = false;
                return;
            }
            console.log(res)
            console.log(headers)
            setLocalStorage(headers.get('Authorization'))
            console.log(document.cookie)
            let currentRoute = window.location.pathname;
            let {template:redirectTo,allowedRoutes} = reDirector(res.data.role)
            reDirectTo(`${redirectTo}`)
          
                
                        
        }
        )
        ;

}
function reDirector(role){
    let obj ={
        "JobSeeker":{template:"/jobseeker",allowedRoutes:["/jobseeker"]},
        "jobseeker":{template:"/jobseeker",allowedRoutes:["/jobseeker"]},
        "Employer":{template:"/recruter",allowedRoutes:["/recruter","/job-post"]},
        "undefined" : "/404"
    }
    return obj[role];
}
window.addEventListener("DOMContentLoaded",()=>{
    const form = document.querySelector("form");
    if(!form) return
    initializeDynamicErrorRemoval(form)
})

