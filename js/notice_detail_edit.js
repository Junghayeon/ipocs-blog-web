const Url = window.location.href;
const arr = Url.split("?postId=");
const id = arr[1];
const url = `http://34.64.161.55:80/api/posts/${id}`;
let sessiontoken = localStorage.getItem("sessionToken");
let header = new Headers({ "x-pocs-session-token": sessiontoken });

let user_Id;

let category;

//공지사항 제목, 공지사항 내용 가져오기
const notice_title = document.querySelector("#title");
const notice_content = document.querySelector("#content");
const flexCheckDefault = document.querySelector("#flexCheckDefault");

function NoticeEditPage() {
  fetch(url, { headers: header })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      notice_title.value = `${data.data.title}`;
      notice_content.value = `${data.data.content}`;
      flexCheckDefault.checked = data.data.onlyMember;
      user_Id = data.data.writer.userId;
      category = data.data.category;
      console.log(user_Id);
    });
}
//공지사항 수정하기 버튼 눌렀을때 호출되는 함수
async function noticeEdit() {
  const sendData = {
    userId: user_Id,
    title: notice_title.value,
    content: notice_content.value,
    onlyMember: flexCheckDefault.checked,
    category: category,
  };

  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-pocs-session-token": sessionToken,
    },
    body: JSON.stringify(sendData),
  };

  const response = await fetch(
    `http://34.64.161.55:80/api/posts/${id}`,
    options
  );
  const result = await response.json();
  if (result.status === 302) {
    backToList();
  } else {
    console.log(result.message);
  }
}
//목록으로 버튼을 누르면 다시 공지사항목록으로 복귀
function backToList() {
  window.location.href = "../html/notices.html";
}

NoticeEditPage();
