import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Box, Text } from '@radix-ui/themes'

type RichTextEditorProps = {
	value: string
	onChange: (value: string) => void
	placeholder?: string
	height?: string
	label?: string
	error?: string
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
	value,
	onChange,
	placeholder = 'Enter content...',
	height = '200px',
	label,
	error,
}) => {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: {
					levels: [1, 2, 3],
				},
			}),
			Placeholder.configure({
				placeholder,
			}),
		],
		content: value,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML())
		},
	})

	// Update editor content when value prop changes
	React.useEffect(() => {
		if (editor && value !== editor.getHTML()) {
			editor.commands.setContent(value)
		}
	}, [value, editor])

	if (!editor) {
		return null
	}

	return (
		<Box>
			{label && (
				<Text
					size="2"
					weight="medium"
					style={{ color: 'var(--accent-12)', marginBottom: '8px', display: 'block' }}
				>
					{label}
				</Text>
			)}
			<Box
				style={{
					backgroundColor: 'var(--color-panel)',
					borderRadius: '6px',
					border: error ? '1px solid var(--red-9)' : '1px solid var(--accent-6)',
					minHeight: height,
				}}
			>
				{/* Toolbar */}
				<Box
					style={{
						borderBottom: '1px solid var(--accent-6)',
						padding: '8px',
						display: 'flex',
						gap: '4px',
						flexWrap: 'wrap',
					}}
				>
					<button
						type="button"
						onClick={() => editor.chain().focus().toggleBold().run()}
						disabled={!editor.can().chain().focus().toggleBold().run()}
						className={editor.isActive('bold') ? 'is-active' : ''}
						style={{
							padding: '4px 8px',
							borderRadius: '4px',
							border: '1px solid var(--accent-6)',
							backgroundColor: editor.isActive('bold')
								? 'var(--accent-5)'
								: 'transparent',
							cursor: 'pointer',
						}}
					>
						<Text size="1" weight="bold">
							B
						</Text>
					</button>
					<button
						type="button"
						onClick={() => editor.chain().focus().toggleItalic().run()}
						disabled={!editor.can().chain().focus().toggleItalic().run()}
						className={editor.isActive('italic') ? 'is-active' : ''}
						style={{
							padding: '4px 8px',
							borderRadius: '4px',
							border: '1px solid var(--accent-6)',
							backgroundColor: editor.isActive('italic')
								? 'var(--accent-5)'
								: 'transparent',
							cursor: 'pointer',
						}}
					>
						<Text size="1" style={{ fontStyle: 'italic' }}>
							I
						</Text>
					</button>
					<button
						type="button"
						onClick={() => editor.chain().focus().toggleBulletList().run()}
						className={editor.isActive('bulletList') ? 'is-active' : ''}
						style={{
							padding: '4px 8px',
							borderRadius: '4px',
							border: '1px solid var(--accent-6)',
							backgroundColor: editor.isActive('bulletList')
								? 'var(--accent-5)'
								: 'transparent',
							cursor: 'pointer',
						}}
					>
						<Text size="1">• List</Text>
					</button>
					<button
						type="button"
						onClick={() => editor.chain().focus().toggleOrderedList().run()}
						className={editor.isActive('orderedList') ? 'is-active' : ''}
						style={{
							padding: '4px 8px',
							borderRadius: '4px',
							border: '1px solid var(--accent-6)',
							backgroundColor: editor.isActive('orderedList')
								? 'var(--accent-5)'
								: 'transparent',
							cursor: 'pointer',
						}}
					>
						<Text size="1">1. List</Text>
					</button>
				</Box>

				{/* Editor Content */}
				<Box
					style={{
						padding: '12px',
						minHeight: `calc(${height} - 60px)`,
						maxHeight: `calc(${height} - 60px)`,
						overflowY: 'auto',
					}}
				>
					<EditorContent editor={editor} />
				</Box>
			</Box>
			{error && (
				<Text size="1" style={{ color: 'var(--red-9)', marginTop: '4px' }}>
					{error}
				</Text>
			)}
			<style>
				{`
          .tiptap {
            outline: none;
            color: var(--accent-12);
          }
          .tiptap p.is-editor-empty:first-child::before {
            color: var(--accent-9);
            content: attr(data-placeholder);
            float: left;
            height: 0;
            pointer-events: none;
          }
          .tiptap ul, .tiptap ol {
            padding-left: 20px;
          }
        `}
			</style>
		</Box>
	)
}

export default RichTextEditor