const checkLogin = async () => {
    try {
        const res = await fetch("http://127.0.0.1:3000", {
            method: "GET", 
            credentials: "include"
        });
        const message = await res.json();
        if(res.status == 401){
            window.location.href = "/login.html";
        }

        document.querySelector("#profileImage").src = `${message.userdata.image}`;
        document.querySelector(".imgProfile").src = `${message.userdata.image}`;
        console.log(message)
    } catch (err) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.message,
        }); 
    }
}

checkLogin();

export default checkLogin;
