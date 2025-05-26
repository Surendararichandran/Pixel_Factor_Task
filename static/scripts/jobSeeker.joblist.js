// jobListHandler.js

window.addEventListener("load",async ()=>{
  await  fetchJobsToApply();
  await  loadSearchBar("searchBarContainer",searchBarFetch);
})
let isBtnAppliedState = false 
/**
     * Render jobs into the container with Bootstrap card layout
     * @param {Array<{id:string,title: string, company: string, description: string, location: string}>} jobs 
     */
function renderJobList(jobs) {
  
    const container = document.getElementById("job-list-container");
    container.innerHTML = ""; // clear previous content

    jobs.forEach(job => {
      const card = document.createElement("div");
      card.className = "card mb-4 shadow-sm";
      // alert(job.id)
      card.innerHTML = `
        <div class="card-body" id = ${job.id}>
          <h5 class="card-title">${job.title}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${job.company} – ${job.location}</h6>
          <p class="card-text">${job.description}</p>
          <button type= "button" class="btn btn-primary" data-jobId="job_${job.id}" onclick = "applyJob(event) ">${ isBtnAppliedState?updateApplyButton(`job_${job.id}`):"Easy Apply"}</button>
        </div>
      `;

      container.appendChild(card);
    });
  }

/**
 * @type {{job_id:string}}
 */
  let dataToBackend ={
    job_id:""
  };
/**
 * 
 * @param {MouseEvent} eve 
 */
function applyJob(eve){
  eve.preventDefault();
  /**
   * @type {HTMLButtonElement} 
   */

    let btn= eve.target
    btn.innerText = "Applying....."
    btn.disabled = true;
    dataToBackend.job_id=btn.getAttribute("data-jobId").split("_")[1];
    try{
        alert(dataToBackend.job_id)
        fetcher("POST",`/api/applyJob`,dataToBackend).then((res)=>{
            updateApplyButton(btn);
            console.log(res.body.data.jobs)
            isBtnAppliedState = true
            // renderJobList(res.body.data.jobs)
            
        }).catch((err)=>{
            console.error(err);
            resetTheButtonStyleInError(btn);
        })
    }
    catch(err){
        console.log(err)
        resetTheButtonStyleInError(btn);
    }

}
/**
 * 
 * @param {HTMLButtonElement|string} applyBtn 
 */
function updateApplyButton(applyBtn){
    if(typeof applyBtn =="string"){
      let btn = document.getElementById(applyBtn)
      updateApplyButton(btn)
      return ;
    }
    applyBtn.classList.add("btn-success")
    applyBtn.innerText = "☑️ Applied "
}
/**
 * 
 * @param {HTMLButtonElement} btn 
 */
function resetTheButtonStyleInError(btn){
    btn.disabled=false;
    btn.innerText = " Easy Apply "
}

async function fetchJobsToApply(){
  try{
    let res =await fetcher("GET","/api/alljobs")
    console.table(res)
    renderJobList(res.body.data.jobs);
  }
  catch(err){

  }
}
async function searchBarFetch(payload){
  alert("searchBarFetch")
  fetcher("POST","/api/search_jobs",payload,true).then((res) =>{
    console.warn(res)
  }).catch(err=>{console.error(err)})
}