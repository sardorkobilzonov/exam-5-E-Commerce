const wrapperEl = document.querySelector(".wrapper");
const loadingEl = document.querySelector(".loading");
const btnSeemore = document.querySelector(".btn__seemore");
const collectionEl = document.querySelector(".collection");
const categoryLoadingEl = document.querySelector(".category__loading");
const searchInputEl = document.querySelector(".search input");
const searchDropEl = document.querySelector(".search__drop");

const BASE_URL = "https://dummyjson.com";

const perPageCount = 10;
let offset = 0;
let productEndpoint = "/products";

// PRODUCT FETCH
async function fetchData(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  response
    .json()
    .then((res) => {
      createCard(res);
      if (res.total <= perPageCount + offset * perPageCount) {
        btnSeemore.style.display = "none";
      } else {
        btnSeemore.style.display = "block";
      }
    })
    .catch((err) => console.log(err))
    .finally(() => {
      loadingEl.style.display = "none";
      btnSeemore.removeAttribute("disabled");
      btnSeemore.textContent = "See more";
    });
}

// SAYT YUKLANGANDA ISHLAYDI
window.addEventListener("load", () => {
  collectionEl.style.display = "none";
  createLoading(perPageCount);
  fetchData(`${productEndpoint}?limit=${perPageCount}`);
  // fetchCategory("/products/category-list");
});

// LOADING CREATOR
function createLoading(n) {
  loadingEl.style.display = "grid";
  loadingEl.innerHTML = null;
  Array(n)
    .fill()
    .forEach(() => {
      const div = document.createElement("div");
      div.className = "loading__item";
      div.innerHTML = `
            <div class="loading__image to-left"></div>
            <div class="loading__title to-left"></div>
            <div class="loading__title to-left"></div>
        `;
      loadingEl.appendChild(div);
    });
}

// CARD CREATOR
function createCard(data) {
  // while(wrapperEl.firstChild){
  //     wrapperEl.firstChild.remove()
  // }
  data.products.forEach((product) => {
    const divEl = document.createElement("div");
    divEl.className = "card";
    divEl.innerHTML = `
            <img data-id=${product.id} src=${product.thumbnail} alt="rasm">
            <h3 class="product-h3">${product.title}</h3>
            <p class="product-price">$${product.price}</p>
        `;
    wrapperEl.appendChild(divEl);
  });
}

// SEE MORE
btnSeemore.addEventListener("click", () => {
  btnSeemore.setAttribute("disabled", true);
  btnSeemore.textContent = "Loading...";
  createLoading(perPageCount);
  offset++;

  fetchData(
    `${productEndpoint}?limit=${perPageCount}&skip=${offset * perPageCount}`
  );
});

// DETAIL PAGE
wrapperEl.addEventListener("click", (e) => {
  if (e.target.tagName === "IMG") {
    // BOM
    open(`/pages/product.html?id=${e.target.dataset.id}`, "_self");
  }
});

// SEARCH
searchInputEl.addEventListener("keyup", async (e) => {
  const value = e.target.value.trim();
  if (value) {
    searchDropEl.style.display = "block";
    const response = await fetch(
      `${BASE_URL}/products/search?q=${value}&limit=5`
    );
    response
      .json()
      .then((res) => {
        searchDropEl.innerHTML = null;
        res.products.forEach((item) => {
          const divEl = document.createElement("div");
          divEl.className = "search__item";
          divEl.dataset.id = item.id;
          divEl.innerHTML = `
                    <img src=${item.thumbnail} alt="">
                    <div>
                         <p>${item.title}</p>
                    </div>
                    `;
          searchDropEl.appendChild(divEl);
        });
      })
      .catch((err) => console.log(err));
  } else {
    searchDropEl.style.display = "none";
  }
});

// DETAIL PAGE BY SEARCH
searchDropEl.addEventListener("click", (e) => {
  if (e.target.closest(".search__item")?.className === "search__item") {
    const id = e.target.closest(".search__item").dataset.id;
    open(`/pages/product.html?id=${id}`, "_self");
    searchInputEl.value = "";
  }
});

//LOGIN;
// const formEl = document.querySelector(".form");
// const [username, password, btn] = formEl.children;

// const BASE_URL2 = "https://dummyjson.com";

// formEl.addEventListener("submit", (e) => {
//   e.preventDefault();

//   let user = {
//     username: username.value,
//     password: password.value,
//   };

//   btn.setAttribute("disabled", true);
//   btn.textContent = "Loading...";

//   fetch(`${BASE_URL2}/auth/login`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(user),
//   })
//     .then((res) => {
//       if (!res.ok) {
//         throw new Error("username or password is incorrect");
//       }

//       return res.json();
//     })
//     .then((res) => {
//       localStorage.setItem("accessToken", res.accessToken);
//       open("/index.html", "_self");
//     })
//     .catch((err) => {
//       alert(err);
//     })
//     .finally(() => {
//       btn.removeAttribute("disabled");
//       btn.textContent = "Login";
//     });
// });

window.onload = () => {
  checkToken();
};

function checkToken() {
  fetch("https://dummyjson.com/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Token hato");
      }
      return res.json();
    })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      localStorage.removeItem("accessToken");
      window.location.replace("/pages/login.html");
    });
}
