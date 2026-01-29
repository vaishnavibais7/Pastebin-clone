import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PenLine, Share2, MessageSquare, Heart, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden pt-16">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
          
          <div className="container relative z-10 mx-auto px-4 text-center">
            <div className="fade-in">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
                <PenLine className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Write. Share. Connect.</span>
              </div>
              
              <h1 className="mb-6 font-display text-6xl tracking-wider md:text-8xl lg:text-9xl">
                <span className="text-foreground">WRITE</span>
                <span className="text-primary">IN</span>
              </h1>
              
              <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
                Share your thoughts, code snippets, and ideas with the world. 
                Create shareable links in seconds.
              </p>
              
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link to="/signup">
                  <Button variant="hero" size="xl" className="group">
                    Start Writing
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="xl">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-display text-4xl tracking-wider md:text-5xl">
                WHY <span className="text-primary">WRITEIN</span>?
              </h2>
              <p className="mx-auto max-w-xl text-muted-foreground">
                Simple, fast, and beautiful. Share your content with anyone, anywhere.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              <FeatureCard
                icon={<Share2 className="h-8 w-8" />}
                title="Instant Sharing"
                description="Create a paste and share it instantly with a unique link. No complicated setup required."
              />
              <FeatureCard
                icon={<MessageSquare className="h-8 w-8" />}
                title="Comments"
                description="Engage with your audience through comments. Build discussions around your content."
              />
              <FeatureCard
                icon={<Heart className="h-8 w-8" />}
                title="Likes"
                description="Show appreciation for great content with likes. See what's popular in the community."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-border bg-card py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 font-display text-4xl tracking-wider md:text-5xl">
              READY TO <span className="text-primary">START</span>?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
              Join Writein today and start sharing your thoughts with the world.
            </p>
            <Link to="/signup">
              <Button variant="hero" size="xl">
                Create Your First Paste
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="card-hover group rounded-xl border border-border bg-card p-8 text-center">
      <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        {icon}
      </div>
      <h3 className="mb-2 font-display text-2xl tracking-wider">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

export default Index;
