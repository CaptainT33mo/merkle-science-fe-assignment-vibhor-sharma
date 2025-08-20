import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Image as ImageIcon,
  Link,
  ChevronDown
} from "lucide-react";

interface RichTextToolbarProps {
  onFormat: (format: string) => void;
}

export const RichTextToolbar = ({ onFormat }: RichTextToolbarProps) => {
  return (
    <div className="toolbar">
      <div className="flex items-center space-x-1">
        <select
          className="px-3 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700 min-w-[100px]"
          onChange={(e) => onFormat(e.target.value)}
          defaultValue="paragraph"
        >
          <option value="paragraph">Paragraph</option>
          <option value="heading1">Heading 1</option>
          <option value="heading2">Heading 2</option>
          <option value="heading3">Heading 3</option>
        </select>
        <ChevronDown className="h-4 w-4 text-gray-500 -ml-8 pointer-events-none" />
      </div>

      <div className="flex items-center space-x-1 ml-4">
        <button
          onClick={() => onFormat("bold")}
          className="toolbar-button"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>

        <button
          onClick={() => onFormat("italic")}
          className="toolbar-button"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>

        <button
          onClick={() => onFormat("underline")}
          className="toolbar-button"
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center space-x-1 ml-4">
        <button
          onClick={() => onFormat("bulletList")}
          className="toolbar-button"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>

        <button
          onClick={() => onFormat("orderedList")}
          className="toolbar-button"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <button
          onClick={() => onFormat("quote")}
          className="toolbar-button"
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center space-x-1 ml-4">
        <button
          onClick={() => onFormat("link")}
          className="toolbar-button"
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </button>

        <button
          onClick={() => onFormat("image")}
          className="toolbar-button"
          title="Insert Image"
        >
          <ImageIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
