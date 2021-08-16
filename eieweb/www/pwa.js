function showPrompt(buttonText, messageText, f) {
    const $btn = $(`<button class="pwa-next-action"><span>${__(buttonText)}</span></button>`);
    const next_action_container = $(`<div class="pwa-next-action-container"></div>`);
    $btn.click(() => f());
    next_action_container.append($btn);
    showPwaAlert({
        message: messageText,
        body: next_action_container,
        indicator: 'green',
    });
    $('.btn-pwa-install').click(() => f()).show();
}

function showPwaAlert(message, seconds = 7) {
    if (typeof message === 'string') {
        message = {
            message: message
        };
    }
    if (!$('#pwa-dialog-container').length) {
        $('<div id="pwa-dialog-container"><div id="pwa-alert-container"></div></div>').appendTo('body');
    }

    const div = $(`
		<div class="pwa-alert pwa-desk-alert">
			<div class="pwa-alert-message"></div>
			<div class="pwa-alert-body" style="display: none"></div>
			<a class="pwa-close">&times;</a>
		</div>`);

    let pwaMessage = div.find('.pwa-alert-message');
    pwaMessage.append(message.message);

    if (message.indicator) {
        pwaMessage.addClass('indicator ' + message.indicator);
    }

    if (message.body) {
        div.find('.pwa-alert-body').show().html(message.body);
    }

    div.hide().appendTo("#pwa-alert-container").show()
        .css('transform', 'translateX(0)');

    div.find('.pwa-close, button').click(function () {
        div.remove();
        return false;
    });

    div.delay(seconds * 1000).fadeOut(300);
    return div;
}

if ('serviceWorker' in navigator) {
  
    window.addEventListener('load', function () {
  
            navigator.serviceWorker.register('/sw.js').then(
                function (registration) {
                    console.log('[PWA] ServiceWorker registration successful with scope: ' + registration.scope);
                }, function (err) {
                    console.log('[PWA] ServiceWorker registration failed: ', err);
                });
    });

    var installPromptEvent = null;
    window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        installPromptEvent = e;
        // console.log('[PWA] Application could be installed');
        showAddToHomeScreen();
    });

    function addToHomeScreen(event) {
        // Show the prompt
        hideAddToHomeScreen();
        if (installPromptEvent !== null) {
            installPromptEvent.prompt();

            // Wait for the user to respond to the prompt
            installPromptEvent.userChoice
                .then(function (choiceResult) {
                    if (choiceResult.outcome === 'accepted') {
                        // console.log('[PWA] User accepted the A2HS prompt');
                    } else {
                        // console.log('[PWA] User dismissed the A2HS prompt');
                    }
                    installPromptEvent = null;
                });
        }
    }

    function showAddToHomeScreen(event) {
        if (installPromptEvent !== null) {
            if (window.location.pathname === '/install') {
                // show to user prompt with PWA installation
                showPrompt(('{{ _("Install") }}'), '{{ _("Do you want to install PWA?") }}', addToHomeScreen);
            } else {
                // show to user prompt with Install Page redirection
                showPrompt('{{ _("Go to Install Page") }}', '{{ _("This device supports PWA") }}', function () {
                        window.location.href = "/install";
                    });
            }
        }
    }

    function hideAddToHomeScreen(event) {
        $('#pwa-alert-container').hide();
        $('.btn-pwa-install').hide();
    }

    window.addEventListener('appinstalled', hideAddToHomeScreen);

  
} else if (window.location.protocol !== 'https:') {
    console.warn('[PWA] Requires secure HTTPS connection');
} else {
    console.warn('[PWA] No Service Worker support on your device');
}