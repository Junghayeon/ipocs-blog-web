const validationUrl = "http://34.64.161.55:8001/auth/validation";
const logoutUrl = "http://34.64.161.55:8001/auth/logout";
const toggle = document.getElementById("toggle");
const sessionToken = localStorage.getItem("sessionToken");
const toggleDetail = document.getElementById("toggleDetail");
const navItem = document.getElementById("navItem");
const adminBtn = document.getElementById("adminBtn");
const localStorage_userId = localStorage.getItem("userId");
let user_type = localStorage.getItem("userType");

if((sessionToken === null || user_type === "비회원") && window.location.href.match("qa") === null){
    window.location.href="../html/qa.html"
}

function preventChanginguserId(){
    window.addEventListener("storage", ()=>{
        alert("userId값은 변경될수 없습니다!");
        localStorage.removeItem("userId");
        localStorage.setItem("userId", localStorage_userId);
    })
}

async function handleToggle(event){
    event.preventDefault();

    if(!toggle.classList.contains("show")){
        return;
    }

    if(sessionToken != null){
        let user = await handleValidation(sessionToken);
        if(user.userId != null){
            settingToggle(user.userId);    
        }
        else{
            console.log("유효하지 않은 토큰입니다.");
        }
    }
    else{
        settingToggle("loginFirst");
    }
}

async function handleValidation(token){
    const options = {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
            'x-pocs-session-token' : token
        }
    };

    const response = await fetch(validationUrl, options);
    const result = await response.json();

    console.log(result);

    if(result.status === 200){
        console.log(result.data.user);
        return result.data.user;
    }
    else{
        console.log(result.message);
        return false;
    }
}

function settingToggle(userId){
    if(userId === "loginFirst"){
        toggleDetail.innerHTML = `<li><a class="dropdown-item" href="../html/index.html">로그인</a></li>`;
    }
    else{
        toggleDetail.innerHTML = 
        `
            <li><a class="dropdown-item" href="../html/user_detail_edit.html?userId=${userId}">내 정보 수정</a></li>
            <li><a class="dropdown-item" href="#" onclick="handleLogout()">로그아웃</a></li>
        `;
    }
}

async function handleLogout(event){
    //event.preventDefault();

    const options = {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
            'x-pocs-session-token' : sessionToken
        }
    };

    const response = await fetch(logoutUrl, options);
    const result = await response.json();

    console.log(result);

    if(result.status === 200){
        localStorage.removeItem("sessionToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userType");
        window.location.href = "../html/qa.html"
        alert("로그아웃 되었습니다.")
    }
    else{
        console.log(result.message);
    }
}

async function handleNavigation(){
    if(sessionToken != null){
        let user = await handleValidation(sessionToken);
        if(user.type === "admin"){
            console.log(user.type);
            //관리자 메뉴
            // const li = document.createElement("li");
            // li.classList = "nav-item";
            // const a = document.createElement("a");
            // a.href="../html/admin.html";
            // a.classList= "nav-link";
            // a.innerText="Admin";
            // li.appendChild(a);
            // navItem.appendChild(li);    

            adminBtn.classList.toggle("hidden");
            try{
                const noticeBtn = document.getElementById("noticeBtn");
                noticeBtn.classList.toggle("hidden");
            }
            catch{

            }
            try{
                const noticeEditBtn = document.getElementById("noticeEditBtn");
                noticeEditBtn.classList.toggle("hidden");
            }
            catch{

            }
        }
    }
}

window.addEventListener("load", handleNavigation);
toggle.addEventListener("click", handleToggle);
preventChanginguserId();


//네비게이션 공통
function moveMainPage(event) {
    if (user_type === null || user_type === "비회원") {
        moveLoginPage();
        //alert("블로그 회원만 조회 가능합니다.");
    }
    else {
        window.location.href = `../html/main.html`;
    }
}

//홈페이지에서 공지사항 더보기 눌렀을때 공지사항 페이지로 이동
function moveNoticePage(event) {
    if (user_type === null || user_type === "비회원") {
        moveLoginPage();
        //alert("블로그 회원만 조회 가능합니다.");
    }
    else {
        window.location.href = `../html/notices.html`;
    }
}

function movePostPage() {
    if (user_type === null || user_type === "비회원") {
        moveLoginPage();
        //alert("블로그 회원만 조회 가능합니다.");
    }
    else {
        window.location.href = `../html/posts.html`;
    }
}

function moveUserPage() {
    if (user_type === null || user_type === "비회원") {
        moveLoginPage();
        //alert("블로그 회원만 조회 가능합니다.");
    }
    else {
        window.location.href = `../html/user.html`;
    }
}

//alert대신 사용하면 됨(로그인페이지로 이동가능)
function moveLoginPage() {
    if (confirm("블로그 회원만 조회 가능합니다.\n로그인하시겠습니까?")) {
        window.location.href = `../html/index.html`;
    }
    else {
        return;
    }
}