
var controller = new ScrollMagic.Controller({
    globalSceneOptions: { triggerHook: "0.9", duration: "500%" },
});

// build scenes

// init controller for image-anime
$(".image-anime").each(function () {
    new ScrollMagic.Scene({ triggerElement: this })
        .setTween(this, {
            y: "-80%",
            ease: Linear.easeNone,
        })
        // .addIndicators()
        .addTo(controller);
});

// for reverse animation
$(".image-anime-child").each(function () {
    new ScrollMagic.Scene({ triggerElement: this })
        .setTween(this, {
            y: "80%",
            ease: Linear.easeNone,
        })
        // .addIndicators()
        .addTo(controller);
});

// image anime slow with 60%
$(".image-anime-slow").each(function () {
    new ScrollMagic.Scene({ triggerElement: this })
        .setTween(this, {
            y: "-60%",
            ease: Linear.easeNone,
        })
        // .addIndicators()
        .addTo(controller);
});


// Squares Animation,
var columns1 = $(".grid1 .column");
var columns2 = $(".grid2 .column");
var columns3 = $(".grid3 .column");

// Tween Animation
var column1Anim = new TimelineMax({
    yoyo: false,
    delay: 0.1,
    repeat: -1,
    repeatDelay: 1,
});
// Fade columns in
column1Anim.staggerFrom($(columns1), 0.25, { autoAlpha: 0.1 }, 0.2);
// Fade columns out
column1Anim.staggerTo($(columns1), 0.5, { autoAlpha: 0.1 }, 0.2, 0.25);

// Tween Animation
var column2Anim = new TimelineMax({
    yoyo: false,
    delay: 1.2,
    repeat: -1,
    repeatDelay: 1,
});
// Fade columns in
column2Anim.staggerFrom($(columns2), 0.25, { autoAlpha: 0.1 }, 0.2);
// Fade columns out
column2Anim.staggerTo($(columns2), 0.5, { autoAlpha: 0.1 }, 0.2, 0.25);

// Tween Animation
var column3Anim = new TimelineMax({
    yoyo: false,
    delay: 2.4,
    repeat: -1,
    repeatDelay: 1,
});
// Fade columns in
column3Anim.staggerFrom($(columns3), 0.25, { autoAlpha: 0.1 }, 0.2);
// Fade columns out
column3Anim.staggerTo($(columns3), 0.5, { autoAlpha: 0.1 }, 0.2, 0.25);

// minjs for sliding animation
$(document).ready(function () {
    $("#industries-slider").owlCarousel({
        items: 2,
        itemsDesktop: [1000, 2],
        itemsDesktopSmall: [979, 1],
        itemsTablet: [768, 1],
        itemsTablet: [750, 1],
        pagination: false,
        navigation: true,
        navigationText: ["<img src='/files/left-arrow-nav.svg' height='15'>", "<img src='/files/right-arrow-nav.svg' height='15'>"],
        slideSpeed: 1000,
        autoPlay: true
    });


    $("#testimonial-slider").owlCarousel({
        items: 1,
        itemsDesktop: [1000, 2],
        itemsDesktop: [999, 1],
        itemsDesktopSmall: [979, 1],
        itemsTablet: [768, 1],
        itemsTablet: [750, 1],
        pagination: false,
        navigation: true,
        navigationText: ["<img src='/files/left-arrow-nav.svg' height='15'>", "<img src='/files/right-arrow-nav.svg' height='15'>"],
        autoPlay: true,
        autoHeight: true,
    });
});


/* Nav */


function eieNavDropdowns(e) {
    var t = this;
    this.container = document.querySelector(e),
        this.root = this.container.querySelector(".navRoot"),
        this.primaryNav = this.root.querySelector(".navSection.primary"),
        this.primaryNavItem = this.root.querySelector(".navSection.primary .rootLink:last-child"),
        this.secondaryNavItem = this.root.querySelector(".navSection.secondary .rootLink:first-child"),
        this.checkCollision(),
        window.addEventListener("load", this.checkCollision.bind(this)),
        window.addEventListener("resize", this.checkCollision.bind(this)),
        this.container.classList.add("noDropdownTransition"),
        this.dropdownBackground = this.container.querySelector(".dropdownBackground"),
        this.dropdownBackgroundAlt = this.container.querySelector(".alternateBackground"),
        this.dropdownContainer = this.container.querySelector(".dropdownContainer"),
        this.dropdownArrow = this.container.querySelector(".dropdownArrow"),
        this.dropdownRoots = Strut.queryArray(".hasDropdown", this.root),
        this.dropdownSections = Strut.queryArray(".dropdownSection", this.container).map(function (e) {
            return {
                el: e,
                name: e.getAttribute("data-dropdown"),
                content: e.querySelector(".dropdownContent")
            }
        });
    var n = window.PointerEvent ? {
        end: "pointerup",
        enter: "pointerenter",
        leave: "pointerleave"
    } : {
            end: "touchend",
            enter: "mouseenter",
            leave: "mouseleave"
        };
    this.dropdownRoots.forEach(function (e, r) {
        e.addEventListener(n.end, function (n) {
            n.preventDefault(), n.stopPropagation(), t.toggleDropdown(e)
        }), e.addEventListener(n.enter, function (n) {
            if (n.pointerType == "touch") return;
            t.stopCloseTimeout(), t.openDropdown(e)
        }), e.addEventListener(n.leave, function (e) {
            if (e.pointerType == "touch") return;
            t.startCloseTimeout()
        })
    }), this.dropdownContainer.addEventListener(n.end, function (e) {
        e.stopPropagation()
    }), this.dropdownContainer.addEventListener(n.enter, function (e) {
        if (e.pointerType == "touch") return;
        t.stopCloseTimeout()
    }), this.dropdownContainer.addEventListener(n.leave, function (e) {
        if (e.pointerType == "touch") return;
        t.startCloseTimeout()
    }), document.body.addEventListener(n.end, function (e) {
        t.closeDropdown()
    })
}
/* end finbyznavDropdown */

/* Starting code */
var Strut = {
    queryArray: function (e, t) {
        // console.log(e,t);
        return t || (t = document.body), Array.prototype.slice.call(t.querySelectorAll(e))
    },
    ready: function (e) {
        // console.log(e);
        document.addEventListener("DOMContentLoaded", e)
    }
};


Strut.supports = {
    pointerEvents: function () {

        var e = document.createElement("a").style;
        // console.log(e);
        return e.cssText = "pointer-events:auto", e.pointerEvents === "auto"

    }(),
},

    eieNavDropdowns.prototype.checkCollision = function () {

        var e = this;

        if (Strut.isMobileViewport) return;

        if (e.compact == 1) {

            var t = document.body.clientWidth,

                n = e.primaryNav.getBoundingClientRect();

            n.left + n.width / 2 > t / 2 && (e.container.classList.remove("test"), e.compact = !1)

        } else {

            var r = e.primaryNavItem.getBoundingClientRect(),

                i = e.secondaryNavItem.getBoundingClientRect();

            r.right > i.left && (e.container.classList.add("test"), e.compact = !0)

        }
    },


    eieNavDropdowns.prototype.openDropdown = function (e) {
        var t = this;
        if (this.activeDropdown === e) return;
        this.container.classList.add("overlayActive"), this.container.classList.add("dropdownActive"), this.activeDropdown = e, this.dropdownRoots.forEach(function (e, t) {
            e.classList.remove("active")
        }), e.classList.add("active");
        var n = e.getAttribute("data-dropdown"),
            r = "left",
            i, s, o;
        this.dropdownSections.forEach(function (e) {
            e.el.classList.remove("active"), e.el.classList.remove("left"), e.el.classList.remove("right"), e.name == n ? (e.el.classList.add("active"), r = "right", i = e.content.offsetWidth, s = e.content.offsetHeight, o = e.content) : e.el.classList.add(r)
        });
        var u = 520,
            a = 400,
            f = i / u,
            l = s / a,
            c = e.getBoundingClientRect(),
            h = c.left + c.width / 2 - i / 2;

        h = Math.round(Math.max(h, 10)), clearTimeout(this.disableTransitionTimeout), this.enableTransitionTimeout = setTimeout(function () {
            t.container.classList.remove("noDropdownTransition")
        }, 50), this.dropdownBackground.style.transform = "translateX(" + h + "px) scaleX(" + f + ") scaleY(" + l + ")", this.dropdownContainer.style.transform = "translateX(" + h + "px)", this.dropdownContainer.style.width = i + "px", this.dropdownContainer.style.height = s + "px";
        var p = Math.round(c.left + c.width / 2);

        this.dropdownArrow.style.transform = "translateX(" + p + "px) rotate(45deg)";

        var d = o.children[0].offsetHeight / l;

        this.dropdownBackgroundAlt.style.transform = "translateY(" + d + "px)"

    },
    eieNavDropdowns.prototype.closeDropdown = function () {

        var e = this;

        if (!this.activeDropdown) return;

        this.dropdownRoots.forEach(function (e, t) {

            e.classList.remove("active")

        }),

            clearTimeout(this.enableTransitionTimeout),

            this.container.classList.remove("overlayActive"),

            this.container.classList.remove("dropdownActive"),

            this.activeDropdown = undefined

    }, eieNavDropdowns.prototype.toggleDropdown = function (e) {
        this.activeDropdown === e ? this.closeDropdown() : this.openDropdown(e)
    }, eieNavDropdowns.prototype.startCloseTimeout = function () {
        var e = this;
        e.closeDropdownTimeout = setTimeout(function () {
            e.closeDropdown()
        }, 180)
    }, eieNavDropdowns.prototype.stopCloseTimeout = function () {
        var e = this;
        clearTimeout(e.closeDropdownTimeout)
    }, Strut.supports.pointerEvents, Strut.ready(function () {
        new eieNavDropdowns(".eieNav")
    });
/* Multilevel Sidebar - menu */

$(".go-tosub-menu").on("click", function (event) {
    let lsid = $(this).data("ls");
    let icon = $(this).data("icon");
    if ($(`#${lsid}`).hasClass("d-block")) {
        $(`#${lsid}`).parent("li").removeClass("show").addClass("showreverce");
        let $li = $("#navsidebar").children("ul").children("li");
        $(`#${lsid}`).parent("li").removeClass("show");
        setTimeout(() => {
            $.each($li, function (ix, list) {
                $(this).removeClass("d-none");
            });
            $("#navsidebar").children("ul").addClass("show");
            $(`#${lsid}`).parent("li").children("img").removeClass("d-none");
            $(`#${lsid}`).parent("li").find("a img:first").addClass("d-none");
            $(`#${lsid}`).parent("li").children("ul:first").removeClass("d-block").addClass("d-none");
            $(`#${lsid}`).parent("li").removeClass("showreverce");
            setTimeout(() => {
                $("#navsidebar").children("ul").removeClass("show");
            }, 500)
        }, 500)
    } else {
        if ($(`#${lsid}`).addClass("d-block")) {
            $(`#${lsid}`).parent("li").removeClass("showreverce").addClass("show").parent("li").children("img").addClass("d-none");
            $(`#${lsid}`).parent("li").children("img").addClass("d-none");
            $(`#${lsid}`).parent("li").find("a img:first").removeClass("d-none");
            let $li = $("#navsidebar").children("ul").children("li").not("li.show");
            $.each($li, function (ix, list) {
                $(this).addClass("d-none");
            });
        }
    }
});

$('#navsidebarCollapse').on('click', function () {
    $('#navsidebar').toggleClass('active');
    $("header.eieNav div.nav-wrapper").css({
        "left": "0px",
    });
    if ($(this).hasClass('active')) {
        $("header.eieNav div.nav-wrapper").css({
            "left": "-50px",
        });
    }
    $(this).toggleClass('active');
});
/* end multilevel sidebar */


//navbar images
$('.tabanchor').on('mouseenter', function (e) {
    var getTab = $(this).attr('href');
    $(this).parent().addClass('active');
    $('.flex-inner').removeClass('active')

    $(getTab).addClass('active')
    e.preventDefault();
})



//  Video JS start here

document.addEventListener("DOMContentLoaded", function () {
    var div,
        n,
        v = document.getElementsByClassName("youtube-player");
    for (n = 0; n < v.length; n++) {
        div = document.createElement("div");
        div.setAttribute("data-id", v[n].dataset.id);
        div.innerHTML = labnolThumb(v[n].dataset.id);
        div.onclick = labnolIframe;
        v[n].appendChild(div);
    }
});

function labnolThumb(id) {
    var thumb =
        '<img src="/files/EIE-Instruments.svg" title="youtube video" alt="Youtube Video">',
        play = '<div class="play"></div>';
    return thumb + play;
}

function labnolIframe() {
    var iframe = document.createElement("iframe");
    var embed = "https://www.youtube.com/embed/ID?autoplay=1";
    iframe.setAttribute("src", embed.replace("ID", this.dataset.id));
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allowfullscreen", "1");
    this.parentNode.replaceChild(iframe, this);
}



// person card  theme

let members = $(".team__members");
let isHover = false;

setInterval(() => {
    if (!isHover) {
        let min = 1;
        let max = $(members).length;
        let random = Math.floor(Math.random() * (max - min + 1) + min);
        $(".team__members:nth-child(" + random + ")")
            .addClass("team__members--show")
            .siblings()
            .removeClass("team__members--show");
    }
}, 3000);

function mediaSize() {

    $(members).hover(

        () => {
            if (window.matchMedia('(min-width: 480px)').matches) {
                $(members).removeClass("team__members--show");
                isHover = true;
                console.log('hover');
            }
        },
        () => {
            if (window.matchMedia('(min-width: 480px)').matches) {
                isHover = false;
            }
        }
    );

}

/* Call the function */
mediaSize();
/* Attach the function to the resize event listener */
window.addEventListener('resize', mediaSize, false);


// Timeline tree about us

/* Check the location of each element */
$('.timeline_content').each(function (i) {

    var bottom_of_object = $(this).offset().top + $(this).outerHeight();
    var bottom_of_window = $(window).height();

    if (bottom_of_object > bottom_of_window) {
        $(this).addClass('hidden');
    }
});


$(window).scroll(function () {
    /* Check the location of each element hidden */
    $('.hidden').each(function (i) {

        var bottom_of_object = $(this).offset().top + $(this).outerHeight();
        var bottom_of_window = $(window).scrollTop() + $(window).height();

        /* If the object is completely visible in the window, fadeIn it */
        if (bottom_of_window > bottom_of_object) {
            $(this).animate({
                'opacity': '1'
            }, 700);
        }
    });
});


// slider Animation
(function () {
    "use strict";
    /*---------------*/
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (function () {
            return (
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback, element) {
                    window.setTimeout(callback, 1000 / 60);
                }
            );
        })();
    }

    // from http://stackoverflow.com/a/6466243/2011404
    function pad(str, max) {
        str = str.toString();
        return str.length < max ? pad("0" + str, max) : str;
    }

    function css(element, property) {
        var _property = window
            .getComputedStyle(element, null)
            .getPropertyValue(property);
        if (_property.indexOf("px") != -1) {
            return parseInt(_property);
        } else {
            return _property;
        }
    }

    function Slice(elements) {
        return Array.prototype.slice.call(elements);
    }

    TweenLite.defaultEase = Expo.easeOut;

    /*---------------*/

    function TSlider() {
        // console.log("fine!");
        this._init();
    }

    var k = 0;
    var array = [];

    TSlider.prototype = {
        _init: function () {
            this.isFF = !!navigator.userAgent.match(/firefox/i);
            // Check if it's mobile or click
            this.evttype = "click";
            // Slider global element

            //  change made by me!
            if (document.getElementById("slider")) {
                this.Slider = document.getElementById("slider");
                // Images total count
                this.imagesCount = new Slice(this.Slider.querySelectorAll("img")).length;
                // Slideshow interval
            } else {
                this.Slider = null;
            }

            this.sldInterval = 2000;
            // Control if it's animating
            this.isAnimating = false;
            // Current slide
            this.current = 0;
            // Minimum scale
            this.minScale = 0.7;

            /* Let's do the magic! */
            this._createSlider();
        },

        /* --------------- */

        _createSlider: function () {
            var self = this;


            if (this.Slider != null) {
                this.originalImgsEl = new Slice(this.Slider.querySelectorAll("img"));
                this.images = [];

            }


            /* Creating 'mainImages' element to receive the copy of all images */
            var _mainImagesEl = document.createElement("div");
            classie.addClass(_mainImagesEl, "mainImages");
            this.Slider.appendChild(_mainImagesEl);

            /* Creating 'backgroundImages' element to receive the copy of all images */
            var _backgroundImagesEl = document.createElement("div");
            classie.addClass(_backgroundImagesEl, "backgroundImages");
            this.Slider.appendChild(_backgroundImagesEl);

            /* Creating 'navigation' element */
            var _navigationEl = document.createElement("div");
            classie.addClass(_navigationEl, "navigation");
            this.Slider.appendChild(_navigationEl);

            /* Final main elements */
            this.mainImages = this.Slider.querySelector(".mainImages");
            this.backgroundImages = this.Slider.querySelector(".backgroundImages");
            this.navigation = this.Slider.querySelector(".navigation");

            this.navigation.innerHTML = "<ul></ul>";

            /* Copying the images attributes */
            this.originalImgsEl.forEach(function (el, i) {
                var src = el.attributes.src.nodeValue;
                var alt = el.attributes.alt.nodeValue;
                var dataUrl = el.dataset.url;

                self.images.push({
                    src: src,
                    alt: alt,
                    url: dataUrl,
                    index: i,
                });

                self.Slider.removeChild(el);
            });

            /* Creating the 'mainImages' elements */

            for (var i = 0; i < this.images.length; i++) {
                var obj = this.images[i];
                this._createNewImgs(obj);
                this._createNavigation(obj);
            }

            this.sld = new Slice(this.Slider.querySelectorAll(".mi__img"));
            this.bgSld = new Slice(this.Slider.querySelectorAll(".bi__imgCont"));
            this.navItens = new Slice(this.navigation.querySelectorAll("li"));

            /* Positioning all slides */
            this._firstPosition();
        },

        _createNewImgs: function (obj) {
            var _miImgEl = document.createElement("div");
            var _biContImgEl = document.createElement("div");

            classie.addClass(_miImgEl, "mi__img");
            classie.addClass(_biContImgEl, "bi__imgCont");

            _miImgEl.style.background =
                "url(" + obj.src + ") no-repeat center center";
            _miImgEl.style.backgroundSize = "cover";
            _miImgEl.style.zIndex = this.imagesCount - (obj.index + 1);
            _biContImgEl.innerHTML =
                '<div class="bi__imgCont-img bi-' + obj.index + '" />';

            this.mainImages.appendChild(_miImgEl);
            this.backgroundImages.appendChild(_biContImgEl);

            var bgImageSrc = obj.src.split(".jpg")[0];
            var bi = this.backgroundImages.querySelector(
                ".bi__imgCont .bi-" + obj.index
            );

            bi.style.background = "url(" + bgImageSrc + ".jpg) no-repeat center top";
            bi.style.backgroundSize = "cover";
            this.backgroundImages.style.display = "none";

            //classie(this.Slider.querySelectorAll('.mi__img')[this.current], 'active-slide');
        },

        _createNavigation: function (obj) {
            var ul = this.navigation.querySelector("ul");
            var _li = document.createElement("li");
            var a, liInfo, mask;

            // Putting zero before number
            var number = pad(obj.index + 1, 2);

            // For each item...
            classie.addClass(_li, "navItem-" + obj.index);
            _li.innerHTML =
                '<a href=""></a><div class="li__info"></div><div class="li__info-mask"><div class="mask__infoContainer"></div></div><div class="li__hoverLine"><div class="l"></div></div>';
            ul.appendChild(_li);

            // New elements
            a = ul.querySelector(".navItem-" + obj.index + " a");
            liInfo = ul.querySelector(".navItem-" + obj.index + " .li__info");
            mask = ul.querySelector(
                ".navItem-" + obj.index + " .mask__infoContainer"
            );

            // Setting links href attr
            a.setAttribute("href", obj.url);

            // Inner texts
            var info = "<h5>" + number + "</h5><h4>" + obj.alt + "</h4>";
            liInfo.innerHTML = info;

            var text_print;
            if (obj.index === 0) {
                text_print =
                    "Soil testing, Asphalt testing, Cement-Concrete testing etc.";
            } else if (obj.index === 1) {
                text_print = "Stability chambers, BOD Incubators, Hot Air Ovens etc.";
            } else if (obj.index === 2) {
                text_print = "Stability chambers, BOD Incubators, Hot Air Ovens etc.";
            } else if (obj.index === 3) {
                text_print =
                    "MOR Testing machine, Surface Abrasion testing machine etc.";
            } else if (obj.index === 4) {
                text_print = "Stability chambers, BOD Incubators, Hot Air Ovens etc.";
            }

            array.push(text_print);
            // console.log(array);
            // var print_field = ;

            // mask.innerHTML = "<h5></h5><h4><b>" + text_print + "</h4></p>";

            document.getElementById("print-message-field").innerText = array[k];

            // var node = document.createElement("p");
            // node.innerHTML = "<h5></h5><h4><b>" + text_print + "</h4></p>";

            // document.getElementById("print-message-field").appendChild(node);

            // Setting width for mask according to 'li' size.
            // This the the final computed style of li
            mask.style.width = css(_li, "width") + "px";
            if (this.isFF) {
                mask.style.width = css(_li, "width") + 5 + "px";
            }
        },

        _firstPosition: function () {
            var self = this;

            TweenMax.set(this.navigation, { opacity: 0, y: 25 });

            // Front images
            this.sld.forEach(function (el, i) {
                classie.addClass(el, "sld-" + i);
                if (i === 0) {
                    // The first image will have the 'fade-in' animation
                    TweenMax.set(el, { scale: 1.3, opacity: 0 });
                } else {
                    // Other images will have the default position
                    TweenMax.set(el, { scale: self.minScale, y: -window.innerHeight });
                }
            });

            // Blur images (background)
            this.bgSld.forEach(function (el, i) {
                classie.addClass(el, "bg-" + i);
                TweenMax.set(el.querySelector(".bi__imgCont-img"), {
                    scale: 1.35,
                    y: 80,
                });
                el.style.zIndex = 0;

                if (i === self.current) {
                    TweenMax.set(el.querySelector(".bi__imgCont-img"), {
                        scale: 1.5,
                        y: 0,
                    });
                    el.style.zIndex = self.current + 2;
                }

                if (i === self.current + 1) {
                    el.style.zIndex = self.current + 1;
                }
            });

            /*classie.addClass(self.sld[self.current], 'active-slide');
                  classie.addClass(self.navItens[self.current], 'active');*/

            // $(".slider-text-anime-color").each(function () {
            //   gsap.fromTo(
            //     this,
            //     {
            //       x: 1600,
            //       // color: gray,
            //       opacity: 1,
            //       // ease: "bounce",
            //     },
            //     {
            //       x: 0,
            //       opacity: 1,
            //       duration: 1,
            //       boxShadow: "0px 0px 20px 20px red",
            //       borderRadius: "50% 50%",
            //       // border: "5px solid rgb(0,255,0)",
            //       ease: "slow",
            //     }
            //   );
            // });

            $(".sllider-text-anime").each(function () {
                gsap.fromTo(
                    this,
                    {
                        // x: 1600,
                        opacity: 0,
                        // ease: "bounce",
                    },
                    {
                        // x: 0,
                        opacity: 0,
                        // duration: 1,
                        // ease: "slow",
                    }
                );
            });

            // Must wait everything in their right place before start
            setTimeout(function () {
                self._enterAnimation();
            }, 1200);
        },

        _enterAnimation: function () {
            var self = this;
            var t = new TimelineMax({
                paused: true,
                onComplete: function () {
                    self._startSlider();
                    self.backgroundImages.style.display = "block";
                },
            });

            t.to(self.sld[self.current], 2.5, { scale: 1, opacity: 1 });
            t.to(self.navigation, 1.2, { opacity: 1, y: 0 }, 0.8);

            t.restart();
        },

        /* --------------- */

        _startSlider: function () {
            var self = this;
            var currSlide = this.sld[this.current];
            var currNavItem = this.navItens[this.current];
            var currBgSlide = this.bgSld[this.current];
            var currBgSldImage = currBgSlide.querySelector(".bi__imgCont-img");

            // console.log("Começa contagem do slide " + this.current + ".");

            animateCurrNavItem(currNavItem);
            classie.addClass(currSlide, "active-slide");

            /*++++*/

            function animateCurrNavItem(el) {
                document.getElementById("print-message-field").innerText = "";
                document.getElementById("print-message-field").innerText = array[k];
                k = k + 1;
                if (k === array.length) {
                    k = 0;
                }

                $(".sllider-text-anime").each(function () {
                    gsap.fromTo(
                        this,
                        {
                            x: 1600,
                            opacity: 0,
                            // ease: "bounce",
                        },
                        {
                            x: 0,
                            boxShadow: "0px 0px 5px 5px white",
                            // borderRadius: "5% 5%",
                            // border: "5px solid gray",
                            opacity: 0.8,
                            duration: 1,
                            ease: "slow",
                        }
                    );
                });

                classie.addClass(el, "active");
                el.querySelector(".li__info").style.opacity = 1;
                // el.querySelector(".li__info").style.scale = 1.1;
                el.querySelector(".li__info-mask").style.opacity = 1;

                // TweenMax.fromTo(
                // el.querySelector(".li__info"),
                // self.sldInterval / 3000,
                // {
                // scale: 1,
                // width: "100%",
                // ease: Linear.easeNone,
                // onComplete: function () {
                // console.log("Agora, aciona as transições.");
                // slidesTransitions();
                // },
                // },
                // { scale: 1.1 }
                // );

                TweenMax.to(
                    el.querySelector(".li__info-mask"),
                    self.sldInterval / 1000,
                    {
                        width: "100%",
                        ease: Linear.easeNone,
                        onComplete: function () {
                            // console.log("Agora, aciona as transições.");
                            slidesTransitions();
                        },
                    }
                );
            }

            // function sleep_slide_call() {
            //   setTimeout(slidesTransitions, 3000);
            // }

            function slidesTransitions() {
                var nextIndex =
                    self.current < self.imagesCount - 1 ? ++self.current : 0;

                classie.removeClass(currSlide, "active-slide");
                classie.removeClass(currNavItem, "active");

                TweenMax.set(currBgSlide, { top: 0, bottom: "inherit" });

                // Reset navigation item
                // currNavItem.querySelector(".li__info").style.opacity = 0.5;
                TweenMax.to(currNavItem.querySelector(".li__info-mask"), 0.5, {
                    opacity: 0,
                    onComplete: function () {
                        currNavItem.querySelector(".li__info-mask").style.width = "0%";
                    },
                });

                // Move images
                var tm = new TimelineMax({
                    onComplete: function () {
                        // console.log("Transição de slides terminado.");
                        TweenMax.killTweensOf(currSlide, currBgSlide);

                        // Moving up the last image
                        TweenMax.set(currSlide, {
                            scale: self.minScale,
                            y: -window.innerHeight,
                        });

                        // Reseting last background image
                        TweenMax.set(currBgSlide, {
                            height: "100%",
                            top: "inherit",
                            bottom: 0,
                        });
                        TweenMax.set(currBgSldImage, { scale: 1.35, y: 80 });
                        currBgSlide.style.zIndex = 0;

                        // New z-index value for next background images
                        self.bgSld[nextIndex].style.zIndex = 2;

                        if (nextIndex + 1 >= self.imagesCount) {
                            self.bgSld[0].style.zIndex = 1;
                        } else {
                            self.bgSld[nextIndex + 1].style.zIndex = 1;
                        }
                        //console.log(self.bgSld[nextIndex+1], ' : ', nextIndex+1);

                        // Reinitialize the slider
                        self.current = nextIndex;
                        self._startSlider();
                    },
                });

                // Current elements animations
                tm.to(currSlide, 1.5, { scale: 0.8 });
                tm.to(currBgSldImage, 1.2, { scale: 1.35 }, 0.15);
                tm.to(currSlide, 1.2, { y: window.innerHeight }, 0.8);
                tm.to(currBgSlide, 1.2, { height: "0%" }, 0.8);

                // Next elements animations
                tm.to(self.sld[nextIndex], 1.2, { y: 0 }, 0.8);
                tm.to(self.sld[nextIndex], 1.5, { scale: 1 }, 1.8);
                tm.to(
                    self.bgSld[nextIndex].querySelector(".bi__imgCont-img"),
                    1.5,
                    { y: 0 },
                    1
                );
                tm.to(
                    self.bgSld[nextIndex].querySelector(".bi__imgCont-img"),
                    1.5,
                    { scale: 1.5 },
                    1.8
                );
            }
        },
    };
    /*---------------*/
    var s = new TSlider();
})();

// Slider Animation End here
