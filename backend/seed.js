const mongoose = require('mongoose');
require('dotenv').config();
const JobRequest = require('./models/JobRequest');

const sampleJobs = [
  {
    title: 'Leaking kitchen tap needs fixing',
    description: 'My kitchen tap has been dripping for a week. Needs urgent attention.',
    category: 'Plumbing',
    location: 'Glasgow',
    contactName: 'John Smith',
    contactEmail: 'john@example.com',
    status: 'Open',
  },
  {
    title: 'Faulty living room lights',
    description: 'Two ceiling lights stopped working. May need rewiring.',
    category: 'Electrical',
    location: 'Edinburgh',
    contactName: 'Sarah Connor',
    contactEmail: 'sarah@example.com',
    status: 'Open',
  },
  {
    title: 'Bedroom walls need repainting',
    description: 'Two bedroom walls need a fresh coat. White or off-white preferred.',
    category: 'Painting',
    location: 'Manchester',
    contactName: 'Mike Ross',
    contactEmail: 'mike@example.com',
    status: 'In Progress',
  },
  {
    title: 'Garden fence panel replacement',
    description: 'Three fence panels blown down in a storm. Need replacing ASAP.',
    category: 'Joinery',
    location: 'Leeds',
    contactName: 'Emma Brown',
    contactEmail: 'emma@example.com',
    status: 'Open',
  },
  {
    title: 'Bathroom sink blocked',
    description: 'Bathroom sink drains very slowly. Tried unblocking myself but no luck.',
    category: 'Plumbing',
    location: 'Birmingham',
    contactName: 'David Lee',
    contactEmail: 'david@example.com',
    status: 'Closed',
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await JobRequest.deleteMany({});
  await JobRequest.insertMany(sampleJobs);
  console.log('Database seeded with 5 sample jobs!');
  process.exit();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});