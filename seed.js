// seed.js
import seedAuto from './seed-auto.js';

seedAuto().then(() => {
  console.log('✅ Seeding complete!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});