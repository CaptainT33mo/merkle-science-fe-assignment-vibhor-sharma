import { useImperativeHandle, forwardRef, useState } from "react";
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
  ChevronDown,
  Smile
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import EmojiExtension from "@tiptap/extension-emoji";
import { Markdown } from "tiptap-markdown";
import ToolbarButton from "./toolbar-button";
import EmojiPicker from "./emoji-picker";
import "./index.css";

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

const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  (
    {
      placeholder = "Ask me anything ...",
      isLoading = false,
      onContentChange,
      onEnterPress
    },
    ref
  ) => {
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
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
        EmojiExtension,
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
        <div className="toolbar md:pl-0.5">
          <div className="flex items-center space-x-1 border-r">
            <div className="relative">
              <select
                className="px-3 py-1 text-sm bg-white text-gray-700 min-w-[100px] appearance-none pr-8"
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

          <div className="flex items-center space-x-1 md:ml-4">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive("underline")}
              title="Underline"
            >
              <Underline className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <div className="flex items-center space-x-1 md:ml-4">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive("blockquote")}
              title="Quote"
            >
              <Quote className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              isActive={editor.isActive("codeBlock")}
              title="Code Block"
            >
              <Code className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <div className="flex items-center space-x-1 md:ml-4">
            <ToolbarButton onClick={addLink} title="Insert Link">
              <Link className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton onClick={addImage} title="Insert Image">
              <ImageIcon className="h-4 w-4" />
            </ToolbarButton>

            <div className="relative">
              <ToolbarButton
                onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                title="Insert Emoji"
              >
                <Smile className="h-4 w-4" />
              </ToolbarButton>
              <EmojiPicker
                isOpen={isEmojiPickerOpen}
                onClose={() => setIsEmojiPickerOpen(false)}
                onEmojiSelect={(emoji) => {
                  if (editor) {
                    editor.chain().focus().insertContent(emoji).run();
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="p-3 md:p-4">
          <EditorContent
            editor={editor}
            className="prose-custom focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (e.shiftKey) {
                  // Shift+Enter: Create a new line
                  e.preventDefault();
                  editor.chain().focus().setHardBreak().run();
                } else if (onEnterPress) {
                  // Enter: Submit the form
                  e.preventDefault();
                  onEnterPress();
                }
              }
            }}
          />
        </div>
      </div>
    );
  }
);

export default RichTextEditor;
