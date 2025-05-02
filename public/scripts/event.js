var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
// home - buying/renting filter
document.addEventListener("DOMContentLoaded", function () {
    var buttons = document.querySelectorAll(".tab-buttons button");
    var content = document.getElementById("content");
    buttons.forEach(function (button) {
        button.addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
            var tab, res, html, parser, doc, newContent, seeAllLink;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        buttons.forEach(function (btn) { return btn.classList.remove("active"); });
                        button.classList.add("active");
                        tab = button.id === "buyingBtn" ? "buying" : "renting";
                        return [4 /*yield*/, fetch("/".concat(tab))];
                    case 1:
                        res = _b.sent();
                        return [4 /*yield*/, res.text()];
                    case 2:
                        html = _b.sent();
                        parser = new DOMParser();
                        doc = parser.parseFromString(html, "text/html");
                        newContent = (_a = doc.getElementById("content")) === null || _a === void 0 ? void 0 : _a.innerHTML;
                        if (newContent && content) {
                            content.innerHTML = newContent;
                        }
                        seeAllLink = document.getElementById("link");
                        if (seeAllLink) {
                            seeAllLink.href = tab === "buying" ? "/buying-page" : "/renting-page";
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
// profile - btn groups
document.addEventListener("DOMContentLoaded", function () {
    var buttonContainer = document.getElementById("profile-btns");
    buttonContainer === null || buttonContainer === void 0 ? void 0 : buttonContainer.addEventListener("click", function (e) {
        var target = e.target;
        var button = target.closest("button[data-route]");
        if (button) {
            var route = button.getAttribute("data-route");
            if (route) {
                // window.location.href = `profile${route}`;
                window.location.href = route;
            }
        }
    });
});
// login - forgot password btn
document.addEventListener("DOMContentLoaded", function () {
    var forgotLink = document.getElementById("forgot-link");
    var forgotBox = document.getElementById("forgot-password-box");
    var closeBtn = document.getElementById("closeBtn");
    forgotLink.addEventListener("click", function () {
        forgotBox.classList.remove("hidden");
    });
    closeBtn.addEventListener("click", function () {
        forgotBox.classList.add("hidden");
    });
});
// <div id="forgot-password-box" class="forgot-password hidden">
//           <div class="forgot-password-content">
//             <button class="close-btn" id="closeBtn"><i class="fas fa-chevron-left"></i></button>
//             <p>Forgot your Password? Check your email for a link to reset your password</p>
//             <input type="text" id="resetInput" placeholder="Email/Phone Number" />
//             <button class="resend-btn" id="resendEmailBtn">Resend Email</button>
//           </div>
//         </div>
