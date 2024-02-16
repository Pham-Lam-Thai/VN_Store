// HTTP Verbs: GET, POST, PUT, DELETE
// HTTp Status Codes: 1xx, 2xx, 3xx, 4xx, 5xx
// API Standards: gRPC, SOAP, Rest, GrapQL
// Rest vaf Restfull
// JSON:
// + Tên key phải nằm trong cặp nháy kép
// + key có thể có giá trị bất kỳ trừ function

// JSON
// let obj = {
//   fname: "john doe",
//   base: 1000,
//   email: "john@gmail.com",
//   sayHi: function () {
//     console.log(this.fname);
//   },
// };

// let json = JSON.stringify(obj);
// console.log(json);

// let obj2 = JSON.parse(json);
// console.log(obj2);

// lm việc với bất đồng bộ: dom, ajax,
// ajax
// function getData(url, callback) {
//   let xhr = new XMLHttpRequest();

//   xhr.onload = function () {
//     // console.log(xhr.responseText);
//     if (xhr.status === 200) {
//       let data = JSON.parse(xhr.responseText);
//       callback(undefined, data);
//     } else {
//       callback(Error(xhr.status));
//     }
//   };

//   xhr.open("GET", url);

//   xhr.send();
// }
// console.log(xhr);

let USER_URL = "https://jsonplaceholder.typicode.com/users";
let POST_URL = "https://jsonplaceholder.typicode.com/posts";

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
                                <p>
                                ${comment.name}
                                </p>
                            </li>`;
                      })
                      .join("")}</ol>
                    </li>`;
                  })
                  .join("")}
        </ol>
    </li>`;
    })
    .join("");
}

// getData(USER_URL, function (userErr, users) {
//   if (userErr) {
//     console.log(userErr);
//     return;
//   }

//   console.log(users);

//   let count = 0;
//   let totalPosts = 0;

//   users.forEach((user) => {
//     getData(`${USER_URL}/${user.id}/posts`, (postErr, posts) => {
//       if (postErr) {
//         console.log(postErr);
//         return;
//       }
//       // console.log(posts);
//       user.posts = posts;
//       totalPosts += posts.length;

//       posts.forEach((post) => {
//         getData(`${POST_URL}/${post.id}/comments`, (commentErr, comments) => {
//           if (commentErr) {
//             console.log(commentErr);
//             return;
//           }
//           // console.log(comments);
//           post.comments = comments;
//           count++;
//           // console.log(count);
//           if (count === totalPosts) {
//             render(users);
//           }
//         });
//       });
//     });
//   });
// });

// promise
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

let p = getDataPromise(USER_URL);

// promise chain
// to handler error in promise
let users = [];
p.then((usersResponse) => {
  // console.log(users);
  users = usersResponse;
  let arr = usersResponse.map((user) =>
    getDataPromise(`${USER_URL}/${user.id}/posts`)
  );
  return Promise.all(arr);
})
  .then((allPosts) => {
    // console.log(posts)
    users.forEach((user, i) => (user.posts = allPosts[i]));

    //solution1:
    // let array2 = posts.flat().map((post) => getDataPromise(`${POST_URL}/${post.id}/comments`));
    // return Promise.all(array2);

    //solution2:
    return Promise.all(
      allPosts.map((posts) =>
        Promise.all(
          posts.map((post) => getDataPromise(`${POST_URL}/${post.id}/comments`))
        )
      )
    );
  })
  .then((allComments) => {
    // console.log(allComments);
    allComments.forEach((user, i) => {
      user.forEach((comments, j) => {
        users[i].posts[j].comments = comments;
      });
    });
    render(users);
  })
  .catch((err) => {
    console.log(err);
  });

// function createDataPromise(url, data) {
//     return new Promise((resolve, reject) => {
//         let xhr = new XMLHttpRequest();
//         xhr.onload = function () {
//             if (xhr.status >= 200 && xhr.status <= 299) {
//                 resolve(xhr.status)
//             } else {
//                 reject("")
//             }
//         }
//         xhr.open("POST", url);
//         xhr.setRequestHeader("content-type", "application/json;charset=UTF-8")
//         xhr.send(JSON.stringify(data));
//     })
// }
// createDataPromise("https://jsonplaceholder.typicode.com/todos", {
//     userId: 1,
//     id: 1,
//     title: "Hnoi aut item",
//     completed: false,
// }).then(response => {
//     console.log(response)
// }).catch((err) => {
//     console.log(err.message)
// })

// fetch("https://jsonplaceholder.typicode.com/todos")
//     .then((res) => {
//         return res.json();
//     })
//     .then((data) => {
//         console.log(data)
//     })
//     .catch(() => {

//     })
