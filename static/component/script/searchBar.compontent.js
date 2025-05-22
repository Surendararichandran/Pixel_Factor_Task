export function setupJobSearchComponent(dataList, renderCallback) {
    const form = document.getElementById("jobSearchForm");
    const exportBtn = document.getElementById("jobExportBtn");
  
    let filtered = [...dataList];
  
    const filterData = (formData) => {
      const keyword = formData.get("keyword").toLowerCase();
      const location = formData.get("location");
      const company = formData.get("company");
  
      return dataList.filter(job => {
        return (
          (!keyword || job.title.toLowerCase().includes(keyword) || job.description.toLowerCase().includes(keyword)) &&
          (!location || job.location === location) &&
          (!company || job.company === company)
        );
      });
    };
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      filtered = filterData(formData);
      renderCallback(filtered); // send to parent page to render
    });
  
    exportBtn.addEventListener("click", () => {
      const csv = filtered.map(job =>
        `"${job.title}","${job.company}","${job.location}","${job.description.replace(/\n/g, " ")}"`
      ).join("\n");
      const blob = new Blob(["Title,Company,Location,Description\n" + csv], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "filtered_jobs.csv";
      link.click();
    });
  
    // Initial load
    renderCallback(filtered);
  }
  