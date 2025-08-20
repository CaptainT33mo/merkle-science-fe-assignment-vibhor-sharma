import { useImperativeHandle, forwardRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Link,
  Image as ImageIcon,
  Code,
  ChevronDown
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { Markdown } from "tiptap-markdown";
import "./RichTextEditor.css";

interface RichTextEditorProps {
  placeholder?: string;
  isLoading?: boolean;
  onContentChange?: (content: string) => void;
  onEnterPress?: () => void;
}

interface MarkdownStorage {
  markdown: {
    getMarkdown: () => string;
  };
}

export interface RichTextEditorRef {
  getPlainText: () => string;
  getMarkdownContent: () => string;
  clearContent: () => void;
  focus: () => void;
}

export const RichTextEditor = forwardRef<
  RichTextEditorRef,
  RichTextEditorProps
>(
  (
    {
      placeholder = "Ask me anything ...",
      isLoading = false,
      onContentChange,
      onEnterPress
    },
    ref
  ) => {
    const editor = useEditor({
      extensions: [
        StarterKit,
        LinkExtension.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: "text-blue-600 underline"
          }
        }),
        ImageExtension,
        TextAlign.configure({
          types: ["heading", "paragraph"]
        }),
        Markdown.configure({
          html: true,
          tightLists: true,
          bulletListMarker: "-",
          linkify: false,
          breaks: false,
          transformPastedText: false,
          transformCopiedText: false
        })
      ],
      content: "",
      editable: !isLoading,
      editorProps: {
        attributes: {
          placeholder: placeholder
        }
      },
      onUpdate: ({ editor }) => {
        const plainText = editor.getText().trim();
        if (onContentChange) {
          onContentChange(plainText);
        }
      }
    });

    const getMarkdownContent = () => {
      if (editor) {
        return (
          (
            editor.storage as unknown as MarkdownStorage
          ).markdown?.getMarkdown() || ""
        );
      }
      return "";
    };

    const getPlainText = () => {
      if (editor) {
        return editor.getText().trim();
      }
      return "";
    };

    const clearContent = () => {
      if (editor) {
        editor.commands.clearContent();
      }
    };

    const focus = () => {
      if (editor) {
        editor.commands.focus();
      }
    };

    useImperativeHandle(ref, () => ({
      getPlainText,
      getMarkdownContent,
      clearContent,
      focus
    }));

    const addLink = () => {
      const url = prompt("Enter URL:");
      if (url && editor) {
        editor.chain().focus().setLink({ href: url }).run();
      }
    };

    const addImage = () => {
      const imageUrl = prompt("Enter image URL:");
      if (imageUrl && editor) {
        editor.chain().focus().setImage({ src: imageUrl }).run();
      }
    };

    const getCurrentHeadingLevel = () => {
      if (!editor) return "paragraph";
      if (editor.isActive("heading", { level: 1 })) return "heading1";
      if (editor.isActive("heading", { level: 2 })) return "heading2";
      if (editor.isActive("heading", { level: 3 })) return "heading3";
      return "paragraph";
    };

    if (!editor) {
      return null;
    }

    return (
      <div>
        <div className="toolbar">
          <div className="flex items-center space-x-1">
            <div className="relative">
              <select
                className="px-3 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700 min-w-[100px] appearance-none pr-8"
                value={getCurrentHeadingLevel()}
                onChange={(e) => {
                  if (e.target.value === "paragraph") {
                    editor.chain().focus().setParagraph().run();
                  } else if (e.target.value === "heading1") {
                    editor.chain().focus().toggleHeading({ level: 1 }).run();
                  } else if (e.target.value === "heading2") {
                    editor.chain().focus().toggleHeading({ level: 2 }).run();
                  } else if (e.target.value === "heading3") {
                    editor.chain().focus().toggleHeading({ level: 3 }).run();
                  }
                }}
              >
                <option value="paragraph">Paragraph</option>
                <option value="heading1">Heading 1</option>
                <option value="heading2">Heading 2</option>
                <option value="heading3">Heading 3</option>
              </select>
              <ChevronDown className="h-4 w-4 text-gray-500 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center space-x-1 ml-4">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`toolbar-button ${editor.isActive("bold") ? "bg-gray-200" : ""}`}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`toolbar-button ${editor.isActive("italic") ? "bg-gray-200" : ""}`}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`toolbar-button ${editor.isActive("underline") ? "bg-gray-200" : ""}`}
              title="Underline"
            >
              <Underline className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center space-x-1 ml-4">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`toolbar-button ${editor.isActive("bulletList") ? "bg-gray-200" : ""}`}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`toolbar-button ${editor.isActive("orderedList") ? "bg-gray-200" : ""}`}
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`toolbar-button ${editor.isActive("blockquote") ? "bg-gray-200" : ""}`}
              title="Quote"
            >
              <Quote className="h-4 w-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`toolbar-button ${editor.isActive("codeBlock") ? "bg-gray-200" : ""}`}
              title="Code Block"
            >
              <Code className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center space-x-1 ml-4">
            <button
              onClick={addLink}
              className="toolbar-button"
              title="Insert Link"
            >
              <Link className="h-4 w-4" />
            </button>

            <button
              onClick={addImage}
              className="toolbar-button"
              title="Insert Image"
            >
              <ImageIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-3 md:p-4">
          <EditorContent
            editor={editor}
            className="prose-custom focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && onEnterPress) {
                e.preventDefault();
                onEnterPress();
              }
            }}
          />
        </div>
      </div>
    );
  }
);
