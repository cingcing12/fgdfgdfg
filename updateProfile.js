import checkLogin from "./checkLogin.js";

const containerImg = document.querySelector("#containerImg");
const imgProfile = document.querySelector(".imgProfile");
const imgInput = document.getElementById("imgInput");
const btnLogout = document.querySelector(".btnLogout");
const containerMenuLogout = document.querySelector('.containerMenuLogout');
const containeLogoutContent = document.querySelector('.containeLogoutContent');

let selectedFile = null;

// Preview image
imgInput.addEventListener("change", function () {
  selectedFile = this.files[0];
  if (selectedFile) {
    const url = URL.createObjectURL(selectedFile);
    imgProfile.src = url;
  }
});

// Submit form (upload image)
containerImg.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    if (!selectedFile) {
      return Swal.fire({
        icon: "warning",
        title: "No file selected",
        text: "Please choose an image before uploading!",
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    const res = await fetch("http://127.0.0.1:3000/updateProfile", {
      method: "POST",
      body: formData,
      credentials: "include", // keep session
    });

    const data = await res.json();
    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "Profile updated!",
        text: "Your profile picture has been updated.",
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      throw new Error(data.message || "Upload failed!");
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: err.message,
      position: "top-end",
      showConfirmButton: true,
    });
  }
});

containerMenuLogout.addEventListener('click', (e) => {
    e.stopPropagation()
    containeLogoutContent.classList.toggle('active');

    containeLogoutContent.addEventListener('click', (e) => {
        e.stopPropagation();
    })

    document.addEventListener('click', () => {
        containeLogoutContent.classList.remove('active');
    })
})

// logout
btnLogout.addEventListener("click", async () => {
  try {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch("http://127.0.0.1:3000/logout", {
          method: "POST",
          credentials: "include",
        });

        const message = await res.json();
        if (res.ok) {
          Swal.fire({
            icon: "success",
            title: message,
            text: "Your session has been destroy!",
            position: "top-end",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            window.location.href = "/login.html";
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: message.err,
            position: "top-end",
            showConfirmButton: true,
          });
        }
      }
    });
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: err.message,
      position: "top-end",
      showConfirmButton: true,
    });
  }
});
