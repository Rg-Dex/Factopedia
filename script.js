//in js ' ' & " " works same.
console.log("Hello World!");
const btn = document.querySelector(".btn-open");
const form = document.querySelector(".fact-form");
const factsList = document.querySelector(".facts-list");

console.dir(btn);
factsList.innerHTML = "";

loadFacts();

async function loadFacts() {
  const res = await fetch(
    "https://eknshemceaemaiwtjyws.supabase.co/rest/v1/Facts",
    {
      headers: {
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbnNoZW1jZWFlbWFpd3RqeXdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ5NTQ4MTcsImV4cCI6MjAxMDUzMDgxN30.4QGN9IS5trGfNWeHD3BzeRLnO3fyO3brz-q7XFI9XeY",
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbnNoZW1jZWFlbWFpd3RqeXdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ5NTQ4MTcsImV4cCI6MjAxMDUzMDgxN30.4QGN9IS5trGfNWeHD3BzeRLnO3fyO3brz-q7XFI9XeY",
      },
    }
  );
  const data = await res.json();
  createFactsList(data); // to be defined when i complete the previous lecture properly lecture 14
  //console.log(data);
}

btn.addEventListener("click", function () {
  //console.log("click");  for checking
  //factsList.innerHTML = ""; for checking

  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    btn.textContent = "Close";
    // ptr .contains aur .remove me koi .hidden ni laga
  } else {
    form.classList.add("hidden");
    btn.textContent = "Share a fact";
  }
});
