let USER_URL = "https://jsonplaceholder.typicode.com/users";
let POST_URL = "https://jsonplaceholder.typicode.com/posts";

function render(arr) {
  var ol = document.querySelector("ol.output");
  ol.innerHTML = arr
    .map((user) => {
      return `<li>
        <h2 class="user-name" style="cursor:pointer">${user.name}</h2>
        <ol class="post-comments" style="display: none;">
            ${user.posts
              .map((post) => {
                return `
                    <li>
                        <h3>${post.title}</h3>
                        <ol>
                            ${post.comments
                              .map((comment) => {
                                return `<li>
                                    <p>${comment.name}</p>
                                </li>`;
                              })
                              .join("")}
                        </ol>
                    </li>
                `;
              })
              .join("")}
        </ol>
    </li>`;
    })
    .join("");
  var userNames = document.querySelectorAll(".user-name");
  userNames.forEach((name) => {
    name.addEventListener("click", function () {
      var postComments = this.nextElementSibling;
      //   console.log(postComments);
      if (postComments.style.display === "none") {
        postComments.style.display = "block";
      } else {
        postComments.style.display = "none";
      }
    });
  });
}

function getDataPromise2(url2) {
  return new Promise((resolve, reject) => {
    let xhr2 = new XMLHttpRequest();
    xhr2.onload = function () {
      if (xhr2.status === 200) {
        let data = JSON.parse(this.responseText);
        resolve(data);
      } else {
        reject(new Error(xhr2.status));
      }
    };
    xhr2.open("GET", url2);
    xhr2.send();
  });
}

async function getDataAsync2() {
  //get user
  let users = await getDataPromise2(USER_URL);
  //   console.log(users);
  //get allPosts of users
  let allPosts = await Promise.all(
    users.map((user, i) => getDataPromise2(`${USER_URL}/${user.id}/posts`))
  );
  //   console.log(allPosts);
  // assign allPosts with each user
  users.map((user, index) => (user.posts = allPosts[index]));
  //   console.log(users);

  //get comments

  let allComments = await Promise.all(
    allPosts.map((posts) =>
      Promise.all(
        posts.map((post) => getDataPromise2(`${POST_URL}/${post.id}/comments`))
      )
    )
  );
  //   console.log(allComments);
  // assign each comments with each posts => each users
  allComments.forEach((user, i) => {
    // console.log(user);
    user.forEach((comments, j) => {
      //   console.log(comments);
      users[i].posts[j].comments = comments;
    });
  });
  render(users);
}
getDataAsync2();
