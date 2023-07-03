import { Plugin } from 'obsidian';

class PaperSummarizationPlugin extends Plugin {
    async onload() {
        this.addCommand({
            id: 'fetch-and-summarize-papers',
            name: 'Fetch and Summarize Papers',
            callback: () => this.fetchAndSummarizePapers(['1805.12345', '1907.54321', '2101.98765']),
        });
    }

    async fetchAndSummarizePapers(arxivIds: string[]) {
        const serverUrl = 'https://api.semanticscholar.org/v1/paper/arXiv';
        for (const arxivId of arxivIds) {
            try {
                const response = await fetch(`${serverUrl}:${arxivId}`);
                const summary = await response.text();

                console.log(summary);
            } catch (error) {
                console.error('Failed to fetch or summarize paper:', error);
            }
        }
    }
}

export default PaperSummarizationPlugin;
