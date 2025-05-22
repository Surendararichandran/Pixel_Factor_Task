// jobPost.js
const jobForm = document.getElementById('jobForm');
const jobList = document.getElementById('jobList');

const jobs = new Array();

jobForm.addEventListener('submit', (e) => {

  e.preventDefault();

  const formData = new FormData(jobForm);
/**
 * @type {FormData} - formData
 */
    let job = formDatavalue(formData);
    postNewJob(job,formData);

});
function formDatavalue(formData){
  const job = {

    title: formData.get('title'),
    company: formData.get('company'),
    location: formData.get('location'),
    description: formData.get('description'),

  };
  return job;
}
/**
 * 
 * @param {FormData} formData 
 */
async function postNewJob(jobPostData,formData){
  let res = await fetcher("POST",urlBuilder("/api/post-job"),jobPostData,true)
  console.table(res);
  if(res.status!==201){
    console.error("Can't createa post");
  }
  else{
    console.info("Yay! job posted");
    jobForm.reset()
  }
}