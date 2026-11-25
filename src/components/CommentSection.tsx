"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { commentSchema } from "@/lib/validations";

type Comment = { id: string; content: string; createdAt: string; author: { name: string } };

// Liste des commentaires et formulaire d'ajout
export default function CommentSection({ reportId }: { reportId: string }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/reports/${reportId}/comments`);
      if (res.ok) setComments(await res.json());
    }
    load();
  }, [reportId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = commentSchema.safeParse({ content });
    if (!parsed.success) return setMessage(parsed.error.issues[0].message);

    const res = await fetch(`/api/reports/${reportId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    if (!res.ok) return setMessage((await res.json()).error);

    const comment: Comment = await res.json();
    setComments([...comments, comment]);
    setContent("");
    setMessage("");
  }

  return (
    <div className="card space-y-4">
      <h2 className="font-semibold">Commentaires ({comments.length})</h2>
      {comments.length === 0 && <p className="text-sm text-gray-500">Aucun commentaire.</p>}
      <ul className="space-y-2 text-sm">
        {comments.map((c) => (
          <li key={c.id} className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">
              {c.author.name}, le {new Date(c.createdAt).toLocaleString("fr-FR")}
            </p>
            <p>{c.content}</p>
          </li>
        ))}
      </ul>

      {session ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Votre commentaire"
            className="input mt-0"
          />
          <button className="btn">Commenter</button>
          {message && <p className="text-sm text-red-700">{message}</p>}
        </form>
      ) : (
        <p className="text-sm text-gray-500">Connectez-vous pour commenter.</p>
      )}
    </div>
  );
}
