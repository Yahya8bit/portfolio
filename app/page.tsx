import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import Education from "@/components/sections/Education";
import Activities from "@/components/sections/Activities";
import Skills from "@/components/sections/Skills";
import MyStory from "@/components/sections/MyStory";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <Projects />
        <Education />
        <Activities />
        <Skills />
        <MyStory />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
