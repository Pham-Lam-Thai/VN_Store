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
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (xhr.status === 200) {
        let data = JSON.parse(xhr.responseText);
        resolve(data);
      } else {
        reject(new Error(xhr.status));
      }
    };
    xhr.open("GET", url2);
    xhr.send();
  });
}

let p = getDataPromise2(USER_URL);
let users = [];
p.then((userResponse) => {
  users = userResponse;
  console.log(users);

  return Promise.all(
    userResponse.map((user) => getDataPromise2(`${USER_URL}/${user.id}/posts`))
  );
})
  .then((allPosts) => {
    // console.log(allPosts);
    users.forEach((user, index) => (user.posts = allPosts[index]));
    return Promise.all(
      allPosts.map((posts) =>
        Promise.all(
          posts.map((post) =>
            getDataPromise2(`${POST_URL}/${post.id}/comments`)
          )
        )
      )
    );
  })
  .then((allComments) => {
    allComments.forEach((user, i) => {
      user.forEach((comments, j) => {
        users[i].posts[j].comments = comments;
        // console.log(users);
      });
    });
    render(users);
  })
  .catch((err) => {
    console.log(err);
  });
