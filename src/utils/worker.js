import { Pipeline, env, pipeline } from '@xenova/transformers';

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

    try {

        const output = await detector(event.data.src, "What is the invoice number?");
        console.log(output)
    } catch (error) {
        console.log(e)
    }

    // Send the output back to the main thread
    self.postMessage({
        status: 'complete'
    });
});

/* eslint-disable-line no-restricted-globals */