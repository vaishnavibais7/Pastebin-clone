import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import type { Paste } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { PenLine, Trash2, ExternalLink, Copy, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [pastes, setPastes] = useState<Paste[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchPastes();
    }
  }, [user]);

  const fetchPastes = async () => {
    const { data, error } = await supabase
      .from("pastes")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch your pastes.",
        variant: "destructive",
      });
    } else {
      setPastes(data || []);
    }
    setLoading(false);
  };

  const deletePaste = async (id: string) => {
    const { error } = await supabase.from("pastes").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete paste.",
        variant: "destructive",
      });
    } else {
      setPastes(pastes.filter((p) => p.id !== id));
      toast({
        title: "Deleted",
        description: "Paste has been deleted.",
      });
    }
  };

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/p/${slug}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard.",
    });
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-display text-4xl tracking-wider">
                YOUR <span className="text-primary">PASTES</span>
              </h1>
              <p className="mt-2 text-muted-foreground">
                Manage all your pastes in one place
              </p>
            </div>
            <Link to="/create">
              <Button variant="hero">
                <PenLine className="h-4 w-4" />
                New Paste
              </Button>
            </Link>
          </div>

          {pastes.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <PenLine className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h2 className="mb-2 font-display text-2xl">No Pastes Yet</h2>
              <p className="mb-6 text-muted-foreground">
                Create your first paste and share it with the world
              </p>
              <Link to="/create">
                <Button variant="hero">Create Your First Paste</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {pastes.map((paste) => (
                <div
                  key={paste.id}
                  className="card-hover group rounded-xl border border-border bg-card p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/p/${paste.slug}`}
                        className="font-display text-xl tracking-wider hover:text-primary"
                      >
                        {paste.title}
                      </Link>
                      <p className="mt-1 truncate text-sm text-muted-foreground">
                        {paste.content.substring(0, 100)}...
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground/60">
                        {formatDistanceToNow(new Date(paste.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyLink(paste.slug)}
                        title="Copy link"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Link to={`/p/${paste.slug}`}>
                        <Button variant="ghost" size="icon" title="View paste">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deletePaste(paste.id)}
                        className="text-destructive hover:text-destructive"
                        title="Delete paste"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
