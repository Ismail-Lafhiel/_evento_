import {
  UserGroupIcon,
  TrophyIcon,
  CalendarIcon,
  MapPinIcon,
  ChatBubbleBottomCenterTextIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

const About = () => {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 opacity-90" />
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Connecting Sports Enthusiasts
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            We're building the future of sports event management, making it
            easier for everyone to participate in and organize sporting events.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                We believe that sports have the power to bring people together
                and create lasting connections. Our platform is designed to make
                sports events more accessible, organized, and enjoyable for
                everyone.
              </p>
              <div className="space-y-4">
                {missionPoints.map((point, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                        {point.icon}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {point.title}
                      </h3>
                      <p className="mt-1 text-gray-600 dark:text-gray-300">
                        {point.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className="aspect-square rounded-2xl overflow-hidden"
                >
                  <img
                    src={`https://source.unsplash.com/random/600x600?sports&${index}`}
                    alt={`Sports ${index}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Meet Our Team
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              The passionate people behind our platform
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="relative mb-4 inline-block">
                  <div className="w-32 h-32 rounded-full overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Ready to Get Started?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-primary-600 font-medium hover:bg-primary-50 transition-colors">
              Contact Us
            </button>
            <button className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary-700 text-white font-medium hover:bg-primary-500 transition-colors">
              Join Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

// Data
const missionPoints = [
  {
    icon: <UserGroupIcon className="w-5 h-5 text-primary-600" />,
    title: "Community Building",
    description:
      "Creating connections between sports enthusiasts and organizers.",
  },
  {
    icon: <TrophyIcon className="w-5 h-5 text-primary-600" />,
    title: "Competition Excellence",
    description: "Facilitating well-organized tournaments and matches.",
  },
  {
    icon: <HeartIcon className="w-5 h-5 text-primary-600" />,
    title: "Passion for Sports",
    description: "Promoting active lifestyle and sportsmanship.",
  },
];

const stats = [
  { value: "50K+", label: "Active Users" },
  { value: "1000+", label: "Events Organized" },
  { value: "100+", label: "Locations" },
  { value: "95%", label: "Satisfaction Rate" },
];

const team = [
  {
    name: "John Doe",
    role: "Founder & CEO",
    image: "https://source.unsplash.com/random/200x200?portrait&1",
  },
  {
    name: "Jane Smith",
    role: "Head of Operations",
    image: "https://source.unsplash.com/random/200x200?portrait&2",
  },
  {
    name: "Mike Johnson",
    role: "Lead Developer",
    image: "https://source.unsplash.com/random/200x200?portrait&3",
  },
  {
    name: "Sarah Williams",
    role: "Community Manager",
    image: "https://source.unsplash.com/random/200x200?portrait&4",
  },
];

export default About;
