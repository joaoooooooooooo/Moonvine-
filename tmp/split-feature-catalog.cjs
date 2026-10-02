const fs = require('fs');
const file = 'src/features/brand-tools/ReportFeature.jsx';
const content = fs.readFileSync(file, 'utf8');
const start = content.indexOf('// The same components');
const end = content.indexOf('\nconst { context', start);
fs.writeFileSync('src/features/brand-tools/report-features.js', content.slice(start, end) + '\n');
fs.writeFileSync(file, content.slice(0, start) + content.slice(end));
const editor = 'src/features/brand-tools/PostEditor.jsx';
fs.writeFileSync(editor, fs.readFileSync(editor, 'utf8').replace('import { reportFeatures } from "./ReportFeature";', 'import { reportFeatures } from "./report-features";'));
