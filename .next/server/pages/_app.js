/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./src/pages/_app.tsx":
/*!****************************!*\
  !*** ./src/pages/_app.tsx ***!
  \****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/styles/globals.css */ \"./src/styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _rainbow_me_rainbowkit_styles_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @rainbow-me/rainbowkit/styles.css */ \"./node_modules/@rainbow-me/rainbowkit/dist/index.css\");\n/* harmony import */ var _rainbow_me_rainbowkit_styles_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_rainbow_me_rainbowkit_styles_css__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @rainbow-me/rainbowkit */ \"@rainbow-me/rainbowkit\");\n/* harmony import */ var wagmi__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! wagmi */ \"wagmi\");\n/* harmony import */ var wagmi_chains__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! wagmi/chains */ \"wagmi/chains\");\n/* harmony import */ var wagmi_providers_public__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! wagmi/providers/public */ \"wagmi/providers/public\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_3__, wagmi__WEBPACK_IMPORTED_MODULE_4__, wagmi_chains__WEBPACK_IMPORTED_MODULE_5__, wagmi_providers_public__WEBPACK_IMPORTED_MODULE_6__]);\n([_rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_3__, wagmi__WEBPACK_IMPORTED_MODULE_4__, wagmi_chains__WEBPACK_IMPORTED_MODULE_5__, wagmi_providers_public__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\n\nconst mantleTestnet = {\n    chainId: 5001,\n    chainName: \"Mantle Testnet\",\n    nativeCurrency: {\n        name: \"BitDAO\",\n        symbol: \"BIT\",\n        decimals: 18\n    },\n    rpcUrls: {\n        default: \"https://mantle-testnet.bitdao.io\"\n    },\n    blockExplorerUrls: [\n        \"https://explorer.testnet.mantle.xyz\"\n    ],\n    iconUrls: [\n        \"https://bitdao.io/favicon.ico\"\n    ],\n    isTestnet: true\n};\nconst { chains , provider  } = (0,wagmi__WEBPACK_IMPORTED_MODULE_4__.configureChains)([\n    wagmi_chains__WEBPACK_IMPORTED_MODULE_5__.optimismGoerli\n], [\n    (0,wagmi_providers_public__WEBPACK_IMPORTED_MODULE_6__.publicProvider)()\n]);\nconst { connectors  } = (0,_rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_3__.getDefaultWallets)({\n    appName: \"Podchain\",\n    chains\n});\nconst wagmiClient = (0,wagmi__WEBPACK_IMPORTED_MODULE_4__.createClient)({\n    autoConnect: true,\n    connectors,\n    provider\n});\nfunction App({ Component , pageProps  }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(wagmi__WEBPACK_IMPORTED_MODULE_4__.WagmiConfig, {\n        client: wagmiClient,\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_3__.RainbowKitProvider, {\n            chains: chains,\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps\n            }, void 0, false, {\n                fileName: \"/Users/markeljan/Projects/podchain/src/pages/_app.tsx\",\n                lineNumber: 43,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"/Users/markeljan/Projects/podchain/src/pages/_app.tsx\",\n            lineNumber: 42,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/markeljan/Projects/podchain/src/pages/_app.tsx\",\n        lineNumber: 41,\n        columnNumber: 5\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvX2FwcC50c3guanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQThCO0FBRWE7QUFDb0M7QUFDTDtBQUNuQjtBQUNDO0FBRXhELE1BQU1PLGdCQUFnQjtJQUNwQkMsU0FBUztJQUNUQyxXQUFXO0lBQ1hDLGdCQUFnQjtRQUNkQyxNQUFNO1FBQ05DLFFBQVE7UUFDUkMsVUFBVTtJQUNaO0lBQ0FDLFNBQVM7UUFDUEMsU0FBUztJQUNYO0lBRUFDLG1CQUFtQjtRQUFDO0tBQXNDO0lBQzFEQyxVQUFVO1FBQUM7S0FBZ0M7SUFDM0NDLFdBQVcsSUFBSTtBQUNqQjtBQUVBLE1BQU0sRUFBRUMsT0FBTSxFQUFFQyxTQUFRLEVBQUUsR0FBR2xCLHNEQUFlQSxDQUFDO0lBQUNHLHdEQUFjQTtDQUFDLEVBQUU7SUFBQ0Msc0VBQWNBO0NBQUc7QUFFakYsTUFBTSxFQUFFZSxXQUFVLEVBQUUsR0FBR3JCLHlFQUFpQkEsQ0FBQztJQUN2Q3NCLFNBQVM7SUFDVEg7QUFDRjtBQUVBLE1BQU1JLGNBQWNwQixtREFBWUEsQ0FBQztJQUMvQnFCLGFBQWEsSUFBSTtJQUNqQkg7SUFDQUQ7QUFDRjtBQUVlLFNBQVNLLElBQUksRUFBRUMsVUFBUyxFQUFFQyxVQUFTLEVBQVksRUFBRTtJQUM5RCxxQkFDRSw4REFBQ3ZCLDhDQUFXQTtRQUFDd0IsUUFBUUw7a0JBQ25CLDRFQUFDdEIsc0VBQWtCQTtZQUFDa0IsUUFBUUE7c0JBQzFCLDRFQUFDTztnQkFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7Ozs7Ozs7O0FBSWhDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jcmVhdGUtbmV4dC1hcHAvLi9zcmMvcGFnZXMvX2FwcC50c3g/ZjlkNiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXCJAL3N0eWxlcy9nbG9iYWxzLmNzc1wiO1xuaW1wb3J0IHR5cGUgeyBBcHBQcm9wcyB9IGZyb20gXCJuZXh0L2FwcFwiO1xuaW1wb3J0IFwiQHJhaW5ib3ctbWUvcmFpbmJvd2tpdC9zdHlsZXMuY3NzXCI7XG5pbXBvcnQgeyBnZXREZWZhdWx0V2FsbGV0cywgUmFpbmJvd0tpdFByb3ZpZGVyIH0gZnJvbSBcIkByYWluYm93LW1lL3JhaW5ib3draXRcIjtcbmltcG9ydCB7IENoYWluLCBjb25maWd1cmVDaGFpbnMsIGNyZWF0ZUNsaWVudCwgV2FnbWlDb25maWcgfSBmcm9tIFwid2FnbWlcIjtcbmltcG9ydCB7IG1haW5uZXQsIG9wdGltaXNtR29lcmxpIH0gZnJvbSBcIndhZ21pL2NoYWluc1wiO1xuaW1wb3J0IHsgcHVibGljUHJvdmlkZXIgfSBmcm9tIFwid2FnbWkvcHJvdmlkZXJzL3B1YmxpY1wiO1xuXG5jb25zdCBtYW50bGVUZXN0bmV0ID0ge1xuICBjaGFpbklkOiA1MDAxLFxuICBjaGFpbk5hbWU6IFwiTWFudGxlIFRlc3RuZXRcIixcbiAgbmF0aXZlQ3VycmVuY3k6IHtcbiAgICBuYW1lOiBcIkJpdERBT1wiLFxuICAgIHN5bWJvbDogXCJCSVRcIixcbiAgICBkZWNpbWFsczogMTgsXG4gIH0sXG4gIHJwY1VybHM6IHtcbiAgICBkZWZhdWx0OiBcImh0dHBzOi8vbWFudGxlLXRlc3RuZXQuYml0ZGFvLmlvXCIsXG4gIH0gYXMgYW55LFxuXG4gIGJsb2NrRXhwbG9yZXJVcmxzOiBbXCJodHRwczovL2V4cGxvcmVyLnRlc3RuZXQubWFudGxlLnh5elwiXSxcbiAgaWNvblVybHM6IFtcImh0dHBzOi8vYml0ZGFvLmlvL2Zhdmljb24uaWNvXCJdLFxuICBpc1Rlc3RuZXQ6IHRydWUsXG59O1xuXG5jb25zdCB7IGNoYWlucywgcHJvdmlkZXIgfSA9IGNvbmZpZ3VyZUNoYWlucyhbb3B0aW1pc21Hb2VybGldLCBbcHVibGljUHJvdmlkZXIoKV0pO1xuXG5jb25zdCB7IGNvbm5lY3RvcnMgfSA9IGdldERlZmF1bHRXYWxsZXRzKHtcbiAgYXBwTmFtZTogXCJQb2RjaGFpblwiLFxuICBjaGFpbnMsXG59KTtcblxuY29uc3Qgd2FnbWlDbGllbnQgPSBjcmVhdGVDbGllbnQoe1xuICBhdXRvQ29ubmVjdDogdHJ1ZSxcbiAgY29ubmVjdG9ycyxcbiAgcHJvdmlkZXIsXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHMpIHtcbiAgcmV0dXJuIChcbiAgICA8V2FnbWlDb25maWcgY2xpZW50PXt3YWdtaUNsaWVudH0+XG4gICAgICA8UmFpbmJvd0tpdFByb3ZpZGVyIGNoYWlucz17Y2hhaW5zfT5cbiAgICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxuICAgICAgPC9SYWluYm93S2l0UHJvdmlkZXI+XG4gICAgPC9XYWdtaUNvbmZpZz5cbiAgKTtcbn1cbiJdLCJuYW1lcyI6WyJnZXREZWZhdWx0V2FsbGV0cyIsIlJhaW5ib3dLaXRQcm92aWRlciIsImNvbmZpZ3VyZUNoYWlucyIsImNyZWF0ZUNsaWVudCIsIldhZ21pQ29uZmlnIiwib3B0aW1pc21Hb2VybGkiLCJwdWJsaWNQcm92aWRlciIsIm1hbnRsZVRlc3RuZXQiLCJjaGFpbklkIiwiY2hhaW5OYW1lIiwibmF0aXZlQ3VycmVuY3kiLCJuYW1lIiwic3ltYm9sIiwiZGVjaW1hbHMiLCJycGNVcmxzIiwiZGVmYXVsdCIsImJsb2NrRXhwbG9yZXJVcmxzIiwiaWNvblVybHMiLCJpc1Rlc3RuZXQiLCJjaGFpbnMiLCJwcm92aWRlciIsImNvbm5lY3RvcnMiLCJhcHBOYW1lIiwid2FnbWlDbGllbnQiLCJhdXRvQ29ubmVjdCIsIkFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyIsImNsaWVudCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/pages/_app.tsx\n");

/***/ }),

/***/ "./node_modules/@rainbow-me/rainbowkit/dist/index.css":
/*!************************************************************!*\
  !*** ./node_modules/@rainbow-me/rainbowkit/dist/index.css ***!
  \************************************************************/
/***/ (() => {



/***/ }),

/***/ "./src/styles/globals.css":
/*!********************************!*\
  !*** ./src/styles/globals.css ***!
  \********************************/
/***/ (() => {



/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "@rainbow-me/rainbowkit":
/*!*****************************************!*\
  !*** external "@rainbow-me/rainbowkit" ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@rainbow-me/rainbowkit");;

/***/ }),

/***/ "wagmi":
/*!************************!*\
  !*** external "wagmi" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = import("wagmi");;

/***/ }),

/***/ "wagmi/chains":
/*!*******************************!*\
  !*** external "wagmi/chains" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = import("wagmi/chains");;

/***/ }),

/***/ "wagmi/providers/public":
/*!*****************************************!*\
  !*** external "wagmi/providers/public" ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = import("wagmi/providers/public");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./src/pages/_app.tsx"));
module.exports = __webpack_exports__;

})();