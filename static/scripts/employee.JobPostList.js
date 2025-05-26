/**
 * @type {HTMLDivElement}
 */
let  jobList;
/**
 * @type {Array<{jobId:string,title: string, company: string, description: string, location: string}>} jobs 
 */
let jobs = [
    // {
    //     jobId:"1",
    //     title: 'Frontend Developer',
    //     company: 'TechNova Solutions',
    //     location: 'Bangalore, India',
    //     description: 'We are looking for a React.js developer with strong skills in JavaScript, HTML, and CSS.'
    // },
    // {
    //     jobId:"2",
    //     title: 'Backend Engineer',
    //     company: 'CloudCore Systems',
    //     location: 'Chennai, India',
    //     description: 'Join our team to build scalable APIs using Node.js and MongoDB.'
    // },
    // {
    //     jobId:"3",
    //     title: 'UI/UX Designer',
    //     company: 'PixelCraft Studio',
    //     location: 'Remote',
    //     description: 'Design modern and intuitive user interfaces for mobile and web platforms.'
    // },
    // {
    //     jobId:"4",
    //     title: 'DevOps Engineer',
    //     company: 'InfraScale Pvt Ltd',
    //     location: 'Hyderabad, India',
    //     description: 'Maintain CI/CD pipelines, manage AWS infrastructure, and automate deployments.'
    // },
    // {
    //     jobId:"5",
    //     title: 'Data Analyst',
    //     company: 'InsightWave Analytics',
    //     location: 'Mumbai, India',
    //     description: 'Analyze business data using Python, SQL, and Power BI to derive actionable insights.'
    // }
];


function renderJobs() {
    jobList.innerHTML = "";
    jobs.forEach((job, index) => {
    const col = document.createElement('div');
    col.className = "col-md-6 col-lg-4";
    col.innerHTML = `
        <div class="card h-100 shadow">
            <div class="card-body" id="${job.id}">
                <h5 class="card-title">${job.title}</h5>
                <h6 class="card-subtitle text-muted mb-2">${job.company} – ${job.location}</h6>
                <p class="card-text">${job.description}</p>
                <button class="btn btn-sm btn-danger w-100" onclick="deleteJob(${index})">Delete</button>
            </div>
        </div>`;
        jobList.appendChild(col);
    });
}



function deleteJob(index) {
    jobs.splice(index, 1);
    renderJobs();
}
window.addEventListener("load",async ()=>{
    jobList = document.getElementById('jobList');
    await  loadSearchBar("searchBarContainer",()=>{})
    await loadJobs();
    renderJobs();
})

function UpdatejobsNRerender(jobsList){
    jobs=jobsList;
    if(Array.isArray(jobsList)) console.warn("isArrray");
    else console.error("IsNOtarray ");
    renderJobs()
}

/**@type {{body:{},headers:Headers}} - res */
async function loadJobs(){
    // alert("Loading jobs......")
    try {
        const res = await fetcher("GET", "/api/loadJobsList", null, true);
        UpdatejobsNRerender(res.body.data.jobs);
    } catch (err) {
        console.error(err);
    }
}