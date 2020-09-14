    var webPush = require('web-push');

    const vapidKeys = {
       "publicKey": "BILnk-EC_sFNIEYl-koyp7Vwu7FKOmQ-Vu7wkHVCfnj67TDSI_5EKOjoOy1VbGzsLtbF_nD94N28MlMG-NueXfA",
       "privateKey": "Q8-B-SKPq8gVxJKxhKb4alq7uB5ivWHR9LD8ybrFQWs"
    };


    webPush.setVapidDetails(
       'mailto:example@yourdomain.org',
       vapidKeys.publicKey,
       vapidKeys.privateKey
    )
    var pushSubscription = {
       "endpoint": "https://fcm.googleapis.com/fcm/send/d-qsKmQrbFc:APA91bG5ea28WFWmNTOWflI1NtNdmXsLaxyqJH3fqX9Z8Y-pfJrbR_Fm4KGm5B-TxmYDXkZciEJcojSJK9MeGPJCCUzqWCArmKFPkitzh3byu35hL-DSzq6AcR6WxaAlhxDl24RoVViJ",
       "keys": {
          "p256dh": "BKfR8alGp1sPRWwiV6zia9r7+GQe3F2fnltAPkJjQKzX/XlqjL45/MvBRcMZXfJYvI75dC6Ta8rPqtNYToZgXxk=",
          "auth": "PeNzakn/QcSGXfAugQ5svQ=="
       }
    };
    var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';

    var options = {
       gcmAPIKey: '446937322328',
       TTL: 60
    };
    webPush.sendNotification(
       pushSubscription,
       payload,
       options
    );