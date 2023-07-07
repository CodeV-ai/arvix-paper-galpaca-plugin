import { App, Editor, Modal, Plugin } from 'obsidian';
import { InsertLinkModal } from './modal';

class PaperSummarizationPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: 'insert-link',
      name: 'Insert link',
      editorCallback: (editor: Editor) => {
        const selectedText = editor.getSelection();

        const onSubmit = async (text: string, url: string, summary: string | Promise<string>) => {
          const summaryResult = await Promise.resolve(summary);
          editor.replaceSelection(`[${text}](${url})\n[${summaryResult}]`);
        };

        new InsertLinkModal(this.app, selectedText, onSubmit).open();
      },
    });
  }
}

export default PaperSummarizationPlugin;
