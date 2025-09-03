let settingsDB = indexedDB.open("settings", 1);

settingsDB.onupgradeneeded = function (e) {
  let db = e.target.result;
  db.createObjectStore("settings", { keyPath: "settingName" });
};
let theme = document.getElementById("theme"); // light or dark or system
let language = document.getElementById("language"); //en or hi
let fontSize = document.getElementById("fontSize"); // 12-24
let notification = document.getElementById("notification"); //yes or no
let autoSave = document.getElementById("autosave"); //yes or no

let username = document.getElementById("username");
let email = document.getElementById("email");
let password = document.getElementById("password");
let twofa = document.getElementById("twofa"); // yes or no
let private = document.getElementById("private"); // yes or no

let layout = document.getElementById("layout"); // vertical or horizontal or compact
let accentColor = document.getElementById("accentColor"); // color picker
let sidebarPosition = document.getElementById("sidebarPosition"); // left or right
let animations = document.getElementById("animations"); // yes or no

let loginAlert = document.getElementById("loginAlert");
let sessionTimeout = document.getElementById("sessionTimeout"); // 15 or 30 or 60
let encrypt = document.getElementById("encrypt"); // yes or no

let debug = document.getElementById("debug"); // yes or no
let apiEndpoint = document.getElementById("apiEndpoint"); // url
let beta = document.getElementById("beta"); // yes or no
let customCSS = document.getElementById("customCss"); // css
let customJS = document.getElementById("customJs"); // js

let saveSettings = document.getElementById("saveSettings"); // The Button to save settings

saveSettings.addEventListener("click", () => {
  settingsDB.onsuccess = function (e) {
    let db = e.target.result;
    let tx = db.transaction("settings", "readwrite");
    let store = tx.objectStore("settings");
    store.put({
      settingName: "theme",
      settingValue: theme.value,
    });
    store.put({
      settingName: "language",
      settingValue: language.value,
    });
    store.put({
      settingName: "fontSize",
      settingValue: fontSize.value,
    });
    store.put({
      settingName: "notification",
      settingValue: notification.value,
    });
    store.put({
      settingName: "autoSave",
      settingValue: autoSave.value,
    });
    store.put({
      settingName: "username",
      settingValue: username.value,
    });
    store.put({
      settingName: "email",
      settingValue: email.value,
    });
    store.put({
      settingName: "password",
      settingValue: password.value,
    });
    store.put({
      settingName: "twofa",
      settingValue: twofa.value,
    });
    store.put({
      settingName: "private",
      settingValue: private.value,
    });
    store.put({
      settingName: "layout",
      settingValue: layout.value,
    });
    store.put({
      settingName: "accentColor",
      settingValue: accentColor.value,
    });
    store.put({
      settingName: "sidebarPosition",
      settingValue: sidebarPosition.value,
    });
    store.put({
      settingName: "animations",
      settingValue: animations.value,
    });
    store.put({
      settingName: "loginAlert",
      settingValue: loginAlert.value,
    });
    store.put({
      settingName: "sessionTimeout",
      settingValue: sessionTimeout.value,
    });
    store.put({
      settingName: "encrypt",
      settingValue: encrypt.value,
    });
    store.put({
      settingName: "debug",
      settingValue: debug.value,
    });
    store.put({
      settingName: "apiEndpoint",
      settingValue: apiEndpoint.value,
    });
    store.put({
      settingName: "beta",
      settingValue: beta.value,
    });
    store.put({
      settingName: "customCSS",
      settingValue: customCSS.value,
    });
    store.put({
      settingName: "customJS",
      settingValue: customJS.value,
    });
    tx.oncomplete = function () {
      db.close();
    };
  };
});


