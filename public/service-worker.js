importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox)
    console.log(`Workbox berhasil dimuat`);
else
    console.log(`Workbox gagal dimuat`);

workbox.precaching.precacheAndRoute([{
        url: '/index.html',
        revision: '3'
    },
    {
        url: '/detail.html',
        revision: '3'
    },
    {
        url: '/css/materialize.min.css',
        revision: '1'
    },
    {
        url: '/css/style.css',
        revision: '1'
    },
    {
        url: '/js/materialize.min.js',
        revision: '1'
    },
    {
        url: '/js/myConfig.js',
        revision: '1'
    },
    {
        url: '/js/nav.js',
        revision: '3'
    },
    {
        url: '/js/api.js',
        revision: '3'
    },
    {
        url: '/js/sw-config.js',
        revision: '3'
    },
    {
        url: '/js/idb.js',
        revision: '1'
    },
    {
        url: '/js/db.js',
        revision: '1'
    },
    {
        url: '/js/detail.js',
        revision: '3'
    },
    {
        url: '/pages/home.html',
        revision: '3'
    },
    {
        url: '/pages/navigator.html',
        revision: '1'
    },
    {
        url: '/pages/klasemen.html',
        revision: '3'
    },
    {
        url: '/pages/pertandingan.html',
        revision: '3'
    },
    {
        url: '/pages/favorited.html',
        revision: '1'
    },
    {
        url: 'manifest.json',
        revision: '1'
    },
    {
        url: '/images/icons/icon-72x72.png',
        revision: '1'
    },
    {
        url: '/images/icons/icon-96x96.png',
        revision: '1'
    },
    {
        url: '/images/icons/icon-128x128.png',
        revision: '1'
    },
    {
        url: '/images/icons/icon-144x144.png',
        revision: '1'
    },
    {
        url: '/images/icons/icon-152x152.png',
        revision: '1'
    },
    {
        url: '/images/icons/icon-192x192.png',
        revision: '1'
    },
    {
        url: '/images/icons/icon-384x384.png',
        revision: '1'
    },
    {
        url: '/images/icons/icon-512x512.png',
        revision: '1'
    },
    {
        url: '/images/icons/soccerin_icon_epl.png',
        revision: '1'
    },
    {
        url: '/images/error-badge.png',
        revision: '1'
    },
    {
        url: 'https://fonts.googleapis.com/icon?family=Material+Icons',
        revision: '1'
    }
], {
    ignoreUrlParametersMatching: [/&*/],
});

workbox.routing.registerRoute(
    new RegExp('/pages/'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: "pages-v3",
    })
);

workbox.routing.registerRoute(
    new RegExp("https://api.football-data.org"),
    workbox.strategies.staleWhileRevalidate({
        cacheName: "api-v3",
    })
);

workbox.routing.registerRoute(
    new RegExp('/detail.html'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: "detailClub-v3"
    })
);

workbox.routing.registerRoute(
    new RegExp("/images/"),
    workbox.strategies.staleWhileRevalidate({
        cacheName: "imageCache",
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200],
            }),
            new workbox.expiration.Plugin({
                maxAgeSeconds: 60 * 60 * 24 * 30,
                maxEntries: 60,
            }),
        ],
    })
);

self.addEventListener('push', function (event) {
    let body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Push message no payload';
    }
    const options = {
        body: body,
        icon: 'images/icons/icon-72x72.png',
        badge: 'images/icons/icon-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});