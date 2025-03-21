async function searchCourses() {
  const department = document.getElementById("department").value;
  const level = document.getElementById("level").value;
  const day = document.getElementById("day").value;
  const time = document.getElementById("time").value;

  let url = `/student/search?`;
  if (department) url += `department=${department}&`;
  if (level) url += `level=${level}&`;
  if (day) url += `day=${day}&`;
  if (time) url += `time=${time}&`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const resultsDiv = document.getElementById("searchResults");
    resultsDiv.innerHTML = "";

    if (data.courses && data.courses.length > 0) {
      data.courses.forEach((course) => {
        resultsDiv.innerHTML += `<p>${course.courseCode} - ${course.courseName}</p>`;
      });
    } else {
      resultsDiv.innerHTML = "<p>No matching courses found.</p>";
    }
  } catch (err) {
    console.error(err);
  }
}
