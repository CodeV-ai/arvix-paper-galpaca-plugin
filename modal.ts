import { App, Modal, Setting } from "obsidian";

export class InsertLinkModal extends Modal {
  linkUrl: string = '';
  summaryPromise: Promise<string>;

  onSubmit: (linkUrl: string, summary: string) => void;

  constructor(
    app: App,
    onSubmit: (linkUrl: string, summary: string) => void
  ) {
    super(app);
    this.onSubmit = onSubmit;
  }

  async onOpen() {
    const { contentEl } = this;

    contentEl.createEl("h1", { text: "Insert link" });

    new Setting(contentEl).setName("Link URL").addText((text) =>
      text.setValue(this.linkUrl).onChange((value) => {
        this.linkUrl = value;
      })
    );

    this.summaryPromise = this.fetchAndSummarizePapers();

    new Setting(contentEl).addButton((btn) =>
      btn
        .setButtonText("Insert")
        .setCta()
        .onClick(async () => {
          this.close();
          const summaryResult = await this.summaryPromise;
          this.onSubmit(this.linkUrl, summaryResult);
        })
    );
  }

  onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }

  async fetchAndSummarizePapers() {
      const serverUrl = "http://127.0.0.1:5000/summarize";

      try {
          const response = await fetch(serverUrl, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  url: this.linkUrl,
              }),
          });

          const result = await response.json();
          console.log('result', result)
          const keyphrasesArray = [].concat(...result.keyphrases);

          return keyphrasesArray.join('\n');
      } catch (error) {
          console.error("Failed to fetch or summarize paper:", error);
          return "Error fetching summary.";
      }
  }

}
