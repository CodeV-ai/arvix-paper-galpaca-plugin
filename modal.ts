import { App, Modal, Setting } from "obsidian";

export class InsertLinkModal extends Modal {
  linkText: string;
  linkUrl: string;
  summaryPromise: Promise<string>;

  onSubmit: (linkText: string, linkUrl: string, summaryPromise: Promise<string>) => void;

  constructor(
    app: App,
    defaultLinkText: string,
    onSubmit: (linkText: string, linkUrl: string, summaryPromise: Promise<string>) => void
  ) {
    super(app);
    this.linkText = defaultLinkText;
    this.onSubmit = onSubmit;
  }

  async onOpen() {
    const { contentEl } = this;

    contentEl.createEl("h1", { text: "Insert link" });

    new Setting(contentEl).setName("Link text").addText((text) =>
      text.setValue(this.linkText).onChange((value) => {
        this.linkText = value;
      })
    );

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
          const summaryPromise = Promise.resolve(summaryResult);
          this.onSubmit(this.linkText, this.linkUrl, summaryPromise);
        })
    );
  }

  onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }

  async fetchAndSummarizePapers() {
    const serverUrl = "https://api.semanticscholar.org/v1/paper/arXiv";
    let arxivId = "1805.12345";

    try {
      const response = await fetch(`${serverUrl}:${arxivId}`);
      const summary = await response.text();
      console.log(summary);
      return summary;
    } catch (error) {
      console.error("Failed to fetch or summarize paper:", error);
      return "";
    }
  }
}
