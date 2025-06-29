"use strict";
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
exports.id = "pages/api/arca/comprobante-ultimo";
exports.ids = ["pages/api/arca/comprobante-ultimo"];
exports.modules = {

/***/ "afip.ts":
/*!**************************!*\
  !*** external "afip.ts" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("afip.ts");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ "next/dist/compiled/next-server/pages-api.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages-api.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/pages-api.runtime.dev.js");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "(api)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Farca%2Fcomprobante-ultimo&preferredRegion=&absolutePagePath=.%2Fpages%2Fapi%2Farca%2Fcomprobante-ultimo.ts&middlewareConfigBase64=e30%3D!":
/*!********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Farca%2Fcomprobante-ultimo&preferredRegion=&absolutePagePath=.%2Fpages%2Fapi%2Farca%2Fcomprobante-ultimo.ts&middlewareConfigBase64=e30%3D! ***!
  \********************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   routeModule: () => (/* binding */ routeModule)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/pages-api/module.compiled */ \"(api)/./node_modules/next/dist/server/future/route-modules/pages-api/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(api)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/build/templates/helpers */ \"(api)/./node_modules/next/dist/build/templates/helpers.js\");\n/* harmony import */ var _pages_api_arca_comprobante_ultimo_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pages/api/arca/comprobante-ultimo.ts */ \"(api)/./pages/api/arca/comprobante-ultimo.ts\");\n\n\n\n// Import the userland code.\n\n// Re-export the handler (should be the default export).\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_pages_api_arca_comprobante_ultimo_ts__WEBPACK_IMPORTED_MODULE_3__, \"default\"));\n// Re-export config.\nconst config = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_pages_api_arca_comprobante_ultimo_ts__WEBPACK_IMPORTED_MODULE_3__, \"config\");\n// Create and export the route module that will be consumed.\nconst routeModule = new next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__.PagesAPIRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.PAGES_API,\n        page: \"/api/arca/comprobante-ultimo\",\n        pathname: \"/api/arca/comprobante-ultimo\",\n        // The following aren't used in production.\n        bundlePath: \"\",\n        filename: \"\"\n    },\n    userland: _pages_api_arca_comprobante_ultimo_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n\n//# sourceMappingURL=pages-api.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LXJvdXRlLWxvYWRlci9pbmRleC5qcz9raW5kPVBBR0VTX0FQSSZwYWdlPSUyRmFwaSUyRmFyY2ElMkZjb21wcm9iYW50ZS11bHRpbW8mcHJlZmVycmVkUmVnaW9uPSZhYnNvbHV0ZVBhZ2VQYXRoPS4lMkZwYWdlcyUyRmFwaSUyRmFyY2ElMkZjb21wcm9iYW50ZS11bHRpbW8udHMmbWlkZGxld2FyZUNvbmZpZ0Jhc2U2ND1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ0w7QUFDMUQ7QUFDbUU7QUFDbkU7QUFDQSxpRUFBZSx3RUFBSyxDQUFDLGtFQUFRLFlBQVksRUFBQztBQUMxQztBQUNPLGVBQWUsd0VBQUssQ0FBQyxrRUFBUTtBQUNwQztBQUNPLHdCQUF3QixnSEFBbUI7QUFDbEQ7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsWUFBWTtBQUNaLENBQUM7O0FBRUQiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9teS1hZmlwLWFwcC8/Y2UzMSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQYWdlc0FQSVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvcGFnZXMtYXBpL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IGhvaXN0IH0gZnJvbSBcIm5leHQvZGlzdC9idWlsZC90ZW1wbGF0ZXMvaGVscGVyc1wiO1xuLy8gSW1wb3J0IHRoZSB1c2VybGFuZCBjb2RlLlxuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi4vcGFnZXMvYXBpL2FyY2EvY29tcHJvYmFudGUtdWx0aW1vLnRzXCI7XG4vLyBSZS1leHBvcnQgdGhlIGhhbmRsZXIgKHNob3VsZCBiZSB0aGUgZGVmYXVsdCBleHBvcnQpLlxuZXhwb3J0IGRlZmF1bHQgaG9pc3QodXNlcmxhbmQsIFwiZGVmYXVsdFwiKTtcbi8vIFJlLWV4cG9ydCBjb25maWcuXG5leHBvcnQgY29uc3QgY29uZmlnID0gaG9pc3QodXNlcmxhbmQsIFwiY29uZmlnXCIpO1xuLy8gQ3JlYXRlIGFuZCBleHBvcnQgdGhlIHJvdXRlIG1vZHVsZSB0aGF0IHdpbGwgYmUgY29uc3VtZWQuXG5leHBvcnQgY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgUGFnZXNBUElSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuUEFHRVNfQVBJLFxuICAgICAgICBwYWdlOiBcIi9hcGkvYXJjYS9jb21wcm9iYW50ZS11bHRpbW9cIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9hcmNhL2NvbXByb2JhbnRlLXVsdGltb1wiLFxuICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGFyZW4ndCB1c2VkIGluIHByb2R1Y3Rpb24uXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcIlwiXG4gICAgfSxcbiAgICB1c2VybGFuZFxufSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhZ2VzLWFwaS5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Farca%2Fcomprobante-ultimo&preferredRegion=&absolutePagePath=.%2Fpages%2Fapi%2Farca%2Fcomprobante-ultimo.ts&middlewareConfigBase64=e30%3D!\n");

/***/ }),

/***/ "(api)/./lib/afip.ts":
/*!*********************!*\
  !*** ./lib/afip.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var afip_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! afip.ts */ \"afip.ts\");\n/* harmony import */ var afip_ts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(afip_ts__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! dotenv */ \"dotenv\");\n/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(dotenv__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! fs */ \"fs\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\ndotenv__WEBPACK_IMPORTED_MODULE_1__.config();\nconst key = fs__WEBPACK_IMPORTED_MODULE_2__.readFileSync(path__WEBPACK_IMPORTED_MODULE_3__.resolve(process.cwd(), \"certs/clave.key\")).toString();\nconst cert = fs__WEBPACK_IMPORTED_MODULE_2__.readFileSync(path__WEBPACK_IMPORTED_MODULE_3__.resolve(process.cwd(), \"certs/certificado.crt\")).toString();\nconst afip = new afip_ts__WEBPACK_IMPORTED_MODULE_0__.Afip({\n    cuit: Number(process.env.CUIT),\n    key: key,\n    cert: cert,\n    production: true\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (afip);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9saWIvYWZpcC50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBK0I7QUFDRTtBQUNSO0FBQ0k7QUFFN0JDLDBDQUFhO0FBRWIsTUFBTUksTUFBTUgsNENBQWUsQ0FBQ0MseUNBQVksQ0FBQ0ssUUFBUUMsR0FBRyxJQUFJLG9CQUFvQkMsUUFBUTtBQUNwRixNQUFNQyxPQUFPVCw0Q0FBZSxDQUFDQyx5Q0FBWSxDQUFDSyxRQUFRQyxHQUFHLElBQUksMEJBQTBCQyxRQUFRO0FBRTNGLE1BQU1FLE9BQU8sSUFBSVoseUNBQUlBLENBQUM7SUFDcEJhLE1BQU1DLE9BQU9OLFFBQVFPLEdBQUcsQ0FBQ0MsSUFBSTtJQUM3QlgsS0FBS0E7SUFDTE0sTUFBTUE7SUFDTk0sWUFBWTtBQUNkO0FBRUEsaUVBQWVMLElBQUlBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9teS1hZmlwLWFwcC8uL2xpYi9hZmlwLnRzP2Q4OTciXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZpcCB9IGZyb20gXCJhZmlwLnRzXCI7XG5pbXBvcnQgKiBhcyBkb3RlbnYgZnJvbSAnZG90ZW52JztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5cbmRvdGVudi5jb25maWcoKTtcblxuY29uc3Qga2V5ID0gZnMucmVhZEZpbGVTeW5jKHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAnY2VydHMvY2xhdmUua2V5JykpLnRvU3RyaW5nKCk7XG5jb25zdCBjZXJ0ID0gZnMucmVhZEZpbGVTeW5jKHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAnY2VydHMvY2VydGlmaWNhZG8uY3J0JykpLnRvU3RyaW5nKCk7XG5cbmNvbnN0IGFmaXAgPSBuZXcgQWZpcCh7XG4gIGN1aXQ6IE51bWJlcihwcm9jZXNzLmVudi5DVUlUKSxcbiAga2V5OiBrZXksXG4gIGNlcnQ6IGNlcnQsXG4gIHByb2R1Y3Rpb246IHRydWVcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBhZmlwO1xuIl0sIm5hbWVzIjpbIkFmaXAiLCJkb3RlbnYiLCJmcyIsInBhdGgiLCJjb25maWciLCJrZXkiLCJyZWFkRmlsZVN5bmMiLCJyZXNvbHZlIiwicHJvY2VzcyIsImN3ZCIsInRvU3RyaW5nIiwiY2VydCIsImFmaXAiLCJjdWl0IiwiTnVtYmVyIiwiZW52IiwiQ1VJVCIsInByb2R1Y3Rpb24iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./lib/afip.ts\n");

/***/ }),

/***/ "(api)/./pages/api/arca/comprobante-ultimo.ts":
/*!**********************************************!*\
  !*** ./pages/api/arca/comprobante-ultimo.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _lib_afip__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/afip */ \"(api)/./lib/afip.ts\");\n\nasync function handler(req, res) {\n    const lastVoucher = await _lib_afip__WEBPACK_IMPORTED_MODULE_0__[\"default\"].electronicBillingService.getLastVoucher(3, req.body.CbteTipo);\n    if (!lastVoucher) {\n        return res.status(404).json({\n            error: \"No se encontraron tipos de opciones\"\n        });\n    }\n    res.status(200).json(lastVoucher);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvYXJjYS9jb21wcm9iYW50ZS11bHRpbW8udHMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDcUM7QUFFdEIsZUFBZUMsUUFBUUMsR0FBbUIsRUFBRUMsR0FBb0I7SUFDM0UsTUFBTUMsY0FBYyxNQUFNSixpREFBSUEsQ0FBQ0ssd0JBQXdCLENBQUNDLGNBQWMsQ0FBQyxHQUFHSixJQUFJSyxJQUFJLENBQUNDLFFBQVE7SUFDM0YsSUFBRyxDQUFDSixhQUFhO1FBQ2IsT0FBT0QsSUFBSU0sTUFBTSxDQUFDLEtBQUtDLElBQUksQ0FBQztZQUFFQyxPQUFPO1FBQXNDO0lBQy9FO0lBRUFSLElBQUlNLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUNOO0FBQ3pCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbXktYWZpcC1hcHAvLi9wYWdlcy9hcGkvYXJjYS9jb21wcm9iYW50ZS11bHRpbW8udHM/N2E5MyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE5leHRBcGlSZXF1ZXN0LCBOZXh0QXBpUmVzcG9uc2UgfSBmcm9tICduZXh0JztcbmltcG9ydCBBZmlwIGZyb20gJy4uLy4uLy4uL2xpYi9hZmlwJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihyZXE6IE5leHRBcGlSZXF1ZXN0LCByZXM6IE5leHRBcGlSZXNwb25zZSkge1xuICAgIGNvbnN0IGxhc3RWb3VjaGVyID0gYXdhaXQgQWZpcC5lbGVjdHJvbmljQmlsbGluZ1NlcnZpY2UuZ2V0TGFzdFZvdWNoZXIoMywgcmVxLmJvZHkuQ2J0ZVRpcG8pO1xuICAgIGlmKCFsYXN0Vm91Y2hlcikge1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBlcnJvcjogJ05vIHNlIGVuY29udHJhcm9uIHRpcG9zIGRlIG9wY2lvbmVzJyB9KTtcbiAgICB9XG5cbiAgICByZXMuc3RhdHVzKDIwMCkuanNvbihsYXN0Vm91Y2hlcik7XG59XG4iXSwibmFtZXMiOlsiQWZpcCIsImhhbmRsZXIiLCJyZXEiLCJyZXMiLCJsYXN0Vm91Y2hlciIsImVsZWN0cm9uaWNCaWxsaW5nU2VydmljZSIsImdldExhc3RWb3VjaGVyIiwiYm9keSIsIkNidGVUaXBvIiwic3RhdHVzIiwianNvbiIsImVycm9yIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./pages/api/arca/comprobante-ultimo.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(api)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Farca%2Fcomprobante-ultimo&preferredRegion=&absolutePagePath=.%2Fpages%2Fapi%2Farca%2Fcomprobante-ultimo.ts&middlewareConfigBase64=e30%3D!")));
module.exports = __webpack_exports__;

})();