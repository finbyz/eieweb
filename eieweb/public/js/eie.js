
// Modal
if (document.getElementById('gallery')) {
    document.getElementById('gallery').classList.add("custom");
    document.getElementById('exampleModal').classList.add("custom");
}


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
//Industries Home slider
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

    //Testimonial Home slider

    $("#testimonial-slider").owlCarousel({
        items: 1,
        itemsDesktop: [1000, 2],
        itemsDesktop: [999, 1],
        itemsDesktopSmall: [979, 1],
        itemsTablet: [768, 1],
        itemsTablet: [750, 1],
        pagination: false,
        navigationText: ["<img src='/files/left-arrow-nav.svg' height='15'>", "<img src='/files/right-arrow-nav.svg' height='15'>"],
        navigation: true,
        autoPlay: true,
        autoHeight: true,
    });


      //EiE Customer slider
    var owl = $('#eie-customer .owl-carousel');
	owl.owlCarousel({
        items: 6,
        itemsDesktop: [1000, 2],
        itemsDesktop: [999, 2],
        itemsDesktopSmall: [979, 2],
        itemsTablet: [768, 1],
        itemsTablet: [750, 1],
		autoPlay: true,
        slideTransition: 'linear',
        // autoplayTimeout: 0,
        // autoplaySpeed: 5000,
		loop: true,
		nav: false,
		margin: 10,
		navText: false,
		dots: false,
		mouseDrag: true,
        slideBy: 1,
        pagination: false,
		responsive: {
			0: {
				items: 2,
				loop: true,
			},
			600: {
				items: 3,
				loop: true,
			},
			960: {
				items: 5,
				loop: true,
			},
			1200: {
				items: 6,
				loop: true,
			}
		}
    });
    

     //Products related Items
    $('#related-module').owlCarousel({
        items:4,
        loop:true,
        margin:10,
        autoPlay:true,
        autoplayTimeout:1000,
        autoplayHoverPause:true,
		responsive: {
			0: {
				items: 1
			},
			768: {
				items: 2
			},
			970: {
				items: 4
			},
			1200: {
				items: 4
			}
		}
	});


    //   Auto Courosel 
    setTimeout(function () {
        $("a.slider--control.right").trigger('click');
    }, 100);
    $("a.slider--control.right").on("click", () => {
        $("#page3").attr("checked", true);
    })
    // END
});

//Job Opening Main Effect


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

// Slider Animation

// Slider Animation End here

//heading fade in js
//done
$(function () {
    var scrollController = new ScrollMagic.Controller();
    $(".eie-fadeinup").each(function () {

       var fadeUpScene0 = new ScrollMagic.Scene({
            triggerElement: this,
            triggerHook: 0.8,
        })
            .setTween(TweenMax.from(this, 0.8, {
                y: 50,
                opacity: 0,
                ease: Sine.easeInOut,
            }))
            .addTo(scrollController)
    });


    $(".eie-fadeindown").each(function () {

       var fadeUpScene1 = new ScrollMagic.Scene({
            triggerElement: this,
            triggerHook: 0.9,
            reverse: true,
        })
            .setTween(TweenMax.from(this, 0.4, {
                y: -10,
                opacity: 0,
                ease: Sine.easeInOut,
            }))
            .addTo(scrollController)
    });

    $(".eie-fadeinright").each(function () {

          var fadeUpScene2 = new ScrollMagic.Scene({
            triggerElement: this,
            triggerHook: 0.7,
        
        })
            .setTween(TweenMax.from(this, 0.8, {
                x: 90,
                opacity: 0,
                ease: Sine. easeInOut
            }))
            .addTo(scrollController)
    });

    $(".eie-fadeinleft").each(function () {

         var fadeUpScene3 = new ScrollMagic.Scene({
            triggerElement: this,
            triggerHook: 0.7,
          
        })
            .setTween(TweenMax.from(this, 0.8, {
                x: -90,
                opacity: 0,
                ease: Sine.easeInOut,
            }))
            .addTo(scrollController)
    });
    //scale eeffect
    $(".eie-fadeinrscale").each(function () {

       var fadeUpScene4 = new ScrollMagic.Scene({
            triggerElement: this,
            triggerHook: 0.7,
          
        })
            .setTween(TweenMax.from(this, 0.6, {
                scale: 1.3,
                ease: Sine.easeInOut,

            }))
            .addTo(scrollController)
    });

    $(".eie-fadeinrotate").each(function () {

         var fadeUpScene5 = new ScrollMagic.Scene({
            triggerElement: this,
            triggerHook: 0.7,
        
        })
            .setTween(TweenMax.from(this, 1, {
              
                x: 500,
                opacity: 0,
                ease: Sine.easeInOut,
            }))
            .addTo(scrollController)
    });
//text decoration
            $(".eie-fadein-text-right").each(function () {

               var fadeUpScene6 = new ScrollMagic.Scene({
                    triggerElement: this,
                    triggerHook: 0.7,
                
                })
                    .setTween(TweenMax.from(this, 0.9, {
                        x: 40,
                        opacity: 0,
                        ease: Sine.easeInOut,
                    }))
                    .addTo(scrollController)
            });

            $(".eie-fadein-text-left").each(function () {

               var fadeUpScene7 = new ScrollMagic.Scene({
                    triggerElement: this,
                    triggerHook: 0.6,
                
                })
                    .setTween(TweenMax.from(this, 0.7, {
                        x: -40,
                        opacity: 0,
                        ease: Sine.easeOut,
                    }))
                    .addTo(scrollController)
            });
            $(".eie-fadeinup-text").each(function () {

               var fadeUpScene8 = new ScrollMagic.Scene({
                    triggerElement: this,
                    triggerHook: 0.8,
                })
                    .setTween(TweenMax.from(this, 0.9, {
                        y: 60,
                        opacity: 0,
                        ease: Sine.easeInOut,
                    }))
                    .addTo(scrollController)
            });
            //heading 
            $(".eie-heading").each(function () {
                var fadeUpScene9 = new ScrollMagic.Scene({
                    triggerElement: this,
                    triggerHook: 0.7,
                })
                    .setTween(TweenMax.from(this, 0.9, {
                        rotationY: 90,
                        opacity:0,
                        ease: Sine.easeInOut,
                    }))
                    .addTo(scrollController)
            });
})
// li js
        $('.result ul').each(function () {
                 var ul = $(this);
                 h= ul.children('li').height(); 
                 console.log(h);
                 ul.css({ 'height': (h *5) + 'px', 'overflow': 'hidden' });
        });

        $(document).ready(function () {

            setTimeout(function () {
                if ($(".web-form-footer button").hasClass('btn btn-primary btn-sm')) {
                    $(".web-form-footer button").parent().addClass('inquiry-button');
                    $(".web-form-footer button").addClass('eie-button').removeClass('btn btn-primary btn-sm');
                    $(".web-form-footer button").text('save');
                }
                if ($(".website-list .result a").hasClass('btn btn-primary btn-sm')) {
                    $(".website-list .result a").addClass('eie-button').removeClass('btn btn-primary btn-sm') ;
                }
            });
        })