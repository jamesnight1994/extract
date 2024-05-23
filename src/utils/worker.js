import { Pipeline, env, pipeline } from '@xenova/transformers';

/* eslint-disable no-unused-vars */


class ImageQAPipeline {
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
    const { type } = event.data;

    if (type === 'ask') {
        // Retrieve the translation pipeline. When called for the first time,
        // this will load the pipeline and save it for future use.
        const qa = await ImageQAPipeline.getInstance(x => {
            // We also add a progress callback to the pipeline so that we can
            // track model loading.
            self.postMessage(x);
        });

        // ask question about the document
        try {
            const { imageSrc, question } = event.data;

            // ask question about the image
            const response = await qa(imageSrc, question);

            console.log(response);

            // Send the output back to the main thread
            self.postMessage({
                status: 'complete',
                response: response[0].answer
            });

        } catch (error) {
            console.error(error);
        }

    } else {
        
    }


});

/* eslint-disable-line no-restricted-globals */