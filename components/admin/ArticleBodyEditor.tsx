"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

function emptyHtml(html: string) {
  const t = (html || "").trim();
  return !t || t === "<p></p>" || t === "<p><br></p>";
}

export function ArticleBodyEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
    ],
    content: emptyHtml(value) ? "" : value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "cms-rich-editor-content",
        "aria-label": "Article body",
      },
    },
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      onChange(emptyHtml(html) ? "<p></p>" : html);
    },
  });

  // Sync when loading an existing article (value arrives after fetch).
  useEffect(() => {
    if (!editor) return;
    const next = emptyHtml(value) ? "" : value;
    const current = editor.getHTML();
    if (emptyHtml(current) && !next) return;
    if (current === value || current === next) return;
    // Avoid clobbering while typing: only reset if external value differs meaningfully
    if (editor.isFocused) return;
    editor.commands.setContent(next || "", { emitUpdate: false });
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="cms-rich-editor cms-rich-editor--loading">
        Loading editor…
      </div>
    );
  }

  function setLink() {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter link URL", prev || "https://");
    if (url === null) return;
    const trimmed = url.trim();
    if (!trimmed) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: trimmed })
      .run();
  }

  return (
    <div className="cms-rich-editor">
      <div className="cms-rich-toolbar" role="toolbar" aria-label="Formatting">
        <button
          type="button"
          className={editor.isActive("bold") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          Bold
        </button>
        <button
          type="button"
          className={editor.isActive("italic") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          Italic
        </button>
        <span className="cms-rich-toolbar-sep" aria-hidden />
        <button
          type="button"
          className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          title="Heading"
        >
          Heading
        </button>
        <button
          type="button"
          className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          title="Subheading"
        >
          Subheading
        </button>
        <span className="cms-rich-toolbar-sep" aria-hidden />
        <button
          type="button"
          className={editor.isActive("bulletList") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet list"
        >
          List
        </button>
        <button
          type="button"
          className={editor.isActive("orderedList") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered list"
        >
          Numbers
        </button>
        <button
          type="button"
          className={editor.isActive("blockquote") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Quote"
        >
          Quote
        </button>
        <span className="cms-rich-toolbar-sep" aria-hidden />
        <button
          type="button"
          className={editor.isActive("link") ? "is-active" : ""}
          onClick={setLink}
          title="Link"
        >
          Link
        </button>
        <span className="cms-rich-toolbar-sep" aria-hidden />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          Undo
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          Redo
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
