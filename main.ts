import { App, Editor, Plugin } from 'obsidian';
import { InsertLinkModal } from './modal';

class PaperSummarizationPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: 'insert-link',
      name: 'Insert link',
      editorCallback: (editor: Editor) => {
        const onSubmit = (url: string, summary: string) => {
          editor.replaceSelection(`[${url}](${url})\n${summary}`);
        };

        new InsertLinkModal(this.app, onSubmit).open();
      },
    });
  }
}

export default PaperSummarizationPlugin;
