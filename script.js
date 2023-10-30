class GithubPerson {
  name;
  publicRepos;
  publicGists;
  followers;
  following;
  company;
  website;
  location;
  memberSince;
  API_URL;

  constructor(
    API_URL,
    accessToken,
    name,
    publicRepos,
    publicGists,
    followers,
    following,
    company,
    website,
    location,
    memberSince
  ) {
    this.API_URL = "https://api.github.com/users/"
    this.accessToken = "Mytoken";
    this.name = name;
    this.publicRepos = publicRepos;
    this.publicGists = publicGists;
    this.followers = followers;
    this.following = following;
    this.company = company;
    this.website = website;
    this.location = location;
    this.memberSince = memberSince;
  }
}
//변수들 정의
const githubForm = document.querySelector("#github-form");
const githubUsernameInput = document.querySelector("#github-username");
const profileButtonClick = document.querySelector(".view-profile");
const repository = document.querySelector(".repository");
const profilePersonNickname = document.querySelector('.profile-person-nickname');
const liCompany = document.querySelector('.li-company');
const liWebsite = document.querySelector('.li-website');
const liLocation = document.querySelector('.li-Location');
const liMemberSince = document.querySelector('.li-membersince');
const reposDivs = document.querySelectorAll('.repository > div');
const profileInfo1 = document.querySelector('.profile-info1 span');
const profileInfo2 = document.querySelector('.profile-info2 span');
const profileInfo3 = document.querySelector('.profile-info3 span');
const profileInfo4 = document.querySelector('.profile-info4 span');
const githubUserName = githubUsernameInput.value

//변수 선언(getUser()안에 있는 값 꺼내오려고)
let jsonData = [];
let repoData = []; 

//로컬스토리지에 저장하려고 함

function loadFromLocalStorage(username, data) {
  localStorage.setItem('json_Data', username);
  localStorage.setItem('repo')
  
  if (data) {
    jsonData = JSON.parse(data);
  }
}

function saveToLocalStorage() {
  const data = JSON.stringify(jsonData); //string으로 변환시켜주는 것
  window.localStorage.setItem('jsonData',data); //setItem(key, value)
}

function saveToLocalStorage2() {
  const data = JSON.stringify(repoData); //string으로 변환시켜주는 것
  window.localStorage.setItem('repoData',data); //setItem(key, value)
}



//이벤트 리스너들
profileButtonClick.addEventListener("click", goToProfile);
githubForm.addEventListener("submit", githubFormSubmit);

//이벤트 리스너에 연결된 함수들
function goToProfile() {
  window.open(`https://github.com/${githubUserName}`)
}

//submit됐을 때 실행되는 함수
function githubFormSubmit(event) {
  event.preventDefault();
  getUser();
  const elementsToUnhide = document.querySelectorAll('.hidden');
  elementsToUnhide.forEach(element => {
    element.classList.remove('hidden');
  });
}


//위 getUser()에서 사용되는 함수
//사진, 이름, 회사 등등을 innerHtml에 집어넣어준다.

async function getUser() {
  const userId = githubUsernameInput.value;
  const response = await fetch('https://api.github.com/users/' + userId, {
    headers: {
      'Authorization': 'Bearer' + GithubPerson.accessToken
    }
  });
  const jsonData = await response.json();
  
const repoResponse = await fetch(`https://api.github.com/users/${userId}/repos`, {
    headers: {
      'Authorization': 'Bearer' + GithubPerson.accessToken
    }
  });
  const repoData = await repoResponse.json();


  const profilePhotoDiv = document.querySelector('.profile-photo');
  if (jsonData.avatar_url) { // avatar_url이 존재하는지 확인
    profilePhotoDiv.innerHTML = `<img src="${jsonData.avatar_url}" alt="${userId}'s profile photo">`;
  }

  profilePersonNickname.innerHTML = jsonData.login;
  liCompany.innerHTML = jsonData.company ? jsonData.company : 'N/A'; // 만약 company 정보가 없으면 'N/A' 표시
  liWebsite.innerHTML = jsonData.blog ? jsonData.blog : 'N/A';
  liLocation.innerHTML = jsonData.location ? jsonData.location : 'N/A';
  liMemberSince.innerHTML = new Date(jsonData.created_at).toLocaleDateString(); // 가입 날짜를 보기 좋은 형식으로 변환
  profileInfo1.innerHTML = jsonData.public_repos
  profileInfo2.innerHTML = jsonData.public_gists
  profileInfo3.innerHTML = jsonData.followers
  profileInfo4.innerHTML = jsonData.following

  for (let i = 0; i < Math.min(repoData.length, 5); i++) {
    reposDivs[i].innerHTML = `
      <h3>${repoData[i].name}</h3>
      <p>${repoData[i].description}</p>
      <a href="${repoData[i].html_url}" target="_blank">Go to repository</a>
    `;
  }
}