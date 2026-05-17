const mongoose = require('mongoose');
require('dotenv').config();
const JobRequest = require('./models/JobRequest');

const sampleJobs = [
  {
    title: 'Leaking kitchen tap needs fixing',
    description: 'My kitchen tap has been dripping for a week. Needs urgent attention before it causes water damage.',
    category: 'Plumbing',
    location: 'Glasgow',
    contactName: 'John Smith',
    contactEmail: 'john@example.com',
    status: 'Open',
  },
  {
    title: 'Faulty living room lights',
    description: 'Two ceiling lights stopped working suddenly. May need rewiring or new fittings.',
    category: 'Electrical',
    location: 'Edinburgh',
    contactName: 'Sarah Connor',
    contactEmail: 'sarah@example.com',
    status: 'Open',
  },
  {
    title: 'Bedroom walls need repainting',
    description: 'Two bedroom walls need a fresh coat. White or off-white preferred. About 20 square metres.',
    category: 'Painting',
    location: 'Manchester',
    contactName: 'Mike Ross',
    contactEmail: 'mike@example.com',
    status: 'In Progress',
  },
  {
    title: 'Garden fence panel replacement',
    description: 'Three fence panels blown down in a storm. Need replacing ASAP before my dog escapes.',
    category: 'Joinery',
    location: 'Leeds',
    contactName: 'Emma Brown',
    contactEmail: 'emma@example.com',
    status: 'Open',
  },
  {
    title: 'Bathroom sink blocked',
    description: 'Bathroom sink drains very slowly. Tried unblocking myself with no luck. Needs professional.',
    category: 'Plumbing',
    location: 'Birmingham',
    contactName: 'David Lee',
    contactEmail: 'david@example.com',
    status: 'Closed',
  },
  {
    title: 'Kitchen socket not working',
    description: 'One double socket in the kitchen has stopped working. Everything else is fine on that circuit.',
    category: 'Electrical',
    location: 'Bristol',
    contactName: 'Rachel Green',
    contactEmail: 'rachel@example.com',
    status: 'Open',
  },
  {
    title: 'Front door needs repainting',
    description: 'Front door paint is peeling badly. Need sanding, priming and two coats of gloss. Colour: navy blue.',
    category: 'Painting',
    location: 'Liverpool',
    contactName: 'Tom Hardy',
    contactEmail: 'tom@example.com',
    status: 'Open',
  },
  {
    title: 'Kitchen cabinet door hinge broken',
    description: 'Two cabinet doors have broken hinges and will not close properly. Need replacing.',
    category: 'Joinery',
    location: 'Glasgow',
    contactName: 'Anna Bell',
    contactEmail: 'anna@example.com',
    status: 'Open',
  },
  {
    title: 'Shower pressure very low',
    description: 'Shower pressure has dropped significantly over the past month. Hot water is fine elsewhere.',
    category: 'Plumbing',
    location: 'Cardiff',
    contactName: 'James Wilson',
    contactEmail: 'james@example.com',
    status: 'In Progress',
  },
  {
    title: 'Garden shed roof leaking',
    description: 'Shed roof leaking after heavy rain. Tools getting wet. Need felt replaced or repaired urgently.',
    category: 'Joinery',
    location: 'Sheffield',
    contactName: 'Lucy Turner',
    contactEmail: 'lucy@example.com',
    status: 'Open',
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await JobRequest.deleteMany({});
  await JobRequest.insertMany(sampleJobs);
  console.log('Database seeded with 10 sample jobs!');
  process.exit();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});