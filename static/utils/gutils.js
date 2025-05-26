//gutils.js

const server={
    hostName:"http://localhost:5000"
}
Object.freeze(server)
/**
 * 
 * @param {HTMLFormElement} Form 
 */
function formValidation(form){
    let isIamvalid = true    
    for(let field of form)
    {
        if(field.type == "submit") continue;
        try{
            removeErrorIndicators(field)
            
            if(isRequiredFieldsSatisfied(field) == false ){
                addErrorIndicators(field)
                
                isIamvalid = false
            }
            
        }
        catch(error){
            console.error(error)
            isIamvalid = false
        }   

    }
    
    return isIamvalid
}


/**
 * @param {HTMLInputElement} field
 */

function isRequiredFieldsSatisfied(field) {

    if(!(field instanceof HTMLInputElement )) 
        throw TypeError("The feild is required an HTML Input Tag")
    if ( field.value.trim()=="") {
        return false; // Field is required but empty
    }
    
    if(field.type === "password"){
        return isStrongPassword(field.value);
    }
    if(field.type ==="email"){
        return isCorretEmailSyntax(field.value)
    }
    return true; // Field satisfies all constraints
}

/**
 * Checks if the password is strong.
 * A strong password must contain:
 * - At least one lowercase letter
 * - At least one uppercase letter
 * - At least one digit
 * - At least one special character
 * - Minimum length of 8 characters
 *
 * @param {string} password - The password to validate.
 * @returns {boolean} - Returns true if password is strong.
 */
function isStrongPassword(password) {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    return strongPasswordRegex.test(password);
}
/**
 * 
 * @param {string} apiUrlstr 
 * @description - Create valid URL rather than using plain string
 * @returns {string}
 */
function urlBuilder(apiUrlstr){
    return new URL(apiUrlstr,server.hostName).toString();
}
/**
 * 
 * @param {string} routeUrl 
 * @returns {void}
 */
function reDirectTo(routeUrl){
    // let route = urlBuilder(routeUrl,server.hostName).toString();
    window.location.href= routeUrl;
}

/**
 * 
 * @param {string} email 
 * @returns {boolean}
 */
function isCorretEmailSyntax(email){
    return email.includes("@") && email.includes(".")
}



function _setFocusToTargetElement(element)
{
    if (!(element instanceof HTMLInputElement))  {
        throw new TypeError(` The tag you are checking is not Input Tag`)
    }
    element.focus();
}



function addErrorIndicators(element){
    if (!(element instanceof HTMLInputElement))  {
        throw new TypeError(` The tag you are checking is not Input Tag`)
    }
    _setFocusToTargetElement(element);
    
    element.classList.add("is-invalid")
     // Remove any existing error messages before adding a new one
     const existingErrorMessage = element.parentElement.querySelector(".invalid-feedback");
     if (existingErrorMessage) {
         existingErrorMessage.remove(); // Remove any old error message
    }
    
    // Create the error message element
    const errorMessage = document.createElement("p");
    errorMessage.classList.add("invalid-feedback");
    const custErrrorMsg = setCustomerrorMessages(element);

    if(custErrrorMsg.length!=0)
        errorMessage.textContent=custErrrorMsg;
    else
       errorMessage.textContent = `${element.name || element.id} is required here`;

   // Append the error message to the parent element
   element.parentElement.appendChild(errorMessage);
}

/**
 * @function removeErrorIndicators
 * @param {HTMLElement} field 
 * @description - fetch the parent of the targeted elements and remove the error class from the parent elements and also removes the any error Indicator tags like <p class="invalid-feedback">
 * @returns {void} 
 */
function removeErrorIndicators(field){
    field.classList.remove("is-invalid");
    const errorMessage = field.parentNode.querySelector(".invalid-feedback");
    if(errorMessage){
        errorMessage.remove();   
    }
}
/**
 * @param {HTMLFormElement} form - The form element to initialize.
 * @description Initializes dynamic error removal for all input fields in the form.
 */
function initializeDynamicErrorRemoval(form) {
    const ignoreThis  = ["button","submit"]
    const inputs = form.querySelectorAll("input"); // Select all relevant fields
    inputs.forEach((input) => {
        if(ignoreThis.includes(input.type)) return ;
        input.addEventListener("change", () => {
            // Remove error indicators dynamically when the user types
            if (isRequiredFieldsSatisfied(input)) {
                removeErrorIndicators(input);
            }
        });
    });
}

/**
 * Generates custom error messages for email and password fields.
 * @param {HTMLInputElement} field - The form field to validate.
 * @returns {string} - The custom error message, or an empty string if the field is valid.
 */
function setCustomerrorMessages(field) {
    
    if (field.type === "password") {
        if (!(isStrongPassword(field.value)))return "Password must contain at least 8 characters, including uppercase, lowercase, a number, and a special character.";
    }
    if (field.type === "email") {
        if(!(isCorretEmailSyntax(field.value)) )return "Email must contain @ and a valid domain name.";
    }
    return "";
}
/**
 * @param {FormData}
 * @returns {Object}
 */
function convertFormToJsObject(formData){
    return Object.fromEntries(formData.entries());
}

async function loadSearchBar(containerId, callbackFn) {
    const container = document.getElementById(containerId);
        const res = await fetch("/static/component/searchbar/searchBar.component.html");
    const html = await res.text();
    console.log(html)
    container.innerHTML = html;

   // Wait until setupJobSearchComponent is available
    let attempts = 10;
    while (typeof window.setupJobSearchComponent !== "function" && attempts > 0) {
        await new Promise(res => setTimeout(res, 100)); // wait 100ms
        attempts--;
    }

    if (typeof window.setupJobSearchComponent === "function") {
        window.setupJobSearchComponent(callbackFn);
    } else {
        console.error("setupJobSearchComponent not found after retries");
    }
}



function setLocalStorage(jwtToken){
    localStorage.setItem("Authorization", JSON.stringify({ token: jwtToken }));
}
function getLocalStorage(key){
    const value = localStorage.getItem(key);
    try {
        return JSON.parse(value);
    } catch (err) {
        return value;
    }
}

async function logout(){
    try{

        let res = await fetcher("POST","/api/logout",false ,true)
        window.localStorage.clear();        
    }
    catch(err){
        console.error(err)
    }
}

/**
 * @param {"POST"|"GET"} method - HTTP method, must be "POST" or "GET"
 * @param {string|URL} url - The API endpoint
 * @param {Object|null} data - Payload to send (optional for POST)
 * @returns {Promise<any>} - Resolves to parsed JSON response
 */
async function fetcher(method,url,data=null,addHeader=false,withCredentials=false){
    try {
        if (method !== "POST" && method !== "GET")
            throw new Error("Request method must be 'POST' or 'GET'");

        const options = {
            method,
            headers: { "Content-Type": "application/json" },
            credentials: withCredentials ? 'include' : 'same-origin'
        };
        if(addHeader){
            let jwtToken = getLocalStorage("Authorization")??null;
            if(!jwtToken){
                console.error("Token Is Missing ");
            }
            console.table(jwtToken);
            options.headers["Authorization"] = jwtToken.token
        }
        if (method === "POST" && data) {
            options.body = JSON.stringify(data);
        }
        console.table(options.headers);
        const response = await fetch(url, options);
        
        console.warn(options.headers)
        if (!response.ok) {
            throw new Error(`Fetch failed with status ${response.status}`);
        }

        let resData = await response.json();
        return {
            status:response.status,
            body:resData,
            headers:response.headers
        }
    } catch (err) {
        console.error("Fetch Error:", err);
        throw err;
    }
}