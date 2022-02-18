let basketCount= $("#basketCount")


document.addEventListener("DOMContentLoaded", getAllData);
var response;

function getAllData() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "product-list.json", true);
    xhr.onload = function () {
        let list = document.getElementById("data");
        // if (statusCode == SUCCESS) {
        if (this.status == 200) {
            const parsedData = JSON.parse(this.responseText);
            if (parsedData.statusCode == "SUCCESS") {
                response = parsedData.responses[0][0].params

                let menuItems = $("#menuItems")
                response.userCategories.forEach(function (e) {

                    menuItems.append(`
                    <li class="nav-item">
                        <a data-text="` + e + `" href="#" class="nav-link" aria-current="page">
                            ` + e + `
                        </a>
                    </li>
                    `)
                })

                let aElements = $(".nav-link")
                aElements.on("click", switchMenu)

                changeProductList(response.userCategories[0])

            } else {
                console.log("Hata oluştu")
            }

        } else {
            console.log("Hata oluştu")
        }
    }
    xhr.send();
}

function defineToasts(className) {
    // Toast handler
    var toastTrigger = $('.' + className)
    var toastLiveDiv = $('#liveToast')

    toastTrigger.on("click", function () {
        var toast = new bootstrap.Toast(toastLiveDiv)
        toast.show()
        addBasket()
    })
}

function addBasket() {
    if (basketCount.text()===""){
        basketCount.text(1)
    }else{
        basketCount.text(Number(basketCount.text()) +1)
    }
}



let beforeIcon = $(".before")
let afterIcon = $(".after")

//Scroll Process Start
beforeIcon.on("click", function () {
    scrollArea("left")
})

afterIcon.on("click", function () {
    scrollArea("right")
})

function scrollArea(scrollType) {
    let productCard = document.getElementsByClassName("product-card")[0]
    let scrollableArea = document.getElementById("scrollableArea")
    let content_scroll_left = scrollableArea.scrollLeft;

    if (scrollType === 'right') {
        const content_scroll_width = scrollableArea.scrollWidth;

        content_scroll_left += productCard.offsetWidth * 4;
        if (content_scroll_left >= content_scroll_width) {
            content_scroll_left = content_scroll_width;
        }
    } else if (scrollType === 'left') {
        content_scroll_left -= productCard.offsetWidth * 4;
        if (content_scroll_left <= 0) {
            content_scroll_left = 0;
        }
    }
    scrollableArea.scrollLeft = content_scroll_left;
}

//Scroll Process End

function changeProductList(header) {
    let clickedMenuItem = document.querySelector('[data-text="' + header + '"]');
    let allMenuItems = $(".nav-link")
    allMenuItems.removeClass('active')
    clickedMenuItem.classList.add('active')


    cardBlok = $("#scrollableArea")
    let productCard = $(".product-card")
    productCard.remove()

    response.recommendedProducts[header].forEach(function (item) {
        console.log('++++++++')
        let rating = item.params.productRatimg
        console.log(rating)
        // let flatRating = Math.floor(item.params.productRatimg)
        // console.log(flatRating)


        cardBlok.append(`
                    <div class="card text-center product-card">
                        <img class="card-img-top" src="` + item.image + `" alt="Card image cap">
                        <div id="shipping` + item.productId + `" class="card-img-overlay" style="position: initial; padding: 0">                      
                        </div>
                        <div class="card-body">
                            <h6 class="card-title">` + item.name + `</h6>
                        </div>
                        <div class="justify-content-center d-flex align-items-md-baseline">
                            <div id="starList` + item.productId + `" class="fs-7 text-decoration-none p-1" style="color: #ffae00">
                            </div>
                                <p style="font-size: small">` + item.params.productRatimg + `</p>
                        </div>
                        <div class="card-footer ">
                            <div class="badge bg-light p-2 text-dark">
                                <span class="fs-6 text-muted" style="text-decoration:line-through; margin-right: 10px;">` + item.oldPriceText + `</span>
                                <span class="fs-5">` + item.priceText + `</span>
                            </div>
                            <button data-product-id="` + item.productId + `" type="button" class="btn btn-warning mx-2 liveToastBtn">Sepete ekle</button>
                        </div>
                    </div>
                    `)

        if (item.params.shippingFee === "FREE") {
            let shipping = $("#shipping" + item.productId)
            shipping.append(`
                        <p style=" position: absolute; top: 8px; left: 16px; background-color: #ababab"
                                   class="p-1 rounded-2 text-white">
                                   KARGO BEDAVA
                        </p>
                        `)
        }
        let starList = $("#starList" + item.productId)
        for (let i = 1; i < 6; i++) {
            if (rating >= i) {
                starList.append(`<i class="fas fa-star"></i>`)
            } else if (Math.round(rating) === i) {
                starList.append(`<i class="fas fa-star-half-alt"></i>`)

            } else {
                starList.append(`<i class="far fa-star"></i>`)
            }
        }
    })

    defineToasts("liveToastBtn")
}

function switchMenu(e) {
    changeProductList(e.target.dataset.text)
}



