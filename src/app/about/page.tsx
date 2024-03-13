import AboutLogo from "../_components/about-logo";

export default async function About() {
  return <>
    <AboutLogo />
    <div className="container">
      <p>
        This is a simple recipe manager.
      </p>
    </div>
  </>;
}
