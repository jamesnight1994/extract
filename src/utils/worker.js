import { env, pipeline } from '@xenova/transformers';

/* eslint-disable no-unused-vars */


class DetectionPipeline {
    static task = 'document-question-answering';
    static model = 'Xenova/donut-base-finetuned-docvqa';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            env.allowLocalModels = false;
            this.instance = pipeline(this.task, this.model, { progress_callback });
        }

        return this.instance;
    }

}

/* eslint-enable no-unused-vars */


/* eslint-disable-line no-restricted-globals */
// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
    // Retrieve the translation pipeline. When called for the first time,
    // this will load the pipeline and save it for future use.
    let detector = await DetectionPipeline.getInstance(x => {
        // We also add a progress callback to the pipeline so that we can
        // track model loading.
        self.postMessage(x);
    });

    // Actually perform the translation
    let output = await detector('What is the invoice number',event.data);

    // Send the output back to the main thread
    self.postMessage({
        status: 'complete',
        output: output,
    });
});

/* eslint-disable-line no-restricted-globals */