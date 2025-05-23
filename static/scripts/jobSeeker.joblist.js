// jobListHandlere.js

window.addEventListener("load",async ()=>{
  await  fetcjobsToApply();
 await  loadSearchBar("searchBarContainer",()=>{});
})
/**
     * Render jobs into the container with Bootstrap card layout
     * @param {Array<{jobId:string,title: string, company: string, description: string, location: string}>} jobs 
     */
function renderJobList(jobs) {
    const container = document.getElementById("job-list-container");
    container.innerHTML = ""; // clear previous content

    jobs.forEach(job => {
      const card = document.createElement("div");
      card.className = "card mb-4 shadow-sm";

      card.innerHTML = `
        <div class="card-body" id = ${job.jobId}>
          <h5 class="card-title">${job.title}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${job.company} – ${job.location}</h6>
          <p class="card-text">${job.description}</p>
          <button type= "button" class="btn btn-primary" jobId=${job.jobId} onclick = "applyJob(event) "> Easy Apply </button>
        </div>
      `;

      container.appendChild(card);
    });
  }



//   Dummy Jobs List 
const jobs = [
    {
      jobId: "job-1",
      title: "Frontend Developer",
      company: "Tech Corp",
      description: "Work on cutting-edge UIs using React and Bootstrap.",
      location: "Remote"
    },
    {
      jobId: "job-2",
      title: "Backend Engineer",
      company: "Cloudify Inc",
      description: "Build scalable APIs with Node.js and Express.",
      location: "Bangalore, India"
    },
    {
      jobId: "job-3",
      title: "UI/UX Designer",
      company: "DesignHub",
      description: "Design sleek interfaces for mobile and web applications.",
      location: "Remote"
    }
  ];



/**
 * @type {{userId:string,AppliedJobId:string[]}}
 */
  let dataToBackend ={
    AppliedJobId:""
  };
/**
 * 
 * @param {MouseEvent} eve 
 */
function applyJob(eve){
  /**
   * @type {HTMLButtonElement} 
   */
    let btn= eve.target
    btn.innerText = "Appliying....."
    btn.disabled = true;
    dataToBackend.AppliedJobId.push(btn.getAttribute("jobID"));
    console.table(dataToBackend)
    try{

        fetcher("POST",urlBuilder(`/api/applyJobs`),dataToBackend).then((res)=>{
            updateApplyButton(btn);

            
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
 * @param {HTMLButtonElement} applyBtn 
 */
function updateApplyButton(applyBtn){
    
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
// function UpdatejobsNRerender(jobsList){
//     jobs=jobsList;
//     if(Array.isArray(jobsList)) console.warn("isArrray");
//     else console.error("IsNOtarray ");
//     renderJobs()
// }
async function fetcjobsToApply(){
  try{
    let res =await fetcher("GET",urlBuilder("/api/alljobs"))
    renderJobList(res.body.data.jobs);
  }
  catch(err){

  }
}