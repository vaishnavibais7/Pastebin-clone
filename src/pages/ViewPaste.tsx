import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import type { Paste, Comment, Profile } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Heart, MessageSquare, Copy, Share2, Loader2, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CommentWithProfile extends Comment {
  profile?: Profile;
}

export default function ViewPaste() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [paste, setPaste] = useState<Paste | null>(null);
  const [comments, setComments] = useState<CommentWithProfile[]>([]);
  const [likes, setLikes] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [author, setAuthor] = useState<Profile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      fetchPaste();
    }
  }, [slug]);

  useEffect(() => {
    if (paste && user) {
      checkIfLiked();
    }
  }, [paste, user]);

  const fetchPaste = async () => {
    setLoading(true);

    // Fetch paste
    const { data: pasteData, error: pasteError } = await supabase
      .from("pastes")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (pasteError || !pasteData) {
      setPaste(null);
      setLoading(false);
      return;
    }

    setPaste(pasteData);

    // Fetch author profile
    const { data: authorData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", pasteData.user_id)
      .maybeSingle();

    setAuthor(authorData);

    // Fetch comments
    const { data: commentsData } = await supabase
      .from("comments")
      .select("*")
      .eq("paste_id", pasteData.id)
      .order("created_at", { ascending: true });

    // Fetch profiles for comments
    if (commentsData && commentsData.length > 0) {
      const userIds = [...new Set(commentsData.map(c => c.user_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", userIds);

      const profilesMap = new Map<string, Profile>();
      profilesData?.forEach(p => profilesMap.set(p.user_id, p));

      const commentsWithProfiles: CommentWithProfile[] = commentsData.map(c => ({
        ...c,
        profile: profilesMap.get(c.user_id),
      }));

      setComments(commentsWithProfiles);
    } else {
      setComments([]);
    }

    // Fetch likes count
    const { count } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("paste_id", pasteData.id);

    setLikes(count || 0);
    setLoading(false);
  };

  const checkIfLiked = async () => {
    if (!paste || !user) return;

    const { data } = await supabase
      .from("likes")
      .select("id")
      .eq("paste_id", paste.id)
      .eq("user_id", user.id)
      .maybeSingle();

    setHasLiked(!!data);
  };

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like this paste.",
        variant: "destructive",
      });
      return;
    }

    if (!paste) return;

    if (hasLiked) {
      // Unlike
      await supabase
        .from("likes")
        .delete()
        .eq("paste_id", paste.id)
        .eq("user_id", user.id);

      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      // Like
      await supabase.from("likes").insert({
        paste_id: paste.id,
        user_id: user.id,
      });

      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to comment.",
        variant: "destructive",
      });
      return;
    }

    if (!paste || !newComment.trim()) return;

    setSubmitting(true);

    const { data, error } = await supabase
      .from("comments")
      .insert({
        paste_id: paste.id,
        user_id: user.id,
        content: newComment.trim(),
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to post comment.",
        variant: "destructive",
      });
    } else if (data) {
      // Fetch the profile for this comment
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      const newCommentWithProfile: CommentWithProfile = {
        ...data,
        profile: profileData || undefined,
      };

      setComments([...comments, newCommentWithProfile]);
      setNewComment("");
      toast({
        title: "Comment posted",
        description: "Your comment has been added.",
      });
    }

    setSubmitting(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard.",
    });
  };

  const copyContent = () => {
    if (paste) {
      navigator.clipboard.writeText(paste.content);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!paste) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center pt-16">
          <div className="text-center">
            <h1 className="mb-4 font-display text-4xl">PASTE NOT FOUND</h1>
            <p className="mb-6 text-muted-foreground">
              This paste doesn't exist or has been deleted.
            </p>
            <Link to="/">
              <Button variant="hero">Go Home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto max-w-4xl px-4">
          {/* Paste Header */}
          <div className="mb-6">
            <h1 className="font-display text-4xl tracking-wider md:text-5xl">
              {paste.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{author?.username || "Anonymous"}</span>
              </div>
              <span>•</span>
              <span>
                {formatDistanceToNow(new Date(paste.created_at), { addSuffix: true })}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-6 flex flex-wrap gap-3">
            <Button
              variant={hasLiked ? "default" : "outline"}
              onClick={handleLike}
              className={hasLiked ? "bg-primary" : ""}
            >
              <Heart className={`h-4 w-4 ${hasLiked ? "fill-current" : ""}`} />
              {likes} {likes === 1 ? "Like" : "Likes"}
            </Button>
            <Button variant="outline" onClick={copyContent}>
              <Copy className="h-4 w-4" />
              Copy Content
            </Button>
            <Button variant="outline" onClick={copyLink}>
              <Share2 className="h-4 w-4" />
              Share Link
            </Button>
          </div>

          {/* Paste Content */}
          <div className="mb-8 rounded-xl border border-border bg-card p-6">
            <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground">
              {paste.content}
            </pre>
          </div>

          {/* Comments Section */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-6 flex items-center gap-2 font-display text-2xl tracking-wider">
              <MessageSquare className="h-6 w-6 text-primary" />
              COMMENTS ({comments.length})
            </h2>

            {/* Comment Form */}
            {user ? (
              <form onSubmit={handleComment} className="mb-6">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-3 bg-input"
                  rows={3}
                />
                <Button type="submit" variant="hero" disabled={submitting || !newComment.trim()}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Post Comment"
                  )}
                </Button>
              </form>
            ) : (
              <div className="mb-6 rounded-lg border border-border bg-muted/50 p-4 text-center">
                <p className="mb-3 text-muted-foreground">
                  Sign in to leave a comment
                </p>
                <Link to="/login">
                  <Button variant="hero" size="sm">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}

            {/* Comments List */}
            {comments.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-lg border border-border bg-muted/30 p-4"
                  >
                    <div className="mb-2 flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-primary" />
                      <span className="font-medium">
                        {comment.profile?.username || "Anonymous"}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
