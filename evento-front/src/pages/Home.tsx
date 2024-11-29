import { Link } from "react-router-dom";
import {
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  TrophyIcon,
  ArrowRightIcon,
  FireIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-[url('/stadium-pattern.png')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Your Gateway to Sports Events
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-primary-100">
              Discover local sports events, join teams, and compete in tournaments.
              Your next game is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/events"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-primary-600 font-medium hover:bg-primary-50 transition-colors"
              >
                Find Events
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/create-event"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary-700 text-white font-medium hover:bg-primary-600 transition-colors"
              >
                Host Event
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Sports Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Popular Sports</h2>
            <p className="mt-4 text-lg text-gray-600">
              Browse events by your favorite sports
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularSports.map((sport) => (
              <Link
                key={sport.name}
                to={`/events?sport=${sport.name.toLowerCase()}`}
                className="group relative overflow-hidden rounded-xl aspect-square"
              >
                <img
                  src={sport.image}
                  alt={sport.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-semibold text-white">{sport.name}</h3>
                  <p className="text-sm text-gray-300">{sport.eventCount} events</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tournaments */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Tournaments
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Join competitive events and win prizes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tournaments.map((tournament) => (
              <div key={tournament.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={tournament.image}
                    alt={tournament.name}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-primary-600 flex items-center">
                    <TrophyIcon className="h-4 w-4 mr-1" />
                    Prize Pool: ${tournament.prizePool}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    <span>{tournament.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {tournament.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    <span>{tournament.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <UserGroupIcon className="h-5 w-5 mr-2" />
                      <span>{tournament.participants} participants</span>
                    </div>
                    <Link
                      to={`/tournaments/${tournament.id}`}
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Join Now
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  {benefit.icon}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Map */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Events Near You</h2>
            <p className="mt-4 text-lg text-gray-600">
              Discover sports events happening in your area
            </p>
          </div>
          {/* Add your map component here */}
          <div className="h-[400px] bg-gray-200 rounded-xl">
            {/* Map placeholder */}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Join the Game?
          </h2>
          <p className="text-lg text-primary-100 mb-8">
            Create an account and start participating in sports events today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-primary-600 font-medium hover:bg-primary-50 transition-colors"
            >
              Sign Up Now
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary-700 text-white font-medium hover:bg-primary-500 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Data
const popularSports = [
  {
    name: "Football",
    image: "https://source.unsplash.com/random/800x800?football",
    eventCount: 45,
  },
  {
    name: "Basketball",
    image: "https://source.unsplash.com/random/800x800?basketball",
    eventCount: 32,
  },
  {
    name: "Tennis",
    image: "https://source.unsplash.com/random/800x800?tennis",
    eventCount: 28,
  },
  {
    name: "Volleyball",
    image: "https://source.unsplash.com/random/800x800?volleyball",
    eventCount: 23,
  },
  // Add more sports...
];

const tournaments = [
  {
    id: 1,
    name: "City Football Championship",
    date: "Aug 15-20, 2024",
    location: "Central Stadium",
    prizePool: 5000,
    participants: 16,
    image: "https://source.unsplash.com/random/800x600?football-tournament",
  },
  {
    id: 2,
    name: "Summer Basketball League",
    date: "Jul 1-30, 2024",
    location: "Sports Complex",
    prizePool: 3000,
    participants: 12,
    image: "https://source.unsplash.com/random/800x600?basketball-tournament",
  },
  // Add more tournaments...
];

const benefits = [
  {
    title: "Easy Registration",
    description: "Sign up for events with just a few clicks",
    icon: <CalendarIcon className="w-6 h-6" />,
  },
  {
    title: "Live Updates",
    description: "Get real-time scores and tournament brackets",
    icon: <FireIcon className="w-6 h-6" />,
  },
  {
    title: "Performance Stats",
    description: "Track your progress and achievements",
    icon: <ChartBarIcon className="w-6 h-6" />,
  },
];

export default Home;
