let basketCount = $("#basketCount")
document.addEventListener("DOMContentLoaded", loadPage);

// Responsive design compares "horizontal-nav"
function resize() {
    if ($(window).width() < 992) {
        $("#topDiv").addClass('horizontal-nav');
    } else {
        $("#topDiv").removeClass('horizontal-nav');
    }
}

$(window).on("resize", resize);
resize(); // call once initially

function getAllData() {
    let response;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "product-list.json", false);
    xhr.onload = function () {
        if (this.status === 200) {
            const parsedData = JSON.parse(this.responseText);
            if (parsedData.statusCode === "SUCCESS") {
                response = parsedData.responses[0][0].params
            } else {
                console.log("Hata oluştu")
            }
        } else {
            console.log("Hata oluştu")
        }
    }
    xhr.send();

    return response
}

function loadPage(){
    let response = getAllData()

    let menuItems = $("#menuItems")
    response.userCategories.forEach(function (e) {

        // data-text set to reach 'exact' value without any space or character.
        menuItems.append(`
        <li class="nav-item menu-item">
            <a data-text="` + e + `" href="#" class="nav-link" aria-current="page">
                ` + e + `
            </a>
        </li>
        `)
    })

    $(".nav-link").on("click", switchMenu)

    // First category is set to "active" and its products are added to page.
    changeProductList(response.userCategories[0], response.recommendedProducts)
}

function defineToasts(className) {
    // Toast handler.
    // After changing menu, product list is changed and needed to be re-set event listener.
    var toastTrigger = $('.' + className)
    var toastLiveDiv = $('#liveToast')

    toastTrigger.on("click", function () {
        var toast = new bootstrap.Toast(toastLiveDiv)
        toast.show()
        addBasket()
    })
}

function addBasket() {
    // Item number in basket is changed on navbar.
    if (basketCount.text() === "") {
        basketCount.text(1)
    } else {
        basketCount.text(Number(basketCount.text()) + 1)
    }
}



function changeProductList(header, productList) {
    // Find all menu items and clear "active" class
    let clickedMenuItem = document.querySelector('[data-text="' + header + '"]');
    let allMenuItems = $(".nav-link")
    allMenuItems.removeClass('active')
    // Add "active" class to the last selected menu item.
    clickedMenuItem.classList.add('active')

    // Clear all products before adding new menu products.
    $(".product-card").remove()

    // Append each product from new selected menu.
    productList[header].forEach(function (item) {

        $("#scrollableArea").append(`
                    <div class="card text-center product-card">
                       <a href="` + item.url + `"><img class="card-img-top" loading="lazy" src="` + item.image + `" alt="` + item.name + `"></a>
                        <div id="shipping` + item.productId + `" class="card-img-overlay" style="position: initial; padding: 0">                      
                        </div>
                        <div class="card-body">
                            <a href="` + item.url + `"><h6 class="card-title">` + item.name + `</h6></a>
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

        let rating = item.params.productRatimg
        let starList = $("#starList" + item.productId)
        for (let i = 1; i < 6; i++) {
            // Add full star
            if (rating >= i) {
                starList.append(`<i class="fas fa-star"></i>`)

            // Add half star if rating decimal is bigger than 0.5.
            } else if (Math.round(rating) === i) {
                starList.append(`<i class="fas fa-star-half-alt"></i>`)

            // Add empty star for rest.
            } else {
                starList.append(`<i class="far fa-star"></i>`)
            }
        }
    })

    // Define event listener to "add to basket" buttons after adding them newly to page.
    defineToasts("liveToastBtn")
}

function switchMenu(e) {
    // Get product list each time again.
    let response = getAllData()

    // Send text of menu item to the function
    changeProductList(e.target.dataset.text, response.recommendedProducts)
}


// Scroll Process Start
let beforeIcon = $(".beforeIcon")
let afterIcon = $(".afterIcon")

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

        content_scroll_left += productCard.offsetWidth;
        // check if user tries to go out of screen
        if (content_scroll_left >= content_scroll_width) {
            content_scroll_left = content_scroll_width;
        }
    } else if (scrollType === 'left') {
        content_scroll_left -= productCard.offsetWidth;
        // check if user tries to go out of screen
        if (content_scroll_left <= 0) {
            content_scroll_left = 0;
        }
    }
    scrollableArea.scrollLeft = content_scroll_left;
}
// Scroll Process End


