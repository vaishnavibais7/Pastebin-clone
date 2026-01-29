import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex flex-1 items-center justify-center pt-16">
        <div className="text-center fade-in">
          <h1 className="mb-4 font-display text-8xl text-primary">404</h1>
          <h2 className="mb-4 font-display text-3xl tracking-wider">
            PAGE NOT FOUND
          </h2>
          <p className="mb-8 text-muted-foreground">
            The page you're looking for doesn't exist.
          </p>
          <Link to="/">
            <Button variant="hero" size="lg">
              Go Home
            </Button>
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
