"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/sync-multihash-sha2";
exports.ids = ["vendor-chunks/sync-multihash-sha2"];
exports.modules = {

/***/ "(ssr)/./node_modules/sync-multihash-sha2/src/sha256/digest.js":
/*!***************************************************************!*\
  !*** ./node_modules/sync-multihash-sha2/src/sha256/digest.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Digest: () => (/* binding */ Digest),\n/* harmony export */   code: () => (/* binding */ code),\n/* harmony export */   name: () => (/* binding */ name),\n/* harmony export */   prefix: () => (/* binding */ prefix),\n/* harmony export */   size: () => (/* binding */ size)\n/* harmony export */ });\nconst name = 'sha2-256'\nconst code = 0x12\nconst size = 32\n\nconst prefix = new Uint8Array([18, 32])\n\nclass Digest {\n  /**\n   * @param {Uint8Array} bytes\n   */\n  constructor(bytes) {\n    /** @type {typeof code} */\n    this.code = code\n    /** @type {typeof name} */\n    this.name = name\n    this.bytes = bytes\n    /** @type {typeof size} */\n    this.size = size\n    this.digest = bytes.subarray(2)\n  }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvc3luYy1tdWx0aWhhc2gtc2hhMi9zcmMvc2hhMjU2L2RpZ2VzdC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFPO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNQO0FBQ0EsYUFBYSxZQUFZO0FBQ3pCO0FBQ0E7QUFDQSxlQUFlLGFBQWE7QUFDNUI7QUFDQSxlQUFlLGFBQWE7QUFDNUI7QUFDQTtBQUNBLGVBQWUsYUFBYTtBQUM1QjtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL29jcHItd2ViLy4vbm9kZV9tb2R1bGVzL3N5bmMtbXVsdGloYXNoLXNoYTIvc3JjL3NoYTI1Ni9kaWdlc3QuanM/MzdkMSJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgbmFtZSA9ICdzaGEyLTI1NidcbmV4cG9ydCBjb25zdCBjb2RlID0gMHgxMlxuZXhwb3J0IGNvbnN0IHNpemUgPSAzMlxuXG5leHBvcnQgY29uc3QgcHJlZml4ID0gbmV3IFVpbnQ4QXJyYXkoWzE4LCAzMl0pXG5cbmV4cG9ydCBjbGFzcyBEaWdlc3Qge1xuICAvKipcbiAgICogQHBhcmFtIHtVaW50OEFycmF5fSBieXRlc1xuICAgKi9cbiAgY29uc3RydWN0b3IoYnl0ZXMpIHtcbiAgICAvKiogQHR5cGUge3R5cGVvZiBjb2RlfSAqL1xuICAgIHRoaXMuY29kZSA9IGNvZGVcbiAgICAvKiogQHR5cGUge3R5cGVvZiBuYW1lfSAqL1xuICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgICB0aGlzLmJ5dGVzID0gYnl0ZXNcbiAgICAvKiogQHR5cGUge3R5cGVvZiBzaXplfSAqL1xuICAgIHRoaXMuc2l6ZSA9IHNpemVcbiAgICB0aGlzLmRpZ2VzdCA9IGJ5dGVzLnN1YmFycmF5KDIpXG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/sync-multihash-sha2/src/sha256/digest.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/sync-multihash-sha2/src/sha256/node.js":
/*!*************************************************************!*\
  !*** ./node_modules/sync-multihash-sha2/src/sha256/node.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   code: () => (/* reexport safe */ _digest_js__WEBPACK_IMPORTED_MODULE_1__.code),\n/* harmony export */   digest: () => (/* binding */ digest),\n/* harmony export */   name: () => (/* reexport safe */ _digest_js__WEBPACK_IMPORTED_MODULE_1__.name),\n/* harmony export */   size: () => (/* reexport safe */ _digest_js__WEBPACK_IMPORTED_MODULE_1__.size)\n/* harmony export */ });\n/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:crypto */ \"node:crypto\");\n/* harmony import */ var _digest_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./digest.js */ \"(ssr)/./node_modules/sync-multihash-sha2/src/sha256/digest.js\");\n\n\n\n\n\n/**\n * @param {Uint8Array} payload\n * @returns {import('multiformats').MultihashDigest<typeof code>}\n */\nconst digest = (payload) => {\n  const digest = new Uint8Array(_digest_js__WEBPACK_IMPORTED_MODULE_1__.prefix.length + _digest_js__WEBPACK_IMPORTED_MODULE_1__.size)\n  digest.set(_digest_js__WEBPACK_IMPORTED_MODULE_1__.prefix, 0)\n  digest.set(\n    node_crypto__WEBPACK_IMPORTED_MODULE_0__.createHash('sha256').update(payload).digest(),\n    _digest_js__WEBPACK_IMPORTED_MODULE_1__.prefix.length\n  )\n\n  return new _digest_js__WEBPACK_IMPORTED_MODULE_1__.Digest(digest)\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvc3luYy1tdWx0aWhhc2gtc2hhMi9zcmMvc2hhMjU2L25vZGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQWdDO0FBQzhCOztBQUVuQzs7QUFFM0I7QUFDQSxXQUFXLFlBQVk7QUFDdkIsYUFBYTtBQUNiO0FBQ087QUFDUCxnQ0FBZ0MsOENBQU0sVUFBVSw0Q0FBSTtBQUNwRCxhQUFhLDhDQUFNO0FBQ25CO0FBQ0EsSUFBSSxtREFBaUI7QUFDckIsSUFBSSw4Q0FBTTtBQUNWOztBQUVBLGFBQWEsOENBQU07QUFDbkIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9vY3ByLXdlYi8uL25vZGVfbW9kdWxlcy9zeW5jLW11bHRpaGFzaC1zaGEyL3NyYy9zaGEyNTYvbm9kZS5qcz84YTA0Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjcnlwdG8gZnJvbSAnbm9kZTpjcnlwdG8nXG5pbXBvcnQgeyBuYW1lLCBzaXplLCBjb2RlLCBwcmVmaXgsIERpZ2VzdCB9IGZyb20gJy4vZGlnZXN0LmpzJ1xuXG5leHBvcnQgeyBuYW1lLCBzaXplLCBjb2RlIH1cblxuLyoqXG4gKiBAcGFyYW0ge1VpbnQ4QXJyYXl9IHBheWxvYWRcbiAqIEByZXR1cm5zIHtpbXBvcnQoJ211bHRpZm9ybWF0cycpLk11bHRpaGFzaERpZ2VzdDx0eXBlb2YgY29kZT59XG4gKi9cbmV4cG9ydCBjb25zdCBkaWdlc3QgPSAocGF5bG9hZCkgPT4ge1xuICBjb25zdCBkaWdlc3QgPSBuZXcgVWludDhBcnJheShwcmVmaXgubGVuZ3RoICsgc2l6ZSlcbiAgZGlnZXN0LnNldChwcmVmaXgsIDApXG4gIGRpZ2VzdC5zZXQoXG4gICAgY3J5cHRvLmNyZWF0ZUhhc2goJ3NoYTI1NicpLnVwZGF0ZShwYXlsb2FkKS5kaWdlc3QoKSxcbiAgICBwcmVmaXgubGVuZ3RoXG4gIClcblxuICByZXR1cm4gbmV3IERpZ2VzdChkaWdlc3QpXG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/sync-multihash-sha2/src/sha256/node.js\n");

/***/ })

};
;