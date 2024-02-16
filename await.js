// function promiseDivided(x, y) {
//     if (y === 0) {
//         return Promise.reject(new Error("Cannot divide by 0"))
//     } else {
//         return Promise.resolve(x / y);
//     }
// }
// async function dividedWithAwait() {
//     try {
//         return await promiseDivided(4, 2)
//     } catch (error) {
//         console.log('Error ====>', error.message)
//     }
// }
// async function dividedWithOutAwait() {
//     return promiseDivided(4, 0)
// }
// async function run() {
//     const rs = await dividedWithAwait();
//     const rs2 = await dividedWithOutAwait();
//     console.log(`divide with await === ${rs}`)
//     console.log(`divide without await === ${rs2}`)

// }
// run()

// let USER_URL = "https://jsonplaceholder.typicode.com/users";
// let POST_URL = "https://jsonplaceholder.typicode.com/posts";

function render(arr) {
  console.log(arr);
  var ol = document.querySelector("ol.output");
  ol.innerHTML = arr
    .map((user) => {
      return `<li>
        <h2>${user.name} (${user.email})</h2>
        <ol>
                ${user.posts
                  .map((post) => {
                    return `<li>
                        <h3>${post.title}</h3>
                        <ol>${post.comments
                          .map((comment) => {
                            return `<li>
                                        <p>${comment.name}</p>
                                    </li>`;
                          })
                          .join("")}
                        </ol>
                    </li>`;
                  })
                  .join("")}
        </ol>
    </li>`;
    })
    .join("");
}

function getDataPromise(url) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();

    xhr.onload = function () {
      // console.log(xhr.responseText);
      if (xhr.status === 200) {
        let data = JSON.parse(xhr.responseText);
        resolve(data);
      } else {
        reject(new Error(xhr.status));
      }
    };

    xhr.open("GET", url);

    xhr.send();
  });
}

async function getDataAsync() {
  //get users
  let users = await getDataPromise(USER_URL);
  console.log(users);

  let posts = await Promise.all(
    users.map((user) => getDataPromise(`${USER_URL}/${user.id}/posts`))
  );
  console.log(posts);

  //get posts
  users.forEach((user, index) => (user.posts = posts[index]));
  //get comments
  // let comments = await Promise.all(posts.flat().map((post) => getDataPromise(`${POST_URL}/${post.id}/comments`)));f
  // console.log(comments)

  let allComments = await Promise.all(
    posts.map((posts) =>
      Promise.all(
        posts.map((post) => {
          getDataPromise(`${POST_URL}/${post.id}/comments`);
        })
      )
    )
  );
  allComments.forEach((user, index) => {
    user.forEach((comments, j) => {
      users[index].posts[j].comments = comments;
    });
  });
  render(users);
}
getDataAsync();
