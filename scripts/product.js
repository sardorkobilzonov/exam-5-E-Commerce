const detailEl = document.querySelector(".detail");
const BASE_URL = "https://dummyjson.com";

async function fetchData() {
  let params = new URLSearchParams(window.location.search);
  const response = await fetch(`${BASE_URL}/products/${params.get("id")}`);
  response.json().then((res) => {
    createDetailPage(res);
  });
}

window.onload = () => {
  fetchData();
};

function createDetailPage(data) {
  detailEl.innerHTML = `
        <div>
            <img class="detail-img" src=${data.images[0]} alt="">
        </div>
        <div class="productAllInform">
            <h1>${data?.title}</h1>
             <div class="productInform">
          <img class="productImg" src="../images/Four Star.svg" alt="">
        <div class="productText1">(150 Reviews)</div>
        <div class="productText2">In Stock</div>
    </div>
    <p class="productPrice">$${data?.price}</p>
            <p class="productDescription">${data?.description}</p>
            <div class="productLine"></div>
             <div class="colours">
             <p>Colours:</p>
              <img src="../images/Colour Chnage.svg" alt="" />
               </div>
                <div class="sizes">
                  <div class="sizes-title">Size:</div>
                  <p>xs</p>
                  <p>s</p>
                  <p>m</p>
                  <p>l</p>
                  <p>xl</p>
               </div>
            <button class="product-btn">Buy now</button>

            <img class="img-deliver" src="../images/Frame 911.svg" alt="">
        </div>
    `;
}
