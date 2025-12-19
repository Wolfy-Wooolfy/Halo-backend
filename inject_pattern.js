const fs = require('fs');
const path = require('path');

const MEMORY_FILE = path.join(__dirname, 'data', 'memory_store.json');

// بيانات تحاكي 3 جمعات متتالية في المساء (لضمان اكتشاف النمط)
// اليوم هو الجمعة 19 ديسمبر، سنضع بيانات لليوم وللأسبوعين الماضيين
const fakeHistory = [
  { "at": "2025-12-05T19:00:00.000Z", "mood": "stressed", "context": "high_stress" }, // الجمعة قبل الماضية
  { "at": "2025-12-12T19:00:00.000Z", "mood": "stressed", "context": "high_stress" }, // الجمعة الماضية
  { "at": "2025-12-19T18:00:00.000Z", "mood": "stressed", "context": "high_stress" }, // اليوم مساءً
  { "at": "2025-12-19T18:30:00.000Z", "mood": "stressed", "context": "high_stress" }  // اليوم مساءً (تأكيد)
];

try {
  const data = JSON.parse(fs.readFileSync(MEMORY_FILE, 'utf8'));
  
  if (!data['pattern-test']) {
    console.error("User 'pattern-test' not found! Run step 2 first.");
    process.exit(1);
  }

  // Inject history
  data['pattern-test'].moodHistory = fakeHistory;
  
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(data, null, 2));
  console.log("✅ Fake history injected successfully into 'pattern-test'.");

} catch (err) {
  console.error("Error:", err);
}