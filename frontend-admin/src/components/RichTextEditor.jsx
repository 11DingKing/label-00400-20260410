/**
 * 富文本编辑器组件 - 基于 Tiptap (支持 React 19)
 */
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { useEffect } from 'react';
import { Button, Space, Tooltip, Divider } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  LinkOutlined,
  PictureOutlined,
  UndoOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import './RichTextEditor.css';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt('输入图片URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const url = window.prompt('输入链接URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="editor-toolbar">
      <Space wrap size={4}>
        <Tooltip title="撤销">
          <Button
            size="small"
            icon={<UndoOutlined />}
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          />
        </Tooltip>
        <Tooltip title="重做">
          <Button
            size="small"
            icon={<RedoOutlined />}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          />
        </Tooltip>
        <Divider type="vertical" />
        <Tooltip title="加粗">
          <Button
            size="small"
            type={editor.isActive('bold') ? 'primary' : 'default'}
            icon={<BoldOutlined />}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
        </Tooltip>
        <Tooltip title="斜体">
          <Button
            size="small"
            type={editor.isActive('italic') ? 'primary' : 'default'}
            icon={<ItalicOutlined />}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
        </Tooltip>
        <Tooltip title="下划线">
          <Button
            size="small"
            type={editor.isActive('underline') ? 'primary' : 'default'}
            icon={<UnderlineOutlined />}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          />
        </Tooltip>
        <Tooltip title="删除线">
          <Button
            size="small"
            type={editor.isActive('strike') ? 'primary' : 'default'}
            icon={<StrikethroughOutlined />}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          />
        </Tooltip>
        <Divider type="vertical" />
        <Tooltip title="有序列表">
          <Button
            size="small"
            type={editor.isActive('orderedList') ? 'primary' : 'default'}
            icon={<OrderedListOutlined />}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          />
        </Tooltip>
        <Tooltip title="无序列表">
          <Button
            size="small"
            type={editor.isActive('bulletList') ? 'primary' : 'default'}
            icon={<UnorderedListOutlined />}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />
        </Tooltip>
        <Divider type="vertical" />
        <Tooltip title="左对齐">
          <Button
            size="small"
            type={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'default'}
            icon={<AlignLeftOutlined />}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
          />
        </Tooltip>
        <Tooltip title="居中">
          <Button
            size="small"
            type={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'default'}
            icon={<AlignCenterOutlined />}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
          />
        </Tooltip>
        <Tooltip title="右对齐">
          <Button
            size="small"
            type={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'default'}
            icon={<AlignRightOutlined />}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
          />
        </Tooltip>
        <Divider type="vertical" />
        <Tooltip title="链接">
          <Button size="small" icon={<LinkOutlined />} onClick={setLink} />
        </Tooltip>
        <Tooltip title="图片">
          <Button size="small" icon={<PictureOutlined />} onClick={addImage} />
        </Tooltip>
      </Space>
    </div>
  );
};

const RichTextEditor = ({ value, onChange, placeholder = '请输入内容...' }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  return (
    <div className="rich-text-editor">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="editor-content" placeholder={placeholder} />
    </div>
  );
};

export default RichTextEditor;
