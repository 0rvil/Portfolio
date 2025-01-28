document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const themeStylesheet = document.getElementById("theme-stylesheet");
  const header = document.querySelector("header");
  const nav = document.querySelector("nav");
  const projectsSection = document.getElementById("projects");
  const tagDropdownMenu = document.getElementById("tag-dropdown-menu");
  const educationSection = document.getElementById("education-timeline");
  const courseworkSection = document.getElementById("coursework-timeline");
  const experiencesSection = document.getElementById("experiences-timeline");
  const footerPlaceholder = document.getElementById("footer-placeholder");
  const closeButton = document.getElementById("close-details");

  if (footerPlaceholder) {
    fetch("footer.html")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load footer");
        }
        return response.text();
      })
      .then((footerHTML) => {
        footerPlaceholder.innerHTML = footerHTML;

        const currentTheme = localStorage.getItem("theme") || "light";
        const footer = footerPlaceholder.querySelector("footer");
        if (footer) {
          footer.className =
            currentTheme === "dark"
              ? "bg-dark text-white text-center py-3"
              : "bg-light text-dark text-center py-3";
        }
      })
      .catch((error) => console.error("Error loading footer:", error));
  }

  const applyThemeClasses = (theme) => {
    if (header) {
      header.className =
        theme === "dark"
          ? "bg-dark text-white text-center py-3"
          : "bg-light text-dark text-center py-3";
    }
    const footer = document.querySelector("footer");
    if (footer) {
      footer.className =
        theme === "dark"
          ? "bg-dark text-white text-center py-3"
          : "bg-light text-dark text-center py-3";
    }
    if (nav) {
      nav.className =
        theme === "dark"
          ? "navbar navbar-expand-lg navbar-dark"
          : "navbar navbar-expand-lg navbar-light";
    }
    if (projectsSection) {
      projectsSection.className =
        theme === "dark"
          ? "bg-dark text-white py-5"
          : "bg-light text-dark py-5";
    }

    if (closeButton) {
      closeButton.className =
        theme == "dark" ? "btn-close btn-close-white" : "btn-close";
    }

    const footerIcons = document.querySelectorAll(".footer-icon");
    footerIcons.forEach((icon) => {
      icon.style.color = theme === "dark" ? "white" : "black";
    });
  };

  const getTechClass = (tech) => {
    switch (tech) {
      case "Scratch":
      case "Procreate":
      case "XML":
      case "p5.js":
      case "Numpy":
      case "Processing":
        return "bg-info text-dark";
      case "Sklearn":
      case "mySQL WorkBench":
      case "Swift":
      case "Matplotlib":
      case "DBSCAN":
        return "bg-success";
      case "Android":
      case "Keras":
      case "Xcode":
      case "Dart":
      case "Adobe After Effects":
      case "XML":
      case "HTML":
        return "bg-danger";
      case "Gemini API":
      case "SQL":
      case "Arduino":
      case "Python":
      case "JavaScript":
      case "Laser Cutting":
        return "bg-secondary";
      case "Web":
      case "Flask":
      case "React":
      case "Word2Vec":
      case "Android Studio":
      case "Flutter":
      case "CNN":
        return "bg-primary";
      case "TensorFlow":
      case "Pandas":
      case "iOS":
      case "Java":
      case "Firebase":
      case "CSS":
      case "LibreOffice":
      case "Adobe Illustrator":
        return "bg-warning text-dark";
      default:
        return "bg-dark";
    }
  };

  let allProjects = []; // Variable to store all project data

  const renderProjects = (filteredProjects) => {
    const projectContainer = document.getElementById("project-container");
    projectContainer.innerHTML = ""; // Clear previous projects

    // Helper function to convert 'Month Year' to a Date object
    const parseDate = (dateString) => {
      if (dateString === "Current") {
        return new Date(9999, 11, 31); // Assign a very high date for "Current"
      }
      const [month, year] = dateString.split(" ");
      return new Date(`${month} 1, ${year}`); // Default to the first day of the month
    };

    // Sort projects by date (earliest first)
    filteredProjects.sort((a, b) => parseDate(b.date) - parseDate(a.date));

    filteredProjects.forEach((project) => {
      const projectCard = `
        <div class="col-md-4 mb-4">
          <div class="card" data-bs-toggle="offcanvas" data-bs-target="#projectDetailsOffcanvas" data-project='${JSON.stringify(
            project
          )}'>
            <img src="${project.image}" class="card-img-top" alt="${
        project.title
      }">
            <div class="card-body">
              <h5 class="card-title">${project.title}</h5>
              <h6 class="card-data text-muted">${project.date}</h6>
              <p class="card-text">${project.description}</p>
              <div class="mt-2">
                ${project.technologies
                  .map(
                    (tech) =>
                      `<span class="badge ${getTechClass(
                        tech
                      )} rounded-pill me-2 mb-2">${tech}</span>`
                  )
                  .join("")}
              </div>
            </div>
          </div>
        </div>`;
      projectContainer.innerHTML += projectCard;
    });

    // Attach event listeners to dynamically load project details
    const cards = document.querySelectorAll(
      ".card[data-bs-target='#projectDetailsOffcanvas']"
    );
    cards.forEach((card) => {
      card.addEventListener("click", (e) => {
        const project = JSON.parse(card.getAttribute("data-project"));
        document.getElementById("project-title").textContent = project.title;

        document.getElementById("project-description").innerHTML =
          project.longDesc || project.description || project["short-desc"];

        const techContainer = document.getElementById("project-technologies");
        techContainer.innerHTML = project.technologies
          .map(
            (tech) =>
              `<span class="badge ${getTechClass(
                tech
              )} rounded-pill me-2 mb-2">${tech}</span>`
          )
          .join("");

        // Add a button to open the project link
        const projectLinksContainer = document.getElementById("project-links");
        projectLinksContainer.innerHTML = `<a href="${project.link[0]}" class="btn btn-primary" target="_blank">View Project</a>`;
      });
    });
  };

  const filterProjectsByTag = (tag) => {
    const filteredProjects =
      tag === "All"
        ? allProjects
        : allProjects.filter((project) => project.tags.includes(tag));
    renderProjects(filteredProjects);
  };

  const renderEducation = (educations) => {
    const edutimeline = document.getElementById("education-timeline");
    edutimeline.innerHTML = ""; // Clear existing content

    educations.forEach((education) => {
      const timelineItem = `
      <div class="timeline-item">
        <span class="timeline-icon ${education.bgcolor} text-white">
          <i class="bi bi-mortarboard-fill"></i>
        </span>
        <div class="timeline-content">
          <h5>${education.school}</h5>
          <h6>${education.degree}</h6>
          <p>${education.dates}</p>
        </div>
      </div>`;
      edutimeline.innerHTML += timelineItem;
    });
  };

  // Function to render experiences dynamically
  const renderExperiences = (experiences) => {
    const exptimeline = document.getElementById("experiences-timeline");
    exptimeline.innerHTML = ""; // Clear existing content

    experiences.forEach((experience) => {
      const timelineItem = `
      <div class="timeline-item">
        <span class="timeline-icon ${experience.bgcolor} text-white">
          <i class="${experience.icon}"></i>
        </span>
        <div class="timeline-content">
          <h5>${experience.title}</h5>
          <p><strong>${experience.organization}</strong>. ${experience.date}</p>
          <p>${experience.desc}</p>
        </div>
      </div>`;
      exptimeline.innerHTML += timelineItem;
    });
  };

  // Render coursework dynamically
  const renderCoursework = (coursework) => {
    const timeline = document.getElementById("coursework-timeline");
    timeline.innerHTML = ""; // Clear existing coursework

    coursework.forEach((course) => {
      const timelineItem = `
        <div class="timeline-item">
          <span class="timeline-icon ${course.bgcolor} text-white">
            <i class="${course.icon}"></i>
          </span>
          <div class="timeline-content">
            <h5>${course.title}</h5>
            <p> ${course.taken}</p>
            <p>${course.desc}</p>
          </div>
        </div>`;
      timeline.innerHTML += timelineItem;
    });
  };

  // Initialize theme from localStorage
  const currentTheme = localStorage.getItem("theme") || "light";
  themeStylesheet.href = `${currentTheme}.css`;
  applyThemeClasses(currentTheme);
  themeToggle.innerHTML =
    currentTheme === "dark"
      ? '<i class="bi bi-brightness-high"></i>'
      : '<i class="bi bi-moon"></i>';

  themeToggle.addEventListener("click", () => {
    const newTheme = themeStylesheet.href.includes("dark.css")
      ? "light"
      : "dark";
    themeStylesheet.href = `${newTheme}.css`;
    localStorage.setItem("theme", newTheme);
    applyThemeClasses(newTheme);
    themeToggle.innerHTML =
      newTheme === "dark"
        ? '<i class="bi bi-brightness-high"></i>'
        : '<i class="bi bi-moon"></i>';
  });

  if (educationSection) {
    fetch("./education.json")
      .then((response) => response.json())
      .then((data) => {
        renderEducation(data);
      })
      .catch((error) => console.log("Error loading education:", error));
  }

  // Fetch and render experiences
  if (experiencesSection) {
    fetch("./experiences.json")
      .then((response) => response.json())
      .then((data) => {
        renderExperiences(data);
      })
      .catch((error) => console.error("Error loading experiences:", error));
  }

  // Fetch and render coursework
  if (courseworkSection) {
    fetch("./coursework.json")
      .then((response) => response.json())
      .then((data) => {
        renderCoursework(data);
      })
      .catch((error) => console.error("Error loading coursework:", error));
  }

  // Fetch and render projects
  if (projectsSection) {
    fetch("./Projects/projects.json")
      .then((response) => response.json())
      .then((data) => {
        allProjects = data;

        setTimeout(() => {
          renderProjects(allProjects);

          const allTags = [
            "All",
            ...new Set(data.flatMap((project) => project.tags)),
          ];
          allTags.forEach((tag) => {
            const dropdownItem = document.createElement("a");
            dropdownItem.classList.add("dropdown-item");
            dropdownItem.textContent = tag;
            dropdownItem.addEventListener("click", () => {
              filterProjectsByTag(tag);
              document.getElementById("tag-dropdown-toggle").textContent = tag;
            });
            tagDropdownMenu.appendChild(dropdownItem);
          });

          const defaultTag = "Featured";
          if (allTags.includes(defaultTag)) {
            document.getElementById("tag-dropdown-toggle").textContent =
              defaultTag;
            filterProjectsByTag(defaultTag);
          }
        }, 1000); // 1-second delay
      })
      .catch((error) => console.error("Error loading projects:", error));
  }
});
