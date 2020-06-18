"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.template = void 0;
const templateJSON = '{"introduction": "Very simple math quiz", "questions": [' +
    '{"question":"2 + 2","answer":"4","penalty":10},' +
    '{"question":"2 - 2","answer":"0","penalty":20},' +
    '{"question":"-6 - 5","answer":"-11","penalty":30},' +
    '{"question":"42 * 2","answer":"84","penalty":40},' +
    '{"question":"(-8)/2","answer":"-4","penalty":50}' +
    "]}";
exports.template = JSON.parse(templateJSON);
//# sourceMappingURL=ExampleTemplate.js.map