import Hero from "../components/Hero";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import CreateResume from "../components/CreateResume";

const Home = () => {
  return (
    <div className="">
      <Hero />
      <section id="features" name="features">
      <Features />
      </section>
      <Testimonials />
      <CreateResume />
    </div>
  );
};

export default Home;
