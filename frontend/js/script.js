let toggleBtn = document.getElementById('toggle-btn');
let body = document.body;
let darkMode = localStorage.getItem('dark-mode');

const enableDarkMode = () => {
    toggleBtn.classList.replace('fa-sun', 'fa-moon');
    body.classList.add('dark');
    localStorage.setItem('dark-mode', 'enabled');
 }
 
 const disableDarkMode = () => {
    toggleBtn.classList.replace('fa-moon', 'fa-sun');
    body.classList.remove('dark');
    localStorage.setItem('dark-mode', 'disabled');
 }
 
 if (darkMode === 'enabled') {
    enableDarkMode();
 }
 
 toggleBtn.onclick = (e) => {
    darkMode = localStorage.getItem('dark-mode');
    if (darkMode === 'disabled') {
       enableDarkMode();
    } else {
       disableDarkMode();
    }
 }

let profile = document.querySelector('.header .flex .profile');

document.querySelector('#user-btn').onclick = () => {
   profile.classList.toggle('active');
   search.classList.remove('active');
}

let search = document.querySelector('.header .flex .search-form');

document.querySelector('#search-btn').onclick = () => {
   search.classList.toggle('active');
   profile.classList.remove('active');
}

let sideBar = document.querySelector('.side-bar');

document.querySelector('#menu-btn').onclick = () => {
   sideBar.classList.toggle('active');
   body.classList.toggle('active');
}

document.querySelector('#close-btn').onclick = () => {
   sideBar.classList.remove('active');
   body.classList.remove('active');
}

window.onscroll = () => {
    profile.classList.remove('active');
    search.classList.remove('active');
 
    if (window.innerWidth < 1200) {
       sideBar.classList.remove('active');
       body.classList.remove('active');
    }
 }

 // script.js

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
 
    signupForm.addEventListener('submit', function (event) {
       event.preventDefault();
 
       const name = document.getElementById('name').value;
 
       // Save the profile name in localStorage
       localStorage.setItem('profileName', name);
 
       // Redirect to home page after registration
       window.location.href = 'home.html';
    });
 
    // Display the user's name on the home page
    const profileName = localStorage.getItem('profileName');
    if (profileName) {
       document.getElementById('profile-name').textContent = profileName;
       document.getElementById('sidebar-profile-name').textContent = profileName;
    }
 
    // Handle profile image upload
    const photoUpload = document.getElementById('photo-upload');
    photoUpload.addEventListener('change', function () {
       const file = this.files[0];
       if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
             const imageUrl = e.target.result;
             document.getElementById('profile-img').src = imageUrl;
             document.getElementById('sidebar-profile-img').src = imageUrl;
             // Save the image in localStorage
             localStorage.setItem('profileImage', imageUrl);
          };
          reader.readAsDataURL(file);
       }
    });
 
    // Check if there's a saved profile image in localStorage
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
       document.getElementById('profile-img').src = savedImage;
       document.getElementById('sidebar-profile-img').src = savedImage;
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("profile-form");
    form.addEventListener("submit", async (e) => {
       e.preventDefault();
 
       const name = document.getElementById("name").value;
       const email = document.getElementById("email").value;
       const profilePicInput = document.getElementById("profile-pic");
       const profilePic = profilePicInput.files[0];
 
       const formData = new FormData();
       formData.append("name", name);
       formData.append("email", email);
       if (profilePic) {
          formData.append("profilePic", profilePic);
       }
 
       try {
          const response = await fetch("/api/update_profile", {
             method: "POST",
             body: formData,
          });
          const result = await response.json();
 
          if (result.success) {
             document
                .querySelectorAll(".profile .name")
                .forEach((el) => (el.textContent = result.profile.name));
             if (profilePic) {
                const reader = new FileReader();
                reader.onload = (e) => {
                   document
                      .querySelectorAll(".profile .image")
                      .forEach((el) => (el.src = e.target.result));
                };
                reader.readAsDataURL(profilePic);
             }
             alert("Profile updated successfully");
          } else {
             alert("Error updating profile: " + result.error);
          }
       } catch (error) {
          console.error("Error:", error);
          alert("An error occurred while updating the profile.");
       }
    });

    // Fetch and load existing profile data on page load
   async function loadProfile() {
    try {
       const response = await fetch("/api/profile");
       const profile = await response.json();
       if (profile) {
          document.getElementById("profile-section").innerHTML = await fetch('profile-section.html').then(response => response.text());
          document
             .querySelectorAll(".profile .name")
             .forEach((el) => (el.textContent = profile.name));
          document
             .querySelectorAll(".profile .role")
             .forEach((el) => (el.textContent = "student"));
          if (profile.profilePic) {
             document
                .querySelectorAll(".profile .image")
                .forEach((el) => (el.src = profile.profilePic));
          }
       }
    } catch (error) {
       console.error("Error fetching profile data:", error);
    }
 }

 loadProfile();
});