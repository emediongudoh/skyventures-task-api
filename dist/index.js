'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const dotenv_1 = __importDefault(require('dotenv'));
// Create express app
const app = (0, express_1.default)();
// Load environment variables
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
// Test task route
app.get('/', (req, res) => {
    res.send('Testing SkyVentures Task API');
});
// Start the dev server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
